import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScanText,
  Upload,
  Camera,
  Copy,
  Download,
  RotateCw,
  RefreshCw,
  Sparkles,
  Trash2,
  Sliders,
  AlertCircle,
  Globe,
  Wand2,
  Play,
  Square,
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { useToast } from '../../../context/ToastContext';
import { useClipboard } from '../../../hooks/useClipboard';

const OCR_LANGUAGES = [
  { code: 'eng', label: 'English' },
  { code: 'khm', label: 'Khmer (ភាសាខ្មែរ)' },
  { code: 'fra', label: 'French (Français)' },
  { code: 'spa', label: 'Spanish (Español)' },
  { code: 'deu', label: 'German (Deutsch)' },
  { code: 'chi_sim', label: 'Chinese Simplified' },
  { code: 'jpn', label: 'Japanese (日本語)' },
  { code: 'kor', label: 'Korean (한국어)' },
  { code: 'tha', label: 'Thai (ไทย)' },
  { code: 'vie', label: 'Vietnamese (Tiếng Việt)' },
];

function createSampleNoteImage(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 760;
  canvas.height = 440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 760, 440);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(28, 28, 704, 384);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 704, 384);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('Meeting Action Items - Q4 Launch', 60, 92);

  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#1e293b';
  const lines = [
    '1. Finalize mobile homepage copy by Friday 5:00 PM',
    '2. Share updated budget sheet with finance team',
    '3. Order 50 event badges & welcome banners',
    '4. Contact: hello@vortexerotool.com | +1 (555) 234-8910',
  ];
  lines.forEach((line, i) => {
    ctx.fillText(line, 60, 160 + i * 54);
  });

  return canvas.toDataURL('image/png');
}

