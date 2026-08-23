import React, { useState } from 'react';
import { Receipt, Printer, Plus, Trash2, Download, Building2, User, DollarSign, Calendar, Sparkles, Check } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export const InvoiceGenerator: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
  const [currency, setCurrency] = useState('$');

  // Company Details
  const [companyName, setCompanyName] = useState('Vortexero Solutions Inc.');
  const [companyEmail, setCompanyEmail] = useState('billing@vortexero.io');
  const [companyAddress, setCompanyAddress] = useState('100 Market St, San Francisco, CA 94105');

  // Client Details
  const [clientName, setClientName] = useState('Acme Corporation');
  const [clientEmail, setClientEmail] = useState('accounts@acme.com');
  const [clientAddress, setClientAddress] = useState('500 Tech Blvd, New York, NY 10001');

  // Line items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Fullstack Web Application Architecture & Development', quantity: 1, price: 4500 },
    { id: '2', description: 'UI/UX Design System & Interactive Prototypes', quantity: 1, price: 1800 },
    { id: '3', description: 'Cloud Infrastructure Setup & CI/CD Pipelines', quantity: 1, price: 1200 },
  ]);

  const [taxRate, setTaxRate] = useState<number>(8); // 8%
  const [discountRate, setDiscountRate] = useState<number>(5); // 5%
  const [notes, setNotes] = useState('Thank you for your business! Payment is due within 14 days of invoice issuance.');

  const { addToast } = useToast();

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: 'New Service or Deliverable', quantity: 1, price: 500 }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // Math Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const discountAmount = subtotal * (discountRate / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxRate / 100);
  const grandTotal = taxableAmount + taxAmount;

  // Isolated Clean PDF Print (Single-Page Guarantee)
  const handlePrint = () => {
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow?.document;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Invoice ${invoiceNumber}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              background: #ffffff !important;
              color: #0f172a !important;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body class="p-4">
          <!-- Header -->
          <div class="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <h1 class="text-3xl font-black tracking-tight text-slate-900">INVOICE</h1>
              <p class="font-mono text-sm font-bold text-blue-600 mt-1">${invoiceNumber}</p>
            </div>
            <div class="text-right text-xs text-slate-600 space-y-0.5">
              <h2 class="font-extrabold text-sm text-slate-900">${companyName}</h2>
              <p>${companyEmail}</p>
              <p>${companyAddress}</p>
            </div>
          </div>

          <!-- Billed To & Dates -->
          <div class="grid grid-cols-2 gap-6 mb-8 text-xs">
            <div>
              <span class="font-bold uppercase tracking-wider text-slate-400 block mb-1">Billed To</span>
              <p class="font-extrabold text-sm text-slate-900">${clientName}</p>
              <p class="text-slate-600">${clientEmail}</p>
              <p class="text-slate-600">${clientAddress}</p>
            </div>
            <div class="text-right space-y-1">
              <p><span class="text-slate-500">Invoice Date:</span> <strong class="font-mono">${issueDate}</strong></p>
              <p><span class="text-slate-500">Payment Due:</span> <strong class="font-mono text-rose-600">${dueDate}</strong></p>
            </div>
          </div>

          <!-- Items Table -->
          <table class="w-full text-left text-xs mb-6">
            <thead>
              <tr class="border-b-2 border-slate-200 bg-slate-50">
                <th class="p-2.5 font-bold uppercase text-slate-600">Description</th>
                <th class="p-2.5 font-bold uppercase text-slate-600 text-center w-16">Qty</th>
                <th class="p-2.5 font-bold uppercase text-slate-600 text-right w-24">Price</th>
                <th class="p-2.5 font-bold uppercase text-slate-600 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${items.map(item => `
                <tr>
                  <td class="p-2.5 font-medium text-slate-900">${item.description}</td>
                  <td class="p-2.5 font-mono text-center text-slate-600">${item.quantity}</td>
                  <td class="p-2.5 font-mono text-right text-slate-600">${currency}${item.price.toLocaleString()}</td>
                  <td class="p-2.5 font-mono font-bold text-right text-slate-900">${currency}${(item.quantity * item.price).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Totals Calculation Box -->
          <div class="flex justify-end mb-8">
            <div class="w-64 space-y-1.5 text-xs">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span class="font-mono font-bold">${currency}${subtotal.toLocaleString()}</span>
              </div>
              ${discountRate > 0 ? `
                <div class="flex justify-between text-emerald-600">
                  <span>Discount (${discountRate}%):</span>
                  <span class="font-mono font-bold">-${currency}${discountAmount.toLocaleString()}</span>
                </div>
              ` : ''}
              <div class="flex justify-between text-slate-600">
                <span>Tax (${taxRate}%):</span>
                <span class="font-mono font-bold">${currency}${taxAmount.toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-base font-black border-t-2 border-slate-900 pt-2 text-slate-900">
                <span>Total Due:</span>
                <span class="font-mono text-blue-600">${currency}${grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="border-t border-slate-200 pt-4 text-xs text-slate-500">
            <p class="font-bold text-slate-700 mb-0.5">Notes & Terms:</p>
            <p>${notes}</p>
          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.focus();
                window.print();
                window.parent.document.body.removeChild(window.frameElement);
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Receipt className="text-brand-500" size={18} />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Professional Invoice Generator</h3>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <Printer size={16} />
          <span>Print / Save Clean PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Form (6/12) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Invoice Meta */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Invoice Settings</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Invoice #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="៛">៛ (KHR)</option>
                  <option value="¥">¥ (JPY/CNY)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Parties Info */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Business & Client</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Your Business Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Business Email</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Line Items Editor */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Line Items</h4>
              <button
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg bg-brand-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    placeholder="Description"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                    placeholder="Qty"
                    className="w-14 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-center"
                  />
                  <input
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value))}
                    placeholder="Price"
                    className="w-20 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-right"
                  />
                  <button
                    disabled={items.length <= 1}
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-rose-500 p-1 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Discount %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tax %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live A4 Invoice Sheet Preview (6/12) */}
        <div className="lg:col-span-6">
          <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 min-h-[600px] font-sans space-y-6">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">INVOICE</h2>
                <p className="font-mono text-xs font-bold text-brand-600 mt-0.5">{invoiceNumber}</p>
              </div>
              <div className="text-right text-[11px] text-slate-600">
                <p className="font-bold text-slate-900">{companyName}</p>
                <p>{companyEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Billed To</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{clientName}</p>
                <p className="text-slate-600">{clientEmail}</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-slate-500">Date: <strong className="font-mono text-slate-900">{issueDate}</strong></p>
                <p className="text-slate-500">Due: <strong className="font-mono text-rose-600">{dueDate}</strong></p>
              </div>
            </div>

            {/* Preview Table */}
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="p-2 font-bold text-slate-600">Item</th>
                  <th className="p-2 font-bold text-slate-600 text-center">Qty</th>
                  <th className="p-2 font-bold text-slate-600 text-right">Price</th>
                  <th className="p-2 font-bold text-slate-600 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => (
                  <tr key={item.id}>
                    <td className="p-2 font-medium text-slate-800">{item.description}</td>
                    <td className="p-2 font-mono text-center text-slate-600">{item.quantity}</td>
                    <td className="p-2 font-mono text-right text-slate-600">{currency}{item.price.toLocaleString()}</td>
                    <td className="p-2 font-mono font-bold text-right text-slate-900">{currency}{(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Breakdown */}
            <div className="flex justify-end pt-2">
              <div className="w-52 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold">{currency}{subtotal.toLocaleString()}</span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({discountRate}%):</span>
                    <span className="font-mono font-bold">-{currency}{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({taxRate}%):</span>
                  <span className="font-mono font-bold">{currency}{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t-2 border-slate-900 pt-1.5 text-slate-900">
                  <span>Grand Total:</span>
                  <span className="font-mono text-brand-600">{currency}{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
