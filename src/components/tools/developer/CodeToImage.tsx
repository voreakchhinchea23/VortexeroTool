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
} from 'lucide-react';
import { toPng, toJpeg, toSvg, toBlob } from 'html-to-image';
import { useClipboard } from '../../../hooks/useClipboard';
import { useToast } from '../../../context/ToastContext';
import {
  SUPPORTED_LANGUAGES,
  detectLanguage,
  highlightCodeToLines,
  getLanguageMetadata,
} from '../../../utils/codeHighlight';

const THEMES = [
  { id: 'vivid_chroma', label: 'Vivid Chroma', bg: 'from-purple-600 via-indigo-600 to-pink-500' },
  { id: 'midnight_neon', label: 'Midnight Neon', bg: 'from-cyan-500 via-blue-600 to-indigo-900' },
  { id: 'sunset_blaze', label: 'Sunset Blaze', bg: 'from-amber-500 via-rose-500 to-purple-600' },
  { id: 'emerald_matrix', label: 'Emerald Matrix', bg: 'from-emerald-500 via-teal-600 to-slate-900' },
  { id: 'obsidian_dark', label: 'Obsidian Pure', bg: 'from-slate-900 via-slate-950 to-black' },
  { id: 'tokyo_lavender', label: 'Tokyo Lavender', bg: 'from-fuchsia-400 via-purple-500 to-indigo-500' },
  { id: 'cyberpunk_amber', label: 'Cyberpunk Amber', bg: 'from-amber-400 via-orange-500 to-rose-600' },
  { id: 'deep_ocean', label: 'Deep Ocean', bg: 'from-blue-600 via-cyan-600 to-teal-500' },
];

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
  const [theme, setTheme] = useState<string>('vivid_chroma');
  const [windowStyle, setWindowStyle] = useState<'mac' | 'windows' | 'none'>('mac');
  const [padding, setPadding] = useState<number>(32);
  const [fontSize, setFontSize] = useState<number>(13);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
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

  // Generate highlighted lines with preserved HTML spans
  const highlightedLines = useMemo(() => {
    return highlightCodeToLines(code, effectiveLanguage);
  }, [code, effectiveLanguage]);

  const selectedTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  // Helper to trigger browser file download
  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as Image (PNG, JPEG, SVG)
  const handleExport = async (format: 'png' | 'jpeg' | 'svg') => {
    if (!previewCardRef.current || isExporting) return;

    try {
      setIsExporting(format);
      const node = previewCardRef.current;
      const baseName = currentFilename.replace(/\.[^/.]+$/, '') || 'code-snippet';

      if (format === 'png') {
        const dataUrl = await toPng(node, {
          pixelRatio: exportScale,
          cacheBust: true,
          quality: 1,
        });
        triggerDownload(dataUrl, `${baseName}.png`);
        addToast('PNG image downloaded', `Exported at ${exportScale}x resolution.`, 'success');
      } else if (format === 'jpeg') {
        const dataUrl = await toJpeg(node, {
          pixelRatio: exportScale,
          cacheBust: true,
          quality: 0.95,
        });
        triggerDownload(dataUrl, `${baseName}.jpg`);
        addToast('JPEG image downloaded', `Exported at ${exportScale}x resolution.`, 'success');
      } else if (format === 'svg') {
        const dataUrl = await toSvg(node, {
          cacheBust: true,
        });
        triggerDownload(dataUrl, `${baseName}.svg`);
        addToast('SVG image downloaded', 'Exported as scalable vector image.', 'success');
      }
    } catch (err) {
      console.error('Export failed: ', err);
      addToast('Export failed', 'An error occurred while generating the image.', 'error');
    } finally {
      setIsExporting(null);
    }
  };

  // Copy Image directly to clipboard (with canvas fallback)
  const handleCopyImage = async () => {
    if (!previewCardRef.current || isExporting) return;

    try {
      setIsExporting('copy-image');
      const node = previewCardRef.current;

      const blob = await toBlob(node, {
        pixelRatio: exportScale,
        cacheBust: true,
      });

      if (!blob) {
        throw new Error('Failed to generate image blob');
      }

      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
        addToast('Image copied to clipboard', 'You can now paste it directly into chats or documents.', 'success');
      } else {
        // Fallback: download PNG if clipboard write is unsupported in current browser context
        const dataUrl = URL.createObjectURL(blob);
        triggerDownload(dataUrl, 'code-snippet.png');
        URL.revokeObjectURL(dataUrl);
        addToast('Clipboard write unsupported', 'PNG downloaded to your device instead.', 'info');
      }
    } catch (err) {
      console.error('Copy image failed: ', err);
      // Attempt fallback download on error
      try {
        const fallbackUrl = await toPng(previewCardRef.current, { pixelRatio: exportScale });
        triggerDownload(fallbackUrl, 'code-snippet.png');
        addToast('Clipboard permission denied', 'PNG downloaded directly to your device instead.', 'info');
      } catch {
        addToast('Copy image failed', 'Could not access clipboard or render canvas.', 'error');
      }
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Language selector & Auto-detect indicator */}
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
            <option value="auto">
              Auto Detect ({getLanguageMetadata(detectedLanguage).name})
            </option>
            <optgroup label="Supported Languages">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </optgroup>
          </select>

          {selectedLanguage === 'auto' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              <Sparkles size={11} />
              <span>{langMeta.name}</span>
            </span>
          )}
        </div>

        {/* Theme Swatches */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-6 h-6 rounded-full bg-gradient-to-tr ${t.bg} border-2 transition-transform cursor-pointer shrink-0 ${
                theme === t.id ? 'scale-125 border-white shadow-md' : 'border-transparent hover:scale-110'
              }`}
              title={t.label}
              aria-label={t.label}
            />
          ))}
        </div>

        {/* Window Style Selection */}
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

        {/* Line Numbers Toggle */}
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showLineNumbers}
            onChange={(e) => setShowLineNumbers(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
          />
          <span>Line Numbers</span>
        </label>
      </div>

      {/* Main Grid: Code Input & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Source Code TextArea (Dark Mode Fixed) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
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

            {/* Dark mode fixed textarea: dark:bg-slate-950 and dark:text-slate-100 */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed shadow-inner"
              placeholder="Paste or write your code snippet here..."
              spellCheck={false}
            />
          </div>

          {/* Filename and Font Settings */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-400 whitespace-nowrap">Filename:</label>
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder={langMeta.defaultFilename}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold">Font:</span>
                {[12, 13, 14, 16].map((sz) => (
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

              <div className="flex items-center gap-2">
                <span className="font-bold">DPR:</span>
                {[1, 2, 3].map((scale) => (
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

        {/* Live Preview & Action Buttons */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Card Container for Export */}
          <div
            ref={previewCardRef}
            className={`rounded-3xl bg-gradient-to-tr ${selectedTheme.bg} shadow-2xl transition-all duration-300 overflow-hidden flex items-center justify-center`}
            style={{ padding: `${padding}px` }}
          >
            {/* Embedded styles ensure syntax highlighting works flawlessly in exported PNG, SVG, JPEG */}
            <style>{`
              .vortex-code-highlight {
                color: #e6edf3;
              }
              .vortex-code-highlight .hljs-keyword { color: #ff7b72; font-weight: 600; }
              .vortex-code-highlight .hljs-built_in { color: #ffa657; }
              .vortex-code-highlight .hljs-type { color: #ff7b72; }
              .vortex-code-highlight .hljs-literal { color: #79c0ff; }
              .vortex-code-highlight .hljs-number { color: #79c0ff; }
              .vortex-code-highlight .hljs-string { color: #a5d6ff; }
              .vortex-code-highlight .hljs-comment { color: #8b949e; font-style: italic; }
              .vortex-code-highlight .hljs-function { color: #d2a8ff; }
              .vortex-code-highlight .hljs-title { color: #d2a8ff; font-weight: 600; }
              .vortex-code-highlight .hljs-params { color: #e6edf3; }
              .vortex-code-highlight .hljs-variable { color: #ffa657; }
              .vortex-code-highlight .hljs-attr { color: #79c0ff; }
              .vortex-code-highlight .hljs-tag { color: #7ee787; }
              .vortex-code-highlight .hljs-name { color: #7ee787; }
              .vortex-code-highlight .hljs-selector-tag { color: #ff7b72; }
              .vortex-code-highlight .hljs-selector-class { color: #7ee787; }
              .vortex-code-highlight .hljs-selector-id { color: #d2a8ff; }
              .vortex-code-highlight .hljs-property { color: #79c0ff; }
              .vortex-code-highlight .hljs-operator { color: #ff7b72; }
              .vortex-code-highlight .hljs-punctuation { color: #c9d1d9; }
              .vortex-code-highlight .hljs-meta { color: #ffa657; }
              .vortex-code-highlight .hljs-subst { color: #c9d1d9; }
            `}</style>

            {/* Terminal Window Box */}
            <div className="w-full rounded-2xl bg-[#0d1117]/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden text-left">
              {/* Window Title Bar */}
              {windowStyle !== 'none' && (
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/25">
                  {windowStyle === 'mac' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-xs" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-xs" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-xs" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-0.5 bg-slate-400" />
                      <div className="w-2.5 h-2.5 border border-slate-400" />
                      <div className="text-[10px] text-slate-400 font-bold">x</div>
                    </div>
                  )}

                  <span className="text-[11px] font-mono text-slate-400 font-medium px-2 py-0.5 rounded-md bg-white/5">
                    {currentFilename}
                  </span>

                  <div className="w-8" />
                </div>
              )}

              {/* Code Lines with Syntax Highlighting */}
              <div
                className="p-4 sm:p-6 font-mono overflow-x-auto leading-relaxed vortex-code-highlight"
                style={{ fontSize: `${fontSize}px` }}
              >
                <table className="w-full border-collapse">
                  <tbody>
                    {highlightedLines.map((lineHtml, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        {showLineNumbers && (
                          <td className="pr-4 text-slate-600 select-none text-right font-mono text-[11px] w-8 align-top">
                            {idx + 1}
                          </td>
                        )}
                        <td
                          className="whitespace-pre font-mono"
                          dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Controls Footer: Padding & Actions */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            {/* Padding slider & Raw code copy */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sliders size={13} />
                  <span>Card Padding:</span>
                </span>
                <input
                  type="range"
                  min="16"
                  max="64"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-28 accent-indigo-500 cursor-pointer"
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

              {/* Download buttons for PNG, SVG, JPEG */}
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
