import React, { useState, useRef, useMemo } from 'react';
import {
  Download,
  Copy,
  Sparkles,
  Check,
  Code2,
  Sliders,
  FileCode,
  Image as ImageIcon,
  Palette,
  Minus,
  Square,
  X,
  Type,
  Layers,
  WrapText,
} from 'lucide-react';
import { toSvg, toBlob, toCanvas } from 'html-to-image';
import { useClipboard } from '../../../hooks/useClipboard';
import { useToast } from '../../../context/ToastContext';
import {
  SUPPORTED_LANGUAGES,
  detectLanguage,
  highlightCodeToLines,
  getLanguageMetadata,
} from '../../../utils/codeHighlight';
import {
  CODE_THEMES,
  BACKGROUND_PRESETS,
  DROP_SHADOWS,
  FONT_FAMILIES,
  generateCodeThemeCss,
} from '../../../utils/codeThemes';

const INITIAL_CODE = `// Supercharge your workflow with VortexeroTool
import { createServer } from 'http';

interface UserSession {
  id: string;
  role: 'admin' | 'developer';
  active: boolean;
}

const handleAuth = async (session: UserSession): Promise<boolean> => {
  console.log(\`[Auth] Verifying session \${session.id}...\`);
  return session.active && session.role === 'developer';
};

export default handleAuth;`;

