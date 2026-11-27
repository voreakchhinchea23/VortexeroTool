import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Sigma,
  Upload,
  Camera,
  PenTool,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crop,
  Sliders,
  History,
  AlertCircle,
  CheckCircle2,
  Play,
  Square,
  ScanLine,
} from 'lucide-react';
import { createWorker, PSM } from 'tesseract.js';
import { useToast } from '../../../context/ToastContext';
import { useClipboard } from '../../../hooks/useClipboard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import {
  solveMathProblem,
  normalizeMathOcr,
  sampleExpressionCurve,
  formatNum,
  MathSolution,
} from '../../../utils/mathSolver';
import {
  prepareBinaryMathImage,
  extractInkComponents,
  parse2DMathLayout,
  PolarityMode,
  CropOcrBox,
} from '../../../utils/mathOcr2d';

type InputTab = 'upload' | 'camera' | 'draw';

interface MathHistoryItem {
  id: string;
  expr: string;
  answer: string;
  label: string;
  timestamp: number;
}

const SAMPLE_PROBLEMS = [
  { id: 'linear', title: 'Linear Equation', lines: ['2x + 5 = 17'] },
  { id: 'quadratic', title: 'Quadratic Equation', lines: ['x^2 - 5x + 6 = 0'] },
  { id: 'system', title: '2x2 Linear System', lines: ['2x + y = 10', 'x - y = 2'] },
  { id: 'arithmetic', title: 'Order of Operations', lines: ['(15 + 9) * 3 - sqrt(144)'] },
  { id: 'limit', title: 'Dark Limit (2D)', lines: ['lim(x->0, (e^(2x) - 1) / x)'] },
  { id: 'rational_limit', title: 'Rational Limit (2D)', lines: ['lim(x->3, (x^2 - 9) / (x - 3))'] },
];

const QUICK_EXAMPLES = [
  '2x + 5 = 17',
  '3(x - 2) = 2x + 4',
  'x^2 - 5x + 6 = 0',
  '2x + y = 10; x - y = 2',
  'lim(x->0, (e^(2x) - 1) / x)',
  'd/dx(x^3 + 2x^2 - 5x)',
  'integrate(x^2, 0, 3)',
  '(18 + 6) * 4 / 3 + sqrt(81)',
  '15% of 240',
];

const KEYPAD_BUTTONS = [
  { label: '+', insert: ' + ' },
  { label: '-', insert: ' - ' },
  { label: '×', insert: ' * ' },
  { label: '÷', insert: ' / ' },
  { label: '=', insert: ' = ' },
  { label: 'x²', insert: '^2' },
  { label: '√', insert: 'sqrt()' },
  { label: '( )', insert: '()' },
  { label: 'x', insert: 'x' },
  { label: 'y', insert: 'y' },
  { label: 'π', insert: 'pi' },
  { label: 'sin', insert: 'sin()' },
  { label: 'cos', insert: 'cos()' },
  { label: 'log₁₀', insert: 'log10()' },
  { label: 'ln', insert: 'ln()' },
  { label: 'lim', insert: 'lim(x->0, )' },
  { label: '→', insert: '->' },
  { label: 'd/dx', insert: 'd/dx()' },
  { label: '∫', insert: 'integrate(x^2, 0, 3)' },
  { label: ';', insert: '; ' },
];

/**
 * Generates a realistic paper-photo or dark-mode textbook canvas image for sample testing.
 */
