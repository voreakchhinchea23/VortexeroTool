import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Download, Upload, Copy, Sparkles, RefreshCw, Palette, Image as ImageIcon, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const ImageStudio: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [hueRotate, setHueRotate] = useState<number>(0);

  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { copyToClipboard } = useClipboard();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setGrayscale(0);
    setSepia(0);
    setHueRotate(0);
  };

  // Extract color palette from image on canvas
  const extractPalette = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 100;
    canvas.height = 100;
    ctx.drawImage(img, 0, 0, 100, 100);

    try {
      const imageData = ctx.getImageData(0, 0, 100, 100).data;
      const colorsMap: Record<string, number> = {};

      for (let i = 0; i < imageData.length; i += 16) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colorsMap[hex] = (colorsMap[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([hex]) => hex);

      setExtractedColors(sorted);
    } catch {
      // CORS fallback sample
      setExtractedColors(['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']);
    }
  };

  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%) hue-rotate(${hueRotate}deg)`;

  const downloadFilteredImage = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    ctx.filter = filterStyle;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = `vortexero-filtered-${Date.now()}.${exportFormat}`;
    link.href = canvas.toDataURL(`image/${exportFormat}`);
    link.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <label className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-brand-500/25">
          <Upload size={15} />
          <span>Upload Image</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={extractPalette}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Palette size={14} className="text-brand-500" />
            <span>Extract Palette</span>
          </button>

          <button
            onClick={resetFilters}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Filter Sliders (5/12) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders size={16} className="text-brand-500" />
            <span>Visual Adjustments</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Brightness</span>
                <span className="font-mono">{brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Contrast</span>
                <span className="font-mono">{contrast}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Saturation</span>
                <span className="font-mono">{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Grayscale</span>
                <span className="font-mono">{grayscale}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={grayscale}
                onChange={(e) => setGrayscale(Number(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Sepia</span>
                <span className="font-mono">{sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sepia}
                onChange={(e) => setSepia(Number(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Blur</span>
                <span className="font-mono">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Extracted Palette Swatches */}
          {extractedColors.length > 0 && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Palette</span>
              <div className="grid grid-cols-6 gap-1.5">
                {extractedColors.map((hex, i) => (
                  <button
                    key={i}
                    onClick={() => copyToClipboard(hex, `Color ${hex} copied!`)}
                    style={{ backgroundColor: hex }}
                    className="h-10 rounded-xl shadow-inner relative group transition-transform hover:scale-105 cursor-pointer"
                    title={`Click to copy ${hex}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Canvas Viewport (7/12) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Image Canvas</span>
            <div className="flex items-center gap-2">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border-none"
              >
                <option value="png">PNG Format</option>
                <option value="jpeg">JPG Format</option>
                <option value="webp">WebP Format</option>
              </select>

              <button
                onClick={downloadFilteredImage}
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 cursor-pointer"
              >
                <Download size={13} />
                <span>Save Image</span>
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="h-[380px] rounded-2xl bg-slate-950/80 border border-slate-200/70 dark:border-slate-800/70 overflow-hidden flex items-center justify-center p-4">
            <img
              ref={imgRef}
              src={imageSrc}
              crossOrigin="anonymous"
              alt="Studio Preview"
              style={{ filter: filterStyle }}
              className="max-h-full max-w-full object-contain rounded-xl transition-all duration-75"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
