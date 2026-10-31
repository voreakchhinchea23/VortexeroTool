import hljs from 'highlight.js';

export interface SupportedLanguage {
  id: string;
  name: string;
  extension: string;
  defaultFilename: string;
  aliases?: string[];
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { id: 'typescript', name: 'TypeScript', extension: '.ts', defaultFilename: 'snippet.ts', aliases: ['ts', 'tsx'] },
  { id: 'javascript', name: 'JavaScript', extension: '.js', defaultFilename: 'snippet.js', aliases: ['js', 'jsx', 'mjs', 'cjs'] },
  { id: 'python', name: 'Python', extension: '.py', defaultFilename: 'script.py', aliases: ['py'] },
  { id: 'rust', name: 'Rust', extension: '.rs', defaultFilename: 'main.rs', aliases: ['rs'] },
  { id: 'go', name: 'Go', extension: '.go', defaultFilename: 'main.go', aliases: ['golang'] },
  { id: 'java', name: 'Java', extension: '.java', defaultFilename: 'Main.java' },
  { id: 'cpp', name: 'C++', extension: '.cpp', defaultFilename: 'main.cpp', aliases: ['c++', 'cxx'] },
  { id: 'c', name: 'C', extension: '.c', defaultFilename: 'main.c' },
  { id: 'csharp', name: 'C#', extension: '.cs', defaultFilename: 'Program.cs', aliases: ['c#', 'cs', 'dotnet'] },
  { id: 'php', name: 'PHP', extension: '.php', defaultFilename: 'index.php' },
  { id: 'ruby', name: 'Ruby', extension: '.rb', defaultFilename: 'app.rb', aliases: ['rb'] },
  { id: 'swift', name: 'Swift', extension: '.swift', defaultFilename: 'App.swift' },
  { id: 'kotlin', name: 'Kotlin', extension: '.kt', defaultFilename: 'Main.kt', aliases: ['kt'] },
  { id: 'html', name: 'HTML', extension: '.html', defaultFilename: 'index.html', aliases: ['xml', 'htm', 'svg'] },
  { id: 'css', name: 'CSS', extension: '.css', defaultFilename: 'styles.css', aliases: ['scss', 'less'] },
  { id: 'sql', name: 'SQL', extension: '.sql', defaultFilename: 'query.sql' },
  { id: 'bash', name: 'Shell / Bash', extension: '.sh', defaultFilename: 'script.sh', aliases: ['sh', 'zsh', 'shell'] },
  { id: 'json', name: 'JSON', extension: '.json', defaultFilename: 'data.json' },
  { id: 'yaml', name: 'YAML', extension: '.yaml', defaultFilename: 'config.yaml', aliases: ['yml'] },
  { id: 'dockerfile', name: 'Dockerfile', extension: '', defaultFilename: 'Dockerfile', aliases: ['docker'] },
  { id: 'markdown', name: 'Markdown', extension: '.md', defaultFilename: 'README.md', aliases: ['md'] },
  { id: 'graphql', name: 'GraphQL', extension: '.graphql', defaultFilename: 'schema.graphql', aliases: ['gql'] },
  { id: 'dart', name: 'Dart', extension: '.dart', defaultFilename: 'main.dart' },
  { id: 'scala', name: 'Scala', extension: '.scala', defaultFilename: 'Main.scala' },
  { id: 'r', name: 'R', extension: '.r', defaultFilename: 'analysis.r' },
  { id: 'lua', name: 'Lua', extension: '.lua', defaultFilename: 'script.lua' },
  { id: 'plaintext', name: 'Plain Text', extension: '.txt', defaultFilename: 'snippet.txt', aliases: ['text', 'txt'] },
];

/**
 * Intelligent Language Detector:
 * 1. Shebangs on first line
 * 2. Distinctive syntax signatures & keywords
 * 3. Fast JSON/YAML parser validation
 * 4. Highlight.js statistical analysis fallback
 */
