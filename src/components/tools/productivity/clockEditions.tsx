import React from 'react';

export type ClockEdition =
  | 'classic'
  | 'gta6'
  | 'minecraft'
  | 'persona5'
  | 'eldenring'
  | 'godofwar'
  | 'zelda_totk'
  | 'halo_unsc'
  | 'pacman'
  | 'ben10'
  | 'jjk'
  | 'invincible'
  | 'cyberpunk'
  | 'demonslayer'
  | 'naruto'
  | 'dragonball'
  | 'onepiece'
  | 'aot'
  | 'pokemon'
  | 'strangerthings'
  | 'arcane'
  | 'doctorwho'
  | 'fallout'
  | 'ironman'
  | 'starwars'
  | 'matrix_neo'
  | 'batman'
  | 'dune'
  | 'doomsday'
  | 'spiderverse'
  | 'evangelion'
  | 'tron'
  | 'akira';

export type ClockEditionCategory = 'all' | 'games' | 'anime' | 'tv' | 'movies';

export interface EditionThemeStyles {
  bg: string;
  clockText: string;
  glow: string;
  accent: string;
  border: string;
  badgeBg: string;
  handSec: string;
  handMin: string;
  handHr: string;
  dialBg: string;
  dialBorder: string;
  flipCard: string;
  progressBar: string;
  subText?: string;
  dialTickMajor?: string;
  dialTickMinor?: string;
  dialNumColor?: string;
  isLight?: boolean;
}

export interface ClockEditionMeta {
  id: ClockEdition;
  label: string;
  shortTag: string;
  category: 'studio' | 'games' | 'anime' | 'tv' | 'movies';
  tagline: string;
  recommendedBg: string;
  recommendedAnalog?: string;
  recommendedRadial?: string;
  swatchClass: string;
  // Bespoke per-mode lore badges & UI labels
  digitalEyebrow: string;
  stackedEyebrow: string;
  wordEyebrow: string;
  deskHeader: string;
  pomoWorkLabel: string;
  pomoBreakLabel: string;
  pomoStartLabel: string;
  stopwatchEyebrow: string;
}

export const CLOCK_EDITIONS: ClockEditionMeta[] = [
  {
    id: 'classic',
    label: 'Classic Studio',
    shortTag: 'STUDIO',
    category: 'studio',
    tagline: 'Use any of the 45 curated color themes with clean precision typography',
    recommendedBg: 'aurora',
    swatchClass: 'bg-gradient-to-tr from-indigo-500 to-sky-400',
    digitalEyebrow: '',
    stackedEyebrow: '',
    wordEyebrow: 'It Is',
    deskHeader: 'Desk Station',
    pomoWorkLabel: 'Focus Session',
    pomoBreakLabel: 'Short Break',
    pomoStartLabel: 'Start Focus',
    stopwatchEyebrow: '',
  },
  {
    id: 'gta6',
    label: 'GTA 6 Vice City',
    shortTag: 'LEONIDA',
    category: 'games',
    tagline: 'Vice City neon twilight, swaying coconut palm trees, Ocean Drive teal and Leonida sunset pink',
    recommendedBg: 'vice_sunset',
    recommendedAnalog: 'vice_palm',
    recommendedRadial: 'vice_city',
    swatchClass: 'bg-gradient-to-tr from-[#ff2e93] via-[#ff8c42] to-[#00f5d4]',
    digitalEyebrow: 'VICE CITY // STATE OF LEONIDA // SUNSET',
    stackedEyebrow: 'OCEAN BEACH // VICE COVE VI',
    wordEyebrow: 'VICE CITY // VI',
    deskHeader: 'Leonida Vice Ledger',
    pomoWorkLabel: 'HEIST PREP // LEONIDA',
    pomoBreakLabel: 'OCEAN DRIVE CHILL',
    pomoStartLabel: 'Launch Mission',
    stopwatchEyebrow: 'MIDNIGHT TURBO HEIST',
  },
  {
    id: 'minecraft',
    label: 'Minecraft',
    shortTag: 'OVERWORLD',
    category: 'games',
    tagline: 'Voxel grass-block horizon trim, emerald Creeper silhouette, Diamond cyan and XP orb lime',
    recommendedBg: 'pixel_arcade',
    recommendedAnalog: 'creeper_dial',
    recommendedRadial: 'emerald_xp',
    swatchClass: 'bg-gradient-to-tr from-[#78350f] via-[#22c55e] to-[#22d3ee]',
    digitalEyebrow: 'OVERWORLD // DAYLIGHT CYCLE // SEED 64',
    stackedEyebrow: 'DIAMOND TIER // XP LVL 30',
    wordEyebrow: 'CHUNK LOADED',
    deskHeader: 'Redstone Daybench',
    pomoWorkLabel: 'DEEP MINING // Y=-59',
    pomoBreakLabel: 'CAMPFIRE RESPAWN',
    pomoStartLabel: 'Craft & Focus',
    stopwatchEyebrow: 'ELYTRA SPEEDRUN SPLIT',
  },
  {
    id: 'persona5',
    label: 'Persona 5',
    shortTag: 'PHANTOM',
    category: 'games',
    tagline: 'Razor-sharp Phantom Thieves crimson, ink black and stark white calling-card panels',
    recommendedBg: 'comic_burst',
    recommendedAnalog: 'phantom_mask',
    recommendedRadial: 'velvet_rebellion',
    swatchClass: 'bg-gradient-to-tr from-[#050505] via-[#dc2626] to-[#ffffff]',
    digitalEyebrow: 'TAKE YOUR TIME // SHIBUYA CENTRAL',
    stackedEyebrow: 'ALL-OUT ATTACK // PHANTOM',
    wordEyebrow: 'SHOWTIME // P5',
    deskHeader: 'Confidant Schedule',
    pomoWorkLabel: 'PALACE INFILTRATION',
    pomoBreakLabel: 'LEBLANC COFFEE BREAK',
    pomoStartLabel: 'Take Your Heart',
    stopwatchEyebrow: 'BATON PASS CHAIN SPLIT',
  },
  {
    id: 'eldenring',
    label: 'Elden Ring',
    shortTag: 'SHATTERED',
    category: 'games',
    tagline: 'Golden Order interlocking Great Runes, Erdtree grace light embers and obsidian shadow',
    recommendedBg: 'erdtree_petals',
    recommendedAnalog: 'golden_order',
    recommendedRadial: 'erdtree_grace',
    swatchClass: 'bg-gradient-to-tr from-[#0a0704] via-[#d97706] to-[#fef08a]',
    digitalEyebrow: 'THE LANDS BETWEEN // GRACE DISCOVERED',
    stackedEyebrow: 'GOLDEN ORDER // ERDTREE',
    wordEyebrow: 'SITE OF GRACE',
    deskHeader: 'Roundtable Hold Log',
    pomoWorkLabel: 'RUNE ASCENSION',
    pomoBreakLabel: 'REST AT SITE OF GRACE',
    pomoStartLabel: 'Touch Grace',
    stopwatchEyebrow: 'TARNISHED SPEEDRUN CHRONO',
  },
  {
    id: 'godofwar',
    label: 'God of War',
    shortTag: 'RAGNAROK',
    category: 'games',
    tagline: 'Blazing Nordic Omega crest, Midgard frost ice blue and Spartan Rage Leviathan crimson',
    recommendedBg: 'erdtree_petals',
    recommendedAnalog: 'leviathan_rune',
    recommendedRadial: 'omega_frost',
    swatchClass: 'bg-gradient-to-tr from-[#0f172a] via-[#38bdf8] to-[#ef4444]',
    digitalEyebrow: 'NINE REALMS // FIMBULWINTER WATCH',
    stackedEyebrow: 'SPARTAN RAGE // LEVIATHAN FROST',
    wordEyebrow: 'MIDGARD // OMEGA',
    deskHeader: 'Tyr Vault Chronicle',
    pomoWorkLabel: 'BROK FORGE DISCIPLINE',
    pomoBreakLabel: 'LAKE OF NINE RESPITE',
    pomoStartLabel: 'Ignite Blades',
    stopwatchEyebrow: 'VALKYRIE TRIAL CHRONO',
  },
  {
    id: 'zelda_totk',
    label: 'Zelda Sheikah',
    shortTag: 'HYRULE',
    category: 'games',
    tagline: 'Glowing cyan Sheikah Slate circuit constellation paired with the sacred Golden Triforce',
    recommendedBg: 'arcane_runes',
    recommendedAnalog: 'triforce_slate',
    recommendedRadial: 'sheikah_orb',
    swatchClass: 'bg-gradient-to-tr from-[#071824] via-[#06b6d4] to-[#facc15]',
    digitalEyebrow: 'SHEIKAH SLATE // SKYVIEW TOWER LOCKED',
    stackedEyebrow: 'ZONAI CORE // HYRULE FIELD',
    wordEyebrow: 'SHEIKAH // SLATE',
    deskHeader: 'Purah Pad Chronicle',
    pomoWorkLabel: 'SHRINE TRIAL FOCUS',
    pomoBreakLabel: 'STABLE REST',
    pomoStartLabel: 'Activate Rune',
    stopwatchEyebrow: 'SHIELD-SURF TIME TRIAL',
  },
  {
    id: 'halo_unsc',
    label: 'Halo Mjolnir',
    shortTag: 'SPARTAN-117',
    category: 'games',
    tagline: 'UNSC Mjolnir gold hex visor frame, energy shield integrity gauge and Cortana blue telemetry',
    recommendedBg: 'orbital',
    recommendedAnalog: 'mjolnir_visor',
    recommendedRadial: 'cortana_ring',
    swatchClass: 'bg-gradient-to-tr from-[#08121f] via-[#fbbf24] to-[#38bdf8]',
    digitalEyebrow: 'UNSC // MJOLNIR MK-VI // SHIELDS 100%',
    stackedEyebrow: 'INSTALLATION 04 // CORTANA LINK',
    wordEyebrow: 'SPARTAN // HUD',
    deskHeader: 'Infinity Fleet Deck',
    pomoWorkLabel: 'SPARTAN COMBAT DRILL',
    pomoBreakLabel: 'SHIELD RECHARGE',
    pomoStartLabel: 'Boot Visor HUD',
    stopwatchEyebrow: 'WARTHOG RUN TIMER',
  },
  {
    id: 'pacman',
    label: 'Pac-Man Arcade',
    shortTag: '1980-COIN',
    category: 'games',
    tagline: '1980 cabinet neon-blue maze rails, golden chomper arc, glowing pellets and pixel ghosts',
    recommendedBg: 'pixel_arcade',
    recommendedAnalog: 'arcade_maze',
    recommendedRadial: 'maze_chomper',
    swatchClass: 'bg-gradient-to-tr from-[#1d4ed8] via-[#facc15] to-[#f43f5e]',
    digitalEyebrow: '1UP READY // HIGH SCORE 999990 // MAZE',
    stackedEyebrow: 'INSERT COIN // POWER PELLET',
    wordEyebrow: 'ARCADE // PLAYER 1',
    deskHeader: 'Namco Cabinet Log',
    pomoWorkLabel: 'POWER PELLET FRENZY',
    pomoBreakLabel: 'INTERMISSION STAGE',
    pomoStartLabel: 'Insert Coin',
    stopwatchEyebrow: 'CHERRY BONUS SPEEDRUN',
  },
  {
    id: 'ben10',
    label: 'Ben 10',
    shortTag: 'OMNITRIX',
    category: 'tv',
    tagline: 'Galvan Omnitrix gunmetal bezel, luminous DNA hourglass green and Alien Force circuitry',
    recommendedBg: 'omnitrix_pulse',
    recommendedAnalog: 'omnitrix',
    recommendedRadial: 'omnitrix_core',
    swatchClass: 'bg-gradient-to-tr from-[#061308] via-[#16a34a] to-[#65ff00]',
    digitalEyebrow: 'GALVAN PRIME // OMNITRIX DNA CALIBRATION',
    stackedEyebrow: 'HERO TIME // ACTIVE ALIEN FORM',
    wordEyebrow: 'OMNITRIX // DNA SYNC',
    deskHeader: 'Plumber Command Watch',
    pomoWorkLabel: 'ALIEN TRANSFORMATION ACTIVE',
    pomoBreakLabel: 'OMNITRIX RECHARGE MODE',
    pomoStartLabel: 'Slam The Dial',
    stopwatchEyebrow: 'XLR8 VELOCITY CHRONO',
  },
  {
    id: 'jjk',
    label: 'Jujutsu Kaisen',
    shortTag: 'DOMAIN',
    category: 'anime',
    tagline: 'Unlimited Void abyssal cosmos, Limitless Blue & Reversal Red converging into Hollow Purple',
    recommendedBg: 'cursed_aura',
    recommendedAnalog: 'jjk_void',
    recommendedRadial: 'jjk_domain',
    swatchClass: 'bg-gradient-to-tr from-[#00e5ff] via-[#a855f7] to-[#ff2a55]',
    digitalEyebrow: 'TOKYO JUJUTSU HIGH // DOMAIN EXPANSION',
    stackedEyebrow: 'UNLIMITED VOID // CURSED OUTPUT 120%',
    wordEyebrow: 'RYOIKI TENKAI',
    deskHeader: 'Special Grade Registry',
    pomoWorkLabel: 'DOMAIN EXPANSION // FOCUS',
    pomoBreakLabel: 'REVERSE CURSED RECOVERY',
    pomoStartLabel: 'Expand Domain',
    stopwatchEyebrow: 'BLACK FLASH TIMING SPLIT',
  },
  {
    id: 'demonslayer',
    label: 'Demon Slayer',
    shortTag: 'KAGURA',
    category: 'anime',
    tagline: 'Ichimatsu emerald-obsidian haori lattice with Hinokami Kagura flame amber and Water Breathing cyan',
    recommendedBg: 'ember_spores',
    recommendedAnalog: 'nichirin',
    recommendedRadial: 'nichirin_flame',
    swatchClass: 'bg-gradient-to-tr from-[#10b981] via-[#f97316] to-[#ef4444]',
    digitalEyebrow: 'DEMON SLAYER CORPS // TOTAL CONCENTRATION',
    stackedEyebrow: 'HINOKAMI KAGURA // THIRTEENTH FORM',
    wordEyebrow: 'NICHIRIN // BREATH',
    deskHeader: 'Kasugai Crow Dispatch',
    pomoWorkLabel: 'TOTAL CONCENTRATION CONSTANT',
    pomoBreakLabel: 'BUTTERFLY MANSION REST',
    pomoStartLabel: 'Begin Breathing',
    stopwatchEyebrow: 'THUNDERCLAP & FLASH CHRONO',
  },
  {
    id: 'naruto',
    label: 'Naruto',
    shortTag: 'KONOHA',
    category: 'anime',
    tagline: 'Kurama chakra gold-orange aura, crimson Mangekyou Sharingan iris and Eight-Trigrams seal',
    recommendedBg: 'arcane_runes',
    recommendedAnalog: 'sharingan',
    recommendedRadial: 'chakra_seal',
    swatchClass: 'bg-gradient-to-tr from-[#dc2626] via-[#ff7a00] to-[#fde047]',
    digitalEyebrow: 'HIDDEN LEAF // SAGE CHAKRA LINK',
    stackedEyebrow: 'KURAMA MODE // WILL OF FIRE',
    wordEyebrow: 'SHINOBI // SCROLL',
    deskHeader: 'Hokage Mission Log',
    pomoWorkLabel: 'SAGE MODE MEDITATION',
    pomoBreakLabel: 'ICHIRAKU RAMEN BREAK',
    pomoStartLabel: 'Channel Chakra',
    stopwatchEyebrow: 'FLYING RAIJIN FLASH SPLIT',
  },
  {
    id: 'dragonball',
    label: 'Dragon Ball Z',
    shortTag: 'CAPSULE-9',
    category: 'anime',
    tagline: 'Capsule Corp emerald Dragon Radar grid, Super Saiyan aura gold and Kamehameha Ki blue',
    recommendedBg: 'arcane_runes',
    recommendedAnalog: 'dragon_radar',
    recommendedRadial: 'ki_aura',
    swatchClass: 'bg-gradient-to-tr from-[#22c55e] via-[#facc15] to-[#38bdf8]',
    digitalEyebrow: 'CAPSULE CORP // DRAGON RADAR LOCKED',
    stackedEyebrow: 'POWER LEVEL // OVER 9000',
    wordEyebrow: 'CAPSULE CORP',
    deskHeader: 'Bulma Radar Console',
    pomoWorkLabel: 'HYPERBOLIC TIME CHAMBER',
    pomoBreakLabel: 'SENZU BEAN RECOVERY',
    pomoStartLabel: 'Power Up',
    stopwatchEyebrow: 'INSTANT TRANSMISSION CHRONO',
  },
  {
    id: 'onepiece',
    label: 'One Piece',
    shortTag: 'GRAND-LINE',
    category: 'anime',
    tagline: 'Grand Line nautical brass Log Pose, Straw Hat sun gold and deep New World sea azure',
    recommendedBg: 'waves',
    recommendedAnalog: 'log_pose',
    recommendedRadial: 'grand_line',
    swatchClass: 'bg-gradient-to-tr from-[#0284c7] via-[#facc15] to-[#ef4444]',
    digitalEyebrow: 'THOUSAND SUNNY // NEW WORLD LOG POSE',
    stackedEyebrow: 'GRAND LINE // MAGNETIC LOCK',
    wordEyebrow: 'LOG POSE // BEARING',
    deskHeader: 'Navigator Sea Chart',
    pomoWorkLabel: 'FULL SAIL VOYAGE',
    pomoBreakLabel: 'BANQUET ON DECK',
    pomoStartLabel: 'Set Sail',
    stopwatchEyebrow: 'COUP DE BURST CHRONO',
  },
  {
    id: 'aot',
    label: 'Attack on Titan',
    shortTag: 'SURVEY-CORPS',
    category: 'anime',
    tagline: 'Survey Corps emerald cloak, ODM twin steel blades and Titan transformation lightning gold',
    recommendedBg: 'ember_spores',
    recommendedAnalog: 'scout_wings',
    recommendedRadial: 'odm_telemetry',
    swatchClass: 'bg-gradient-to-tr from-[#064e3b] via-[#10b981] to-[#facc15]',
    digitalEyebrow: 'WALL MARIA // SURVEY CORPS EXPEDITION',
    stackedEyebrow: 'SHINZO WO SASAGEYO // ODM READY',
    wordEyebrow: 'EXPEDITION // TIME',
    deskHeader: 'Regiment Tactical Log',
    pomoWorkLabel: 'ODM MANEUVER DRILL',
    pomoBreakLabel: 'WALL ROSE RESPITE',
    pomoStartLabel: 'Dedicate Focus',
    stopwatchEyebrow: 'ODM TITAN PURSUIT SPLIT',
  },
  {
    id: 'pokemon',
    label: 'Pokemon',
    shortTag: 'DEX-025',
    category: 'anime',
    tagline: 'Kalos Pokedex OS crimson-and-pearl split frame, Pikachu volt gold and cyan scanner optics',
    recommendedBg: 'ripple',
    recommendedAnalog: 'pokeball_dex',
    recommendedRadial: 'pokedex_scan',
    swatchClass: 'bg-gradient-to-tr from-[#ef4444] via-[#facc15] to-[#38bdf8]',
    digitalEyebrow: 'KALOS-DEX // POKEDEX OS V9.4',
    stackedEyebrow: 'TRAINER ID // READY FOR BATTLE',
    wordEyebrow: 'POKEDEX // LOG',
    deskHeader: 'Professor Lab Terminal',
    pomoWorkLabel: 'GYM TRAINING SESSION',
    pomoBreakLabel: 'POKEMON CENTER HEAL',
    pomoStartLabel: 'Start Encounter',
    stopwatchEyebrow: 'SPEED STAT TELEMETRY',
  },
  {
    id: 'strangerthings',
    label: 'Stranger Things',
    shortTag: 'HAWKINS-83',
    category: 'tv',
    tagline: '1983 Hawkins crimson neon title bars, Creel House obsidian dial and drifting Upside Down ash spores',
    recommendedBg: 'ember_spores',
    recommendedAnalog: 'hawkins_83',
    recommendedRadial: 'upside_down',
    swatchClass: 'bg-gradient-to-tr from-[#1a0307] via-[#dc2626] to-[#ff4d5a]',
    digitalEyebrow: 'HAWKINS LAB // NOVEMBER 1983 // RIFT OPEN',
    stackedEyebrow: 'UPSIDE DOWN // CHANNEL 11',
    wordEyebrow: 'HAWKINS // 1983',
    deskHeader: 'AV Club Dispatch',
    pomoWorkLabel: 'SENSORY TANK FOCUS',
    pomoBreakLabel: 'WAFFLE BREAK',
    pomoStartLabel: 'Open The Gate',
    stopwatchEyebrow: 'CAMPAIGN SESSION CHRONO',
  },
  {
    id: 'arcane',
    label: 'Arcane Hextech',
    shortTag: 'HEXTECH',
    category: 'tv',
    tagline: 'Piltover Art-Deco brass filigree, luminous crystalline Hextech blue and Zaun shimmer magenta',
    recommendedBg: 'arcane_runes',
    recommendedAnalog: 'hexcore',
    recommendedRadial: 'hextech_rune',
    swatchClass: 'bg-gradient-to-tr from-[#d97706] via-[#38bdf8] to-[#ec4899]',
    digitalEyebrow: 'PILTOVER ACADEMY // HEXCORE MATRIX',
    stackedEyebrow: 'HEXTECH // ARCANE RESONANCE',
    wordEyebrow: 'HEXTECH // EPOCH',
    deskHeader: 'Progress Day Ledger',
    pomoWorkLabel: 'HEXCORE STABILIZATION',
    pomoBreakLabel: 'WORKSHOP TEA BREAK',
    pomoStartLabel: 'Ignite Hexgate',
    stopwatchEyebrow: 'HEXGATE TRANSIT CHRONO',
  },
  {
    id: 'doctorwho',
    label: 'Doctor Who',
    shortTag: 'GALLIFREY',
    category: 'tv',
    tagline: 'TARDIS Police Box midnight cobalt paired with golden Circular Gallifreyan time-vortex geometry',
    recommendedBg: 'arcane_runes',
    recommendedAnalog: 'gallifreyan',
    recommendedRadial: 'tardis_vortex',
    swatchClass: 'bg-gradient-to-tr from-[#1e3a8a] via-[#3b82f6] to-[#fbbf24]',
    digitalEyebrow: 'TARDIS TYPE-40 // TIME VORTEX LOCKED',
    stackedEyebrow: 'GALLIFREY // TIMELORD CHRONO',
    wordEyebrow: 'TIME VORTEX',
    deskHeader: 'TARDIS Console Matrix',
    pomoWorkLabel: 'TIME VORTEX NAVIGATION',
    pomoBreakLabel: 'PARADOX COOLDOWN',
    pomoStartLabel: 'Materialize',
    stopwatchEyebrow: 'TEMPORAL PARSEC CHRONO',
  },
  {
    id: 'fallout',
    label: 'Fallout Pip-Boy',
    shortTag: 'VAULT-33',
    category: 'tv',
    tagline: 'RobCo Pip-Boy 3000 CRT phosphor green screen, Vault-Tec gold trim and curved scanline glass',
    recommendedBg: 'matrix_rain',
    recommendedAnalog: 'pip_boy',
    recommendedRadial: 'vault_pip',
    swatchClass: 'bg-gradient-to-tr from-[#052e16] via-[#22c55e] to-[#facc15]',
    digitalEyebrow: 'ROBCO TERMLINK // VAULT-33 PIP-BOY',
    stackedEyebrow: 'VAULT-TEC // S.P.E.C.I.A.L. SYNC',
    wordEyebrow: 'PIP-BOY // STAT',
    deskHeader: 'Vault Overseer Log',
    pomoWorkLabel: 'VAULT MAINTENANCE CYCLE',
    pomoBreakLabel: 'NUKA-COLA BREAK',
    pomoStartLabel: 'Engage V.A.T.S.',
    stopwatchEyebrow: 'V.A.T.S. CRITICAL CHRONO',
  },
  {
    id: 'ironman',
    label: 'Iron Man',
    shortTag: 'STARK-MK85',
    category: 'movies',
    tagline: 'J.A.R.V.I.S. holographic flight HUD, glowing palladium Arc Reactor blue and titanium hot-rod gold',
    recommendedBg: 'orbital',
    recommendedAnalog: 'arc_reactor',
    recommendedRadial: 'jarvis_hud',
    swatchClass: 'bg-gradient-to-tr from-[#dc2626] via-[#fbbf24] to-[#38bdf8]',
    digitalEyebrow: 'STARK HUD // J.A.R.V.I.S. ONLINE // MK-85',
    stackedEyebrow: 'ARC REACTOR // OUTPUT 3.2 GJ/S',
    wordEyebrow: 'STARK // TELEMETRY',
    deskHeader: 'Malibu Workshop Deck',
    pomoWorkLabel: 'SUIT CALIBRATION CYCLE',
    pomoBreakLabel: 'REACTOR COOLDOWN',
    pomoStartLabel: 'Initialize HUD',
    stopwatchEyebrow: 'MACH-3 FLIGHT TELEMETRY',
  },
  {
    id: 'starwars',
    label: 'Star Wars',
    shortTag: 'REPUBLIC',
    category: 'movies',
    tagline: 'Hyperspace starlight black, Imperial crawl gold and opposing Jedi Cyan / Sith Crimson blades',
    recommendedBg: 'warp',
    recommendedAnalog: 'galactic_trench',
    recommendedRadial: 'kyber_core',
    swatchClass: 'bg-gradient-to-tr from-[#38bdf8] via-[#facc15] to-[#ff1e38]',
    digitalEyebrow: 'CORUSCANT // HYPERSPACE VECTOR LOCKED',
    stackedEyebrow: 'STAY ON TARGET // RED FIVE',
    wordEyebrow: 'GALACTIC STANDARD',
    deskHeader: 'Rebel Alliance Chronometer',
    pomoWorkLabel: 'JEDI TRAINING FOCUS',
    pomoBreakLabel: 'CANTINA REST CYCLE',
    pomoStartLabel: 'Engage Hyperdrive',
    stopwatchEyebrow: 'KESSEL RUN PARSEC CHRONO',
  },
  {
    id: 'matrix_neo',
    label: 'The Matrix',
    shortTag: 'ZION-01',
    category: 'movies',
    tagline: '1999 Nebuchadnezzar digital code rain construct, glowing phosphor emerald glyphs and CRT vignette',
    recommendedBg: 'matrix_rain',
    recommendedAnalog: 'matrix_code',
    recommendedRadial: 'zion_construct',
    swatchClass: 'bg-gradient-to-tr from-[#022c22] via-[#16a34a] to-[#00ff66]',
    digitalEyebrow: 'NEBUCHADNEZZAR // OPERATOR CONSTRUCT',
    stackedEyebrow: 'SYSTEM ANOMALY // TRACE ACTIVE',
    wordEyebrow: 'CONSTRUCT // TIME',
    deskHeader: 'Operator Signal Matrix',
    pomoWorkLabel: 'DEEP CONSTRUCT UPLOAD',
    pomoBreakLabel: 'ZION UNPLUG CYCLE',
    pomoStartLabel: 'Enter The Matrix',
    stopwatchEyebrow: 'BULLET-TIME REFLEX SPLIT',
  },
  {
    id: 'batman',
    label: 'Batman Gotham',
    shortTag: 'WAYNE-OS',
    category: 'movies',
    tagline: 'Stealth Batcave Kevlar charcoal, Wayne-Tech tactical amber and Gotham searchlight spotlight halo',
    recommendedBg: 'grid',
    recommendedAnalog: 'gotham_signal',
    recommendedRadial: 'batcomputer',
    swatchClass: 'bg-gradient-to-tr from-[#090b10] via-[#475569] to-[#fbbf24]',
    digitalEyebrow: 'BATCAVE // WAYNE-TECH SONAR ACTIVE',
    stackedEyebrow: 'GOTHAM WATCH // SECTOR 04',
    wordEyebrow: 'GOTHAM // NIGHT',
    deskHeader: 'Batcomputer Case Log',
    pomoWorkLabel: 'DETECTIVE CASE ANALYSIS',
    pomoBreakLabel: 'MANOR TEA SERVICE',
    pomoStartLabel: 'Engage Recon',
    stopwatchEyebrow: 'PURSUIT INTERCEPT CHRONO',
  },
  {
    id: 'invincible',
    label: 'Invincible',
    shortTag: 'VILTRUM',
    category: 'tv',
    tagline: 'Bold hero title-card yellow on Viltrumite blue with halftone ink and crimson flecks',
    recommendedBg: 'comic_burst',
    recommendedAnalog: 'invincible',
    recommendedRadial: 'invincible_arc',
    swatchClass: 'bg-gradient-to-tr from-[#0062e6] via-[#0095ff] to-[#ffe600]',
    digitalEyebrow: 'GDA HERO DISPATCH // TITLE CARD',
    stackedEyebrow: 'ISSUE #01 // EARTH-PRIME',
    wordEyebrow: 'IT IS',
    deskHeader: 'GDA Command Calendar',
    pomoWorkLabel: 'GUARDIANS TRAINING',
    pomoBreakLabel: 'RECOVERY CYCLE',
    pomoStartLabel: 'Engage Focus',
    stopwatchEyebrow: 'VILTRUMITE MACH CHRONO',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    shortTag: 'NC-2077',
    category: 'anime',
    tagline: 'Night City Edgerunners netrunner HUD with chamfered corners, glitch yellow and neon rain',
    recommendedBg: 'cyber_rain',
    recommendedAnalog: 'cyberwave',
    recommendedRadial: 'cyber_hud',
    swatchClass: 'bg-gradient-to-tr from-[#ff003c] via-[#fcee0a] to-[#00f0ff]',
    digitalEyebrow: 'NET://NC-2077 // ICE: ACTIVE // SYNC 99.8%',
    stackedEyebrow: 'ARASAKA TOWER // SECTOR 07',
    wordEyebrow: 'BREACH // TIME',
    deskHeader: 'Fixer Cyberdeck',
    pomoWorkLabel: 'SANDEVISTAN OVERCLOCK',
    pomoBreakLabel: 'NEURAL COOLDOWN',
    pomoStartLabel: 'Run Sandevistan',
    stopwatchEyebrow: 'SANDEVISTAN REFLEX SPLIT',
  },
  {
    id: 'dune',
    label: 'Dune Arrakis',
    shortTag: 'ARRAKIS',
    category: 'movies',
    tagline: 'Monumental Arrakeen desert ochre, twin-sun eclipse horizon and glowing Fremen spice blue',
    recommendedBg: 'sandstorm',
    recommendedAnalog: 'dune',
    recommendedRadial: 'dune_eclipse',
    swatchClass: 'bg-gradient-to-tr from-[#92400e] via-[#f59e0b] to-[#38bdf8]',
    digitalEyebrow: 'ARRAKIS // IMPERIAL CYCLE 10191',
    stackedEyebrow: 'MUAD-DIB // SECOND MOON',
    wordEyebrow: 'DESERT ORACLE',
    deskHeader: 'Guild Star-Chart',
    pomoWorkLabel: 'LITANY FOCUS CYCLE',
    pomoBreakLabel: 'STILLSUIT REST',
    pomoStartLabel: 'Begin Cycle',
    stopwatchEyebrow: 'ORNITHOPTER FLIGHT CHRONO',
  },
  {
    id: 'doomsday',
    label: 'Doomsday',
    shortTag: 'MIDNIGHT',
    category: 'movies',
    tagline: 'Armored vault steel, Minutes-to-Midnight crimson danger sector and reactor hazard bars',
    recommendedBg: 'ripple',
    recommendedAnalog: 'doomsday',
    recommendedRadial: 'doomsday_core',
    swatchClass: 'bg-gradient-to-tr from-[#18181b] via-[#dc2626] to-[#f59e0b]',
    digitalEyebrow: 'VAULT SECTOR 00 // MINUTES TO MIDNIGHT',
    stackedEyebrow: 'CONTAINMENT SILO // DEFCON 2',
    wordEyebrow: 'ALERT // SIGNAL',
    deskHeader: 'Bunker Command Log',
    pomoWorkLabel: 'REACTOR CONTAINMENT',
    pomoBreakLabel: 'VENTING COOLDOWN',
    pomoStartLabel: 'Arm Timer',
    stopwatchEyebrow: 'LAUNCH TELEMETRY CHRONO',
  },
  {
    id: 'spiderverse',
    label: 'Spider-Verse',
    shortTag: 'EARTH-1610',
    category: 'movies',
    tagline: 'Chromatic cyan-magenta comic misregistration, Ben-Day halftones and multiverse portal web',
    recommendedBg: 'comic_burst',
    recommendedAnalog: 'spider_web',
    recommendedRadial: 'spider_web',
    swatchClass: 'bg-gradient-to-tr from-[#00f5ff] via-[#7c3aed] to-[#ff2a85]',
    digitalEyebrow: 'EARTH-1610 // MULTIVERSE GIZMO SYNC',
    stackedEyebrow: 'ACROSS DIMENSIONS // 1610',
    wordEyebrow: 'EARTH-1610',
    deskHeader: 'Dimensional Watch',
    pomoWorkLabel: 'PORTAL STABILIZER',
    pomoBreakLabel: 'ANOMALY REST',
    pomoStartLabel: 'Leap Into Focus',
    stopwatchEyebrow: 'WEB-SLINGER VELOCITY',
  },
  {
    id: 'evangelion',
    label: 'Evangelion',
    shortTag: 'NERV-01',
    category: 'anime',
    tagline: 'NERV MAGI tactical cockpit amber, internal battery countdown cells and AT-Field hex grid',
    recommendedBg: 'hex_field',
    recommendedAnalog: 'evangelion',
    recommendedRadial: 'nerv_hex',
    swatchClass: 'bg-gradient-to-tr from-[#ff1e27] via-[#ff6a00] to-[#39ff14]',
    digitalEyebrow: 'NERV MAGI-01 // INTERNAL POWER // ACTIVE',
    stackedEyebrow: 'ENTRY PLUG // SYNC RATIO 94.2%',
    wordEyebrow: 'MELCHIOR • BALTHASAR • CASPER',
    deskHeader: 'GeoFront Tactical Deck',
    pomoWorkLabel: 'INTERNAL BATTERY ACTIVE',
    pomoBreakLabel: 'UMBILICAL RECHARGE',
    pomoStartLabel: 'Launch Unit-01',
    stopwatchEyebrow: 'SYNCHRONIZATION CHRONO',
  },
  {
    id: 'tron',
    label: 'Tron Grid',
    shortTag: 'ENCOM',
    category: 'movies',
    tagline: 'Obsidian glass digital arena, razor Identity Disc cyan light-ribbons and fiery orange nodes',
    recommendedBg: 'grid',
    recommendedAnalog: 'tron_disc',
    recommendedRadial: 'tron_disc',
    swatchClass: 'bg-gradient-to-tr from-[#020617] via-[#00f2ff] to-[#ff6b00]',
    digitalEyebrow: 'ENCOM // THE GRID // IDENTITY DISC VERIFIED',
    stackedEyebrow: 'GRID SECTOR 04 // LIGHT CYCLE',
    wordEyebrow: 'GRID DIRECTIVE',
    deskHeader: 'ISO System Terminal',
    pomoWorkLabel: 'ARENA GRID CYCLE',
    pomoBreakLabel: 'DISC STANDBY',
    pomoStartLabel: 'Enter The Grid',
    stopwatchEyebrow: 'LIGHT-CYCLE ARENA SPLIT',
  },
  {
    id: 'akira',
    label: 'Akira 2019',
    shortTag: 'NEO-TOKYO',
    category: 'anime',
    tagline: '1988 Neo-Tokyo crimson bike lacquer, laser taillight trails and analog phosphor tachometer',
    recommendedBg: 'warp',
    recommendedAnalog: 'cyberwave',
    recommendedRadial: 'turbine',
    swatchClass: 'bg-gradient-to-tr from-[#ef233c] via-[#f97316] to-[#14b8a6]',
    digitalEyebrow: 'NEO-TOKYO // 2019 // SOL-740 TELEMETRY',
    stackedEyebrow: 'CAPSULE HIGHWAY // 12,000 RPM',
    wordEyebrow: 'NEO-TOKYO // 2019',
    deskHeader: 'Orbital SOL Console',
    pomoWorkLabel: 'TURBO OVERDRIVE',
    pomoBreakLabel: 'ENGINE COOLING',
    pomoStartLabel: 'Ignite Drive',
    stopwatchEyebrow: 'HIGHWAY CHASE SPLIT',
  },
];

