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
 * 4. Highlight.js statistical analysis fallback covering all 26 languages
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
    if (shebang.includes('bash') || shebang.includes('/sh') || shebang.includes('zsh')) return 'bash';
    if (shebang.includes('ruby')) return 'ruby';
    if (shebang.includes('php')) return 'php';
    if (shebang.includes('perl')) return 'bash';
    if (shebang.includes('lua')) return 'lua';
    if (shebang.includes('rscript')) return 'r';
  }

  // 2. HTML / XML detection
  if (
    /^<!DOCTYPE\s+html/i.test(trimmed) ||
    /^<html[\s>]/i.test(trimmed) ||
    /^<\?xml\b/i.test(trimmed) ||
    (/<\/?(div|span|button|input|head|body|table|tr|td|section|header|footer|nav|a|p|h1|h2|h3|ul|ol|li)[>\s]/i.test(trimmed) &&
      /<\/[a-z0-9]+>/i.test(trimmed))
  ) {
    return 'html';
  }

  // 3. JSON format validation
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      if (/^\s*"\w+"\s*:\s*/m.test(trimmed)) {
        return 'json';
      }
    }
  }

  // 4. GraphQL signatures
  if (/^\s*(type\s+[A-Z][a-zA-Z0-9_]*\s*\{|query\s+[A-Za-z0-9_]*|mutation\s+[A-Za-z0-9_]*|schema\s*\{)/m.test(trimmed)) {
    return 'graphql';
  }

  // 5. SQL signatures (checked before Dockerfile to prevent FROM <table_name> collisions)
  const sqlPattern =
    /\b(SELECT\s+[\s\S]+?\s+FROM|INSERT\s+INTO\s+|UPDATE\s+[\s\S]+?\s+SET|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|TRUNCATE\s+TABLE|GROUP\s+BY|ORDER\s+BY)\b/i;
  if (sqlPattern.test(trimmed) && !trimmed.includes('import ') && !trimmed.includes('def ')) {
    return 'sql';
  }

  // 6. Dockerfile signatures (must start with FROM or have multiple distinct Docker commands)
  const nonCommentLines = lines.map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith('#'));
  const dockerKeywords = ['FROM', 'RUN', 'CMD', 'LABEL', 'EXPOSE', 'ENV', 'ADD', 'COPY', 'ENTRYPOINT', 'VOLUME', 'USER', 'WORKDIR', 'ARG'];
  const dockerMatchCount = dockerKeywords.filter((kw) =>
    nonCommentLines.some((l) => new RegExp(`^${kw}\\s+`, 'i').test(l))
  ).length;
  if ((nonCommentLines.length > 0 && /^FROM\s+[a-z0-9_.:/-]+/i.test(nonCommentLines[0])) || dockerMatchCount >= 2) {
    return 'dockerfile';
  }

  // 7. Rust signatures
  if (
    /\b(fn\s+main\s*\(|impl\s+[A-Z]|let\s+mut\s+|pub\s+fn\s+|use\s+std::|match\s+.+\s+\{|println!|eprintln!|vec!|#\[derive\()/m.test(
      trimmed
    )
  ) {
    return 'rust';
  }

  // 8. Go signatures
  if (
    /^\s*package\s+[a-z0-9_]+/m.test(trimmed) ||
    /\bfunc\s+(\([^)]+\)\s*)?[A-Z][a-zA-Z0-9_]*\s*\(|fmt\.(Println|Printf|Sprintf)|make\(chan\b/m.test(trimmed)
  ) {
    return 'go';
  }

  // 9. C / C++ signatures
  if (/#include\s*<(iostream|vector|string|map|algorithm)>|std::(cout|endl|cin|vector|string)|namespace\s+[a-z0-9_]+\s*\{/m.test(trimmed)) {
    return 'cpp';
  }
  if (/#include\s*<(stdio|stdlib|string|math)\.h>|int\s+main\s*\(\s*(void|int\s+argc)/m.test(trimmed)) {
    return 'c';
  }

  // 10. C# signatures
  if (/using\s+System(\.[A-Za-z0-9_]+)*;|namespace\s+[A-Za-z0-9_.]+\s*\{|Console\.WriteLine/m.test(trimmed)) {
    return 'csharp';
  }

  // 11. Java signatures
  if (
    /public\s+class\s+[A-Za-z0-9_]+|public\s+static\s+void\s+main\s*\(|System\.out\.println|import\s+java\.[a-z0-9_.]+;/m.test(
      trimmed
    )
  ) {
    return 'java';
  }

  // 12. PHP signatures
  if (/<\?php|\$[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*\s*=|echo\s+['"]|function\s+[a-zA-Z0-9_]+\s*\(.*?\)\s*\{/m.test(trimmed)) {
    return 'php';
  }

  // 13. Swift signatures
  if (/import\s+(SwiftUI|UIKit|Foundation|Combine)|guard\s+let\b|@State|@Binding|@Published\b/m.test(trimmed)) {
    return 'swift';
  }

  // 14. Kotlin signatures
  if (/fun\s+main\s*\(|val\s+[a-zA-Z0-9_]+\s*:\s*[A-Z]|suspend\s+fun|companion\s+object\b/m.test(trimmed)) {
    return 'kotlin';
  }

  // 15. Dart signatures
  if (/void\s+main\s*\(\s*\)|import\s+['"]package:|Widget\s+build\s*\(|StatelessWidget|StatefulWidget|setState\s*\(/m.test(trimmed)) {
    return 'dart';
  }

  // 16. Scala signatures
  if (/object\s+[A-Z][a-zA-Z0-9_]*\s+extends\s+(App|Application)|def\s+main\s*\(args:\s*Array\[String\]\)|case\s+class\s+[A-Z]/m.test(trimmed)) {
    return 'scala';
  }

  // 17. Lua signatures
  if (/local\s+[a-zA-Z0-9_]+\s*=|io\.(write|read)\b|table\.(insert|remove)\b|function\s+[a-zA-Z0-9_.:]+\s*\(.*?\)\s*[\s\S]*?\bend\b/m.test(trimmed)) {
    return 'lua';
  }

  // 18. R signatures
  if (/<-|read\.csv\s*\(|summary\s*\(|ggplot\s*\(|data\.frame\s*\(|library\s*\([a-zA-Z0-9_.]+\)/m.test(trimmed)) {
    return 'r';
  }

  // 19. Ruby signatures
  if (/puts\s+['"]|\.times\s+do\b|attr_accessor\b|^\s*def\s+[a-zA-Z0-9_]+(\s*\(.*?\))?\s*$/m.test(trimmed) && /^\s*end\s*$/m.test(trimmed)) {
    return 'ruby';
  }

  // 20. Python signatures
  if (
    /^\s*def\s+[a-zA-Z0-9_]+\s*\(.*?\)\s*:|^\s*class\s+[A-Z][a-zA-Z0-9_]*(\(.*?\))?\s*:|^\s*elif\s+|if\s+__name__\s*==\s*['"]__main__['"]:|import\s+(os|sys|math|json|re|numpy|pandas|requests)\b|from\s+[a-zA-Z0-9_.]+\s+import\b|print\s*\(.*?\)/m.test(
      trimmed
    )
  ) {
    return 'python';
  }

  // 21. Shell / Bash commands (standalone command keywords or lines)
  if (
    /\b(sudo|curl|wget|chmod|chown|npm\s+(run|install|i|test|start)|yarn\s+(add|install)|pnpm\s+(add|install)|pip\s+install|git\s+(commit|push|pull|clone|checkout|add|branch|status)|systemctl|docker\s+run|apt-get|apt\s+install|brew\s+install)\b/m.test(
      trimmed
    ) ||
    /\b(echo\s+['"]|export\s+[A-Z_]+=)/m.test(trimmed) ||
    /^\s*(\$|#)\s+(curl|npm|sudo|git|chmod|cat|ls|cd|rm|mkdir)\b/m.test(trimmed)
  ) {
    return 'bash';
  }

  // 22. CSS signatures
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

  // 23. YAML signatures
  if (/^---/m.test(trimmed) || (/^[a-zA-Z0-9_-]+\s*:\s*(["'\d\w\s-]|$)/m.test(trimmed) && !trimmed.includes('{') && !trimmed.includes(';'))) {
    return 'yaml';
  }

  // 24. Markdown signatures (strictly non-code documentation patterns)
  const isLikelyCode =
    trimmed.includes('import ') ||
    trimmed.includes('const ') ||
    trimmed.includes('function ') ||
    trimmed.includes('sudo ') ||
    trimmed.includes('npm ') ||
    trimmed.includes('def ') ||
    trimmed.includes('val ') ||
    trimmed.includes('class ');
  if (
    !isLikelyCode &&
    (/^#{1,6}\s+.+$/m.test(trimmed) ||
      /\[.+?\]\(https?:\/\/[^\)]+\)/.test(trimmed) ||
      /^\|[\s-:]+\|/m.test(trimmed))
  ) {
    return 'markdown';
  }

  // 25. TypeScript signatures
  if (
    /\b(interface\s+[A-Z][A-Za-z0-9_]*\s*\{|type\s+[A-Z][A-Za-z0-9_]*\s*=|:\s*(string|number|boolean|any|unknown|never|void)\b|as\s+const\b|<[A-Z][A-Za-z0-9_]*>\s*\()/m.test(
      trimmed
    )
  ) {
    return 'typescript';
  }

  // 26. JavaScript signatures
  if (
    /\b(const\s+[a-zA-Z0-9_]+\s*=|let\s+[a-zA-Z0-9_]+\s*=|function\s+[a-zA-Z0-9_]*\s*\(|console\.(log|warn|error)|export\s+default)\b/m.test(
      trimmed
    )
  ) {
    return 'javascript';
  }

  // 27. Fallback to highlight.js statistical detection across all 26 supported languages
  try {
    const hljsCandidates = [
      'typescript',
      'javascript',
      'python',
      'rust',
      'go',
      'java',
      'cpp',
      'c',
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
      'graphql',
      'dart',
      'scala',
      'r',
      'lua',
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

  const normalized = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  if (languageId === 'plaintext') {
    return normalized.split('\n').map((l) => escapeHtml(l));
  }

  const hljsLang = languageId === 'html' ? 'xml' : languageId;
  const isSupported = hljs.getLanguage(hljsLang);

  try {
    let highlightedHtml: string;
    if (isSupported) {
      highlightedHtml = hljs.highlight(normalized, { language: hljsLang, ignoreIllegals: true }).value;
    } else {
      highlightedHtml = hljs.highlightAuto(normalized).value;
    }
    return splitHighlightedHtmlIntoLines(highlightedHtml);
  } catch {
    return normalized.split('\n').map((l) => escapeHtml(l));
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
