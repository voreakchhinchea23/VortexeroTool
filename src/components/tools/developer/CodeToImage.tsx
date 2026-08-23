import React, { useState, useRef } from 'react';
import { Download, Copy, Sparkles, Terminal, Code2, Layers, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

const THEMES = [
  { id: 'vivid_chroma', label: 'Vivid Chroma', bg: 'from-purple-600 via-indigo-600 to-pink-500' },
  { id: 'midnight_neon', label: 'Midnight Neon', bg: 'from-cyan-500 via-blue-600 to-indigo-900' },
  { id: 'sunset_blaze', label: 'Sunset Blaze', bg: 'from-amber-500 via-rose-500 to-purple-600' },
  { id: 'emerald_matrix', label: 'Emerald Matrix', bg: 'from-emerald-500 via-teal-600 to-slate-900' },
  { id: 'obsidian_dark', label: 'Obsidian Pure', bg: 'from-slate-900 via-slate-950 to-black' },
  { id: 'tokyo_lavender', label: 'Tokyo Lavender', bg: 'from-fuchsia-400 via-purple-500 to-indigo-500' },
];

const LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'HTML / CSS',
  'SQL',
  'Rust',
  'Go',
  'JSON',
  'Bash',
];

export const CodeToImage: React.FC = () => {
  const [code, setCode] = useState<string>(`// ✨ Supercharge your workflow with VortexeroTool
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

export default handleAuth;`);

  const [language, setLanguage] = useState<string>('TypeScript');
  const [theme, setTheme] = useState<string>('vivid_chroma');
  const [windowStyle, setWindowStyle] = useState<'mac' | 'windows' | 'none'>('mac');
  const [padding, setPadding] = useState<number>(32);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);

  const previewCardRef = useRef<HTMLDivElement>(null);
  const { copyToClipboard } = useClipboard();

  const lines = code.split('\n');

  const selectedTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Lang:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Swatches */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-6 h-6 rounded-full bg-gradient-to-tr ${t.bg} border-2 transition-transform cursor-pointer shrink-0 ${
                theme === t.id ? 'scale-125 border-white shadow-md' : 'border-transparent'
              }`}
              title={t.label}
            />
          ))}
        </div>

        {/* Window Style */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setWindowStyle('mac')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              windowStyle === 'mac' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            macOS
          </button>
          <button
            onClick={() => setWindowStyle('windows')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              windowStyle === 'windows' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            Windows
          </button>
          <button
            onClick={() => setWindowStyle('none')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              windowStyle === 'none' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            None
          </button>
        </div>

        {/* Line Numbers Toggle */}
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showLineNumbers}
            onChange={(e) => setShowLineNumbers(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
          />
          <span>Line Numbers</span>
        </label>
      </div>

      {/* Code Input & Canvas Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Input TextArea */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Source Code</h3>
            <span className="text-xs font-mono text-slate-400">{lines.length} lines</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
            placeholder="Paste your code snippet here..."
          />
        </div>

        {/* Live Card Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div
            ref={previewCardRef}
            className={`rounded-3xl bg-gradient-to-tr ${selectedTheme.bg} shadow-2xl transition-all duration-300 overflow-hidden flex items-center justify-center`}
            style={{ padding: `${padding}px` }}
          >
            {/* Terminal Window Box */}
            <div className="w-full rounded-2xl bg-[#0d1117]/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden text-left">
              {/* Window Title Bar */}
              {windowStyle !== 'none' && (
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/20">
                  {windowStyle === 'mac' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-xs" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-xs" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-xs" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <div className="w-2.5 h-0.5 bg-slate-400" />
                      <div className="w-2.5 h-2.5 border border-slate-400" />
                      <div className="text-[10px] text-slate-400">✕</div>
                    </div>
                  )}

                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                    snippet.{language.toLowerCase().replace(/[^a-z]/g, '')}
                  </span>
                  <div className="w-8" />
                </div>
              )}

              {/* Code Lines Body */}
              <div className="p-4 sm:p-6 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                <table className="w-full border-collapse">
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        {showLineNumbers && (
                          <td className="pr-4 text-slate-600 select-none text-right font-mono text-[11px] w-6 align-top">
                            {idx + 1}
                          </td>
                        )}
                        <td className="whitespace-pre font-mono text-slate-200">{line || ' '}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Card Padding:</span>
              <input
                type="range"
                min="16"
                max="64"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-28 accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-500">{padding}px</span>
            </div>

            <button
              onClick={() => {
                copyToClipboard(code, 'Code snippet copied to clipboard!');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Copy size={14} />
              <span>Copy Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
