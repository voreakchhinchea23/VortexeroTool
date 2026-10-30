import { TOOLS } from '../data/toolsData';
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
  'khmer-lunar-calendar'
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

console.log('All automated verification checks PASSED successfully!');
