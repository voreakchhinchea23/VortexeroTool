import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  Copy, 
  Check, 
  Terminal, 
  Search, 
  Sparkles, 
  History, 
  Command,
  Info
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface KeyEventData {
  key: string;
  code: string;
  keyCode: number;
  which: number;
  location: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  capsLock: boolean;
  timestamp: string;
}

const COMMON_KEYS_TABLE = [
  { key: 'Enter', code: 'Enter', keyCode: 13, desc: 'Enter / Return' },
  { key: 'Escape', code: 'Escape', keyCode: 27, desc: 'Escape' },
  { key: ' ', code: 'Space', keyCode: 32, desc: 'Spacebar' },
  { key: 'Backspace', code: 'Backspace', keyCode: 8, desc: 'Backspace' },
  { key: 'Tab', code: 'Tab', keyCode: 9, desc: 'Tab' },
  { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, desc: 'Up Arrow' },
  { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, desc: 'Down Arrow' },
  { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37, desc: 'Left Arrow' },
  { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, desc: 'Right Arrow' },
  { key: 'Delete', code: 'Delete', keyCode: 46, desc: 'Delete' },
  { key: 'Home', code: 'Home', keyCode: 36, desc: 'Home' },
  { key: 'End', code: 'End', keyCode: 35, desc: 'End' },
  { key: 'PageUp', code: 'PageUp', keyCode: 33, desc: 'Page Up' },
  { key: 'PageDown', code: 'PageDown', keyCode: 34, desc: 'Page Down' },
  { key: 'Shift', code: 'ShiftLeft', keyCode: 16, desc: 'Shift Key' },
  { key: 'Control', code: 'ControlLeft', keyCode: 17, desc: 'Control Key' },
  { key: 'Alt', code: 'AltLeft', keyCode: 18, desc: 'Alt / Option' },
  { key: 'Meta', code: 'MetaLeft', keyCode: 91, desc: 'Windows / Command' },
];

export const KeycodeInfo: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<KeyEventData>({
    key: 'k',
    code: 'KeyK',
    keyCode: 75,
    which: 75,
    location: 0,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    capsLock: false,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [history, setHistory] = useState<KeyEventData[]>([]);
  const [tableSearch, setTableSearch] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in the search input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        e.preventDefault();
      }

      const newEvent: KeyEventData = {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.which,
        location: e.location,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        capsLock: e.getModifierState('CapsLock'),
        timestamp: new Date().toLocaleTimeString(),
      };

      setCurrentEvent(newEvent);
      setHistory(prev => [newEvent, ...prev.slice(0, 7)]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyValue = (val: string, fieldName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(fieldName);
    addToast(`Copied ${fieldName}: ${val}`, 'success');
    setTimeout(() => setCopiedField(null), 1800);
  };

  const getLocationName = (loc: number): string => {
    switch (loc) {
      case 1: return 'Left (1)';
      case 2: return 'Right (2)';
      case 3: return 'Numpad (3)';
      default: return 'Standard (0)';
    }
  };

  const modifierConditions = [
    currentEvent.ctrlKey ? 'event.ctrlKey' : null,
    currentEvent.metaKey ? 'event.metaKey' : null,
    currentEvent.shiftKey ? 'event.shiftKey' : null,
    currentEvent.altKey ? 'event.altKey' : null,
  ].filter(Boolean);

  const modString = modifierConditions.length > 0 ? ` && ${modifierConditions.join(' && ')}` : '';

  const generatedJsCode = `window.addEventListener('keydown', (event) => {
  if (event.key === ${JSON.stringify(currentEvent.key)}${modString}) {
    // Action when ${currentEvent.key === ' ' ? 'Space' : currentEvent.key} is pressed
    console.log('Key captured:', event.key);
  }
});`;

  const filteredCommonKeys = COMMON_KEYS_TABLE.filter(item => 
    item.key.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.code.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.desc.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.keyCode.toString().includes(tableSearch)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Keyboard size={20} />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Keyboard Event & KeyCode Inspector</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Live Interactive
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Press any key on your keyboard to instantly inspect JavaScript KeyboardEvent parameters, event.key, event.code, keyCode, modifiers, and generated event listener code.
            </p>
          </div>
        </div>
      </div>

      {/* Main Big Key Display */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-slate-900/90 border border-amber-500/25 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-4 right-4 text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <Terminal size={14} className="text-amber-500" />
          Listening for keystrokes...
        </div>

        <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-white dark:bg-slate-800 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/20 flex items-center justify-center mb-6">
          <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-amber-400 font-mono">
            {currentEvent.key === ' ' ? 'Space' : currentEvent.key}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          KeyCode: <span className="text-amber-500 font-mono text-2xl">{currentEvent.keyCode}</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Code: <span className="font-mono text-slate-300 font-semibold">{currentEvent.code}</span>
        </p>

        {/* Modifiers Status Row */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {[
            { label: 'Shift', active: currentEvent.shiftKey },
            { label: 'Ctrl', active: currentEvent.ctrlKey },
            { label: 'Alt', active: currentEvent.altKey },
            { label: 'Cmd / Meta', active: currentEvent.metaKey },
            { label: 'CapsLock', active: currentEvent.capsLock },
          ].map(mod => (
            <span
              key={mod.label}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all border ${
                mod.active
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {mod.label}
            </span>
          ))}
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'event.key', value: currentEvent.key === ' ' ? '(Space)' : currentEvent.key, copyVal: currentEvent.key },
          { label: 'event.code', value: currentEvent.code, copyVal: currentEvent.code },
          { label: 'event.keyCode (Deprecated)', value: currentEvent.keyCode.toString(), copyVal: currentEvent.keyCode.toString() },
          { label: 'event.location', value: getLocationName(currentEvent.location), copyVal: currentEvent.location.toString() },
        ].map(card => (
          <div
            key={card.label}
            onClick={() => copyValue(card.copyVal, card.label)}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/50 cursor-pointer transition-all shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{card.label}</span>
              {copiedField === card.label ? (
                <Check size={12} className="text-emerald-500" />
              ) : (
                <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono truncate">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Code Snippet and History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generated JavaScript Code */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} className="text-amber-500" />
              Generated Event Listener
            </span>
            <button
              onClick={() => copyValue(generatedJsCode, 'JavaScript Code')}
              className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold flex items-center gap-1.5"
            >
              <Copy size={12} />
              Copy Snippet
            </button>
          </div>

          <pre className="flex-1 p-4 rounded-2xl bg-[#090d16] text-amber-200 border border-slate-800 font-mono text-xs overflow-auto leading-relaxed">
            <code>{generatedJsCode}</code>
          </pre>
        </div>

        {/* Keystroke History */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <History size={14} className="text-amber-500" />
              Recent Keystrokes
            </span>
            <span className="text-xs font-mono text-slate-400">{history.length} logged</span>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[180px]">
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Press keys on your keyboard to log history</p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentEvent(h)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer text-xs font-mono transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-500">{h.key === ' ' ? 'Space' : h.key}</span>
                    <span className="text-slate-400">({h.code})</span>
                  </div>
                  <div className="text-slate-500">
                    keyCode: {h.keyCode}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Common Keys Reference Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Info size={16} className="text-amber-500" />
            Common JavaScript KeyCodes Reference Table
          </span>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search keys, codes..."
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">event.key</th>
                <th className="py-2 px-3">event.code</th>
                <th className="py-2 px-3">event.keyCode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCommonKeys.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">{item.desc}</td>
                  <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">{item.key}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{item.code}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-bold">{item.keyCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