export const getEditionThemeStyles = (edition: Exclude<ClockEdition, 'classic'>): EditionThemeStyles => {
  switch (edition) {
    case 'gta6':
      return {
        bg: 'bg-gradient-to-br from-[#160423] via-[#2c083a] to-[#0a0820]',
        clockText: 'edition-gta6-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,46,147,0.28),rgba(255,140,66,0.14)_48%,rgba(0,245,212,0.08)_75%,transparent_88%)]',
        accent: 'text-[#00f5d4]',
        border: 'border-[#ff2e93]/65',
        badgeBg: 'bg-[#ff2e93]/20 text-[#ffe4f2] border-[#00f5d4]/55',
        handSec: '#00f5d4',
        handMin: '#fde047',
        handHr: '#ff2e93',
        dialBg: '#1d062d',
        dialBorder: '#ff2e93',
        flipCard: 'bg-[#210734] text-[#fff1f9] border-[#ff2e93]/70 shadow-[#ff2e93]/30',
        progressBar: 'bg-gradient-to-r from-[#ff2e93] via-[#ff8c42] to-[#00f5d4]',
        subText: 'text-pink-200/85',
        dialTickMajor: '#00f5d4',
        dialTickMinor: 'rgba(255,46,147,0.38)',
        dialNumColor: '#fef08a',
      };
    case 'minecraft':
      return {
        bg: 'bg-[#09120b]',
        clockText: 'edition-minecraft-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.22),rgba(34,211,238,0.1)_52%,transparent_76%)]',
        accent: 'text-[#4ade80]',
        border: 'border-[#22c55e]/65',
        badgeBg: 'bg-[#14532d]/70 text-[#bbf7d0] border-[#4ade80]/60',
        handSec: '#22d3ee',
        handMin: '#4ade80',
        handHr: '#a3e635',
        dialBg: '#0d1a0f',
        dialBorder: '#22c55e',
        flipCard: 'bg-[#102113] text-[#dcfce7] border-[#22c55e]/70 shadow-[#22c55e]/25',
        progressBar: 'bg-gradient-to-r from-[#16a34a] via-[#4ade80] to-[#a3e635]',
        subText: 'text-emerald-200/80',
        dialTickMajor: '#4ade80',
        dialTickMinor: 'rgba(74,222,128,0.34)',
        dialNumColor: '#22d3ee',
      };
    case 'persona5':
      return {
        bg: 'bg-gradient-to-br from-[#190202] via-[#7f1d1d]/30 to-[#060606]',
        clockText: 'edition-persona5-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.3),rgba(239,68,68,0.08)_55%,transparent_80%)]',
        accent: 'text-[#f8fafc]',
        border: 'border-[#dc2626]/80',
        badgeBg: 'bg-[#dc2626]/90 text-white border-white/80',
        handSec: '#ffffff',
        handMin: '#ef4444',
        handHr: '#f8fafc',
        dialBg: '#0a0a0a',
        dialBorder: '#dc2626',
        flipCard: 'bg-[#09090b] text-white border-[#dc2626]/85 shadow-[#dc2626]/35',
        progressBar: 'bg-gradient-to-r from-[#dc2626] via-[#ffffff] to-[#dc2626]',
        subText: 'text-red-200/85',
        dialTickMajor: '#ffffff',
        dialTickMinor: 'rgba(220,38,38,0.45)',
        dialNumColor: '#ffffff',
      };
    case 'eldenring':
      return {
        bg: 'bg-[#080603]',
        clockText: 'edition-eldenring-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.22),rgba(180,83,9,0.1)_52%,transparent_78%)]',
        accent: 'text-[#fbbf24]',
        border: 'border-[#d97706]/60',
        badgeBg: 'bg-amber-950/70 text-[#fde68a] border-[#fbbf24]/55',
        handSec: '#fef08a',
        handMin: '#fbbf24',
        handHr: '#d97706',
        dialBg: '#0c0904',
        dialBorder: '#d97706',
        flipCard: 'bg-[#120d05] text-[#fef3c7] border-[#fbbf24]/60 shadow-[#fbbf24]/25',
        progressBar: 'bg-gradient-to-r from-[#b45309] via-[#fbbf24] to-[#fef08a]',
        subText: 'text-amber-200/80',
        dialTickMajor: '#fbbf24',
        dialTickMinor: 'rgba(217,119,6,0.34)',
        dialNumColor: '#fef3c7',
      };
    case 'godofwar':
      return {
        bg: 'bg-gradient-to-br from-[#070b14] via-[#0e1726] to-[#190609]',
        clockText: 'text-[#f8fafc] drop-shadow-[0_0_26px_rgba(56,189,248,0.65)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.18),rgba(239,68,68,0.12)_55%,transparent_80%)]',
        accent: 'text-[#38bdf8]',
        border: 'border-[#ef4444]/60',
        badgeBg: 'bg-[#0c1b2e]/75 text-[#e0f2fe] border-[#ef4444]/60',
        handSec: '#38bdf8',
        handMin: '#f8fafc',
        handHr: '#ef4444',
        dialBg: '#0b1220',
        dialBorder: '#ef4444',
        flipCard: 'bg-[#0f172a] text-[#e0f2fe] border-[#38bdf8]/60 shadow-[#38bdf8]/25',
        progressBar: 'bg-gradient-to-r from-[#38bdf8] via-[#f8fafc] to-[#ef4444]',
        subText: 'text-slate-300/85',
        dialTickMajor: '#ef4444',
        dialTickMinor: 'rgba(56,189,248,0.35)',
        dialNumColor: '#e0f2fe',
      };
    case 'zelda_totk':
      return {
        bg: 'bg-[#051018]',
        clockText: 'text-[#a5f3fc] drop-shadow-[0_0_28px_rgba(6,182,212,0.8)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.22),rgba(250,204,21,0.08)_54%,transparent_80%)]',
        accent: 'text-[#facc15]',
        border: 'border-[#06b6d4]/60',
        badgeBg: 'bg-[#083344]/75 text-[#cffafe] border-[#facc15]/55',
        handSec: '#facc15',
        handMin: '#22d3ee',
        handHr: '#fbbf24',
        dialBg: '#071722',
        dialBorder: '#06b6d4',
        flipCard: 'bg-[#081d2b] text-[#a5f3fc] border-[#06b6d4]/65 shadow-[#06b6d4]/25',
        progressBar: 'bg-gradient-to-r from-[#06b6d4] via-[#22d3ee] to-[#facc15]',
        subText: 'text-cyan-200/80',
        dialTickMajor: '#facc15',
        dialTickMinor: 'rgba(6,182,212,0.35)',
        dialNumColor: '#fef08a',
      };
    case 'halo_unsc':
      return {
        bg: 'bg-[#070e17]',
        clockText: 'text-[#fde68a] drop-shadow-[0_0_26px_rgba(251,191,36,0.72)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.2),rgba(56,189,248,0.1)_54%,transparent_78%)]',
        accent: 'text-[#38bdf8]',
        border: 'border-[#fbbf24]/60',
        badgeBg: 'bg-[#172554]/65 text-[#fef3c7] border-[#fbbf24]/55',
        handSec: '#38bdf8',
        handMin: '#fbbf24',
        handHr: '#f59e0b',
        dialBg: '#0b1523',
        dialBorder: '#fbbf24',
        flipCard: 'bg-[#0d1929] text-[#fef3c7] border-[#fbbf24]/65 shadow-[#fbbf24]/25',
        progressBar: 'bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#38bdf8]',
        subText: 'text-amber-200/80',
        dialTickMajor: '#fbbf24',
        dialTickMinor: 'rgba(56,189,248,0.35)',
        dialNumColor: '#e0f2fe',
      };
    case 'pacman':
      return {
        bg: 'bg-[#030514]',
        clockText: 'text-[#fde047] drop-shadow-[0_0_26px_rgba(250,204,21,0.82)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.26),rgba(250,204,21,0.1)_52%,transparent_80%)]',
        accent: 'text-[#38bdf8]',
        border: 'border-[#2563eb]/75',
        badgeBg: 'bg-[#1e3a8a]/65 text-[#fef08a] border-[#2563eb]/75',
        handSec: '#facc15',
        handMin: '#38bdf8',
        handHr: '#f43f5e',
        dialBg: '#03071d',
        dialBorder: '#2563eb',
        flipCard: 'bg-[#050b29] text-[#fde047] border-[#2563eb]/80 shadow-[#2563eb]/30',
        progressBar: 'bg-gradient-to-r from-[#2563eb] via-[#facc15] to-[#f43f5e]',
        subText: 'text-sky-200/85',
        dialTickMajor: '#facc15',
        dialTickMinor: 'rgba(37,99,235,0.45)',
        dialNumColor: '#fef08a',
      };
    case 'ben10':
      return {
        bg: 'bg-[#060c07]',
        clockText: 'edition-ben10-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(101,255,0,0.22),rgba(16,185,129,0.08)_55%,transparent_76%)]',
        accent: 'text-[#84ff33]',
        border: 'border-[#65ff00]/65',
        badgeBg: 'bg-[#65ff00]/15 text-[#9eff5c] border-[#65ff00]/55',
        handSec: '#65ff00',
        handMin: '#f8fafc',
        handHr: '#94a3b8',
        dialBg: '#09110b',
        dialBorder: '#65ff00',
        flipCard: 'bg-[#0c160e] text-[#65ff00] border-[#65ff00]/65 shadow-[#65ff00]/25',
        progressBar: 'bg-gradient-to-r from-[#16a34a] via-[#65ff00] to-[#bef264]',
        subText: 'text-emerald-200/80',
        dialTickMajor: '#65ff00',
        dialTickMinor: 'rgba(101,255,0,0.34)',
        dialNumColor: '#ecfccb',
      };
    case 'jjk':
      return {
        bg: 'bg-gradient-to-br from-[#050310] via-[#0c0622] to-[#060918]',
        clockText: 'edition-jjk-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.22),rgba(0,229,255,0.14)_48%,rgba(255,42,85,0.08)_72%,transparent_84%)]',
        accent: 'text-[#38bdf8]',
        border: 'border-[#a855f7]/60',
        badgeBg: 'bg-[#a855f7]/20 text-[#e9d5ff] border-[#38bdf8]/55',
        handSec: '#c084fc',
        handMin: '#38bdf8',
        handHr: '#ff2a55',
        dialBg: '#070414',
        dialBorder: '#a855f7',
        flipCard: 'bg-[#0c0720] text-[#f5f3ff] border-[#a855f7]/60 shadow-[#38bdf8]/25',
        progressBar: 'bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#ff2a55]',
        subText: 'text-purple-200/80',
        dialTickMajor: '#c084fc',
        dialTickMinor: 'rgba(56,189,248,0.34)',
        dialNumColor: '#f8fafc',
      };
    case 'demonslayer':
      return {
        bg: 'bg-[#090707]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-[#fef08a] via-[#fb923c] to-[#ef4444] drop-shadow-[0_0_28px_rgba(249,115,22,0.85)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.2),rgba(16,185,129,0.1)_54%,transparent_78%)]',
        accent: 'text-[#34d399]',
        border: 'border-[#f97316]/60',
        badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/50',
        handSec: '#fb923c',
        handMin: '#38bdf8',
        handHr: '#34d399',
        dialBg: '#0c0909',
        dialBorder: '#f97316',
        flipCard: 'bg-[#120d0c] text-[#fed7aa] border-[#f97316]/60 shadow-orange-950/50',
        progressBar: 'bg-gradient-to-r from-[#10b981] via-[#f97316] to-[#ef4444]',
        subText: 'text-orange-200/80',
        dialTickMajor: '#fb923c',
        dialTickMinor: 'rgba(52,211,153,0.35)',
        dialNumColor: '#ffedd5',
      };
    case 'naruto':
      return {
        bg: 'bg-[#0c0603]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#ff8c00] to-[#dc2626] drop-shadow-[0_0_30px_rgba(255,122,0,0.85)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.22),rgba(220,38,38,0.1)_52%,transparent_76%)]',
        accent: 'text-[#ef4444]',
        border: 'border-[#ff7a00]/60',
        badgeBg: 'bg-[#ff7a00]/15 text-[#fdba74] border-[#ff7a00]/55',
        handSec: '#ef4444',
        handMin: '#ff8c00',
        handHr: '#fde047',
        dialBg: '#140806',
        dialBorder: '#ef4444',
        flipCard: 'bg-[#170b06] text-[#fde047] border-[#ff7a00]/60 shadow-orange-950/50',
        progressBar: 'bg-gradient-to-r from-[#fde047] via-[#ff7a00] to-[#dc2626]',
        subText: 'text-amber-200/80',
        dialTickMajor: '#ff8c00',
        dialTickMinor: 'rgba(239,68,68,0.38)',
        dialNumColor: '#fef3c7',
      };
    case 'dragonball':
      return {
        bg: 'bg-[#040b18]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] via-[#facc15] to-[#f97316] drop-shadow-[0_0_32px_rgba(250,204,21,0.88)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.22),rgba(34,197,94,0.1)_52%,transparent_76%)]',
        accent: 'text-[#4ade80]',
        border: 'border-[#facc15]/60',
        badgeBg: 'bg-[#facc15]/15 text-[#fef08a] border-[#facc15]/55',
        handSec: '#22c55e',
        handMin: '#facc15',
        handHr: '#38bdf8',
        dialBg: '#062114',
        dialBorder: '#22c55e',
        flipCard: 'bg-[#081226] text-[#fde047] border-[#facc15]/60 shadow-amber-500/20',
        progressBar: 'bg-gradient-to-r from-[#22c55e] via-[#facc15] to-[#38bdf8]',
        subText: 'text-amber-100/80',
        dialTickMajor: '#facc15',
        dialTickMinor: 'rgba(34,197,94,0.38)',
        dialNumColor: '#fef08a',
      };
    case 'onepiece':
      return {
        bg: 'bg-gradient-to-b from-[#04101f] via-[#071a30] to-[#0a1322]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#facc15] to-[#ef4444] drop-shadow-[0_0_28px_rgba(250,204,21,0.75)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.2),rgba(250,204,21,0.12)_52%,transparent_76%)]',
        accent: 'text-[#38bdf8]',
        border: 'border-[#f59e0b]/55',
        badgeBg: 'bg-amber-500/15 text-amber-200 border-amber-400/55',
        handSec: '#ef4444',
        handMin: '#facc15',
        handHr: '#38bdf8',
        dialBg: '#06182c',
        dialBorder: '#fbbf24',
        flipCard: 'bg-[#081c33] text-[#fde047] border-[#fbbf24]/55 shadow-sky-950/50',
        progressBar: 'bg-gradient-to-r from-[#0ea5e9] via-[#facc15] to-[#ef4444]',
        subText: 'text-sky-200/80',
        dialTickMajor: '#fbbf24',
        dialTickMinor: 'rgba(56,189,248,0.34)',
        dialNumColor: '#fef9c3',
      };
    case 'aot':
      return {
        bg: 'bg-[#090d0a]',
        clockText: 'text-[#e2e8f0] drop-shadow-[0_0_24px_rgba(16,185,129,0.55)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.2),rgba(250,204,21,0.08)_55%,transparent_76%)]',
        accent: 'text-[#10b981]',
        border: 'border-emerald-500/50',
        badgeBg: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/50',
        handSec: '#facc15',
        handMin: '#f8fafc',
        handHr: '#10b981',
        dialBg: '#0d1410',
        dialBorder: '#10b981',
        flipCard: 'bg-[#101813] text-[#f1f5f9] border-emerald-500/50 shadow-emerald-950/50',
        progressBar: 'bg-gradient-to-r from-[#059669] via-[#10b981] to-[#facc15]',
        subText: 'text-emerald-100/75',
        dialTickMajor: '#e2e8f0',
        dialTickMinor: 'rgba(16,185,129,0.36)',
        dialNumColor: '#f8fafc',
      };
    case 'pokemon':
      return {
        bg: 'bg-[#12070a]',
        clockText: 'text-[#f8fafc] drop-shadow-[0_0_24px_rgba(239,68,68,0.65)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.2),rgba(56,189,248,0.12)_55%,transparent_78%)]',
        accent: 'text-[#38bdf8]',
        border: 'border-red-500/60',
        badgeBg: 'bg-red-500/20 text-rose-100 border-sky-400/55',
        handSec: '#38bdf8',
        handMin: '#facc15',
        handHr: '#ef4444',
        dialBg: '#160b0f',
        dialBorder: '#ef4444',
        flipCard: 'bg-[#1a0d12] text-white border-red-500/60 shadow-red-950/50',
        progressBar: 'bg-gradient-to-r from-[#ef4444] via-[#facc15] to-[#38bdf8]',
        subText: 'text-slate-200/80',
        dialTickMajor: '#f8fafc',
        dialTickMinor: 'rgba(239,68,68,0.38)',
        dialNumColor: '#ffffff',
      };
    case 'strangerthings':
      return {
        bg: 'bg-[#060103]',
        clockText: 'edition-stranger-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.24),rgba(127,29,29,0.12)_55%,transparent_78%)]',
        accent: 'text-[#ef4444]',
        border: 'border-[#dc2626]/65',
        badgeBg: 'bg-red-600/20 text-red-200 border-red-500/65',
        handSec: '#ff1e2d',
        handMin: '#fca5a5',
        handHr: '#dc2626',
        dialBg: '#090204',
        dialBorder: '#ef4444',
        flipCard: 'bg-[#0f0306] text-[#ff4d5a] border-red-600/65 shadow-red-950/70',
        progressBar: 'bg-gradient-to-r from-[#7f1d1d] via-[#ef4444] to-[#fca5a5]',
        subText: 'text-rose-200/75',
        dialTickMajor: '#ff4d5a',
        dialTickMinor: 'rgba(220,38,38,0.35)',
        dialNumColor: '#fecaca',
      };
    case 'arcane':
      return {
        bg: 'bg-gradient-to-br from-[#050a14] via-[#091224] to-[#0c0718]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-[#fde68a] via-[#38bdf8] to-[#f472b6] drop-shadow-[0_0_28px_rgba(56,189,248,0.75)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.2),rgba(245,158,11,0.12)_52%,rgba(236,72,153,0.08)_75%,transparent_85%)]',
        accent: 'text-[#fbbf24]',
        border: 'border-[#d97706]/60',
        badgeBg: 'bg-amber-500/15 text-amber-200 border-sky-400/55',
        handSec: '#38bdf8',
        handMin: '#fbbf24',
        handHr: '#ec4899',
        dialBg: '#070e1c',
        dialBorder: '#fbbf24',
        flipCard: 'bg-[#091226] text-[#fde68a] border-[#d97706]/60 shadow-sky-500/20',
        progressBar: 'bg-gradient-to-r from-[#fbbf24] via-[#38bdf8] to-[#ec4899]',
        subText: 'text-sky-200/80',
        dialTickMajor: '#fbbf24',
        dialTickMinor: 'rgba(56,189,248,0.36)',
        dialNumColor: '#fef3c7',
      };
    case 'doctorwho':
      return {
        bg: 'bg-gradient-to-b from-[#040d21] via-[#081a3d] to-[#050e24]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] via-[#fbbf24] to-[#60a5fa] drop-shadow-[0_0_28px_rgba(251,191,36,0.7)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.24),rgba(251,191,36,0.14)_54%,transparent_78%)]',
        accent: 'text-[#fbbf24]',
        border: 'border-[#3b82f6]/60',
        badgeBg: 'bg-blue-600/20 text-amber-200 border-blue-400/60',
        handSec: '#fbbf24',
        handMin: '#93c5fd',
        handHr: '#fde68a',
        dialBg: '#061430',
        dialBorder: '#3b82f6',
        flipCard: 'bg-[#081a3e] text-[#fef3c7] border-[#3b82f6]/60 shadow-blue-900/50',
        progressBar: 'bg-gradient-to-r from-[#1d4ed8] via-[#60a5fa] to-[#fbbf24]',
        subText: 'text-blue-200/80',
        dialTickMajor: '#fbbf24',
        dialTickMinor: 'rgba(147,197,253,0.34)',
        dialNumColor: '#fef3c7',
      };
    case 'fallout':
      return {
        bg: 'bg-[#030e05]',
        clockText: 'text-[#4ade80] drop-shadow-[0_0_28px_rgba(74,222,128,0.85)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.2),rgba(234,179,8,0.08)_55%,transparent_78%)]',
        accent: 'text-[#facc15]',
        border: 'border-[#22c55e]/60',
        badgeBg: 'bg-[#22c55e]/15 text-[#86efac] border-[#22c55e]/55',
        handSec: '#facc15',
        handMin: '#4ade80',
        handHr: '#22c55e',
        dialBg: '#041407',
        dialBorder: '#4ade80',
        flipCard: 'bg-[#051809] text-[#4ade80] border-[#22c55e]/60 shadow-emerald-950/60',
        progressBar: 'bg-gradient-to-r from-[#16a34a] via-[#4ade80] to-[#facc15]',
        subText: 'text-emerald-200/80',
        dialTickMajor: '#4ade80',
        dialTickMinor: 'rgba(74,222,128,0.32)',
        dialNumColor: '#bbf7d0',
      };
    case 'ironman':
      return {
        bg: 'bg-[#050912]',
        clockText: 'text-[#7dd3fc] drop-shadow-[0_0_32px_rgba(56,189,248,0.9)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.22),rgba(245,158,11,0.1)_52%,rgba(220,38,38,0.06)_76%,transparent_85%)]',
        accent: 'text-[#fbbf24]',
        border: 'border-[#38bdf8]/60',
        badgeBg: 'bg-sky-500/15 text-sky-200 border-amber-400/55',
        handSec: '#ef4444',
        handMin: '#7dd3fc',
        handHr: '#fbbf24',
        dialBg: '#060d1a',
        dialBorder: '#38bdf8',
        flipCard: 'bg-[#081224] text-[#bae6fd] border-[#38bdf8]/60 shadow-sky-500/25',
        progressBar: 'bg-gradient-to-r from-[#ef4444] via-[#fbbf24] to-[#38bdf8]',
        subText: 'text-sky-200/80',
        dialTickMajor: '#7dd3fc',
        dialTickMinor: 'rgba(251,191,36,0.35)',
        dialNumColor: '#e0f2fe',
      };
    case 'starwars':
      return {
        bg: 'bg-[#03050a]',
        clockText: 'text-[#facc15] drop-shadow-[0_0_26px_rgba(250,204,21,0.75)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.16),rgba(239,68,68,0.12)_52%,transparent_78%)]',
        accent: 'text-[#38bdf8]',
        border: 'border-[#facc15]/55',
        badgeBg: 'bg-amber-400/15 text-[#fde047] border-amber-400/55',
        handSec: '#ff1e38',
        handMin: '#38bdf8',
        handHr: '#facc15',
        dialBg: '#040710',
        dialBorder: '#facc15',
        flipCard: 'bg-[#070a14] text-[#fde047] border-[#facc15]/55 shadow-amber-500/20',
        progressBar: 'bg-gradient-to-r from-[#38bdf8] via-[#facc15] to-[#ff1e38]',
        subText: 'text-slate-300',
        dialTickMajor: '#facc15',
        dialTickMinor: 'rgba(56,189,248,0.34)',
        dialNumColor: '#fef08a',
      };
    case 'matrix_neo':
      return {
        bg: 'bg-[#010904]',
        clockText: 'edition-matrix-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(0,255,102,0.2),transparent_74%)]',
        accent: 'text-[#86efac]',
        border: 'border-[#00ff66]/55',
        badgeBg: 'bg-[#00ff66]/15 text-[#86efac] border-[#00ff66]/55',
        handSec: '#ffffff',
        handMin: '#00ff66',
        handHr: '#16a34a',
        dialBg: '#020e06',
        dialBorder: '#00ff66',
        flipCard: 'bg-[#031308] text-[#00ff66] border-[#00ff66]/60 shadow-[#00ff66]/25',
        progressBar: 'bg-gradient-to-r from-[#15803d] via-[#00ff66] to-[#bbf7d0]',
        subText: 'text-emerald-200/80',
        dialTickMajor: '#00ff66',
        dialTickMinor: 'rgba(0,255,102,0.3)',
        dialNumColor: '#dcfce7',
      };
    case 'batman':
      return {
        bg: 'bg-[#050608]',
        clockText: 'text-[#e2e8f0] drop-shadow-[0_0_24px_rgba(251,191,36,0.45)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.16),rgba(100,116,139,0.1)_52%,transparent_76%)]',
        accent: 'text-[#fbbf24]',
        border: 'border-amber-400/45',
        badgeBg: 'bg-amber-400/15 text-amber-300 border-amber-400/50',
        handSec: '#fbbf24',
        handMin: '#e2e8f0',
        handHr: '#94a3b8',
        dialBg: '#080a0e',
        dialBorder: '#fbbf24',
        flipCard: 'bg-[#0b0d12] text-[#f8fafc] border-amber-400/50 shadow-black/80',
        progressBar: 'bg-gradient-to-r from-[#475569] via-[#94a3b8] to-[#fbbf24]',
        subText: 'text-slate-300',
        dialTickMajor: '#fbbf24',
        dialTickMinor: 'rgba(148,163,184,0.34)',
        dialNumColor: '#f1f5f9',
      };
    case 'invincible':
      return {
        bg: 'bg-gradient-to-br from-[#005ae0] via-[#0082f3] to-[#0047b3]',
        clockText: 'edition-invincible-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,230,0,0.22),transparent_72%)]',
        accent: 'text-[#ffe600]',
        border: 'border-[#020617] ring-2 ring-[#ffe600]/80',
        badgeBg: 'bg-[#ffe600] text-[#020617] border-[#020617] font-black shadow-[2px_2px_0_#020617]',
        handSec: '#ef4444',
        handMin: '#ffe600',
        handHr: '#38bdf8',
        dialBg: '#0066e6',
        dialBorder: '#ffe600',
        flipCard: 'bg-[#020617] text-[#ffe600] border-[#ffe600] shadow-[4px_6px_0_#020617]',
        progressBar: 'bg-gradient-to-r from-[#ffe600] via-[#facc15] to-[#ef4444]',
        subText: 'text-sky-100',
        dialTickMajor: '#ffe600',
        dialTickMinor: 'rgba(255,255,255,0.48)',
        dialNumColor: '#ffffff',
      };
    case 'cyberpunk':
      return {
        bg: 'bg-[#090910]',
        clockText: 'edition-cyberpunk-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(252,238,10,0.14),rgba(0,240,255,0.08)_45%,transparent_75%)]',
        accent: 'text-[#00f0ff]',
        border: 'border-[#fcee0a]/60',
        badgeBg: 'bg-[#fcee0a]/15 text-[#fcee0a] border-[#fcee0a]/60',
        handSec: '#ff003c',
        handMin: '#00f0ff',
        handHr: '#fcee0a',
        dialBg: '#0b0c16',
        dialBorder: '#fcee0a',
        flipCard: 'bg-[#12121e] text-[#fcee0a] border-[#00f0ff]/60 shadow-[#00f0ff]/20',
        progressBar: 'bg-gradient-to-r from-[#fcee0a] via-[#00f0ff] to-[#ff003c]',
        subText: 'text-cyan-200/85',
        dialTickMajor: '#fcee0a',
        dialTickMinor: 'rgba(0,240,255,0.34)',
        dialNumColor: '#fcee0a',
      };
    case 'dune':
      return {
        bg: 'bg-gradient-to-b from-[#160e07] via-[#261608] to-[#3b210b]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-b from-[#fef3c7] via-[#f59e0b] to-[#b45309] drop-shadow-[0_0_32px_rgba(245,158,11,0.55)]',
        glow: 'bg-[radial-gradient(ellipse_at_50%_70%,rgba(245,158,11,0.22),rgba(56,189,248,0.08)_55%,transparent_78%)]',
        accent: 'text-[#38bdf8]',
        border: 'border-amber-500/40',
        badgeBg: 'bg-amber-500/15 text-amber-200 border-amber-400/40',
        handSec: '#38bdf8',
        handMin: '#fbbf24',
        handHr: '#d97706',
        dialBg: '#1c1108',
        dialBorder: '#d97706',
        flipCard: 'bg-[#211409] text-amber-200 border-amber-500/45 shadow-amber-950/60',
        progressBar: 'bg-gradient-to-r from-amber-700 via-amber-400 to-sky-400',
        subText: 'text-amber-200/75',
        dialTickMajor: '#fde68a',
        dialTickMinor: 'rgba(251,191,36,0.32)',
        dialNumColor: '#fef3c7',
      };
    case 'doomsday':
      return {
        bg: 'bg-[#090a0d]',
        clockText: 'text-[#ff3b1f] drop-shadow-[0_0_34px_rgba(255,59,31,0.85)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.2),rgba(245,158,11,0.08)_48%,transparent_75%)]',
        accent: 'text-[#f59e0b]',
        border: 'border-red-600/55',
        badgeBg: 'bg-red-600/20 text-red-300 border-red-500/60',
        handSec: '#ff2a00',
        handMin: '#f59e0b',
        handHr: '#94a3b8',
        dialBg: '#111317',
        dialBorder: '#ef4444',
        flipCard: 'bg-[#14171c] text-[#ff4d2e] border-red-600/50 shadow-red-950/60',
        progressBar: 'bg-gradient-to-r from-amber-500 via-red-600 to-red-500',
        subText: 'text-slate-300',
        dialTickMajor: '#f8fafc',
        dialTickMinor: 'rgba(248,250,252,0.28)',
        dialNumColor: '#f1f5f9',
      };
    case 'spiderverse':
      return {
        bg: 'bg-gradient-to-br from-[#0c0521] via-[#170936] to-[#080d22]',
        clockText: 'edition-spiderverse-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,42,133,0.22),rgba(0,245,255,0.14)_52%,transparent_76%)]',
        accent: 'text-[#00f5ff]',
        border: 'border-[#ff2a85]/60',
        badgeBg: 'bg-[#ff2a85]/20 text-[#ff85b8] border-[#00f5ff]/55',
        handSec: '#ff2a85',
        handMin: '#00f5ff',
        handHr: '#facc15',
        dialBg: '#110729',
        dialBorder: '#ff2a85',
        flipCard: 'bg-[#140933] text-white border-[#00f5ff]/60 shadow-[#ff2a85]/35',
        progressBar: 'bg-gradient-to-r from-[#00f5ff] via-[#ff2a85] to-[#facc15]',
        subText: 'text-fuchsia-200/85',
        dialTickMajor: '#00f5ff',
        dialTickMinor: 'rgba(255,42,133,0.42)',
        dialNumColor: '#ffffff',
      };
    case 'evangelion':
      return {
        bg: 'bg-[#050302]',
        clockText: 'text-[#ff7b00] drop-shadow-[0_0_32px_rgba(255,106,0,0.9)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.18),rgba(255,30,39,0.08)_50%,transparent_75%)]',
        accent: 'text-[#39ff14]',
        border: 'border-[#ff6a00]/65',
        badgeBg: 'bg-[#ff6a00]/15 text-[#ff8c26] border-[#ff6a00]/60',
        handSec: '#ff1e27',
        handMin: '#ff7b00',
        handHr: '#39ff14',
        dialBg: '#090503',
        dialBorder: '#ff6a00',
        flipCard: 'bg-[#0e0703] text-[#ff7b00] border-[#ff6a00]/65 shadow-[#ff6a00]/25',
        progressBar: 'bg-gradient-to-r from-[#39ff14] via-[#ff7b00] to-[#ff1e27]',
        subText: 'text-orange-200/80',
        dialTickMajor: '#ff7b00',
        dialTickMinor: 'rgba(255,106,0,0.34)',
        dialNumColor: '#ff9433',
      };
    case 'tron':
      return {
        bg: 'bg-[#020710]',
        clockText: 'text-[#67f8ff] drop-shadow-[0_0_32px_rgba(0,242,255,0.9)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(0,242,255,0.16),rgba(255,107,0,0.06)_52%,transparent_76%)]',
        accent: 'text-[#ff7b1a]',
        border: 'border-[#00f2ff]/55',
        badgeBg: 'bg-[#00f2ff]/12 text-[#7cf9ff] border-[#00f2ff]/50',
        handSec: '#ff6b00',
        handMin: '#00f2ff',
        handHr: '#38bdf8',
        dialBg: '#030b17',
        dialBorder: '#00f2ff',
        flipCard: 'bg-[#040f1f] text-[#7cf9ff] border-[#00f2ff]/60 shadow-[#00f2ff]/25',
        progressBar: 'bg-gradient-to-r from-[#00f2ff] via-[#38bdf8] to-[#ff6b00]',
        subText: 'text-cyan-200/80',
        dialTickMajor: '#00f2ff',
        dialTickMinor: 'rgba(0,242,255,0.3)',
        dialNumColor: '#a5f3fc',
      };
    case 'akira':
    default:
      return {
        bg: 'bg-[#0c0407]',
        clockText: 'text-[#ff2a4b] drop-shadow-[0_0_32px_rgba(239,35,60,0.9)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(239,35,60,0.22),rgba(251,191,36,0.08)_50%,transparent_76%)]',
        accent: 'text-[#fbbf24]',
        border: 'border-[#ef233c]/60',
        badgeBg: 'bg-[#ef233c]/20 text-rose-200 border-[#ef233c]/60',
        handSec: '#ef233c',
        handMin: '#fbbf24',
        handHr: '#14b8a6',
        dialBg: '#13060a',
        dialBorder: '#ef233c',
        flipCard: 'bg-[#19080e] text-[#fbbf24] border-[#ef233c]/65 shadow-[#ef233c]/30',
        progressBar: 'bg-gradient-to-r from-[#ef233c] via-[#f97316] to-[#fbbf24]',
        subText: 'text-rose-200/80',
        dialTickMajor: '#fbbf24',
        dialTickMinor: 'rgba(239,35,60,0.38)',
        dialNumColor: '#fde68a',
      };
  }
};

