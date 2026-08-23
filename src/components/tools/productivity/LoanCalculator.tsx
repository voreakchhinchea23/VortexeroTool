import React, { useState, useMemo } from 'react';
import { DollarSign, Percent, Calendar, Calculator, TrendingUp, PieChart, ArrowRight, Download, RefreshCw } from 'lucide-react';
import { CopyButton } from '../../common/CopyButton';

export const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [viewSchedule, setViewSchedule] = useState<'yearly' | 'monthly'>('yearly');

  // Calculation
  const {
    monthlyPayment,
    totalPayment,
    totalInterest,
    payoffMonths,
    totalInterestWithExtra,
    interestSaved,
    monthsSaved,
    amortization,
  } = useMemo(() => {
    const P = Math.max(0, loanAmount);
    const annualR = Math.max(0, interestRate) / 100;
    const r = annualR / 12;
    const n = Math.max(1, loanTermYears * 12);
    const extra = Math.max(0, extraPayment);

    // Standard Monthly Payment (EMI) formula: P * r * (1+r)^n / ((1+r)^n - 1)
    let standardMonthly = 0;
    if (r === 0) {
      standardMonthly = P / n;
    } else {
      standardMonthly = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    if (isNaN(standardMonthly) || !isFinite(standardMonthly)) {
      standardMonthly = 0;
    }

    // Amortization Schedule
    let balance = P;
    let balanceWithExtra = P;
    let totalInt = 0;
    let totalIntWithExtra = 0;
    let monthsWithExtra = 0;

    interface ScheduleRow {
      month: number;
      year: number;
      principalPayment: number;
      interestPayment: number;
      totalPayment: number;
      remainingBalance: number;
    }

    const monthlySchedule: ScheduleRow[] = [];

    for (let m = 1; m <= n; m++) {
      if (balance <= 0) break;

      const interestPart = balance * r;
      let principalPart = standardMonthly - interestPart;
      if (principalPart > balance) {
        principalPart = balance;
      }
      balance = Math.max(0, balance - principalPart);
      totalInt += interestPart;

      monthlySchedule.push({
        month: m,
        year: Math.ceil(m / 12),
        principalPayment: principalPart,
        interestPayment: interestPart,
        totalPayment: principalPart + interestPart,
        remainingBalance: balance,
      });
    }

    // Calculation with extra payments
    for (let m = 1; m <= n; m++) {
      if (balanceWithExtra <= 0) break;
      monthsWithExtra++;

      const interestPart = balanceWithExtra * r;
      let principalPart = standardMonthly + extra - interestPart;
      if (principalPart > balanceWithExtra) {
        principalPart = balanceWithExtra;
      }
      balanceWithExtra = Math.max(0, balanceWithExtra - principalPart);
      totalIntWithExtra += interestPart;
    }

    // Yearly Aggregation for Schedule
    interface YearlyRow {
      year: number;
      principalPaid: number;
      interestPaid: number;
      totalPaid: number;
      endingBalance: number;
    }

    const yearlySchedule: YearlyRow[] = [];
    let curYearPrincipal = 0;
    let curYearInterest = 0;
    let curYearTotal = 0;

    monthlySchedule.forEach((row) => {
      curYearPrincipal += row.principalPayment;
      curYearInterest += row.interestPayment;
      curYearTotal += row.totalPayment;

      if (row.month % 12 === 0 || row.month === monthlySchedule.length) {
        yearlySchedule.push({
          year: row.year,
          principalPaid: curYearPrincipal,
          interestPaid: curYearInterest,
          totalPaid: curYearTotal,
          endingBalance: row.remainingBalance,
        });
        curYearPrincipal = 0;
        curYearInterest = 0;
        curYearTotal = 0;
      }
    });

    const savedInt = Math.max(0, totalInt - totalIntWithExtra);
    const savedMo = Math.max(0, n - monthsWithExtra);

    return {
      monthlyPayment: standardMonthly,
      totalPayment: P + totalInt,
      totalInterest: totalInt,
      payoffMonths: monthsWithExtra,
      totalInterestWithExtra: totalIntWithExtra,
      interestSaved: savedInt,
      monthsSaved: savedMo,
      amortization: {
        monthly: monthlySchedule,
        yearly: yearlySchedule,
      },
    };
  }, [loanAmount, interestRate, loanTermYears, extraPayment]);

  const principalRatio = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 50;
  const interestRatio = 100 - principalRatio;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Input & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Loan Input Form */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator size={18} className="text-emerald-500" />
              Loan Parameters
            </h2>
            <button
              onClick={() => {
                setLoanAmount(250000);
                setInterestRate(6.5);
                setLoanTermYears(30);
                setExtraPayment(0);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              Reset
            </button>
          </div>

          {/* Loan Amount */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Loan Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="1000"
                step="5000"
                value={loanAmount || ''}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <input
              type="range"
              min="10000"
              max="1500000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full mt-2.5 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Interest Rate & Term */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Interest Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  max="30"
                  step="0.1"
                  value={interestRate || ''}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Loan Term (Years)
              </label>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value={5}>5 Years (Auto/Personal)</option>
                <option value={10}>10 Years</option>
                <option value={15}>15 Years (Mortgage)</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years</option>
                <option value={30}>30 Years (Standard Home)</option>
              </select>
            </div>
          </div>

          {/* Extra Monthly Payment (Optional Simulator) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} />
                Extra Monthly Payment ($)
              </label>
              {extraPayment > 0 && (
                <span className="text-[11px] font-mono text-emerald-500 font-bold">
                  Saves ${(interestSaved).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="0"
                step="50"
                value={extraPayment || ''}
                placeholder="0 (optional)"
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-[#0b101c] border border-emerald-500/30 text-white shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Monthly Repayment Estimate
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Fixed Rate
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-medium text-slate-400">/ month</span>
            </div>

            {extraPayment > 0 && (
              <p className="text-xs text-emerald-300 mt-2 font-medium">
                + ${extraPayment}/mo extra = Pay off in {Math.floor(payoffMonths / 12)} yrs {payoffMonths % 12} mos ({Math.floor(monthsSaved / 12)} yrs earlier)!
              </p>
            )}
          </div>

          {/* Breakdown Stat Pills */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Principal</span>
              <p className="text-lg font-extrabold text-white mt-0.5">
                ${loanAmount.toLocaleString('en-US')}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Interest</span>
              <p className="text-lg font-extrabold text-amber-400 mt-0.5">
                ${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Ratio Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-emerald-400">Principal: {principalRatio.toFixed(1)}%</span>
              <span className="text-amber-400">Interest: {interestRatio.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${principalRatio}%` }}
              />
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${interestRatio}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-2">
              <span>Total Repaid: ${totalPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              <span>{loanTermYears * 12} Total Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Amortization Schedule</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete breakdown of principal vs interest over time.
            </p>
          </div>

          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setViewSchedule('yearly')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewSchedule === 'yearly'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Annual Summary
            </button>
            <button
              onClick={() => setViewSchedule('monthly')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewSchedule === 'monthly'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Monthly Table
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-850 dark:bg-slate-800/80 sticky top-0 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">{viewSchedule === 'yearly' ? 'Year' : 'Month'}</th>
                <th className="p-3.5">Principal Paid</th>
                <th className="p-3.5">Interest Paid</th>
                <th className="p-3.5">Total Payment</th>
                <th className="p-3.5">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-slate-600 dark:text-slate-300">
              {viewSchedule === 'yearly'
                ? amortization.yearly.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">Year {row.year}</td>
                      <td className="p-3.5 text-emerald-600 dark:text-emerald-400">
                        ${row.principalPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3.5 text-amber-600 dark:text-amber-400">
                        ${row.interestPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3.5">${row.totalPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        ${row.endingBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))
                : amortization.monthly.slice(0, 120).map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Mo {row.month}</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400">
                        ${row.principalPayment.toFixed(2)}
                      </td>
                      <td className="p-3 text-amber-600 dark:text-amber-400">
                        ${row.interestPayment.toFixed(2)}
                      </td>
                      <td className="p-3">${row.totalPayment.toFixed(2)}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        ${row.remainingBalance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
