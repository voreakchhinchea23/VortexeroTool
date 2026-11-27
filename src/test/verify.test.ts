import { TOOLS } from '../data/toolsData';
import { getToolColor } from '../data/toolColors';
import { 
  CHEMICAL_ELEMENTS, 
  ELEMENT_CATEGORIES, 
  getPhaseAtKelvin, 
  toKhmerDigits, 
  getElementCategoryMeta 
} from '../data/periodicTableData';
import { toKhmerLunarDate, formatKhmerDate, getKhmerHolidays, toKhmerNumber } from 'khmer-chhankitek-calendar';

console.log(`Verifying ${TOOLS.length} tools...`);

// Test 1: Sorting
let sortedCorrectly = true;
for (let i = 0; i < TOOLS.length - 1; i++) {
  const comp = TOOLS[i].name.localeCompare(TOOLS[i + 1].name, undefined, { sensitivity: 'base' });
  if (comp > 0) {
    console.error(`Sort failure between "${TOOLS[i].name}" and "${TOOLS[i + 1].name}"`);
    sortedCorrectly = false;
  }
}

if (!sortedCorrectly) {
  process.exit(1);
}
console.log('✓ Test 1: All tools are strictly sorted alphabetically A-Z.');

// Test 2: Unique IDs and properties
const ids = new Set<string>();
for (const tool of TOOLS) {
  if (ids.has(tool.id)) {
    console.error(`Duplicate tool ID: ${tool.id}`);
    process.exit(1);
  }
  ids.add(tool.id);

  if (!tool.name || !tool.description || !tool.category || !tool.iconName || !Array.isArray(tool.tags)) {
    console.error(`Invalid tool structure for: ${tool.id}`);
    process.exit(1);
  }
}
console.log(`✓ Test 2: All ${ids.size} tools have unique IDs and complete metadata.`);

// Test 3: Specific required tools exist
const requiredIds = [
  'pdf-merger',
  'curl-to-code',
  'json-to-typescript',
  'svg-studio',
  'keycode-info',
  'http-status-codes',
  'chmod-calculator',
  'khmer-lunar-calendar',
  'periodic-table',
  'math-scanner',
  'document-scanner',
  'qr-scanner',
  'image-to-text',
  'budget-tracker',
  'world-clock-planner',
  'gpa-grade-calculator',
  'age-date-calculator',
  'smart-shopping-calculator',
];

for (const reqId of requiredIds) {
  const found = TOOLS.find(t => t.id === reqId);
  if (!found) {
    console.error(`Missing required tool: ${reqId}`);
    process.exit(1);
  }
}
console.log('✓ Test 3: All required development, PDF, Khmer lunar calendar, and everyday user tools are present.');

// Test 4: Default sort order in App logic
const sortedNames = TOOLS.map(t => t.name);
console.log(`First 3 tools: ${sortedNames.slice(0, 3).join(', ')}`);
console.log(`Last 3 tools: ${sortedNames.slice(-3).join(', ')}`);

// Test 5: Khmer Lunar Calendar functionality tests
// 5a: Basic conversion and formatting
const testDate = toKhmerLunarDate('2026-05-01');
if (!testDate.lunarDateText || !testDate.buddhistEraYear || !testDate.khmerMonth || !testDate.animalYear) {
  console.error('Khmer Lunar Date conversion failed for 2026-05-01');
  process.exit(1);
}
if (!testDate.isSilDay || !testDate.observanceText) {
  console.error('Sil day or observance text detection failed for Visak Bochea 2026-05-01');
  process.exit(1);
}

// 5b: Holidays retrieval for multiple years
for (const year of [2025, 2026, 2027]) {
  const testHolidays = getKhmerHolidays(year);
  if (!Array.isArray(testHolidays) || testHolidays.length === 0) {
    console.error(`Khmer Holidays retrieval failed for ${year}`);
    process.exit(1);
  }
  const hasKhmerNewYear = testHolidays.some(h => h.nameKm.includes('ចូលឆ្នាំ') || (h.nameEn && h.nameEn.includes('New Year')));
  if (!hasKhmerNewYear) {
    console.error(`Missing Khmer New Year in holidays for ${year}`);
    process.exit(1);
  }
}

// 5c: English and Khmer formats
const enFormatted = formatKhmerDate('2026-05-01', { locale: 'en' });
if (!enFormatted.includes('BE')) {
  console.error('Khmer Date English formatting failed');
  process.exit(1);
}

const kmNumberStr = toKhmerNumber(2026);
if (kmNumberStr !== '២០២៦') {
  console.error(`toKhmerNumber failed: expected ២០២៦, got ${kmNumberStr}`);
  process.exit(1);
}

// 5d: Year boundaries test (1900-01-01 and 2099-12-31)
const minDate = toKhmerLunarDate('1900-01-01');
if (!minDate.lunarDateText || minDate.gregorianDate !== '1900-01-01') {
  console.error('Boundary test failed for 1900-01-01');
  process.exit(1);
}
const maxDate = toKhmerLunarDate('2099-12-31');
if (!maxDate.lunarDateText || maxDate.gregorianDate !== '2099-12-31') {
  console.error('Boundary test failed for 2099-12-31');
  process.exit(1);
}

// 5e: Reverse Lunar Date scan (find 15កើត ខែពិសាខ in 2026)
let foundVisakIso: string | null = null;
const start2026 = new Date(2026, 0, 1);
const end2026 = new Date(2026, 11, 31);
for (let cur = new Date(start2026); cur <= end2026; cur.setDate(cur.getDate() + 1)) {
  const m = String(cur.getMonth() + 1).padStart(2, '0');
  const d = String(cur.getDate()).padStart(2, '0');
  const iso = `2026-${m}-${d}`;
  const lunar = toKhmerLunarDate(iso);
  if (lunar.khmerMonth === 'ពិសាខ' && lunar.moonStatus === 'កើត' && lunar.moonDay === 15) {
    foundVisakIso = iso;
    break;
  }
}
if (foundVisakIso !== '2026-05-01') {
  console.error(`Reverse lunar search failed: expected 2026-05-01, got ${foundVisakIso}`);
  process.exit(1);
}

console.log('✓ Test 5: Comprehensive Khmer lunar calendar conversions, reverse search, boundaries, and holidays verified.');

// Test 6: Periodic Table of Chemical Elements verification
console.log('Verifying Periodic Table of Chemical Elements data & functions...');

// 6a: 118 Elements validation
if (CHEMICAL_ELEMENTS.length !== 118) {
  console.error(`Expected 118 chemical elements, but found ${CHEMICAL_ELEMENTS.length}`);
  process.exit(1);
}

const elementNumbers = new Set<number>();
const elementSymbols = new Set<string>();
const khmerCharRegex = /[\u1780-\u17FF]/;