export const CinemaEditionGlyph: React.FC<{ edition: ClockEdition; className?: string }> = ({
  edition,
  className = 'w-4 h-4 shrink-0',
}) => {
  switch (edition) {
    case 'gta6':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="#1d062d" stroke="#ff2e93" strokeWidth="1.3" />
          <circle cx="10" cy="11.5" r="4.8" fill="#ff8c42" fillOpacity="0.85" />
          <line x1="5.2" y1="12.5" x2="14.8" y2="12.5" stroke="#1d062d" strokeWidth="1" />
          {/* Iconic palm trunk + coconut crown silhouette */}
          <path d="M 10.2 16 Q 11.2 12.2 10.5 8.5" stroke="#00f5d4" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 10.5 8.5 Q 7 6.8 5 9 M 10.5 8.5 Q 8 5.2 6.5 5.2 M 10.5 8.5 Q 14 6.8 16 9 M 10.5 8.5 Q 13 5.2 14.5 5.4" stroke="#00f5d4" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="9.6" cy="9.4" r="0.9" fill="#451a03" stroke="#fde047" strokeWidth="0.4" />
          <circle cx="11.2" cy="9.4" r="0.9" fill="#451a03" stroke="#fde047" strokeWidth="0.4" />
        </svg>
      );
    case 'minecraft':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <rect x="2.5" y="2.5" width="15" height="15" rx="2" fill="#22c55e" stroke="#052e16" strokeWidth="1.4" />
          <rect x="5" y="5.5" width="3.5" height="3.5" fill="#052e16" />
          <rect x="11.5" y="5.5" width="3.5" height="3.5" fill="#052e16" />
          <rect x="8.2" y="9" width="3.6" height="3.2" fill="#052e16" />
          <rect x="6.5" y="10.8" width="1.9" height="4.5" fill="#052e16" />
          <rect x="11.6" y="10.8" width="1.9" height="4.5" fill="#052e16" />
        </svg>
      );
    case 'persona5':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <polygon points="3,5 17,2.8 15,15.5 2,17.2" fill="#dc2626" stroke="#ffffff" strokeWidth="1.2" />
          <polygon points="10,5.2 11.8,8.8 15.6,9.2 12.6,11.6 13.4,15.2 10,13.2 6.6,15.2 7.4,11.6 4.4,9.2 8.2,8.8" fill="#050505" stroke="#ffffff" strokeWidth="0.8" />
        </svg>
      );
    case 'eldenring':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="7.5" r="4.2" stroke="#fbbf24" strokeWidth="1.2" />
          <circle cx="7.4" cy="11.5" r="4" stroke="#f59e0b" strokeWidth="1.15" />
          <circle cx="12.6" cy="11.5" r="4" stroke="#fef08a" strokeWidth="1.15" />
          <line x1="10" y1="2.8" x2="10" y2="17.2" stroke="#fef3c7" strokeWidth="1.15" />
        </svg>
      );
    case 'godofwar':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="#0b1220" stroke="#38bdf8" strokeWidth="1.2" />
          <path d="M 5.6 14.2 H 8.2 V 12.4 A 4.4 4.4 0 1 1 11.8 12.4 V 14.2 H 14.4" stroke="#ef4444" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'zelda_totk':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <polygon points="10,3.2 13.4,9.4 6.6,9.4" fill="#facc15" />
          <polygon points="6.6,9.4 10,15.6 3.2,15.6" fill="#facc15" />
          <polygon points="13.4,9.4 16.8,15.6 10,15.6" fill="#facc15" />
          <circle cx="10" cy="11.6" r="1.4" fill="#06b6d4" />
        </svg>
      );
    case 'halo_unsc':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <polygon points="5.5,3.5 14.5,3.5 17.5,9.5 14.5,16.5 5.5,16.5 2.5,9.5" fill="#0b1523" stroke="#38bdf8" strokeWidth="1.2" />
          <polygon points="6.5,7 13.5,7 15,10 12.8,13 7.2,13 5,10" fill="#fbbf24" stroke="#fef3c7" strokeWidth="0.9" />
        </svg>
      );
    case 'pacman':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <rect x="2" y="2" width="16" height="16" rx="3" fill="#03071d" stroke="#2563eb" strokeWidth="1.3" />
          <path d="M 9.8 10 L 14.5 6.8 A 5.6 5.6 0 1 0 14.5 13.2 Z" fill="#facc15" />
          <circle cx="15.8" cy="10" r="1.3" fill="#ffffff" />
        </svg>
      );
    case 'ben10':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="#09140b" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="5.2,5.2 14.8,5.2 10,10" fill="#65ff00" />
          <polygon points="5.2,14.8 14.8,14.8 10,10" fill="#65ff00" />
          <circle cx="10" cy="10" r="7.2" stroke="#65ff00" strokeOpacity="0.6" strokeWidth="0.9" />
        </svg>
      );
    case 'jjk':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="7.4" cy="10" r="5" fill="#00e5ff" fillOpacity="0.45" stroke="#38bdf8" strokeWidth="1.1" />
          <circle cx="12.6" cy="10" r="5" fill="#ff2a55" fillOpacity="0.45" stroke="#ff2a55" strokeWidth="1.1" />
          <circle cx="10" cy="10" r="2.8" fill="#c084fc" />
        </svg>
      );
    case 'demonslayer':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <rect x="2.5" y="2.5" width="15" height="15" rx="3" fill="#09090b" stroke="#f97316" strokeWidth="1.3" />
          <rect x="3.5" y="3.5" width="6.5" height="6.5" fill="#10b981" />
          <rect x="10" y="10" width="6.5" height="6.5" fill="#10b981" />
          <line x1="4" y1="16" x2="16" y2="4" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'naruto':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.6" fill="#dc2626" fillOpacity="0.32" stroke="#ef4444" strokeWidth="1.4" />
          <circle cx="10" cy="10" r="4.6" stroke="#18181b" strokeWidth="1" />
          <circle cx="10" cy="10" r="1.6" fill="#09090b" />
          <circle cx="10" cy="5.4" r="1.2" fill="#fde047" />
          <circle cx="14" cy="12.3" r="1.2" fill="#fde047" />
          <circle cx="6" cy="12.3" r="1.2" fill="#fde047" />
        </svg>
      );
    case 'dragonball':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.8" fill="#f59e0b" stroke="#fde047" strokeWidth="1.3" />
          <circle cx="7.8" cy="7.8" r="1.1" fill="#dc2626" />
          <circle cx="12.2" cy="7.8" r="1.1" fill="#dc2626" />
          <circle cx="7.8" cy="12.2" r="1.1" fill="#dc2626" />
          <circle cx="12.2" cy="12.2" r="1.1" fill="#dc2626" />
        </svg>
      );
    case 'onepiece':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.6" fill="#071a30" stroke="#fbbf24" strokeWidth="1.4" />
          <polygon points="10,4 11.8,10 10,16 8.2,10" fill="#ef4444" />
          <polygon points="4,10 10,8.2 16,10 10,11.8" fill="#38bdf8" />
          <circle cx="10" cy="10" r="1.5" fill="#fef08a" />
        </svg>
      );
    case 'aot':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <path d="M 3 5 L 10 8.5 L 17 5 L 13.5 14.5 L 10 12 L 6.5 14.5 Z" fill="#059669" stroke="#e2e8f0" strokeWidth="1.2" strokeLinejoin="round" />
          <line x1="10" y1="3.5" x2="10" y2="16.5" stroke="#facc15" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'pokemon':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <path d="M 2.4 10 A 7.6 7.6 0 0 1 17.6 10 Z" fill="#ef4444" />
          <path d="M 2.4 10 A 7.6 7.6 0 0 0 17.6 10 Z" fill="#f8fafc" />
          <circle cx="10" cy="10" r="7.6" stroke="#0f172a" strokeWidth="1.4" />
          <line x1="2.4" y1="10" x2="17.6" y2="10" stroke="#0f172a" strokeWidth="1.6" />
          <circle cx="10" cy="10" r="2.4" fill="#ffffff" stroke="#0f172a" strokeWidth="1.3" />
          <circle cx="10" cy="10" r="1" fill="#38bdf8" />
        </svg>
      );
    case 'strangerthings':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <rect x="2" y="2" width="16" height="16" rx="3" fill="#090204" stroke="#dc2626" strokeWidth="1.3" />
          <line x1="4" y1="6" x2="16" y2="6" stroke="#ff1e2d" strokeWidth="1.8" strokeLinecap="round" />
          <polygon points="10,7.8 12.6,10 10,12.2 7.4,10" fill="#ff1e2d" />
          <line x1="4" y1="14" x2="16" y2="14" stroke="#ff1e2d" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'arcane':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <polygon points="10,2.2 16.8,6.1 16.8,13.9 10,17.8 3.2,13.9 3.2,6.1" fill="#070e1c" stroke="#fbbf24" strokeWidth="1.3" />
          <circle cx="10" cy="10" r="3.6" stroke="#38bdf8" strokeWidth="1.3" />
          <circle cx="10" cy="10" r="1.4" fill="#ec4899" />
        </svg>
      );
    case 'doctorwho':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="#081a3d" stroke="#fbbf24" strokeWidth="1.3" />
          <circle cx="8.2" cy="9" r="3.5" stroke="#93c5fd" strokeWidth="1.1" />
          <circle cx="12.2" cy="11.2" r="2.6" stroke="#fbbf24" strokeWidth="1.1" />
          <circle cx="10" cy="10" r="1.2" fill="#fef3c7" />
        </svg>
      );
    case 'fallout':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="6.4" fill="#041407" stroke="#4ade80" strokeWidth="2.4" strokeDasharray="2.4 1.6" />
          <circle cx="10" cy="10" r="3.4" stroke="#facc15" strokeWidth="1.3" />
          <circle cx="10" cy="10" r="1.2" fill="#4ade80" />
        </svg>
      );
    case 'ironman':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.6" fill="#060d1a" stroke="#fbbf24" strokeWidth="1.3" />
          <polygon points="5.5,7 14.5,7 10,15" fill="#38bdf8" fillOpacity="0.35" stroke="#7dd3fc" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="10" cy="9.8" r="1.4" fill="#ffffff" />
        </svg>
      );
    case 'starwars':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.8" fill="#040710" stroke="#facc15" strokeWidth="1.2" />
          <line x1="5" y1="15" x2="15" y2="5" stroke="#38bdf8" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="5" y1="5" x2="15" y2="15" stroke="#ff1e38" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case 'matrix_neo':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <rect x="2.5" y="2.5" width="15" height="15" rx="3" fill="#020e06" stroke="#00ff66" strokeWidth="1.3" />
          <line x1="6.5" y1="5" x2="6.5" y2="13" stroke="#00ff66" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="10" y1="4.5" x2="10" y2="15.5" stroke="#86efac" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="13.5" y1="6.5" x2="13.5" y2="14" stroke="#00ff66" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'batman':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <ellipse cx="10" cy="10" rx="8" ry="6" fill="#fbbf24" stroke="#090b10" strokeWidth="1.2" />
          <path d="M 3.8 10 Q 7 7 8.8 8.8 L 10 6.8 L 11.2 8.8 Q 13 7 16.2 10 Q 13 11.2 10 13.4 Q 7 11.2 3.8 10 Z" fill="#090b10" />
        </svg>
      );
    case 'invincible':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <rect x="2" y="2" width="16" height="16" rx="4" fill="#0077ff" stroke="#020617" strokeWidth="1.4" />
          <path d="M 4.5 6.5 H 15.5 L 13.5 9.8 H 6.5 Z" fill="#ffe600" stroke="#020617" strokeWidth="0.9" />
          <rect x="8.3" y="10.2" width="3.4" height="5.5" rx="0.6" fill="#ffe600" stroke="#020617" strokeWidth="0.9" />
          <circle cx="15.4" cy="14.5" r="1.2" fill="#ef4444" />
        </svg>
      );
    case 'cyberpunk':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <polygon points="5,2 18,2 18,15 15,18 2,18 2,5" fill="#0c0c16" stroke="#fcee0a" strokeWidth="1.4" />
          <path d="M 5.5 8.5 H 14.5 L 12.5 12.2 H 7.5 Z" fill="#00f0ff" fillOpacity="0.85" />
          <line x1="5" y1="15" x2="13.5" y2="15" stroke="#ff003c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'dune':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="9.2" r="5.6" fill="#f59e0b" fillOpacity="0.28" stroke="#fbbf24" strokeWidth="1.3" />
          <path d="M 3 14.8 Q 10 11 17 14.8" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="10" cy="9.2" r="1.8" fill="#38bdf8" />
        </svg>
      );
    case 'doomsday':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.8" fill="#111317" stroke="#ef4444" strokeWidth="1.4" />
          <path d="M 10 2.2 A 7.8 7.8 0 0 0 4.5 4.5 L 10 10 Z" fill="#ef4444" fillOpacity="0.65" />
          <line x1="10" y1="10" x2="8.2" y2="4.4" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="1.5" fill="#ffffff" />
        </svg>
      );
    case 'spiderverse':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.6" stroke="#00f5ff" strokeWidth="1.2" />
          <circle cx="10" cy="10" r="4.2" stroke="#ff2a85" strokeWidth="1.1" />
          <line x1="10" y1="2.4" x2="10" y2="17.6" stroke="#ff2a85" strokeWidth="0.9" />
          <line x1="2.4" y1="10" x2="17.6" y2="10" stroke="#00f5ff" strokeWidth="0.9" />
          <line x1="4.6" y1="4.6" x2="15.4" y2="15.4" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.8" />
          <line x1="15.4" y1="4.6" x2="4.6" y2="15.4" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.8" />
        </svg>
      );
    case 'evangelion':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <polygon points="10,2 17,6 17,14 10,18 3,14 3,6" fill="#090503" stroke="#ff6a00" strokeWidth="1.4" />
          <polygon points="10,5.2 14.2,7.6 14.2,12.4 10,14.8 5.8,12.4 5.8,7.6" stroke="#ff1e27" strokeWidth="1.1" />
          <circle cx="10" cy="10" r="1.6" fill="#39ff14" />
        </svg>
      );
    case 'tron':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.6" stroke="#00f2ff" strokeWidth="1.6" />
          <circle cx="10" cy="10" r="4.4" stroke="#00f2ff" strokeOpacity="0.7" strokeWidth="1.2" strokeDasharray="6 3" />
          <circle cx="10" cy="10" r="1.6" fill="#ff6b00" />
        </svg>
      );
    case 'akira':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="#19080e" stroke="#ef233c" strokeWidth="1.5" />
          <path d="M 4.5 13 A 6 6 0 1 1 15.5 13" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="10" y1="10" x2="14.5" y2="6.5" stroke="#ef233c" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case 'classic':
    default:
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.4" />
          <path d="M 10 3.5 L 11.8 8.2 L 16.5 10 L 11.8 11.8 L 10 16.5 L 8.2 11.8 L 3.5 10 L 8.2 8.2 Z" fill="currentColor" />
        </svg>
      );
  }
};

