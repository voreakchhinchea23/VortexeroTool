import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Copy, Check, ShieldCheck, Sparkles, Sliders, History, Trash2, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useClipboard } from '../../../hooks/useClipboard';

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState<number>(18);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const { copyToClipboard } = useClipboard();

  const generatePasswords = useCallback(() => {
    let charset = '';
    const upper = avoidAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = avoidAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    const numbers = avoidAmbiguous ? '23456789' : '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (useUpper) charset += upper;
    if (useLower) charset += lower;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (!charset) charset = lower; // fallback

    const newPasswords: string[] = [];
    for (let q = 0; q < quantity; q++) {
      let pwd = '';
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        pwd += charset[array[i] % charset.length];
      }
      newPasswords.push(pwd);
    }

    setPasswords(newPasswords);
    if (newPasswords.length > 0) {
      setHistory(prev => Array.from(new Set([...newPasswords, ...prev])).slice(0, 15));
    }

    // Confetti effect if password is super strong (length >= 16 and all charsets enabled)
    if (length >= 16 && useUpper && useLower && useNumbers && useSymbols) {
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore if canvas not ready
      }
    }
  }, [length, useUpper, useLower, useNumbers, useSymbols, avoidAmbiguous, quantity]);

  useEffect(() => {
    generatePasswords();
  }, [generatePasswords]);

  // Calculate Entropy & Strength
  const getEntropy = () => {
    let poolSize = 0;
    if (useUpper) poolSize += 26;
    if (useLower) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += 30;
    if (poolSize === 0) poolSize = 26;

    const entropy = Math.round(length * Math.log2(poolSize));
    return entropy;
  };

  const entropy = getEntropy();

  const getStrengthMeta = (ent: number) => {
    if (ent < 35) return { label: 'Very Weak', color: 'bg-rose-500', text: 'text-rose-500', width: '20%', crackTime: 'A few milliseconds' };
    if (ent < 60) return { label: 'Weak', color: 'bg-orange-500', text: 'text-orange-500', width: '40%', crackTime: 'A few minutes' };
    if (ent < 80) return { label: 'Good', color: 'bg-amber-500', text: 'text-amber-500', width: '65%', crackTime: 'Several years' };
    if (ent < 110) return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500', width: '85%', crackTime: 'Hundreds of millennia' };
    return { label: 'Unbreakable', color: 'bg-purple-500', text: 'text-purple-500', width: '100%', crackTime: 'Trillions of eons' };
  };

  const strength = getStrengthMeta(entropy);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Main Display Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Password</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <span className={`text-xs font-bold ${strength.text}`}>{strength.label} ({entropy} bits)</span>
          </div>
        </div>

        {/* Primary Password Field */}
        <div className="flex items-center justify-between gap-4 py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
          <span className={`font-mono text-xl sm:text-2xl font-bold tracking-wider break-all select-all text-slate-900 dark:text-white ${!showPassword ? 'blur-sm select-none' : ''}`}>
            {passwords[0] || 'Generating...'}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generatePasswords}
              className="p-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-transform active:rotate-180 duration-300"
              title="Generate new password"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={() => copyToClipboard(passwords[0], 'Password copied!')}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="mt-4">
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
              style={{ width: strength.width }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Estimated time to brute force: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{strength.crackTime}</strong></span>
            <span>Entropy: <strong className="text-slate-700 dark:text-slate-200 font-mono">{entropy} bits</strong></span>
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders & Length */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Sliders size={18} className="text-brand-500" />
            <span>Customize Parameters</span>
          </div>

          {/* Length Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password Length</label>
              <span className="px-2.5 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-300 font-mono font-bold text-sm border border-brand-200/60 dark:border-brand-800/60">
                {length} chars
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>4</span>
              <span>16</span>
              <span>32</span>
              <span>64</span>
            </div>
          </div>

          {/* Bulk Quantity */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Generate in Bulk</label>
              <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                {quantity} {quantity === 1 ? 'password' : 'passwords'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Character Rules Checkboxes */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span>Character Rules</span>
          </div>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Uppercase Letters</span>
              <p className="text-xs text-slate-400 font-mono">A B C D E F G ...</p>
            </div>
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded-lg cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Lowercase Letters</span>
              <p className="text-xs text-slate-400 font-mono">a b c d e f g ...</p>
            </div>
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded-lg cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Numbers</span>
              <p className="text-xs text-slate-400 font-mono">0 1 2 3 4 5 6 7 8 9</p>
            </div>
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded-lg cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Symbols & Punctuation</span>
              <p className="text-xs text-slate-400 font-mono">! @ # $ % ^ & * ( ) _ +</p>
            </div>
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded-lg cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Exclude Ambiguous Characters</span>
              <p className="text-xs text-slate-400 font-mono">Avoids (l, 1, I, O, 0)</p>
            </div>
            <input
              type="checkbox"
              checked={avoidAmbiguous}
              onChange={(e) => setAvoidAmbiguous(e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded-lg cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Bulk Passwords List */}
      {passwords.length > 1 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Generated Batch ({passwords.length})
            </h4>
            <button
              onClick={() => copyToClipboard(passwords.join('\n'), 'Copied all passwords!')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Copy All
            </button>
          </div>
          <div className="space-y-2">
            {passwords.map((pwd, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 font-mono text-sm"
              >
                <span className="truncate mr-3 text-slate-800 dark:text-slate-200">{pwd}</span>
                <button
                  onClick={() => copyToClipboard(pwd, 'Copied password!')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent History */}
      {history.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <History size={16} className="text-slate-400" />
              <span>Recent Passwords History (Session)</span>
            </div>
            <button
              onClick={() => setHistory([])}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 size={13} />
              Clear History
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((pwd, idx) => (
              <button
                key={idx}
                onClick={() => copyToClipboard(pwd, 'Copied from history!')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 dark:hover:text-brand-300 font-mono text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center gap-2 group"
              >
                <span className="truncate max-w-[140px]">{pwd}</span>
                <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