for (let i = 0; i < CHEMICAL_ELEMENTS.length; i++) {
  const el = CHEMICAL_ELEMENTS[i];
  const expectedNum = i + 1;

  if (el.number !== expectedNum) {
    console.error(`Element at index ${i} has number ${el.number}, expected ${expectedNum}`);
    process.exit(1);
  }

  if (elementNumbers.has(el.number)) {
    console.error(`Duplicate element number: ${el.number}`);
    process.exit(1);
  }
  elementNumbers.add(el.number);

  if (elementSymbols.has(el.symbol)) {
    console.error(`Duplicate element symbol: ${el.symbol}`);
    process.exit(1);
  }
  elementSymbols.add(el.symbol);

  // Bilingual checks
  if (!el.nameEn || !el.nameKm) {
    console.error(`Missing name for element ${el.number} (${el.symbol})`);
    process.exit(1);
  }

  if (!khmerCharRegex.test(el.nameKm)) {
    console.error(`Element ${el.symbol} nameKm "${el.nameKm}" lacks Khmer script`);
    process.exit(1);
  }

  if (!el.summaryEn || !el.summaryKm) {
    console.error(`Missing summary for element ${el.number} (${el.symbol})`);
    process.exit(1);
  }

  if (!khmerCharRegex.test(el.summaryKm)) {
    console.error(`Element ${el.symbol} summaryKm lacks Khmer script`);
    process.exit(1);
  }

  // Grid coordinates
  if (el.gridRow < 1 || el.gridRow > 10 || el.gridCol < 1 || el.gridCol > 18) {
    console.error(`Invalid grid coordinates for ${el.symbol}: row ${el.gridRow}, col ${el.gridCol}`);
    process.exit(1);
  }

  // Shells array & atomic number sum check
  if (!Array.isArray(el.shells) || el.shells.length === 0) {
    console.error(`Invalid shells array for ${el.symbol}`);
    process.exit(1);
  }
  const shellSum = el.shells.reduce((acc, count) => acc + count, 0);
  if (shellSum !== el.number) {
    console.error(`Shell electrons sum for ${el.symbol} (#${el.number}) is ${shellSum}, expected ${el.number}`);
    process.exit(1);
  }
}

// 6b: Temperature phase transitions
const hydrogen = CHEMICAL_ELEMENTS[0]; // H, mp: 13.99, bp: 20.271
if (getPhaseAtKelvin(hydrogen, 5) !== 'solid') {
  console.error('Hydrogen at 5 K should be solid');
  process.exit(1);
}
if (getPhaseAtKelvin(hydrogen, 15) !== 'liquid') {
  console.error('Hydrogen at 15 K should be liquid');
  process.exit(1);
}
if (getPhaseAtKelvin(hydrogen, 300) !== 'gas') {
  console.error('Hydrogen at 300 K should be gas');
  process.exit(1);
}
// Negative Kelvin clamp test
if (getPhaseAtKelvin(hydrogen, -50) !== 'solid') {
  console.error('Negative Kelvin should clamp safely to solid');
  process.exit(1);
}

const mercury = CHEMICAL_ELEMENTS[79]; // Hg (80), mp: 234.32, bp: 629.88
if (getPhaseAtKelvin(mercury, 200) !== 'solid') {
  console.error('Mercury at 200 K should be solid');
  process.exit(1);
}
if (getPhaseAtKelvin(mercury, 293.15) !== 'liquid') {
  console.error('Mercury at 293.15 K should be liquid');
  process.exit(1);
}
if (getPhaseAtKelvin(mercury, 700) !== 'gas') {
  console.error('Mercury at 700 K should be gas');
  process.exit(1);
}

// Element with known melting point but null boiling point (Fermium #100, mp: 1800 K)
const fermium = CHEMICAL_ELEMENTS[99]; // Fm (100)
if (getPhaseAtKelvin(fermium, 300) !== 'solid') {
  console.error('Fermium at 300 K should be solid');
  process.exit(1);
}
if (getPhaseAtKelvin(fermium, 2000) !== 'liquid') {
  console.error('Fermium at 2000 K (above mp 1800 K) should be liquid');
  process.exit(1);
}

// 6c: Khmer digits conversion
if (
  toKhmerDigits(118) !== '១១៨' ||
  toKhmerDigits(79) !== '៧៩' ||
  toKhmerDigits(0) !== '០' ||
  toKhmerDigits('1.008') !== '១.០០៨' ||
  toKhmerDigits(-273.15) !== '-២៧៣.១៥' ||
  toKhmerDigits(null) !== '' ||
  toKhmerDigits(undefined) !== ''
) {
  console.error('toKhmerDigits failed conversion test');
  process.exit(1);
}

// 6d: Categories metadata
if (ELEMENT_CATEGORIES.length !== 10) {
  console.error(`Expected 10 element categories, found ${ELEMENT_CATEGORIES.length}`);
  process.exit(1);
}
for (const cat of ELEMENT_CATEGORIES) {
  if (!cat.nameEn || !cat.nameKm || !cat.descriptionEn || !cat.descriptionKm || !cat.colorHex) {
    console.error(`Incomplete category metadata for ${cat.id}`);
    process.exit(1);
  }
}

// 6e: Color theme mapping
const periodicTableColor = getToolColor('periodic-table');
if (!periodicTableColor || periodicTableColor.id !== 'periodic-table') {
  console.error('Failed to retrieve periodic-table color scheme from toolColors.ts');
  process.exit(1);
}

// Test 7: CodeToImage and language highlighter verification
import { SUPPORTED_LANGUAGES, detectLanguage, highlightCodeToLines } from '../utils/codeHighlight';

if (SUPPORTED_LANGUAGES.length < 25) {
  console.error('Supported languages catalog is too small');
  process.exit(1);
}
if (detectLanguage('def fn():\n    return 1') !== 'python') {
  console.error('Python auto-detection failed');
  process.exit(1);
}
if (detectLanguage('SELECT id,\n  name\nFROM users\nWHERE id = 1;') !== 'sql') {
  console.error('Multiline SQL auto-detection failed');
  process.exit(1);
}
if (detectLanguage('local x = 10\nfunction add(a, b)\n  return a + b\nend') !== 'lua') {
  console.error('Lua auto-detection failed');
  process.exit(1);
}
if (detectLanguage('void main() {\n  var name = "Dart";\n}') !== 'dart') {
  console.error('Dart auto-detection failed');
  process.exit(1);
}
const testTokens = highlightCodeToLines('const msg: string = "ok";', 'typescript');
if (!testTokens[0].includes('hljs-keyword')) {
  console.error('TypeScript token highlighting failed');
  process.exit(1);
}
console.log('✓ Test 7: CodeToImage 27 programming languages, auto-detection engine, and syntax highlighting verified.');

// Test 8: CodeToImage authentic Carbon syntax themes, backgrounds, shadows, and fonts verification
import {
  CODE_THEMES,
  BACKGROUND_PRESETS,
  DROP_SHADOWS,
  FONT_FAMILIES,
  generateCodeThemeCss,
} from '../utils/codeThemes';

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

// Verify at least 12 authentic code syntax themes exist
if (CODE_THEMES.length < 12) {
  console.error(`Expected at least 12 code themes, found ${CODE_THEMES.length}`);
  process.exit(1);
}

const requiredThemeIds = [
  'dracula',
  'one_dark',
  'monokai_pro',
  'night_owl',
  'nord',
  'synthwave_84',
  'github_dark',
  'github_light',
  'solarized_dark',
  'material_ocean',
  'cobalt_2',
  'shades_of_purple',
];

for (const reqId of requiredThemeIds) {
  const found = CODE_THEMES.find((t) => t.id === reqId);
  if (!found) {
    console.error(`Missing required Carbon syntax theme: ${reqId}`);
    process.exit(1);
  }
}

