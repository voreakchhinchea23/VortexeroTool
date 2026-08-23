import React, { useState, useRef, useEffect } from 'react';
import {
  PenTool,
  Eraser,
  Square,
  Circle,
  Minus,
  Download,
  RotateCcw,
  Palette,
  Check,
  Maximize2,
  Trash2,
} from 'lucide-react';

type DrawTool = 'pen' | 'line' | 'rect' | 'circle' | 'eraser';

const COLOR_SWATCHES = [
  '#ffffff',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#64748b',
  '#000000',
];

export const WhiteboardSketch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<DrawTool>('pen');
  const [color, setColor] = useState<string>('#ffffff');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 500;

    // Set initial background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    setIsDrawing(true);
    setStartPos(coords);
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);

    ctx.strokeStyle = tool === 'eraser' ? '#0f172a' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshot) {
      // Restore previous state for shapes
      ctx.putImageData(snapshot, 0, 0);

      ctx.beginPath();
      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, coords.x - startPos.x, coords.y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.hypot(coords.x - startPos.x, coords.y - startPos.y);
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `vortexero-sketch-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Drawing Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Tool selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setTool('pen')}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              tool === 'pen' ? 'bg-fuchsia-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Pen Tool"
          >
            <PenTool size={16} />
          </button>
          <button
            onClick={() => setTool('line')}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              tool === 'line' ? 'bg-fuchsia-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Line Tool"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => setTool('rect')}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              tool === 'rect' ? 'bg-fuchsia-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Rectangle Tool"
          >
            <Square size={16} />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              tool === 'circle' ? 'bg-fuchsia-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Circle Tool"
          >
            <Circle size={16} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              tool === 'eraser' ? 'bg-fuchsia-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Eraser Tool"
          >
            <Eraser size={16} />
          </button>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch}
              onClick={() => {
                setColor(swatch);
                if (tool === 'eraser') setTool('pen');
              }}
              className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer shrink-0 ${
                color === swatch && tool !== 'eraser' ? 'scale-125 border-fuchsia-500 shadow-md' : 'border-slate-600'
              }`}
              style={{ backgroundColor: swatch }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              if (tool === 'eraser') setTool('pen');
            }}
            className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 cursor-pointer"
            title="Custom Color"
          />
        </div>

        {/* Stroke Width Slider */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Size:</span>
          <input
            type="range"
            min="1"
            max="30"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-24 accent-fuchsia-500 cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 w-6">
            {lineWidth}px
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/15 hover:text-rose-500 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear whiteboard"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
          <button
            onClick={downloadImage}
            className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-fuchsia-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Save PNG</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl bg-[#0f172a] touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full cursor-crosshair block"
        />
      </div>
    </div>
  );
};
