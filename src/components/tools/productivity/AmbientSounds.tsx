import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  CloudLightning,
  Waves,
  Flame,
  Trees,
  Coffee,
  Radio,
  Sparkles,
  Wind,
  Droplets,
  Moon,
  Keyboard,
  Train,
  Clock,
  Shuffle,
  Timer,
  Check,
  Disc3,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface SoundChannel {
  id: string;
  name: string;
  category: 'nature' | 'noise' | 'urban' | 'zen';
  icon: any;
  volume: number; // 0 to 100
  isPlaying: boolean;
}

const PRESETS = [
  {
    name: 'Rainy Night Cafe ☕',
    description: 'Cozy cafe shelter with rainfall and crackling fireplace',
    activeChannels: { rain: 70, cafe: 55, fire: 40, brown: 35 },
  },
  {
    name: 'Deep Forest Zen 🌲',
    description: 'Tranquil woodland stream with gentle mountain breeze',
    activeChannels: { forest: 65, stream: 60, wind: 45, space: 30 },
  },
  {
    name: 'Late Night Coding & Study 📚',
    description: 'Deep brown noise with rain and mechanical keystrokes',
    activeChannels: { brown: 60, rain: 50, keyboard: 45, cafe: 25 },
  },
  {
    name: 'Tranquil Ocean Shore 🌊',
    description: 'Rhythmic ocean surf with night breeze and crickets',
    activeChannels: { waves: 70, wind: 40, night: 45, stream: 30 },
  },
  {
    name: 'Deep Sleep & ADHD Calm 😴',
    description: 'Ultra-warm brown noise with soft rainfall and thunder',
    activeChannels: { brown: 75, rain: 45, thunder: 35, pink: 30 },
  },
  {
    name: 'Cosmic Meditation 🌌',
    description: '432Hz harmonic space drone with gentle breeze',
    activeChannels: { space: 70, pink: 40, wind: 35, night: 25 },
  },
];

