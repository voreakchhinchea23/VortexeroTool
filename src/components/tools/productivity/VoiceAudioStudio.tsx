import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Play, Pause, Square, Copy, Sparkles, Check, RotateCcw, AlertCircle, Globe, Info } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';
import { useToast } from '../../../context/ToastContext';

const LANGUAGES = [
  { code: 'en-US', label: 'English (United States) 🇺🇸' },
  { code: 'en-GB', label: 'English (United Kingdom) 🇬🇧' },
  { code: 'km-KH', label: 'Khmer (Cambodia) 🇰🇭' },
  { code: 'fr-FR', label: 'French (France) 🇫🇷' },
  { code: 'es-ES', label: 'Spanish (Spain) 🇪🇸' },
  { code: 'ja-JP', label: 'Japanese 🇯🇵' },
  { code: 'zh-CN', label: 'Chinese (Mandarin) 🇨🇳' },
  { code: 'th-TH', label: 'Thai 🇹🇭' },
  { code: 'vi-VN', label: 'Vietnamese 🇻🇳' },
  { code: 'de-DE', label: 'German 🇩🇪' },
];

export const VoiceAudioStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dictation' | 'tts'>('dictation');
  
  // Voice Dictation States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [micError, setMicError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Text to Speech States
  const [ttsText, setTtsText] = useState('Welcome to VortexeroTool! Supercharge your productivity with modern client-side utilities.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);

  const { copyToClipboard } = useClipboard();
  const { addToast } = useToast();

  // Load system TTS voices
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const stopAllAudio = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }

    setIsListening(false);
    setAudioLevel(0);
  };

  // Start Voice Dictation
  const startSpeechRecognition = async () => {
    setMicError(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
      addToast('Speech recognition not supported in this browser', 'error');
      return;
    }

    try {
      // 1. Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      // 2. Setup Audio Visualizer
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const avg = sum / bufferLength;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(checkLevel);
        };
        checkLevel();
      } catch (err) {
        console.warn('Audio visualizer init:', err);
      }

      // 3. Initialize SpeechRecognition cleanly
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            setTranscript(prev => (prev ? prev + ' ' : '') + item[0].transcript.trim());
          } else {
            interim += item[0].transcript;
          }
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition Event Error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission was denied. Please allow microphone access in browser settings.');
        } else if (event.error === 'network') {
          setMicError('Brave / Network Note: Brave Browser blocks Google Speech services by default. Enable "Use Google services for speech recognition" in brave://settings/system or use Chrome / Edge.');
        } else if (event.error !== 'no-speech') {
          setMicError(`Speech service notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Clean single stop without infinite recursive restart loops
        setInterimTranscript('');
        stopAllAudio();
      };

      recognitionRef.current = recognition;
      recognition.start();
      addToast('Microphone active — Start speaking!', 'success');
    } catch (err: any) {
      console.error('Failed to start dictation:', err);
      stopAllAudio();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError('Microphone permission was denied. Please click the lock or settings icon in your browser URL bar and allow Microphone access.');
      } else {
        setMicError(err.message || 'Could not access microphone.');
      }
      addToast('Microphone error', 'error');
    }
  };

  const stopSpeechRecognition = () => {
    stopAllAudio();
    setInterimTranscript('');
    addToast('Dictation stopped', 'info');
  };

  const toggleListening = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Text to Speech Controls
  const handlePlayTts = () => {
    if (!('speechSynthesis' in window) || !ttsText.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ttsText);
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStopTts = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            handleStopTts();
            setActiveTab('dictation');
          }}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'dictation'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Mic size={18} />
          <span>Speech-to-Text (Voice Dictation)</span>
        </button>

        <button
          onClick={() => {
            if (isListening) stopSpeechRecognition();
            setActiveTab('tts');
          }}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tts'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Volume2 size={18} />
          <span>Text-to-Speech (TTS Reader)</span>
        </button>
      </div>

      {/* Mode 1: Dictation */}
      {activeTab === 'dictation' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Mic size={18} className="text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Real-Time Speech Dictation</h3>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 text-xs">
              <Globe size={14} className="text-slate-400" />
              <span className="text-slate-400 font-semibold">Language:</span>
              <select
                value={selectedLang}
                disabled={isListening}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error / Browser Diagnostics Banner */}
          {micError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p className="font-bold">Microphone / Browser Diagnostics</p>
                <p className="mt-0.5 leading-relaxed">{micError}</p>
              </div>
            </div>
          )}

          {/* Big Mic Toggle Card */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 text-center space-y-4">
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-white transition-all shadow-xl cursor-pointer ${
                isListening
                  ? 'bg-rose-600 shadow-rose-500/30 scale-110'
                  : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/25'
              }`}
            >
              {isListening ? <Mic size={32} className="animate-pulse" /> : <MicOff size={32} />}
            </button>

            <div>
              <p className="font-extrabold text-slate-900 dark:text-white text-base">
                {isListening ? '🎙️ Listening... Speak into your microphone' : 'Click the microphone to start dictating'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isListening ? 'Click the button again when you want to pause.' : 'Supports continuous dictation in Chrome, Edge, and Safari.'}
              </p>
            </div>

            {/* Live Audio Level Meter */}
            {isListening && (
              <div className="max-w-xs mx-auto space-y-1 pt-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Mic Input Signal</span>
                  <span className="font-mono">{audioLevel}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-75"
                    style={{ width: `${Math.max(5, audioLevel)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions & Transcript Box */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400">
                Transcription ({transcript.split(/\s+/).filter(Boolean).length} words)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTranscript('');
                    setInterimTranscript('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Clear
                </button>
                <button
                  onClick={() => copyToClipboard(transcript, 'Transcript copied!')}
                  className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Copy size={13} />
                  <span>Copy Text</span>
                </button>
              </div>
            </div>

            <div className="min-h-[160px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed relative">
              <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                {transcript || (!interimTranscript && <span className="text-slate-400 italic">Click the mic and start talking...</span>)}
              </p>
              {interimTranscript && (
                <span className="text-brand-600 dark:text-brand-400 italic ml-1">
                  {interimTranscript}...
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Text to Speech */}
      {activeTab === 'tts' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Volume2 size={16} className="text-brand-500" />
              <span>Natural Text-to-Speech Engine</span>
            </h3>
          </div>

          <textarea
            rows={6}
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            placeholder="Enter text to read aloud..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />

          {/* Voice & Speed Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Select Voice</label>
              <select
                value={selectedVoiceIndex}
                onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
              >
                {voices.map((v, i) => (
                  <option key={i} value={i}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Speed (Rate)</span>
                <span className="font-mono">{rate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Pitch</span>
                <span className="font-mono">{pitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Playback Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {isPlaying && (
              <button
                onClick={handleStopTts}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Square size={14} />
                <span>Stop</span>
              </button>
            )}

            <button
              onClick={handlePlayTts}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Play size={16} />
              <span>{isPlaying ? 'Replay Speech' : 'Listen Now'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
