import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  successMessage?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  iconOnly?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  successMessage,
  className = '',
  size = 'md',
  variant = 'secondary',
  iconOnly = false,
}) => {
  const { copied, copyToClipboard } = useClipboard();

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-4 py-2.5 text-base gap-2.5',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const variantClasses = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 active:scale-95',
    secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 active:scale-95',
    outline: 'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 active:scale-95',
  };

  return (
    <button
      type="button"
      onClick={() => copyToClipboard(textToCopy, successMessage || label)}
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={label}
    >
      {copied ? (
        <>
          <Check size={iconSizes[size]} className="text-emerald-500 animate-in zoom-in-50 duration-200" />
          {!iconOnly && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>}
        </>
      ) : (
        <>
          <Copy size={iconSizes[size]} />
          {!iconOnly && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