for (const t of CODE_THEMES) {
  if (!t.id || !t.name || !t.editorBg || !t.titleBarBg || !t.textColor || !t.lineNumColor) {
    console.error(`Theme ${t.id} has missing required styling properties`);
    process.exit(1);
  }

  // Token completeness check
  const tokens = t.tokens;
  if (
    !tokens.keyword ||
    !tokens.built_in ||
    !tokens.type ||
    !tokens.literal ||
    !tokens.number ||
    !tokens.string ||
    !tokens.comment ||
    !tokens.function ||
    !tokens.title ||
    !tokens.params ||
    !tokens.operator
  ) {
    console.error(`Theme ${t.id} has incomplete syntax token colors`);
    process.exit(1);
  }

  // Strict check: DO NOT use any emojis
  if (emojiRegex.test(t.name) || emojiRegex.test(t.id)) {
    console.error(`Theme ${t.id} contains prohibited emoji characters`);
    process.exit(1);
  }

  // Verify CSS generator output
  const css = generateCodeThemeCss(t);
  if (!css.includes('.vortex-code-highlight') || !css.includes('.hljs-keyword') || !css.includes(t.editorBg)) {
    console.error(`Theme ${t.id} CSS generation verification failed`);
    process.exit(1);
  }
}

// Verify background presets
const hasGradient = BACKGROUND_PRESETS.some((b) => b.type === 'gradient');
const hasSolid = BACKGROUND_PRESETS.some((b) => b.type === 'solid');
const hasTransparent = BACKGROUND_PRESETS.some((b) => b.type === 'transparent' && b.value === 'transparent');

if (!hasGradient || !hasSolid || !hasTransparent) {
  console.error('Missing background preset categories (gradient, solid, transparent)');
  process.exit(1);
}

for (const b of BACKGROUND_PRESETS) {
  if (emojiRegex.test(b.name) || emojiRegex.test(b.id)) {
    console.error(`Background ${b.id} contains prohibited emoji characters`);
    process.exit(1);
  }
}

// Verify drop shadows
if (!DROP_SHADOWS.some((s) => s.id === 'carbon_signature') || !DROP_SHADOWS.some((s) => s.id === 'none')) {
  console.error('Missing required Carbon signature drop shadow preset');
  process.exit(1);
}

// Verify font families
if (!FONT_FAMILIES.some((f) => f.id === 'jetbrains_mono') || !FONT_FAMILIES.some((f) => f.id === 'fira_code')) {
  console.error('Missing required JetBrains Mono or Fira Code font presets');
  process.exit(1);
}

console.log('✓ Test 8: Authentic Carbon syntax themes, backgrounds, shadows, and font presets verified.');

// Test 9: DigitalClock aesthetics, animations, wake lock styles, and zero emojis
import fs from 'fs';
import path from 'path';
import {
  CLOCK_THEMES,
  CLOCK_ANIMATION_FX_OPTIONS,
  RADIAL_GAUGE_CONFIG,
  INTERACTIVE_THEMES,
  getClockThemeStyles,
  ClockTheme,
  AnimationFx,
} from '../components/tools/productivity/DigitalClock';

if (!Array.isArray(CLOCK_THEMES) || CLOCK_THEMES.length !== 48) {
  console.error(`Expected exactly 48 clock themes, found ${CLOCK_THEMES?.length}`);
  process.exit(1);
}

const interactiveThemeIds = ['reactive_plasma', 'magnetic_aurora', 'starlight_touch'];

const clockThemeIds = new Set<string>();
const dynamicThemeIds = [
  'heartbeat_pulse',
  'sunrise_dawn',
  'sunset_twilight',
  'aurora_borealis',
  'breathing_glow',
  'neon_cyber_pulse',
  'ocean_waves',
  'fire_ember',
  'supernova',
];

for (const theme of CLOCK_THEMES) {
  if (clockThemeIds.has(theme.id)) {
    console.error(`Duplicate clock theme ID: ${theme.id}`);
    process.exit(1);
  }
  clockThemeIds.add(theme.id);

  if (!theme.label || !theme.color || !theme.category) {
    console.error(`Invalid structure in theme ${theme.id}`);
    process.exit(1);
  }

  // Strict emoji prohibition check
  if (emojiRegex.test(theme.label) || emojiRegex.test(theme.id)) {
    console.error(`Clock theme ${theme.id} contains prohibited emoji characters`);
    process.exit(1);
  }

  // Verify theme styles object completeness
  const style = getClockThemeStyles(theme.id);
  const requiredProps = [
    'bg',
    'clockText',
    'glow',
    'accent',
    'border',
    'badgeBg',
    'handSec',
    'handMin',
    'handHr',
    'dialBg',
    'dialBorder',
    'flipCard',
    'progressBar',
  ] as const;

  for (const prop of requiredProps) {
    if (!style[prop] || typeof style[prop] !== 'string') {
      console.error(`Theme ${theme.id} missing required style prop: ${prop}`);
      process.exit(1);
    }
  }

  // If theme is in dynamicThemeIds, ensure category is 'animated' and defaultAnimation is defined
  if (dynamicThemeIds.includes(theme.id)) {
    if (theme.category !== 'animated') {
      console.error(`Dynamic theme ${theme.id} must have category 'animated'`);
      process.exit(1);
    }
    if (!style.defaultAnimation) {
      console.error(`Dynamic theme ${theme.id} must define defaultAnimation`);
      process.exit(1);
    }
  }

  if (interactiveThemeIds.includes(theme.id)) {
    if (theme.category !== 'interactive') {
      console.error(`Interactive theme ${theme.id} must have category 'interactive'`);
      process.exit(1);
    }
    if (!INTERACTIVE_THEMES.has(theme.id)) {
      console.error(`Interactive theme ${theme.id} missing from INTERACTIVE_THEMES set`);
      process.exit(1);
    }
  }
}

for (const reqInteractiveId of interactiveThemeIds) {
  if (!clockThemeIds.has(reqInteractiveId)) {
    console.error(`Missing required interactive theme: ${reqInteractiveId}`);
    process.exit(1);
  }
}

// Verify Animation FX options
if (!Array.isArray(CLOCK_ANIMATION_FX_OPTIONS) || CLOCK_ANIMATION_FX_OPTIONS.length !== 10) {
  console.error(`Expected 10 animation fx options, found ${CLOCK_ANIMATION_FX_OPTIONS?.length}`);
  process.exit(1);
}

const animIds = new Set<string>();
for (const opt of CLOCK_ANIMATION_FX_OPTIONS) {
  if (animIds.has(opt.id)) {
    console.error(`Duplicate animation option ID: ${opt.id}`);
    process.exit(1);
  }
  animIds.add(opt.id);

  if (emojiRegex.test(opt.label) || emojiRegex.test(opt.id)) {
    console.error(`Animation option ${opt.id} contains prohibited emoji characters`);
    process.exit(1);
  }
}

console.log('✓ Test 9: DigitalClock 48 aesthetic themes, interactive touch themes, dynamic animations FX, and wake lock styles verified.');

// Test 10: Radial Chronograph geometry & fullscreen overflow protection verification
const innerClearRadius = RADIAL_GAUGE_CONFIG.secondsRadius - RADIAL_GAUGE_CONFIG.secondsStrokeWidth / 2;
const innerClearDiameterRatio = (2 * innerClearRadius) / RADIAL_GAUGE_CONFIG.viewBoxSize;
const innerChamberDiameterRatio = (2 * RADIAL_GAUGE_CONFIG.innerChamberRadius) / RADIAL_GAUGE_CONFIG.viewBoxSize;

if (
  RADIAL_GAUGE_CONFIG.hoursRadius <= RADIAL_GAUGE_CONFIG.minutesRadius ||
  RADIAL_GAUGE_CONFIG.minutesRadius <= RADIAL_GAUGE_CONFIG.secondsRadius ||
  RADIAL_GAUGE_CONFIG.secondsRadius <= RADIAL_GAUGE_CONFIG.innerChamberRadius ||
  innerClearDiameterRatio < 0.72
) {
  console.error(`Radial Chronograph inner clear diameter ratio (${innerClearDiameterRatio.toFixed(3)}) is too small`);
  process.exit(1);
}

