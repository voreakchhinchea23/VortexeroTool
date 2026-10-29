import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  FileText, 
  CheckCircle2, 
  Layers, 
  RefreshCw, 
  AlertCircle,
  Plus,
  Eye
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useToast } from '../../../context/ToastContext';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
  pageCount: number;
  buffer: ArrayBuffer;
}

export const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [outputFileName, setOutputFileName] = useState('merged_document.pdf');
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const { addToast } = useToast();

  React.useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFiles = async (fileList: File[]) => {
    const pdfFiles = fileList.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      addToast('Please select valid PDF documents (.pdf)', 'error');
      return;
    }

    const newItems: PdfFileItem[] = [];

    for (const file of pdfFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          sizeFormatted: formatFileSize(file.size),
          pageCount,
          buffer
        });
      } catch (err) {
        console.error('Failed to parse PDF:', err);
        addToast(`Could not load "${file.name}" (it may be encrypted or corrupted)`, 'error');
      }
    }

    if (newItems.length > 0) {
      setFiles(prev => [...prev, ...newItems]);
      addToast(`Added ${newItems.length} PDF file${newItems.length > 1 ? 's' : ''}`, 'success');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;

    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFiles(updated);
  };

  const handleRemove = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleClearAll = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewPdfUrl(null);
    setFiles([]);
    addToast('Cleared all files', 'info');
  };

  const totalPages = files.reduce((acc, curr) => acc + curr.pageCount, 0);

  const handleMergePdf = async () => {
    if (files.length < 2) {
      addToast('Please upload at least 2 PDF files to merge', 'error');
      return;
    }

    try {
      setIsMerging(true);
      setMergeProgress(10);

      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        const srcDoc = await PDFDocument.load(item.buffer.slice(0), { ignoreEncryption: true });
        const indices = srcDoc.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(srcDoc, indices);
        
        copiedPages.forEach(page => mergedPdf.addPage(page));
        setMergeProgress(Math.round(((i + 1) / files.length) * 85));
      }

      setMergeProgress(90);
      const mergedPdfBytes = await mergedPdf.save();
      setMergeProgress(100);

      const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      const downloadUrl = URL.createObjectURL(blob);
      previewUrlRef.current = downloadUrl;
      setPreviewPdfUrl(downloadUrl);

      // Trigger automatic download
      const link = document.createElement('a');
      link.href = downloadUrl;
      const finalName = outputFileName.trim().length > 0 
        ? (outputFileName.endsWith('.pdf') ? outputFileName : `${outputFileName}.pdf`)
        : 'merged_document.pdf';
      link.download = finalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast(`Successfully merged ${files.length} PDFs (${totalPages} total pages)!`, 'success');
    } catch (error) {
      console.error('Merge failed:', error);
      addToast('Failed to merge PDFs. Please verify file integrity.', 'error');
    } finally {
      setIsMerging(false);
      setMergeProgress(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Tool Introduction Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <Layers size={20} />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">PDF Merger & Combiner Studio</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% Client-Side
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Merge multiple PDF documents into a single unified file. Rearrange order, inspect page counts, and combine instantly in your browser with zero server uploads.
            </p>
          </div>

          {files.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-all flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 border-2 border-dashed rounded-3xl transition-all cursor-pointer text-center ${
          isDragging
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-500/60 hover:bg-slate-50 dark:hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <FileUp size={26} />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Drop PDF files here, or <span className="text-brand-600 dark:text-brand-400 underline underline-offset-4">browse</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
          Select two or more PDF files. You can arrange their merge order below.
        </p>
      </div>

      {/* Files List & Management */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Documents to Combine ({files.length})
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {totalPages} total pages
              </span>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              Add More PDFs
            </button>
          </div>

          <div className="space-y-2.5">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span>{item.sizeFormatted}</span>
                      <span>•</span>
                      <span className="text-brand-600 dark:text-brand-400 font-medium">
                        {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    title="Move up"
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    disabled={index === files.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    title="Move down"
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    title="Remove file"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Configuration & Action Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Output File Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={outputFileName}
                    onChange={(e) => setOutputFileName(e.target.value)}
                    placeholder="merged_document.pdf"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Summary
                </label>
                <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between font-mono">
                  <span>Files: {files.length}</span>
                  <span>Total Pages: {totalPages}</span>
                </div>
              </div>
            </div>

            {isMerging && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>Merging PDF streams...</span>
                  <span>{mergeProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${mergeProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                disabled={isMerging || files.length < 2}
                onClick={handleMergePdf}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
              >
                {isMerging ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Merging Documents...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Merge & Download PDF ({totalPages} Pages)
                  </>
                )}
              </button>

              {previewPdfUrl && (
                <a
                  href={previewPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Preview Merged PDF
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2.5">
            <CheckCircle2 size={16} />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Zero Server Uploads</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Documents are processed entirely inside browser memory using WebAssembly and Web Crypto.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-2.5">
            <Layers size={16} />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Preserves Visual Quality</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Maintains original vector outlines, fonts, annotations, embedded images, and exact DPI.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2.5">
            <AlertCircle size={16} />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Unlimited File Size</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            No page limits, watermarks, subscriptions, or hidden paywalls.
          </p>
        </div>
      </div>
    </div>
  );
};