export function detectLanguage(code: string): string {
  const trimmed = code.trim();
  if (!trimmed) {
    return 'typescript';
  }

  const lines = trimmed.split('\n');
  const firstLine = lines[0].trim();

  // 1. Shebang line detection
  if (firstLine.startsWith('#!')) {
    const shebang = firstLine.toLowerCase();
    if (shebang.includes('python')) return 'python';
    if (shebang.includes('node') || shebang.includes('deno') || shebang.includes('bun')) return 'javascript';
    if (shebang.includes('bash') || shebang.includes('sh') || shebang.includes('zsh')) return 'bash';
    if (shebang.includes('ruby')) return 'ruby';
    if (shebang.includes('php')) return 'php';
    if (shebang.includes('perl')) return 'bash';
  }

  // 2. Dockerfile signatures
  const hasDockerfileInstruction = lines.some((line) => {
    const l = line.trim();
    return /^(FROM|RUN|CMD|LABEL|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|STOPSIGNAL|HEALTHCHECK|SHELL)\s+/i.test(l);
  });
  if (hasDockerfileInstruction && (lines[0].toUpperCase().startsWith('FROM ') || /FROM\s+[a-z0-9_.:/-]+/i.test(trimmed))) {
    return 'dockerfile';
  }

  // 3. JSON format validation
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not strictly valid JSON, but could still be JSON-like structure
      if (/^\s*"\w+"\s*:\s*/m.test(trimmed)) {
        return 'json';
      }
    }
  }

  // 4. HTML / XML detection
  if (
    /^<!DOCTYPE\s+html/i.test(trimmed) ||
    /^<html[\s>]/i.test(trimmed) ||
    /^<\?xml\b/i.test(trimmed) ||
    (/<\/?(div|span|button|input|head|body|table|tr|td|section|header|footer|nav|a|p|h1|h2|h3)[>\s]/i.test(trimmed) &&
      /<\/[a-z0-9]+>/i.test(trimmed))
  ) {
    return 'html';
  }

  // 5. SQL signatures
  const sqlKeywords =
    /\b(SELECT\s+.+\s+FROM|INSERT\s+INTO\s+|UPDATE\s+.+\s+SET|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|GROUP\s+BY|ORDER\s+BY)\b/i;
  if (sqlKeywords.test(trimmed) && !trimmed.includes('import ') && !trimmed.includes('def ')) {
    return 'sql';
  }

  // 6. Rust signatures
  if (
    /\b(fn\s+main\s*\(|impl\s+[A-Z]|let\s+mut\s+|pub\s+fn\s+|use\s+std::|match\s+.+\s+\{|println!|eprintln!|vec!|#\[derive\()/m.test(
      trimmed
    )
  ) {
    return 'rust';
  }

  // 7. Go signatures
  if (
    /^\s*package\s+[a-z0-9_]+/m.test(trimmed) ||
    /\bfunc\s+(\([^)]+\)\s*)?[A-Z][a-zA-Z0-9_]*\s*\(|fmt\.(Println|Printf|Sprintf)|make\(chan\b/m.test(trimmed)
  ) {
    return 'go';
  }

  // 8. C / C++ signatures
  if (/#include\s*<iostream>|#include\s*<vector>|std::cout|std::endl|std::cin|namespace\s+[a-z0-9_]+\s*\{/m.test(trimmed)) {
    return 'cpp';
  }
  if (/#include\s*<stdio\.h>|#include\s*<stdlib\.h>|int\s+main\s*\(\s*(void|int\s+argc)/m.test(trimmed)) {
    return 'c';
  }

  // 9. C# signatures
  if (/using\s+System(\.[A-Za-z0-9_]+)*;|namespace\s+[A-Za-z0-9_.]+\s*\{|Console\.WriteLine/m.test(trimmed)) {
    return 'csharp';
  }

  // 10. Java signatures
  if (
    /public\s+class\s+[A-Za-z0-9_]+|public\s+static\s+void\s+main\s*\(|System\.out\.println|import\s+java\.[a-z0-9_.]+;/m.test(
      trimmed
    )
  ) {
    return 'java';
  }

  // 11. PHP signatures
  if (/<\?php|\$[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*\s*=|echo\s+['"]|function\s+[a-zA-Z0-9_]+\s*\(.*?\)\s*\{/m.test(trimmed)) {
    return 'php';
  }

  // 12. Python signatures
  if (
    /^\s*def\s+[a-zA-Z0-9_]+\s*\(.*?\)\s*:|^\s*class\s+[A-Z][a-zA-Z0-9_]*(\(.*?\))?\s*:|^\s*elif\s+|if\s+__name__\s*==\s*['"]__main__['"]:/m.test(
      trimmed
    )
  ) {
    return 'python';
  }

  // 13. Ruby signatures
  if (/^\s*def\s+[a-zA-Z0-9_]+(\s*\(.*?\))?\s*$/m.test(trimmed) && /^\s*end\s*$/m.test(trimmed)) {
    return 'ruby';
  }

  // 14. Swift signatures
  if (/import\s+(SwiftUI|UIKit|Foundation)|guard\s+let\b|@State|@Binding/m.test(trimmed)) {
    return 'swift';
  }

  // 15. Kotlin signatures
  if (/fun\s+main\s*\(|val\s+[a-zA-Z0-9_]+\s*:\s*[A-Z]|suspend\s+fun/m.test(trimmed)) {
    return 'kotlin';
  }

  // 16. CSS signatures
  if (
    !trimmed.includes('import ') &&
    !trimmed.includes('const ') &&
    (/@media\s+|@keyframes\s+|[.#][a-zA-Z0-9_-]+\s*\{\s*[\s\S]*?(margin|padding|display|background|color|border):/m.test(
      trimmed
    ) ||
      /^\s*([a-zA-Z0-9_-]+|\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+)\s*\{/m.test(trimmed))
  ) {
    return 'css';
  }

  // 17. YAML signatures
  if (/^---/m.test(trimmed) || (/^[a-zA-Z0-9_-]+\s*:\s*(["'\d\w\s-]|$)/m.test(trimmed) && !trimmed.includes('{') && !trimmed.includes(';'))) {
    return 'yaml';
  }

  // 18. GraphQL signatures
  if (/^\s*(type\s+[A-Z][a-zA-Z0-9_]*\s*\{|query\s+[A-Za-z0-9_]*|mutation\s+[A-Za-z0-9_]*|schema\s*\{)/m.test(trimmed)) {
    return 'graphql';
  }

  // 19. Markdown signatures
  if (/^#{1,6}\s+.+$/m.test(trimmed) && !trimmed.includes(';') && !trimmed.includes('{')) {
    return 'markdown';
  }

  // 20. TypeScript signatures
  if (
    /\b(interface\s+[A-Z][A-Za-z0-9_]*\s*\{|type\s+[A-Z][A-Za-z0-9_]*\s*=|:\s*(string|number|boolean|any|unknown|never|void)\b|as\s+const\b|<[A-Z][A-Za-z0-9_]*>\s*\()/m.test(
      trimmed
    )
  ) {
    return 'typescript';
  }

  // 21. JavaScript signatures
  if (
    /\b(const\s+[a-zA-Z0-9_]+\s*=|let\s+[a-zA-Z0-9_]+\s*=|function\s+[a-zA-Z0-9_]*\s*\(|console\.(log|warn|error)|export\s+default)\b/m.test(
      trimmed
    )
  ) {
    return 'javascript';
  }

  // 22. Bash / Shell signatures
  if (/\b(echo\s+['"]|chmod\s+[0-9]+|npm\s+(run|install)|sudo\s+|export\s+[A-Z_]+=)/m.test(trimmed)) {
    return 'bash';
  }

  // 23. Fallback to highlight.js statistical detection
  try {
    const hljsCandidates = [
      'typescript',
      'javascript',
      'python',
      'rust',
      'go',
      'java',
      'cpp',
      'csharp',
      'php',
      'ruby',
      'swift',
      'kotlin',
      'xml',
      'css',
      'sql',
      'bash',
      'json',
      'yaml',
      'markdown',
      'dockerfile',
    ];
    const auto = hljs.highlightAuto(trimmed, hljsCandidates);
    if (auto.language) {
      if (auto.language === 'xml') return 'html';
      const match = SUPPORTED_LANGUAGES.find((lang) => lang.id === auto.language || lang.aliases?.includes(auto.language!));
      if (match) return match.id;
    }
  } catch {
    // Ignore fallback errors
  }

  return 'typescript';
}

/**
 * Splits highlighted HTML into individual lines while preserving opening/closing <span> tags
 * across line breaks, preventing unbalanced tags.
 */
export function splitHighlightedHtmlIntoLines(html: string): string[] {
  const rawParts = html.split('\n');
  const lines: string[] = [];
  const openTags: string[] = [];

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    const prefix = openTags.join('');

    const tagRegex = /<(\/)?span(?: [^>]*)?>/g;
    let match: RegExpExecArray | null;
    const currentPartOpenTags = [...openTags];

    while ((match = tagRegex.exec(part)) !== null) {
      if (match[1] === '/') {
        currentPartOpenTags.pop();
      } else {
        currentPartOpenTags.push(match[0]);
      }
    }

    const suffix = '</span>'.repeat(currentPartOpenTags.length);
    lines.push(prefix + part + suffix);

    openTags.length = 0;
    openTags.push(...currentPartOpenTags);
  }

  return lines;
}

/**
 * Highlights code and returns an array of HTML lines ready for rendering.
 */
export function highlightCodeToLines(code: string, languageId: string): string[] {
  if (!code) {
    return [''];
  }

  if (languageId === 'plaintext') {
    return code.split('\n').map((l) => escapeHtml(l));
  }

  const hljsLang = languageId === 'html' ? 'xml' : languageId;
  const isSupported = hljs.getLanguage(hljsLang);

  try {
    let highlightedHtml: string;
    if (isSupported) {
      highlightedHtml = hljs.highlight(code, { language: hljsLang, ignoreIllegals: true }).value;
    } else {
      highlightedHtml = hljs.highlightAuto(code).value;
    }
    return splitHighlightedHtmlIntoLines(highlightedHtml);
  } catch {
    return code.split('\n').map((l) => escapeHtml(l));
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getLanguageMetadata(languageId: string): SupportedLanguage {
  return (
    SUPPORTED_LANGUAGES.find((lang) => lang.id === languageId || lang.aliases?.includes(languageId)) || {
      id: languageId,
      name: languageId.toUpperCase(),
      extension: `.${languageId}`,
      defaultFilename: `snippet.${languageId}`,
    }
  );
}
