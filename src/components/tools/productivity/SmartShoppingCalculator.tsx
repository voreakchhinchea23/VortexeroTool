import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Tag,
  Scale,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';
import {
  calculateDiscountSummary,
  compareUnitPrices,
  ProductPackOption,
} from '../../../utils/everydayUtils';

type TabMode = 'discount' | 'unit_price';

export const SmartShoppingCalculator: React.FC = () => {
  const [tab, setTab] = useState<TabMode>('discount');

  // Tab 1: Discount & Tax
  const [price, setPrice] = useState<number>(120);
  const [quantity, setQuantity] = useState<number>(1);
  const [discountPct, setDiscountPct] = useState<number>(25);
  const [extraCouponPct, setExtraCouponPct] = useState<number>(10);
  const [taxPct, setTaxPct] = useState<number>(8.5);

  // Tab 2: Unit Price Comparator
  const [unitCategory, setUnitCategory] = useState<'vol' | 'mass' | 'count'>('vol');
  const [packs, setPacks] = useState<ProductPackOption[]>([
    { id: '1', label: 'Small Bottle', price: 3.49, quantity: 500, unit: 'ml' },
    { id: '2', label: 'Medium Bottle', price: 6.99, quantity: 1.2, unit: 'l' },
    { id: '3', label: 'Family Pack', price: 10.49, quantity: 2.0, unit: 'l' },
  ]);

  const { copyToClipboard } = useClipboard();

  const discountResult = useMemo(() => {
    return calculateDiscountSummary(price, quantity, discountPct, extraCouponPct, taxPct);
  }, [price, quantity, discountPct, extraCouponPct, taxPct]);

  const evaluatedPacks = useMemo(() => {
    return compareUnitPrices(packs);
  }, [packs]);

  const handleUnitCategoryChange = (cat: 'vol' | 'mass' | 'count') => {
    setUnitCategory(cat);
    if (cat === 'vol') {
      setPacks([
        { id: '1', label: 'Small Bottle', price: 3.49, quantity: 500, unit: 'ml' },
        { id: '2', label: 'Medium Bottle', price: 6.99, quantity: 1.2, unit: 'l' },
        { id: '3', label: 'Family Pack', price: 10.49, quantity: 2.0, unit: 'l' },
      ]);
    } else if (cat === 'mass') {
      setPacks([
        { id: '1', label: 'Regular Bag', price: 4.5, quantity: 400, unit: 'g' },
        { id: '2', label: 'Bulk Bag', price: 9.8, quantity: 1.0, unit: 'kg' },
        { id: '3', label: 'Club Pack', price: 14.9, quantity: 3.5, unit: 'lb' },
      ]);
    } else {
      setPacks([
        { id: '1', label: '6-Pack', price: 5.4, quantity: 6, unit: 'pcs' },
        { id: '2', label: '12-Pack', price: 9.6, quantity: 12, unit: 'pcs' },
        { id: '3', label: '24-Pack', price: 17.99, quantity: 24, unit: 'pcs' },
      ]);
    }
  };

  const unitOptions: ProductPackOption['unit'][] =
    unitCategory === 'vol' ? ['ml', 'l'] : unitCategory === 'mass' ? ['g', 'kg', 'oz', 'lb'] : ['pcs'];

  const quickDiscounts = [10, 15, 20, 25, 30, 40, 50, 70];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setTab('discount')}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tab === 'discount'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Tag size={17} />
          <span>Sale Discount & Tax</span>
        </button>

        <button
          onClick={() => setTab('unit_price')}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tab === 'unit_price'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Scale size={17} />
          <span>Best Value / Unit Price</span>
        </button>
      </div>

      {/* TAB 1: Discount & Tax */}
      {tab === 'discount' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag size={17} className="text-orange-500" />
              Price & Discounts
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Tag Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold text-center"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-500 uppercase">Sale Discount</span>
                <span className="font-mono text-orange-500">{discountPct}% OFF</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                {quickDiscounts.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPct(pct)}
                    className={`py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                      discountPct === pct
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="0"
                max="95"
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Extra Coupon (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={extraCouponPct}
                  onChange={(e) => setExtraCouponPct(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Sales Tax / VAT (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.25"
                  value={taxPct}
                  onChange={(e) => setTaxPct(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-orange-950/45 via-slate-900/95 to-[#160b04] border border-orange-500/30 text-white shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-300">Final Checkout Price</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Save {discountResult.effectiveDiscountPct.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black font-mono text-white">${discountResult.finalTotal.toFixed(2)}</span>
              <span className="text-xs text-slate-400">incl. tax</span>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Original Subtotal:</span>
                <span className="font-mono line-through text-slate-400">${discountResult.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Total Discount Saved:</span>
                <span className="font-mono">-${discountResult.totalDiscountSaved.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Sale Price (Before Tax):</span>
                <span className="font-mono font-bold">${discountResult.afterExtraCoupon.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Sales Tax ({taxPct}%):</span>
                <span className="font-mono">+${discountResult.taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() =>
                copyToClipboard(
                  `Original: $${discountResult.subtotal.toFixed(2)} | Saved: $${discountResult.totalDiscountSaved.toFixed(2)} (${discountResult.effectiveDiscountPct.toFixed(1)}%) | Final w/ Tax: $${discountResult.finalTotal.toFixed(2)}`,
                  'Price breakdown copied!'
                )
              }
              className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy size={14} />
              <span>Copy Price Breakdown</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Unit Price Comparator */}
      {tab === 'unit_price' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Compare Product Sizes to Find the Best Deal</h2>
              <p className="text-xs text-slate-400">Automatically normalizes grams, kilograms, ounces, pounds, milliliters, and liters.</p>
            </div>

            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              {[
                { id: 'vol', label: 'Volume (ml / L)' },
                { id: 'mass', label: 'Weight (g / kg / oz / lb)' },
                { id: 'count', label: 'Count (pcs)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleUnitCategoryChange(m.id as 'vol' | 'mass' | 'count')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    unitCategory === m.id ? 'bg-orange-500 text-white' : 'text-slate-500'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evaluatedPacks.map((pack, idx) => (
              <div
                key={pack.id}
                className={`p-5 rounded-3xl border shadow-sm space-y-4 transition-all ${
                  pack.isBestValue
                    ? 'bg-gradient-to-br from-emerald-950/45 via-slate-900/95 to-[#061510] border-emerald-500/50 text-white shadow-xl'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={pack.label}
                    onChange={(e) =>
                      setPacks((prev) => prev.map((p) => (p.id === pack.id ? { ...p, label: e.target.value } : p)))
                    }
                    className={`font-bold text-sm bg-transparent border-b border-transparent focus:border-orange-500 focus:outline-none w-36 ${
                      pack.isBestValue ? 'text-white' : 'text-slate-900 dark:text-white'
                    }`}
                  />
                  {pack.isBestValue ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      Best Value
                    </span>
                  ) : packs.length > 2 ? (
                    <button
                      onClick={() => setPacks((prev) => prev.filter((p) => p.id !== pack.id))}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">Option {idx + 1}</span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={`text-[10px] font-bold uppercase block mb-1 ${pack.isBestValue ? 'text-emerald-300' : 'text-slate-400'}`}>
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={pack.price || ''}
                      onChange={(e) =>
                        setPacks((prev) => prev.map((p) => (p.id === pack.id ? { ...p, price: Number(e.target.value) } : p)))
                      }
                      className={`w-full px-3 py-2 rounded-xl border font-mono font-bold text-sm ${
                        pack.isBestValue
                          ? 'bg-slate-900/70 border-emerald-500/30 text-white'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${pack.isBestValue ? 'text-emerald-300' : 'text-slate-400'}`}>
                        Size / Amount
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.1"
                        value={pack.quantity || ''}
                        onChange={(e) =>
                          setPacks((prev) =>
                            prev.map((p) => (p.id === pack.id ? { ...p, quantity: Number(e.target.value) } : p))
                          )
                        }
                        className={`w-full px-3 py-2 rounded-xl border font-mono font-bold text-sm ${
                          pack.isBestValue
                            ? 'bg-slate-900/70 border-emerald-500/30 text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-[10px] font-bold uppercase block mb-1 ${pack.isBestValue ? 'text-emerald-300' : 'text-slate-400'}`}>
                        Unit
                      </label>
                      <select
                        value={pack.unit}
                        onChange={(e) =>
                          setPacks((prev) =>
                            prev.map((p) =>
                              p.id === pack.id ? { ...p, unit: e.target.value as ProductPackOption['unit'] } : p
                            )
                          )
                        }
                        className={`w-full px-2.5 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                          pack.isBestValue
                            ? 'bg-slate-900 border-emerald-500/30 text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {unitOptions.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 border-t ${pack.isBestValue ? 'border-emerald-500/30' : 'border-slate-100 dark:border-slate-800'}`}>
                  <span className={`text-[10px] font-bold uppercase ${pack.isBestValue ? 'text-emerald-300' : 'text-slate-400'}`}>
                    Unit Cost
                  </span>
                  <p className={`text-xl font-black font-mono ${pack.isBestValue ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    ${pack.pricePerStandardUnit.toFixed(2)}{' '}
                    <span className="text-xs font-normal opacity-70">/ {pack.standardUnitLabel}</span>
                  </p>
                  {pack.savingsVsWorstPct > 0.5 && (
                    <span className="text-[11px] font-bold text-emerald-500">
                      {pack.savingsVsWorstPct.toFixed(0)}% cheaper than highest option
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {packs.length < 6 && (
            <button
              onClick={() =>
                setPacks((prev) => [
                  ...prev,
                  {
                    id: `${Date.now()}`,
                    label: `Option ${prev.length + 1}`,
                    price: 5.0,
                    quantity: 1,
                    unit: unitOptions[0],
                  },
                ])
              }
              className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Another Product Option</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