export const ClockEditionOverlay: React.FC<{ edition: ClockEdition; isFullscreen: boolean }> = React.memo(({
  edition,
  isFullscreen,
}) => {
  if (edition === 'classic') return null;

  return (
    <div
      data-testid="clock-edition-overlay"
      data-edition-active={edition}
      className="absolute inset-0 pointer-events-none select-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* GTA 6 VICE CITY: Neon Tropical Twilight Border, Striped Sunset & Swaying Coconut Palm Silhouettes */}
      {edition === 'gta6' && (
        <>
          <div className="absolute inset-3 rounded-2xl border-2 border-[#ff2e93]/55 shadow-[inset_0_0_46px_rgba(255,46,147,0.16)]" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#ff2e93] via-[#ff8c42] to-[#00f5d4] opacity-90" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-75">
            {/* Warm Vice City Sliced Sunset Orb on Lower Horizon */}
            <circle cx="400" cy="470" r="145" fill="#ff8c42" fillOpacity="0.18" stroke="#ff2e93" strokeOpacity="0.4" strokeWidth="1.4" />
            <line x1="255" y1="425" x2="545" y2="425" stroke="#160423" strokeWidth="4" strokeOpacity="0.55" />
            <line x1="275" y1="448" x2="525" y2="448" stroke="#160423" strokeWidth="5" strokeOpacity="0.6" />
            <line x1="305" y1="472" x2="495" y2="472" stroke="#160423" strokeWidth="6" strokeOpacity="0.65" />

            {/* Left Foreground Coconut Palm Tree (with Clustered Coconuts!) */}
            <g fill="#090214" stroke="#ff2e93" strokeOpacity="0.65" strokeWidth="1.2">
              <path d="M 38 505 Q 52 385 88 265 L 97 268 Q 68 388 62 505 Z" />
              {/* Coconuts clustered under fronds */}
              <circle cx="88" cy="272" r="7.2" fill="#2a0a28" stroke="#fde047" strokeWidth="1.1" />
              <circle cx="99" cy="274" r="6.8" fill="#2a0a28" stroke="#fde047" strokeWidth="1.1" />
              <circle cx="93" cy="282" r="6.5" fill="#2a0a28" stroke="#ff8c42" strokeWidth="1" />
              {/* Sweeping Palm Fronds */}
              <path d="M 92 266 Q 48 228 12 248 Q 52 248 92 266 Z" fill="#140424" />
              <path d="M 92 266 Q 55 198 22 184 Q 65 212 92 266 Z" fill="#140424" />
              <path d="M 92 266 Q 94 195 112 162 Q 112 208 92 266 Z" fill="#140424" />
              <path d="M 92 266 Q 135 206 168 214 Q 134 228 92 266 Z" fill="#140424" />
              <path d="M 92 266 Q 138 242 165 272 Q 130 264 92 266 Z" fill="#140424" />
            </g>

            {/* Right Foreground Twin Coconut Palm Trees */}
            <g fill="#090214" stroke="#00f5d4" strokeOpacity="0.6" strokeWidth="1.2">
              <path d="M 762 505 Q 748 390 714 252 L 704 256 Q 730 392 736 505 Z" />
              {/* Coconuts clustered under right crown */}
              <circle cx="712" cy="260" r="7.2" fill="#0d182b" stroke="#00f5d4" strokeWidth="1.1" />
              <circle cx="701" cy="263" r="6.8" fill="#0d182b" stroke="#fde047" strokeWidth="1.1" />
              <circle cx="708" cy="271" r="6.4" fill="#0d182b" stroke="#ff2e93" strokeWidth="1" />
              {/* Sweeping Palm Fronds */}
              <path d="M 709 254 Q 752 216 790 236 Q 748 236 709 254 Z" fill="#0b1526" />
              <path d="M 709 254 Q 746 186 778 172 Q 736 200 709 254 Z" fill="#0b1526" />
              <path d="M 709 254 Q 706 182 686 150 Q 688 196 709 254 Z" fill="#0b1526" />
              <path d="M 709 254 Q 664 196 632 204 Q 666 218 709 254 Z" fill="#0b1526" />
              <path d="M 709 254 Q 662 232 636 262 Q 672 254 709 254 Z" fill="#0b1526" />
            </g>
          </svg>
          {/* Top-Right 5 Wanted Stars Emblem (crisp SVG stars, zero emojis) */}
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-extrabold uppercase tracking-[0.26em] text-[#00f5d4]/85">
              <span>VICE CITY // LEONIDA VI</span>
              <span className="flex items-center gap-1 text-[#fde047]">
                <span>WANTED</span>
                {Array.from({ length: 5 }).map((_, sIdx) => (
                  <svg key={sIdx} viewBox="0 0 12 12" className="w-2.5 h-2.5 fill-current">
                    <polygon points="6,1 7.5,4.2 11,4.6 8.4,7 9.1,10.5 6,8.8 2.9,10.5 3.6,7 1,4.6 4.5,4.2" />
                  </svg>
                ))}
              </span>
            </div>
          )}
        </>
      )}

      {/* MINECRAFT: Pixel Grass Block Horizon Trim, Voxel Corner Creeper Emblems & Diamond Frame */}
      {edition === 'minecraft' && (
        <>
          <div className="edition-grass-top absolute top-0 inset-x-0 h-3.5 opacity-95 border-b-2 border-[#052e16]" />
          <div className="absolute inset-3.5 border-2 border-[#22c55e]/50 shadow-[inset_0_0_26px_rgba(34,197,94,0.14)]" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-40">
            {/* Top-Left Voxel Creeper Watermark */}
            <g transform="translate(26,34)">
              <rect x="0" y="0" width="38" height="38" fill="#14532d" stroke="#4ade80" strokeWidth="1.8" />
              <rect x="6" y="8" width="9" height="9" fill="#052e16" />
              <rect x="23" y="8" width="9" height="9" fill="#052e16" />
              <rect x="14" y="17" width="10" height="8" fill="#052e16" />
              <rect x="10" y="21" width="5" height="11" fill="#052e16" />
              <rect x="23" y="21" width="5" height="11" fill="#052e16" />
            </g>
            {/* Top-Right Voxel Diamond Pick/Gem Motif */}
            <g transform="translate(736,34)">
              <rect x="0" y="0" width="38" height="38" fill="#083344" stroke="#22d3ee" strokeWidth="1.8" />
              <polygon points="19,6 30,19 19,32 8,19" fill="#22d3ee" fillOpacity="0.65" stroke="#cffafe" strokeWidth="1.4" />
            </g>
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-[#4ade80]/80">
              <span>OVERWORLD // CHUNK X:0 Z:0</span>
              <span className="text-[#22d3ee]/85">LVL 30 XP CALIBRATED</span>
            </div>
          )}
        </>
      )}

      {/* PERSONA 5: Stark Crimson/Black/White Skewed Comic Cut-In Panels & Phantom Stars */}
      {edition === 'persona5' && (
        <>
          <div className="edition-halftone-dark absolute inset-0 opacity-65" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-85">
            {/* Razor Tilted Corner Cut-Ins */}
            <polygon points="0,0 165,0 0,92" fill="#dc2626" fillOpacity="0.88" />
            <polygon points="0,0 132,0 0,68" fill="#050505" />
            <polygon points="800,500 620,500 800,400" fill="#dc2626" fillOpacity="0.88" />
            <polygon points="800,500 660,500 800,425" fill="#ffffff" fillOpacity="0.92" />
            {/* Skewed Frame Borders */}
            <polygon points="22,22 784,14 776,478 14,486" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" />
            <polygon points="28,28 778,20 770,472 20,480" fill="none" stroke="#dc2626" strokeOpacity="0.7" strokeWidth="1.4" />
            {/* Phantom Thief 5-Pointed Rebel Star */}
            <polygon points="62,24 68,38 83,38 71,47 76,61 62,53 48,61 53,47 41,38 56,38" fill="#ffffff" stroke="#050505" strokeWidth="1.5" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-black uppercase tracking-[0.26em] text-white/85">
              <span>SHIBUYA // TAKE YOUR TIME</span>
              <span className="bg-black px-2 py-0.5 border border-white/70 text-[#ef4444]">PHANTOM THIEVES</span>
            </div>
          )}
        </>
      )}

      {/* ELDEN RING: Interlocking Golden Order Great Runes & Erdtree Grace Halo */}
      {edition === 'eldenring' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-[#d97706]/45 shadow-[inset_0_0_48px_rgba(251,191,36,0.12)]" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-45">
            {/* Interlocking Elden Ring Arcs Centered */}
            <circle cx="400" cy="185" r="78" fill="none" stroke="#fbbf24" strokeOpacity="0.45" strokeWidth="1.8" />
            <circle cx="352" cy="252" r="74" fill="none" stroke="#f59e0b" strokeOpacity="0.38" strokeWidth="1.6" />
            <circle cx="448" cy="252" r="74" fill="none" stroke="#fef08a" strokeOpacity="0.38" strokeWidth="1.6" />
            <circle cx="400" cy="308" r="66" fill="none" stroke="#d97706" strokeOpacity="0.32" strokeWidth="1.4" />
            {/* Vertical Elden Rune Spear & Basin Arc */}
            <line x1="400" y1="68" x2="400" y2="412" stroke="#fef3c7" strokeOpacity="0.52" strokeWidth="2" />
            <path d="M 305 152 Q 400 220 495 152" fill="none" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.8" />
            <path d="M 285 338 Q 400 402 515 338" fill="none" stroke="#f59e0b" strokeOpacity="0.42" strokeWidth="1.8" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.28em] text-[#fbbf24]/80">
              <span>THE LANDS BETWEEN</span>
              <span className="text-amber-200/75">GREAT RUNE AWAKENED</span>
            </div>
          )}
        </>
      )}

      {/* GOD OF WAR RAGNAROK: Nordic Omega Seals & Dual Frost/Leviathan Frame */}
      {edition === 'godofwar' && (
        <>
          <div className="absolute inset-3.5 rounded-xl border border-[#38bdf8]/40 shadow-[inset_0_0_40px_rgba(56,189,248,0.14)]" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-55">
            {/* Nordic Dual Rim Arc */}
            <circle cx="400" cy="250" r="195" fill="none" stroke="#38bdf8" strokeOpacity="0.24" strokeWidth="1.6" strokeDasharray="16 10" />
            {/* Left Leviathan Ice Crystals */}
            <polygon points="0,120 46,155 18,215 0,190" fill="#38bdf8" fillOpacity="0.16" stroke="#7dd3fc" strokeOpacity="0.45" strokeWidth="1.2" />
            <polygon points="0,380 42,340 24,290 0,310" fill="#38bdf8" fillOpacity="0.16" stroke="#7dd3fc" strokeOpacity="0.45" strokeWidth="1.2" />
            {/* Right Chaos Spartan Rage Omega Badge */}
            <path d="M 730 282 H 752 V 268 A 28 28 0 1 1 776 268 V 282 H 796" fill="none" stroke="#ef4444" strokeOpacity="0.55" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 4 282 H 26 V 268 A 28 28 0 1 1 50 268 V 282 H 70" fill="none" stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.26em] text-[#7dd3fc]/80">
              <span>NINE REALMS // FIMBULWINTER</span>
              <span className="text-[#ef4444]/85">SPARTAN OMEGA SEAL</span>
            </div>
          )}
        </>
      )}

      {/* ZELDA SHEIKAH: Glowing Cyan Sheikah Eye & Sacred Golden Triforce Pyramids */}
      {edition === 'zelda_totk' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-[#06b6d4]/50 shadow-[inset_0_0_36px_rgba(6,182,212,0.14)]" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-55">
            {/* Sacred Golden Triforce Pyramids Left & Right */}
            {[62, 738].map((tx, idx) => (
              <g key={idx} transform={`translate(${tx - 26}, 220)`} fill="#facc15" fillOpacity="0.28" stroke="#facc15" strokeWidth="1.4">
                <polygon points="26,0 40,24 12,24" />
                <polygon points="12,24 26,48 -2,48" />
                <polygon points="40,24 54,48 26,48" />
              </g>
            ))}
            {/* Sheikah Eye Watermark Contour Top Center */}
            <path d="M 335 72 Q 400 32 465 72 Q 400 108 335 72 Z" fill="none" stroke="#22d3ee" strokeOpacity="0.45" strokeWidth="1.6" />
            <circle cx="400" cy="72" r="11" fill="none" stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="1.5" />
            <circle cx="400" cy="72" r="4" fill="#22d3ee" fillOpacity="0.6" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.26em] text-[#22d3ee]/80">
              <span>SHEIKAH SLATE // HYRULE</span>
              <span className="text-[#facc15]/85">TRIFORCE RESONANCE</span>
            </div>
          )}
        </>
      )}

      {/* HALO MJOLNIR: Spartan Visor Contour Framing & Top Energy Shield Matrix */}
      {edition === 'halo_unsc' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-40" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-65">
            {/* Upper Mjolnir Helmet Visor Rim */}
            <path d="M 28 84 L 96 22 H 704 L 772 84" fill="none" stroke="#fbbf24" strokeOpacity="0.68" strokeWidth="2.4" />
            <path d="M 28 416 L 96 478 H 704 L 772 416" fill="none" stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="2" />
            {/* Segmented Top Shield Integrity Bar */}
            <rect x="290" y="32" width="220" height="8" rx="4" fill="#0c192c" stroke="#38bdf8" strokeWidth="1.3" />
            <rect x="294" y="34" width="212" height="4" rx="2" fill="#38bdf8" fillOpacity="0.75" />
            {/* Side Radar Reticle Chevrons */}
            <polyline points="42,225 28,250 42,275" fill="none" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.7" />
            <polyline points="758,225 772,250 758,275" fill="none" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.7" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-[#fbbf24]/80">
              <span>UNSC // MJOLNIR MK-VI</span>
              <span className="text-[#38bdf8]/85">CORTANA NEURAL SYNC</span>
            </div>
          )}
        </>
      )}

      {/* PAC-MAN ARCADE: Double-Line Neon Maze Rails, Glowing Power Pellets, Pac-Man & Blinky Ghost */}
      {edition === 'pacman' && (
        <>
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-75">
            {/* Double-Line Neon Blue Arcade Maze Frame */}
            <rect x="14" y="14" width="772" height="472" rx="14" fill="none" stroke="#2563eb" strokeWidth="2.8" />
            <rect x="21" y="21" width="758" height="458" rx="10" fill="none" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="1.4" />
            {/* Glowing Corner Power Pellets */}
            {[
              [44, 44],
              [756, 44],
              [44, 456],
              [756, 456],
            ].map(([px, py], idx) => (
              <circle key={idx} cx={px} cy={py} r="6.5" fill="#fef08a" fillOpacity="0.88" />
            ))}
            {/* Pac-Man + Pellet Trail Bottom-Left */}
            <g transform="translate(88, 442)">
              <path d="M 14 14 L 27 6 A 15 15 0 1 0 27 22 Z" fill="#facc15" />
              {[42, 62, 82].map((dx) => (
                <circle key={dx} cx={dx} cy="14" r="3.2" fill="#ffffff" fillOpacity="0.8" />
              ))}
            </g>
            {/* Blinky Arcade Ghost Silhouette Bottom-Right */}
            <g transform="translate(682, 438)">
              <path d="M 0 14 A 13 13 0 0 1 26 14 V 28 L 21 23 L 17 28 L 13 23 L 9 28 L 5 23 L 0 28 Z" fill="#f43f5e" fillOpacity="0.9" />
              <circle cx="8.5" cy="12" r="3" fill="#ffffff" />
              <circle cx="17.5" cy="12" r="3" fill="#ffffff" />
              <circle cx="7.5" cy="12" r="1.4" fill="#1d4ed8" />
              <circle cx="16.5" cy="12" r="1.4" fill="#1d4ed8" />
            </g>
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-28 items-center justify-between text-[9px] font-mono font-extrabold uppercase tracking-[0.24em] text-[#fde047]/85">
              <span>1UP // SCORE 999990</span>
              <span className="text-[#38bdf8]/90">CREDIT 01</span>
            </div>
          )}
        </>
      )}

      {/* BEN 10: Galvan Omnitrix Bezel Corner Lugs + DNA Hourglass Silhouette */}
      {edition === 'ben10' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border-2 border-[#65ff00]/45 shadow-[inset_0_0_28px_rgba(101,255,0,0.12)]" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-35">
            <polygon points="315,75 485,75 400,250" fill="#65ff00" fillOpacity="0.16" stroke="#65ff00" strokeWidth="1.4" />
            <polygon points="315,425 485,425 400,250" fill="#65ff00" fillOpacity="0.16" stroke="#65ff00" strokeWidth="1.4" />
            <polygon points="0,0 56,0 0,56" fill="#94a3b8" fillOpacity="0.35" />
            <polygon points="800,0 744,0 800,56" fill="#94a3b8" fillOpacity="0.35" />
            <polygon points="0,500 56,500 0,444" fill="#94a3b8" fillOpacity="0.35" />
            <polygon points="800,500 744,500 800,444" fill="#94a3b8" fillOpacity="0.35" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-[#84ff33]/75">
              <span>GALVAN PRIME // OMNITRIX</span>
              <span className="text-emerald-300/80">DNA SEQUENCE LOCKED</span>
            </div>
          )}
        </>
      )}

      {/* JUJUTSU KAISEN: Domain Expansion Limitless Convergence Circles & Cursed Slash Motifs */}
      {edition === 'jjk' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-[#a855f7]/45 shadow-[inset_0_0_40px_rgba(168,85,247,0.16)]" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-55">
            <circle cx="320" cy="250" r="145" fill="none" stroke="#00e5ff" strokeOpacity="0.22" strokeWidth="1.4" />
            <circle cx="480" cy="250" r="145" fill="none" stroke="#ff2a55" strokeOpacity="0.22" strokeWidth="1.4" />
            <circle cx="400" cy="250" r="95" fill="none" stroke="#c084fc" strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="6 6" />
            <line x1="25" y1="45" x2="115" y2="110" stroke="#ff2a55" strokeOpacity="0.38" strokeWidth="1.5" />
            <line x1="775" y1="455" x2="685" y2="390" stroke="#00e5ff" strokeOpacity="0.38" strokeWidth="1.5" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-[#38bdf8]/75">
              <span>UNLIMITED VOID // DOMAIN</span>
              <span className="text-[#c084fc]/85">HOLLOW TECHNIQUE: PURPLE</span>
            </div>
          )}
        </>
      )}

      {/* DEMON SLAYER: Ichimatsu Emerald Checkerboard Band + Hinokami Flame Frame */}
      {edition === 'demonslayer' && (
        <>
          <div className="edition-haori-checker absolute bottom-0 inset-x-0 h-2.5 opacity-80" />
          <div className="absolute inset-3.5 rounded-2xl border border-[#f97316]/45 shadow-[inset_0_0_28px_rgba(249,115,22,0.14)]" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-emerald-300/75">
              <span>DEMON SLAYER CORPS</span>
              <span className="text-orange-300/80">HINOKAMI KAGURA</span>
            </div>
          )}
        </>
      )}

      {/* NARUTO: Eight-Trigrams Seal Frame & Sharingan Corner Orbs */}
      {edition === 'naruto' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-[#ff7a00]/45 shadow-[inset_0_0_32px_rgba(255,122,0,0.14)]" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-40">
            <circle cx="400" cy="250" r="195" fill="none" stroke="#ff7a00" strokeOpacity="0.28" strokeWidth="1.2" strokeDasharray="10 6" />
            <circle cx="400" cy="250" r="225" fill="none" stroke="#dc2626" strokeOpacity="0.24" strokeWidth="1" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-amber-300/75">
              <span>KONOHAGAKURE // SAGE LINK</span>
              <span className="text-red-400/80">WILL OF FIRE</span>
            </div>
          )}
        </>
      )}

      {/* DRAGON BALL Z: Capsule Corp Radar Grid & Ki Horizon */}
      {edition === 'dragonball' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-[#facc15]/45 shadow-[inset_0_0_28px_rgba(34,197,94,0.14)]" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-35">
            <line x1="400" y1="20" x2="400" y2="480" stroke="#22c55e" strokeOpacity="0.35" strokeWidth="1" />
            <line x1="40" y1="250" x2="760" y2="250" stroke="#22c55e" strokeOpacity="0.35" strokeWidth="1" />
            <circle cx="400" cy="250" r="185" fill="none" stroke="#22c55e" strokeOpacity="0.32" strokeWidth="1" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-emerald-300/75">
              <span>CAPSULE CORP // RADAR</span>
              <span className="text-amber-300/80">7 DRAGON BALLS</span>
            </div>
          )}
        </>
      )}

      {/* ONE PIECE: Nautical Sea-Chart Meridian Frame & Golden Compass Ticks */}
      {edition === 'onepiece' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-[#fbbf24]/45 shadow-[inset_0_0_32px_rgba(14,165,233,0.16)]" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0ea5e9] via-[#facc15] to-[#ef4444] opacity-80" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-sky-300/75">
              <span>GRAND LINE // NEW WORLD</span>
              <span className="text-amber-300/80">LOG POSE: LOCKED</span>
            </div>
          )}
        </>
      )}

      {/* ATTACK ON TITAN: Survey Corps Wall Frame + ODM Steel Brackets */}
      {edition === 'aot' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-emerald-500/45 shadow-[inset_0_0_28px_rgba(16,185,129,0.14)]" />
          <div className="absolute top-16 left-5 w-5 h-5 border-t-2 border-l-2 border-emerald-400/75" />
          <div className="absolute top-16 right-5 w-5 h-5 border-t-2 border-r-2 border-emerald-400/75" />
          <div className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-[#facc15]/70" />
          <div className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-[#facc15]/70" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-emerald-300/75">
              <span>SURVEY CORPS // WALL MARIA</span>
              <span className="text-amber-300/80">ODM GAS: 100%</span>
            </div>
          )}
        </>
      )}

      {/* POKEMON: Pokedex Crimson-Pearl Horizon & Cyan Scanner LED Cluster */}
      {edition === 'pokemon' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-red-500/50" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#ef4444] via-[#f8fafc] to-[#38bdf8] opacity-85" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-rose-300/75">
              <span>POKEDEX OS // KALOS</span>
              <span className="text-sky-300/85">SCANNER READY</span>
            </div>
          )}
        </>
      )}

      {/* STRANGER THINGS: Twin 80s Crimson Neon Title Bars + Scanlines */}
      {edition === 'strangerthings' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-65" />
          <div className="absolute top-16 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff1e2d] to-transparent shadow-[0_0_12px_#ff1e2d]" />
          <div className="absolute bottom-9 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff1e2d] to-transparent shadow-[0_0_12px_#ff1e2d]" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-3 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.28em] text-red-400/75">
              <span>HAWKINS // 1983</span>
              <span className="text-rose-300/75">THE UPSIDE DOWN</span>
            </div>
          )}
        </>
      )}

      {/* ARCANE HEXTECH: Piltover Art-Deco Filigree Corners + Cyan Hexcore Glow */}
      {edition === 'arcane' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-[#fbbf24]/40 shadow-[inset_0_0_32px_rgba(56,189,248,0.14)]" />
          <div className="absolute inset-5 rounded-xl border border-[#38bdf8]/25" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.26em] text-amber-300/75">
              <span>PILTOVER // HEXCORE</span>
              <span className="text-sky-300/80">ARCANE MATRIX</span>
            </div>
          )}
        </>
      )}

      {/* DOCTOR WHO: TARDIS Cobalt Frame + Time Vortex Gallifreyan Rings */}
      {edition === 'doctorwho' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border-2 border-[#3b82f6]/50 shadow-[inset_0_0_32px_rgba(29,78,216,0.22)]" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-40">
            <circle cx="400" cy="250" r="205" fill="none" stroke="#fbbf24" strokeOpacity="0.28" strokeWidth="1.2" />
            <circle cx="428" cy="250" r="158" fill="none" stroke="#93c5fd" strokeOpacity="0.24" strokeWidth="1" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-blue-200/75">
              <span>TARDIS // TYPE 40</span>
              <span className="text-amber-300/80">GALLIFREYAN VORTEX</span>
            </div>
          )}
        </>
      )}

      {/* FALLOUT PIP-BOY: CRT Scanlines + RobCo Green Terminal Frame */}
      {edition === 'fallout' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-85" />
          <div className="absolute inset-3.5 rounded-2xl border-2 border-[#22c55e]/50 shadow-[inset_0_0_36px_rgba(34,197,94,0.16)]" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-[#4ade80]/80">
              <span>ROBCO PIP-BOY 3000</span>
              <span className="text-[#facc15]/80">VAULT 33 // V.A.T.S.</span>
            </div>
          )}
        </>
      )}

      {/* IRON MAN: J.A.R.V.I.S. Chamfered Flight HUD Brackets */}
      {edition === 'ironman' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-55" />
          <div className="absolute inset-3.5 rounded-2xl border border-[#38bdf8]/45" />
          <div className="absolute top-16 left-5 w-7 h-7 border-t-2 border-l-2 border-[#fbbf24]/80" />
          <div className="absolute top-16 right-5 w-7 h-7 border-t-2 border-r-2 border-[#fbbf24]/80" />
          <div className="absolute bottom-5 left-5 w-7 h-7 border-b-2 border-l-2 border-[#38bdf8]/80" />
          <div className="absolute bottom-5 right-5 w-7 h-7 border-b-2 border-r-2 border-[#38bdf8]/80" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-12 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-sky-300/75">
              <span>STARK HUD // MK-85</span>
              <span className="text-amber-300/80">J.A.R.V.I.S. ONLINE</span>
            </div>
          )}
        </>
      )}

      {/* STAR WARS: Trench Run Horizon Guides & Dual Kyber Accent Line */}
      {edition === 'starwars' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-[#facc15]/35" />
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#38bdf8] via-[#facc15] to-[#ff1e38] opacity-85" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-3 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.26em] text-amber-300/75">
              <span>HYPERDRIVE // VECTOR LOCK</span>
              <span className="text-sky-300/80">STAY ON TARGET</span>
            </div>
          )}
        </>
      )}

      {/* THE MATRIX: CRT Construct Scanlines & Terminal Frame */}
      {edition === 'matrix_neo' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-85" />
          <div className="absolute inset-3.5 rounded-2xl border border-[#00ff66]/45 shadow-[inset_0_0_32px_rgba(0,255,102,0.14)]" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-[#00ff66]/80">
              <span>TRACE PROGRAM: ACTIVE</span>
              <span className="text-emerald-200/80">ZION MAINFRAME</span>
            </div>
          )}
        </>
      )}

      {/* BATMAN: Stealth Wayne-OS Sonar Corner Rails & Spotlight Halo */}
      {edition === 'batman' && (
        <>
          <div className="absolute inset-3.5 rounded-2xl border border-amber-400/35 shadow-[inset_0_0_44px_rgba(251,191,36,0.08)]" />
          <div className="absolute top-16 left-5 w-6 h-6 border-t-2 border-l-2 border-amber-400/75" />
          <div className="absolute top-16 right-5 w-6 h-6 border-t-2 border-r-2 border-amber-400/75" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.26em] text-slate-400/80">
              <span>WAYNE-OS // BATCAVE</span>
              <span className="text-amber-300/80">GOTHAM SONAR</span>
            </div>
          )}
        </>
      )}

      {/* INVINCIBLE: Comic Halftone Texture + Graphic Panel Border + Stylized Crimson Ink Flecks */}
      {edition === 'invincible' && (
        <>
          <div className="edition-halftone-dark absolute inset-0 opacity-65" />
          <div className="absolute inset-3 sm:inset-4 rounded-2xl border-[3px] border-[#020617]/80 shadow-[inset_0_0_0_2px_rgba(255,230,0,0.45)]" />
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#ffe600]/22 via-transparent to-transparent" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <g fill="#dc2626" fillOpacity="0.82">
              <circle cx="726" cy="74" r="7" />
              <circle cx="744" cy="58" r="4" />
              <circle cx="755" cy="86" r="3" />
              <ellipse cx="708" cy="64" rx="5" ry="2.2" transform="rotate(-32 708 64)" />
              <circle cx="74" cy="428" r="6" />
              <circle cx="56" cy="444" r="3.5" />
              <ellipse cx="92" cy="440" rx="4.5" ry="2" transform="rotate(24 92 440)" />
            </g>
            <polygon points="0,468 78,468 62,500 0,500" fill="#ffe600" fillOpacity="0.92" />
            <polygon points="738,0 800,0 800,32 722,32" fill="#ffe600" fillOpacity="0.88" />
          </svg>
        </>
      )}

      {/* CYBERPUNK: Scanlines + 45-deg Tactical Brackets + Hazard Caution Strip */}
      {edition === 'cyberpunk' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-75" />
          <div className="edition-hazard-stripe absolute bottom-0 inset-x-0 h-2 opacity-80" />
          <div className="absolute top-16 left-5 w-6 h-6 border-t-2 border-l-2 border-[#fcee0a]/75" />
          <div className="absolute top-16 right-5 w-6 h-6 border-t-2 border-r-2 border-[#00f0ff]/75" />
          <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-[#00f0ff]/75" />
          <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-[#ff003c]/80" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 left-10 right-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-[#00f0ff]/65">
              <span>NET://NC-2077.84</span>
              <span className="text-[#fcee0a]/75">DAEMON // BREACH READY</span>
            </div>
          )}
        </>
      )}

      {/* DUNE: Monumental Arrakis Golden Horizon + Spice Blue Glint + Thin Imperial Frame */}
      {edition === 'dune' && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#b45309]/28 via-[#d97706]/8 to-transparent" />
          <div className="absolute inset-4 rounded-2xl border border-amber-400/20" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-55">
            <circle cx="400" cy="485" r="210" fill="none" stroke="#fbbf24" strokeOpacity="0.22" strokeWidth="1" />
            <circle cx="400" cy="485" r="245" fill="none" stroke="#38bdf8" strokeOpacity="0.16" strokeWidth="0.8" strokeDasharray="3 8" />
            <line x1="60" y1="456" x2="740" y2="456" stroke="#f59e0b" strokeOpacity="0.28" strokeWidth="0.9" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono tracking-[0.34em] uppercase text-amber-200/55">
              <span>ARRAKIS // 10191</span>
              <span className="text-sky-300/70">MELANGE SPICE</span>
            </div>
          )}
        </>
      )}

      {/* DOOMSDAY: Bunker Steel Rivets + Hazard Caution Chevrons + Alert Frame */}
      {edition === 'doomsday' && (
        <>
          <div className="edition-doomsday-stripe absolute bottom-0 inset-x-0 h-2.5 opacity-90" />
          <div className="absolute inset-3.5 rounded-2xl border border-red-500/35 shadow-[inset_0_0_40px_rgba(220,38,38,0.12)]" />
          {[
            'top-16 left-5',
            'top-16 right-5',
            'bottom-5 left-5',
            'bottom-5 right-5',
          ].map((pos, idx) => (
            <span
              key={idx}
              className={`absolute ${pos} w-3 h-3 rounded-full bg-zinc-800 border border-red-500/60 shadow-inner flex items-center justify-center`}
            >
              <span className="w-1 h-1 rounded-full bg-amber-400/80" />
            </span>
          ))}
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-12 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.26em] text-red-400/70">
              <span>SECTOR 00 // VAULT CLOCK</span>
              <span className="text-amber-400/75">MIDNIGHT PROTOCOL</span>
            </div>
          )}
        </>
      )}

      {/* SPIDER-VERSE: Cyan + Magenta Offset Comic Frame & Halftone Matrix */}
      {edition === 'spiderverse' && (
        <>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(rgba(0,245,255,0.45) 1.2px, transparent 1.2px), radial-gradient(rgba(255,42,133,0.4) 1.2px, transparent 1.2px)',
              backgroundSize: '18px 18px',
              backgroundPosition: '0 0, 9px 9px',
            }}
          />
          <div className="absolute inset-3.5 rounded-2xl border-2 border-[#00f5ff]/55 translate-x-[-2px] translate-y-[-2px]" />
          <div className="absolute inset-3.5 rounded-2xl border-2 border-[#ff2a85]/55 translate-x-[2px] translate-y-[2px]" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-black uppercase tracking-[0.26em] text-[#00f5ff]/75">
              <span>EARTH-1610</span>
              <span className="text-[#ff2a85]/85">DIMENSIONAL SYNC</span>
            </div>
          )}
        </>
      )}

      {/* EVANGELION: NERV MAGI Hex Corners + Amber Tactical Rails + Scanlines */}
      {edition === 'evangelion' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-70" />
          <div className="absolute inset-3.5 border border-[#ff6a00]/45" />
          <div className="absolute top-16 left-5 right-5 h-px bg-gradient-to-r from-[#ff6a00]/65 via-transparent to-[#ff6a00]/65" />
          <div className="absolute bottom-5 left-5 right-5 h-px bg-gradient-to-r from-[#ff1e27]/65 via-[#ff6a00]/30 to-[#39ff14]/65" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-2 left-6 right-6 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-[#ff7b00]/75">
              <span>MAGI-01 // MELCHIOR</span>
              <span className="text-[#39ff14]/80">AT-FIELD: NOMINAL</span>
            </div>
          )}
        </>
      )}

      {/* TRON GRID: Parallel Twin Glowing Cyan Light-Cycle Circuit Frame */}
      {edition === 'tron' && (
        <>
          <div className="absolute inset-3 rounded-2xl border border-[#00f2ff]/55 shadow-[inset_0_0_24px_rgba(0,242,255,0.16)]" />
          <div className="absolute inset-[18px] rounded-xl border border-[#00f2ff]/25" />
          <div className="absolute bottom-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent opacity-80" />
          <div className="absolute top-1/2 left-3 w-1.5 h-16 -translate-y-1/2 rounded-full bg-[#00f2ff]/70 shadow-[0_0_12px_#00f2ff]" />
          <div className="absolute top-1/2 right-3 w-1.5 h-16 -translate-y-1/2 rounded-full bg-[#ff6b00]/80 shadow-[0_0_12px_#ff6b00]" />
        </>
      )}

      {/* AKIRA: Neo-Tokyo 1988 Crimson Tail-Light Laser Streaks & Scanlines */}
      {edition === 'akira' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-65" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#ef233c] via-[#fbbf24] to-[#14b8a6] opacity-85" />
          <div className="absolute inset-3.5 rounded-2xl border border-[#ef233c]/40" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-55">
            <line x1="0" y1="435" x2="220" y2="435" stroke="#ef233c" strokeWidth="2.2" />
            <line x1="0" y1="444" x2="145" y2="444" stroke="#fbbf24" strokeWidth="1.4" />
            <line x1="580" y1="435" x2="800" y2="435" stroke="#ef233c" strokeWidth="2.2" />
            <line x1="655" y1="444" x2="800" y2="444" stroke="#14b8a6" strokeWidth="1.4" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-3 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.28em] text-rose-300/70">
              <span>NEO-TOKYO // 2019</span>
              <span className="text-amber-300/80">KANEDA // 12000 RPM</span>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export const getEditionDigitFrameClass = (edition: ClockEdition, isFullscreen: boolean): string => {
  const pad = isFullscreen ? 'px-8 py-5 sm:px-14 sm:py-8' : 'px-6 py-4 sm:px-10 sm:py-6';
  switch (edition) {
    case 'gta6':
      return `${pad} rounded-2xl bg-[#180527]/82 border-2 border-[#ff2e93]/75 shadow-[0_0_44px_rgba(255,46,147,0.32),-6px_0_24px_rgba(0,245,212,0.2)]`;
    case 'minecraft':
      return `${pad} rounded-none bg-[#0c1a0e]/90 border-2 border-[#4ade80]/80 shadow-[6px_6px_0_#052e16,0_0_28px_rgba(34,197,94,0.25)]`;
    case 'persona5':
      return `${pad} -skew-x-6 rounded-sm bg-[#060606]/92 border-2 border-[#ffffff] shadow-[7px_7px_0_#dc2626,-4px_-4px_0_#dc2626]`;
    case 'eldenring':
      return `${pad} rounded-2xl bg-[#0b0803]/88 border border-[#fbbf24]/65 shadow-[0_0_40px_rgba(251,191,36,0.26)]`;
    case 'godofwar':
      return `${pad} rounded-xl bg-[#09121f]/88 border-2 border-[#38bdf8]/70 shadow-[0_0_36px_rgba(56,189,248,0.24),inset_0_0_20px_rgba(239,68,68,0.16)]`;
    case 'zelda_totk':
      return `${pad} rounded-2xl bg-[#061520]/86 border-2 border-[#06b6d4]/75 shadow-[0_0_38px_rgba(6,182,212,0.28)]`;
    case 'halo_unsc':
      return `${pad} edition-chamfer bg-[#081320]/86 border border-[#fbbf24]/75 shadow-[0_0_36px_rgba(251,191,36,0.24)]`;
    case 'pacman':
      return `${pad} rounded-xl bg-[#03061a]/92 border-2 border-[#2563eb] ring-1 ring-[#38bdf8]/45 shadow-[0_0_36px_rgba(37,99,235,0.36)]`;
    case 'ben10':
      return `${pad} edition-chamfer bg-[#08150b]/85 border-2 border-[#65ff00]/75 shadow-[0_0_38px_rgba(101,255,0,0.28)]`;
    case 'jjk':
      return `${pad} rounded-2xl bg-[#070416]/80 border border-[#a855f7]/70 shadow-[0_0_40px_rgba(168,85,247,0.3),-6px_0_24px_rgba(0,229,255,0.22),6px_0_24px_rgba(255,42,85,0.22)]`;
    case 'demonslayer':
      return `${pad} rounded-2xl bg-[#0c0808]/85 border-2 border-[#f97316]/70 shadow-[0_0_36px_rgba(249,115,22,0.25),inset_0_0_20px_rgba(16,185,129,0.14)]`;
    case 'naruto':
      return `${pad} rounded-2xl bg-[#130804]/85 border-2 border-[#ff7a00]/70 shadow-[0_0_38px_rgba(255,122,0,0.28)]`;
    case 'dragonball':
      return `${pad} rounded-2xl bg-[#061224]/82 border-2 border-[#facc15]/75 shadow-[0_0_38px_rgba(250,204,21,0.28)]`;
    case 'onepiece':
      return `${pad} rounded-2xl bg-[#061528]/82 border-2 border-[#fbbf24]/65 shadow-[0_0_34px_rgba(14,165,233,0.25)]`;
    case 'aot':
      return `${pad} rounded-xl bg-[#0a120d]/85 border-2 border-[#10b981]/65 shadow-[0_0_30px_rgba(16,185,129,0.22)]`;
    case 'pokemon':
      return `${pad} rounded-2xl bg-[#140a0e]/85 border-t-2 border-b-2 border-t-[#ef4444] border-b-[#f8fafc] border-x border-x-white/20 shadow-[0_0_34px_rgba(239,68,68,0.24)]`;
    case 'strangerthings':
      return `${pad} rounded-xl bg-[#090204]/90 border-y-2 border-[#ff1e2d]/80 shadow-[0_0_42px_rgba(255,30,45,0.3)]`;
    case 'arcane':
      return `${pad} rounded-2xl bg-[#060d1c]/82 border-2 border-[#fbbf24]/70 shadow-[0_0_36px_rgba(56,189,248,0.25)]`;
    case 'doctorwho':
      return `${pad} rounded-xl bg-[#061430]/85 border-2 border-[#3b82f6]/75 shadow-[0_0_36px_rgba(59,130,246,0.28)]`;
    case 'fallout':
      return `${pad} rounded-2xl bg-[#031206]/90 border-2 border-[#4ade80]/70 shadow-[0_0_36px_rgba(74,222,128,0.26),inset_0_0_24px_rgba(34,197,94,0.16)]`;
    case 'ironman':
      return `${pad} edition-chamfer bg-[#050c18]/82 border border-[#38bdf8]/70 shadow-[0_0_38px_rgba(56,189,248,0.28)]`;
    case 'starwars':
      return `${pad} rounded-2xl bg-[#04060d]/85 border-y-2 border-[#facc15]/70 shadow-[0_0_34px_rgba(250,204,21,0.2)]`;
    case 'matrix_neo':
      return `${pad} rounded-xl bg-[#020e05]/88 border border-[#00ff66]/65 shadow-[0_0_36px_rgba(0,255,102,0.26)]`;
    case 'batman':
      return `${pad} rounded-xl bg-[#080a0f]/90 border border-amber-400/55 shadow-[0_0_34px_rgba(251,191,36,0.16)]`;
    case 'invincible':
      return `${pad} -skew-x-6 rounded-2xl bg-[#005ae0]/55 border-[3px] border-[#020617] shadow-[8px_8px_0_#020617] backdrop-blur-xs`;
    case 'cyberpunk':
      return `${isFullscreen ? 'px-8 py-5 sm:px-14 sm:py-8' : 'px-6 py-4 sm:px-10 sm:py-5'} edition-chamfer bg-black/65 border border-[#fcee0a]/60 shadow-[0_0_36px_rgba(0,240,255,0.18)] backdrop-blur-md`;
    case 'dune':
      return `${isFullscreen ? 'px-8 py-4 sm:px-14 sm:py-6' : 'px-6 py-3 sm:px-10 sm:py-5'} border-y border-amber-400/35 bg-gradient-to-r from-transparent via-amber-950/35 to-transparent`;
    case 'doomsday':
      return `${pad} rounded-xl bg-[#0d0f13]/90 border-2 border-red-600/65 shadow-[0_0_40px_rgba(220,38,38,0.28),inset_0_0_24px_rgba(0,0,0,0.9)]`;
    case 'spiderverse':
      return `${pad} -rotate-1 rounded-2xl bg-[#100626]/75 border-2 border-[#00f5ff] shadow-[6px_6px_0_#ff2a85,-4px_-4px_0_#00f5ff]`;
    case 'evangelion':
      return `${pad} bg-black/85 border-2 border-[#ff6a00]/80 shadow-[0_0_32px_rgba(255,106,0,0.28)]`;
    case 'tron':
      return `${pad} rounded-2xl bg-[#020a16]/75 border border-[#00f2ff]/70 ring-1 ring-[#00f2ff]/30 ring-offset-4 ring-offset-transparent shadow-[0_0_36px_rgba(0,242,255,0.24)]`;
    case 'akira':
      return `${pad} rounded-2xl bg-[#140509]/82 border-y-2 border-x border-[#ef233c]/75 shadow-[0_0_36px_rgba(239,35,60,0.3)]`;
    case 'classic':
    default:
      return '';
  }
};