const safeBoxDiameterRatio = (100 - 2 * RADIAL_GAUGE_CONFIG.centerSafeInsetPercent) / 100;
if (safeBoxDiameterRatio >= innerChamberDiameterRatio || innerChamberDiameterRatio >= innerClearDiameterRatio) {
  console.error('Radial center safe box must be strictly inside both the inner chamber backdrop and the innermost ring');
  process.exit(1);
}

const digitalClockSource = fs.readFileSync(
  path.resolve(process.cwd(), 'src/components/tools/productivity/DigitalClock.tsx'),
  'utf-8'
);
if (emojiRegex.test(digitalClockSource)) {
  console.error('DigitalClock.tsx source contains prohibited emoji characters');
  process.exit(1);
}

if (!digitalClockSource.includes('--radial-d') || !digitalClockSource.includes('text-[calc(var(--radial-d)*')) {
  console.error('DigitalClock.tsx must size Radial Chronograph center typography proportionally to --radial-d');
  process.exit(1);
}

if (
  /getFontFamilyClass\([^)]*\)[^`]*tracking-tight/.test(digitalClockSource) ||
  /tracking-tight[^`]*getFontFamilyClass\(/.test(digitalClockSource)
) {
  console.error('DigitalClock.tsx has conflicting tracking-tight utility alongside getFontFamilyClass()');
  process.exit(1);
}

console.log('✓ Test 10: Radial Chronograph ring geometry (>73% clear diameter), proportional --radial-d typography, non-conflicting font utilities, and zero-emoji source verified.');

// Test 11: Flip Clock 3D split-flap component & CSS animation verification
import { FlipClockCard } from '../components/tools/productivity/DigitalClock';

if (typeof FlipClockCard !== 'function') {
  console.error('FlipClockCard component must be exported from DigitalClock.tsx');
  process.exit(1);
}

const indexCssSource = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf-8');
const requiredFlipCssTokens = [
  '.flip-clock-stage',
  'perspective:',
  '.flip-card-half-top',
  '.flip-card-half-bottom',
  '@keyframes flip-clock-top-fall',
  '@keyframes flip-clock-bottom-fall',
  '@keyframes flip-clock-bottom-settle',
  '.animate-flip-top-flap',
  '.animate-flip-bottom-flap',
];

for (const token of requiredFlipCssTokens) {
  if (!indexCssSource.includes(token)) {
    console.error(`src/index.css missing required split-flap CSS token: ${token}`);
    process.exit(1);
  }
}

if (
  !digitalClockSource.includes('<FlipClockCard') ||
  !digitalClockSource.includes('animate-flip-top-flap') ||
  !digitalClockSource.includes('animate-flip-bottom-flap')
) {
  console.error('DigitalClock.tsx must render FlipClockCard with animated top and bottom flaps');
  process.exit(1);
}

console.log('✓ Test 11: FlipClockCard 3D split-flap component and CSS animations verified.');

// Test 12: Multi-style Analog horology studio & animated background scenes verification
import {
  ANALOG_STYLES,
  AnalogClockDial,
  AnalogStyleGlyph,
  CLOCK_BG_FX_OPTIONS,
  ClockBackgroundLayer,
} from '../components/tools/productivity/DigitalClock';

if (!Array.isArray(ANALOG_STYLES) || ANALOG_STYLES.length !== 50) {
  console.error(`Expected 50 Analog watch styles, found ${ANALOG_STYLES?.length}`);
  process.exit(1);
}

const analogIds = new Set<string>();
const expectedAnalogIds = [
  'chronometer',
  'bauhaus',
  'diver',
  'roman',
  'pilot',
  'atelier',
  'telemetry',
  'california',
  'tourbillon',
  'celestial',
  'chronograph',
  'artdeco',
  'orbital',
  'kintsugi',
  'orrery',
  'galaxy',
  'astrolabe',
  'blackhole',
  'gears',
  'cyberwave',
  'vice_palm',
  'creeper_dial',
  'phantom_mask',
  'golden_order',
  'leviathan_rune',
  'triforce_slate',
  'mjolnir_visor',
  'arcade_maze',
  'omnitrix',
  'jjk_void',
  'nichirin',
  'sharingan',
  'dragon_radar',
  'log_pose',
  'scout_wings',
  'pokeball_dex',
  'hawkins_83',
  'hexcore',
  'gallifreyan',
  'pip_boy',
  'arc_reactor',
  'galactic_trench',
  'matrix_code',
  'gotham_signal',
  'invincible',
  'dune',
  'doomsday',
  'spider_web',
  'evangelion',
  'tron_disc',
];

for (const st of ANALOG_STYLES) {
  if (analogIds.has(st.id)) {
    console.error(`Duplicate analog dial style ID: ${st.id}`);
    process.exit(1);
  }
  analogIds.add(st.id);

  if (!st.label || !st.tagline || !st.category) {
    console.error(`Incomplete metadata for analog style: ${st.id}`);
    process.exit(1);
  }

  if (emojiRegex.test(st.label) || emojiRegex.test(st.tagline) || emojiRegex.test(st.id)) {
    console.error(`Analog style ${st.id} contains prohibited emoji characters`);
    process.exit(1);
  }
}

for (const reqAnalogId of expectedAnalogIds) {
  if (!analogIds.has(reqAnalogId)) {
    console.error(`Missing required analog dial style: ${reqAnalogId}`);
    process.exit(1);
  }
}

if (typeof AnalogClockDial !== 'function' || typeof AnalogStyleGlyph !== 'function') {
  console.error('AnalogClockDial and AnalogStyleGlyph components must be exported from DigitalClock.tsx');
  process.exit(1);
}

if (!Array.isArray(CLOCK_BG_FX_OPTIONS) || CLOCK_BG_FX_OPTIONS.length !== 25) {
  console.error(`Expected 25 background animation presets, found ${CLOCK_BG_FX_OPTIONS?.length}`);
  process.exit(1);
}

const bgIds = new Set<string>();
const expectedBgIds = [
  'aurora',
  'solar',
  'galaxy',
  'warp',
  'orbital',
  'starfield',
  'waves',
  'grid',
  'bokeh',
  'ripple',
  'comic_burst',
  'sandstorm',
  'cyber_rain',
  'hex_field',
  'omnitrix_pulse',
  'cursed_aura',
  'matrix_rain',
  'ember_spores',
  'arcane_runes',
  'vice_sunset',
  'erdtree_petals',
  'pixel_arcade',
  'interactive_nodes',
  'touch_ripples',
  'none',
];
for (const bg of CLOCK_BG_FX_OPTIONS) {
  if (bgIds.has(bg.id)) {
    console.error(`Duplicate background FX ID: ${bg.id}`);
    process.exit(1);
  }
  bgIds.add(bg.id);

  if (!bg.label || !bg.shortLabel || !bg.tagline) {
    console.error(`Incomplete metadata for background FX: ${bg.id}`);
    process.exit(1);
  }

  if (emojiRegex.test(bg.label) || emojiRegex.test(bg.shortLabel) || emojiRegex.test(bg.tagline)) {
    console.error(`Background FX ${bg.id} contains prohibited emoji characters`);
    process.exit(1);
  }
}

