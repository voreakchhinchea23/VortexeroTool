import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Download,
  Search,
  Sparkles,
  PiggyBank,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Zap,
  HeartPulse,
  Briefcase,
  Film,
} from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useToast } from '../../../context/ToastContext';

type TxType = 'expense' | 'income';

interface BudgetTransaction {
  id: string;
  type: TxType;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
}

const EXPENSE_CATEGORIES = [
  { id: 'Food & Dining', color: '#f59e0b', icon: Utensils },
  { id: 'Housing & Rent', color: '#6366f1', icon: Home },
  { id: 'Transport & Fuel', color: '#06b6d4', icon: Car },
  { id: 'Bills & Utilities', color: '#ec4899', icon: Zap },
  { id: 'Shopping', color: '#8b5cf6', icon: ShoppingBag },
  { id: 'Health', color: '#10b981', icon: HeartPulse },
  { id: 'Entertainment', color: '#f43f5e', icon: Film },
  { id: 'Other', color: '#64748b', icon: Wallet },
];

const INCOME_CATEGORIES = [
  { id: 'Salary', color: '#10b981', icon: Briefcase },
  { id: 'Freelance', color: '#06b6d4', icon: Sparkles },
  { id: 'Savings / Gift', color: '#6366f1', icon: PiggyBank },
];

const CURRENCIES = [
  { symbol: '$', code: 'USD' },
  { symbol: '៛', code: 'KHR' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '¥', code: 'JPY' },
  { symbol: '฿', code: 'THB' },
  { symbol: 'S$', code: 'SGD' },
];

