import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Copy, Sparkles, Wand2, Gamepad2, Terminal, Shield, Smile, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

type Theme = 'gaming' | 'cyberpunk' | 'fantasy' | 'tech' | 'aesthetic' | 'funny';

const THEME_WORDS: Record<Theme, { prefixes: string[]; roots: string[]; suffixes: string[] }> = {
  gaming: {
    prefixes: ['Apex', 'Shadow', 'Vortex', 'Ghost', 'Hyper', 'Nova', 'Rogue', 'Phantom', 'Blaze', 'Venom', 'Strike', 'Silent', 'Titan', 'Zero'],
    roots: ['Sniper', 'Slayer', 'Reaper', 'Knight', 'Viper', 'Hunter', 'Clutch', 'Drifter', 'Raven', 'Ranger', 'Striker', 'Wraith', 'Matrix', 'Nexus'],
    suffixes: ['X', 'GG', 'FPS', 'God', 'Pro', 'Elite', 'Prime', '99', 'TV', 'Op', 'Playz', 'V2']
  },
  cyberpunk: {
    prefixes: ['Cyber', 'Neon', 'Glitch', 'Binary', 'Zero', 'Synth', 'Net', 'Hex', 'Void', 'Vector', 'Pixel', 'Logic', 'Chrono', 'Byte'],
    roots: ['Runner', 'Hacker', 'Ghost', 'Daemon', 'Pulse', 'Cipher', 'Proxy', 'Node', 'Static', 'Protocol', 'Overdrive', 'Socket', 'Drift'],
    suffixes: ['EXE', 'IO', 'DEV', 'NET', 'SYS', '404', 'NULL', 'BIT', 'RAW', '2077', 'CORE']
  },
  fantasy: {
    prefixes: ['Astra', 'Eldritch', 'Dragon', 'Frost', 'Lunar', 'Solar', 'Mystic', 'Rune', 'Valiant', 'Shadow', 'Arcane', 'Iron', 'Thunder'],
    roots: ['Blade', 'Heart', 'Fang', 'Caster', 'Walker', 'Weaver', 'Bane', 'Gryphon', 'Soul', 'Warden', 'Mage', 'Keeper', 'Song'],
    suffixes: ['borne', 'heart', 'storm', 'fire', 'claw', 'crown', 'thorn', 'shield', 'shade', 'flare']
  },
  tech: {
    prefixes: ['Code', 'Byte', 'Stack', 'Dev', 'Algo', 'Cloud', 'Data', 'Micro', 'Quantum', 'Script', 'Logic', 'Async', 'Hyper', 'Mono'],
    roots: ['Craft', 'Flow', 'Hub', 'Engine', 'Forge', 'Base', 'Scale', 'Link', 'Box', 'Sync', 'Lab', 'Nest', 'Mesh'],
    suffixes: ['js', 'dev', 'io', 'ai', 'hq', 'lab', 'app', 'sys', 'tech', 'box']
  },
  aesthetic: {
    prefixes: ['Velvet', 'Cloud', 'Misty', 'Cosmic', 'Solar', 'Opal', 'Lilac', 'Amber', 'Aura', 'Silky', 'Pastel', 'Echo', 'Petal', 'Moon'],
    roots: ['Bloom', 'Haze', 'Dusk', 'Glow', 'Dream', 'Breeze', 'Chime', 'Wave', 'Muse', 'Vibe', 'Lullaby', 'Cascade', 'Feather'],
    suffixes: ['core', 'ly', 'ia', 'tea', 'sky', 'rose', 'star', 'soft', 'glow']
  },
  funny: {
    prefixes: ['Mega', 'Captain', 'Dr', 'Sir', 'Silly', 'Chunky', 'Atomic', 'Sleepy', 'Lord', 'Crazy', 'Sneaky', 'Flying', 'Spicy', 'Potato'],
    roots: ['Pancake', 'Noodle', 'Waffle', 'Banana', 'Penguin', 'Taco', 'Muffin', 'Pickle', 'Hamster', 'Cactus', 'Otter', 'Blob'],
    suffixes: ['Saurus', 'Boi', 'Man', 'inator', 'zilla', 'Pants', 'McCool', '9000', 'Boss']
  }
};

