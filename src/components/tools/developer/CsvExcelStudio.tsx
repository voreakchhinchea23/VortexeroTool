import React, { useState, useMemo } from 'react';
import { Table, FileSpreadsheet, Download, Copy, Database, Code, Plus, Trash2, Search, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

const SAMPLE_CSV = `id,name,role,department,salary,status
101,John Doe,Senior Architect,Engineering,145000,Active
102,Sarah Smith,Product Lead,Product,130000,Active
103,Alex Rivera,Fullstack Engineer,Engineering,115000,Active
104,Elena Rostova,UI/UX Designer,Design,98000,Active
105,David Chen,DevOps Lead,Infrastructure,125000,On Leave`;

export const CsvExcelStudio: React.FC = () => {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [outputTab, setOutputTab] = useState<'grid' | 'json' | 'sql' | 'markdown' | 'html'>('grid');
  const [sqlTable, setSqlTable] = useState('employees');
  const [searchQuery, setSearchQuery] = useState('');

  const { copyToClipboard } = useClipboard();

  // Parse CSV into headers and rows
  const { headers, rows } = useMemo(() => {
    const lines = csvText.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [] };

    const parsedHeaders = lines[0].split(',').map(h => h.trim());
    const parsedRows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const rowObj: Record<string, string> = {};
      parsedHeaders.forEach((h, i) => {
        rowObj[h] = values[i] !== undefined ? values[i] : '';
      });
      return rowObj;
    });

    return { headers: parsedHeaders, rows: parsedRows };
  }, [csvText]);

  // Filtered rows for grid
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(r => Object.values(r).some(val => val.toLowerCase().includes(q)));
  }, [rows, searchQuery]);

  // Generated JSON
  const jsonOutput = useMemo(() => {
    return JSON.stringify(rows, null, 2);
  }, [rows]);

  // Generated SQL
  const sqlOutput = useMemo(() => {
    if (rows.length === 0 || headers.length === 0) return '';
    const cols = headers.join(', ');
    const queries = rows.map(r => {
      const vals = headers.map(h => {
        const val = r[h] || '';
        return isNaN(Number(val)) || val === '' ? `'${val.replace(/'/g, "''")}'` : val;
      }).join(', ');
      return `INSERT INTO ${sqlTable} (${cols}) VALUES (${vals});`;
    });
    return queries.join('\n');
  }, [rows, headers, sqlTable]);

  // Generated Markdown Table
  const markdownOutput = useMemo(() => {
    if (headers.length === 0) return '';
    const headerRow = `| ${headers.join(' | ')} |`;
    const dividerRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const bodyRows = rows.map(r => `| ${headers.map(h => r[h] || '').join(' | ')} |`).join('\n');
    return `${headerRow}\n${dividerRow}\n${bodyRows}`;
  }, [headers, rows]);

  // Generated HTML Table
  const htmlOutput = useMemo(() => {
    if (headers.length === 0) return '';
    return `<table border="1" cellpadding="8" cellspacing="0">\n  <thead>\n    <tr>\n      ${headers.map(h => `<th>${h}</th>`).join('')}\n    </tr>\n  </thead>\n  <tbody>\n${rows.map(r => `    <tr>\n      ${headers.map(h => `<td>${r[h] || ''}</td>`).join('')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
  }, [headers, rows]);

  const handleDownloadCsv = () => {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vortexero-data-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vortexero-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top CSV Input & Quick Actions */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-brand-500" size={18} />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">CSV & Spreadsheet Raw Data</h3>
            <span className="text-xs font-mono font-bold text-slate-400">({rows.length} rows, {headers.length} columns)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Download .CSV</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download size={13} />
              <span>Export .JSON</span>
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Paste comma-separated CSV text..."
          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
      </div>

      {/* Output Views Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold gap-1">
          {[
            { id: 'grid', label: 'Interactive Table Grid' },
            { id: 'json', label: 'JSON Data' },
            { id: 'sql', label: 'SQL INSERT Statements' },
            { id: 'markdown', label: 'Markdown Table' },
            { id: 'html', label: 'HTML Table' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setOutputTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                outputTab === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {outputTab === 'grid' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table rows..."
              className="bg-transparent focus:outline-none text-xs"
            />
          </div>
        )}

        {outputTab === 'sql' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Table Name:</span>
            <input
              type="text"
              value={sqlTable}
              onChange={(e) => setSqlTable(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold"
            />
          </div>
        )}
      </div>

      {/* View 1: Interactive Table Grid */}
      {outputTab === 'grid' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                {headers.map((h, i) => (
                  <th key={i} className="p-3 font-extrabold uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  {headers.map((h, cIdx) => (
                    <td key={cIdx} className="p-3 font-medium text-slate-800 dark:text-slate-200">
                      {row[h] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View 2: JSON Code Box */}
      {outputTab === 'json' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">JSON Output</span>
            <button
              onClick={() => copyToClipboard(jsonOutput, 'JSON copied!')}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Copy size={13} />
              <span>Copy JSON</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96">
            {jsonOutput}
          </pre>
        </div>
      )}

      {/* View 3: SQL Code Box */}
      {outputTab === 'sql' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">SQL INSERT Queries</span>
            <button
              onClick={() => copyToClipboard(sqlOutput, 'SQL queries copied!')}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Copy size={13} />
              <span>Copy SQL</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto max-h-96">
            {sqlOutput}
          </pre>
        </div>
      )}

      {/* View 4: Markdown Table */}
      {outputTab === 'markdown' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">GFM Markdown Table</span>
            <button
              onClick={() => copyToClipboard(markdownOutput, 'Markdown table copied!')}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Copy size={13} />
              <span>Copy Markdown</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-96">
            {markdownOutput}
          </pre>
        </div>
      )}

      {/* View 5: HTML Table */}
      {outputTab === 'html' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">HTML Table Code</span>
            <button
              onClick={() => copyToClipboard(htmlOutput, 'HTML table copied!')}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Copy size={13} />
              <span>Copy HTML</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-amber-300 font-mono text-xs overflow-x-auto max-h-96">
            {htmlOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
