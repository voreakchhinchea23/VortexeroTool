import React, { useState, useMemo, useRef } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Eye, 
  Sparkles, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

type OutputTab = 'jsx' | 'clean-svg' | 'data-uri' | 'css-bg';
type PreviewBg = 'checkerboard' | 'dark' | 'light' | 'gradient';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="45" fill="url(#grad)" />
  <path d="M50 20 L60 42 L84 42 L64 56 L72 78 L50 64 L28 78 L36 56 L16 42 L40 42 Z" fill="#ffffff" />
</svg>`;

export const SvgStudio: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(SAMPLE_SVG);
  const [activeTab, setActiveTab] = useState<OutputTab>('jsx');
  const [previewBg, setPreviewBg] = useState<PreviewBg>('checkerboard');
  const [zoom, setZoom] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      addToast('Please upload a valid SVG file (.svg)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSvgInput(reader.result);
        addToast(`Loaded ${file.name}`, 'success');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Clean and optimize SVG string
  const cleanSvg = useMemo(() => {
    let clean = svgInput
      .replace(/<\?xml.*?\?>/gi, '')
      .replace(/<!DOCTYPE.*?>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();

    return clean;
  }, [svgInput]);

  // Convert SVG to React JSX Component
  const jsxComponent = useMemo(() => {
    let jsx = cleanSvg
      .replace(/class=/g, 'className=')
      .replace(/clip-path=/g, 'clipPath=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/fill-opacity=/g, 'fillOpacity=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
      .replace(/stroke-dasharray=/g, 'strokeDasharray=')
      .replace(/stroke-dashoffset=/g, 'strokeDashoffset=')
      .replace(/stroke-opacity=/g, 'strokeOpacity=')
      .replace(/stop-color=/g, 'stopColor=')
      .replace(/stop-opacity=/g, 'stopOpacity=')
      .replace(/font-family=/g, 'fontFamily=')
      .replace(/font-size=/g, 'fontSize=')
      .replace(/font-weight=/g, 'fontWeight=')
      .replace(/text-anchor=/g, 'textAnchor=')
      .replace(/dominant-baseline=/g, 'dominantBaseline=')
      .replace(/alignment-baseline=/g, 'alignmentBaseline=')
      .replace(/xlink:href=/g, 'xlinkHref=')
      .replace(/xmlns:xlink=/g, 'xmlnsXlink=')
      .replace(/xml:space=/g, 'xmlSpace=');

    // Add {...props} to opening svg tag
    jsx = jsx.replace(/<svg\b([^>]*)>/, '<svg$1 {...props}>');

    return `import React from 'react';

export const CustomSvgIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  ${jsx.split('\n').join('\n  ')}
);

export default CustomSvgIcon;`;
  }, [cleanSvg]);

  // Base64 Data URI
  const dataUri = useMemo(() => {
    try {
      const base64 = btoa(unescape(encodeURIComponent(cleanSvg)));
      return `data:image/svg+xml;base64,${base64}`;
    } catch {
      return '';
    }
  }, [cleanSvg]);

  // CSS Background Image
  const cssBackground = useMemo(() => {
    return `background-image: url("${dataUri}");
