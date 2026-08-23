import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Keyboard, RefreshCw, Trophy, Zap, Target, Sliders, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const ENGLISH_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more', 'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take', 'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any', 'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find', 'day', 'also', 'after', 'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where', 'much', 'should', 'well', 'people', 'down', 'own', 'just', 'because', 'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place', 'little', 'world', 'very', 'still', 'nation', 'hand', 'old', 'life', 'tell', 'write', 'become', 'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'develop', 'under', 'last', 'right', 'move', 'thing', 'general', 'school', 'never', 'same', 'another', 'begin', 'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want', 'point', 'form', 'child', 'small', 'since', 'against', 'late', 'home', 'interest', 'large', 'person', 'end', 'open', 'public', 'follow', 'during', 'present', 'without', 'again', 'hold', 'govern', 'around', 'possible', 'head', 'consider', 'word', 'program', 'problem', 'however', 'lead', 'system', 'set', 'order', 'eye', 'plan', 'run', 'keep', 'face', 'fact', 'group', 'play', 'stand', 'increase', 'early', 'course', 'change', 'help', 'line'
];

const CODE_WORDS = [
  'const', 'let', 'function', 'return', 'async', 'await', 'import', 'export', 'default', 'class', 'extends', 'interface', 'type', 'promise', 'resolve', 'reject', 'console.log', 'map', 'filter', 'reduce', 'document.getElementById', 'useState', 'useEffect', 'useMemo', 'try', 'catch', 'throw', 'new', 'Error', 'typeof', 'instanceof', 'switch', 'case', 'break', 'continue', 'while', 'for', 'of', 'in', 'null', 'undefined', 'true', 'false', 'Array.from', 'JSON.stringify', 'JSON.parse', 'setTimeout', 'setInterval', 'clearTimeout', 'addEventListener'
];

