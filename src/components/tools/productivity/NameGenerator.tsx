import React, { useState, useEffect, useCallback } from 'react';
import { UserCheck, RefreshCw, Copy, Sparkles, Building2, Baby, Wand2, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

type NameCategory = 'real' | 'startup' | 'baby' | 'fantasy';
type Gender = 'all' | 'male' | 'female' | 'unisex';
type Origin = 'global' | 'japanese' | 'european' | 'nordic' | 'mythic';

interface GeneratedName {
  name: string;
  sub?: string;
  origin?: string;
}

const DATA = {
  real: {
    male: {
      global: ['Ethan Vance', 'Lucas Bennett', 'Alexander Cross', 'Oliver Hayes', 'Julian Sterling', 'Adrian Cole', 'Marcus Reed', 'Nathaniel Drake', 'Caleb Mercer', 'Gabriel Thorne'],
      japanese: ['Ren Takahashi', 'Haruto Tanaka', 'Kaito Watanabe', 'Sora Ito', 'Yuto Nakamura', 'Riku Kobayashi', 'Kenji Sato', 'Shinjiro Mori', 'Kazuki Hayashi', 'Daiki Shimizu'],
      european: ['Matteo Rossi', 'Antoine Laurent', 'Sebastian Müller', 'Luka Novak', 'Hugo Dubois', 'Leo Visser', 'Elias Lindqvist', 'Valentin Meyer', 'Felix Fischer', 'Niklas Weber'],
      nordic: ['Erik Thorvaldsen', 'Lars Eriksen', 'Magnus Lind', 'Oskar Dahl', 'Soren Vang', 'Bjorn Haug', 'Astrid Falk', 'Henrik Solberg', 'Kasper Holm', 'Torsten Lund'],
      mythic: ['Orion Sterling', 'Perseus Knight', 'Arthur Pendelton', 'Apollo Hayes', 'Damon Vance', 'Caspian Drake', 'Leander Cole', 'Tristan Cross', 'Zephyr Reed', 'Theron Cross'],
    },
    female: {
      global: ['Elena Vance', 'Clara Sterling', 'Audrey Bennett', 'Vivian Cross', 'Seraphina Hayes', 'Maya Mercer', 'Stella Cole', 'Genevieve Thorne', 'Iris Holland', 'Nora Brooks'],
      japanese: ['Aoi Takahashi', 'Hina Watanabe', 'Yui Tanaka', 'Sakura Ito', 'Mio Nakamura', 'Emi Kobayashi', 'Ayaka Sato', 'Koharu Mori', 'Nanami Hayashi', 'Rin Shimizu'],
      european: ['Amélie Dubois', 'Chiara Rossi', 'Sofie Müller', 'Elena Laurent', 'Camille Visser', 'Freja Lindqvist', 'Léonie Meyer', 'Juliette Fischer', 'Elisa Weber', 'Noémie Klein'],
      nordic: ['Freja Dahl', 'Signe Eriksen', 'Astrid Lind', 'Ingrid Solberg', 'Elin Vang', 'Maja Haug', 'Linnea Holm', 'Tuva Lund', 'Solveig Falk', 'Klara Berg'],
      mythic: ['Athena Sterling', 'Freya Bennett', 'Artemis Cross', 'Cassandra Hayes', 'Selene Vance', 'Lyra Mercer', 'Calliope Thorne', 'Thalia Drake', 'Aura Cole', 'Diana Reed'],
    },
    unisex: {
      global: ['Rowan Mercer', 'Jordan Cross', 'Taylor Bennett', 'Morgan Sterling', 'Alex Vance', 'Quinn Hayes', 'Avery Cole', 'Riley Thorne', 'Cameron Reed', 'Dakota Drake'],
      japanese: ['Kaoru Ito', 'Makoto Sato', 'Hikaru Tanaka', 'Ren Watanabe', 'Shin Kobayashi', 'Aoi Nakamura', 'Rei Mori', 'Yuki Hayashi', 'Sora Shimizu', 'Nagisa Takahashi'],
      european: ['Claude Laurent', 'Dominique Dubois', 'Sascha Müller', 'Andrea Rossi', 'Robin Visser', 'Camille Meyer', 'Mika Fischer', 'Noa Weber', 'Lou Klein', 'Val Novak'],
      nordic: ['Bo Lind', 'Kim Dahl', 'Eli Eriksen', 'Toril Vang', 'Inge Haug', 'Dag Solberg', 'Bryn Falk', 'Rune Holm', 'Magne Lund', 'Asa Berg'],
      mythic: ['Phoenix Sterling', 'Zephyr Cross', 'Sol Bennett', 'Echo Hayes', 'Nyx Vance', 'Orion Mercer', 'Aura Thorne', 'Rowan Drake', 'River Cole', 'Sage Reed'],
    }
  },
  startup: [
    { name: 'VortexAI', sub: 'Next-gen intelligent compute platform' },
    { name: 'OmniFlow', sub: 'Unified automation & analytics ecosystem' },
    { name: 'PulseGrid', sub: 'High-throughput real-time data engine' },
    { name: 'SynapseLab', sub: 'Neural interfaces & adaptive systems' },
    { name: 'NexusCraft', sub: 'Collaborative cloud development hub' },
    { name: 'AuraScale', sub: 'Autonomous multi-cloud infrastructure' },
    { name: 'HyperStack', sub: 'Ultra-low latency web frameworks' },
    { name: 'ZenithCode', sub: 'Enterprise developer productivity toolset' },
    { name: 'NovaCore', sub: 'Scalable distributed computing platform' },
    { name: 'QuantumForge', sub: 'Decentralized cryptographic engine' },
    { name: 'KronoPay', sub: 'Seamless international digital banking' },
    { name: 'LuminaryIO', sub: 'AI-assisted design & media studio' },
  ],
  baby: [
    { name: 'Liam', sub: 'Strong-willed warrior (Irish origin)' },
    { name: 'Olivia', sub: 'Olive tree, symbol of peace (Latin)' },
    { name: 'Noah', sub: 'Rest, tranquility & peace (Hebrew)' },
    { name: 'Emma', sub: 'Universal, whole, complete (German)' },
    { name: 'Oliver', sub: 'Kind and peaceful (French/Latin)' },
    { name: 'Charlotte', sub: 'Free spirit & strong (French)' },
    { name: 'Elijah', sub: 'Devoted and noble (Hebrew)' },
    { name: 'Amelia', sub: 'Industrious & striving (Germanic)' },
    { name: 'Lucas', sub: 'Bringer of light (Greek/Latin)' },
    { name: 'Sophia', sub: 'Wisdom & intelligence (Greek)' },
    { name: 'Mateo', sub: 'Gift of life (Spanish/Hebrew)' },
    { name: 'Mia', sub: 'Beloved, ocean star (Italian/Scandinavian)' },
  ],
  fantasy: [
    { name: 'Aeloria Shadowthorn', sub: 'High Elf Archmage of the Astral Spire' },
    { name: 'Drakon Ironfist', sub: 'Dwarven Warlord of the Deep Mountain' },
    { name: 'Kaelen Voidstrider', sub: 'Shadow Rogue walking between realms' },
    { name: 'Lyanna Frostveil', sub: 'Northern Sorceress wielding glacial magic' },
    { name: 'Zephyrus Stormcaller', sub: 'Sky Shaman commanding thunderbirds' },
    { name: 'Morrigan Nightshade', sub: 'Dread Queen of the Crimson Moon' },
    { name: 'Theron Dawnseeker', sub: 'Paladin Knight guarding the Solar Relic' },
    { name: 'Vaelen Starweaver', sub: 'Celestial Bard chronicling cosmic legends' },
    { name: 'Gorath Bonebreaker', sub: 'Chieftain of the Ash Wastes' },
    { name: 'Sylas Runebound', sub: 'Arcane Scholar deciphering ancient tablets' },
    { name: 'Isolde Whisperwind', sub: 'Sylvan Ranger protecting the sacred groves' },
    { name: 'Cassian Blackflame', sub: 'Cursed Demon Hunter forged in infernal fire' },
  ]
};

export const NameGenerator: React.FC = () => {
  const [category, setCategory] = useState<NameCategory>('real');
  const [gender, setGender] = useState<Gender>('all');
  const [origin, setOrigin] = useState<Origin>('global');
  const [generatedList, setGeneratedList] = useState<GeneratedName[]>([]);

  const { copyToClipboard } = useClipboard();

  const generateNames = useCallback(() => {
    if (category === 'startup') {
      const shuffled = [...DATA.startup].sort(() => 0.5 - Math.random());
      setGeneratedList(shuffled.slice(0, 12));
      return;
    }

    if (category === 'baby') {
      const shuffled = [...DATA.baby].sort(() => 0.5 - Math.random());
      setGeneratedList(shuffled.slice(0, 12));
      return;
    }

    if (category === 'fantasy') {
      const shuffled = [...DATA.fantasy].sort(() => 0.5 - Math.random());
      setGeneratedList(shuffled.slice(0, 12));
      return;
    }

    // Real Names
    const gKey = gender === 'all' ? (Math.random() > 0.5 ? 'male' : 'female') : gender;
    const pool = DATA.real[gKey as 'male' | 'female' | 'unisex'][origin] || DATA.real.male.global;

    const list: GeneratedName[] = pool.map(name => ({
      name,
      sub: `${origin.toUpperCase()} • ${gKey.toUpperCase()}`,
    }));

    setGeneratedList(list.sort(() => 0.5 - Math.random()).slice(0, 12));
  }, [category, gender, origin]);

  useEffect(() => {
    generateNames();
  }, [generateNames]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'real', label: 'Real Names', icon: UserCheck },
          { id: 'startup', label: 'Startup & Brand', icon: Building2 },
          { id: 'baby', label: 'Baby Names & Meaning', icon: Baby },
          { id: 'fantasy', label: 'Fantasy & Characters', icon: Wand2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = category === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id as NameCategory)}
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-brand-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Parameters */}
      {category === 'real' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Gender:</span>
            {(['all', 'male', 'female', 'unisex'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  gender === g ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Origin:</span>
            {(['global', 'japanese', 'european', 'nordic', 'mythic'] as const).map(o => (
              <button
                key={o}
                onClick={() => setOrigin(o)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  origin === o ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Regenerate Button */}
      <div className="flex justify-end">
        <button
          onClick={generateNames}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw size={15} />
          <span>Generate New Batch</span>
        </button>
      </div>

      {/* Generated Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {generatedList.map((item, idx) => (
          <div
            key={idx}
            onClick={() => copyToClipboard(item.name, 'Name copied!')}
            className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/10 flex items-center justify-between cursor-pointer transition-all duration-200"
          >
            <div className="min-w-0 flex-1 pr-2">
              <p className="font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {item.name}
              </p>
              {item.sub && (
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {item.sub}
                </p>
              )}
            </div>

            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all shrink-0">
              <Copy size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
