import { Tool, CategoryInfo } from '../types/tool';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', name: 'All Tools', description: 'Browse all available utilities', iconName: 'LayoutGrid' },
  { id: 'productivity', name: 'Productivity & Focus', description: 'CV builder, PDF, invoice, audio, clock & counters', iconName: 'Zap' },
  { id: 'security', name: 'Security & Auth', description: 'Passwords, usernames, hashes & tokens', iconName: 'ShieldCheck' },
  { id: 'web', name: 'Web & Sharing', description: 'QR codes, link tools, meta tags', iconName: 'Globe' },
  { id: 'text', name: 'Text & Content', description: 'Case convert, word counter, markdown & Base64', iconName: 'FileText' },
  { id: 'design', name: 'Design & Graphics', description: 'Image studio, charts, gradients & clamp', iconName: 'Palette' },
  { id: 'developer', name: 'Developer & Data', description: 'CSV/Excel, JSON, SQL, currency, diff, units & regex', iconName: 'Code2' },
];

export const TOOLS: Tool[] = [
  // Productivity & Real Life Tools
  {
    id: 'cv-builder',
    name: 'Modern CV & Resume Builder Studio',
    description: 'Build modern, clean, ATS-ready CVs & resumes with 8 aesthetic templates, photo upload, and instant PDF print.',
    category: 'productivity',
    iconName: 'FileText',
    badge: 'Featured',
    tags: ['cv', 'resume', 'builder', 'career', 'job', 'pdf', 'templates']
  },
  {
    id: 'pdf-tools',
    name: 'PDF Multi-Tool & Image Converter',
    description: 'Convert JPG/PNG/WebP images and Markdown notes into clean A4 PDF documents with custom orientation.',
    category: 'productivity',
    iconName: 'FileUp',
    badge: 'Hot',
    tags: ['pdf', 'convert', 'images', 'documents', 'merge', 'print']
  },
  {
    id: 'invoice-generator',
    name: 'Professional Invoice & Receipt Studio',
    description: 'Create customized client invoices with line items, tax/discount calculation, and 1-click clean PDF export.',
    category: 'productivity',
    iconName: 'Receipt',
    badge: 'New',
    tags: ['invoice', 'receipt', 'billing', 'finance', 'business', 'pdf']
  },
  {
    id: 'signature-pad',
    name: 'Digital Signature & E-Sign Pad',
    description: 'Draw e-signatures on smooth canvas or type stylish cursive calligraphy with transparent PNG export for contracts.',
    category: 'productivity',
    iconName: 'PenTool',
    badge: 'Popular',
    tags: ['signature', 'esign', 'draw', 'handwritten', 'contract', 'png']
  },
  {
    id: 'voice-audio-studio',
    name: 'Voice Dictation & Text-to-Speech',
    description: 'Real-time microphone speech-to-text dictation and natural browser Text-to-Speech audio reader.',
    category: 'productivity',
    iconName: 'Mic',
    badge: 'New',
    tags: ['voice', 'speech', 'dictation', 'tts', 'transcribe', 'audio']
  },
  {
    id: 'ambient-sounds',
    name: 'Ambient Focus Sounds & White Noise',
    description: 'Multi-channel ambient background mixer (Rain, Waves, Fireplace, Forest, Cafe, White Noise) for deep focus.',
    category: 'productivity',
    iconName: 'Volume2',
    tags: ['ambient', 'sounds', 'rain', 'focus', 'study', 'whitenoise', 'relax']
  },
  {
    id: 'digital-clock',
    name: 'Modern Digital Clock Studio',
    description: 'Fullscreen aesthetic digital & analog clock designed for second monitors with 10 themes and Pomodoro.',
    category: 'productivity',
    iconName: 'Clock',
    badge: 'Hot',
    tags: ['clock', 'time', 'second-monitor', 'pomodoro', 'minimalist', 'fullscreen']
  },
  {
    id: 'typing-test',
    name: 'Keyboard Typing Speed Test',
    description: 'Monkeytype-style keyboard typing practice with live WPM, accuracy, time/word modes, and code typing.',
    category: 'productivity',
    iconName: 'Keyboard',
    badge: 'New',
    tags: ['typing', 'monkeytype', 'wpm', 'speed', 'keyboard', 'practice']
  },
  {
    id: 'spinning-wheel',
    name: 'Decision Wheel (Choice Picker)',
    description: 'Interactive physics spinning wheel of fortune to pick random choices, food, or team members.',
    category: 'productivity',
    iconName: 'Sparkles',
    badge: 'Hot',
    tags: ['wheel', 'spin', 'random', 'choice', 'decide', 'game']
  },
  {
    id: 'day-counter',
    name: 'Love & Anniversary Day Counter',
    description: 'Track days together since relationships, anniversaries, or countdowns with live seconds and milestones.',
    category: 'productivity',
    iconName: 'Heart',
    badge: 'Popular',
    tags: ['love', 'anniversary', 'day counter', 'countdown', 'date', 'relationship']
  },
  {
    id: 'voting-system',
    name: 'Interactive Voting & Poll Studio',
    description: 'Create custom polls, cast votes, and visualize live graphical percentage fill bars and winner stats.',
    category: 'productivity',
    iconName: 'Vote',
    tags: ['vote', 'poll', 'survey', 'graphics', 'results', 'choice']
  },
  {
    id: 'name-generator',
    name: 'Real & Startup Name Generator',
    description: 'Generate real first/last names, startup brands, baby names, and fantasy characters with origin filters.',
    category: 'productivity',
    iconName: 'UserCheck',
    tags: ['name', 'generator', 'baby', 'startup', 'character', 'random']
  },
  {
    id: 'calendar-planner',
    name: 'Interactive Calendar & Date Math',
    description: 'Monthly interactive calendar with working business days counter and date duration calculator.',
    category: 'productivity',
    iconName: 'Calendar',
    tags: ['calendar', 'date', 'working days', 'planner', 'calculator']
  },

  // Security
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate ultra-secure passwords with custom length, entropy analysis, and crack-time estimation.',
    category: 'security',
    iconName: 'KeyRound',
    badge: 'Popular',
    tags: ['password', 'security', 'generator', 'random', 'strength', 'crypto']
  },
  {
    id: 'username-generator',
    name: 'Username & Gamertag Generator',
    description: 'Create unique, stylish usernames for gaming, social media, tech handles, and fantasy themes.',
    category: 'security',
    iconName: 'UserCheck',
    badge: 'Hot',
    tags: ['username', 'gamertag', 'handle', 'generator', 'name', 'avatar']
  },
  {
    id: 'uuid-generator',
    name: 'UUID & NanoID Generator',
    description: 'Generate bulk cryptographically random UUIDs (v4/v1) and compact NanoIDs.',
    category: 'security',
    iconName: 'Fingerprint',
    tags: ['uuid', 'guid', 'nanoid', 'identifier', 'unique', 'random']
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator & Checker',
    description: 'Calculate and verify SHA-256, SHA-512, SHA-1, and MD5 cryptographic hashes.',
    category: 'security',
    iconName: 'Hash',
    tags: ['hash', 'sha256', 'md5', 'checksum', 'crypto', 'digest']
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder & Inspector',
    description: 'Decode, inspect, and analyze JSON Web Tokens with expiration timers and payload viewer.',
    category: 'security',
    iconName: 'ShieldAlert',
    tags: ['jwt', 'token', 'auth', 'decode', 'json', 'expiration']
  },

  // Web & Sharing
  {
    id: 'qr-generator',
    name: 'Advanced QR Code Generator',
    description: 'Create high-resolution custom QR codes for URLs, WiFi networks, vCards, text, and email.',
    category: 'web',
    iconName: 'QrCode',
    badge: 'Popular',
    tags: ['qr', 'qrcode', 'wifi', 'vcard', 'barcode', 'share']
  },
  {
    id: 'url-shortener',
    name: 'URL Shortener & Link Hub',
    description: 'Shorten long links, create clean branded URLs, and track recent redirection history.',
    category: 'web',
    iconName: 'Link2',
    badge: 'Hot',
    tags: ['url', 'shorten', 'link', 'redirect', 'tinyurl', 'web']
  },
  {
    id: 'utm-builder',
    name: 'UTM Campaign Builder',
    description: 'Build trackable marketing campaign URLs with UTM parameters and preset templates.',
    category: 'web',
    iconName: 'Target',
    tags: ['utm', 'marketing', 'campaign', 'analytics', 'google', 'tracking']
  },
  {
    id: 'og-meta-generator',
    name: 'Open Graph & Social Meta Generator',
    description: 'Generate social share meta tags with live previews for Google Search, Twitter, and Facebook cards.',
    category: 'web',
    iconName: 'Share2',
    tags: ['seo', 'opengraph', 'meta', 'social', 'twitter', 'preview']
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder / Query Parser',
    description: 'Encode, decode URL components, and visually inspect and edit query string parameters.',
    category: 'web',
    iconName: 'Split',
    tags: ['url', 'encode', 'decode', 'query', 'params', 'uri']
  },

  // Text & Content
  {
    id: 'case-converter',
    name: 'Text Case Converter',
    description: 'Transform text into UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more.',
    category: 'text',
    iconName: 'Type',
    badge: 'Popular',
    tags: ['case', 'text', 'camelcase', 'snakecase', 'kebab', 'convert']
  },
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    description: 'Live statistics on words, characters, sentences, reading time, speaking time, and keyword density.',
    category: 'text',
    iconName: 'TextQuote',
    tags: ['word', 'character', 'counter', 'reading time', 'stats', 'density']
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum & Mock Data',
    description: 'Generate placeholder dummy text, paragraphs, sentences, HTML elements, and JSON records.',
    category: 'text',
    iconName: 'Pilcrow',
    tags: ['lorem', 'ipsum', 'dummy', 'placeholder', 'mock', 'text']
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown Live Editor',
    description: 'Live split-pane Markdown editor with synchronized preview, GFM tables, and HTML export.',
    category: 'text',
    iconName: 'FileCode2',
    badge: 'Featured',
    tags: ['markdown', 'editor', 'preview', 'gfm', 'html', 'writer']
  },
  {
    id: 'base64-tool',
    name: 'Base64 String & Image Tool',
    description: 'Encode and decode Base64 text, or convert images and files into inline Base64 Data URIs.',
    category: 'text',
    iconName: 'Binary',
    tags: ['base64', 'encode', 'decode', 'image', 'datauri', 'binary']
  },

  // Design & Graphics
  {
    id: 'image-studio',
    name: 'Advanced Image Studio & Filter Suite',
    description: 'Adjust visual filters (Brightness, Contrast, Sepia, Blur), convert formats, and extract dominant 6-color palettes.',
    category: 'design',
    iconName: 'Sliders',
    badge: 'Hot',
    tags: ['image', 'filter', 'palette', 'color', 'convert', 'png', 'jpg']
  },
  {
    id: 'chart-generator',
    name: 'Dynamic Graphic & Chart Studio',
    description: 'Input numerical values and labels to generate interactive Bar, Line, Donut, and Progress charts with SVG export.',
    category: 'design',
    iconName: 'BarChart3',
    badge: 'Hot',
    tags: ['chart', 'graph', 'data', 'visualization', 'svg', 'analytics']
  },
  {
    id: 'gradient-generator',
    name: 'CSS Gradient Generator',
    description: 'Design beautiful linear and radial gradients with customizable color stops, angle, and CSS export.',
    category: 'design',
    iconName: 'Sparkles',
    badge: 'Hot',
    tags: ['gradient', 'css', 'color', 'background', 'design', 'palette']
  },
  {
    id: 'glassmorphism-generator',
    name: 'Glassmorphism & Shadow Builder',
    description: 'Visual UI builder for modern frosted-glass cards, blur, border opacity, and elevation shadows.',
    category: 'design',
    iconName: 'Layers',
    tags: ['glassmorphism', 'shadow', 'css', 'blur', 'card', 'frosted']
  },
  {
    id: 'css-clamp-calculator',
    name: 'CSS Clamp() Fluid Type Calculator',
    description: 'Calculate responsive fluid typography and spacing clamp() formulas with live viewport simulation.',
    category: 'design',
    iconName: 'Maximize2',
    tags: ['clamp', 'css', 'responsive', 'typography', 'fluid', 'calc']
  },
  {
    id: 'contrast-checker',
    name: 'Color Contrast Checker (WCAG)',
    description: 'Test foreground vs background contrast ratio against WCAG 2.1 AA/AAA accessibility standards.',
    category: 'design',
    iconName: 'Contrast',
    tags: ['contrast', 'wcag', 'accessibility', 'color', 'a11y', 'compliance']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor & Converter',
    description: 'Compress image file size directly in your browser, resize dimensions, and convert to WebP/PNG/JPG.',
    category: 'design',
    iconName: 'ImageDown',
    tags: ['image', 'compress', 'resize', 'webp', 'png', 'jpg', 'photo']
  },

  // Developer & Data
  {
    id: 'csv-excel-studio',
    name: 'CSV & Excel Spreadsheet Studio',
    description: 'Interactive table grid editor with two-way conversion between CSV ⇄ JSON ⇄ SQL INSERT queries ⇄ Markdown.',
    category: 'developer',
    iconName: 'FileSpreadsheet',
    badge: 'Popular',
    tags: ['csv', 'excel', 'spreadsheet', 'json', 'sql', 'table', 'data']
  },
  {
    id: 'currency-converter',
    name: 'Live Currency Exchange Converter',
    description: 'Instant multi-currency exchange converter supporting USD, EUR, GBP, KHR, JPY, SGD, THB, and CNY.',
    category: 'developer',
    iconName: 'DollarSign',
    badge: 'Popular',
    tags: ['currency', 'exchange', 'money', 'usd', 'khr', 'eur', 'forex']
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, prettify, and minify JSON with precise syntax error indicators.',
    category: 'developer',
    iconName: 'FileJson',
    badge: 'Popular',
    tags: ['json', 'formatter', 'validator', 'minify', 'prettify', 'syntax']
  },
  {
    id: 'diff-checker',
    name: 'Text & Code Diff Checker',
    description: 'Compare two text snippets or code blocks side-by-side with live line difference highlighting.',
    category: 'developer',
    iconName: 'GitCompare',
    tags: ['diff', 'compare', 'text', 'code', 'git', 'changes']
  },
  {
    id: 'unit-converter',
    name: 'Universal Data & Unit Converter',
    description: 'Convert between digital storage (Bytes, MB, GB, TB), length, weight, temperature, and time.',
    category: 'developer',
    iconName: 'Scale',
    tags: ['unit', 'converter', 'bytes', 'storage', 'length', 'mass']
  },
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    description: 'Convert Epoch timestamps to human dates, UTC, ISO 8601, and calculate relative time intervals.',
    category: 'developer',
    iconName: 'Clock',
    tags: ['timestamp', 'epoch', 'time', 'date', 'unix', 'timezone']
  },
  {
    id: 'regex-tester',
    name: 'Live Regex Matcher & Tester',
    description: 'Test regular expressions in real-time with regex flags, match highlighting, and pattern cheatsheet.',
    category: 'developer',
    iconName: 'SearchCode',
    tags: ['regex', 'pattern', 'test', 'matcher', 'regexp', 'developer']
  }
];