export const CodeToImage: React.FC = () => {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [codeThemeId, setCodeThemeId] = useState<string>('dracula');
  const [backgroundId, setBackgroundId] = useState<string>('vivid_chroma');
  const [bgCategory, setBgCategory] = useState<'gradient' | 'solid' | 'transparent'>('gradient');
  const [shadowId, setShadowId] = useState<string>('carbon_signature');
  const [fontId, setFontId] = useState<string>('jetbrains_mono');
  const [windowStyle, setWindowStyle] = useState<'mac' | 'windows' | 'none'>('mac');
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const [padding, setPadding] = useState<number>(32);
  const [fontSize, setFontSize] = useState<number>(14);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [wrapLines, setWrapLines] = useState<boolean>(false);
  const [exportScale, setExportScale] = useState<number>(2);
  const [customFilename, setCustomFilename] = useState<string>('');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);

  const previewCardRef = useRef<HTMLDivElement>(null);
  const { copyToClipboard } = useClipboard();
  const { addToast } = useToast();

  // Real-time language detection
  const detectedLanguage = useMemo(() => detectLanguage(code), [code]);
  const effectiveLanguage = selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage;
  const langMeta = useMemo(() => getLanguageMetadata(effectiveLanguage), [effectiveLanguage]);

  // Update default filename placeholder when language changes unless user entered a custom name
  const currentFilename = customFilename.trim() || langMeta.defaultFilename;

  // Selected Theme, Background, Shadow, Font
  const selectedCodeTheme = useMemo(
    () => CODE_THEMES.find((t) => t.id === codeThemeId) || CODE_THEMES[0],
    [codeThemeId]
  );
  const selectedBg = useMemo(
    () => BACKGROUND_PRESETS.find((b) => b.id === backgroundId) || BACKGROUND_PRESETS[0],
    [backgroundId]
  );
  const selectedShadow = useMemo(
    () => DROP_SHADOWS.find((s) => s.id === shadowId) || DROP_SHADOWS[0],
    [shadowId]
  );
  const selectedFont = useMemo(
    () => FONT_FAMILIES.find((f) => f.id === fontId) || FONT_FAMILIES[0],
    [fontId]
  );

  // Generate highlighted lines with preserved HTML spans
  const highlightedLines = useMemo(() => {
    return highlightCodeToLines(code, effectiveLanguage);
  }, [code, effectiveLanguage]);

  // Dynamic CSS for syntax highlighting
  const themeCss = useMemo(() => {
    return generateCodeThemeCss(selectedCodeTheme);
  }, [selectedCodeTheme]);

  // Convert Data URL to standard Blob
  const dataUrlToBlob = (dataUrl: string): Blob => {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const isBase64 = parts[0].includes(';base64');
    if (isBase64) {
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
    return new Blob([decodeURIComponent(parts[1])], { type: mime });
  };

  // Helper to trigger browser file download via Blob Object URL
  const triggerDownload = (blobOrUrl: Blob | string, filename: string) => {
    let url = '';
    let needRevoke = false;

    if (typeof blobOrUrl === 'string') {
      if (blobOrUrl.startsWith('data:')) {
        const blob = dataUrlToBlob(blobOrUrl);
        url = URL.createObjectURL(blob);
        needRevoke = true;
      } else {
        url = blobOrUrl;
      }
    } else {
      url = URL.createObjectURL(blobOrUrl);
      needRevoke = true;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (needRevoke) {
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
  };

  // Helper to render preview container to PNG blob with 3-tier fallback
  const renderPreviewToBlob = async (node: HTMLElement, scale: number): Promise<Blob> => {
    const rect = node.getBoundingClientRect();
    const targetWidth = Math.max(Math.ceil(rect.width), node.scrollWidth, node.offsetWidth);
    const targetHeight = Math.max(Math.ceil(rect.height), node.scrollHeight, node.offsetHeight);

    const baseOptions = {
      pixelRatio: scale,
      cacheBust: true,
      width: targetWidth,
      height: targetHeight,
      style: {
        transform: 'none',
        margin: '0',
        overflow: 'hidden',
      },
    };

    // Tier 1: Direct toBlob
    try {
      const blob = await toBlob(node, baseOptions);
      if (blob) return blob;
    } catch (err) {
      console.warn('toBlob failed, attempting canvas fallback:', err);
    }

    // Tier 2: Canvas fallback
    try {
      const canvas = await toCanvas(node, baseOptions);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });
      if (blob) return blob;
    } catch (err) {
      console.warn('Canvas fallback failed, attempting font-safe canvas render:', err);
    }

    // Tier 3: Font-safe canvas fallback
    const canvasSafe = await toCanvas(node, { ...baseOptions, skipFonts: true });
    return new Promise<Blob>((resolve, reject) => {
      canvasSafe.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas rendering produced empty image'));
      }, 'image/png');
    });
  };

  // Export as Image (PNG, JPEG, SVG)
  const handleExport = async (format: 'png' | 'jpeg' | 'svg') => {
    if (!previewCardRef.current || isExporting) return;

    try {
      setIsExporting(format);
      const node = previewCardRef.current;
      const baseName = currentFilename.replace(/\.[^/.]+$/, '') || 'code-snippet';
      const rect = node.getBoundingClientRect();
      const targetWidth = Math.max(Math.ceil(rect.width), node.scrollWidth, node.offsetWidth);
      const targetHeight = Math.max(Math.ceil(rect.height), node.scrollHeight, node.offsetHeight);

      if (format === 'png') {
        const blob = await renderPreviewToBlob(node, exportScale);
        triggerDownload(blob, `${baseName}.png`);
        addToast('PNG image downloaded', `Exported at ${exportScale}x resolution.`, 'success');
      } else if (format === 'jpeg') {
        const opts = {
          pixelRatio: exportScale,
          cacheBust: true,
          width: targetWidth,
          height: targetHeight,
          backgroundColor: selectedBg.type === 'transparent' ? selectedCodeTheme.editorBg : '#0d1117',
          style: {
            transform: 'none',
            margin: '0',
            overflow: 'hidden',
          },
        };
        let canvas: HTMLCanvasElement;
        try {
          canvas = await toCanvas(node, opts);
        } catch {
          canvas = await toCanvas(node, { ...opts, skipFonts: true });
        }
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', 0.95);
        });
        if (!blob) throw new Error('Failed to generate JPEG blob');
        triggerDownload(blob, `${baseName}.jpg`);
        addToast('JPEG image downloaded', `Exported at ${exportScale}x resolution.`, 'success');
      } else if (format === 'svg') {
        const opts = {
          cacheBust: true,
          width: targetWidth,
          height: targetHeight,
          style: {
            transform: 'none',
            margin: '0',
            overflow: 'hidden',
          },
        };
        let dataUrl: string;
        try {
          dataUrl = await toSvg(node, opts);
        } catch {
          dataUrl = await toSvg(node, { ...opts, skipFonts: true });
        }
        const svgContent = decodeURIComponent(dataUrl.replace('data:image/svg+xml;charset=utf-8,', ''));
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        triggerDownload(blob, `${baseName}.svg`);
        addToast('SVG image downloaded', 'Exported as scalable vector image.', 'success');
      }
    } catch (err) {
      console.error('Export failed: ', err);
      addToast('Export failed', 'An error occurred while generating the image.', 'error');
    } finally {
      setIsExporting(null);
    }
  };

  // Copy Image directly to clipboard
  const handleCopyImage = async () => {
    if (!previewCardRef.current || isExporting) return;

    try {
      setIsExporting('copy-image');
      const node = previewCardRef.current;
      const baseName = currentFilename.replace(/\.[^/.]+$/, '') || 'code-snippet';

      const blob = await renderPreviewToBlob(node, exportScale);
      if (!blob) {
        throw new Error('Failed to generate image blob');
      }

      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
          addToast('Image copied to clipboard', `High-resolution (${exportScale}x) image ready to paste.`, 'success');
          return;
        } catch (clipErr) {
          console.warn('Direct ClipboardItem write failed, trying promise wrap:', clipErr);
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': Promise.resolve(blob),
              }),
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2500);
            addToast('Image copied to clipboard', `High-resolution (${exportScale}x) image ready to paste.`, 'success');
            return;
          } catch {
            // Browser restricted clipboard write
          }
        }
      }

      // Fallback: download PNG if clipboard write is forbidden
      triggerDownload(blob, `${baseName}.png`);
      addToast('Clipboard write restricted', 'High-resolution PNG saved to your downloads instead.', 'info');
    } catch (err) {
      console.error('Copy image failed: ', err);
      try {
        const fallbackBlob = await renderPreviewToBlob(previewCardRef.current, 1);
        triggerDownload(fallbackBlob, 'code-snippet.png');
        addToast('Clipboard permission denied', 'PNG downloaded directly to your device instead.', 'info');
      } catch {
        addToast('Copy image failed', 'Could not access clipboard or render canvas.', 'error');
      }
    } finally {
      setIsExporting(null);
    }
  };

  const filteredBgPresets = useMemo(() => {
    return BACKGROUND_PRESETS.filter((b) => b.type === bgCategory);
  }, [bgCategory]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Primary Controls Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Language Selector & Detection Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Code2 size={14} />
              <span>Lang:</span>
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="auto" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                Auto Detect ({getLanguageMetadata(detectedLanguage).name})
              </option>
              <optgroup label="Supported Languages" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    {lang.name}
                  </option>
                ))}
              </optgroup>
            </select>

            {selectedLanguage === 'auto' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                <Sparkles size={11} />
                <span>{langMeta.name}</span>
              </span>
            ) : (
              <button
                onClick={() => setSelectedLanguage('auto')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                title="Switch back to Auto Detect"
              >
                <Sparkles size={11} />
                <span>Reset to Auto</span>
              </button>
            )}
          </div>

          {/* Syntax Code Theme Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Palette size={14} />
              <span>Theme:</span>
            </label>
            <select
              value={codeThemeId}
              onChange={(e) => setCodeThemeId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {CODE_THEMES.map((t) => (
                <option key={t.id} value={t.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Window Frame Style */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setWindowStyle('mac')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                windowStyle === 'mac'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              macOS
            </button>
            <button
              onClick={() => setWindowStyle('windows')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                windowStyle === 'windows'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Windows
            </button>
            <button
              onClick={() => setWindowStyle('none')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                windowStyle === 'none'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              None
            </button>
          </div>

          {/* Line Numbers & Wrap Lines Toggles */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
              />
              <span>Line Numbers</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={wrapLines}
                onChange={(e) => setWrapLines(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
              />
              <WrapText size={13} className="text-slate-400" />
              <span>Wrap Lines</span>
            </label>
          </div>
        </div>

        {/* Secondary Controls: Background & Shadow Customization */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          {/* Background Presets with Category Tabs */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers size={14} />
              <span>Background:</span>
            </span>

            {/* Category Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
              {(['gradient', 'solid', 'transparent'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setBgCategory(cat);
                    const firstInCat = BACKGROUND_PRESETS.find((b) => b.type === cat);
                    if (firstInCat) setBackgroundId(firstInCat.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    bgCategory === cat
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Swatches */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {filteredBgPresets.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBackgroundId(b.id)}
                  style={{
                    background: b.type === 'transparent' ? 'transparent' : b.value,
                    border: b.type === 'transparent' ? '2px dashed #94a3b8' : undefined,
                  }}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer shrink-0 relative ${
                    backgroundId === b.id
                      ? 'scale-125 ring-2 ring-indigo-500 shadow-md ring-offset-1 dark:ring-offset-slate-900'
                      : 'hover:scale-110'
                  }`}
                  title={b.name}
                  aria-label={b.name}
                >
                  {b.type === 'transparent' && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-400">
                      T
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Drop Shadow Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Shadow:</span>
            </label>
            <select
              value={shadowId}
              onChange={(e) => setShadowId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {DROP_SHADOWS.map((s) => (
                <option key={s.id} value={s.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Code Input & Live Preview Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Source Code Input Column */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileCode size={14} />
                <span>Source Code</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {highlightedLines.length} lines
                </span>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed shadow-inner"
              placeholder="Paste or write your code snippet here..."
              spellCheck={false}
            />
          </div>

          {/* Typography & Frame Settings */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5">
            {/* Filename & Header Title Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-400 whitespace-nowrap">Title:</label>
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder={langMeta.defaultFilename}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setShowTitle(!showTitle)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                  showTitle
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title="Toggle title visibility in window header"
              >
                {showTitle ? 'Visible' : 'Hidden'}
              </button>
            </div>

            {/* Font Family Selection */}
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Type size={13} />
                <span>Font:</span>
              </label>
              <select
                value={fontId}
                onChange={(e) => setFontId(e.target.value)}
                className="w-48 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.id} value={f.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Resolution */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold">Size:</span>
                {[12, 13, 14, 16, 18].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      fontSize === sz
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold">DPR:</span>
                {[1, 2, 3, 4].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setExportScale(scale)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      exportScale === scale
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {scale}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Canvas & Export Section */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Scrollable Canvas Workspace */}
          <div className="w-full rounded-3xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 sm:p-8 flex items-center justify-center overflow-x-auto min-h-[440px] no-scrollbar shadow-inner">
            {/* Export Target Container (Naturally wraps content with w-fit, zero scrollbars) */}
            <div
              ref={previewCardRef}
              className="inline-block w-fit min-w-[320px] max-w-none shrink-0 transition-all select-none"
              style={{
                background: selectedBg.type === 'transparent' ? 'transparent' : selectedBg.value,
                padding: `${padding}px`,
                borderRadius: '24px',
                boxSizing: 'border-box',
              }}
            >
              {/* Embedded Syntax Theme Stylesheet */}
              <style>{themeCss}</style>

              {/* Terminal Window Box */}
              <div
                className="rounded-2xl transition-all"
                style={{
                  backgroundColor: selectedCodeTheme.editorBg,
                  border: `1px solid ${selectedCodeTheme.borderColor}`,
                  boxShadow: selectedShadow.value,
                  overflow: 'hidden',
                  minWidth: '280px',
                  boxSizing: 'border-box',
                }}
              >
                {/* Title Bar */}
                {windowStyle !== 'none' && (
                  <div
                    className="px-4 py-3 flex items-center justify-between border-b"
                    style={{
                      backgroundColor: selectedCodeTheme.titleBarBg,
                      borderColor: selectedCodeTheme.borderColor,
                    }}
                  >
                    {/* Window Controls */}
                    {windowStyle === 'mac' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-xs" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-xs" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-xs" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Minus size={11} strokeWidth={2.5} />
                        <Square size={10} strokeWidth={2.5} />
                        <X size={11} strokeWidth={2.5} />
                      </div>
                    )}

                    {/* Filename Header */}
                    {showTitle && (
                      <span
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-md font-medium tracking-wide"
                        style={{
                          color: selectedCodeTheme.isLight ? '#57606a' : '#8b949e',
                          backgroundColor: selectedCodeTheme.isLight
                            ? 'rgba(0,0,0,0.06)'
                            : 'rgba(255,255,255,0.06)',
                        }}
                      >
                        {currentFilename}
                      </span>
                    )}

                    <div className="w-10" />
                  </div>
                )}

                {/* Code Table - Zero scrollbars, natural layout */}
                <div
                  className="p-5 sm:p-6 font-mono leading-relaxed vortex-code-highlight"
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: selectedFont.fontFamily,
                    backgroundColor: selectedCodeTheme.editorBg,
                    overflow: 'visible',
                    boxSizing: 'border-box',
                  }}
                >
                  <table
                    className="border-collapse"
                    style={{
                      width: '100%',
                      tableLayout: 'auto',
                      borderSpacing: 0,
                    }}
                  >
                    <tbody>
                      {highlightedLines.map((lineHtml, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          {showLineNumbers && (
                            <td
                              className="pr-4 select-none text-right font-mono text-[11px] align-top whitespace-nowrap"
                              style={{
                                color: selectedCodeTheme.lineNumColor,
                                width: '2.5rem',
                                userSelect: 'none',
                              }}
                            >
                              {idx + 1}
                            </td>
                          )}
                          <td
                            className="font-mono align-top"
                            style={{
                              whiteSpace: wrapLines ? 'pre-wrap' : 'pre',
                              wordBreak: wrapLines ? 'break-word' : 'normal',
                              padding: 0,
                              margin: 0,
                            }}
                            dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Footer: Padding & Action Buttons */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            {/* Card Padding & Raw Code Copy */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sliders size={13} />
                  <span>Card Padding:</span>
                </span>
                <div className="flex items-center gap-1">
                  {[16, 32, 48, 64].map((pVal) => (
                    <button
                      key={pVal}
                      onClick={() => setPadding(pVal)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                        padding === pVal
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {pVal}
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="12"
                  max="80"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-24 accent-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{padding}px</span>
              </div>

              <button
                onClick={() => {
                  copyToClipboard(code, 'Code snippet copied to clipboard');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copy raw text code snippet"
              >
                <Copy size={13} />
                <span>Copy Code</span>
              </button>
            </div>

            {/* Export & Copy Image Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
              {/* Copy Image Button */}
              <button
                onClick={handleCopyImage}
                disabled={isExporting !== null}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                title="Copy high-resolution image to clipboard"
              >
                {copiedImage ? <Check size={14} /> : <ImageIcon size={14} />}
                <span>{isExporting === 'copy-image' ? 'Generating...' : copiedImage ? 'Copied Image!' : 'Copy Image'}</span>
              </button>

              {/* Download Buttons for PNG, SVG, JPEG */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleExport('png')}
                  disabled={isExporting !== null}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  title="Download PNG at chosen resolution"
                >
                  <Download size={13} />
                  <span>{isExporting === 'png' ? 'Saving...' : `Export PNG (${exportScale}x)`}</span>
                </button>

                <button
                  onClick={() => handleExport('svg')}
                  disabled={isExporting !== null}
                  className="px-3.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  title="Download as scalable vector SVG"
                >
                  <Download size={13} />
                  <span>{isExporting === 'svg' ? 'Saving...' : 'Export SVG'}</span>
                </button>

                <button
                  onClick={() => handleExport('jpeg')}
                  disabled={isExporting !== null}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  title="Download compressed JPEG"
                >
                  <Download size={13} />
                  <span>{isExporting === 'jpeg' ? 'Saving...' : 'Export JPEG'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
