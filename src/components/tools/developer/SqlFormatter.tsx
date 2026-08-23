import React, { useState } from 'react';
import { Database, Copy, Check, Play, RefreshCw, FileText, Minimize2, Sparkles } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

const SQL_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'ON',
  'GROUP BY',
  'ORDER BY',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  'CREATE TABLE',
  'ALTER TABLE',
  'DROP TABLE',
  'AS',
  'DISTINCT',
  'IN',
  'NOT IN',
  'IS NULL',
  'IS NOT NULL',
  'BETWEEN',
  'LIKE',
  'UNION',
  'UNION ALL',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'ASC',
  'DESC',
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
];

export const SqlFormatter: React.FC = () => {
  const [inputSql, setInputSql] = useState<string>(
    `select u.id, u.username, u.email, count(o.id) as total_orders, sum(o.amount) as total_spent from users u left join orders o on u.id = o.user_id where u.active = 1 and u.created_at >= '2026-01-01' group by u.id, u.username, u.email having count(o.id) > 2 order by total_spent desc limit 50;`
  );
  const [formattedSql, setFormattedSql] = useState<string>('');
  const [indentSpaces, setIndentSpaces] = useState<number>(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState<boolean>(true);

  const { copyToClipboard } = useClipboard();

  // Basic SQL Formatter Engine
  const formatSql = () => {
    let sql = inputSql.trim();
    if (!sql) {
      setFormattedSql('');
      return;
    }

    // Uppercase keywords
    if (uppercaseKeywords) {
      SQL_KEYWORDS.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        sql = sql.replace(regex, kw);
      });
    }

    // Split major clauses onto new lines
    const majorClauses = [
      'SELECT',
      'FROM',
      'WHERE',
      'GROUP BY',
      'HAVING',
      'ORDER BY',
      'LIMIT',
      'OFFSET',
      'LEFT JOIN',
      'RIGHT JOIN',
      'INNER JOIN',
      'JOIN',
      'UNION ALL',
      'UNION',
      'INSERT INTO',
      'VALUES',
      'UPDATE',
      'SET',
      'DELETE FROM',
    ];

    majorClauses.forEach((clause) => {
      const regex = new RegExp(`\\s+(${clause})\\s+`, 'gi');
      sql = sql.replace(regex, `\n$1 `);
    });

    // Indent sub-items (AND, OR, ON)
    const subClauses = ['AND', 'OR', 'ON'];
    const indent = ' '.repeat(indentSpaces);

    subClauses.forEach((sc) => {
      const regex = new RegExp(`\\s+(${sc})\\s+`, 'gi');
      sql = sql.replace(regex, `\n${indent}$1 `);
    });

    setFormattedSql(sql.trim());
  };

  const minifySql = () => {
    const minified = inputSql
      .replace(/\s+/g, ' ')
      .replace(/\s*([,;()=])\s*/g, '$1 ')
      .trim();
    setFormattedSql(minified);
  };

  // Format on initial mount
  React.useEffect(() => {
    formatSql();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercaseKeywords}
              onChange={(e) => setUppercaseKeywords(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
            />
            <span>UPPERCASE Keywords</span>
          </label>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 pl-3 border-l border-slate-200 dark:border-slate-800">
            <span>Indent:</span>
            <button
              onClick={() => setIndentSpaces(2)}
              className={`px-2 py-1 rounded-lg text-[11px] cursor-pointer ${
                indentSpaces === 2 ? 'bg-indigo-600 text-white font-mono' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              2 spaces
            </button>
            <button
              onClick={() => setIndentSpaces(4)}
              className={`px-2 py-1 rounded-lg text-[11px] cursor-pointer ${
                indentSpaces === 4 ? 'bg-indigo-600 text-white font-mono' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              4 spaces
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={minifySql}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Minimize2 size={14} />
            <span>Minify 1-Line</span>
          </button>
          <button
            onClick={formatSql}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Format SQL</span>
          </button>
        </div>
      </div>

      {/* Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raw Input */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Raw SQL Input</h3>
            <button
              onClick={() => setInputSql('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          </div>
          <textarea
            value={inputSql}
            onChange={(e) => setInputSql(e.target.value)}
            rows={14}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
            placeholder="Paste raw SQL queries here..."
          />
        </div>

        {/* Formatted Output */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Formatted Clean SQL</h3>
            <button
              onClick={() => copyToClipboard(formattedSql, 'Formatted SQL copied to clipboard!')}
              className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Copy size={13} />
              <span>Copy</span>
            </button>
          </div>
          <pre className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto min-h-[300px] leading-relaxed">
            <code>{formattedSql || '-- Formatted SQL will appear here...'}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
