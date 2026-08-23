import React, { useState } from 'react';
import { Target, Copy, ExternalLink, Sparkles, Check, RefreshCcw } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const UtmBuilder: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('https://mysite.com/landing');
  const [source, setSource] = useState('google');
  const [medium, setMedium] = useState('cpc');
  const [campaign, setCampaign] = useState('summer_sale');
  const [term, setTerm] = useState('web_tools');
  const [content, setContent] = useState('hero_banner');

  const { copyToClipboard } = useClipboard();

  // Generate UTM URL
  const generateUrl = () => {
    if (!baseUrl.trim()) return '';
    try {
      let validUrl = baseUrl.trim();
      if (!/^https?:\/\//i.test(validUrl)) {
        validUrl = 'https://' + validUrl;
      }
      const urlObj = new URL(validUrl);

      if (source.trim()) urlObj.searchParams.set('utm_source', source.trim());
      if (medium.trim()) urlObj.searchParams.set('utm_medium', medium.trim());
      if (campaign.trim()) urlObj.searchParams.set('utm_campaign', campaign.trim());
      if (term.trim()) urlObj.searchParams.set('utm_term', term.trim());
      if (content.trim()) urlObj.searchParams.set('utm_content', content.trim());

      return urlObj.toString();
    } catch {
      return '';
    }
  };

  const finalUrl = generateUrl();

  const presets = [
    { name: 'Google Ads (CPC)', source: 'google', medium: 'cpc', campaign: 'lead_gen' },
    { name: 'Meta / Instagram Ads', source: 'facebook', medium: 'paid_social', campaign: 'retargeting' },
    { name: 'Email Newsletter', source: 'newsletter', medium: 'email', campaign: 'weekly_digest' },
    { name: 'Twitter / X Post', source: 'twitter', medium: 'social_organic', campaign: 'product_launch' },
    { name: 'YouTube Video', source: 'youtube', medium: 'video_desc', campaign: 'tutorial_series' },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setSource(p.source);
    setMedium(p.medium);
    setCampaign(p.campaign);
  };

  const handleReset = () => {
    setSource('');
    setMedium('');
    setCampaign('');
    setTerm('');
    setContent('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-400 self-center mr-1">Quick Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Parameters Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5">
            Website Target URL <span className="text-rose-500">*</span>
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com/landing-page"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Campaign Source (<span className="font-mono text-brand-500">utm_source</span>) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. google, newsletter, twitter"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Campaign Medium (<span className="font-mono text-brand-500">utm_medium</span>) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="e.g. cpc, email, banner, social"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Campaign Name (<span className="font-mono text-brand-500">utm_campaign</span>) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. black_friday, summer_promo"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Campaign Term (<span className="font-mono text-brand-500">utm_term</span>)
            </label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. react_developer_tools"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Campaign Content (<span className="font-mono text-brand-500">utm_content</span>)
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. logolink, top_cta_button"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1.5"
          >
            <RefreshCcw size={13} />
            <span>Reset Fields</span>
          </button>
        </div>
      </div>

      {/* Generated Campaign URL Output Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Target size={14} className="text-brand-500" />
            Generated Trackable Campaign URL
          </span>
          <span className="text-xs font-mono text-slate-400">{finalUrl.length} characters</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all select-all leading-relaxed">
          {finalUrl || 'Please fill in the website URL...'}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            disabled={!finalUrl}
            onClick={() => copyToClipboard(finalUrl, 'Campaign URL copied!')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Copy size={16} />
            <span>Copy URL</span>
          </button>

          <a
            href={finalUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Open link in new tab"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
