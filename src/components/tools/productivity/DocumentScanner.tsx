import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScanLine,
  Upload,
  Camera,
  Download,
  RotateCw,
  Trash2,
  Plus,
  Layers,
  Sliders,
  Sparkles,
  FileUp,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Play,
  Square,
  AlertCircle,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useToast } from '../../../context/ToastContext';
import {
  Point2D,
  DocScanFilter,
  estimateOutputDimensions,
  warpAndFilterDocumentPixels,
} from '../../../utils/everydayUtils';

interface ScannedPage {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
  label: string;
}

const FILTER_OPTIONS: { id: DocScanFilter; label: string; desc: string }[] = [
  { id: 'magic', label: 'Magic Color', desc: 'Brightens paper while keeping vivid ink' },
  { id: 'bw', label: 'Crisp B&W', desc: 'Adaptive threshold removes shadows' },
  { id: 'whiteboard', label: 'Whiteboard', desc: 'Clean white background with colored markers' },
  { id: 'grayscale', label: 'Grayscale', desc: 'High-contrast monochrome print look' },
  { id: 'original', label: 'Original', desc: 'Perspective crop only' },
];

/**
 * Generates a realistic skewed receipt/document image for instant demoing.
 */
function createSampleSkewedDocument(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 560;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Desk wood/slate backdrop
  const bg = ctx.createLinearGradient(0, 0, 720, 560);
  bg.addColorStop(0, '#334155');
  bg.addColorStop(1, '#1e293b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 720, 560);

  // Skewed receipt paper polygon
  ctx.save();
  ctx.translate(360, 280);
  ctx.rotate(-0.11);
  ctx.transform(1, 0.05, -0.08, 1, 0, 0);

  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-190, -220, 380, 440);
  ctx.shadowBlur = 0;

  // Subtle shadow vignette across paper to prove B&W adaptive threshold works!
  const paperShade = ctx.createLinearGradient(-190, -220, 190, 220);
  paperShade.addColorStop(0, 'rgba(255,255,255,0)');
  paperShade.addColorStop(1, 'rgba(148,163,184,0.35)');
  ctx.fillStyle = paperShade;
  ctx.fillRect(-190, -220, 380, 440);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VORTEXERO MARKET', 0, -170);

  ctx.font = '14px monospace';
  ctx.fillStyle = '#334155';
  ctx.fillText('Receipt #2026-0842  •  100% Client Scan', 0, -142);

  ctx.strokeStyle = '#94a3b8';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(-155, -120);
  ctx.lineTo(155, -120);
  ctx.stroke();
  ctx.setLineDash([]);

  const rows = [
    ['Organic Coffee Beans', '$14.50'],
    ['Artisan Sourdough', '$6.25'],
    ['Fresh Avocados (x3)', '$5.40'],
    ['Almond Milk 1L', '$4.15'],
    ['Dark Chocolate 70%', '$3.90'],
  ];
  ctx.textAlign = 'left';
  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = '#0f172a';
  rows.forEach(([item, price], idx) => {
    const y = -80 + idx * 36;
    ctx.fillText(item, -155, y);
    ctx.textAlign = 'right';
    ctx.fillText(price, 155, y);
    ctx.textAlign = 'left';
  });

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-155, 115);
  ctx.lineTo(155, 115);
  ctx.stroke();

  ctx.font = 'bold 20px monospace';
  ctx.fillText('TOTAL PAID', -155, 155);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#0f766e';
  ctx.fillText('$34.20', 155, 155);

  ctx.restore();
  return canvas.toDataURL('image/png');
}

