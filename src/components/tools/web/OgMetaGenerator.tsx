import React, { useState } from 'react';
import { Share2, Copy, Eye, Globe, Twitter, Facebook, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const OgMetaGenerator: React.FC = () => {
  const [title, setTitle] = useState('VortexeroTool — All-In-One Developer Utilities');
  const [description, setDescription] = useState('Supercharge your productivity with instant, private, and modern tools for development, security, and everyday tasks.');
  const [url, setUrl] = useState('https://vortexerotool.dev');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop');
  const [siteName, setSiteName] = useState('Vortexero');
  const [twitterHandle, setTwitterHandle] = useState('@vortexerotool');
  const [previewTab, setPreviewTab] = useState<'google' | 'twitter' | 'facebook'>('twitter');

  const { copyToClipboard } = useClipboard();

  const generatedHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />
<meta name="twitter:creator" content="${twitterHandle}" />`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (6/12) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Page Metadata</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Website URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Brand Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">OG Banner Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://mysite.com/og-image.jpg"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
            />
          </div>
        </div>

        {/* Live Social Previews (6/12) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Tabs */}
          <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setPreviewTab('twitter')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                previewTab === 'twitter' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Twitter size={14} />
              <span>Twitter / X</span>
            </button>
            <button
              onClick={() => setPreviewTab('facebook')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                previewTab === 'facebook' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Facebook size={14} />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => setPreviewTab('google')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                previewTab === 'google' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Globe size={14} />
              <span>Google</span>
            </button>
          </div>

          {/* Twitter Card Preview */}
          {previewTab === 'twitter' && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-black text-white overflow-hidden shadow-lg">
              <div className="h-44 bg-slate-800 overflow-hidden relative">
                <img src={imageUrl} alt="Banner" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-1">
                <p className="text-xs text-slate-400 uppercase font-mono">{new URL(url || 'https://example.com').hostname}</p>
                <p className="text-sm font-bold truncate">{title}</p>
                <p className="text-xs text-slate-400 line-clamp-2">{description}</p>
              </div>
            </div>
          )}

          {/* Facebook Preview */}
          {previewTab === 'facebook' && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg">
              <div className="h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img src={imageUrl} alt="Banner" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-1 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase font-mono">{new URL(url || 'https://example.com').hostname}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{title}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{description}</p>
              </div>
            </div>
          )}

          {/* Google Preview */}
          {previewTab === 'google' && (
            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-1">
              <p className="text-xs text-slate-500 font-mono truncate">{url}</p>
              <p className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {description}
              </p>
            </div>
          )}

          {/* Generated Code */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">HTML Meta Tags</span>
              <button
                onClick={() => copyToClipboard(generatedHtml, 'Meta tags copied!')}
                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy Tags</span>
              </button>
            </div>
            <pre className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-700 dark:text-slate-300 overflow-x-auto max-h-36">
              {generatedHtml}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