export const TypingTest: React.FC = () => {
  const [modeType, setModeType] = useState<'time' | 'words'>('time');
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [wordLimit, setWordLimit] = useState<number>(25);
  const [category, setCategory] = useState<'english' | 'code'>('english');

  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [currWordIndex, setCurrWordIndex] = useState<number>(0);
  const [currCharIndex, setCurrCharIndex] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize randomized words
  const initTest = useCallback(() => {
    const source = category === 'code' ? CODE_WORDS : ENGLISH_WORDS;
    const shuffled = [...source].sort(() => 0.5 - Math.random());
    const count = modeType === 'words' ? wordLimit : 100;
    setWords(shuffled.slice(0, count));

    setUserInput('');
    setCurrWordIndex(0);
    setCurrCharIndex(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setTimeLeft(timeLimit);
    setIsActive(false);
    setIsFinished(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [category, modeType, wordLimit, timeLimit]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && !isFinished && modeType === 'time') {
      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else {
        finishTest();
      }
    }
    return () => clearInterval(timer);
  }, [isActive, isFinished, timeLeft, modeType]);

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);

    const wpm = calculateWpm();
    if (wpm >= 50) {
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (!isActive) {
      setIsActive(true);
    }

    // Space key: move to next word
    if (e.key === ' ') {
      e.preventDefault();
      if (!userInput.trim()) return;

      const currentTargetWord = words[currWordIndex];
      if (userInput === currentTargetWord) {
        setCorrectChars(prev => prev + currentTargetWord.length + 1);
      } else {
        setIncorrectChars(prev => prev + Math.abs(userInput.length - currentTargetWord.length) + 1);
      }

      if (currWordIndex + 1 >= words.length) {
        finishTest();
      } else {
        setCurrWordIndex(prev => prev + 1);
        setUserInput('');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const val = e.target.value;
    if (val.endsWith(' ')) return; // handled in onKeyDown
    setUserInput(val);
  };

  // Metrics calculations
  const calculateWpm = () => {
    const elapsedSeconds = modeType === 'time' ? (timeLimit - timeLeft || 1) : 30;
    const wordsTyped = (correctChars + (userInput ? userInput.length : 0)) / 5;
    const minutes = elapsedSeconds / 60;
    return Math.round(wordsTyped / (minutes || 1));
  };

  const calculateAccuracy = () => {
    const total = correctChars + incorrectChars;
    if (total === 0) return 100;
    return Math.round((correctChars / total) * 100);
  };

  const wpm = calculateWpm();
  const accuracy = calculateAccuracy();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Test Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Mode Selector */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setModeType('time')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              modeType === 'time' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Time
          </button>
          <button
            onClick={() => setModeType('words')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              modeType === 'words' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Words
          </button>
        </div>

        {/* Limit Options */}
        {modeType === 'time' ? (
          <div className="flex items-center gap-2">
            {[15, 30, 60].map(s => (
              <button
                key={s}
                onClick={() => setTimeLimit(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeLimit === s
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border border-brand-500'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {s}s
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {[10, 25, 50, 100].map(w => (
              <button
                key={w}
                onClick={() => setWordLimit(w)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  wordLimit === w
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border border-brand-500'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {w} words
              </button>
            ))}
          </div>
        )}

        {/* Category Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setCategory('english')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              category === 'english' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            English Words
          </button>
          <button
            onClick={() => setCategory('code')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              category === 'code' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Code Keywords (JS/TS)
          </button>
        </div>

        <button
          onClick={initTest}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-transform active:rotate-180"
          title="Restart Test (Tab + Enter)"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Live Performance HUD */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {modeType === 'time' ? 'Time Remaining' : 'Progress'}
          </p>
          <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 font-mono mt-1">
            {modeType === 'time' ? `${timeLeft}s` : `${currWordIndex}/${words.length}`}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">WPM (Speed)</p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1">
            {wpm}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accuracy</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {accuracy}%
          </p>
        </div>
      </div>

      {/* Typing Canvas Card */}
      {!isFinished ? (
        <div
          onClick={() => inputRef.current?.focus()}
          className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 relative min-h-[220px] cursor-text transition-colors"
        >
          {/* Hidden Input field */}
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="absolute opacity-0 pointer-events-none"
            autoFocus
          />

          {/* Rendered Words Flow */}
          <div className="flex flex-wrap gap-x-3.5 gap-y-3 text-xl sm:text-2xl font-mono leading-relaxed select-none">
            {words.slice(0, 40).map((word, wIdx) => {
              const isCurrent = wIdx === currWordIndex;
              const isPast = wIdx < currWordIndex;

              return (
                <span
                  key={wIdx}
                  className={`relative transition-colors duration-150 ${
                    isCurrent
                      ? 'text-slate-900 dark:text-white font-bold'
                      : isPast
                      ? 'text-slate-400 dark:text-slate-600'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {word.split('').map((char, cIdx) => {
                    let charColor = '';
                    if (isCurrent) {
                      if (cIdx < userInput.length) {
                        charColor =
                          userInput[cIdx] === char
                            ? 'text-emerald-500 font-bold'
                            : 'text-rose-500 underline decoration-rose-500 font-bold';
                      }
                    }

                    return (
                      <span key={cIdx} className={charColor}>
                        {char}
                      </span>
                    );
                  })}
                  {/* Extra typed characters */}
                  {isCurrent && userInput.length > word.length && (
                    <span className="text-rose-500 font-bold line-through">
                      {userInput.slice(word.length)}
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-medium mt-8 text-center">
            Type the words above and press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-bold">Space</kbd> to advance.
          </p>
        </div>
      ) : (
        /* Results Report Card */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-brand-500/40 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25">
            <Trophy size={32} />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Typing Test Completed!
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {wpm >= 70
                ? '⚡ Incredible speed! You are a master typist.'
                : wpm >= 45
                ? '🔥 Great job! Smooth rhythm and high accuracy.'
                : '🌱 Good practice! Keep training daily to boost your WPM.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-brand-600 dark:text-brand-400 font-mono">{wpm}</span>
              <p className="text-xs font-bold text-slate-400 mt-1">Net WPM</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{accuracy}%</span>
              <p className="text-xs font-bold text-slate-400 mt-1">Accuracy</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{correctChars}</span>
              <p className="text-xs font-bold text-slate-400 mt-1">Chars</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-rose-500 font-mono">{incorrectChars}</span>
              <p className="text-xs font-bold text-slate-400 mt-1">Errors</p>
            </div>
          </div>

          <button
            onClick={initTest}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center gap-2 mx-auto shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
