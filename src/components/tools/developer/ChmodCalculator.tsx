import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Copy, 
  Check, 
  Terminal, 
  Folder, 
  FileCode, 
  Lock, 
  Key, 
  Info, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface PermissionScope {
  r: boolean;
  w: boolean;
  x: boolean;
}

const PRESETS = [
  {
    octal: '644',
    name: 'Standard File (644)',
    desc: 'Owner can read & write; group and others can only read. Default for web & config files.',
    u: { r: true, w: true, x: false },
    g: { r: true, w: false, x: false },
    o: { r: true, w: false, x: false },
  },
  {
    octal: '755',
    name: 'Standard Directory / Script (755)',
    desc: 'Owner has full control; group and others can read & execute. Default for public directories and binaries.',
    u: { r: true, w: true, x: true },
    g: { r: true, w: false, x: true },
    o: { r: true, w: false, x: true },
  },
  {
    octal: '600',
    name: 'Private File / Config (600)',
    desc: 'Only owner can read & write. Safe for .env, passwords, and sensitive credentials.',
    u: { r: true, w: true, x: false },
    g: { r: false, w: false, x: false },
    o: { r: false, w: false, x: false },
  },
  {
    octal: '400',
    name: 'Read-only SSH Key (400)',
    desc: 'Only owner can read. Required by ssh for private key files (~/.ssh/id_rsa).',
    u: { r: true, w: false, x: false },
    g: { r: false, w: false, x: false },
    o: { r: false, w: false, x: false },
  },
  {
    octal: '700',
    name: 'Private Directory (700)',
    desc: 'Only owner can enter and read contents. Standard for ~/.ssh and user home directories.',
    u: { r: true, w: true, x: true },
    g: { r: false, w: false, x: false },
    o: { r: false, w: false, x: false },
  },
  {
    octal: '777',
    name: 'Full Public Access (777)',
    desc: 'Anyone can read, write, and execute. Insecure in production; use only for local troubleshooting.',
    u: { r: true, w: true, x: true },
    g: { r: true, w: true, x: true },
    o: { r: true, w: true, x: true },
  },
];

