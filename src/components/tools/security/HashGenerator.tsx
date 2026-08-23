import React, { useState, useEffect } from 'react';
import { Hash, CheckCircle2, XCircle, Copy, FileText, Check } from 'lucide-react';
import { computeHash, computeMD5 } from '../../../utils/cryptoUtils';
import { useClipboard } from '../../../hooks/useClipboard';

export const HashGenerator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('Hello Vortexero!');
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [verifyHash, setVerifyHash] = useState<string>('');
  
  const [hashes, setHashes] = useState({
    sha256: '',
    sha512: '',
    sha1: '',
    md5: '',
  });

  const { copyToClipboard } = useClipboard();

  useEffect(() => {
    let isCancelled = false;

    async function calculate() {
      if (!inputText) {
        setHashes({ sha256: '', sha512: '', sha1: '', md5: '' });
        return;
      }

      try {
        const [sha256, sha512, sha1] = await Promise.all([
          computeHash('SHA-256', inputText),
          computeHash('SHA-512', inputText),
          computeHash('SHA-1', inputText),
        ]);
        const md5 = computeMD5(inputText);

        if (!isCancelled) {
          setHashes({ sha256, sha512, sha1, md5 });
        }
      } catch (err) {
        console.error('Hash calculation error', err);
      }
    }

    calculate();
    return () => {
      isCancelled = true;
    };
  }, [inputText]);

  const formatHash = (h: string) => (isUppercase ? h.toUpperCase() : h.toLowerCase());

  // Check if verify hash matches any of the calculated hashes
  const cleanVerify = verifyHash.trim().toLowerCase();
  const matchedAlgorithm = cleanVerify
    ? Object.entries(hashes).find(([_, val]) => val.toLowerCase() === cleanVerify)?.[0]
    : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText size={16} className="text-brand-500" />
            <span>Input String</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={isUppercase}
              onChange={(e) => setIsUppercase(e.target.checked)}
              className="w-4 h-4 accent-brand-600 rounded"
            />
            <span>UPPERCASE Hashes</span>
          </label>
        </div>

        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste your text to hash..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
        />
      </div>

      {/* Hash Verification / Matcher Tool */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Verify / Compare Hash (Optional)
        </label>
        <input
          type="text"
          value={verifyHash}
          onChange={(e) => setVerifyHash(e.target.value)}
          placeholder="Paste an existing checksum to verify match..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        {verifyHash.trim() && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-bold ${
              matchedAlgorithm
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
            }`}
          >
            {matchedAlgorithm ? (
              <>
                <CheckCircle2 size={18} />
                <span>Valid Match! Matches computed {matchedAlgorithm.toUpperCase()} hash.</span>
              </>
            ) : (
              <>
                <XCircle size={18} />
                <span>No Match. The provided hash does not match any computed digest.</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hashes Output List */}
      <div className="space-y-3">
        {[
          { key: 'sha256', name: 'SHA-256 (Secure & Recommended)', value: hashes.sha256 },
          { key: 'sha512', name: 'SHA-512 (High Security)', value: hashes.sha512 },
          { key: 'sha1', name: 'SHA-1 (Legacy)', value: hashes.sha1 },
          { key: 'md5', name: 'MD5 (Checksum)', value: hashes.md5 },
        ].map(item => {
          const formatted = formatHash(item.value);
          const isMatched = matchedAlgorithm === item.key;

          return (
            <div
              key={item.key}
              className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                isMatched
                  ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Hash size={14} className="text-brand-500" />
                  {item.name}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {item.value ? `${item.value.length * 4} bits` : ''}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70">
                <span className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 break-all select-all">
                  {formatted || '—'}
                </span>
                <button
                  disabled={!formatted}
                  onClick={() => copyToClipboard(formatted, `Copied ${item.key.toUpperCase()} hash!`)}
                  className="p-2 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-colors shrink-0"
                  title="Copy hash"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
