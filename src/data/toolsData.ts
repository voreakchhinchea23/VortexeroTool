import { Tool, CategoryInfo } from '../types/tool';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', name: 'All Tools', description: 'Browse all available utilities', iconName: 'LayoutGrid' },
  { id: 'productivity', name: 'Productivity & Focus', description: 'Finance, health, countdown, CV builder, invoice & clock', iconName: 'Zap' },
  { id: 'security', name: 'Security & Auth', description: 'Passwords, usernames, hashes & tokens', iconName: 'ShieldCheck' },
  { id: 'web', name: 'Web & Streaming', description: 'Responsive tester, multi-stream viewer, QR codes, links, meta tags', iconName: 'Globe' },
  { id: 'text', name: 'Text & Content', description: 'Case convert, word counter, markdown & Base64', iconName: 'FileText' },
  { id: 'design', name: 'Design & Graphics', description: 'Whiteboard, color palette, image studio, charts & clamp', iconName: 'Palette' },
  { id: 'developer', name: 'Developer & Data', description: 'Code to image, SQL formatter, cron generator, CSV/Excel, JSON & regex', iconName: 'Code2' },
];

export const TOOLS: Tool[] = [
  // Productivity & Real Life Tools
  {
    id: 'loan-calculator',
    name: 'Loan & Mortgage Amortization Studio',
    description: 'Calculate monthly loan/mortgage payments, extra payoff savings, and interactive yearly/monthly amortization tables.',
    category: 'productivity',
    iconName: 'Calculator',
    badge: 'New',
    tags: ['loan', 'mortgage', 'emi', 'finance', 'interest', 'amortization', 'bank', 'money']
  },
  {
    id: 'bmi-calorie-calculator',
    name: 'BMI, BMR & Daily Calorie Calculator',
    description: 'Calculate Body Mass Index (BMI), Basal Metabolic Rate (BMR), TDEE burn, and optimal daily protein/carb/fat macros.',
    category: 'productivity',
    iconName: 'Activity',
    badge: 'Hot',
    tags: ['bmi', 'bmr', 'tdee', 'calories', 'health', 'fitness', 'weight', 'nutrition', 'macro']
  },
  {
    id: 'tip-calculator',
    name: 'Tip & Restaurant Bill Splitter',
    description: 'Calculate tips, split restaurant bills evenly or itemized among friends, and round up totals with 1-click summary copy.',
    category: 'productivity',
    iconName: 'DollarSign',
    badge: 'New',
    tags: ['tip', 'bill', 'split', 'restaurant', 'gratuity', 'calculator', 'food', 'money']
  },
  {
    id: 'event-countdown',
    name: 'Event Countdown & Milestone Studio',
    description: 'Create live ticking countdown cards for product launches, deadlines, vacations, holidays, and milestones.',
    category: 'productivity',
    iconName: 'Calendar',
    badge: 'Popular',
    tags: ['countdown', 'timer', 'event', 'deadline', 'date', 'holiday', 'milestone']
  },
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
    description: '16-channel synthesized ambient focus mixer (Rain, Waves, Fireplace, Forest, Cafe, White Noise, 432Hz Drone).',
    category: 'productivity',
    iconName: 'Volume2',
    badge: 'Popular',
    tags: ['ambient', 'sounds', 'rain', 'focus', 'study', 'whitenoise', 'relax', 'sleep']
  },
  {
    id: 'digital-clock',
    name: 'Modern Digital Clock Studio',
    description: 'Fullscreen aesthetic digital & analog clock designed for second monitors with 18 themes, Flip Clock & Pomodoro.',
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
    tags: ['love', 'd-day', 'counter', 'anniversary', 'relationship', 'days']
  },
  {
    id: 'voting-system',
    name: 'Anonymous Quick Poll & Voting',
    description: 'Create fast voting polls, add multiple choices, and view real-time percentage bar charts locally.',
    category: 'productivity',
    iconName: 'Vote',
    tags: ['poll', 'vote', 'survey', 'decision', 'team', 'questions']
  },
  {
    id: 'name-generator',
    name: 'Brand & Startup Name Generator',
    description: 'Generate catchy tech startups, modern SaaS apps, creative branding, and fantasy character names.',
    category: 'productivity',
    iconName: 'Sparkle',
    tags: ['name', 'brand', 'startup', 'saas', 'generator', 'domain']
  },
  {
    id: 'calendar-planner',
    name: 'Interactive Calendar & Schedule Planner',
    description: 'Monthly schedule planner with day-by-day event notes, recurring reminders, and iCal / ICS calendar export.',
    category: 'productivity',
    iconName: 'CalendarDays',
    tags: ['calendar', 'planner', 'schedule', 'events', 'ics', 'reminders']
  },

  // Security & Auth
  {
    id: 'password-generator',
    name: 'Ultra-Secure Password Generator',
    description: 'Generate entropy-rated cryptographic passwords with customizable symbols, numbers, and memorable passphrases.',
    category: 'security',
    iconName: 'KeyRound',
    badge: 'Popular',
    tags: ['password', 'security', 'generator', 'crypto', 'passphrase', 'entropy']
  },
  {
    id: 'username-generator',
    name: 'Gaming & Social Username Studio',
    description: 'Generate aesthetic, gamer-tag, tech, and aesthetic social usernames across multiple styles.',
    category: 'security',
    iconName: 'UserCheck',
    tags: ['username', 'gamertag', 'handle', 'generator', 'social']
  },
  {
    id: 'uuid-generator',
    name: 'UUID / GUID Generator (v4 & v7)',
    description: 'Generate cryptographically random RFC-compliant UUID v4 and timestamp-ordered UUID v7 strings in bulk.',
    category: 'security',
    iconName: 'Fingerprint',
    tags: ['uuid', 'guid', 'v4', 'v7', 'identifier', 'developer']
  },
  {
    id: 'hash-generator',
    name: 'Cryptographic Hash Studio',
    description: 'Generate cryptographic digests using SHA-256, SHA-512, SHA-3, SHA-1, and MD5 with instant comparison.',
    category: 'security',
    iconName: 'Hash',
    tags: ['hash', 'sha256', 'sha512', 'md5', 'crypto', 'checksum']
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Debugger & Claims Inspector',
    description: 'Decode and inspect JSON Web Tokens (Header, Payload, Claims) with automatic expiration and time validity checks.',
    category: 'security',
    iconName: 'ShieldAlert',
    tags: ['jwt', 'token', 'auth', 'decode', 'json', 'security']
  },

  // Web & Streaming
  {
    id: 'responsive-tester',
    name: 'Responsive Device Viewport Simulator',
    description: 'Test websites in realistic iPhone, iPad, MacBook, and Desktop screen frames with rotation and custom viewport controls.',
    category: 'web',
    iconName: 'Smartphone',
    badge: 'New',
    tags: ['responsive', 'mobile', 'device', 'viewport', 'tester', 'web', 'preview']
  },
  {
    id: 'multistream-hub',
    name: 'Multi-Stream Command Center',
    description: 'Watch up to 9 live Twitch, YouTube, and Kick video streams simultaneously in custom responsive grid layouts.',
    category: 'web',
    iconName: 'Tv',
    badge: 'Hot',
    tags: ['multistream', 'twitch', 'youtube', 'kick', 'streaming', 'viewer', 'grid']
  },
  {
    id: 'qr-generator',
    name: 'Custom QR Code & Barcode Studio',
    description: 'Create branded QR codes with custom foreground/background colors, embedded logo upload, and SVG/PNG download.',
    category: 'web',
    iconName: 'QrCode',
    badge: 'Popular',
    tags: ['qr', 'qrcode', 'barcode', 'logo', 'generator', 'download']
  },
  {
    id: 'url-shortener',
    name: 'Free URL Shortener & Link Hub',
    description: 'Create fast short links using is.gd & tinyurl APIs with built-in instant QR code generation.',
    category: 'web',
    iconName: 'Link2',
    tags: ['url', 'shortener', 'link', 'tinyurl', 'isgd', 'share']
  },
  {
    id: 'utm-builder',
    name: 'Google Analytics UTM Campaign Builder',
    description: 'Build trackable marketing campaign URLs with Source, Medium, Campaign, Term, and Content parameters.',
    category: 'web',
    iconName: 'Compass',
    tags: ['utm', 'analytics', 'marketing', 'campaign', 'tracking', 'url']
  },
  {
    id: 'og-meta-generator',
    name: 'Open Graph & Social Card Previewer',
    description: 'Generate HTML meta tags and preview live social share cards for Facebook, X (Twitter), LinkedIn, and Discord.',
    category: 'web',
    iconName: 'Share2',
    tags: ['og', 'opengraph', 'meta', 'social', 'twitter', 'discord', 'seo']
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Percent Encoder & Decoder',
    description: 'Safely encode and decode special characters in URLs, query strings, and URI components.',
    category: 'web',
    iconName: 'Binary',
    tags: ['url', 'encode', 'decode', 'uri', 'percent-encoding']
  },

  // Text & Content
  {
    id: 'case-converter',
    name: 'Smart Text Case Converter',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and PascalCase.',
    category: 'text',
    iconName: 'CaseSensitive',
    tags: ['case', 'text', 'camelcase', 'snakecase', 'kebab', 'convert']
  },
  {
    id: 'word-counter',
    name: 'Live Word Counter & Reading Time',
    description: 'Analyze word count, character count, sentence structure, reading time, speaking duration, and keyword density.',
    category: 'text',
    iconName: 'AlignLeft',
    tags: ['word', 'counter', 'characters', 'reading-time', 'statistics', 'text']
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Dummy Text Generator',
    description: 'Generate placeholder paragraphs, sentences, words, and list items for web design mockups and prototypes.',
    category: 'text',
    iconName: 'Type',
    tags: ['lorem', 'ipsum', 'placeholder', 'dummy', 'text', 'generator']
  },
  {
    id: 'markdown-previewer',
    name: 'Live Markdown Editor & Cheat Sheet',
    description: 'Split-screen GitHub-flavored Markdown editor with instant live HTML preview and syntax cheat sheet.',
    category: 'text',
    iconName: 'Code',
    tags: ['markdown', 'editor', 'preview', 'gfm', 'html', 'write']
  },
  {
    id: 'base64-tool',
    name: 'Base64 Text & File Encoder/Decoder',
    description: 'Encode and decode UTF-8 text strings and binary image files to Base64 data URIs with 1-click preview.',
    category: 'text',
    iconName: 'FileCode2',
    tags: ['base64', 'encode', 'decode', 'binary', 'string', 'data-uri']
  },

  // Design & Graphics
  {
    id: 'whiteboard-sketch',
    name: 'Quick Whiteboard & Sketch Canvas',
    description: 'Smooth digital whiteboard canvas for brainstorming, wireframes, pen drawings, shapes, and PNG export.',
    category: 'design',
    iconName: 'PenTool',
    badge: 'New',
    tags: ['whiteboard', 'sketch', 'draw', 'canvas', 'paint', 'wireframe', 'diagram']
  },
  {
    id: 'color-palette-generator',
    name: 'Color Palette & Harmony Studio',
    description: 'Generate harmonious color palettes with Spacebar, lock favorite colors, view contrast, and export CSS variables.',
    category: 'design',
    iconName: 'Palette',
    badge: 'Popular',
    tags: ['color', 'palette', 'harmony', 'coolors', 'css', 'design', 'hex']
  },
  {
    id: 'image-studio',
    name: 'Photo Studio & Color Picker EyeDropper',
    description: 'Extract dominant color palettes, inspect pixel HEX/RGB with an interactive loupe, crop, rotate, and filter images.',
    category: 'design',
    iconName: 'Image',
    badge: 'Hot',
    tags: ['image', 'photo', 'crop', 'eyedropper', 'palette', 'filter', 'rotate']
  },
  {
    id: 'chart-generator',
    name: 'Interactive Chart & Graph Studio',
    description: 'Create beautiful Bar, Line, Pie, and Doughnut charts with custom color schemes and PNG/SVG export.',
    category: 'design',
    iconName: 'BarChart3',
    badge: 'New',
    tags: ['chart', 'graph', 'data', 'visualization', 'bar', 'pie', 'line', 'svg']
  },
  {
    id: 'gradient-generator',
    name: 'CSS Mesh & Linear Gradient Studio',
    description: 'Design multi-stop linear, radial, and mesh gradients with angle controls and ready-to-use CSS output.',
    category: 'design',
    iconName: 'Sparkles',
    tags: ['gradient', 'css', 'linear', 'radial', 'mesh', 'color', 'background']
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
    id: 'code-to-image',
    name: 'Code Snippet to Beautiful Image Studio',
    description: 'Turn source code snippets into gorgeous social cards with macOS/Windows frames, gradients, and PNG export.',
    category: 'developer',
    iconName: 'Code2',
    badge: 'Popular',
    tags: ['code', 'carbon', 'rayso', 'snippet', 'image', 'share', 'syntax', 'card']
  },
  {
    id: 'sql-formatter',
    name: 'SQL Query Formatter & Minifier',
    description: 'Format, beautify, indent, and uppercase SQL queries (PostgreSQL, MySQL, SQLite, T-SQL) with 1-click copy.',
    category: 'developer',
    iconName: 'Database',
    badge: 'New',
    tags: ['sql', 'database', 'formatter', 'beautify', 'query', 'mysql', 'postgres']
  },
  {
    id: 'cron-generator',
    name: 'Crontab Expression Generator & Explainer',
    description: 'Visually build 5-field cron schedules, read plain English explanations, and calculate upcoming execution dates.',
    category: 'developer',
    iconName: 'Clock',
    badge: 'Hot',
    tags: ['cron', 'crontab', 'schedule', 'scheduler', 'linux', 'backend', 'developer']
  },
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
    description: 'Convert Epoch timestamps to human dates, UTC, ISO 8601, and relative time intervals.',
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
