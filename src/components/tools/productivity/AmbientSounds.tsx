import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, CloudRain, Waves, Flame, Trees, Radio, Keyboard, Coffee, Sparkles } from 'lucide-react';

interface SoundChannel {
  id: string;
  name: string;
  icon: any;
  volume: number; // 0 to 100
  isPlaying: boolean;
  color: string;
}

export const AmbientSounds: React.FC = () => {
  const [isMasterPlaying, setIsMasterPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(80);

  const [channels, setChannels] = useState<SoundChannel[]>([
    { id: 'rain', name: 'Gentle Rain', icon: CloudRain, volume: 60, isPlaying: false, color: 'text-blue-500' },
    { id: 'waves', name: 'Ocean Waves', icon: Waves, volume: 50, isPlaying: false, color: 'text-cyan-500' },
    { id: 'fire', name: 'Cozy Fireplace', icon: Flame, volume: 40, isPlaying: false, color: 'text-amber-500' },
    { id: 'forest', name: 'Forest Breeze', icon: Trees, volume: 30, isPlaying: false, color: 'text-emerald-500' },
    { id: 'cafe', name: 'Coffee Shop Ambience', icon: Coffee, volume: 40, isPlaying: false, color: 'text-orange-500' },
    { id: 'whitenoise', name: 'Deep White Noise', icon: Radio, volume: 25, isPlaying: false, color: 'text-purple-500' },
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { gain: GainNode; source: AudioNode }>>({});

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

  // Create Web Audio synthesized noise generators
  const createAudioNode = (id: string, ctx: AudioContext) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // White noise
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to shape into sound types
    const filter = ctx.createBiquadFilter();

    if (id === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 800;
    } else if (id === 'waves') {
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 1;
    } else if (id === 'fire') {
      filter.type = 'lowpass';
      filter.frequency.value = 350;
    } else if (id === 'forest') {
      filter.type = 'bandpass';
      filter.frequency.value = 600;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
    }

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(0);

    return { gain: gainNode, source: whiteNoise };
  };

  const toggleChannel = (id: string) => {
    const ctx = getAudioContext();

    setChannels(channels.map(ch => {
      if (ch.id === id) {
        const nextState = !ch.isPlaying;

        if (!nodesRef.current[id]) {
          nodesRef.current[id] = createAudioNode(id, ctx);
        }

        const effectiveVol = nextState ? (ch.volume / 100) * (masterVolume / 100) * 0.2 : 0;
        nodesRef.current[id].gain.gain.setTargetAtTime(effectiveVol, ctx.currentTime, 0.1);

        return { ...ch, isPlaying: nextState };
      }
      return ch;
    }));

    setIsMasterPlaying(true);
  };

  const handleVolumeChange = (id: string, newVol: number) => {
    setChannels(channels.map(ch => {
      if (ch.id === id) {
        if (ch.isPlaying && nodesRef.current[id] && audioCtxRef.current) {
          const effectiveVol = (newVol / 100) * (masterVolume / 100) * 0.2;
          nodesRef.current[id].gain.gain.setTargetAtTime(effectiveVol, audioCtxRef.current.currentTime, 0.05);
        }
        return { ...ch, volume: newVol };
      }
      return ch;
    }));
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Master Audio Controller Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Ambient Focus Soundscape Mixer</h3>
            <p className="text-xs text-slate-400">Synthesized background ambient noises for deep focus & study</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-slate-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="w-24 accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={toggleMaster}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              isMasterPlaying
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/25'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25'
            }`}
          >
            {isMasterPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isMasterPlaying ? 'Pause Ambience' : 'Start Focus Audio'}</span>
          </button>
        </div>
      </div>

      {/* Multichannel Sound Mixer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {channels.map(channel => {
          const Icon = channel.icon;

          return (
            <div
              key={channel.id}
              className={`p-6 rounded-3xl border transition-all ${
                channel.isPlaying
                  ? 'bg-brand-50/40 dark:bg-brand-950/30 border-brand-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${channel.isPlaying ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{channel.name}</h4>
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
                >
                  {channel.isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>Channel Volume</span>
                  <span className="font-mono">{channel.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={channel.volume}
                  onChange={(e) => handleVolumeChange(channel.id, Number(e.target.value))}
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