export const AmbientSounds: React.FC = () => {
  const [isMasterPlaying, setIsMasterPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(80);
  const [activeFilter, setActiveFilter] = useState<'all' | 'nature' | 'noise' | 'urban' | 'zen'>('all');
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);

  const { addToast } = useToast();

  const [channels, setChannels] = useState<SoundChannel[]>([
    { id: 'rain', name: 'Gentle Rain', category: 'nature', icon: CloudRain, volume: 60, isPlaying: false },
    { id: 'thunder', name: 'Thunderstorm', category: 'nature', icon: CloudLightning, volume: 50, isPlaying: false },
    { id: 'waves', name: 'Ocean Waves', category: 'nature', icon: Waves, volume: 55, isPlaying: false },
    { id: 'fire', name: 'Cozy Fireplace', category: 'nature', icon: Flame, volume: 45, isPlaying: false },
    { id: 'forest', name: 'Forest Birds', category: 'nature', icon: Trees, volume: 40, isPlaying: false },
    { id: 'stream', name: 'Zen River Stream', category: 'nature', icon: Droplets, volume: 50, isPlaying: false },
    { id: 'wind', name: 'Mountain Breeze', category: 'nature', icon: Wind, volume: 35, isPlaying: false },
    { id: 'night', name: 'Night Crickets', category: 'nature', icon: Moon, volume: 40, isPlaying: false },
    { id: 'brown', name: 'Deep Brown Noise', category: 'noise', icon: Disc3, volume: 60, isPlaying: false },
    { id: 'pink', name: 'Soft Pink Noise', category: 'noise', icon: Radio, volume: 45, isPlaying: false },
    { id: 'white', name: 'Pure White Noise', category: 'noise', icon: Radio, volume: 30, isPlaying: false },
    { id: 'space', name: 'Celestial 432Hz Drone', category: 'zen', icon: Sparkles, volume: 50, isPlaying: false },
    { id: 'cafe', name: 'Coffee Shop Chatter', category: 'urban', icon: Coffee, volume: 45, isPlaying: false },
    { id: 'keyboard', name: 'Mechanical Keyboard', category: 'urban', icon: Keyboard, volume: 40, isPlaying: false },
    { id: 'train', name: 'Night Train Tracks', category: 'urban', icon: Train, volume: 45, isPlaying: false },
    { id: 'clock', name: 'Antique Clock Tick', category: 'zen', icon: Clock, volume: 30, isPlaying: false },
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { gain: GainNode; sources: AudioNode[] }>>({});

  // Initialize Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Create High Quality Procedural Web Audio Sound Synthesizers
  const createAudioNode = (id: string, ctx: AudioContext) => {
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(ctx.destination);

    const sources: AudioNode[] = [];

    if (id === 'space') {
      // Celestial harmonic drone chords (A = 432Hz base)
      const freqs = [108, 162, 216, 324];
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const panner = ctx.createStereoPanner?.() || null;
        if (panner) panner.pan.value = (Math.random() - 0.5) * 0.8;

        const subGain = ctx.createGain();
        subGain.gain.value = 0.08;

        if (panner) {
          osc.connect(panner);
          panner.connect(subGain);
        } else {
          osc.connect(subGain);
        }

        subGain.connect(gainNode);
        osc.start(0);
        sources.push(osc);
      });
      return { gain: gainNode, sources };
    }

    if (id === 'clock') {
      // Periodic clock pulse generator
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 1200;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 900;

      const modGain = ctx.createGain();
      modGain.gain.value = 0.04;

      osc.connect(filter);
      filter.connect(modGain);
      modGain.connect(gainNode);
      osc.start(0);
      sources.push(osc);
      return { gain: gainNode, sources };
    }

    // Noise Based Synthesizers (Rain, Brown, Pink, Waves, Fire, etc.)
    const bufferSize = 3 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (id === 'brown') {
        // Brownian noise (1/f^2)
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      } else if (id === 'pink') {
        // Pink noise (1/f)
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      } else {
        output[i] = white;
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();

    if (id === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 950;
    } else if (id === 'thunder') {
      filter.type = 'lowpass';
      filter.frequency.value = 180;
    } else if (id === 'waves') {
      filter.type = 'bandpass';
      filter.frequency.value = 420;
      filter.Q.value = 0.8;
    } else if (id === 'fire') {
      filter.type = 'bandpass';
      filter.frequency.value = 520;
      filter.Q.value = 1.2;
    } else if (id === 'forest') {
      filter.type = 'bandpass';
      filter.frequency.value = 750;
    } else if (id === 'stream') {
      filter.type = 'bandpass';
      filter.frequency.value = 1100;
    } else if (id === 'wind') {
      filter.type = 'lowpass';
      filter.frequency.value = 320;
    } else if (id === 'night') {
      filter.type = 'highpass';
      filter.frequency.value = 3200;
    } else if (id === 'cafe') {
      filter.type = 'bandpass';
      filter.frequency.value = 650;
    } else if (id === 'keyboard') {
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 2;
    } else if (id === 'train') {
      filter.type = 'lowpass';
      filter.frequency.value = 280;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 1400;
    }

    noiseSource.connect(filter);
    filter.connect(gainNode);
    noiseSource.start(0);

    sources.push(noiseSource);

    return { gain: gainNode, sources };
  };

  const updateChannelVolume = (id: string, vol: number, playing: boolean) => {
    const ctx = getAudioContext();
    if (!nodesRef.current[id]) {
      nodesRef.current[id] = createAudioNode(id, ctx);
    }
    const targetVol = playing ? (vol / 100) * (masterVolume / 100) * 0.22 : 0;
    nodesRef.current[id].gain.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.08);
  };

  const toggleChannel = (id: string) => {
    setChannels(prev => {
      const updated = prev.map(ch => {
        if (ch.id === id) {
          const nextState = !ch.isPlaying;
          updateChannelVolume(id, ch.volume, nextState);
          return { ...ch, isPlaying: nextState };
        }
        return ch;
      });

      const anyPlaying = updated.some(c => c.isPlaying);
      setIsMasterPlaying(anyPlaying);
      return updated;
    });
  };

  const handleVolumeChange = (id: string, newVol: number) => {
    setChannels(prev =>
      prev.map(ch => {
        if (ch.id === id) {
          if (ch.isPlaying) {
            updateChannelVolume(id, newVol, true);
          }
          return { ...ch, volume: newVol };
        }
        return ch;
      })
    );
  };

  const toggleMaster = () => {
    const nextMaster = !isMasterPlaying;
    setIsMasterPlaying(nextMaster);

    if (audioCtxRef.current) {
      if (!nextMaster) {
        audioCtxRef.current.suspend();
      } else {
        audioCtxRef.current.resume();
      }
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    getAudioContext();
    setChannels(prev =>
      prev.map(ch => {
        const targetVol = (preset.activeChannels as any)[ch.id];
        const isSelected = targetVol !== undefined;
        const newVol = isSelected ? targetVol : ch.volume;
        updateChannelVolume(ch.id, newVol, isSelected);
        return {
          ...ch,
          volume: newVol,
          isPlaying: isSelected,
        };
      })
    );
    setIsMasterPlaying(true);
    addToast(`Loaded soundscape: ${preset.name}`, 'success');
  };

  const handleRandomize = () => {
    getAudioContext();
    const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    applyPreset(randomPreset);
  };

  const handleMuteAll = () => {
    setChannels(prev =>
      prev.map(ch => {
        updateChannelVolume(ch.id, ch.volume, false);
        return { ...ch, isPlaying: false };
      })
    );
    setIsMasterPlaying(false);
    addToast('All ambient sounds muted', 'info');
  };

  // Sleep / Pomodoro Timer Countdown
  useEffect(() => {
    if (!timerMinutes) {
      setTimerRemaining(null);
      return;
    }

    setTimerRemaining(timerMinutes * 60);

    const interval = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleMuteAll();
          setTimerMinutes(null);
          addToast('Sleep timer finished — Ambience stopped.', 'info');
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerMinutes]);

  const filteredChannels = channels.filter(
    ch => activeFilter === 'all' || ch.category === activeFilter
  );

  const playingCount = channels.filter(c => c.isPlaying).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Master Controller Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Ambient Focus & Chill Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800/60 text-[10px] font-bold text-brand-600 dark:text-brand-400 font-mono">
                  {playingCount} Playing
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                16 synthesized procedural ambient soundscapes for deep focus, coding, studying, and relaxation
              </p>
            </div>
          </div>

          {/* Master Volume & Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <Volume2 size={16} className="text-slate-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={e => setMasterVolume(Number(e.target.value))}
                className="w-24 accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                title="Master Volume"
              />
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 w-7 text-right">
                {masterVolume}%
              </span>
            </div>

            <button
              onClick={handleRandomize}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Random Chill Mix"
            >
              <Shuffle size={16} />
            </button>

            {playingCount > 0 && (
              <button
                onClick={handleMuteAll}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Mute All
              </button>
            )}

            <button
              onClick={toggleMaster}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isMasterPlaying
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25'
              }`}
            >
              {isMasterPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isMasterPlaying ? 'Pause Ambience' : 'Start Audio'}</span>
            </button>
          </div>
        </div>

        {/* Curated Soundscape Presets Carousel */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Curated Chill Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(preset)}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-brand-500/10 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 text-left transition-all group cursor-pointer"
              >
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {preset.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Sleep / Focus Timer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Timer size={15} className="text-brand-500" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">Auto Sleep Timer:</span>
            {[15, 30, 45, 60, 90].map(mins => (
              <button
                key={mins}
                onClick={() => setTimerMinutes(timerMinutes === mins ? null : mins)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  timerMinutes === mins
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {timerRemaining !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-mono font-bold">
              <span>Fades in:</span>
              <span>
                {Math.floor(timerRemaining / 60)}:
                {(timerRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All 16 Sounds' },
          { id: 'nature', label: '🌿 Nature & Weather' },
          { id: 'noise', label: '🪐 Noise & ADHD Waves' },
          { id: 'zen', label: '🌌 Zen & Meditation' },
          { id: 'urban', label: '☕ Urban & Lo-Fi' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id as any)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === filter.id
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Multichannel Sound Mixer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredChannels.map(channel => {
          const Icon = channel.icon;

          return (
            <div
              key={channel.id}
              className={`p-5 rounded-3xl border transition-all ${
                channel.isPlaying
                  ? 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-500/80 shadow-lg shadow-brand-500/10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2.5 rounded-2xl transition-all ${
                      channel.isPlaying
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[110px]">
                      {channel.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {channel.isPlaying ? '🔊 Playing' : 'Muted'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleChannel(channel.id)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    channel.isPlaying
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={channel.isPlaying ? 'Mute' : 'Play'}
                >
                  {channel.isPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
                </button>
              </div>

              {/* Channel Volume Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Volume</span>
                  <span className="font-mono">{channel.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={channel.volume}
                  onChange={e => handleVolumeChange(channel.id, Number(e.target.value))}
                  className="w-full accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
