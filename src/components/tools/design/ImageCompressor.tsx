import React, { useState, useRef } from 'react';
import { ImageDown, Upload, Download, RefreshCw, Sparkles, Check } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [format, setFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addToast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    setOriginalSize(file.size);

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    compressImage(file, quality, maxWidth, format);
  };

  const compressImage = (
    file: File,
    q: number,
    maxW: number,
    fmt: 'image/webp' | 'image/jpeg' | 'image/png'
  ) => {
    setIsProcessing(true);
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size);
              const compressedObjectUrl = URL.createObjectURL(blob);
              setCompressedUrl(compressedObjectUrl);
            }
            setIsProcessing(false);
          },
          fmt,
          q / 100
        );
      };
    };
    reader.readAsDataURL(file);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (originalFile) {
      compressImage(originalFile, newQ, maxWidth, format);
    }
  };

  const handleFormatChange = (newFmt: 'image/webp' | 'image/jpeg' | 'image/png') => {
    setFormat(newFmt);
    if (originalFile) {
      compressImage(originalFile, quality, maxWidth, newFmt);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reductionPercent = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  const handleDownload = () => {
    if (!compressedUrl) return;
    const link = document.createElement('a');
    link.href = compressedUrl;
    const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png';
    link.download = `compressed-image.${ext}`;
    link.click();
    addToast('Download started', 'Your optimized image has been saved.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Upload Box */}
      {!originalFile && (
        <label className="flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-white dark:bg-slate-900 cursor-pointer transition-all shadow-sm">
          <Upload size={40} className="text-brand-500 mb-3" />
          <span className="text-base font-bold text-slate-800 dark:text-slate-200">
            Upload an image to optimize & compress
          </span>
          <span className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WebP directly in your browser</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}

      {originalFile && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Quality</label>
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value as 'image/webp' | 'image/jpeg' | 'image/png')}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer"
                >
                  <option value="image/webp">WebP (Modern, High Compression)</option>
                  <option value="image/jpeg">JPEG (Universal)</option>
                  <option value="image/png">PNG (Lossless)</option>
                </select>
              </div>

              <div className="flex items-end justify-end">
                <label className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5">
                  <Upload size={14} />
                  <span>Choose Another Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Side by Side Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Image</span>
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  {formatFileSize(originalSize)}
                </span>
              </div>
              <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center p-3 overflow-hidden">
                {originalUrl && (
                  <img src={originalUrl} alt="Original" className="max-h-full max-w-full object-contain rounded-lg" />
                )}
              </div>
            </div>

            {/* Compressed Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-xl shadow-slate-950/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                  Optimized Result
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {formatFileSize(compressedSize)}
                  </span>
                  {reductionPercent > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      -{reductionPercent}%
                    </span>
                  )}
                </div>
              </div>

              <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center p-3 overflow-hidden">
                {compressedUrl && (
                  <img src={compressedUrl} alt="Compressed" className="max-h-full max-w-full object-contain rounded-lg" />
                )}
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Download size={16} />
                <span>Download Optimized Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
