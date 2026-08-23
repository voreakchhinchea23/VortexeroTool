import React, { useState } from 'react';
import { Tv, ExternalLink, Sparkles, LayoutGrid, Layers, Play, Volume2, ShieldCheck, Monitor, Radio } from 'lucide-react';

export const MultiWatchesStudio: React.FC = () => {
  const [selectedLayout, setSelectedLayout] = useState<'2x2' | '1+3' | '3x1'>('2x2');
  const [showEmbed, setShowEmbed] = useState(false);

  const appUrl = 'https://multi-watches.vercel.app/';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#180e29] via-[#241242] to-[#120824] text-white p-6 sm:p-10 border border-purple-500/30 shadow-2xl shadow-purple-950/40">
        {/* Animated Glow Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Description (7/12) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Featured Ecosystem App</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              MultiWatches <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">Live Stream Hub</span>
            </h2>

            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed">
              Watch your favorite <strong>Twitch, YouTube & Kick</strong> streamers together at the exact same time. Customize multi-stream grid layouts, sync audio channels, and never miss a live moment across multiple esports tournaments and creator broadcasts.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-500/30 active:scale-95 transition-all cursor-pointer"
              >
                <Tv size={18} />
                <span>Launch MultiWatches App</span>
                <ExternalLink size={15} />
              </a>

              <button
                onClick={() => setShowEmbed(!showEmbed)}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md border border-white/10 transition-all cursor-pointer"
              >
                <Monitor size={16} />
                <span>{showEmbed ? 'Hide Embedded View' : 'Preview Embedded View'}</span>
              </button>
            </div>
          </div>

          {/* Right Visual Multi-Stream Layout Mockup (5/12) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-black/60 border border-purple-500/30 p-3 shadow-2xl backdrop-blur-xl space-y-2">
              <div className="flex items-center justify-between px-2 text-[11px] font-bold text-purple-300">
                <div className="flex items-center gap-1.5">
                  <Radio size={13} className="text-rose-500 animate-pulse" />
                  <span>Quad Stream Layout (4-Grid)</span>
                </div>
                <span className="text-xs font-mono text-emerald-400">4 CHANNELS SYNCED</span>
              </div>

              {/* Animated 4-Stream Screen Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Streamer 1', game: 'Valorant Finals', color: 'from-purple-900 to-indigo-950', badge: '🔴 1080p60' },
                  { name: 'Streamer 2', game: 'League Worlds', color: 'from-pink-900 to-purple-950', badge: '🔴 1080p60' },
                  { name: 'Streamer 3', game: 'CS2 Major', color: 'from-blue-900 to-indigo-950', badge: '🔴 1080p60' },
                  { name: 'Streamer 4', game: 'Lo-Fi Chill Beats', color: 'from-violet-900 to-pink-950', badge: '🔊 Audio On' },
                ].map((stream, idx) => (
                  <div
                    key={idx}
                    className={`h-24 rounded-xl bg-gradient-to-br ${stream.color} border border-purple-500/20 p-2 flex flex-col justify-between relative group hover:border-purple-400/50 transition-all`}
                  >
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="font-extrabold text-white truncate max-w-[80px]">{stream.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/50 text-rose-400 font-mono font-bold">
                        {stream.badge}
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Play size={10} className="fill-white" />
                      </div>
                    </div>

                    <p className="text-[9px] text-purple-300/80 truncate">{stream.game}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded View If Opened */}
      {showEmbed && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tv size={18} className="text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live MultiWatches Preview</h3>
            </div>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Open in New Tab</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-[620px] bg-slate-950">
            <iframe
              src={appUrl}
              title="MultiWatches Stream Viewer"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Highlights & Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <LayoutGrid size={20} />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Multi-Grid Split Screen</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Choose from 2x2, 1+3, 3x1, or custom grid matrices to watch multiple tournament POVs simultaneously.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Volume2 size={20} />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Independent Audio Mixer</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Mute, solo, or balance volume levels across different streams without switching tabs.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Zero Account Setup</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Instant client-side stream aggregation without logins, bloatware, or tracking scripts.
          </p>
        </div>
      </div>
    </div>
  );
};
