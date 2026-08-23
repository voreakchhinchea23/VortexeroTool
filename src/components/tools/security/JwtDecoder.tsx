import React, { useState, useMemo } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Clock, Copy, Sparkles, Key } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlZvcmVhayBDaGhpbmNoZWEiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NDAwMDAwMDAsImV4cCI6MTgwMDAwMDAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const JwtDecoder: React.FC = () => {
  const [token, setToken] = useState<string>(SAMPLE_JWT);
  const { copyToClipboard } = useClipboard();

  const decoded = useMemo(() => {
    if (!token.trim()) return null;

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT structure. A JWT must consist of three dot-separated base64-encoded segments.' };
    }

    try {
      const base64Decode = (str: string) => {
        // Replace URL-safe chars
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
          case 0: break;
          case 2: output += '=='; break;
          case 3: output += '='; break;
          default: throw new Error('Illegal base64url string!');
        }
        return decodeURIComponent(
          atob(output)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const header = JSON.parse(base64Decode(parts[0]));
      const payload = JSON.parse(base64Decode(parts[1]));
      const signature = parts[2];

      return {
        header,
        payload,
        signature,
        rawHeader: parts[0],
        rawPayload: parts[1],
        rawSig: parts[2],
        error: null,
      };
    } catch (err: unknown) {
      return { error: `Failed to decode JWT: ${err instanceof Error ? err.message : String(err)}` };
    }
  }, [token]);

  const getExpirationStatus = (exp?: number) => {
    if (!exp) return null;
    const now = Math.floor(Date.now() / 1000);
    const diff = exp - now;

    if (diff > 0) {
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      return {
        expired: false,
        text: `Valid (Expires in ${days}d ${hours}h)`,
        date: new Date(exp * 1000).toLocaleString(),
      };
    } else {
      const daysAgo = Math.floor(Math.abs(diff) / 86400);
      return {
        expired: true,
        text: `Expired ${daysAgo} days ago`,
        date: new Date(exp * 1000).toLocaleString(),
      };
    }
  };

  const expStatus = decoded?.payload?.exp ? getExpirationStatus(decoded.payload.exp) : null;
  const iatDate = decoded?.payload?.iat ? new Date(decoded.payload.iat * 1000).toLocaleString() : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input JWT box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Key size={16} className="text-brand-500" />
            <span>Encoded JSON Web Token</span>
          </label>

          <button
            onClick={() => setToken(SAMPLE_JWT)}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={12} />
            <span>Load Sample JWT</span>
          </button>
        </div>

        <textarea
          rows={4}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT here (e.g. eyJhbGciOi...)..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 break-all resize-y leading-relaxed text-slate-800 dark:text-slate-200"
        />

        {decoded?.error ? (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <XCircle size={16} />
            <span>{decoded.error}</span>
          </div>
        ) : (
          expStatus && (
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                expStatus.expired
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {expStatus.expired ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                <span>{expStatus.text}</span>
              </div>
              <span className="font-mono text-[11px] opacity-80">Exp Date: {expStatus.date}</span>
            </div>
          )
        )}
      </div>

      {/* Decoded Sections */}
      {decoded && !decoded.error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-500/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Header (Algorithm & Type)
              </span>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), 'Copied JWT Header!')}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Copy JSON"
              >
                <Copy size={14} />
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-rose-600 dark:text-rose-400 overflow-x-auto border border-rose-500/10">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Signature & Info */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-cyan-500/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                Signature Verification
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Alg: {decoded.header?.alg || 'Unknown'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-cyan-600 dark:text-cyan-400 break-all border border-cyan-500/10">
              {decoded.signature}
            </div>
            {iatDate && (
              <p className="text-[11px] text-slate-400">
                Issued At (iat): <span className="font-mono text-slate-700 dark:text-slate-300">{iatDate}</span>
              </p>
            )}
          </div>

          {/* Payload Data */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-500/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Payload (Claims & User Data)
              </span>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), 'Copied JWT Payload!')}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Copy JSON"
              >
                <Copy size={14} />
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 overflow-x-auto border border-indigo-500/10 max-h-96">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
