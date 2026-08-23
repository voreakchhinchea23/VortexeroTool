import React, { useState, useMemo } from 'react';
import { DollarSign, Users, Percent, Split, Sparkles, Copy, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState<number>(85.5);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [customTip, setCustomTip] = useState<string>('');
  const [splitCount, setSplitCount] = useState<number>(3);
  const [roundUp, setRoundUp] = useState<boolean>(false);

  const { copyToClipboard } = useClipboard();

  const tipButtons = [10, 15, 18, 20, 25];

  const { tipAmount, totalBill, tipPerPerson, totalPerPerson } = useMemo(() => {
    const subtotal = Math.max(0, billAmount);
    const percent = customTip !== '' ? Math.max(0, Number(customTip)) : tipPercent;
    let tip = (subtotal * percent) / 100;
    let total = subtotal + tip;

    if (roundUp) {
      const roundedTotal = Math.ceil(total);
      tip += roundedTotal - total;
      total = roundedTotal;
    }

    const numPeople = Math.max(1, splitCount);
    const perPersonTip = tip / numPeople;
    const perPersonTotal = total / numPeople;

    return {
      tipAmount: tip,
      totalBill: total,
      tipPerPerson: perPersonTip,
      totalPerPerson: perPersonTotal,
    };
  }, [billAmount, tipPercent, customTip, splitCount, roundUp]);

  const handleCopySummary = () => {
    const text = `Bill Summary:
Subtotal: $${billAmount.toFixed(2)}
Tip (${customTip || tipPercent}%): $${tipAmount.toFixed(2)}
Total: $${totalBill.toFixed(2)}
Split between ${splitCount} people: $${totalPerPerson.toFixed(2)} each (Tip: $${tipPerPerson.toFixed(2)})`;
    copyToClipboard(text, 'Bill split summary copied to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bill Inputs */}
        <div className="md:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign size={18} className="text-amber-500" />
            Bill & Gratuity
          </h2>

          {/* Bill Amount */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Bill Subtotal ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={billAmount || ''}
                onChange={(e) => setBillAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Tip Percentage Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Tip Percentage
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2.5">
              {tipButtons.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTip('');
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    tipPercent === pct && customTip === ''
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Custom tip %"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
            </div>
          </div>

          {/* Split Among People */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Split Between People
              </label>
              <span className="text-xs font-bold font-mono text-amber-500">{splitCount} {splitCount === 1 ? 'Person' : 'People'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                -
              </button>
              <input
                type="range"
                min="1"
                max="30"
                value={splitCount}
                onChange={(e) => setSplitCount(Number(e.target.value))}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setSplitCount(splitCount + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Round Up Option */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={roundUp}
                onChange={(e) => setRoundUp(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
              />
              <span>Round up bill to nearest dollar</span>
            </label>
          </div>
        </div>

        {/* Results Card */}
        <div className="md:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-[#120a04] border border-amber-500/30 text-white shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                Amount Per Person
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {splitCount} Way Split
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                ${totalPerPerson.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-slate-400">/ person</span>
            </div>
            <p className="text-xs text-amber-300/80 mt-1 font-medium">
              Includes ${tipPerPerson.toFixed(2)} tip per person
            </p>
          </div>

          {/* Summary Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-white">${billAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tip Amount ({customTip || tipPercent}%):</span>
              <span className="font-mono font-bold text-amber-400">+${tipAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
              <span>Total Bill:</span>
              <span className="font-mono text-emerald-400">${totalBill.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCopySummary}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Copy size={14} />
            <span>Copy Split Breakdown</span>
          </button>
        </div>
      </div>
    </div>
  );
};