function generateSampleMathImage(sample: (typeof SAMPLE_PROBLEMS)[number]): string {
  const lines = sample.lines;
  const canvas = document.createElement('canvas');

  if (sample.id === 'limit' || sample.id === 'rational_limit') {
    canvas.width = 560;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const isDark = sample.id === 'limit';
    ctx.fillStyle = isDark ? '#202124' : '#fcfbf7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const ink = isDark ? '#e8eaed' : '#0f172a';
    ctx.fillStyle = ink;
    ctx.textBaseline = 'alphabetic';

    // Draw "lim" and subscript "x → target"
    ctx.font = '500 50px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('lim', 148, 128);

    ctx.font = '500 26px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.fillText(sample.id === 'limit' ? 'x → 0' : 'x → 3', 148, 166);

    // Draw wide fraction bar (vinculum)
    const barX = 228;
    const barY = 114;
    const barW = sample.id === 'limit' ? 210 : 185;
    ctx.fillRect(barX, barY, barW, 4);

    if (sample.id === 'limit') {
      // Numerator: e^(2x) - 1
      ctx.textAlign = 'left';
      ctx.font = 'italic 48px "Georgia", "Times New Roman", serif';
      ctx.fillText('e', 252, 92);

      ctx.font = '500 28px "Inter", "Segoe UI", Arial, sans-serif';
      ctx.fillText('2x', 284, 64);

      ctx.font = '500 44px "Inter", "Segoe UI", Arial, sans-serif';
      ctx.fillText('− 1', 332, 92);

      // Denominator: x
      ctx.textAlign = 'center';
      ctx.font = 'italic 48px "Georgia", "Times New Roman", serif';
      ctx.fillText('x', barX + barW / 2, 168);
    } else {
      // Numerator: x^2 - 9
      ctx.textAlign = 'left';
      ctx.font = 'italic 44px "Georgia", "Times New Roman", serif';
      ctx.fillText('x', 250, 92);

      ctx.font = '500 28px "Inter", "Segoe UI", Arial, sans-serif';
      ctx.fillText('2', 278, 66);

      ctx.font = '500 44px "Inter", "Segoe UI", Arial, sans-serif';
      ctx.fillText('− 9', 308, 92);

      // Denominator: x - 3
      ctx.textAlign = 'center';
      ctx.font = 'italic 44px "Georgia", "Times New Roman", serif';
      ctx.fillText('x − 3', barX + barW / 2, 168);
    }

    return canvas.toDataURL('image/png');
  }

  canvas.width = 760;
  canvas.height = lines.length > 1 ? 260 : 200;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Subtle warm paper gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#fcfbf7');
  grad.addColorStop(1, '#f3efe6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle ruled notebook lines
  ctx.strokeStyle = '#dbeafe';
  ctx.lineWidth = 1.5;
  for (let y = 48; y < canvas.height; y += 56) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 50px "JetBrains Mono", "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (lines.length === 1) {
    ctx.fillText(lines[0], canvas.width / 2, canvas.height / 2);
  } else {
    lines.forEach((line, idx) => {
      const y = 78 + idx * 82;
      ctx.fillText(line, canvas.width / 2, y);
    });
  }

  return canvas.toDataURL('image/png');
}

