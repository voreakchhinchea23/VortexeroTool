import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-950/10 text-slate-900 dark:text-slate-100"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-blue-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
