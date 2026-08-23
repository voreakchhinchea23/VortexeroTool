import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Wifi, Link, FileText, User, Mail, MessageSquare, Palette, Sliders, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

type QrType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms';

export const QrCodeGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<QrType>('url');

  // Input states
  const [url, setUrl] = useState('https://vortexerotool.dev');
  const [text, setText] = useState('Welcome to Vortexero Tools!');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');

  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // Style customization
  const [fgColor, setFgColor] = useState('#1e293b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [includeMargin, setIncludeMargin] = useState(true);

  const canvasRef = useRef<HTMLDivElement>(null);
  const { copyToClipboard } = useClipboard();

  // Compute final QR payload
  const getQrValue = () => {
    switch (qrType) {
      case 'url':
        return url || 'https://vortexerotool.dev';
      case 'text':
        return text || 'Hello World';
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nFN:${vcardName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'sms':
        return `SMSTO:${smsPhone}:${smsMessage}`;
      default:
        return 'https://vortexerotool.dev';
    }
  };

  const qrValue = getQrValue();

  const handleDownloadPng = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `vortexero-qrcode-${qrType}.png`;
    downloadLink.click();
  };

  const handleDownloadSvg = () => {
    const svg = document.getElementById('qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `vortexero-qrcode-${qrType}.svg`;
    downloadLink.click();
    URL.revokeObjectURL(svgUrl);
  };

  const colorPresets = [
    { label: 'Classic Dark', fg: '#0f172a', bg: '#ffffff' },
    { label: 'Cyber Blue', fg: '#2563eb', bg: '#eff6ff' },
    { label: 'Emerald Mint', fg: '#059669', bg: '#ecfdf5' },
    { label: 'Sunset Crimson', fg: '#e11d48', bg: '#fff1f2' },
    { label: 'Royal Violet', fg: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Dark Mode Invert', fg: '#f8fafc', bg: '#090d16' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* QR Type Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {[
          { id: 'url', label: 'URL / Link', icon: Link },
          { id: 'text', label: 'Plain Text', icon: FileText },
          { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
          { id: 'vcard', label: 'Contact Card', icon: User },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'sms', label: 'SMS Message', icon: MessageSquare },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = qrType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setQrType(tab.id as QrType)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-brand-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Configuration (Left column 7/12) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Dynamic Content Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">QR Code Content</h3>

            {qrType === 'url' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Website URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            )}

            {qrType === 'text' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Text Message</label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type any message, serial number, note..."
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y"
                />
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Home_WiFi_5G"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Password</label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="SecretPass123"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Encryption</label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      <option value="WPA">WPA/WPA2/WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open)</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="w-4 h-4 accent-brand-600 rounded"
                  />
                  <span>Hidden Network (SSID Not Broadcasting)</span>
                </label>
              </div>
            )}

            {qrType === 'vcard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={vcardName}
                    onChange={(e) => setVcardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={vcardOrg}
                    onChange={(e) => setVcardOrg(e.target.value)}
                    placeholder="Vortexero Corp"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>
              </div>
            )}

            {qrType === 'email' && (
              <div className="space-y-3">
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="Recipient Email (e.g. contact@example.com)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                />
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email Subject"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                />
                <textarea
                  rows={3}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Email Message Body..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>
            )}

            {qrType === 'sms' && (
              <div className="space-y-3">
                <input
                  type="tel"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  placeholder="Phone Number (+1...)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                />
                <textarea
                  rows={3}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="SMS Text message..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>
            )}
          </div>

          {/* Color & Size Customization */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Palette size={18} className="text-brand-500" />
              <span>Color Themes & Styling</span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFgColor(preset.fg);
                    setBgColor(preset.bg);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-xs"
                    style={{ backgroundColor: preset.fg }}
                  />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Pattern Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live QR Preview & Actions (Right column 5/12) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 flex flex-col items-center sticky top-20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Live Preview
          </span>

          {/* QR Display Card */}
          <div
            className="p-6 rounded-2xl shadow-inner border border-slate-200/60 dark:border-slate-800 flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: bgColor }}
          >
            {/* SVG Render for clean display */}
            <QRCodeSVG
              id="qr-svg"
              value={qrValue}
              size={220}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              includeMargin={includeMargin}
            />

            {/* Hidden Canvas for PNG export */}
            <div ref={canvasRef} className="hidden">
              <QRCodeCanvas
                value={qrValue}
                size={512}
                fgColor={fgColor}
                bgColor={bgColor}
                level={level}
                includeMargin={includeMargin}
              />
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400 mt-4 text-center truncate max-w-full px-2">
            Payload: {qrValue}
          </p>

          {/* Download & Copy Buttons */}
          <div className="w-full grid grid-cols-2 gap-2.5 mt-6">
            <button
              onClick={handleDownloadPng}
              className="py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Download size={16} />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handleDownloadSvg}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Download size={16} />
              <span>Download SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
