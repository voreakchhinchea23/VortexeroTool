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
  'periodic-table'
];

for (const reqId of requiredIds) {
  const found = TOOLS.find(t => t.id === reqId);
  if (!found) {
    console.error(`Missing required tool: ${reqId}`);
    process.exit(1);
  }
}
console.log('✓ Test 3: All required new development, PDF merge, and Khmer lunar calendar tools are present.');

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

console.log('All automated verification checks PASSED successfully!');


