import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, Copy, ExternalLink, Heart, Check, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useClipboard } from '../../hooks/useClipboard';
import confetti from 'canvas-confetti';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const { copyToClipboard } = useClipboard();

  const accountName = 'CHHINCHEA VOREAK';
  const accountNumber = '006 567 202';
  const rawAccountNumber = '006567202';
  const payLink = 'https://pay.ababank.com/oRF8/fqvg1ywz';

  const triggerSupportConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#6366f1'],
      });
    } catch {
      // ignore
    }
  };

  const handleCopyAccount = () => {
    copyToClipboard(rawAccountNumber, 'Account Number 006 567 202 copied!');
    triggerSupportConfetti();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 space-y-5 p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
              <Coffee size={28} className="animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Buy Me a Coffee ☕
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Support the development & free hosting of <strong>VortexeroTool</strong>!
              </p>
            </div>
          </div>

          {/* ABA Banking Payment Card UI */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003c71] via-[#004f8c] to-[#006bb3] text-white p-5 sm:p-6 shadow-xl space-y-4 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-wider text-white">ABA Bank</span>
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-extrabold uppercase">ABA PAY</span>
              </div>
              <CreditCard size={20} className="text-white/80" />
            </div>

            {/* Account Details */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider">
                ឈ្មោះម្ចាស់គណនី / Account Name
              </span>
              <p className="text-lg font-black tracking-wide">{accountName}</p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/20">
              <div>
                <span className="text-[10px] text-blue-200 uppercase font-semibold">លេខគណនី / Account Number</span>
                <p className="font-mono text-xl font-black tracking-widest">{accountNumber}</p>
              </div>

              <button
                onClick={handleCopyAccount}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <Copy size={13} />
                <span>Copy</span>
              </button>
            </div>
          </div>

          {/* QR Code & Direct Link */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="sm:col-span-4 flex justify-center">
              <div className="p-2.5 rounded-xl bg-white shadow-md border border-slate-200">
                <QRCodeSVG
                  value={payLink}
                  size={100}
                  level="M"
                  fgColor="#003c71"
                  bgColor="#ffffff"
                />
              </div>
            </div>

            <div className="sm:col-span-8 space-y-2 text-center sm:text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Scan QR in ABA Mobile or click to open:
              </p>
              <a
                href={payLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerSupportConfetti}
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#004f8c] hover:bg-[#003c71] text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Pay via ABA Mobile App</span>
                <ExternalLink size={14} />
              </a>
              <p className="text-[11px] text-slate-400">
                ឬចុចលើតំណភ្ជាប់ដើម្បីទូទាត់តាម ABA Pay
              </p>
            </div>
          </div>

          {/* Thank you footer */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <span>Made with</span>
            <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>by <strong>Voreak Chhinchea</strong>. Thank you for your support!</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
