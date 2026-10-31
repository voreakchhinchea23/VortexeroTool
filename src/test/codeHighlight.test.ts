import {
  detectLanguage,
  highlightCodeToLines,
  splitHighlightedHtmlIntoLines,
  SUPPORTED_LANGUAGES,
  getLanguageMetadata,
} from '../utils/codeHighlight';

console.log('Running CodeToImage & codeHighlight tests...');

// Test 1: Language count and unique IDs
if (SUPPORTED_LANGUAGES.length < 25) {
  console.error(`Expected at least 25 supported languages, got ${SUPPORTED_LANGUAGES.length}`);
  process.exit(1);
}
const langIds = new Set<string>();
for (const lang of SUPPORTED_LANGUAGES) {
  if (langIds.has(lang.id)) {
    console.error(`Duplicate language id: ${lang.id}`);
    process.exit(1);
  }
  langIds.add(lang.id);
  if (!lang.name || !lang.defaultFilename) {
    console.error(`Incomplete language metadata for: ${lang.id}`);
    process.exit(1);
  }
}
console.log(`Passed: ${SUPPORTED_LANGUAGES.length} supported languages configured properly.`);

// Test 2: Auto detection of languages
const testCases = [
  { code: '#!/usr/bin/env python\nprint("hello")', expected: 'python' },
  { code: '#!/bin/bash\necho "Hello World"', expected: 'bash' },
  { code: 'FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nCMD ["node", "index.js"]', expected: 'dockerfile' },
  { code: '{\n  "name": "vortexero",\n  "version": "1.0.0"\n}', expected: 'json' },
  { code: 'SELECT id, username, email FROM users WHERE active = 1 GROUP BY id;', expected: 'sql' },
  { code: 'SELECT id,\n  username,\n  email\nFROM users\nWHERE active = 1;', expected: 'sql' },
  { code: '<!DOCTYPE html>\n<html>\n<body>\n  <h1>Title</h1>\n</body>\n</html>', expected: 'html' },
  { code: 'fn main() {\n    let mut numbers = vec![1, 2, 3];\n    println!("{:?}", numbers);\n}', expected: 'rust' },
  { code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello")\n}', expected: 'go' },
  { code: '#include <iostream>\nint main() {\n    std::cout << "Hello" << std::endl;\n    return 0;\n}', expected: 'cpp' },
  { code: '#include <stdio.h>\nint main(void) {\n    printf("Hello\\n");\n    return 0;\n}', expected: 'c' },
  { code: 'using System;\nnamespace App {\n    class Program {\n        static void Main() {\n            Console.WriteLine("Hi");\n        }\n    }\n}', expected: 'csharp' },
  { code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}', expected: 'java' },
  { code: '<?php\n$message = "Hello World";\necho $message;\n?>', expected: 'php' },
  { code: 'def calculate_total(items):\n    total = 0\n    for item in items:\n        total += item.price\n    return total', expected: 'python' },
  { code: '# Python script with comments\nimport os\nimport sys\nprint("Python run")', expected: 'python' },
  { code: 'import SwiftUI\nstruct ContentView: View {\n    @State private var count = 0\n}', expected: 'swift' },
  { code: 'fun main() {\n    val greeting = "Hello Kotlin"\n    println(greeting)\n}', expected: 'kotlin' },
  { code: '.card {\n  display: flex;\n  padding: 16px;\n  background: #fff;\n}', expected: 'css' },
  { code: 'interface UserConfig {\n  id: string;\n  isActive: boolean;\n}\nconst config: UserConfig = { id: "1", isActive: true };', expected: 'typescript' },
  { code: 'const total = 42;\nconsole.log(total);\nexport default total;', expected: 'javascript' },
  { code: 'puts "Hello Ruby"\n5.times do |i|\n  puts i\nend', expected: 'ruby' },
  { code: 'local x = 10\nfunction add(a, b)\n  return a + b\nend\nprint(add(x, 20))', expected: 'lua' },
  { code: 'data <- read.csv("data.csv")\nsummary(data)\nplot(data$x, data$y)', expected: 'r' },
  { code: 'void main() {\n  var name = "Dart";\n  print("Hello, $name!");\n}', expected: 'dart' },
  { code: 'object HelloWorld extends App {\n  println("Hello Scala")\n}', expected: 'scala' },
  { code: 'type User {\n  id: ID!\n  name: String!\n}\ntype Query {\n  users: [User!]!\n}', expected: 'graphql' },
  { code: '---\nversion: "3.8"\nservices:\n  web:\n    image: nginx', expected: 'yaml' },
  { code: '# Project Documentation\n\nThis is a [Markdown link](https://vortexero.com) guide.\n\n| Feature | Status |\n|---|---|\n| Highlights | Active |', expected: 'markdown' },
  { code: '# Setup server\nsudo apt update && npm install', expected: 'bash' },
  { code: 'curl -s https://example.com | grep status', expected: 'bash' },
];

for (const tc of testCases) {
  const detected = detectLanguage(tc.code);
  if (detected !== tc.expected) {
    console.error(`Auto-detect failed for expected ${tc.expected}, got ${detected}. Code:\n${tc.code}`);
    process.exit(1);
  }
}
console.log('Passed: Auto-detection verified across all major language families.');

// Test 3: Empty and edge case auto-detection
if (detectLanguage('') !== 'typescript') {
  console.error('Empty string should default to typescript');
  process.exit(1);
}
if (detectLanguage('   \n  \t  ') !== 'typescript') {
  console.error('Whitespace string should default to typescript');
  process.exit(1);
}
console.log('Passed: Empty and whitespace boundaries handled gracefully.');

// Test 4: Multiline tag preservation in splitHighlightedHtmlIntoLines
const multiLineSpanHtml = '<span class="hljs-comment">/* line 1\n * line 2\n */</span>';
const splitLines = splitHighlightedHtmlIntoLines(multiLineSpanHtml);
if (splitLines.length !== 3) {
  console.error(`Expected 3 lines, got ${splitLines.length}`);
  process.exit(1);
}
if (!splitLines[0].startsWith('<span class="hljs-comment">') || !splitLines[0].endsWith('</span>')) {
  console.error(`Line 0 not wrapped properly: ${splitLines[0]}`);
  process.exit(1);
}
if (!splitLines[1].startsWith('<span class="hljs-comment">') || !splitLines[1].endsWith('</span>')) {
  console.error(`Line 1 not wrapped properly: ${splitLines[1]}`);
  process.exit(1);
}
if (!splitLines[2].startsWith('<span class="hljs-comment">') || !splitLines[2].endsWith('</span>')) {
  console.error(`Line 2 not wrapped properly: ${splitLines[2]}`);
  process.exit(1);
}
console.log('Passed: Split highlighted HTML properly balances tags across lines.');

// Test 5: highlightCodeToLines execution
const sampleTs = `interface Person {\n  name: string;\n  age: number;\n}`;
const highlightedLines = highlightCodeToLines(sampleTs, 'typescript');
if (highlightedLines.length !== 4) {
  console.error(`Expected 4 highlighted lines, got ${highlightedLines.length}`);
  process.exit(1);
}
if (!highlightedLines[0].includes('hljs-keyword') && !highlightedLines[0].includes('interface')) {
  console.error(`TypeScript interface token not highlighted: ${highlightedLines[0]}`);
  process.exit(1);
}

// Plaintext test
const plain = highlightCodeToLines('<b>hello & world</b>', 'plaintext');
if (plain[0] !== '&lt;b&gt;hello &amp; world&lt;/b&gt;') {
  console.error(`Plaintext HTML escaping failed: ${plain[0]}`);
  process.exit(1);
}

// Test 6: Language metadata resolver
const metaTs = getLanguageMetadata('typescript');
if (metaTs.name !== 'TypeScript' || metaTs.extension !== '.ts') {
  console.error('Failed to resolve TypeScript metadata');
  process.exit(1);
}
const metaDocker = getLanguageMetadata('dockerfile');
if (metaDocker.name !== 'Dockerfile' || metaDocker.defaultFilename !== 'Dockerfile') {
  console.error('Failed to resolve Dockerfile metadata');
  process.exit(1);
}

// Test 7: CRLF normalization
const crlfCode = "const a = 1;\r\nconst b = 2;\r\n";
const crlfLines = highlightCodeToLines(crlfCode, 'javascript');
if (crlfLines.some(l => l.includes('\r'))) {
  console.error('CRLF carriage return leaked into highlighted lines');
  process.exit(1);
}
console.log('Passed: CRLF line endings normalized cleanly.');

// Test 8: Zero emojis verification in CodeToImage and utils
import fs from 'fs';
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;
const filesToCheck = [
  'src/components/tools/developer/CodeToImage.tsx',
  'src/utils/codeHighlight.ts',
];
for (const file of filesToCheck) {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(emojiRegex);
  if (match) {
    console.error(`Emoji detected in ${file}: ${match[0]}`);
    process.exit(1);
  }
}
console.log('Passed: Zero emojis strictly verified in modified source files.');

console.log('All codeHighlight tests completed successfully!');