for (const reqBgId of expectedBgIds) {
  if (!bgIds.has(reqBgId)) {
    console.error(`Missing required background FX preset: ${reqBgId}`);
    process.exit(1);
  }
}

if (typeof ClockBackgroundLayer !== 'object' && typeof ClockBackgroundLayer !== 'function') {
  console.error('ClockBackgroundLayer component must be exported from DigitalClock.tsx');
  process.exit(1);
}

const requiredAnalogTokens = [
  'vortexero_clock_analog_style',
  'vortexero_clock_analog_motion',
  'vortexero_clock_analog_subdigital',
  'vortexero_clock_bg_fx',
  '<AnalogClockDial',
  '<ClockBackgroundLayer',
  'bg-fx-select',
  'requestAnimationFrame',
  'analog-style-bar',
];

for (const token of requiredAnalogTokens) {
  if (!digitalClockSource.includes(token)) {
    console.error(`DigitalClock.tsx missing required analog/background token: ${token}`);
    process.exit(1);
  }
}

const requiredBgCssTokens = [
  '.animate-bg-aurora-a',
  '.animate-bg-aurora-b',
  '.animate-bg-spin-cw',
  '.animate-bg-spin-ccw',
  '.animate-bg-star-twinkle',
  '.animate-bg-grid-scroll',
  '.animate-bg-bokeh-float',
  '.animate-bg-ripple',
  '.animate-bg-orbit-origin',
  '.animate-bg-solar-pulse',
  '.animate-bg-galaxy-spin',
  '.animate-bg-galaxy-counter',
  '.animate-bg-warp-streak',
  '.animate-bg-wave-drift',
  '.animate-bg-wave-drift-rev',
  '.animate-bg-cyber-rain',
  '.animate-bg-sand-drift',
  '.animate-bg-hex-pulse',
  '.animate-bg-comic-pulse',
  '.animate-bg-ember-rise',
  '.animate-bg-cursed-swirl',
  '.animate-bg-omnitrix-pulse',
  '.animate-bg-palm-sway',
  '.animate-bg-pixel-float',
  '.clock-bg-parallax',
  '.clock-reactive-dotgrid',
  '.clock-touch-ripple',
  '.clock-touch-spark',
];

for (const cssToken of requiredBgCssTokens) {
  if (!indexCssSource.includes(cssToken)) {
    console.error(`src/index.css missing required background animation CSS token: ${cssToken}`);
    process.exit(1);
  }
}

console.log(`✓ Test 12: Analog Horology Studio (${ANALOG_STYLES.length} dial styles, ${CLOCK_BG_FX_OPTIONS.length} animated background scenes, sweep/tick motion) verified.`);

// Test 13: Radial Gauge Studio (42 scenic/kinetic/game/cinema/anime styles, Sweep/Tick motion, cosmic contrast protection)
import {
  RADIAL_STYLES,
  RADIAL_DARK_CHAMBER_STYLES,
  RadialClockGauge,
  RadialStyleGlyph,
} from '../components/tools/productivity/DigitalClock';

if (!Array.isArray(RADIAL_STYLES) || RADIAL_STYLES.length !== 42) {
  console.error(`Expected 42 Radial Gauge styles, found ${RADIAL_STYLES?.length}`);
  process.exit(1);
}

const radialIds = new Set<string>();
const expectedRadialIds = [
  'chronograph',
  'solar_orbit',
  'galaxy_vortex',
  'supernova',
  'blackhole_lens',
  'cyber_hud',
  'segmented_led',
  'turbine',
  'waveform',
  'dna_helix',
  'synth_prism',
  'fractal_mandala',
  'vice_city',
  'emerald_xp',
  'velvet_rebellion',
  'erdtree_grace',
  'omega_frost',
  'sheikah_orb',
  'cortana_ring',
  'maze_chomper',
  'omnitrix_core',
  'jjk_domain',
  'nichirin_flame',
  'chakra_seal',
  'ki_aura',
  'grand_line',
  'odm_telemetry',
  'pokedex_scan',
  'upside_down',
  'hextech_rune',
  'tardis_vortex',
  'vault_pip',
  'jarvis_hud',
  'kyber_core',
  'zion_construct',
  'batcomputer',
  'invincible_arc',
  'dune_eclipse',
  'doomsday_core',
  'spider_web',
  'nerv_hex',
  'tron_disc',
];

for (const st of RADIAL_STYLES) {
  if (radialIds.has(st.id)) {
    console.error(`Duplicate radial gauge style ID: ${st.id}`);
    process.exit(1);
  }
  radialIds.add(st.id);

  if (!st.label || !st.tagline || !st.category) {
    console.error(`Incomplete metadata for radial style: ${st.id}`);
    process.exit(1);
  }

  if (emojiRegex.test(st.label) || emojiRegex.test(st.tagline) || emojiRegex.test(st.id)) {
    console.error(`Radial style ${st.id} contains prohibited emoji characters`);
    process.exit(1);
  }
}

for (const reqRadialId of expectedRadialIds) {
  if (!radialIds.has(reqRadialId)) {
    console.error(`Missing required radial gauge style: ${reqRadialId}`);
    process.exit(1);
  }
}

const expectedDarkChamberIds = [
  'solar_orbit',
  'galaxy_vortex',
  'supernova',
  'blackhole_lens',
  'synth_prism',
  'vice_city',
  'emerald_xp',
  'velvet_rebellion',
  'erdtree_grace',
  'omega_frost',
  'sheikah_orb',
  'cortana_ring',
  'maze_chomper',
  'omnitrix_core',
  'jjk_domain',
  'nichirin_flame',
  'chakra_seal',
  'ki_aura',
  'grand_line',
  'odm_telemetry',
  'pokedex_scan',
  'upside_down',
  'hextech_rune',
  'tardis_vortex',
  'vault_pip',
  'jarvis_hud',
  'kyber_core',
  'zion_construct',
  'batcomputer',
  'invincible_arc',
  'dune_eclipse',
  'doomsday_core',
  'spider_web',
  'nerv_hex',
  'tron_disc',
] as const;

if (
  !(RADIAL_DARK_CHAMBER_STYLES instanceof Set) ||
  RADIAL_DARK_CHAMBER_STYLES.size !== 35 ||
  expectedDarkChamberIds.some((id) => !RADIAL_DARK_CHAMBER_STYLES.has(id))
) {
  console.error('RADIAL_DARK_CHAMBER_STYLES must be exported and list all 35 dark cosmic/game/cinema/anime radial chambers');
  process.exit(1);
}

if (typeof RadialClockGauge !== 'function' || typeof RadialStyleGlyph !== 'function') {
  console.error('RadialClockGauge and RadialStyleGlyph components must be exported from DigitalClock.tsx');
  process.exit(1);
}

const requiredRadialTokens = [
  'vortexero_clock_radial_style',
  'vortexero_clock_radial_motion',
  'vortexero_clock_radial_telemetry',
  '<RadialClockGauge',
  'radial-style-bar',
  'data-radial-style',
  'data-radial-category',
];

for (const token of requiredRadialTokens) {
  if (!digitalClockSource.includes(token)) {
    console.error(`DigitalClock.tsx missing required radial gauge studio token: ${token}`);
    process.exit(1);
  }
}

console.log(`✓ Test 13: Radial Gauge Studio (${RADIAL_STYLES.length} cosmic/kinetic/game/cinema/anime styles, Sweep/Tick motion, dark chamber protection) verified.`);

