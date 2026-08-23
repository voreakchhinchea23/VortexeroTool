import React from 'react';
import { Sparkles, Shield, Heart, Github, Coffee, Tv, ExternalLink } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: any) => void;
  onSelectTool: (id: string) => void;
  onOpenDonate?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onSelectTool, onOpenDonate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#090d16]/60 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <Sparkles size={18} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Vortexero<span className="text-brand-600 dark:text-brand-400">Tool</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              An all-in-one developer and productivity utility platform built with modern web technologies. Fast, accessible, client-side, and privacy-first.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Shield size={14} />
                <span>Zero server logging • 100% Client-side</span>
              </div>
              {onOpenDonate && (
                <button
                  onClick={onOpenDonate}
                  className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <Coffee size={13} />
                  <span>Buy Me a Coffee</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Tools & Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Featured & Apps</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="https://multi-watches.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1.5"
                >
                  <Tv size={13} />
                  <span>MultiWatches App 🔴</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <button onClick={() => onSelectTool('ambient-sounds')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Ambient Chill Sounds
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('digital-clock')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Digital Clock Studio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('cv-builder')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  CV & Resume Builder
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('typing-test')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Typing Speed Practice
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Categories</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onSelectCategory('productivity')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Productivity & Focus
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('security')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Security & Auth
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('web')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Web & Streaming
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('design')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Design & CSS
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('developer')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Developer Tools
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} VortexeroTool. All tools free & open-source.</p>
          <a
            href="https://github.com/voreakchhinchea23"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-semibold"
          >
            <Github size={15} />
            <span>Built by @voreakchhinchea23</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