background-repeat: no-repeat;
background-position: center;
background-size: contain;`;
  }, [dataUri]);

  // Extracted SVG Metadata
  const svgMetrics = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgInput, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    const errorEl = doc.querySelector('parsererror');

    if (errorEl || !svgEl) {
      return { valid: false, error: 'Invalid SVG XML structure', width: 0, height: 0, viewBox: '', paths: 0 };
    }

    const width = svgEl.getAttribute('width') || 'auto';
    const height = svgEl.getAttribute('height') || 'auto';
    const viewBox = svgEl.getAttribute('viewBox') || 'none';
    const paths = doc.querySelectorAll('path, circle, rect, polygon, ellipse, line').length;

    return { valid: true, error: null, width, height, viewBox, paths };
  }, [svgInput]);

  const handleCopyCode = () => {
    let textToCopy = '';
    if (activeTab === 'jsx') textToCopy = jsxComponent;
    else if (activeTab === 'clean-svg') textToCopy = cleanSvg;
    else if (activeTab === 'data-uri') textToCopy = dataUri;
    else if (activeTab === 'css-bg') textToCopy = cssBackground;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    addToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vector_icon.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('SVG file downloaded', 'success');
  };

  const handleDownloadPng = (scale = 2) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Determine canvas dimensions from image or viewBox
      let targetWidth = img.width;
      let targetHeight = img.height;

      if (!targetWidth || !targetHeight) {
        if (svgMetrics.viewBox && svgMetrics.viewBox !== 'none') {
          const parts = svgMetrics.viewBox.trim().split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            targetWidth = parts[2];
            targetHeight = parts[3];
          }
        }
      }

      const width = targetWidth || 512;
      const height = targetHeight || 512;

      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `vector_icon_${scale}x.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast(`PNG (${canvas.width}x${canvas.height}) downloaded!`, 'success');
    };

    img.onerror = () => {
      addToast('Failed to render PNG from SVG. Please check SVG markup.', 'error');
    };

    img.src = dataUri;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                <FileCode size={20} />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">SVG Studio, Optimizer & JSX Converter</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                Vector Hub
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Preview, clean, and convert SVG graphics into React/JSX components, Data URIs, and export high-resolution PNGs with custom background inspect.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Upload size={14} />
              Upload .svg
            </button>
            <button
              onClick={() => setSvgInput(SAMPLE_SVG)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              Reset Sample
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Preview & Metrics | Right Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Preview */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Eye size={14} className="text-violet-500" />
              Live Visual Preview
            </label>

            {/* Background Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              {(['checkerboard', 'dark', 'light', 'gradient'] as PreviewBg[]).map(bg => (
                <button
                  key={bg}
                  onClick={() => setPreviewBg(bg)}
                  className={`px-2 py-1 rounded-lg capitalize text-[11px] font-semibold transition-all ${
                    previewBg === bg
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Viewport */}
          <div
            className={`relative min-h-[280px] flex-1 flex items-center justify-center p-8 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all ${
              previewBg === 'checkerboard'
                ? 'bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] dark:bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px]'
                : previewBg === 'dark'
                ? 'bg-[#0b0f19]'
                : previewBg === 'light'
                ? 'bg-white'
                : 'bg-gradient-to-tr from-violet-600/20 via-pink-600/20 to-amber-500/20'
            }`}
          >
            {svgMetrics.valid ? (
              <div
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                className="transition-transform duration-150 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: cleanSvg }}
              />
            ) : (
              <div className="text-center text-rose-500 text-xs font-mono">
                {svgMetrics.error}
              </div>
            )}
          </div>

          {/* Zoom and Inspector Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(z => Math.max(25, z - 25))}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                <ZoomOut size={13} />
              </button>
              <span className="font-mono text-slate-500 font-semibold w-10 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(300, z + 25))}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                <ZoomIn size={13} />
              </button>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
              <span>ViewBox: {svgMetrics.viewBox}</span>
              <span>•</span>
              <span>Shapes: {svgMetrics.paths}</span>
            </div>
          </div>

          {/* Export Actions */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={handleDownloadSvg}
              disabled={!svgMetrics.valid}
              className="px-3 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:bg-violet-100 border border-violet-200 dark:border-violet-800/60 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Download size={14} />
              Download .SVG
            </button>
            <button
              onClick={() => handleDownloadPng(1)}
              disabled={!svgMetrics.valid}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <ImageIcon size={14} />
              PNG 1x
            </button>
            <button
              onClick={() => handleDownloadPng(2)}
              disabled={!svgMetrics.valid}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <ImageIcon size={14} />
              PNG 2x (HD)
            </button>
          </div>
        </div>

        {/* Right: Code Input & Converted Code */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col space-y-4">
          {/* Format Tabs */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-2xl">
              {[
                { id: 'jsx', label: 'React JSX' },
                { id: 'clean-svg', label: 'Cleaned SVG' },
                { id: 'data-uri', label: 'Data URI' },
                { id: 'css-bg', label: 'CSS Background' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as OutputTab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 border border-violet-200 dark:border-violet-800/60 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Code Viewer */}
          <div className="relative flex-1">
            <pre className="h-full min-h-[300px] p-4 rounded-2xl bg-[#090d16] text-violet-100 border border-slate-800 font-mono text-xs overflow-auto leading-relaxed">
              <code>
                {activeTab === 'jsx' && jsxComponent}
                {activeTab === 'clean-svg' && cleanSvg}
                {activeTab === 'data-uri' && dataUri}
                {activeTab === 'css-bg' && cssBackground}
              </code>
            </pre>
          </div>

          {/* Raw SVG Editor Accordion */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Edit Raw SVG Source
            </label>
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              placeholder="Paste raw <svg>...</svg> code here..."
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