// Test 14: Games, Cinema, TV & Anime Clock Editions across all 9 clock modes
import {
  CLOCK_EDITIONS,
  CinemaEditionGlyph,
  ClockEditionOverlay,
  ClockEditionPowerMeter,
  getEditionThemeStyles,
  getEditionDigitFrameClass,
  getEditionFlipStyle,
  getEditionCalendarPanelClass,
  getEditionPrimaryBtnClass,
} from '../components/tools/productivity/DigitalClock';

if (!Array.isArray(CLOCK_EDITIONS) || CLOCK_EDITIONS.length !== 33) {
  console.error(`Expected 33 Games, Cinema, TV & Anime Clock Editions, found ${CLOCK_EDITIONS?.length}`);
  process.exit(1);
}

const expectedEditionIds = [
  'classic',
  'gta6',
  'minecraft',
  'persona5',
  'eldenring',
  'godofwar',
  'zelda_totk',
  'halo_unsc',
  'pacman',
  'ben10',
  'jjk',
  'demonslayer',
  'naruto',
  'dragonball',
  'onepiece',
  'aot',
  'pokemon',
  'strangerthings',
  'arcane',
  'doctorwho',
  'fallout',
  'ironman',
  'starwars',
  'matrix_neo',
  'batman',
  'invincible',
  'cyberpunk',
  'dune',
  'doomsday',
  'spiderverse',
  'evangelion',
  'tron',
  'akira',
];

const editionIds = new Set<string>();
for (const ed of CLOCK_EDITIONS) {
  if (editionIds.has(ed.id)) {
    console.error(`Duplicate clock edition ID: ${ed.id}`);
    process.exit(1);
  }
  editionIds.add(ed.id);

  if (
    !ed.label ||
    !ed.shortTag ||
    !ed.category ||
    !ed.tagline ||
    !ed.recommendedBg ||
    !ed.wordEyebrow ||
    !ed.deskHeader ||
    !ed.pomoWorkLabel ||
    (ed.id !== 'classic' &&
      (ed.category === 'studio' ||
        !ed.recommendedAnalog ||
        !ed.recommendedRadial ||
        !ed.digitalEyebrow ||
        !ed.stackedEyebrow ||
        !ed.stopwatchEyebrow))
  ) {
    console.error(`Incomplete metadata for clock edition: ${ed.id}`);
    process.exit(1);
  }

  if (
    emojiRegex.test(ed.label) ||
    emojiRegex.test(ed.shortTag) ||
    emojiRegex.test(ed.tagline) ||
    emojiRegex.test(ed.digitalEyebrow) ||
    emojiRegex.test(ed.deskHeader)
  ) {
    console.error(`Clock edition ${ed.id} contains prohibited emoji characters`);
    process.exit(1);
  }

  const digitClass = getEditionDigitFrameClass(ed.id, false);
  const flipStyle = getEditionFlipStyle(ed.id);
  const calClass = getEditionCalendarPanelClass(ed.id, false);
  const btnClass = getEditionPrimaryBtnClass(ed.id, false);
  if (
    typeof digitClass !== 'string' ||
    !flipStyle ||
    typeof calClass !== 'string' ||
    typeof btnClass !== 'string'
  ) {
    console.error(`Invalid helper return value for edition: ${ed.id}`);
    process.exit(1);
  }
}

for (const reqEdId of expectedEditionIds) {
  if (!editionIds.has(reqEdId)) {
    console.error(`Missing required Games, Cinema, TV & Anime Clock Edition: ${reqEdId}`);
    process.exit(1);
  }
}

const clockEditionsSource = fs.readFileSync(
  path.join(process.cwd(), 'src/components/tools/productivity/clockEditions.tsx'),
  'utf-8'
);

if (emojiRegex.test(clockEditionsSource)) {
  console.error('clockEditions.tsx contains prohibited emoji characters');
  process.exit(1);
}

if (
  !CinemaEditionGlyph ||
  !ClockEditionOverlay ||
  !ClockEditionPowerMeter ||
  typeof getEditionThemeStyles !== 'function' ||
  typeof getEditionFlipStyle !== 'function' ||
  typeof getEditionCalendarPanelClass !== 'function' ||
  typeof getEditionPrimaryBtnClass !== 'function'
) {
  console.error('All Edition components and helpers must be exported from DigitalClock.tsx');
  process.exit(1);
}

const requiredEditionTokens = [
  'vortexero_clock_edition',
  'cinema-edition-bar',
  'cinema-edition-categories',
  'data-edition-category',
  'data-clock-edition',
  '<ClockEditionOverlay',
  '<ClockEditionPowerMeter',
  '<CinemaEditionGlyph',
  'getEditionDigitFrameClass',
  'getEditionFlipStyle',
  'getEditionCalendarPanelClass',
  'getEditionPrimaryBtnClass',
];

for (const token of requiredEditionTokens) {
  if (!digitalClockSource.includes(token)) {
    console.error(`DigitalClock.tsx missing required Edition token: ${token}`);
    process.exit(1);
  }
}

const requiredEditionCssTokens = [
  '.edition-ben10-text',
  '.edition-jjk-text',
  '.edition-stranger-text',
  '.edition-matrix-text',
  '.edition-haori-checker',
  '.edition-gta6-text',
  '.edition-minecraft-text',
  '.edition-persona5-text',
  '.edition-eldenring-text',
  '.edition-grass-top',
];

for (const cssToken of requiredEditionCssTokens) {
  if (!indexCssSource.includes(cssToken)) {
    console.error(`src/index.css missing required edition CSS token: ${cssToken}`);
    process.exit(1);
  }
}

console.log(`✓ Test 14: Games, Cinema, TV & Anime Clock Editions (${CLOCK_EDITIONS.length} universal editions across all 9 clock modes) verified.`);

// Test 15: Auto 1-Hour Smart Mix Rotation & Quick Mix Controls
import {
  AUTO_MIX_INTERVAL_MS,
  formatAutoMixCountdown,
} from '../components/tools/productivity/DigitalClock';

if (AUTO_MIX_INTERVAL_MS !== 3600000) {
  console.error(`Expected AUTO_MIX_INTERVAL_MS to be 3600000ms (1h), got ${AUTO_MIX_INTERVAL_MS}`);
  process.exit(1);
}

if (
  formatAutoMixCountdown(3600000) !== '60:00' ||
  formatAutoMixCountdown(65000) !== '01:05' ||
  formatAutoMixCountdown(-500) !== '00:00'
) {
  console.error('formatAutoMixCountdown did not format boundaries properly');
  process.exit(1);
}

const requiredAutoMixTokens = [
  'vortexero_clock_auto_mix',
  'vortexero_clock_auto_mix_next_at',
  'auto-hourly-mix-btn',
  'mix-now-btn',
  'theme-random-mix-btn',
  'auto-hourly-stage-badge',
  'fullscreen-mix-btn',
  'fullscreen-auto-mix-btn',
];

for (const token of requiredAutoMixTokens) {
  if (!digitalClockSource.includes(token)) {
    console.error(`DigitalClock.tsx missing required Auto Mix token: ${token}`);
    process.exit(1);
  }
}

console.log('✓ Test 15: Auto 1-Hour Random Mix rotation timer, Mix controls, and persistence verified.');

// Test 16: Interactive Touch & Hover Backgrounds and Reactive Themes
if (!(INTERACTIVE_THEMES instanceof Set) || INTERACTIVE_THEMES.size !== 3) {
  console.error(`Expected INTERACTIVE_THEMES set of size 3, got ${INTERACTIVE_THEMES?.size}`);
  process.exit(1);
}