export const getEditionFlipStyle = (edition: ClockEdition) => {
  switch (edition) {
    case 'gta6':
      return {
        sharpRadius: false,
        digitFx: 'edition-gta6-text',
        cardAura: 'ring-2 ring-[#ff2e93]/75 shadow-[0_0_28px_rgba(255,46,147,0.34)]',
        seamClass: 'bg-gradient-to-r from-[#ff2e93] via-[#ff8c42] to-[#00f5d4]',
      };
    case 'minecraft':
      return {
        sharpRadius: true,
        digitFx: 'edition-minecraft-text',
        cardAura: 'ring-2 ring-[#4ade80]/80 shadow-[5px_5px_0_#052e16]',
        seamClass: 'bg-[#22c55e]/90 shadow-[0_0_8px_#4ade80]',
      };
    case 'persona5':
      return {
        sharpRadius: true,
        digitFx: 'edition-persona5-text',
        cardAura: 'ring-2 ring-[#ffffff] shadow-[6px_6px_0_#dc2626] -skew-x-3',
        seamClass: 'bg-[#dc2626] shadow-[0_1px_0_#ffffff]',
      };
    case 'eldenring':
      return {
        sharpRadius: false,
        digitFx: 'edition-eldenring-text',
        cardAura: 'ring-1 ring-[#fbbf24]/70 shadow-[0_0_26px_rgba(251,191,36,0.28)]',
        seamClass: 'bg-[#fbbf24]/85 shadow-[0_0_8px_#fbbf24]',
      };
    case 'godofwar':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_16px_rgba(56,189,248,0.8)]',
        cardAura: 'ring-2 ring-[#38bdf8]/70 shadow-[0_0_24px_rgba(239,68,68,0.28)]',
        seamClass: 'bg-gradient-to-r from-[#38bdf8] via-[#ffffff] to-[#ef4444]',
      };
    case 'zelda_totk':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_16px_rgba(6,182,212,0.85)]',
        cardAura: 'ring-2 ring-[#06b6d4]/75 shadow-[0_0_26px_rgba(6,182,212,0.28)]',
        seamClass: 'bg-gradient-to-r from-[#06b6d4] via-[#22d3ee] to-[#facc15]',
      };
    case 'halo_unsc':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_16px_rgba(251,191,36,0.8)]',
        cardAura: 'ring-2 ring-[#fbbf24]/75 shadow-[0_0_26px_rgba(56,189,248,0.26)]',
        seamClass: 'bg-[#38bdf8]/90 shadow-[0_0_8px_#38bdf8]',
      };
    case 'pacman':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_16px_rgba(250,204,21,0.85)]',
        cardAura: 'ring-2 ring-[#2563eb] shadow-[0_0_28px_rgba(37,99,235,0.38)]',
        seamClass: 'bg-[#2563eb] shadow-[0_0_8px_#38bdf8]',
      };
    case 'ben10':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_16px_rgba(101,255,0,0.85)]',
        cardAura: 'ring-2 ring-[#65ff00]/75 shadow-[0_0_26px_rgba(101,255,0,0.28)]',
        seamClass: 'bg-[#65ff00]/95 shadow-[0_0_10px_#65ff00]',
      };
    case 'jjk':
      return {
        sharpRadius: false,
        digitFx: 'edition-jjk-text',
        cardAura: 'ring-2 ring-[#a855f7]/75 shadow-[0_0_28px_rgba(168,85,247,0.32)]',
        seamClass: 'bg-gradient-to-r from-[#00e5ff] via-[#c084fc] to-[#ff2a55]',
      };
    case 'demonslayer':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_14px_rgba(249,115,22,0.8)]',
        cardAura: 'ring-2 ring-[#f97316]/70 shadow-[0_0_24px_rgba(16,185,129,0.25)]',
        seamClass: 'bg-gradient-to-r from-[#10b981] via-[#f97316] to-[#ef4444]',
      };
    case 'naruto':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_16px_rgba(255,122,0,0.85)]',
        cardAura: 'ring-2 ring-[#ff7a00]/75 shadow-[0_0_26px_rgba(239,68,68,0.28)]',
        seamClass: 'bg-gradient-to-r from-[#fde047] via-[#ff7a00] to-[#dc2626]',
      };
    case 'dragonball':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_16px_rgba(250,204,21,0.85)]',
        cardAura: 'ring-2 ring-[#facc15]/75 shadow-[0_0_26px_rgba(250,204,21,0.28)]',
        seamClass: 'bg-[#22c55e]/90 shadow-[0_0_10px_#22c55e]',
      };
    case 'onepiece':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_14px_rgba(250,204,21,0.75)]',
        cardAura: 'ring-2 ring-[#fbbf24]/65 shadow-[0_0_24px_rgba(14,165,233,0.28)]',
        seamClass: 'bg-gradient-to-r from-[#38bdf8] via-[#facc15] to-[#ef4444]',
      };
    case 'aot':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_14px_rgba(16,185,129,0.75)]',
        cardAura: 'ring-2 ring-emerald-500/65 shadow-[0_0_22px_rgba(16,185,129,0.24)]',
        seamClass: 'bg-[#facc15]/85 shadow-[0_0_8px_#facc15]',
      };
    case 'pokemon':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_14px_rgba(239,68,68,0.7)]',
        cardAura: 'ring-2 ring-red-500/75 shadow-[0_0_24px_rgba(56,189,248,0.26)]',
        seamClass: 'bg-[#09090b] border-y border-white/40',
      };
    case 'strangerthings':
      return {
        sharpRadius: true,
        digitFx: 'edition-stranger-text',
        cardAura: 'ring-2 ring-[#ff1e2d]/75 shadow-[0_0_28px_rgba(255,30,45,0.32)]',
        seamClass: 'bg-[#ff1e2d]/95 shadow-[0_0_10px_#ff1e2d]',
      };
    case 'arcane':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_16px_rgba(56,189,248,0.8)]',
        cardAura: 'ring-2 ring-[#fbbf24]/70 shadow-[0_0_26px_rgba(56,189,248,0.28)]',
        seamClass: 'bg-gradient-to-r from-[#fbbf24] via-[#38bdf8] to-[#ec4899]',
      };
    case 'doctorwho':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_16px_rgba(251,191,36,0.78)]',
        cardAura: 'ring-2 ring-[#3b82f6]/75 shadow-[0_0_26px_rgba(37,99,235,0.32)]',
        seamClass: 'bg-[#fbbf24]/90 shadow-[0_0_10px_#fbbf24]',
      };
    case 'fallout':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_16px_rgba(74,222,128,0.85)]',
        cardAura: 'ring-2 ring-[#22c55e]/75 shadow-[0_0_24px_rgba(74,222,128,0.28)]',
        seamClass: 'bg-[#4ade80]/90 shadow-[0_0_10px_#4ade80]',
      };
    case 'ironman':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_16px_rgba(56,189,248,0.85)]',
        cardAura: 'ring-1 ring-[#38bdf8]/80 shadow-[0_0_26px_rgba(56,189,248,0.28)]',
        seamClass: 'bg-gradient-to-r from-[#ef4444] via-[#fbbf24] to-[#38bdf8]',
      };
    case 'starwars':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_14px_rgba(250,204,21,0.8)]',
        cardAura: 'ring-1 ring-[#facc15]/70 shadow-[0_0_24px_rgba(56,189,248,0.22)]',
        seamClass: 'bg-gradient-to-r from-[#38bdf8] via-[#facc15] to-[#ff1e38]',
      };
    case 'matrix_neo':
      return {
        sharpRadius: true,
        digitFx: 'edition-matrix-text',
        cardAura: 'ring-1 ring-[#00ff66]/75 shadow-[0_0_26px_rgba(0,255,102,0.28)]',
        seamClass: 'bg-[#00ff66]/90 shadow-[0_0_10px_#00ff66]',
      };
    case 'batman':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_14px_rgba(251,191,36,0.55)]',
        cardAura: 'ring-1 ring-amber-400/65 shadow-[0_14px_34px_rgba(0,0,0,0.85)]',
        seamClass: 'bg-[#fbbf24]/85 shadow-[0_0_8px_#fbbf24]',
      };
    case 'invincible':
      return {
        sharpRadius: false,
        digitFx: 'italic drop-shadow-[3px_3px_0_#000000]',
        cardAura: 'ring-2 ring-[#020617] shadow-[6px_7px_0_#020617] -skew-x-3',
        seamClass: 'bg-[#ffe600] shadow-[0_1px_0_#020617]',
      };
    case 'cyberpunk':
      return {
        sharpRadius: true,
        digitFx: 'edition-cyberpunk-text',
        cardAura: 'ring-1 ring-[#00f0ff]/60 shadow-[0_0_24px_rgba(0,240,255,0.22)]',
        seamClass: 'bg-[#00f0ff]/85 shadow-[0_0_10px_#00f0ff]',
      };
    case 'dune':
      return {
        sharpRadius: false,
        digitFx: '',
        cardAura: 'ring-1 ring-amber-400/45 shadow-[0_14px_34px_rgba(0,0,0,0.65)]',
        seamClass: 'bg-[#38bdf8]/80 shadow-[0_0_8px_#38bdf8]',
      };
    case 'doomsday':
      return {
        sharpRadius: true,
        digitFx: '',
        cardAura: 'ring-2 ring-red-600/60 shadow-[0_0_28px_rgba(220,38,38,0.25)]',
        seamClass: 'bg-[#ff2a00]/90 shadow-[0_0_10px_#ff2a00]',
      };
    case 'spiderverse':
      return {
        sharpRadius: false,
        digitFx: 'edition-spiderverse-text',
        cardAura: 'ring-2 ring-[#00f5ff] shadow-[5px_5px_0_#ff2a85,-3px_-3px_0_#00f5ff]',
        seamClass: 'bg-gradient-to-r from-[#00f5ff] via-[#ff2a85] to-[#00f5ff]',
      };
    case 'evangelion':
      return {
        sharpRadius: true,
        digitFx: 'drop-shadow-[0_0_14px_rgba(255,106,0,0.85)]',
        cardAura: 'ring-2 ring-[#ff6a00]/80 shadow-[0_0_24px_rgba(255,106,0,0.28)]',
        seamClass: 'bg-[#ff6a00]/90 shadow-[0_0_8px_#ff6a00]',
      };
    case 'tron':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_16px_rgba(0,242,255,0.8)]',
        cardAura: 'ring-1 ring-[#00f2ff]/85 shadow-[0_0_26px_rgba(0,242,255,0.3)]',
        seamClass: 'bg-[#ff6b00]/95 shadow-[0_0_10px_#ff6b00]',
      };
    case 'akira':
      return {
        sharpRadius: false,
        digitFx: 'drop-shadow-[0_0_14px_rgba(251,191,36,0.75)]',
        cardAura: 'ring-2 ring-[#ef233c]/75 shadow-[0_0_26px_rgba(239,35,60,0.3)]',
        seamClass: 'bg-[#ef233c]/95 shadow-[0_0_10px_#ef233c]',
      };
    case 'classic':
    default:
      return {
        sharpRadius: false,
        digitFx: '',
        cardAura: '',
        seamClass: '',
      };
  }
};

