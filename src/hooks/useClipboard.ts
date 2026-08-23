import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const copyToClipboard = useCallback(async (text: string, label = 'Copied to clipboard!') => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      addToast(label, text.length > 50 ? `${text.substring(0, 47)}...` : text, 'success');
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      addToast('Failed to copy', 'Please try copying manually', 'error');
      return false;
    }
  }, [addToast, timeout]);

  return { copied, copyToClipboard };
}
