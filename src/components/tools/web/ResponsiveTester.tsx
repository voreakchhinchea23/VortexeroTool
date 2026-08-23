import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw, ExternalLink, Globe, Search } from 'lucide-react';

interface DevicePreset {
  id: string;
  name: string;
  category: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  icon: any;
}

const DEVICES: DevicePreset[] = [
  { id: 'iphone_16', name: 'iPhone 16 Pro', category: 'mobile', width: 393, height: 852, icon: Smartphone },
  { id: 'pixel_9', name: 'Google Pixel 9', category: 'mobile', width: 412, height: 924, icon: Smartphone },
  { id: 'ipad_pro', name: 'iPad Pro 11"', category: 'tablet', width: 834, height: 1194, icon: Tablet },
  { id: 'macbook_14', name: 'MacBook Pro 14"', category: 'desktop', width: 1024, height: 640, icon: Monitor },
  { id: 'desktop_fhd', name: 'Full HD Desktop', category: 'desktop', width: 1280, height: 720, icon: Monitor },
];

export const ResponsiveTester: React.FC = () => {
  const [url, setUrl] = useState<string>('https://example.com');
  const [activeUrl, setActiveUrl] = useState<string>('https://example.com');
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICES[0]);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(0.85);

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let formatted = url.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    setActiveUrl(formatted);
  };

  const frameWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const frameHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* URL & Controls Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <form onSubmit={handleApplyUrl} className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g. https://example.com)"
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            Load URL
          </button>
        </form>

        {/* Device selector tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            {DEVICES.map((d) => {
              const Icon = d.icon;
              const isActive = selectedDevice.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDevice(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Icon size={14} />
                  <span>{d.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                isLandscape
                  ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-cyan-600 dark:text-cyan-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <RotateCw size={13} />
              <span>Rotate</span>
            </button>

            <span className="text-slate-400 font-mono">
              {frameWidth} × {frameHeight}px
            </span>

            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Open link in new browser tab"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Simulator Device Frame */}
      <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[560px] overflow-auto">
        <div
          className="relative rounded-3xl border-4 border-slate-700 bg-black shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            maxWidth: '100%',
            transform: `scale(${zoomScale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Top Notch on Mobile */}
          {selectedDevice.category === 'mobile' && !isLandscape && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 shadow-md" />
          )}

          <iframe
            src={activeUrl}
            title="Responsive Preview Frame"
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
};
