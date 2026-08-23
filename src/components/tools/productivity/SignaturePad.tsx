import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Download, Trash2, RotateCcw, Type, Sparkles, Check } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

type SignatureMode = 'draw' | 'type';

const FONTS = [
  'font-serif italic font-bold tracking-wider',
  'font-mono italic font-semibold',
  'font-sans italic font-extrabold tracking-tight',
  'font-serif italic',
  'font-sans uppercase tracking-widest font-black',
  'font-mono tracking-wide',
];

export const SignaturePad: React.FC = () => {
  const [mode, setMode] = useState<SignatureMode>('draw');
  const [penColor, setPenColor] = useState<string>('#0f172a');
  const [penWidth, setPenWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Type signature states
  const [typedName, setTypedName] = useState<string>('John Doe');
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addToast } = useToast();

  const colors = [
    { label: 'Deep Black', hex: '#0f172a' },
    { label: 'Navy Blue', hex: '#1e3a8a' },
    { label: 'Royal Blue', hex: '#2563eb' },
    { label: 'Crimson', hex: '#dc2626' },
    { label: 'Emerald', hex: '#059669' },
  ];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Download transparent PNG
  const downloadSignature = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `signature-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      // Render typed text on temporary canvas
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = penColor;
      ctx.font = 'italic bold 44px "Plus Jakarta Sans", cursive, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName, 300, 100);

      const link = document.createElement('a');
      link.download = `signature-typed-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    addToast('Transparent PNG Signature downloaded!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode('draw')}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            mode === 'draw'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <PenTool size={18} />
          <span>Draw Hand Signature</span>
        </button>

        <button
          onClick={() => setMode('type')}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            mode === 'type'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Type size={18} />
          <span>Type Cursive Signature</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Ink Colors */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Ink Color:</span>
          <div className="flex items-center gap-1.5">
            {colors.map(c => (
              <button
                key={c.hex}
                onClick={() => setPenColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                  penColor === c.hex ? 'scale-125 ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:scale-110'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Thickness (Draw mode only) */}
        {mode === 'draw' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Stroke:</span>
            {[2, 3, 5, 8].map(w => (
              <button
                key={w}
                onClick={() => setPenWidth(w)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  penWidth === w ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>
        )}

        {/* Download & Clear */}
        <div className="flex items-center gap-2">
          {mode === 'draw' && (
            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={downloadSignature}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Download Transparent PNG</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Draw Signature Canvas */}
      {mode === 'draw' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-4">
          <div className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
            <canvas
              ref={canvasRef}
              width={680}
              height={260}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full max-h-[260px] cursor-crosshair touch-none"
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none text-slate-400 text-xs font-mono">
              <span>Sign above the line</span>
              <span>Transparent PNG Output</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Type Cursive Signature */}
      {mode === 'type' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Your Full Name</label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-base font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FONTS.map((fontClass, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedStyleIndex(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer text-center ${
                  selectedStyleIndex === idx
                    ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-brand-500/50'
                }`}
              >
                <p className={`text-2xl sm:text-3xl ${fontClass}`} style={{ color: penColor }}>
                  {typedName || 'Your Signature'}
                </p>
                <span className="text-[10px] text-slate-400 font-mono mt-2 block">Style #{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