export const ClockEditionPowerMeter: React.FC<{
  edition: ClockEdition;
  progress: number;
  isFullscreen?: boolean;
}> = ({ edition, progress, isFullscreen = false }) => {
  if (edition === 'classic') return null;
  const clamped = Math.min(1, Math.max(0, progress));
  const segments =
    edition === 'evangelion' || edition === 'akira' || edition === 'ben10' || edition === 'jjk' || edition === 'gta6' || edition === 'halo_unsc'
      ? 16
      : 12;
  const litCount = Math.round(clamped * segments);

  return (
    <div className={`w-full mx-auto ${isFullscreen ? 'max-w-xl' : 'max-w-sm'} flex flex-col gap-1.5`}>
      <div className="flex items-center gap-1 w-full">
        {Array.from({ length: segments }).map((_, idx) => {
          const lit = idx < litCount;
          let activeColor = 'bg-sky-400';
          if (edition === 'gta6') activeColor = idx < 5 ? 'bg-[#ff2e93]' : idx >= segments - 4 ? 'bg-[#00f5d4]' : 'bg-[#ff8c42]';
          else if (edition === 'minecraft') activeColor = idx >= segments - 3 ? 'bg-[#22d3ee]' : 'bg-[#4ade80]';
          else if (edition === 'persona5') activeColor = idx % 2 === 0 ? 'bg-[#dc2626]' : 'bg-[#ffffff]';
          else if (edition === 'eldenring') activeColor = idx >= segments - 3 ? 'bg-[#fef08a]' : 'bg-[#fbbf24]';
          else if (edition === 'godofwar') activeColor = idx < 6 ? 'bg-[#38bdf8]' : 'bg-[#ef4444]';
          else if (edition === 'zelda_totk') activeColor = idx >= segments - 3 ? 'bg-[#facc15]' : 'bg-[#06b6d4]';
          else if (edition === 'halo_unsc') activeColor = idx >= segments - 4 ? 'bg-[#fbbf24]' : 'bg-[#38bdf8]';
          else if (edition === 'pacman') activeColor = idx < 4 ? 'bg-[#2563eb]' : idx >= segments - 3 ? 'bg-[#f43f5e]' : 'bg-[#facc15]';
          else if (edition === 'ben10') activeColor = idx >= segments - 2 ? 'bg-[#bef264]' : 'bg-[#65ff00]';
          else if (edition === 'jjk') activeColor = idx < 5 ? 'bg-[#00e5ff]' : idx >= segments - 5 ? 'bg-[#ff2a55]' : 'bg-[#c084fc]';
          else if (edition === 'demonslayer') activeColor = idx < 4 ? 'bg-[#10b981]' : idx >= segments - 3 ? 'bg-[#ef4444]' : 'bg-[#f97316]';
          else if (edition === 'naruto') activeColor = idx >= segments - 3 ? 'bg-[#dc2626]' : idx < 4 ? 'bg-[#fde047]' : 'bg-[#ff7a00]';
          else if (edition === 'dragonball') activeColor = idx % 3 === 0 ? 'bg-[#22c55e]' : 'bg-[#facc15]';
          else if (edition === 'onepiece') activeColor = idx < 4 ? 'bg-[#0ea5e9]' : idx >= segments - 3 ? 'bg-[#ef4444]' : 'bg-[#facc15]';
          else if (edition === 'aot') activeColor = idx >= segments - 2 ? 'bg-[#facc15]' : 'bg-[#10b981]';
          else if (edition === 'pokemon') activeColor = idx < 5 ? 'bg-[#ef4444]' : idx >= segments - 3 ? 'bg-[#38bdf8]' : 'bg-[#f8fafc]';
          else if (edition === 'strangerthings') activeColor = idx >= segments - 3 ? 'bg-[#ff1e2d]' : 'bg-[#dc2626]';
          else if (edition === 'arcane') activeColor = idx < 4 ? 'bg-[#fbbf24]' : idx >= segments - 3 ? 'bg-[#ec4899]' : 'bg-[#38bdf8]';
          else if (edition === 'doctorwho') activeColor = idx >= segments - 3 ? 'bg-[#fbbf24]' : 'bg-[#3b82f6]';
          else if (edition === 'fallout') activeColor = idx >= segments - 2 ? 'bg-[#facc15]' : 'bg-[#4ade80]';
          else if (edition === 'ironman') activeColor = idx < 3 ? 'bg-[#ef4444]' : idx >= segments - 3 ? 'bg-[#fbbf24]' : 'bg-[#38bdf8]';
          else if (edition === 'starwars') activeColor = idx < 5 ? 'bg-[#38bdf8]' : idx >= segments - 4 ? 'bg-[#ff1e38]' : 'bg-[#facc15]';
          else if (edition === 'matrix_neo') activeColor = idx >= segments - 2 ? 'bg-[#bbf7d0]' : 'bg-[#00ff66]';
          else if (edition === 'batman') activeColor = idx >= segments - 3 ? 'bg-[#fbbf24]' : 'bg-[#94a3b8]';
          else if (edition === 'invincible') activeColor = idx >= segments - 2 ? 'bg-[#ef4444]' : 'bg-[#ffe600]';
          else if (edition === 'cyberpunk') activeColor = idx % 3 === 0 ? 'bg-[#00f0ff]' : 'bg-[#fcee0a]';
          else if (edition === 'dune') activeColor = idx >= segments - 3 ? 'bg-[#38bdf8]' : 'bg-[#f59e0b]';
          else if (edition === 'doomsday') activeColor = idx >= segments - 4 ? 'bg-[#ff2a00]' : 'bg-[#f59e0b]';
          else if (edition === 'spiderverse') activeColor = idx % 2 === 0 ? 'bg-[#00f5ff]' : 'bg-[#ff2a85]';
          else if (edition === 'evangelion')
            activeColor = idx >= segments - 3 ? 'bg-[#ff1e27]' : idx < 3 ? 'bg-[#39ff14]' : 'bg-[#ff7b00]';
          else if (edition === 'tron') activeColor = idx >= segments - 2 ? 'bg-[#ff6b00]' : 'bg-[#00f2ff]';
          else if (edition === 'akira') activeColor = idx >= segments - 4 ? 'bg-[#ef233c]' : 'bg-[#fbbf24]';

          return (
            <span
              key={idx}
              className={`h-2 flex-1 rounded-xs transition-all duration-300 ${
                lit ? `${activeColor} shadow-xs` : 'bg-white/10'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export const getEditionCalendarPanelClass = (edition: ClockEdition, isLight?: boolean): string => {
  switch (edition) {
    case 'gta6':
      return 'bg-[#170526]/88 border-2 border-[#ff2e93]/75 shadow-[0_0_34px_rgba(255,46,147,0.28)] text-pink-50';
    case 'minecraft':
      return 'bg-[#0c1a0e]/90 border-2 border-[#4ade80]/75 shadow-[5px_5px_0_#052e16] text-[#dcfce7]';
    case 'persona5':
      return 'bg-[#060606]/92 border-2 border-white shadow-[6px_6px_0_#dc2626] text-white';
    case 'eldenring':
      return 'bg-[#0b0803]/90 border border-[#fbbf24]/65 shadow-[0_0_32px_rgba(251,191,36,0.22)] text-amber-50';
    case 'godofwar':
      return 'bg-[#09121f]/90 border-2 border-[#38bdf8]/65 shadow-[0_0_30px_rgba(56,189,248,0.22)] text-slate-100';
    case 'zelda_totk':
      return 'bg-[#061520]/88 border-2 border-[#06b6d4]/70 shadow-[0_0_30px_rgba(6,182,212,0.24)] text-cyan-50';
    case 'halo_unsc':
      return 'bg-[#081320]/90 border border-[#fbbf24]/70 shadow-[0_0_30px_rgba(251,191,36,0.22)] text-amber-50';
    case 'pacman':
      return 'bg-[#03061a]/92 border-2 border-[#2563eb] shadow-[0_0_32px_rgba(37,99,235,0.32)] text-yellow-50';
    case 'ben10':
      return 'bg-[#061308]/88 border-2 border-[#65ff00]/75 shadow-[0_0_32px_rgba(101,255,0,0.22)] text-[#ecfccb]';
    case 'jjk':
      return 'bg-[#070416]/88 border border-[#a855f7]/75 shadow-[0_0_32px_rgba(168,85,247,0.28)] text-slate-100';
    case 'demonslayer':
      return 'bg-[#0c0808]/88 border-2 border-[#f97316]/70 shadow-[0_0_28px_rgba(249,115,22,0.22)] text-orange-50';
    case 'naruto':
      return 'bg-[#130804]/88 border-2 border-[#ff7a00]/70 shadow-[0_0_28px_rgba(255,122,0,0.24)] text-amber-50';
    case 'dragonball':
      return 'bg-[#061224]/88 border-2 border-[#facc15]/75 shadow-[0_0_28px_rgba(250,204,21,0.24)] text-yellow-50';
    case 'onepiece':
      return 'bg-[#061528]/88 border-2 border-[#fbbf24]/65 shadow-[0_0_28px_rgba(14,165,233,0.24)] text-sky-50';
    case 'aot':
      return 'bg-[#0a120d]/88 border-2 border-[#10b981]/65 shadow-[0_0_26px_rgba(16,185,129,0.22)] text-emerald-50';
    case 'pokemon':
      return 'bg-[#140a0e]/88 border-t-2 border-b-2 border-t-[#ef4444] border-b-[#f8fafc] border-x border-x-white/25 shadow-[0_0_28px_rgba(239,68,68,0.22)] text-slate-100';
    case 'strangerthings':
      return 'bg-[#090204]/92 border-y-2 border-[#ff1e2d]/80 shadow-[0_0_34px_rgba(255,30,45,0.26)] text-rose-50';
    case 'arcane':
      return 'bg-[#060d1c]/88 border-2 border-[#fbbf24]/70 shadow-[0_0_28px_rgba(56,189,248,0.24)] text-sky-50';
    case 'doctorwho':
      return 'bg-[#061430]/88 border-2 border-[#3b82f6]/75 shadow-[0_0_28px_rgba(59,130,246,0.26)] text-blue-50';
    case 'fallout':
      return 'bg-[#031206]/92 border-2 border-[#4ade80]/70 shadow-[0_0_28px_rgba(74,222,128,0.24)] text-[#bbf7d0]';
    case 'ironman':
      return 'bg-[#050c18]/88 border border-[#38bdf8]/70 shadow-[0_0_28px_rgba(56,189,248,0.24)] text-sky-50';
    case 'starwars':
      return 'bg-[#04060d]/90 border-y-2 border-[#facc15]/70 shadow-[0_0_28px_rgba(250,204,21,0.18)] text-slate-100';
    case 'matrix_neo':
      return 'bg-[#020e05]/92 border border-[#00ff66]/65 shadow-[0_0_28px_rgba(0,255,102,0.24)] text-[#bbf7d0]';
    case 'batman':
      return 'bg-[#080a0f]/92 border border-amber-400/55 shadow-[0_0_28px_rgba(251,191,36,0.16)] text-slate-200';
    case 'invincible':
      return 'bg-[#020617]/85 border-2 border-[#ffe600] shadow-[6px_6px_0_#020617] text-white';
    case 'cyberpunk':
      return 'bg-black/82 border border-[#fcee0a]/65 shadow-[0_0_28px_rgba(0,240,255,0.2)] text-yellow-50';
    case 'dune':
      return 'bg-[#1c0f06]/85 border border-amber-400/50 shadow-[0_0_28px_rgba(245,158,11,0.2)] text-amber-50';
    case 'doomsday':
      return 'bg-[#0d0f13]/92 border-2 border-red-600/65 shadow-[0_0_28px_rgba(220,38,38,0.26)] text-slate-100';
    case 'spiderverse':
      return 'bg-[#12072b]/85 border-2 border-[#00f5ff] shadow-[5px_5px_0_#ff2a85] text-white';
    case 'evangelion':
      return 'bg-black/88 border-2 border-[#ff6a00]/80 shadow-[0_0_28px_rgba(255,106,0,0.24)] text-orange-50';
    case 'tron':
      return 'bg-[#020a16]/85 border border-[#00f2ff]/70 shadow-[0_0_28px_rgba(0,242,255,0.22)] text-cyan-50';
    case 'akira':
      return 'bg-[#140509]/88 border-y-2 border-x border-[#ef233c]/75 shadow-[0_0_28px_rgba(239,35,60,0.24)] text-rose-50';
    case 'classic':
    default:
      return isLight
        ? 'bg-white/90 border-slate-300 shadow-lg text-slate-800'
        : 'bg-black/40 border-white/10 shadow-2xl text-slate-200';
  }
};

export const getEditionPrimaryBtnClass = (edition: ClockEdition, isLight?: boolean): string => {
  switch (edition) {
    case 'gta6':
      return 'bg-gradient-to-r from-[#ff2e93] via-[#ff8c42] to-[#f43f5e] hover:brightness-110 text-white border border-[#00f5d4]/80 shadow-[0_0_24px_rgba(255,46,147,0.45)]';
    case 'minecraft':
      return 'bg-[#22c55e] hover:bg-[#4ade80] text-[#052e16] border-2 border-[#052e16] shadow-[4px_4px_0_#052e16]';
    case 'persona5':
      return 'bg-[#dc2626] hover:bg-[#ef4444] text-white border-2 border-white shadow-[4px_4px_0_#050505]';
    case 'eldenring':
      return 'bg-[#b45309] hover:bg-[#d97706] text-[#fef3c7] border border-[#fbbf24]/80 shadow-[0_0_22px_rgba(251,191,36,0.35)]';
    case 'godofwar':
      return 'bg-[#1e3a5f] hover:bg-[#0284c7] text-white border border-[#ef4444]/80 shadow-[0_0_22px_rgba(56,189,248,0.35)]';
    case 'zelda_totk':
      return 'bg-[#0891b2] hover:bg-[#06b6d4] text-white border border-[#facc15]/80 shadow-[0_0_22px_rgba(6,182,212,0.38)]';
    case 'halo_unsc':
      return 'bg-[#d97706] hover:bg-[#f59e0b] text-[#07111c] border border-[#38bdf8]/80 shadow-[0_0_22px_rgba(251,191,36,0.38)]';
    case 'pacman':
      return 'bg-[#facc15] hover:bg-[#fde047] text-[#03071d] border-2 border-[#2563eb] shadow-[0_0_22px_rgba(250,204,21,0.4)]';
    case 'ben10':
      return 'bg-[#65ff00] hover:bg-[#7aff26] text-[#051208] border-2 border-[#022c0c] shadow-[0_0_24px_rgba(101,255,0,0.4)]';
    case 'jjk':
      return 'bg-gradient-to-r from-[#00e5ff]/25 via-[#a855f7]/45 to-[#ff2a55]/30 hover:from-[#00e5ff]/40 hover:to-[#ff2a55]/45 text-white border border-[#c084fc]/70 shadow-[0_0_24px_rgba(168,85,247,0.35)]';
    case 'demonslayer':
      return 'bg-gradient-to-r from-[#f97316] to-[#ef4444] hover:brightness-110 text-white border border-amber-300/60 shadow-[0_0_22px_rgba(249,115,22,0.35)]';
    case 'naruto':
      return 'bg-[#ff7a00] hover:bg-[#fb923c] text-[#0f0502] border border-[#fde047]/80 shadow-[0_0_22px_rgba(255,122,0,0.4)]';
    case 'dragonball':
      return 'bg-[#facc15] hover:bg-[#fde047] text-[#081226] border-2 border-[#22c55e] shadow-[0_0_22px_rgba(250,204,21,0.4)]';
    case 'onepiece':
      return 'bg-[#facc15] hover:bg-[#fde047] text-[#082f49] border border-[#ef4444]/80 shadow-[0_0_20px_rgba(250,204,21,0.35)]';
    case 'aot':
      return 'bg-[#065f46] hover:bg-[#047857] text-[#ecfdf5] border border-[#facc15]/70 shadow-[0_0_20px_rgba(16,185,129,0.35)]';
    case 'pokemon':
      return 'bg-[#ef4444] hover:bg-[#f87171] text-white border-2 border-white/80 shadow-[0_0_22px_rgba(239,68,68,0.38)]';
    case 'strangerthings':
      return 'bg-[#dc2626] hover:bg-[#ef4444] text-white border border-[#ff4d5a] shadow-[0_0_26px_rgba(255,30,45,0.42)]';
    case 'arcane':
      return 'bg-[#0284c7]/80 hover:bg-[#0ea5e9] text-white border-2 border-[#fbbf24]/80 shadow-[0_0_22px_rgba(56,189,248,0.35)]';
    case 'doctorwho':
      return 'bg-[#1d4ed8] hover:bg-[#2563eb] text-[#fef3c7] border border-[#fbbf24]/80 shadow-[0_0_22px_rgba(59,130,246,0.4)]';
    case 'fallout':
      return 'bg-[#166534] hover:bg-[#15803d] text-[#dcfce7] border-2 border-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.35)]';
    case 'ironman':
      return 'bg-[#0284c7]/75 hover:bg-[#0ea5e9]/85 text-white border border-[#38bdf8] shadow-[0_0_24px_rgba(56,189,248,0.4)]';
    case 'starwars':
      return 'bg-[#facc15] hover:bg-[#fde047] text-[#020617] border border-white/40 shadow-[0_0_20px_rgba(250,204,21,0.32)]';
    case 'matrix_neo':
      return 'bg-[#052e16] hover:bg-[#14532d] text-[#4ade80] border border-[#00ff66] shadow-[0_0_24px_rgba(0,255,102,0.35)]';
    case 'batman':
      return 'bg-[#1e293b] hover:bg-[#334155] text-[#fbbf24] border border-amber-400/70 shadow-[0_0_20px_rgba(251,191,36,0.22)]';
    case 'invincible':
      return 'bg-[#ffe600] hover:bg-[#fff04d] text-[#020617] border-2 border-[#020617] shadow-[4px_4px_0_#020617]';
    case 'cyberpunk':
      return 'bg-[#fcee0a] hover:bg-[#fef08a] text-black border border-[#00f0ff] shadow-[0_0_20px_rgba(252,238,10,0.35)]';
    case 'dune':
      return 'bg-amber-600/85 hover:bg-amber-500 text-amber-50 border border-[#38bdf8]/70 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
    case 'doomsday':
      return 'bg-[#dc2626] hover:bg-[#ef4444] text-white border border-amber-400/60 shadow-[0_0_22px_rgba(220,38,38,0.4)]';
    case 'spiderverse':
      return 'bg-[#ff2a85] hover:bg-[#ff4da0] text-white border-2 border-[#00f5ff] shadow-[4px_4px_0_#00f5ff]';
    case 'evangelion':
      return 'bg-[#ea580c] hover:bg-[#f97316] text-black border border-[#39ff14]/70 shadow-[0_0_20px_rgba(255,106,0,0.38)]';
    case 'tron':
      return 'bg-[#083344]/85 hover:bg-[#0e7490] text-[#67e8f9] border border-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.38)]';
    case 'akira':
      return 'bg-[#ef233c] hover:bg-[#fb3750] text-white border border-[#fbbf24]/70 shadow-[0_0_22px_rgba(239,35,60,0.38)]';
    case 'classic':
    default:
      return isLight
        ? 'bg-slate-900 text-white hover:bg-slate-800'
        : 'bg-white/20 hover:bg-white/30 text-white';
  }
};