export const MathScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InputTab>('upload');
  const [expression, setExpression] = useState<string>('x^2 - 5x + 6 = 0');
  const [angleUnit, setAngleUnit] = useState<'rad' | 'deg'>('rad');

  // Upload & Image OCR states
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [rawOcrText, setRawOcrText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [ocrError, setOcrError] = useState<string | null>(null);

  // Preprocessing options
  const [highContrastBw, setHighContrastBw] = useState<boolean>(true);
  const [polarityMode, setPolarityMode] = useState<PolarityMode>('auto');
  const [upscale2x, setUpscale2x] = useState<boolean>(true);

  // Crop selection (normalized 0..1)
  const [cropRect, setCropRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isDraggingCrop, setIsDraggingCrop] = useState<boolean>(false);
  const cropStartRef = useRef<{ x: number; y: number } | null>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Drawing canvas states
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const [hasDrawing, setHasDrawing] = useState<boolean>(false);

  // Graph zoom & hover states
  const [plotZoom, setPlotZoom] = useState<number>(1);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);

  // History
  const [history, setHistory] = useLocalStorage<MathHistoryItem[]>('vortexero_math_history', []);

  const exprInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const { copyToClipboard } = useClipboard();

  // Live solve whenever expression or angleUnit changes
  const solution: MathSolution = useMemo(() => {
    return solveMathProblem(expression, { angleUnit });
  }, [expression, angleUnit]);

  // Reset plot zoom when problem changes
  useEffect(() => {
    setPlotZoom(1);
    setHoverPoint(null);
  }, [solution.normalizedInput]);

  // Stop camera on unmount or tab switch
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (activeTab !== 'camera') {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, stopCamera]);

  // Initialize white drawing canvas when switching to draw tab
  useEffect(() => {
    if (activeTab === 'draw' && drawCanvasRef.current) {
      const canvas = drawCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && !hasDrawing) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeTab, hasDrawing]);

  const saveToHistory = useCallback(
    (sol: MathSolution) => {
      if (sol.problemType === 'error' || !sol.normalizedInput) return;
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.expr !== sol.normalizedInput);
        return [
          {
            id: `${Date.now()}`,
            expr: sol.normalizedInput,
            answer: sol.finalAnswer,
            label: sol.problemLabel,
            timestamp: Date.now(),
          },
          ...filtered,
        ].slice(0, 10);
      });
    },
    [setHistory]
  );

  // Preprocess cropped source region into polarity-normalized grayscale & connected-component analysis
  const prepareOcrAnalysis = useCallback(
    async (src: string, customCrop: { x: number; y: number; w: number; h: number } | null) => {
      return new Promise<{
        bin: ReturnType<typeof prepareBinaryMathImage>;
        grayCanvas: HTMLCanvasElement;
        fullCanvas: HTMLCanvasElement;
      }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const sx = customCrop ? Math.max(0, Math.round(customCrop.x * img.naturalWidth)) : 0;
          const sy = customCrop ? Math.max(0, Math.round(customCrop.y * img.naturalHeight)) : 0;
          const sw = customCrop
            ? Math.min(img.naturalWidth - sx, Math.max(20, Math.round(customCrop.w * img.naturalWidth)))
            : img.naturalWidth;
          const sh = customCrop
            ? Math.min(img.naturalHeight - sy, Math.max(20, Math.round(customCrop.h * img.naturalHeight)))
            : img.naturalHeight;

          const srcCanvas = document.createElement('canvas');
          srcCanvas.width = sw;
          srcCanvas.height = sh;
          const srcCtx = srcCanvas.getContext('2d');
          if (!srcCtx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }
          srcCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
          const rawData = srcCtx.getImageData(0, 0, sw, sh);

          const bin = prepareBinaryMathImage(rawData.data, sw, sh, polarityMode);

          // Unpadded clean grayscale canvas (dark foreground on light background) for 2D sub-crops
          const grayCanvas = document.createElement('canvas');
          grayCanvas.width = sw;
          grayCanvas.height = sh;
          const grayCtx = grayCanvas.getContext('2d');
          if (!grayCtx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }
          const grayImgData = grayCtx.createImageData(sw, sh);
          for (let i = 0; i < bin.gray.length; i++) {
            const g = bin.gray[i];
            const p = i * 4;
            grayImgData.data[p] = g;
            grayImgData.data[p + 1] = g;
            grayImgData.data[p + 2] = g;
            grayImgData.data[p + 3] = 255;
          }
          grayCtx.putImageData(grayImgData, 0, 0);

          // Full upscaled white-padded canvas for fallback whole-block recognition
          const scale = upscale2x ? (Math.max(sw, sh) < 1200 ? 2 : 1) : 1;
          const pad = 32;
          const outW = sw * scale + pad * 2;
          const outH = sh * scale + pad * 2;
          const fullCanvas = previewCanvasRef.current || document.createElement('canvas');
          fullCanvas.width = outW;
          fullCanvas.height = outH;
          const fullCtx = fullCanvas.getContext('2d');
          if (!fullCtx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }
          fullCtx.fillStyle = '#ffffff';
          fullCtx.fillRect(0, 0, outW, outH);
          fullCtx.imageSmoothingEnabled = true;
          fullCtx.imageSmoothingQuality = 'high';
          fullCtx.drawImage(grayCanvas, 0, 0, sw, sh, pad, pad, sw * scale, sh * scale);

          if (highContrastBw) {
            const fData = fullCtx.getImageData(0, 0, outW, outH);
            const d = fData.data;
            for (let i = 0; i < d.length; i += 4) {
              const v = d[i] < bin.threshold ? 0 : 255;
              d[i] = d[i + 1] = d[i + 2] = v;
              d[i + 3] = 255;
            }
            fullCtx.putImageData(fData, 0, 0);
          }

          resolve({ bin, grayCanvas, fullCanvas });
        };
        img.onerror = () => reject(new Error('Failed to load image for OCR processing.'));
        img.src = src;
      });
    },
    [highContrastBw, polarityMode, upscale2x]
  );

  // Run 2D layout-aware Tesseract OCR on given image URL
  const runOcrScan = useCallback(
    async (src: string, customCrop: { x: number; y: number; w: number; h: number } | null = cropRect) => {
      setIsScanning(true);
      setScanProgress(5);
      setScanStatus('Detecting layout & contrast...');
      setOcrError(null);

      let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
      try {
        const { bin, grayCanvas, fullCanvas } = await prepareOcrAnalysis(src, customCrop);
        const comps = extractInkComponents(bin.mask, bin.width, bin.height);

        setScanStatus('Loading OCR engine...');
        setScanProgress(18);

        worker = await createWorker('eng', 1, {
          logger: (m) => {
            if (m.status === 'recognizing text' && (comps.length === 0 || comps.length > 140)) {
              setScanStatus('Recognizing mathematical symbols...');
              setScanProgress(Math.max(25, Math.min(98, Math.round(m.progress * 100))));
            } else if (m.status && m.status !== 'recognizing text') {
              setScanStatus(m.status);
            }
          },
        });

        const activeWorker = worker;
        const cropCanvas = document.createElement('canvas');
        let scannedRegions = 0;

        const recognizeCrop = async (box: CropOcrBox): Promise<string> => {
          const cropW = Math.max(1, box.w);
          const cropH = Math.max(1, box.h);
          const scale = upscale2x ? Math.max(2, Math.min(6, Math.round(72 / Math.max(10, cropH)))) : 1;
          const pad = 40;
          const outW = cropW * scale + pad * 2;
          const outH = cropH * scale + pad * 2;

          cropCanvas.width = outW;
          cropCanvas.height = outH;
          const cropCtx = cropCanvas.getContext('2d');
          if (!cropCtx) return '';

          cropCtx.fillStyle = '#ffffff';
          cropCtx.fillRect(0, 0, outW, outH);
          cropCtx.imageSmoothingEnabled = true;
          cropCtx.imageSmoothingQuality = 'high';
          cropCtx.drawImage(grayCanvas, box.x, box.y, cropW, cropH, pad, pad, cropW * scale, cropH * scale);

          if (highContrastBw) {
            const cropImg = cropCtx.getImageData(0, 0, outW, outH);
            const cd = cropImg.data;
            for (let i = 0; i < cd.length; i += 4) {
              const v = cd[i] < bin.threshold ? 0 : 255;
              cd[i] = cd[i + 1] = cd[i + 2] = v;
              cd[i + 3] = 255;
            }
            cropCtx.putImageData(cropImg, 0, 0);
          }

          scannedRegions++;
          setScanStatus('Recognizing 2D math symbols...');
          setScanProgress(Math.min(96, 28 + scannedRegions * 7));

          const useSingleChar = Boolean(box.singleGlyph && box.w <= box.h * 1.25);
          await activeWorker.setParameters({
            tessedit_pageseg_mode: useSingleChar ? PSM.SINGLE_CHAR : PSM.SINGLE_LINE,
          });
          const { data } = await activeWorker.recognize(cropCanvas);
          return (data.text || '').trim();
        };

        let raw = '';
        if (comps.length > 0 && comps.length <= 140) {
          raw = (await parse2DMathLayout(comps, bin.width, bin.height, recognizeCrop)).trim();
        }

        if (!raw) {
          setScanStatus('Recognizing full image block...');
          setScanProgress(65);
          await activeWorker.setParameters({
            tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
          });
          const { data } = await activeWorker.recognize(fullCanvas);
          raw = (data.text || '').trim();
        }

        setRawOcrText(raw);

        const cleaned = normalizeMathOcr(raw);
        if (cleaned) {
          setExpression(cleaned);
          const solved = solveMathProblem(cleaned, { angleUnit });
          saveToHistory(solved);
          addToast('Math equation scanned!', cleaned, 'success');
        } else {
          setOcrError('No readable math text was detected. Try cropping closer around the equation or adjusting Background Polarity.');
          addToast('No math expression found in image', 'info');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'OCR engine failed to initialize.';
        setOcrError(`OCR Notice: ${msg}. You can still edit or type your equation manually below!`);
        addToast('OCR scan unavailable — edit equation manually', 'error');
      } finally {
        if (worker) {
          try {
            await worker.terminate();
          } catch {
            // ignore
          }
        }
        setIsScanning(false);
        setScanProgress(0);
        setScanStatus('');
      }
    },
    [addToast, angleUnit, cropRect, highContrastBw, prepareOcrAnalysis, saveToHistory, upscale2x]
  );

  // Handle file upload
  const handleImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        addToast('Please select a valid image file (PNG, JPG, WebP)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setUploadedImgUrl(url);
        setCropRect(null);
        runOcrScan(url, null);
      };
      reader.readAsDataURL(file);
    },
    [addToast, runOcrScan]
  );

  // Global paste listener for Ctrl+V math screenshots
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            setActiveTab('upload');
            handleImageFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleImageFile]);

  // Sample math photo trigger
  const handleLoadSample = (sample: (typeof SAMPLE_PROBLEMS)[number]) => {
    const dataUrl = generateSampleMathImage(sample);
    setUploadedImgUrl(dataUrl);
    setCropRect(null);
    setActiveTab('upload');
    runOcrScan(dataUrl, null);
  };

  // Crop rectangle drag handlers on uploaded image
  const getRelativePoint = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
  };

  const handleCropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const pt = getRelativePoint(e);
    cropStartRef.current = pt;
    setIsDraggingCrop(true);
    setCropRect({ x: pt.x, y: pt.y, w: 0, h: 0 });
  };

  const handleCropMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingCrop || !cropStartRef.current) return;
    const pt = getRelativePoint(e);
    const start = cropStartRef.current;
    setCropRect({
      x: Math.min(start.x, pt.x),
      y: Math.min(start.y, pt.y),
      w: Math.abs(pt.x - start.x),
      h: Math.abs(pt.y - start.y),
    });
  };

  const handleCropMouseUp = () => {
    if (!isDraggingCrop) return;
    setIsDraggingCrop(false);
    if (cropRect && (cropRect.w < 0.04 || cropRect.h < 0.04)) {
      setCropRect(null);
    }
  };

  // Live Camera Controls
  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      setCameraError(err instanceof Error ? err.message : 'Unable to access camera. Check browser permissions.');
    }
  };

  const captureCameraFrame = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    // Crop center 75% x 45% guide frame for clean equation capture
    const cw = Math.round(video.videoWidth * 0.75);
    const ch = Math.round(video.videoHeight * 0.45);
    const cx = Math.round((video.videoWidth - cw) / 2);
    const cy = Math.round((video.videoHeight - ch) / 2);
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, cx, cy, cw, ch, 0, 0, cw, ch);
    const dataUrl = canvas.toDataURL('image/png');
    setUploadedImgUrl(dataUrl);
    setCropRect(null);
    stopCamera();
    setActiveTab('upload');
    runOcrScan(dataUrl, null);
  };

  // Freehand Drawing Pad handlers
  const getDrawCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handleDrawDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    canvas.setPointerCapture(e.pointerId);
    const pt = getDrawCoords(e);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    isDrawingRef.current = true;
    setHasDrawing(true);
  };

  const handleDrawMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pt = getDrawCoords(e);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  };

  const handleDrawUp = () => {
    isDrawingRef.current = false;
  };

  const clearDrawCanvas = () => {
    const canvas = drawCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const scanDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    setUploadedImgUrl(url);
    setCropRect(null);
    runOcrScan(url, null);
  };

  // Insert snippet into expression input
  const insertAtCursor = (snippet: string) => {
    const input = exprInputRef.current;
    if (!input) {
      setExpression((prev) => prev + snippet);
      return;
    }
    const start = input.selectionStart ?? expression.length;
    const end = input.selectionEnd ?? expression.length;
    const next = expression.slice(0, start) + snippet + expression.slice(end);
    setExpression(next);
    setTimeout(() => {
      input.focus();
      const cursorPos = snippet.endsWith('()') ? start + snippet.length - 1 : start + snippet.length;
      input.setSelectionRange(cursorPos, cursorPos);
    }, 10);
  };

  const handleCopyFullSolution = () => {
    const lines = [
      `Problem: ${solution.normalizedInput}`,
      `Type: ${solution.problemLabel}`,
      `Answer: ${solution.finalAnswer}`,
      '',
      'Steps:',
      ...solution.steps.map((s, idx) => `${idx + 1}. ${s.title}\n   ${s.math}\n   (${s.explanation})`),
    ];
    if (solution.verification) {
      lines.push('', `Verification: ${solution.verification}`);
    }
    copyToClipboard(lines.join('\n'), 'Step-by-step math solution copied!');
  };

  // Render Interactive SVG Plotter
  const renderPlotter = () => {
    const plot = solution.plot;
    if (!plot) return null;

    const width = 640;
    const height = 340;
    const padL = 44;
    const padR = 18;
    const padT = 18;
    const padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const cx = (plot.xRange[0] + plot.xRange[1]) / 2;
    const cy = (plot.yRange[0] + plot.yRange[1]) / 2;
    const halfX = ((plot.xRange[1] - plot.xRange[0]) / 2) / plotZoom;
    const halfY = ((plot.yRange[1] - plot.yRange[0]) / 2) / plotZoom;
    const xMin = cx - halfX;
    const xMax = cx + halfX;
    const yMin = cy - halfY;
    const yMax = cy + halfY;

    const toSvgX = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
    const toSvgY = (y: number) => padT + ((yMax - y) / (yMax - yMin)) * plotH;

    const axisX = toSvgX(0);
    const axisY = toSvgY(0);

    const xTicks: number[] = [];
    const yTicks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      xTicks.push(xMin + ((xMax - xMin) * i) / 4);
      yTicks.push(yMin + ((yMax - yMin) * i) / 4);
    }

    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" />
              Interactive Coordinate Graph
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {plot.series.map((s, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {hoverPoint && (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-mono text-[11px] font-bold mr-1">
                ({formatNum(hoverPoint.x, 2)}, {formatNum(hoverPoint.y, 2)})
              </span>
            )}
            <button
              onClick={() => setPlotZoom((z) => Math.min(4, Number((z * 1.3).toFixed(2))))}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setPlotZoom((z) => Math.max(0.4, Number((z / 1.3).toFixed(2))))}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setPlotZoom(1)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Reset Graph View"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto block select-none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const sx = ((e.clientX - rect.left) / rect.width) * width;
              const sy = ((e.clientY - rect.top) / rect.height) * height;
              const xVal = xMin + ((sx - padL) / plotW) * (xMax - xMin);
              const yVal = yMax - ((sy - padT) / plotH) * (yMax - yMin);
              if (sx >= padL && sx <= width - padR && sy >= padT && sy <= height - padB) {
                setHoverPoint({ x: xVal, y: yVal });
              } else {
                setHoverPoint(null);
              }
            }}
            onMouseLeave={() => setHoverPoint(null)}
          >
            <defs>
              <clipPath id="math-plot-clip">
                <rect x={padL} y={padT} width={plotW} height={plotH} />
              </clipPath>
            </defs>

            {/* Gridlines */}
            {xTicks.map((t, i) => {
              const px = toSvgX(t);
              return (
                <g key={`gx-${i}`}>
                  <line x1={px} y1={padT} x2={px} y2={height - padB} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
                  <text x={px} y={height - 10} textAnchor="middle" className="fill-slate-400 text-[10px] font-mono">
                    {formatNum(t, 1)}
                  </text>
                </g>
              );
            })}
            {yTicks.map((t, i) => {
              const py = toSvgY(t);
              return (
                <g key={`gy-${i}`}>
                  <line x1={padL} y1={py} x2={width - padR} y2={py} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
                  <text x={padL - 8} y={py + 3} textAnchor="end" className="fill-slate-400 text-[10px] font-mono">
                    {formatNum(t, 1)}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            {axisY >= padT && axisY <= height - padB && (
              <line x1={padL} y1={axisY} x2={width - padR} y2={axisY} stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="1.5" />
            )}
            {axisX >= padL && axisX <= width - padR && (
              <line x1={axisX} y1={padT} x2={axisX} y2={height - padB} stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="1.5" />
            )}

            {/* Curves & Area */}
            <g clipPath="url(#math-plot-clip)">
              {plot.series.map((s, sIdx) => {
                const pts = sampleExpressionCurve(s.expr, plot.variable, [xMin, xMax], 220, { angleUnit });
                let pathD = '';
                let penUp = true;
                for (const p of pts) {
                  if (!Number.isFinite(p.y) || Math.abs(p.y) > 1e5) {
                    penUp = true;
                    continue;
                  }
                  const px = toSvgX(p.x);
                  const py = toSvgY(p.y);
                  pathD += `${penUp ? 'M' : 'L'} ${px.toFixed(2)} ${py.toFixed(2)} `;
                  penUp = false;
                }

                // Optional shaded integral area
                let areaD = '';
                if (s.type === 'area' && s.areaBounds) {
                  const [a, b] = s.areaBounds;
                  const areaPts = sampleExpressionCurve(s.expr, plot.variable, [a, b], 120, { angleUnit }).filter((p) =>
                    Number.isFinite(p.y)
                  );
                  if (areaPts.length > 1) {
                    const yZero = toSvgY(0);
                    areaD =
                      `M ${toSvgX(areaPts[0].x).toFixed(2)} ${yZero.toFixed(2)} ` +
                      areaPts.map((p) => `L ${toSvgX(p.x).toFixed(2)} ${toSvgY(p.y).toFixed(2)}`).join(' ') +
                      ` L ${toSvgX(areaPts[areaPts.length - 1].x).toFixed(2)} ${yZero.toFixed(2)} Z`;
                  }
                }

                return (
                  <g key={sIdx}>
                    {areaD && <path d={areaD} fill={s.color} fillOpacity="0.22" />}
                    <path d={pathD} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                );
              })}

              {/* Highlighted Root / Intersection Points */}
              {plot.points.map((pt, pIdx) => {
                const px = toSvgX(pt.x);
                const py = toSvgY(pt.y);
                return (
                  <g key={pIdx}>
                    <circle cx={px} cy={py} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <text x={px + 8} y={py - 8} className="fill-amber-600 dark:fill-amber-400 text-[10px] font-bold font-mono">
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Mode Selector */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { id: 'upload', label: 'Upload / Paste Photo', icon: Upload },
          { id: 'camera', label: 'Camera Scan', icon: Camera },
          { id: 'draw', label: 'Draw / Sketch Math', icon: PenTool },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as InputTab)}
              className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={17} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scanner Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image / Camera / Draw Scanner (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          {activeTab === 'upload' && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ScanLine size={17} className="text-indigo-500" />
                  Image Math Scanner (OCR)
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Ctrl+V Paste Ready
                </span>
              </div>

              {!uploadedImgUrl ? (
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                  className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-950/60 cursor-pointer transition-all text-center"
                >
                  <Upload size={34} className="text-indigo-500 mb-2.5" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Upload or drop a math photo
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Homework photos, printed equations, or screenshots (PNG, JPG, WebP)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageFile(f);
                    }}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  {/* Interactive Crop Viewport */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold">
                      <Crop size={12} className="text-indigo-500" />
                      Drag over image to crop a specific problem
                    </span>
                    {cropRect && (
                      <button
                        onClick={() => setCropRect(null)}
                        className="text-indigo-500 hover:underline font-bold cursor-pointer"
                      >
                        Reset Crop
                      </button>
                    )}
                  </div>

                  <div
                    ref={imgContainerRef}
                    onMouseDown={handleCropMouseDown}
                    onMouseMove={handleCropMouseMove}
                    onMouseUp={handleCropMouseUp}
                    onMouseLeave={handleCropMouseUp}
                    className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 select-none cursor-crosshair flex items-center justify-center"
                  >
                    <img
                      src={uploadedImgUrl}
                      alt="Uploaded math problem"
                      draggable={false}
                      className="w-full max-h-64 object-contain pointer-events-none"
                    />
                    {cropRect && (
                      <div
                        className="absolute border-2 border-indigo-400 bg-indigo-500/20 pointer-events-none"
                        style={{
                          left: `${cropRect.x * 100}%`,
                          top: `${cropRect.y * 100}%`,
                          width: `${cropRect.w * 100}%`,
                          height: `${cropRect.h * 100}%`,
                        }}
                      />
                    )}
                  </div>

                  {/* Preprocessing Toggles */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <Sliders size={12} />
                        OCR Image Enhancers
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 dark:bg-slate-900 p-0.5 text-[11px] font-bold">
                        {(
                          [
                            { id: 'auto', label: 'Auto Bg' },
                            { id: 'normal', label: 'Light' },
                            { id: 'invert', label: 'Dark' },
                          ] as const
                        ).map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setPolarityMode(mode.id)}
                            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                              polarityMode === mode.id
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={highContrastBw}
                          onChange={(e) => setHighContrastBw(e.target.checked)}
                          className="accent-indigo-600 rounded"
                        />
                        <span>High-Contrast B&W</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={upscale2x}
                          onChange={(e) => setUpscale2x(e.target.checked)}
                          className="accent-indigo-600 rounded"
                        />
                        <span>2x Upscale</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled={isScanning}
                      onClick={() => runOcrScan(uploadedImgUrl, cropRect)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 disabled:opacity-60 cursor-pointer"
                    >
                      {isScanning ? <RefreshCw size={14} className="animate-spin" /> : <ScanLine size={14} />}
                      <span>{isScanning ? 'Scanning...' : cropRect ? 'Scan Selected Region' : 'Re-Scan Full Image'}</span>
                    </button>

                    <label className="py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer">
                      <Upload size={14} />
                      <span>New Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageFile(f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* OCR Progress Bar */}
              {isScanning && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-indigo-500 font-bold">
                    <span className="truncate">{scanStatus || 'Scanning...'}</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-200"
                      style={{ width: `${scanProgress}%` }}
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

              {rawOcrText && (
                <div className="text-[11px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 truncate">
                  Raw OCR: {rawOcrText}
                </div>
              )}

              {/* Sample Test Images */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Try Built-In Sample Photos
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_PROBLEMS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleLoadSample(sample)}
                      disabled={isScanning}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300 text-left transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <span className="text-[11px] font-bold block">{sample.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 truncate block">
                        {sample.lines.join('; ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera size={17} className="text-indigo-500" />
                Live Camera Math Capture
              </h2>

              {cameraError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}

              <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                />
                {isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[75%] h-[45%] border-2 border-indigo-400 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] flex items-end justify-center pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 bg-black/50 px-2 py-0.5 rounded">
                        Align equation inside frame
                      </span>
                    </div>
                  </div>
                )}
                {!isCameraActive && (
                  <div className="text-center p-6 space-y-2">
                    <Camera size={36} className="mx-auto text-slate-500" />
                    <p className="text-xs text-slate-400">Point your webcam or phone camera at any math problem</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2.5">
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 cursor-pointer"
                  >
                    <Play size={14} />
                    <span>Start Camera</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={captureCameraFrame}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <ScanLine size={14} />
                      <span>Capture & Solve</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Square size={13} />
                      <span>Stop</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PenTool size={17} className="text-indigo-500" />
                  Draw Equation Pad
                </h2>
                <button
                  onClick={clearDrawCanvas}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Clear
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                <canvas
                  ref={drawCanvasRef}
                  width={560}
                  height={220}
                  onPointerDown={handleDrawDown}
                  onPointerMove={handleDrawMove}
                  onPointerUp={handleDrawUp}
                  onPointerCancel={handleDrawUp}
                  className="w-full h-auto touch-none cursor-crosshair block"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Write clearly on the pad (e.g., <code className="font-mono">2x + 4 = 12</code>) then click Scan Drawing.
              </p>

              <button
                disabled={!hasDrawing || isScanning}
                onClick={scanDrawing}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 disabled:opacity-50 cursor-pointer"
              >
                {isScanning ? <RefreshCw size={14} className="animate-spin" /> : <ScanLine size={14} />}
                <span>{isScanning ? 'Scanning Drawing...' : 'Scan & Solve Drawing'}</span>
              </button>
            </div>
          )}

          {/* Hidden canvas used for preprocessing */}
          <canvas ref={previewCanvasRef} className="hidden" />

          {/* Recent History */}
          {history.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History size={13} />
                  Recent Math Problems
                </h3>
                <button
                  onClick={() => setHistory([])}
                  className="text-[11px] text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExpression(item.expr)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-slate-200/70 dark:border-slate-800/70 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.expr}</p>
                      <p className="text-[10px] text-slate-400">{item.label}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                      {item.answer}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Equation Editor, Solution & Step-by-Step + Graph (7/12) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Editable Math Expression Bar & Scientific Keypad */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sigma size={14} className="text-indigo-500" />
                Equation or Expression
              </label>

              <div className="flex items-center gap-2">
                <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                  <button
                    onClick={() => setAngleUnit('rad')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      angleUnit === 'rad' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                    }`}
                  >
                    RAD
                  </button>
                  <button
                    onClick={() => setAngleUnit('deg')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      angleUnit === 'deg' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                    }`}
                  >
                    DEG
                  </button>
                </div>

                <button
                  onClick={() => saveToHistory(solution)}
                  className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold hover:bg-indigo-500/20 cursor-pointer"
                >
                  Save to History
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                ref={exprInputRef}
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="e.g. 2x + 5 = 17, x^2 - 5x + 6 = 0, d/dx(x^3), 15% of 240"
                className="w-full px-4 py-3.5 pr-20 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {expression && (
                <button
                  onClick={() => setExpression('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Scientific Math Keypad */}
            <div className="flex flex-wrap gap-1.5">
              {KEYPAD_BUTTONS.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => insertAtCursor(btn.insert)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white text-slate-700 dark:text-slate-200 font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Quick Example Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Examples:</span>
              {QUICK_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setExpression(ex)}
                  className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-[11px] font-mono text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Solution Output Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900/95 to-[#0b0f1e] border border-indigo-500/30 text-white shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {solution.problemLabel}
              </span>

              <button
                onClick={handleCopyFullSolution}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy Steps</span>
              </button>
            </div>

            {solution.error ? (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p className="font-bold text-sm text-white">{solution.finalAnswer}</p>
                  <p className="mt-1 opacity-90">{solution.error}</p>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Solution</span>
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white break-all">
                    {solution.finalAnswer}
                  </p>
                  <button
                    onClick={() => copyToClipboard(solution.finalAnswer, 'Answer copied!')}
                    className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={13} />
                    Copy Answer
                  </button>
                </div>
              </div>
            )}

            {/* Alternate Forms */}
            {solution.alternateForms.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
                {solution.alternateForms.map((alt, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">{alt.label}</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-indigo-200 break-all">{alt.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Verification */}
            {solution.verification && (
              <div className="px-3.5 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                <span>Verified: {solution.verification}</span>
              </div>
            )}
          </div>

          {/* Step-by-Step Explanation */}
          {solution.steps.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step-by-Step Solution</h3>
              <div className="space-y-3">
                {solution.steps.map((step, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70 flex gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</h4>
                      <p className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 break-words">
                        {step.math}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Function Plotter */}
          {renderPlotter()}
        </div>
      </div>
    </div>
  );
};
