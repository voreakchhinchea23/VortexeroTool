import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { QRCodeCanvas } from 'qrcode.react';
import {
  ScanQrCode,
  Upload,
  Camera,
  Copy,
  ExternalLink,
  Wifi,
  User,
  Globe,
  Mail,
  MessageSquare,
  MapPin,
  Phone,
  FileText,
  History,
  Trash2,
  Play,
  Square,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Download,
  LucideIcon,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useClipboard } from '../../../hooks/useClipboard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { parseQrPayload, ParsedQrPayload, ParsedQrType } from '../../../utils/everydayUtils';

interface QrHistoryItem {
  id: string;
  raw: string;
  label: string;
  type: ParsedQrType;
  timestamp: number;
}

const TYPE_ICONS: Record<ParsedQrType, LucideIcon> = {
  wifi: Wifi,
  vcard: User,
  url: Globe,
  email: Mail,
  sms: MessageSquare,
  geo: MapPin,
  phone: Phone,
  text: FileText,
};

export const QrScanner: React.FC = () => {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<ParsedQrPayload | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<string>('QR Code');
  const [scanError, setScanError] = useState<string | null>(null);

  // Camera scanning states
  const [isScanningCam, setIsScanningCam] = useState<boolean>(false);
  const [camError, setCamError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  // Hidden sample QR generator canvas
  const sampleQrRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useLocalStorage<QrHistoryItem[]>('vortexero_qr_history', []);
  const { addToast } = useToast();
  const { copyToClipboard } = useClipboard();

  const recordScan = useCallback(
    (raw: string, formatName: string) => {
      const parsed = parseQrPayload(raw);
      setDecoded(parsed);
      setDetectedFormat(formatName);
      setScanError(null);
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.raw !== raw);
        return [
          {
            id: `${Date.now()}`,
            raw,
            label: parsed.label,
            type: parsed.type,
            timestamp: Date.now(),
          },
          ...filtered,
        ].slice(0, 15);
      });
      addToast(`Decoded ${parsed.label}!`, raw.slice(0, 70), 'success');
    },
    [addToast, setHistory]
  );

  // Decode QR / Barcode from an HTMLImageElement or HTMLCanvasElement
  const decodeImageSource = useCallback(
    async (src: string) => {
      setPreviewUrl(src);
      setScanError(null);

      const img = new Image();
      img.onload = async () => {
        // Try multiple scales if high-res photo is huge
        const attempts = [1, 0.5, 1.5];
        let foundRaw: string | null = null;
        let formatLabel = 'QR Code';

        for (const scale of attempts) {
          const w = Math.max(64, Math.min(1800, Math.round(img.naturalWidth * scale)));
          const h = Math.max(64, Math.min(1800, Math.round(img.naturalHeight * scale)));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const imgData = ctx.getImageData(0, 0, w, h);

          const qr = jsQR(imgData.data, w, h, { inversionAttempts: 'attemptBoth' });
          if (qr && qr.data) {
            foundRaw = qr.data;
            formatLabel = 'QR Code';
            break;
          }
        }

        // Fallback to native BarcodeDetector API (supports EAN-13, Code-128, UPC, PDF417, etc. in Chromium)
        if (!foundRaw && 'BarcodeDetector' in window) {
          try {
            const Detector = (window as unknown as { BarcodeDetector: new () => { detect: (img: HTMLImageElement) => Promise<{ rawValue: string; format: string }[]> } }).BarcodeDetector;
            const detector = new Detector();
            const barcodes = await detector.detect(img);
            if (barcodes.length > 0 && barcodes[0].rawValue) {
              foundRaw = barcodes[0].rawValue;
              formatLabel = barcodes[0].format.toUpperCase();
            }
          } catch {
            // ignore unsupported format error
          }
        }

        if (foundRaw) {
          recordScan(foundRaw, formatLabel);
        } else {
          setDecoded(null);
          setScanError('No QR code or barcode was detected in this image. Make sure the code is clear, uncropped, and well-lit.');
          addToast('No QR code found in image', 'info');
        }
      };
      img.onerror = () => {
        setScanError('Could not load the selected image.');
      };
      img.src = src;
    },
    [addToast, recordScan]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        addToast('Please select an image file', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        decodeImageSource(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [addToast, decodeImageSource]
  );

  // Global Ctrl+V paste handler
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            setMode('upload');
            handleFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFile]);

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsScanningCam(false);
  }, []);

  useEffect(() => {
    if (mode !== 'camera') stopCamera();
    return () => stopCamera();
  }, [mode, stopCamera]);

  const startCameraScan = async () => {
    setCamError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('Camera is not supported in this browser.');
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
      setIsScanningCam(true);

      const scanCanvas = document.createElement('canvas');
      const scanCtx = scanCanvas.getContext('2d');

      const tick = () => {
        const video = videoRef.current;
        if (!video || !streamRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA && scanCtx) {
          scanCanvas.width = video.videoWidth;
          scanCanvas.height = video.videoHeight;
          scanCtx.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height);
          const imgData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
          const code = jsQR(imgData.data, scanCanvas.width, scanCanvas.height, { inversionAttempts: 'dontInvert' });
          if (code && code.data) {
            setPreviewUrl(scanCanvas.toDataURL('image/png'));
            recordScan(code.data, 'QR Code (Camera)');
            stopCamera();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err: unknown) {
      setCamError(err instanceof Error ? err.message : 'Unable to start camera.');
    }
  };

  const handleTestSampleQr = () => {
    const canvas = sampleQrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    setMode('upload');
    decodeImageSource(url);
  };

  const handleDownloadVCard = () => {
    if (!decoded || decoded.type !== 'vcard') return;
    const blob = new Blob([decoded.raw], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.vcf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const TypeIcon = decoded ? TYPE_ICONS[decoded.type] : FileText;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hidden Sample Wi-Fi QR Canvas */}
      <div ref={sampleQrRef} className="hidden">
        <QRCodeCanvas value="WIFI:S:Vortexero_Guest_5G;T:WPA;P:SuperSecret2026;H:false;;" size={320} includeMargin />
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode('upload')}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mode === 'upload'
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Upload size={17} />
          <span>Upload / Paste QR Image</span>
        </button>

        <button
          onClick={() => setMode('camera')}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mode === 'camera'
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Camera size={17} />
          <span>Live Camera Scanner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Scanner (6/12) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          {mode === 'upload' ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ScanQrCode size={17} className="text-teal-500" />
                  QR & Barcode Reader
                </h2>
                <button
                  onClick={handleTestSampleQr}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/25 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>Try Sample Wi-Fi QR</span>
                </button>
              </div>

              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFile(f);
                }}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 bg-slate-50/70 dark:bg-slate-950/60 cursor-pointer transition-all text-center"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Scanned QR" className="max-h-52 rounded-xl object-contain mb-3 shadow-sm" />
                ) : (
                  <Upload size={36} className="text-teal-500 mb-2.5" />
                )}
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {previewUrl ? 'Click or drop another QR image' : 'Upload, drag & drop, or Ctrl+V paste QR image'}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Safely inspect links, Wi-Fi passwords & contacts before opening
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
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera size={17} className="text-teal-500" />
                Real-Time Webcam QR Scanner
              </h2>

              {camError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{camError}</span>
                </div>
              )}

              <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isScanningCam ? 'block' : 'hidden'}`}
                />
                {isScanningCam && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-44 h-44 border-2 border-teal-400 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] animate-pulse" />
                  </div>
                )}
                {!isScanningCam && (
                  <div className="text-center p-6 space-y-2">
                    <ScanQrCode size={38} className="mx-auto text-slate-500" />
                    <p className="text-xs text-slate-400">Hold a QR code in front of your camera to decode automatically</p>
                  </div>
                )}
              </div>

              <button
                onClick={isScanningCam ? stopCamera : startCameraScan}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer ${
                  isScanningCam
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20'
                }`}
              >
                {isScanningCam ? <Square size={14} /> : <Play size={14} />}
                <span>{isScanningCam ? 'Stop Camera Scanner' : 'Start Camera Scanner'}</span>
              </button>
            </div>
          )}

          {scanError && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{scanError}</span>
            </div>
          )}
        </div>

        {/* Right: Decoded Output & History (6/12) */}
        <div className="lg:col-span-6 space-y-5">
          {decoded ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-950/45 via-slate-900/95 to-[#061318] border border-teal-500/30 text-white shadow-xl space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                    <TypeIcon size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300 block">
                      {decoded.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{detectedFormat}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  Decoded
                </span>
              </div>

              <div className="space-y-2.5">
                {decoded.fields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">{field.label}</span>
                      <p className="font-mono text-sm font-bold text-white break-all mt-0.5">{field.value}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(field.value, `${field.label} copied!`)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-teal-200 shrink-0 cursor-pointer"
                      title={`Copy ${field.label}`}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  onClick={() => copyToClipboard(decoded.raw, 'Raw QR payload copied!')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>Copy Raw Payload</span>
                </button>

                {decoded.actionUrl && (
                  <a
                    href={decoded.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Open Destination</span>
                    <ExternalLink size={14} />
                  </a>
                )}

                {decoded.type === 'vcard' && (
                  <button
                    onClick={handleDownloadVCard}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Save Contact (.vcf)</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <ScanQrCode size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Ready to Decode</h3>
              <p className="text-xs text-slate-400">
                Upload a QR screenshot, scan via webcam, or click "Try Sample Wi-Fi QR" to see parsed fields.
              </p>
            </div>
          )}

          {/* Scan History */}
          {history.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History size={13} />
                  Scan History
                </h4>
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDecoded(parseQrPayload(item.raw));
                      setDetectedFormat('History');
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-slate-200/70 dark:border-slate-800/70 text-left flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400 block">{item.label}</span>
                      <span className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate block">{item.raw}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
