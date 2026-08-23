import React, { useState, useMemo } from 'react';
import { FileCode2, Copy, Download, Code, Eye, Sparkles, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

const SAMPLE_MD = `# 🚀 Project Vortexero

A blazing-fast, modern developer multi-tool suite with **zero telemetry** and 100% privacy.

## ✨ Features
- 🔐 **Security**: Password & Gamertag generators, Hash checker, JWT decoder
- 📱 **Web Sharing**: High-resolution QR code generator, URL shortener
- ✍️ **Text Tools**: Markdown live editor, case converter, word stats
- 🎨 **Design Tools**: CSS gradient builder, glassmorphism generator

### Code Example
\`\`\`javascript
const greeting = "Hello from Vortexero!";
console.log(greeting.toUpperCase());
\`\`\`

> *"Simplicity is prerequisite for reliability."* — Edsger W. Dijkstra

### Task List
- [x] Responsive layout for mobile & desktop
- [x] Dark / Light theme toggle
- [x] Ctrl+K command palette
`;

export const MarkdownPreviewer: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MD);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const { copyToClipboard } = useClipboard();

  // Simple and safe markdown to HTML parser
  const parsedHtml = useMemo(() => {
    let html = markdown
      // Escape script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Code blocks
      .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs my-3 overflow-x-auto"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-mono text-xs">$1</code>')
      // Headings
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-white">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-2 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-6 mb-3 text-slate-900 dark:text-white">$1</h1>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-brand-500 pl-4 py-1.5 my-3 text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 rounded-r-lg">$1</blockquote>')
      // Bold & Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Task lists
      .replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center gap-2 my-1 text-slate-700 dark:text-slate-300"><input type="checkbox" checked disabled class="accent-brand-600 w-4 h-4 rounded" /> <span class="line-through opacity-75">$1</span></div>')
      .replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center gap-2 my-1 text-slate-700 dark:text-slate-300"><input type="checkbox" disabled class="accent-brand-600 w-4 h-4 rounded" /> <span>$1</span></div>')
      // Regular Unordered lists
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300 my-0.5">$1</li>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline font-semibold">$1</a>')
      // Paragraphs
      .replace(/\n\n/g, '<div class="my-2.5"></div>');

    return html;
  }, [markdown]);

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* View Mode Tabs */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'split' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'edit' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Editor Only
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'preview' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Preview Only
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(markdown, 'Copied Markdown code!')}
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Copy size={13} />
            <span>Copy Markdown</span>
          </button>
          <button
            onClick={() => copyToClipboard(parsedHtml, 'Copied HTML output!')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Code size={13} />
            <span>Copy HTML</span>
          </button>
          <button
            onClick={handleDownloadMd}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Download .md file"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Panes */}
      <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor Box */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Code size={14} className="text-brand-500" />
              Markdown Source
            </span>
            <textarea
              rows={20}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type your markdown here..."
              className="w-full flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y leading-relaxed"
            />
          </div>
        )}

        {/* Live Rendered Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Eye size={14} className="text-emerald-500" />
              Rendered Preview
            </span>
            <div
              className="w-full flex-1 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[600px] text-sm leading-relaxed text-slate-800 dark:text-slate-200"
              dangerouslySetInnerHTML={{ __html: parsedHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