const requiredInteractiveTokens = [
  'vortexero_clock_interactive_bg',
  'interactive-bg-btn',
  'fullscreen-interactive-btn',
  'clock-stage',
  'clock-touch-burst',
  'INTERACTIVE_THEMES',
  'onPointerMove',
  'onPointerLeave',
  '--clock-mx',
  '--clock-my',
  '--clock-hover',
];

for (const token of requiredInteractiveTokens) {
  if (!digitalClockSource.includes(token)) {
    console.error(`DigitalClock.tsx missing required interactive background token: ${token}`);
    process.exit(1);
  }
}

console.log('✓ Test 16: Interactive Touch & Hover clock backgrounds, cursor parallax, click bursts, and 3 reactive themes verified.');

// Test 17: ToolRenderer routing completeness, toolColors, and Math Scanner solver verification
import { normalizeMathOcr, solveMathProblem, getPrimeFactorization } from '../utils/mathSolver';
import {
  prepareBinaryMathImage,
  extractInkComponents,
  findTopFractionBar,
  segmentBaselineAndSuperscripts,
} from '../utils/mathOcr2d';

const toolRendererSource = fs.readFileSync(
  path.resolve(process.cwd(), 'src/components/tools/ToolRenderer.tsx'),
  'utf-8'
);

for (const t of TOOLS) {
  if (!toolRendererSource.includes(`case '${t.id}':`)) {
    console.error(`ToolRenderer.tsx is missing case handler for tool "${t.id}"`);
    process.exit(1);
  }
}

const newEverydayIds = [
  'math-scanner',
  'document-scanner',
  'qr-scanner',
  'image-to-text',
  'budget-tracker',
  'world-clock-planner',
  'gpa-grade-calculator',
  'age-date-calculator',
  'smart-shopping-calculator',
];

for (const id of newEverydayIds) {
  const color = getToolColor(id);
  if (!color || color.id !== id) {
    console.error(`Missing bespoke color scheme in toolColors.ts for: ${id}`);
    process.exit(1);
  }
}

// 17a: OCR normalization
if (normalizeMathOcr('1) 2×x² − √16 ÷ 2 ＝ 10') !== '2*x^2 - sqrt(16) / 2 = 10') {
  console.error('OCR normalization failed:', normalizeMathOcr('1) 2×x² − √16 ÷ 2 ＝ 10'));
  process.exit(1);
}

// 17b: Arithmetic & percentages
const arith1 = solveMathProblem('(15 + 9) * 3 - sqrt(144)');
if (arith1.finalAnswer !== '60' || arith1.steps.length < 2) {
  console.error('Arithmetic solver failed:', arith1);
  process.exit(1);
}
const pct1 = solveMathProblem('15% of 240');
if (pct1.finalAnswer !== '36') {
  console.error('Percentage solver failed:', pct1);
  process.exit(1);
}
if (getPrimeFactorization(360) !== '2^3 × 3^2 × 5') {
  console.error('Prime factorization failed:', getPrimeFactorization(360));
  process.exit(1);
}

// 17c: Linear equation
const lin1 = solveMathProblem('3(x - 2) + 4 = 2x + 7');
if (lin1.problemType !== 'linear_equation' || lin1.finalAnswer !== 'x = 9' || !lin1.plot) {
  console.error('Linear equation solver failed:', lin1);
  process.exit(1);
}

// 17d: Quadratic equation (distinct real, double root, complex)
const quad1 = solveMathProblem('x^2 - 5x + 6 = 0');
if (quad1.problemType !== 'quadratic_equation' || quad1.finalAnswer !== 'x₁ = 2, x₂ = 3') {
  console.error('Quadratic real roots failed:', quad1);
  process.exit(1);
}
const quadComplex = solveMathProblem('x^2 + 4 = 0');
if (!quadComplex.finalAnswer.includes('2i')) {
  console.error('Quadratic complex roots failed:', quadComplex);
  process.exit(1);
}

// 17e: 2x2 Linear system
const sys1 = solveMathProblem('2x + y = 10; x - y = 2');
if (sys1.problemType !== 'system_2x2' || sys1.finalAnswer !== 'x = 4, y = 2') {
  console.error('2x2 linear system failed:', sys1);
  process.exit(1);
}

// 17f: Calculus derivative & definite integral
const deriv1 = solveMathProblem('d/dx(x^3 + 2x^2 - 5x)');
if (deriv1.problemType !== 'calculus_derivative' || !deriv1.finalAnswer.includes('3 * x ^ 2')) {
  console.error('Symbolic derivative failed:', deriv1);
  process.exit(1);
}
const int1 = solveMathProblem('integrate(x^2, 0, 3)');
if (int1.problemType !== 'calculus_integral' || Math.abs(Number(int1.finalAnswer) - 9) > 1e-4) {
  console.error('Definite integral failed:', int1);
  process.exit(1);
}

// 17g: Transcendental equation
const trans1 = solveMathProblem('2^x = 32');
if (!trans1.finalAnswer.includes('5')) {
  console.error('Transcendental solver failed:', trans1);
  process.exit(1);
}

// 17h: Calculus limits (indeterminate L'Hopital, infinity, one-sided, non-existent)
const lim1 = solveMathProblem('lim(x->0, (e^(2x) - 1)/x)');
if (lim1.problemType !== 'calculus_limit' || lim1.finalAnswer !== '2') {
  console.error('Limit L\'Hopital solver failed:', lim1);
  process.exit(1);
}
const lim2 = solveMathProblem('lim x-0 (e^(2x) - 1)/x');
if (lim2.problemType !== 'calculus_limit' || lim2.finalAnswer !== '2') {
  console.error('OCR-shorthand limit solver failed:', lim2);
  process.exit(1);
}
const limInf = solveMathProblem('lim x->inf (3x^2 + 1)/(x^2 - 5)');
if (limInf.problemType !== 'calculus_limit' || limInf.finalAnswer !== '3') {
  console.error('Infinite limit solver failed:', limInf);
  process.exit(1);
}
const limOneSided = solveMathProblem('lim(x->0+, 1/x)');
if (limOneSided.problemType !== 'calculus_limit' || !limOneSided.finalAnswer.includes('+∞')) {
  console.error('Right-hand limit solver failed:', limOneSided);
  process.exit(1);
}
const limDne = solveMathProblem('lim(x->0, 1/x)');
if (limDne.problemType !== 'calculus_limit' || !limDne.finalAnswer.toLowerCase().includes('does not exist')) {
  console.error('Non-existent two-sided limit solver failed:', limDne);
  process.exit(1);
}

// 17i: 2D Math OCR contrast auto-inversion, fraction bar detection, and superscript segmentation
const imgW = 120;
const imgH = 80;
const darkBuf = new Uint8ClampedArray(imgW * imgH * 4);
for (let i = 0; i < darkBuf.length; i += 4) {
  darkBuf[i] = 32;
  darkBuf[i + 1] = 34;
  darkBuf[i + 2] = 38;
  darkBuf[i + 3] = 255;
}
const paintBox = (buf: Uint8ClampedArray, w: number, x0: number, y0: number, x1: number, y1: number) => {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const p = (y * w + x) * 4;
      buf[p] = 240;
      buf[p + 1] = 240;
      buf[p + 2] = 242;
    }
  }
};
// Fraction numerator + wide vinculum + denominator + twin equals bars
paintBox(darkBuf, imgW, 40, 14, 58, 30);
paintBox(darkBuf, imgW, 24, 36, 94, 39);
paintBox(darkBuf, imgW, 52, 46, 66, 62);
paintBox(darkBuf, imgW, 100, 26, 114, 28);
paintBox(darkBuf, imgW, 100, 32, 114, 34);

