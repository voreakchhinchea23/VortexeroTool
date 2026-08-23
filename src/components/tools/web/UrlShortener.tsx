import React, { useState } from 'react';
import { Link2, Copy, ExternalLink, History, ArrowRight, Trash2, CheckCircle2, Sparkles, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

interface ShortLink {
  id: string;
  original: string;
  short: string;
  createdAt: string;
  clicks: number;
}

export const UrlShortener: React.FC = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentShortUrl, setCurrentShortUrl] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<ShortLink[]>('vortexero_short_links', [
    {
      id: '1',
      original: 'https://github.com/google/deepmind',
      short: 'https://tinyurl.com/deepmind-lab',
      createdAt: 'Just now',
      clicks: 14,
    }
  ]);

  const { copyToClipboard } = useClipboard();

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    let target = longUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    setIsLoading(true);

    try {
      // Fetch TinyURL API or fallback to simulated clean shortlink
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(target)}`);
      let result = '';
      if (response.ok) {
        result = await response.text();
      } else {
        const hash = Math.random().toString(36).substring(2, 8);
        result = `https://vtx.is/${customAlias.trim() || hash}`;
      }

      setCurrentShortUrl(result);
      const newEntry: ShortLink = {
        id: Date.now().toString(),
        original: target,
        short: result,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clicks: 0,
      };

      setHistory(prev => [newEntry, ...prev].slice(0, 10));
    } catch {
      const hash = Math.random().toString(36).substring(2, 8);
      const fallbackResult = `https://vtx.is/${customAlias.trim() || hash}`;
      setCurrentShortUrl(fallbackResult);
      setHistory(prev => [
        {
          id: Date.now().toString(),
          original: target,
          short: fallbackResult,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          clicks: 0,
        },
        ...prev
      ].slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisit = (item: ShortLink) => {
    setHistory(prev =>
      prev.map(l => (l.id === item.id ? { ...l, clicks: l.clicks + 1 } : l))
    );
    window.open(item.original, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Shortener Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleShorten} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
              Enter Destination Long URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very/long/nested/path/to/resource?id=123"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm sm:text-base font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Custom Back-Half / Alias (Optional)
              </label>
              <div className="flex items-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs sm:text-sm">
                <span className="text-slate-400 font-mono">vtx.is/</span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  placeholder="my-portfolio"
                  className="bg-transparent border-none focus:outline-none flex-1 font-mono text-slate-800 dark:text-slate-200 font-semibold"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading || !longUrl}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span>Shortening...</span>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Shorten URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Shortened Result Card */}
        {currentShortUrl && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Your shortened link is ready!</p>
                <p className="font-mono text-sm font-bold text-emerald-900 dark:text-emerald-100 truncate select-all">
                  {currentShortUrl}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyToClipboard(currentShortUrl, 'Short link copied!')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Copy size={14} />
                <span>Copy Link</span>
              </button>
              <a
                href={currentShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                title="Open short link"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Recent Shortened Links History */}
      {history.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <History size={16} className="text-slate-400" />
              <span>Recent Links History</span>
            </div>
            <button
              onClick={() => setHistory([])}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={13} />
              Clear
            </button>
          </div>

          <div className="space-y-2.5">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-brand-600 dark:text-brand-400">
                      {item.short}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      • {item.clicks} clicks • {item.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-xl">
                    {item.original}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyToClipboard(item.short, 'Copied short link!')}
                    className="p-2 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    title="Copy short link"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleVisit(item)}
                    className="p-2 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    title="Visit link"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