export const ImageToTextOcr: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('eng');
  const [extractedText, setExtractedText] = useState<string>('');
  const [confidence, setConfidence] = useState<number | null>(null);

  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [invertColors, setInvertColors] = useState<boolean>(false);
  const [boostContrast, setBoostContrast] = useState<boolean>(true);
  const [upscale2x, setUpscale2x] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusLabel, setStatusLabel] = useState<string>('');
  const [ocrError, setOcrError] = useState<string | null>(null);

  // Camera
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [camError, setCamError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { addToast } = useToast();
  const { copyToClipboard } = useClipboard();

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

  const preprocessImage = useCallback(
    async (src: string, rot: 0 | 90 | 180 | 270): Promise<HTMLCanvasElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const scale = upscale2x && Math.max(img.naturalWidth, img.naturalHeight) < 1600 ? 2 : 1;
          const sw = img.naturalWidth * scale;
          const sh = img.naturalHeight * scale;
          const swap = rot === 90 || rot === 270;
          const cw = swap ? sh : sw;
          const ch = swap ? sw : sh;

          const canvas = document.createElement('canvas');
          canvas.width = cw;
          canvas.height = ch;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }

          ctx.save();
          ctx.translate(cw / 2, ch / 2);
          ctx.rotate((rot * Math.PI) / 180);
          ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
          ctx.restore();

          if (invertColors || boostContrast) {
            const imgData = ctx.getImageData(0, 0, cw, ch);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              let r = d[i];
              let g = d[i + 1];
              let b = d[i + 2];
              if (invertColors) {
                r = 255 - r;
                g = 255 - g;
                b = 255 - b;
              }
              if (boostContrast) {
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                const val = Math.max(0, Math.min(255, (lum - 128) * 1.35 + 128));
                r = g = b = val;
              }
              d[i] = r;
              d[i + 1] = g;
              d[i + 2] = b;
            }
            ctx.putImageData(imgData, 0, 0);
          }

          resolve(canvas);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
      });
    },
    [boostContrast, invertColors, upscale2x]
  );

  const runOcr = useCallback(
    async (src: string, lang = language, rot = rotation) => {
      setIsProcessing(true);
      setProgress(5);
      setStatusLabel('Preparing image...');
      setOcrError(null);

      let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
      try {
        const canvas = await preprocessImage(src, rot);
        setStatusLabel(`Loading ${lang.toUpperCase()} OCR language model...`);
        setProgress(15);

        worker = await createWorker(lang, 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setStatusLabel('Extracting text from image...');
              setProgress(Math.max(25, Math.min(98, Math.round(m.progress * 100))));
            } else if (m.status) {
              setStatusLabel(m.status);
            }
          },
        });

        const { data } = await worker.recognize(canvas);
        const text = (data.text || '').trim();
        setExtractedText(text);
        setConfidence(typeof data.confidence === 'number' ? Math.round(data.confidence) : null);

        if (text) {
          addToast('Text extracted successfully!', `${text.split(/\s+/).filter(Boolean).length} words recognized`, 'success');
        } else {
          setOcrError('No text was detected. Try rotating the image or toggling Invert / Contrast.');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'OCR initialization failed.';
        setOcrError(`OCR Notice: ${msg}`);
        addToast('Failed to extract text', 'error');
      } finally {
        if (worker) {
          try {
            await worker.terminate();
          } catch {
            // ignore
          }
        }
        setIsProcessing(false);
        setProgress(0);
        setStatusLabel('');
      }
    },
    [addToast, language, preprocessImage, rotation]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        addToast('Please select a valid image file', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setImageUrl(url);
        setRotation(0);
        runOcr(url, language, 0);
      };
      reader.readAsDataURL(file);
    },
    [addToast, language, runOcr]
  );

  // Ctrl+V paste support
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const f = item.getAsFile();
          if (f) {
            handleFile(f);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFile]);

  const startCamera = async () => {
    setCamError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('Camera access is not available in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 40);
    } catch (err: unknown) {
      setCamError(err instanceof Error ? err.message : 'Camera permission denied.');
    }
  };

  const snapPhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const c = document.createElement('canvas');
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    stopCamera();
    const url = c.toDataURL('image/png');
    setImageUrl(url);
    setRotation(0);
    runOcr(url, language, 0);
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Action Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20">
            <Upload size={15} />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              className="hidden"
            />
          </label>

          <button
            onClick={showCamera ? stopCamera : startCamera}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Camera size={15} className="text-amber-500" />
            <span>{showCamera ? 'Close Camera' : 'Camera Snap'}</span>
          </button>

          <button
            disabled={isProcessing}
            onClick={() => {
              const url = createSampleNoteImage();
              setImageUrl(url);
              setRotation(0);
              runOcr(url, language, 0);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/25 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={14} />
            <span>Try Sample Notes Photo</span>
          </button>
        </div>

        {/* Language Picker */}
        <div className="flex items-center gap-2 text-xs">
          <Globe size={15} className="text-slate-400" />
          <span className="font-semibold text-slate-500 dark:text-slate-400">Language:</span>
          <select
            value={language}
            disabled={isProcessing}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
          >
            {OCR_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camera Panel */}
      {showCamera && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 shadow-lg space-y-4">
          {camError ? (
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{camError}</span>
            </div>
          ) : (
            <div className="max-w-xl mx-auto rounded-2xl overflow-hidden bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />
              <div className="p-3 bg-slate-950/80 flex justify-center gap-3">
                <button
                  onClick={snapPhoto}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <Play size={14} />
                  <span>Snap & Extract Text</span>
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

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Image & Enhancement Controls (5/12) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ScanText size={17} className="text-amber-500" />
              Source Image
            </h2>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Ctrl+V Paste Ready
            </span>
          </div>

          {!imageUrl ? (
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              className="flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 bg-slate-50/70 dark:bg-slate-950/60 cursor-pointer transition-all text-center"
            >
              <Upload size={36} className="text-amber-500 mb-3" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Drop screenshot, book page, or receipt
              </span>
              <span className="text-xs text-slate-400 mt-1">
                100% client-side text extraction (PNG, JPG, WebP)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-center p-3 overflow-hidden">
                <img
                  src={imageUrl}
                  alt="OCR Source"
                  style={{ transform: `rotate(${rotation}deg)` }}
                  className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-200"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sliders size={12} />
                    Preprocessing
                  </span>
                  <button
                    onClick={() => setRotation((r) => (((r + 90) % 360) as 0 | 90 | 180 | 270))}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw size={12} />
                    Rotate ({rotation}°)
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={boostContrast}
                      onChange={(e) => setBoostContrast(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>High-Contrast Gray</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invertColors}
                      onChange={(e) => setInvertColors(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Invert (Dark UI)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={upscale2x}
                      onChange={(e) => setUpscale2x(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>2x Upscale</span>
                  </label>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={() => runOcr(imageUrl, language, rotation)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-60 cursor-pointer"
              >
                {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <ScanText size={15} />}
                <span>{isProcessing ? 'Extracting Text...' : 'Re-Run OCR Scan'}</span>
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono font-bold text-amber-500">
                <span className="truncate">{statusLabel}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {ocrError && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{ocrError}</span>
            </div>
          )}
        </div>

        {/* Right: Editable Extracted Text Output (7/12) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Extracted Editable Text</h3>
              {confidence !== null && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  {confidence}% Confidence
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <textarea
            rows={13}
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="Upload or paste any image with text — extracted editable text will appear here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                disabled={!extractedText}
                onClick={() =>
                  setExtractedText((t) =>
                    t
                      .split(/\r?\n/)
                      .map((l) => l.trim())
                      .filter(Boolean)
                      .join('\n')
                  )
                }
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <Wand2 size={13} className="text-amber-500" />
                <span>Remove Blank Lines</span>
              </button>

              <button
                disabled={!extractedText}
                onClick={() => setExtractedText((t) => t.replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim())}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
              >
                Join Into Paragraph
              </button>

              <button
                disabled={!extractedText}
                onClick={() => {
                  setExtractedText('');
                  setConfidence(null);
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-rose-500 text-xs font-semibold text-slate-500 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={13} />
                Clear
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={!extractedText}
                onClick={handleDownloadTxt}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <Download size={14} />
                <span>.TXT</span>
              </button>

              <button
                disabled={!extractedText}
                onClick={() => copyToClipboard(extractedText, 'Extracted text copied!')}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-40 cursor-pointer"
              >
                <Copy size={14} />
                <span>Copy All Text</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
