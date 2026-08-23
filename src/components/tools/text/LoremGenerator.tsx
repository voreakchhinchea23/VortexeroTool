import React, { useState, useEffect, useCallback } from 'react';
import { Pilcrow, Copy, RefreshCw, Download, FileJson, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export const LoremGenerator: React.FC = () => {
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words' | 'json'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [htmlTags, setHtmlTags] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');

  const { copyToClipboard } = useClipboard();

  const generateWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generateSentence = () => {
    const len = Math.floor(Math.random() * 10 + 6);
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(generateWord());
    }
    const s = words.join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  };

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 4 + 4);
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  const generateJsonMock = (num: number) => {
    const names = ['Alex Mercer', 'Jordan Lee', 'Elena Rostova', 'Kenji Sato', 'Maya Lin', 'Carlos Vega', 'Sarah Connor'];
    const roles = ['Frontend Engineer', 'UI/UX Designer', 'Product Manager', 'DevOps Lead', 'AI Researcher'];
    const cities = ['San Francisco', 'Tokyo', 'Berlin', 'London', 'Singapore', 'Sydney', 'Toronto'];

    const records = [];
    for (let i = 1; i <= num; i++) {
      records.push({
        id: i,
        name: names[Math.floor(Math.random() * names.length)],
        email: `user${i}@vortexerotool.dev`,
        role: roles[Math.floor(Math.random() * roles.length)],
        location: cities[Math.floor(Math.random() * cities.length)],
        isActive: Math.random() > 0.3,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      });
    }
    return JSON.stringify(records, null, 2);
  };

  const generate = useCallback(() => {
    if (unit === 'json') {
      setOutput(generateJsonMock(count));
      return;
    }

    if (unit === 'words') {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(generateWord());
      }
      if (startWithLorem && words.length >= 2) {
        words[0] = 'Lorem';
        words[1] = 'ipsum';
      }
      setOutput(words.join(' '));
      return;
    }

    if (unit === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      if (startWithLorem && sentences.length > 0) {
        sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' + sentences[0].slice(sentences[0].indexOf(' ') + 1);
      }
      setOutput(sentences.join(' '));
      return;
    }

    // Paragraphs
    const paragraphs: string[] = [];
    for (let i = 0; i < count; i++) {
      let p = generateParagraph();
      if (i === 0 && startWithLorem) {
        p = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + p;
      }
      if (htmlTags) {
        p = `<p>${p}</p>`;
      }
      paragraphs.push(p);
    }
    setOutput(paragraphs.join(htmlTags ? '\n' : '\n\n'));
  }, [unit, count, startWithLorem, htmlTags]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleDownload = () => {
    const ext = unit === 'json' ? 'json' : 'txt';
    const blob = new Blob([output], { type: unit === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `placeholder-${unit}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Parameters Selector */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            {(['paragraphs', 'sentences', 'words', 'json'] as const).map(u => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  unit === u ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Count:</span>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
              className="w-16 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-center"
            />
          </div>
        </div>

        {unit !== 'json' && (
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-4 h-4 accent-brand-600 rounded"
              />
              <span>Start with "Lorem ipsum..."</span>
            </label>

            {unit === 'paragraphs' && (
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={htmlTags}
                  onChange={(e) => setHtmlTags(e.target.checked)}
                  className="w-4 h-4 accent-brand-600 rounded"
                />
                <span>Wrap in &lt;p&gt; tags</span>
              </label>
            )}
          </div>
        )}
      </div>

      {/* Output Display Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Generated Placeholder Data
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={generate}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Regenerate"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => copyToClipboard(output, 'Copied placeholder text!')}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all"
            >
              <Copy size={13} />
              <span>Copy</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Download file"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          readOnly
          value={output}
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none resize-y leading-relaxed select-all"
        />
      </div>
    </div>
  );
};