export const DocumentScanner: React.FC = () => {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [srcDims, setSrcDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [srcPixels, setSrcPixels] = useState<ImageData | null>(null);

  // Normalized 0..1 quad corners: [TopLeft, TopRight, BottomRight, BottomLeft]
  const [corners, setCorners] = useState<[Point2D, Point2D, Point2D, Point2D]>([
    { x: 0.1, y: 0.1 },
    { x: 0.9, y: 0.1 },
    { x: 0.9, y: 0.9 },
    { x: 0.1, y: 0.9 },
  ]);
  const [activeCornerIdx, setActiveCornerIdx] = useState<number | null>(null);

  const [filter, setFilter] = useState<DocScanFilter>('magic');
  const [brightness, setBrightness] = useState<number>(6);
  const [contrast, setContrast] = useState<number>(1.08);
  const [rotationDeg, setRotationDeg] = useState<0 | 90 | 180 | 270>(0);

  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Camera states
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cropStageRef = useRef<HTMLDivElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const { addToast } = useToast();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Load source image pixels into offscreen buffer (scaled <= 1400px for instant responsive warp)
  const loadSourceImage = useCallback(
    (dataUrl: string, presetCorners?: [Point2D, Point2D, Point2D, Point2D]) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(64, Math.round(img.naturalWidth * scale));
        const h = Math.max(64, Math.round(img.naturalHeight * scale));

        const off = document.createElement('canvas');
        off.width = w;
        off.height = h;
        const ctx = off.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);

        setSrcPixels(ctx.getImageData(0, 0, w, h));
        setSrcDims({ w, h });
        setSourceUrl(off.toDataURL('image/png'));
        setRotationDeg(0);
        setCorners(
          presetCorners || [
            { x: 0.08, y: 0.08 },
            { x: 0.92, y: 0.08 },
            { x: 0.92, y: 0.92 },
            { x: 0.08, y: 0.92 },
          ]
        );
      };
      img.src = dataUrl;
    },
    []
  );

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (JPG, PNG, WebP)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => loadSourceImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Global paste support
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const f = item.getAsFile();
          if (f) {
            handleFileChange(f);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  });

  // Render perspective-warped & filtered scan preview whenever corners/filter/rotation change
  useEffect(() => {
    if (!srcPixels || !outputCanvasRef.current || srcDims.w === 0) return;

    const absCorners: [Point2D, Point2D, Point2D, Point2D] = [
      { x: corners[0].x * srcDims.w, y: corners[0].y * srcDims.h },
      { x: corners[1].x * srcDims.w, y: corners[1].y * srcDims.h },
      { x: corners[2].x * srcDims.w, y: corners[2].y * srcDims.h },
      { x: corners[3].x * srcDims.w, y: corners[3].y * srcDims.h },
    ];

    const { width: warpW, height: warpH } = estimateOutputDimensions(absCorners, 960);
    const warpedBytes = warpAndFilterDocumentPixels(
      srcPixels.data,
      srcDims.w,
      srcDims.h,
      absCorners,
      warpW,
      warpH,
      filter,
      brightness,
      contrast
    );

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = warpW;
    tempCanvas.height = warpH;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.putImageData(new ImageData(new Uint8ClampedArray(warpedBytes), warpW, warpH), 0, 0);

    const outCanvas = outputCanvasRef.current;
    const swap = rotationDeg === 90 || rotationDeg === 270;
    outCanvas.width = swap ? warpH : warpW;
    outCanvas.height = swap ? warpW : warpH;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return;

    outCtx.save();
    outCtx.translate(outCanvas.width / 2, outCanvas.height / 2);
    outCtx.rotate((rotationDeg * Math.PI) / 180);
    outCtx.drawImage(tempCanvas, -warpW / 2, -warpH / 2);
    outCtx.restore();
  }, [srcPixels, srcDims, corners, filter, brightness, contrast, rotationDeg]);

  // Dragging 4-corner handles
  const updateCornerFromPointer = (clientX: number, clientY: number) => {
    if (activeCornerIdx === null || !cropStageRef.current) return;
    const rect = cropStageRef.current.getBoundingClientRect();
    const nx = Math.max(0.01, Math.min(0.99, (clientX - rect.left) / rect.width));
    const ny = Math.max(0.01, Math.min(0.99, (clientY - rect.top) / rect.height));
    setCorners((prev) => {
      const next = [...prev] as [Point2D, Point2D, Point2D, Point2D];
      next[activeCornerIdx] = { x: nx, y: ny };
      return next;
    });
  };

  const handleLoadSampleReceipt = () => {
    const sampleUrl = createSampleSkewedDocument();
    // Pre-place corners near the skewed receipt bounds so user sees perspective straightening immediately!
    loadSourceImage(sampleUrl, [
      { x: 0.21, y: 0.14 },
      { x: 0.72, y: 0.08 },
      { x: 0.78, y: 0.85 },
      { x: 0.28, y: 0.91 },
    ]);
    addToast('Sample skewed receipt loaded!', 'Drag corners or adjust scan filter.', 'info');
  };

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera not available in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1600 }, height: { ideal: 1200 } },
      });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 40);
    } catch (err: unknown) {
      setCameraError(err instanceof Error ? err.message : 'Camera permission denied.');
    }
  };

  const snapCameraPhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const c = document.createElement('canvas');
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    stopCamera();
    loadSourceImage(c.toDataURL('image/png'));
  };

  const handleAddPageToDeck = () => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setPages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        dataUrl,
        width: canvas.width,
        height: canvas.height,
        label: `Scanned Page ${prev.length + 1}`,
      },
    ]);
    addToast('Page added to PDF scan stack!', 'success');
  };

  const handleDownloadCurrentPng = () => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `vortexero-scan-${Date.now()}.png`;
    a.click();
    addToast('Scanned PNG downloaded!', 'success');
  };

  const handleExportPdf = async () => {
    const exportList: ScannedPage[] =
      pages.length > 0
        ? pages
        : outputCanvasRef.current
        ? [
            {
              id: 'current',
              dataUrl: outputCanvasRef.current.toDataURL('image/png'),
              width: outputCanvasRef.current.width,
              height: outputCanvasRef.current.height,
              label: 'Scanned Document',
            },
          ]
        : [];

    if (exportList.length === 0) {
      addToast('Scan a document first before exporting PDF', 'error');
      return;
    }

    setIsExportingPdf(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const p of exportList) {
        const res = await fetch(p.dataUrl);
        const bytes = await res.arrayBuffer();
        const embeddedImg = await pdfDoc.embedPng(bytes);
        // Standard A4 points: 595.28 x 841.89
        const isLandscape = embeddedImg.width > embeddedImg.height;
        const pageW = isLandscape ? 841.89 : 595.28;
        const pageH = isLandscape ? 595.28 : 841.89;
        const margin = 24;
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2;
        const scale = Math.min(availW / embeddedImg.width, availH / embeddedImg.height);
        const drawW = embeddedImg.width * scale;
        const drawH = embeddedImg.height * scale;

        const page = pdfDoc.addPage([pageW, pageH]);
        page.drawImage(embeddedImg, {
          x: (pageW - drawW) / 2,
          y: (pageH - drawH) / 2,
          width: drawW,
          height: drawH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vortexero-scanned-doc-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      addToast(`Exported ${exportList.length}-page PDF document!`, 'success');
    } catch (err) {
      console.error('PDF export failed:', err);
      addToast('Failed to export PDF', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const movePage = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= pages.length) return;
    const copy = [...pages];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setPages(copy);
  };

  const cornerLabels = ['TL', 'TR', 'BR', 'BL'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Action Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20">
            <Upload size={15} />
            <span>Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileChange(f);
              }}
              className="hidden"
            />
          </label>

          <button
            onClick={showCamera ? stopCamera : startCamera}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Camera size={15} className="text-cyan-500" />
            <span>{showCamera ? 'Close Camera' : 'Camera Snap'}</span>
          </button>

          <button
            onClick={handleLoadSampleReceipt}
            className="px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Try Skewed Sample Receipt</span>
          </button>
        </div>

        <button
          disabled={isExportingPdf || (!sourceUrl && pages.length === 0)}
          onClick={handleExportPdf}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
        >
          <FileUp size={15} />
          <span>
            {isExportingPdf
              ? 'Creating PDF...'
              : pages.length > 0
              ? `Export ${pages.length}-Page PDF`
              : 'Save Scan as PDF'}
          </span>
        </button>
      </div>

      {/* Camera Overlay Panel */}
      {showCamera && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-cyan-500/30 shadow-lg space-y-4">
          {cameraError ? (
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{cameraError}</span>
            </div>
          ) : (
            <div className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />
              <div className="p-3 bg-slate-950/80 flex justify-center gap-3">
                <button
                  onClick={snapCameraPhoto}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Play size={14} />
                  <span>Capture Document Photo</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Square size={13} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Dropzone when empty */}
      {!sourceUrl && (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFileChange(f);
          }}
          className="flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-white dark:bg-slate-900 cursor-pointer transition-all text-center shadow-sm"
        >
          <ScanLine size={42} className="text-cyan-500 mb-3" />
          <span className="text-base font-bold text-slate-800 dark:text-slate-100">
            Drop a photo of a document, receipt, ID, or whiteboard (or Ctrl+V)
          </span>
          <span className="text-xs text-slate-400 mt-1 max-w-md">
            Straighten skewed 4-corner perspectives, remove shadows, apply crisp B&W or Magic Color filters, and export multi-page PDFs 100% locally.
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileChange(f);
            }}
            className="hidden"
          />
        </label>
      )}

      {/* Main Perspective Crop + Live Result Split */}
      {sourceUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 4-Corner Perspective Cropper (6/12) */}
          <div className="lg:col-span-6 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Maximize2 size={16} className="text-cyan-500" />
                <span>1. Drag 4 Corners to Flatten Perspective</span>
              </h3>
              <button
                onClick={() =>
                  setCorners([
                    { x: 0.04, y: 0.04 },
                    { x: 0.96, y: 0.04 },
                    { x: 0.96, y: 0.96 },
                    { x: 0.04, y: 0.96 },
                  ])
                }
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Full Frame
              </button>
            </div>

            <div
              ref={cropStageRef}
              onPointerMove={(e) => updateCornerFromPointer(e.clientX, e.clientY)}
              onPointerUp={() => setActiveCornerIdx(null)}
              onPointerLeave={() => setActiveCornerIdx(null)}
              className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 select-none touch-none"
            >
              <img src={sourceUrl} alt="Original Document" draggable={false} className="w-full h-auto block pointer-events-none" />

              {/* Quad Polygon SVG Overlay */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                <polygon
                  points={corners.map((c) => `${c.x * 100},${c.y * 100}`).join(' ')}
                  fill="rgba(6, 182, 212, 0.14)"
                  stroke="#06b6d4"
                  strokeWidth="0.6"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Draggable Corner Handles */}
              {corners.map((pt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
                    setActiveCornerIdx(idx);
                  }}
                  style={{ left: `${pt.x * 100}%`, top: `${pt.y * 100}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[9px] font-black transition-transform cursor-grab active:cursor-grabbing ${
                    activeCornerIdx === idx ? 'bg-amber-500 text-white scale-125' : 'bg-cyan-500 text-white hover:scale-110'
                  }`}
                >
                  {cornerLabels[idx]}
                </button>
              ))}
            </div>

            {/* Filter Presets & Fine Tuning */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Sliders size={13} />
                <span>2. Scan Enhancement Filter</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFilter(opt.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      filter === opt.id
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/40'
                    }`}
                  >
                    <span className="text-xs font-bold block">{opt.label}</span>
                    <span className={`text-[10px] block truncate ${filter === opt.id ? 'text-cyan-100' : 'text-slate-400'}`}>
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-slate-500">Brightness</span>
                    <span className="font-mono">{brightness > 0 ? `+${brightness}` : brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-slate-500">Contrast</span>
                    <span className="font-mono">{contrast.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.8"
                    step="0.05"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Straightened Output Preview + Multi-Page Stack (6/12) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-cyan-500/30 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Straightened Scan Output</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRotationDeg((r) => (((r + 90) % 360) as 0 | 90 | 180 | 270))}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw size={13} />
                    <span>Rotate 90°</span>
                  </button>
                  <button
                    onClick={handleDownloadCurrentPng}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>PNG</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 p-3 flex items-center justify-center min-h-[300px] max-h-[460px] overflow-hidden">
                <canvas ref={outputCanvasRef} className="max-w-full max-h-[430px] object-contain rounded-lg shadow-md" />
              </div>

              <button
                onClick={handleAddPageToDeck}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Page to Multi-Page PDF Stack ({pages.length} saved)</span>
              </button>
            </div>

            {/* Saved Multi-Page PDF Stack */}
            {pages.length > 0 && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers size={14} className="text-cyan-500" />
                    PDF Page Stack ({pages.length})
                  </h4>
                  <button
                    onClick={() => setPages([])}
                    className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
                  >
                    Clear Stack
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {pages.map((p, idx) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.dataUrl} alt={p.label} className="w-10 h-12 object-cover rounded-lg border border-slate-300 dark:border-slate-700" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            Page {idx + 1}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            {p.width} × {p.height} px
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => movePage(idx, 'up')}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          disabled={idx === pages.length - 1}
                          onClick={() => movePage(idx, 'down')}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          onClick={() => setPages((prev) => prev.filter((x) => x.id !== p.id))}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
