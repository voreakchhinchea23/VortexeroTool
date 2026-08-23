import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Plus, Trash2, Trophy, RotateCcw, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_SLICES = ['Pizza 🍕', 'Ramen 🍜', 'Sushi 🍣', 'Burger 🍔', 'Tacos 🌮', 'Salad 🥗'];
const PALETTE = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export const SpinningWheel: React.FC = () => {
  const [slices, setSlices] = useState<string[]>(DEFAULT_SLICES);
  const [newSliceText, setNewSliceText] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Draw the wheel on canvas
  const drawWheel = (currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, width, height);

    if (slices.length === 0) return;
    const sliceAngle = (2 * Math.PI) / slices.length;

    slices.forEach((slice, i) => {
      const angle = currentAngle + i * sliceAngle;

      // Slice sector
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#090d16';
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(slice, radius - 20, 5);
      ctx.restore();
    });

    // Center circle pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#090d16';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', centerX, centerY + 4);
  };

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [slices]);

  const spin = () => {
    if (isSpinning || slices.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    const spinRotations = 5 + Math.random() * 5; // 5 to 10 full turns
    const totalExtraAngle = spinRotations * 2 * Math.PI;
    const targetAngle = rotationRef.current + totalExtraAngle;

    const duration = 4500; // ms
    const startTime = performance.now();
    const startAngle = rotationRef.current;

    const easeOutCubic = (t: number) => --t * t * t + 1;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutCubic(progress);

      const currentAngle = startAngle + (targetAngle - startAngle) * easedProgress;
      rotationRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Calculate winner
        // Top pointer is at angle 3*PI/2 (270 degrees)
        const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const sliceAngle = (2 * Math.PI) / slices.length;
        // Pointer is at the top (angle 3*PI/2)
        const pointerAngle = (3 * Math.PI / 2 - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(pointerAngle / sliceAngle) % slices.length;
        const winChoice = slices[winningIndex];

        setWinner(winChoice);
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleAddSlice = () => {
    if (!newSliceText.trim() || slices.length >= 12) return;
    setSlices([...slices, newSliceText.trim()]);
    setNewSliceText('');
  };

  const handleDeleteSlice = (index: number) => {
    if (slices.length <= 2) return;
    setSlices(slices.filter((_, i) => i !== index));
  };

  const presets = [
    { name: 'Food Choice 🍕', items: ['Pizza', 'Sushi', 'Burger', 'Tacos', 'Pasta', 'Salad', 'Ramen'] },
    { name: 'Who Goes First? 🎲', items: ['Player 1', 'Player 2', 'Player 3', 'Player 4'] },
    { name: 'Yes / No / Maybe 🔮', items: ['Yes! Absolutely', 'No, not today', 'Maybe later', 'Ask again'] },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-400 self-center mr-1">Quick Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setSlices(p.items)}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 transition-colors cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Slices Customizer (5/12) */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Wheel Choices ({slices.length}/12)</h3>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSliceText}
              onChange={(e) => setNewSliceText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSlice()}
              placeholder="Add choice..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <button
              onClick={handleAddSlice}
              disabled={!newSliceText.trim() || slices.length >= 12}
              className="px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {slices.map((slice, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }} />
                  <span className="truncate">{slice}</span>
                </div>
                <button
                  disabled={slices.length <= 2}
                  onClick={() => handleDeleteSlice(idx)}
                  className="text-slate-400 hover:text-rose-500 disabled:opacity-30 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Spinning Canvas (7/12) */}
        <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 flex flex-col items-center justify-center space-y-5">
          <div className="relative flex items-center justify-center">
            {/* Top Pointer Needle */}
            <div className="absolute top-0 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-rose-500 drop-shadow-md" />

            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              onClick={spin}
              className={`rounded-full cursor-pointer transition-transform ${isSpinning ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
            />
          </div>

          <button
            disabled={isSpinning}
            onClick={spin}
            className="w-full max-w-xs py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-brand-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            <span>{isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}</span>
          </button>

          {/* Winner Announcement Card */}
          {winner && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-center animate-in zoom-in-95 duration-200 w-full max-w-xs">
              <span className="text-[11px] uppercase font-bold tracking-wider">🎉 Winning Choice:</span>
              <p className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">{winner}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