export const UsernameGenerator: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('gaming');
  const [customPrefix, setCustomPrefix] = useState<string>('');
  const [customSuffix, setCustomSuffix] = useState<string>('');
  const [addNumbers, setAddNumbers] = useState<boolean>(true);
  const [useLeetSpeak, setUseLeetSpeak] = useState<boolean>(false);
  const [separator, setSeparator] = useState<'' | '_' | '.' | '-'>('');
  const [usernames, setUsernames] = useState<string[]>([]);

  const { copyToClipboard } = useClipboard();

  const toLeet = (str: string) => {
    return str
      .replace(/e/gi, '3')
      .replace(/a/gi, '4')
      .replace(/o/gi, '0')
      .replace(/i/gi, '1')
      .replace(/s/gi, '5');
  };

  const generateUsernames = useCallback(() => {
    const list: string[] = [];
    const { prefixes, roots, suffixes } = THEME_WORDS[theme];

    const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < 12; i++) {
      const p = customPrefix.trim() || pickRandom(prefixes);
      const r = pickRandom(roots);
      const s = customSuffix.trim() || (Math.random() > 0.4 ? pickRandom(suffixes) : '');
      
      let num = '';
      if (addNumbers) {
        num = Math.random() > 0.3 ? Math.floor(Math.random() * 90 + 10).toString() : '';
      }

      let candidate = '';
      const parts = [p, r, s].filter(Boolean);

      if (separator) {
        candidate = parts.join(separator) + num;
      } else {
        candidate = parts.join('') + num;
      }

      if (useLeetSpeak) {
        candidate = toLeet(candidate);
      }

      list.push(candidate);
    }

    setUsernames(Array.from(new Set(list)));
  }, [theme, customPrefix, customSuffix, addNumbers, useLeetSpeak, separator]);

  useEffect(() => {
    generateUsernames();
  }, [generateUsernames]);

  const themeTabs = [
    { id: 'gaming', label: 'Gaming & Esports', icon: Gamepad2 },
    { id: 'cyberpunk', label: 'Cyberpunk & Hacker', icon: Terminal },
    { id: 'fantasy', label: 'Fantasy & RPG', icon: Shield },
    { id: 'tech', label: 'Tech & Dev', icon: Sparkles },
    { id: 'aesthetic', label: 'Aesthetic & Chill', icon: Wand2 },
    { id: 'funny', label: 'Funny & Wild', icon: Smile },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Theme Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {themeTabs.map(t => {
          const Icon = t.icon;
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as Theme)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-brand-500'} />
              <span className="text-center truncate w-full">{t.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Control Customizer Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Custom Prefix</label>
            <input
              type="text"
              value={customPrefix}
              onChange={(e) => setCustomPrefix(e.target.value)}
              placeholder="e.g. Neo, Cyber, Dr"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Custom Suffix</label>
            <input
              type="text"
              value={customSuffix}
              onChange={(e) => setCustomSuffix(e.target.value)}
              placeholder="e.g. GG, Pro, X"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Separator Style</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value as '' | '_' | '.' | '-')}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="">None (ShadowBlade)</option>
              <option value="_">Underscore (Shadow_Blade)</option>
              <option value=".">Dot (Shadow.Blade)</option>
              <option value="-">Hyphen (Shadow-Blade)</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={addNumbers}
                onChange={(e) => setAddNumbers(e.target.checked)}
                className="w-4 h-4 accent-brand-600 rounded"
              />
              <span>Include Numbers</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={useLeetSpeak}
                onChange={(e) => setUseLeetSpeak(e.target.checked)}
                className="w-4 h-4 accent-brand-600 rounded"
              />
              <span>1337 Speak</span>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={generateUsernames}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>Generate New Batch</span>
          </button>
        </div>
      </div>

      {/* Generated Usernames Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {usernames.map((name, idx) => (
          <div
            key={idx}
            onClick={() => copyToClipboard(name, 'Username copied!')}
            className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/10 flex items-center justify-between cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-400 flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {name}
              </span>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all shrink-0">
              <Copy size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
