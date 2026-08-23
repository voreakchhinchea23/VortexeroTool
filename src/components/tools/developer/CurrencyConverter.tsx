import React, { useState } from 'react';
import { DollarSign, ArrowRightLeft, TrendingUp, RefreshCw, Copy, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

// Standard benchmark exchange rates relative to USD ($1 base)
const EXCHANGE_RATES: Record<string, { name: string; symbol: string; rate: number; flag: string }> = {
  USD: { name: 'US Dollar', symbol: '$', rate: 1.0, flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', rate: 0.92, flag: '🇪🇺' },
  KHR: { name: 'Cambodian Riel', symbol: '៛', rate: 4050.0, flag: '🇰🇭' },
  GBP: { name: 'British Pound', symbol: '£', rate: 0.79, flag: '🇬🇧' },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 154.5, flag: '🇯🇵' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', rate: 1.34, flag: '🇸🇬' },
  THB: { name: 'Thai Baht', symbol: '฿', rate: 36.2, flag: '🇹🇭' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', rate: 7.23, flag: '🇨🇳' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 1.36, flag: '🇨🇦' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.52, flag: '🇦🇺' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', rate: 0.88, flag: '🇨🇭' },
  KRW: { name: 'South Korean Won', symbol: '₩', rate: 1380.0, flag: '🇰🇷' },
  VND: { name: 'Vietnamese Dong', symbol: '₫', rate: 25400.0, flag: '🇻🇳' },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 83.4, flag: '🇮🇳' },
};

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('KHR');

  const { copyToClipboard } = useClipboard();

  const fromData = EXCHANGE_RATES[fromCurrency] || EXCHANGE_RATES.USD;
  const toData = EXCHANGE_RATES[toCurrency] || EXCHANGE_RATES.KHR;

  // Convert amount from base USD
  const convertedAmount = ((amount / fromData.rate) * toData.rate);
  const formattedResult = convertedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const singleUnitRate = ((1 / fromData.rate) * toData.rate).toFixed(4);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const quickCurrencies = ['USD', 'EUR', 'KHR', 'JPY', 'SGD', 'THB', 'GBP'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Main Converter Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign size={18} className="text-brand-500" />
            <span>Currency Exchange Converter</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Benchmark Reference Rates</span>
        </div>

        {/* Converter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From Column */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Amount & From</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-base font-bold"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer"
            >
              {Object.entries(EXCHANGE_RATES).map(([code, cur]) => (
                <option key={code} value={code}>
                  {cur.flag} {code} — {cur.name} ({cur.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="flex justify-center md:pt-6">
            <button
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Swap currencies"
            >
              <ArrowRightLeft size={18} />
            </button>
          </div>

          {/* To Column */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Converted Amount</label>
            <div className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold text-brand-600 dark:text-brand-400 truncate select-all">
              {toData.symbol} {formattedResult}
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer"
            >
              {Object.entries(EXCHANGE_RATES).map(([code, cur]) => (
                <option key={code} value={code}>
                  {cur.flag} {code} — {cur.name} ({cur.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rate Summary Line */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-emerald-500" />
            <span>
              1 {fromCurrency} = <strong className="font-mono text-slate-900 dark:text-white">{singleUnitRate} {toCurrency}</strong>
            </span>
          </div>

          <button
            onClick={() => copyToClipboard(`${amount} ${fromCurrency} = ${formattedResult} ${toCurrency}`, 'Exchange rate copied!')}
            className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
          >
            <Copy size={13} />
            <span>Copy Calculation</span>
          </button>
        </div>
      </div>

      {/* Quick Benchmark Comparison Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Conversion Matrix for {amount} {fromCurrency}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {quickCurrencies.map(code => {
            const target = EXCHANGE_RATES[code];
            if (!target || code === fromCurrency) return null;

            const val = ((amount / fromData.rate) * target.rate).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            });

            return (
              <div
                key={code}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span>{target.flag}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{code}</span>
                </div>
                <p className="font-mono text-sm font-bold text-slate-900 dark:text-white truncate">
                  {target.symbol} {val}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
