import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Upload, Download, Trash2, ArrowUp, ArrowDown, FileUp, Sparkles, Printer, Check } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

type PdfMode = 'image_to_pdf' | 'text_to_pdf';

interface ImageItem {
  id: string;
  name: string;
  url: string;
  size: string;
}

export const PdfTools: React.FC = () => {
  const [mode, setMode] = useState<PdfMode>('image_to_pdf');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  
  // Text to PDF states
  const [docTitle, setDocTitle] = useState('Project Documentation & Report');
  const [docAuthor, setDocAuthor] = useState('John Doe');
  const [docBody, setDocBody] = useState(`## Executive Summary
This document provides an overview of our technical architecture, deliverables, and performance benchmarks.

### Key Milestones Achieved:
1. Successfully reduced bundle latency by 40% across modern web utilities.
2. Completed end-to-end accessibility testing compliant with WCAG 2.1 AA standards.
3. Deployed high-throughput client-side document processing with zero server dependencies.

### Next Steps:
- Continue expanding productivity suites.
- Integrate automated export pipelines.
- Verify security protocols for offline execution.`);

  const { addToast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            url: reader.result as string,
            size: `${(file.size / 1024).toFixed(1)} KB`,
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const items = [...images];
    const temp = items[index];
    items[index] = items[newIdx];
    items[newIdx] = temp;
    setImages(items);
  };

  const exportImagesToPdf = () => {
    if (images.length === 0) {
      addToast('Please upload at least one image', 'error');
      return;
    }

    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow?.document;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Converted Images PDF</title>
          <style>
            @page {
              size: ${pageSize.toUpperCase()} ${orientation};
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            .page-break {
              page-break-after: always;
              break-after: page;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              box-sizing: border-box;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          ${images.map(img => `
            <div class="page-break">
              <img src="${img.url}" alt="${img.name}" />
            </div>
          `).join('')}
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.focus();
                window.print();
                window.parent.document.body.removeChild(window.frameElement);
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  };

  const exportTextToPdf = () => {
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow?.document;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${docTitle}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: ${pageSize.toUpperCase()} portrait;
              margin: 15mm 18mm;
            }
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              background: white;
              color: #0f172a;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body class="p-4">
          <div class="border-b-2 border-brand-600 pb-4 mb-6">
            <h1 class="text-2xl font-black text-slate-900">${docTitle}</h1>
            <p class="text-xs text-slate-500 font-semibold mt-1">Author: ${docAuthor} • Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="prose max-w-none text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
            ${docBody}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.focus();
                window.print();
                window.parent.document.body.removeChild(window.frameElement);
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode Tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode('image_to_pdf')}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            mode === 'image_to_pdf'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <ImageIcon size={18} />
          <span>Images to PDF Converter</span>
        </button>

        <button
          onClick={() => setMode('text_to_pdf')}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            mode === 'text_to_pdf'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <FileText size={18} />
          <span>Text & Markdown to PDF</span>
        </button>
      </div>

      {/* Mode 1: Images to PDF */}
      {mode === 'image_to_pdf' && (
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-brand-500 text-center transition-colors">
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              id="image-pdf-input"
              className="hidden"
            />
            <label htmlFor="image-pdf-input" className="cursor-pointer space-y-3 block">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-sm">
                <FileUp size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Click or drag images to convert to PDF</p>
                <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, and WebP (Batch conversion supported)</p>
              </div>
            </label>
          </div>

          {/* Page & Document Settings */}
          {images.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Orientation:</span>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-bold"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Page Size:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-bold"
                  >
                    <option value="a4">A4 Standard</option>
                    <option value="letter">US Letter</option>
                  </select>
                </div>
              </div>

              <button
                onClick={exportImagesToPdf}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Download size={16} />
                <span>Download PDF ({images.length} Pages)</span>
              </button>
            </div>
          )}

          {/* Uploaded Images List */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
                >
                  <div className="h-36 rounded-xl bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img src={img.url} alt={img.name} className="h-full w-full object-contain" />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold truncate text-slate-900 dark:text-white">Page {idx + 1}: {img.name}</p>
                      <p className="text-[10px] text-slate-400">{img.size}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        onClick={() => handleRemoveImage(img.id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Text & Markdown to PDF */}
      {mode === 'text_to_pdf' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Document Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Author / Organization</label>
              <input
                type="text"
                value={docAuthor}
                onChange={(e) => setDocAuthor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Document Body (Markdown / Text)</label>
            <textarea
              rows={12}
              value={docBody}
              onChange={(e) => setDocBody(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={exportTextToPdf}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Printer size={16} />
              <span>Generate & Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
