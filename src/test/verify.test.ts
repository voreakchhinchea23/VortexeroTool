import { TOOLS } from '../data/toolsData';

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

// Test 5: Khmer Lunar Calendar functionality test
import { toKhmerLunarDate, formatKhmerDate, getKhmerHolidays } from 'khmer-chhankitek-calendar';
const testDate = toKhmerLunarDate('2026-05-01');
if (!testDate.lunarDateText || !testDate.buddhistEraYear || !testDate.khmerMonth || !testDate.animalYear) {
  console.error('Khmer Lunar Date conversion failed for 2026-05-01');
  process.exit(1);
}
const testHolidays = getKhmerHolidays(2026);
if (!Array.isArray(testHolidays) || testHolidays.length === 0) {
  console.error('Khmer Holidays retrieval failed for 2026');
  process.exit(1);
}
const enFormatted = formatKhmerDate('2026-05-01', { locale: 'en' });
if (!enFormatted.includes('BE')) {
  console.error('Khmer Date English formatting failed');
  process.exit(1);
}
console.log('✓ Test 5: Khmer lunar calendar conversions, holidays, and formatting verified.');

console.log('All automated verification checks PASSED successfully!');