export const ChmodCalculator: React.FC = () => {
  const [user, setUser] = useState<PermissionScope>({ r: true, w: true, x: true });
  const [group, setGroup] = useState<PermissionScope>({ r: true, w: false, x: true });
  const [others, setOthers] = useState<PermissionScope>({ r: true, w: false, x: true });
  const [special, setSpecial] = useState({ suid: false, sgid: false, sticky: false });
  const [fileType, setFileType] = useState<'-' | 'd' | 'l'>('-');
  const [targetPath, setTargetPath] = useState('app.sh');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { addToast } = useToast();

  // Compute octal number
  const calcOctalValue = (scope: PermissionScope): number => {
    return (scope.r ? 4 : 0) + (scope.w ? 2 : 0) + (scope.x ? 1 : 0);
  };

  const specialOctal = (special.suid ? 4 : 0) + (special.sgid ? 2 : 0) + (special.sticky ? 1 : 0);
  const userOctal = calcOctalValue(user);
  const groupOctal = calcOctalValue(group);
  const othersOctal = calcOctalValue(others);

  const standardOctal = `${userOctal}${groupOctal}${othersOctal}`;
  const fullOctal = specialOctal > 0 ? `${specialOctal}${standardOctal}` : `0${standardOctal}`;

  // Compute symbolic representation
  const symbolicString = useMemo(() => {
    let uStr = `${user.r ? 'r' : '-'}${user.w ? 'w' : '-'}`;
    if (special.suid) {
      uStr += user.x ? 's' : 'S';
    } else {
      uStr += user.x ? 'x' : '-';
    }

    let gStr = `${group.r ? 'r' : '-'}${group.w ? 'w' : '-'}`;
    if (special.sgid) {
      gStr += group.x ? 's' : 'S';
    } else {
      gStr += group.x ? 'x' : '-';
    }

    let oStr = `${others.r ? 'r' : '-'}${others.w ? 'w' : '-'}`;
    if (special.sticky) {
      oStr += others.x ? 't' : 'T';
    } else {
      oStr += others.x ? 'x' : '-';
    }

    return `${fileType}${uStr}${gStr}${oStr}`;
  }, [fileType, user, group, others, special]);

  // Handle direct octal text input
  const handleOctalChange = (val: string) => {
    const clean = val.replace(/[^0-7]/g, '').slice(0, 4);
    if (!clean) return;

    let s = 0, u = 0, g = 0, o = 0;
    if (clean.length === 3) {
      u = parseInt(clean[0], 10);
      g = parseInt(clean[1], 10);
      o = parseInt(clean[2], 10);
    } else if (clean.length === 4) {
      s = parseInt(clean[0], 10);
      u = parseInt(clean[1], 10);
      g = parseInt(clean[2], 10);
      o = parseInt(clean[3], 10);
    } else {
      return;
    }

    setUser({ r: (u & 4) === 4, w: (u & 2) === 2, x: (u & 1) === 1 });
    setGroup({ r: (g & 4) === 4, w: (g & 2) === 2, x: (g & 1) === 1 });
    setOthers({ r: (o & 4) === 4, w: (o & 2) === 2, x: (o & 1) === 1 });
    setSpecial({ suid: (s & 4) === 4, sgid: (s & 2) === 2, sticky: (s & 1) === 1 });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    addToast(`Copied ${label}: ${text}`, 'success');
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setUser(preset.u);
    setGroup(preset.g);
    setOthers(preset.o);
    setSpecial({ suid: false, sgid: false, sticky: false });
    addToast(`Applied preset: ${preset.name}`, 'info');
  };

  const chmodCommands = [
    { label: 'Octal Command', cmd: `chmod ${standardOctal} ${targetPath}` },
    { label: 'Recursive Command', cmd: `chmod -R ${standardOctal} ${targetPath}` },
    { label: 'Symbolic Command', cmd: `chmod u=${user.r ? 'r' : ''}${user.w ? 'w' : ''}${user.x ? 'x' : ''},g=${group.r ? 'r' : ''}${group.w ? 'w' : ''}${group.x ? 'x' : ''},o=${others.r ? 'r' : ''}${others.w ? 'w' : ''}${others.x ? 'x' : ''} ${targetPath}` },
    { label: 'Fix All Files in Directory', cmd: `find ${targetPath} -type f -exec chmod 644 {} +` },
    { label: 'Fix All Folders in Directory', cmd: `find ${targetPath} -type d -exec chmod 755 {} +` },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                <Shield size={20} />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Chmod & Linux Permissions Calculator</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                DevOps & Sysadmin
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Calculate Linux octal file modes, symbolic notations (rwx), SetUID/SetGID/Sticky bits, and generate production-ready chmod commands.
            </p>
          </div>
        </div>
      </div>

      {/* Main Big Output Display */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 via-slate-900/40 to-slate-900/90 border border-teal-500/25 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
          {/* Octal */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-teal-500/30">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Octal Mode</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-black font-mono text-teal-600 dark:text-teal-400">
                {specialOctal > 0 ? fullOctal : standardOctal}
              </span>
              <button
                onClick={() => handleCopy(specialOctal > 0 ? fullOctal : standardOctal, 'Octal')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-all"
              >
                {copiedKey === 'Octal' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">
              special: {specialOctal} | user: {userOctal} | group: {groupOctal} | other: {othersOctal}
            </span>
          </div>

          {/* Symbolic Notation */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-teal-500/30">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Symbolic Notation</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-wider">
                {symbolicString}
              </span>
              <button
                onClick={() => handleCopy(symbolicString, 'Symbolic')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-all"
              >
                {copiedKey === 'Symbolic' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-[11px] text-slate-400">Type:</span>
              {(['- (file)', 'd (dir)', 'l (link)'] as const).map(t => {
                const char = t[0] as '-' | 'd' | 'l';
                return (
                  <button
                    key={t}
                    onClick={() => setFileType(char)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                      fileType === char
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Input */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-teal-500/30">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Direct Octal Jump</span>
            <div className="mt-2">
              <input
                type="text"
                maxLength={4}
                value={standardOctal}
                onChange={(e) => handleOctalChange(e.target.value)}
                placeholder="755"
                className="w-24 text-center px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-teal-500/50 text-2xl font-black font-mono text-teal-600 dark:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Type 3 or 4 digits (e.g. 755, 0644)</span>
          </div>
        </div>
      </div>

      {/* Permission Checkbox Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Owner (User) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Owner (User)</h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono font-bold text-sm">
              {userOctal}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'r', label: 'Read (r)', val: 4, checked: user.r },
              { id: 'w', label: 'Write (w)', val: 2, checked: user.w },
              { id: 'x', label: 'Execute (x)', val: 1, checked: user.x },
            ].map(item => (
              <label
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => setUser({ ...user, [item.id]: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold">+{item.val}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Group */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Group</h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold text-sm">
              {groupOctal}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'r', label: 'Read (r)', val: 4, checked: group.r },
              { id: 'w', label: 'Write (w)', val: 2, checked: group.w },
              { id: 'x', label: 'Execute (x)', val: 1, checked: group.x },
            ].map(item => (
              <label
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => setGroup({ ...group, [item.id]: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold">+{item.val}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Public (Others) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Others (Public)</h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm">
              {othersOctal}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'r', label: 'Read (r)', val: 4, checked: others.r },
              { id: 'w', label: 'Write (w)', val: 2, checked: others.w },
              { id: 'x', label: 'Execute (x)', val: 1, checked: others.x },
            ].map(item => (
              <label
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => setOthers({ ...others, [item.id]: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold">+{item.val}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Special Permissions Flags */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
          Special Bits (SetUID / SetGID / Sticky Bit)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'suid', label: 'SetUID (4000)', desc: 'Execute with permissions of file owner', checked: special.suid },
            { id: 'sgid', label: 'SetGID (2000)', desc: 'Execute with permissions of file group', checked: special.sgid },
            { id: 'sticky', label: 'Sticky Bit (1000)', desc: 'Only owner can delete file in directory', checked: special.sticky },
          ].map(sp => (
            <label
              key={sp.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <input
                type="checkbox"
                checked={sp.checked}
                onChange={(e) => setSpecial({ ...special, [sp.id]: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{sp.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{sp.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Generated Chmod Terminal Commands */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-teal-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Generated Linux Terminal Commands</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Target Path:</span>
            <input
              type="text"
              value={targetPath}
              onChange={(e) => setTargetPath(e.target.value)}
              placeholder="filename or /path"
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {chmodCommands.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#090d16] border border-slate-800 group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <span className="text-[11px] font-mono font-bold text-teal-400 shrink-0 w-28 sm:w-48 truncate">
                  {item.label}:
                </span>
                <code className="text-xs font-mono text-slate-200 truncate">{item.cmd}</code>
              </div>
              <button
                onClick={() => handleCopy(item.cmd, item.label)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all shrink-0"
              >
                {copiedKey === item.label ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Common Presets Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Standard Permission Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESETS.map(preset => (
            <div
              key={preset.octal}
              onClick={() => applyPreset(preset)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{preset.name}</span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-mono font-black bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    {preset.octal}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                  {preset.desc}
                </p>
              </div>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-2 block">
                Click to apply →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