export const BudgetTracker: React.FC = () => {
  const todayIso = new Date().toISOString().slice(0, 10);
  const currentMonth = todayIso.slice(0, 7);

  const [transactions, setTransactions] = useLocalStorage<BudgetTransaction[]>('vortexero_budget_txs', [
    { id: 'demo-1', type: 'income', title: 'Monthly Paycheck', amount: 3200, category: 'Salary', date: `${currentMonth}-01` },
    { id: 'demo-2', type: 'expense', title: 'Apartment Rent', amount: 1100, category: 'Housing & Rent', date: `${currentMonth}-02` },
    { id: 'demo-3', type: 'expense', title: 'Weekly Groceries', amount: 145.5, category: 'Food & Dining', date: `${currentMonth}-05` },
    { id: 'demo-4', type: 'expense', title: 'Electricity & Internet', amount: 98, category: 'Bills & Utilities', date: `${currentMonth}-08` },
    { id: 'demo-5', type: 'expense', title: 'Coffee & Lunch', amount: 34.2, category: 'Food & Dining', date: `${currentMonth}-11` },
    { id: 'demo-6', type: 'expense', title: 'Gas & Transit Pass', amount: 65, category: 'Transport & Fuel', date: `${currentMonth}-14` },
  ]);

  const [monthlyBudget, setMonthlyBudget] = useLocalStorage<number>('vortexero_budget_limit', 2000);
  const [currencySymbol, setCurrencySymbol] = useLocalStorage<string>('vortexero_budget_currency', '$');

  // Form states
  const [txType, setTxType] = useState<TxType>('expense');
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Food & Dining');
  const [date, setDate] = useState<string>(todayIso);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [filterType, setFilterType] = useState<'all' | TxType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { addToast } = useToast();

  const handleTypeSwitch = (nextType: TxType) => {
    setTxType(nextType);
    setCategory(nextType === 'expense' ? EXPENSE_CATEGORIES[0].id : INCOME_CATEGORIES[0].id);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!title.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      addToast('Enter a valid description and positive amount', 'error');
      return;
    }

    const newTx: BudgetTransaction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: txType,
      title: title.trim(),
      amount: numericAmount,
      category,
      date: date || todayIso,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setTitle('');
    setAmount('');
    addToast(`${txType === 'income' ? 'Income' : 'Expense'} added!`, `${currencySymbol}${numericAmount.toLocaleString()}`, 'success');
  };

  const handleDeleteTx = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const monthTransactions = useMemo(() => {
    return transactions
      .filter((t) => (!selectedMonth ? true : t.date.startsWith(selectedMonth)))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return monthTransactions.filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [monthTransactions, filterType, searchQuery]);

  const summary = useMemo(() => {
    const totalIncome = monthTransactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = monthTransactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    const budgetRemaining = monthlyBudget - totalExpenses;
    const budgetUsedPct = monthlyBudget > 0 ? Math.min(100, (totalExpenses / monthlyBudget) * 100) : 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Days left in selected month for safe daily spend
    const [yr, mo] = (selectedMonth || currentMonth).split('-').map(Number);
    const daysInMonth = yr && mo ? new Date(yr, mo, 0).getDate() : 30;
    const todayDay = selectedMonth === currentMonth ? new Date().getDate() : 1;
    const remainingDays = Math.max(1, daysInMonth - todayDay + 1);
    const safeDailyAllowance = budgetRemaining > 0 ? budgetRemaining / remainingDays : 0;

    // Breakdown by expense category
    const catTotals = new Map<string, number>();
    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        catTotals.set(t.category, (catTotals.get(t.category) || 0) + t.amount);
      });

    const categoryBreakdown = Array.from(catTotals.entries())
      .map(([catName, value]) => {
        const meta = EXPENSE_CATEGORIES.find((c) => c.id === catName) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
        return {
          name: catName,
          value,
          color: meta.color,
          percent: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
        };
      })
      .sort((a, b) => b.value - a.value);

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      budgetRemaining,
      budgetUsedPct,
      savingsRate,
      safeDailyAllowance,
      categoryBreakdown,
    };
  }, [monthTransactions, monthlyBudget, selectedMonth, currentMonth]);

  const handleExportCsv = () => {
    if (monthTransactions.length === 0) return;
    const rows = [
      ['Date', 'Type', 'Category', 'Description', 'Amount'],
      ...monthTransactions.map((t) => [t.date, t.type, t.category, `"${t.title.replace(/"/g, '""')}"`, t.amount.toFixed(2)]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vortexero-budget-${selectedMonth || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Budget CSV exported!', 'success');
  };

  // SVG Donut chart segments
  const donutSegments = useMemo(() => {
    const r = 46;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    return summary.categoryBreakdown.map((item) => {
      const dashLen = (item.percent / 100) * circ;
      const seg = { ...item, dashArray: `${dashLen} ${circ - dashLen}`, dashOffset: -offset };
      offset += dashLen;
      return seg;
    });
  }, [summary.categoryBreakdown]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Controls & Summary KPIs */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Currency</label>
            <select
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.symbol}>
                  {c.symbol} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Monthly Budget Target</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{currencySymbol}</span>
              <input
                type="number"
                min="0"
                value={monthlyBudget || ''}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-32 pl-7 pr-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={monthTransactions.length === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setTransactions([]);
              addToast('Cleared all budget entries', 'info');
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-slate-900/95 to-[#061510] border border-emerald-500/30 text-white shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase">
            <span>Income</span>
            <TrendingUp size={15} />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono mt-2">
            {currencySymbol}{summary.totalIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Savings rate: {summary.savingsRate.toFixed(1)}%</p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/50 via-slate-900/95 to-[#16080c] border border-rose-500/30 text-white shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400 uppercase">
            <span>Expenses</span>
            <TrendingDown size={15} />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono mt-2">
            {currencySymbol}{summary.totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{summary.budgetUsedPct.toFixed(0)}% of monthly budget</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase block">Net Balance</span>
          <p
            className={`text-2xl sm:text-3xl font-black font-mono mt-2 ${
              summary.netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
            }`}
          >
            {summary.netBalance >= 0 ? '+' : '-'}
            {currencySymbol}{Math.abs(summary.netBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Income minus expenses</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase block">Budget Left</span>
          <p
            className={`text-2xl sm:text-3xl font-black font-mono mt-2 ${
              summary.budgetRemaining >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500'
            }`}
          >
            {currencySymbol}{summary.budgetRemaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Safe daily spend: {currencySymbol}{summary.safeDailyAllowance.toFixed(2)}/day
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Quick Add Form + Category Breakdown Donut (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add Transaction Form */}
          <form
            onSubmit={handleAddTransaction}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus size={17} className="text-emerald-500" />
              Add Transaction
            </h2>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => handleTypeSwitch('expense')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  txType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Expense (-)
              </button>
              <button
                type="button"
                onClick={() => handleTypeSwitch('income')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  txType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Income (+)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Amount ({currencySymbol})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Description / Merchant</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={txType === 'expense' ? 'e.g. Supermarket, Coffee, Uber' : 'e.g. Salary, Client Invoice'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {(txType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      category === cat.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cat.id}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Plus size={16} />
              <span>Save {txType === 'income' ? 'Income' : 'Expense'}</span>
            </button>
          </form>

          {/* Category Spending Donut */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Spending by Category</h3>

            {summary.categoryBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No expenses recorded for this month yet.</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <svg viewBox="0 0 120 120" className="w-36 h-36 shrink-0 -rotate-90">
                  <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="14" className="text-slate-100 dark:text-slate-800" />
                  {donutSegments.map((seg) => (
                    <circle
                      key={seg.name}
                      cx="60"
                      cy="60"
                      r="46"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="14"
                      strokeDasharray={seg.dashArray}
                      strokeDashoffset={seg.dashOffset}
                    />
                  ))}
                </svg>

                <div className="flex-1 w-full space-y-2.5">
                  {summary.categoryBreakdown.map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.name}
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {currencySymbol}{item.value.toFixed(0)} ({item.percent.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Transactions Ledger (7/12) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Transactions ({filteredTransactions.length})
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs w-36"
                />
              </div>

              <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                {(['all', 'expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2.5 py-1 rounded-lg capitalize cursor-pointer ${
                      filterType === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">Monthly Spending Cap Progress</span>
              <span className={`font-mono ${summary.budgetUsedPct > 90 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {currencySymbol}{summary.totalExpenses.toLocaleString()} / {currencySymbol}{monthlyBudget.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  summary.budgetUsedPct > 95 ? 'bg-rose-500' : summary.budgetUsedPct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${summary.budgetUsedPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No matching transactions found for this filter.
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const allCats = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
                const meta = allCats.find((c) => c.id === tx.category) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
                const Icon = meta.icon;
                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: meta.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{tx.title}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span className="font-mono">{tx.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`font-mono text-sm font-extrabold ${
                          tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {currencySymbol}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => handleDeleteTx(tx.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
