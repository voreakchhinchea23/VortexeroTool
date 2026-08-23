import React, { useState, useMemo } from 'react';
import { SearchCode, CheckCircle2, XCircle, Sparkles, Copy, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

const CHEATSHEETS = [
  { name: 'Email Address', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', test: 'Contact support@vortexerotool.dev or hello.world@company.co.uk' },
  { name: 'URL / Web Link', pattern: 'https?:\\/\\/[\\w\\.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+', test: 'Visit https://react.dev or https://vortexero.dev/tools?q=web' },
  { name: 'IPv4 Address', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', test: 'Server IP is 192.168.1.1 and gateway 10.0.0.254' },
  { name: 'Hex Color', pattern: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b', test: 'Colors: #3b82f6, #fff, and #111827' },
  { name: 'Phone Number', pattern: '\\+?[0-9]{1,3}?[-.\\s]?\\(?[0-9]{2,4}\\)?[-.\\s]?[0-9]{3,4}[-.\\s]?[0-9]{3,4}', test: 'Call +1 (555) 234-5678 or 0812-345-6789' },
];

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testString, setTestString] = useState<string>(
    'Please contact our support team at support@vortexerotool.dev or developer@google.com for assistance.'
  );

  const { copyToClipboard } = useClipboard();

  const flagString = Object.entries(flags)
    .filter(([_, val]) => val)
    .map(([key]) => key)
    .join('');

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: null };

    try {
      const regex = new RegExp(pattern, flagString);
      const matches: { text: string; index: number; groups: string[] }[] = [];

      if (flags.g) {
        let match;
        let lastIndex = -1;
        while ((match = regex.exec(testString)) !== null) {
          if (match.index === lastIndex) {
            regex.lastIndex++;
            continue;
          }
          lastIndex = match.index;
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      return { matches, error: null };
    } catch (err: unknown) {
      return { matches: [], error: err instanceof Error ? err.message : String(err) };
    }
  }, [pattern, flagString, testString, flags.g]);

  const applyPreset = (preset: typeof CHEATSHEETS[0]) => {
    setPattern(preset.pattern);
    setTestString(preset.test);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Presets Bar */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-400 self-center mr-1">Common Patterns:</span>
        {CHEATSHEETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 transition-all cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Regex Pattern Input Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Regular Expression Pattern
        </label>

        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="font-mono text-lg font-bold text-brand-500 pl-2">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="[a-zA-Z0-9]+..."
            className="flex-1 bg-transparent font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white focus:outline-none"
          />
          <span className="font-mono text-lg font-bold text-brand-500">/</span>
          <span className="font-mono text-sm font-bold text-brand-600 dark:text-brand-400 pr-2">
            {flagString}
          </span>
        </div>

        {/* Flag Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <span className="text-xs font-bold text-slate-500">Flags:</span>
          {(['g', 'i', 'm', 's'] as const).map(flag => (
            <label key={flag} className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={flags[flag]}
                onChange={(e) => setFlags({ ...flags, [flag]: e.target.checked })}
                className="w-4 h-4 accent-brand-600 rounded"
              />
              <span className="font-mono font-bold uppercase">{flag}</span>
              <span className="text-slate-400 font-normal">
                ({flag === 'g' ? 'Global' : flag === 'i' ? 'Case-Insensitive' : flag === 'm' ? 'Multiline' : 'DotAll'})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Status or Error Banner */}
      {result.error ? (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
          <XCircle size={16} />
          <span>Regex Syntax Error: {result.error}</span>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Valid Pattern</span>
          </div>
          <span className="font-mono font-bold">{result.matches.length} Match(es) Found</span>
        </div>
      )}

      {/* Test String Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Test Input String
        </label>
        <textarea
          rows={5}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Paste or type test string..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y leading-relaxed"
        />
      </div>

      {/* Matches Inspector List */}
      {result.matches.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Matched Tokens ({result.matches.length})
          </h4>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {result.matches.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {m.text}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    (pos {m.index})
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(m.text, 'Copied match!')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0 ml-2"
                >
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