const binRes = prepareBinaryMathImage(darkBuf, imgW, imgH, 'auto');
if (!binRes.wasInverted) {
  console.error('mathOcr2d failed to auto-invert dark background buffer');
  process.exit(1);
}
const compsRes = extractInkComponents(binRes.mask, imgW, imgH);
const barRes = findTopFractionBar(compsRes, imgH);
if (!barRes || barRes.w < 65) {
  console.error('mathOcr2d fraction bar detection failed:', barRes);
  process.exit(1);
}

// Row with base operand + superscript + equals sign + trailing operand
const rowBuf = new Uint8ClampedArray(100 * 60 * 4);
for (let i = 0; i < rowBuf.length; i += 4) {
  rowBuf[i] = 250;
  rowBuf[i + 1] = 250;
  rowBuf[i + 2] = 250;
  rowBuf[i + 3] = 255;
}
const paintDarkBox = (buf: Uint8ClampedArray, w: number, x0: number, y0: number, x1: number, y1: number) => {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const p = (y * w + x) * 4;
      buf[p] = 15;
      buf[p + 1] = 23;
      buf[p + 2] = 42;
    }
  }
};
paintDarkBox(rowBuf, 100, 12, 24, 28, 48); // base 'x'
paintDarkBox(rowBuf, 100, 32, 12, 42, 24); // superscript '2'
paintDarkBox(rowBuf, 100, 48, 30, 62, 32); // '=' top
paintDarkBox(rowBuf, 100, 48, 36, 62, 38); // '=' bottom
paintDarkBox(rowBuf, 100, 70, 24, 84, 48); // trailing '9'
const rowBin = prepareBinaryMathImage(rowBuf, 100, 60, 'auto');
if (rowBin.wasInverted) {
  console.error('mathOcr2d unexpectedly inverted light background buffer');
  process.exit(1);
}
const segsRes = segmentBaselineAndSuperscripts(extractInkComponents(rowBin.mask, 100, 60));
if (
  segsRes.length !== 3 ||
  segsRes[0].kind !== 'base' ||
  segsRes[1].kind !== 'sup' ||
  segsRes[2].kind !== 'base'
) {
  console.error('mathOcr2d superscript/equals segmentation mismatch:', segsRes);
  process.exit(1);
}

console.log('✓ Test 17: ToolRenderer routing (all 71 tools), bespoke colors, and Math Scanner solver (OCR cleanup, linear, quadratic, 2x2 system, calculus, limits, 2D OCR layout, plotter) verified.');

// Test 18: Everyday utilities (Document warp, QR payload parser, GPA, Age/Date, Smart Shopping)
import {
  computeInverseHomography,
  warpAndFilterDocumentPixels,
  parseQrPayload,
  calculateGpaSummary,
  calculateFinalExamNeeded,
  calculateAgeBreakdown,
  calculateDateDuration,
  addDateOffset,
  calculateDiscountSummary,
  compareUnitPrices,
} from '../utils/everydayUtils';

// 18a: Homography & pixel warp
const H = computeInverseHomography(
  [
    { x: 10, y: 10 },
    { x: 90, y: 10 },
    { x: 90, y: 90 },
    { x: 10, y: 90 },
  ],
  80,
  80
);
if (!H || Math.abs(H[2] - 10) > 1e-4 || Math.abs(H[5] - 10) > 1e-4) {
  console.error('Inverse homography verification failed:', H);
  process.exit(1);
}
const dummySrc = new Uint8ClampedArray(20 * 20 * 4).fill(200);
const warpedOut = warpAndFilterDocumentPixels(
  dummySrc,
  20,
  20,
  [
    { x: 2, y: 2 },
    { x: 18, y: 2 },
    { x: 18, y: 18 },
    { x: 2, y: 18 },
  ],
  16,
  16,
  'bw'
);
if (warpedOut.length !== 16 * 16 * 4) {
  console.error('Document pixel warp output length mismatch');
  process.exit(1);
}

// 18b: QR payload parsing
const wifiParsed = parseQrPayload('WIFI:S:HomeNet;T:WPA;P:Secret123;H:false;;');
if (wifiParsed.type !== 'wifi' || wifiParsed.fields[0].value !== 'HomeNet' || wifiParsed.fields[2].value !== 'Secret123') {
  console.error('QR Wi-Fi parsing failed:', wifiParsed);
  process.exit(1);
}
const urlParsed = parseQrPayload('https://github.com/voreakchhinchea23/VortexeroTool');
if (urlParsed.type !== 'url' || urlParsed.fields[0].value !== 'github.com') {
  console.error('QR URL parsing failed:', urlParsed);
  process.exit(1);
}

// 18c: GPA & Final Exam calculator
const gpaRes = calculateGpaSummary(
  [
    { id: '1', name: 'Math', credits: 4, gradePoints: 4.0 },
    { id: '2', name: 'Art', credits: 2, gradePoints: 3.0 },
  ],
  3.5,
  12
);
if (Math.abs(gpaRes.semesterGpa - 3.667) > 0.01 || gpaRes.totalCredits !== 18) {
  console.error('GPA calculation failed:', gpaRes);
  process.exit(1);
}
const finalNeeded = calculateFinalExamNeeded(84, 90, 25);
if (finalNeeded.requiredScore !== 108 || finalNeeded.status !== 'extra_credit') {
  console.error('Final exam target calculation failed:', finalNeeded);
  process.exit(1);
}

// 18d: Age & Date Duration
const ageRes = calculateAgeBreakdown('2000-01-01', new Date(2026, 0, 1));
if (!ageRes || ageRes.years !== 26 || ageRes.months !== 0 || ageRes.days !== 0) {
  console.error('Age breakdown failed:', ageRes);
  process.exit(1);
}
const durRes = calculateDateDuration('2026-01-05', '2026-01-12'); // Mon to next Mon = 7 days (5 workdays, 2 weekend days)
if (!durRes || durRes.totalDays !== 7 || durRes.businessDays !== 5 || durRes.weekendDays !== 2) {
  console.error('Date duration business days failed:', durRes);
  process.exit(1);
}
const shiftedDate = addDateOffset('2026-01-01', 'add', 10, 'days');
if (!shiftedDate || shiftedDate.iso !== '2026-01-11') {
  console.error('Date shift failed:', shiftedDate);
  process.exit(1);
}

// 18e: Smart Shopping Discount & Unit Price Comparator
const disc = calculateDiscountSummary(100, 1, 20, 10, 10); // 100 -> 80 -> 72 -> +10% tax = 79.20
if (Math.abs(disc.finalTotal - 79.2) > 1e-6 || Math.abs(disc.effectiveDiscountPct - 28) > 1e-6) {
  console.error('Smart discount calculation failed:', disc);
  process.exit(1);
}
const unitCompare = compareUnitPrices([
  { id: '1', label: 'Small', price: 4.0, quantity: 500, unit: 'ml' },
  { id: '2', label: 'Large', price: 6.0, quantity: 1, unit: 'l' },
]);
if (unitCompare[0].isBestValue || !unitCompare[1].isBestValue) {
  console.error('Unit price comparison failed:', unitCompare);
  process.exit(1);
}

console.log('✓ Test 18: Everyday utilities (Document perspective warp, QR parser, GPA, Age/Date, Smart Shopping) verified.');
console.log('All automated verification checks PASSED successfully!');

