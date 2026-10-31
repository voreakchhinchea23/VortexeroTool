export interface CodeThemeTokens {
  keyword: string;
  built_in: string;
  type: string;
  literal: string;
  number: string;
  string: string;
  comment: string;
  function: string;
  title: string;
  params: string;
  variable: string;
  attr: string;
  tag: string;
  name: string;
  operator: string;
  punctuation: string;
  meta: string;
  subst: string;
}

export interface CodeTheme {
  id: string;
  name: string;
  editorBg: string;
  titleBarBg: string;
  borderColor: string;
  textColor: string;
  lineNumColor: string;
  isLight?: boolean;
  tokens: CodeThemeTokens;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  type: 'gradient' | 'solid' | 'transparent';
  value: string;
  previewClass?: string;
  previewStyle?: string;
}

export interface DropShadowPreset {
  id: string;
  name: string;
  value: string;
}

export interface FontFamilyPreset {
  id: string;
  name: string;
  fontFamily: string;
}

export const CODE_THEMES: CodeTheme[] = [
  {
    id: 'dracula',
    name: 'Dracula',
    editorBg: '#282a36',
    titleBarBg: '#21222c',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    textColor: '#f8f8f2',
    lineNumColor: '#6272a4',
    tokens: {
      keyword: '#ff79c6',
      built_in: '#8be9fd',
      type: '#8be9fd',
      literal: '#bd93f9',
      number: '#bd93f9',
      string: '#f1fa8c',
      comment: '#6272a4',
      function: '#50fa7b',
      title: '#50fa7b',
      params: '#ffb86c',
      variable: '#f8f8f2',
      attr: '#50fa7b',
      tag: '#ff79c6',
      name: '#ff79c6',
      operator: '#ff79c6',
      punctuation: '#f8f8f2',
      meta: '#ff79c6',
      subst: '#f8f8f2',
    },
  },
  {
    id: 'one_dark',
    name: 'One Dark',
    editorBg: '#282c34',
    titleBarBg: '#21252b',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#abb2bf',
    lineNumColor: '#4b5263',
    tokens: {
      keyword: '#c678dd',
      built_in: '#e5c07b',
      type: '#e5c07b',
      literal: '#56b6c2',
      number: '#d19a66',
      string: '#98c379',
      comment: '#5c6370',
      function: '#61afef',
      title: '#61afef',
      params: '#abb2bf',
      variable: '#e06c75',
      attr: '#d19a66',
      tag: '#e06c75',
      name: '#e06c75',
      operator: '#56b6c2',
      punctuation: '#abb2bf',
      meta: '#61afef',
      subst: '#e06c75',
    },
  },
  {
    id: 'monokai_pro',
    name: 'Monokai Pro',
    editorBg: '#2d2a2e',
    titleBarBg: '#221f22',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#fcfcfa',
    lineNumColor: '#727072',
    tokens: {
      keyword: '#ff6188',
      built_in: '#78dce8',
      type: '#78dce8',
      literal: '#ab9df2',
      number: '#ab9df2',
      string: '#ffd866',
      comment: '#727072',
      function: '#a9dc76',
      title: '#a9dc76',
      params: '#fc9867',
      variable: '#fcfcfa',
      attr: '#78dce8',
      tag: '#ff6188',
      name: '#ff6188',
      operator: '#ff6188',
      punctuation: '#939293',
      meta: '#78dce8',
      subst: '#fcfcfa',
    },
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    editorBg: '#011627',
    titleBarBg: '#010e1a',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#d6deeb',
    lineNumColor: '#4b6479',
    tokens: {
      keyword: '#c792ea',
      built_in: '#addb67',
      type: '#ffcb8b',
      literal: '#ff5874',
      number: '#f78c6c',
      string: '#ecc48d',
      comment: '#637777',
      function: '#82aaff',
      title: '#82aaff',
      params: '#d7dbe0',
      variable: '#7fdbca',
      attr: '#7fdbca',
      tag: '#7fdbca',
      name: '#7fdbca',
      operator: '#c792ea',
      punctuation: '#d6deeb',
      meta: '#82aaff',
      subst: '#d6deeb',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    editorBg: '#2e3440',
    titleBarBg: '#242933',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#d8dee9',
    lineNumColor: '#4c566a',
    tokens: {
      keyword: '#81a1c1',
      built_in: '#88c0d0',
      type: '#8fbcbb',
      literal: '#81a1c1',
      number: '#b48ead',
      string: '#a3be8c',
      comment: '#616e88',
      function: '#88c0d0',
      title: '#88c0d0',
      params: '#d8dee9',
      variable: '#d8dee9',
      attr: '#8fbcbb',
      tag: '#81a1c1',
      name: '#81a1c1',
      operator: '#81a1c1',
      punctuation: '#eceff4',
      meta: '#5e81ac',
      subst: '#d8dee9',
    },
  },
  {
    id: 'synthwave_84',
    name: "Synthwave '84",
    editorBg: '#262335',
    titleBarBg: '#1e1b2b',
    borderColor: 'rgba(255, 126, 219, 0.25)',
    textColor: '#f92aad',
    lineNumColor: '#614d85',
    tokens: {
      keyword: '#fed330',
      built_in: '#fe4450',
      type: '#fe4450',
      literal: '#f97e72',
      number: '#f97e72',
      string: '#ff7edb',
      comment: '#614d85',
      function: '#36f9f6',
      title: '#36f9f6',
      params: '#f92aad',
      variable: '#72f1b8',
      attr: '#fed330',
      tag: '#f92aad',
      name: '#f92aad',
      operator: '#fed330',
      punctuation: '#f92aad',
      meta: '#36f9f6',
      subst: '#f92aad',
    },
  },
  {
    id: 'github_dark',
    name: 'GitHub Dark',
    editorBg: '#0d1117',
    titleBarBg: '#161b22',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    textColor: '#c9d1d9',
    lineNumColor: '#484f58',
    tokens: {
      keyword: '#ff7b72',
      built_in: '#ffa657',
      type: '#ff7b72',
      literal: '#79c0ff',
      number: '#79c0ff',
      string: '#a5d6ff',
      comment: '#8b949e',
      function: '#d2a8ff',
      title: '#d2a8ff',
      params: '#c9d1d9',
      variable: '#ffa657',
      attr: '#79c0ff',
      tag: '#7ee787',
      name: '#7ee787',
      operator: '#ff7b72',
      punctuation: '#c9d1d9',
      meta: '#ffa657',
      subst: '#c9d1d9',
    },
  },
  {
    id: 'github_light',
    name: 'GitHub Light',
    editorBg: '#ffffff',
    titleBarBg: '#f6f8fa',
    borderColor: 'rgba(0, 0, 0, 0.12)',
    textColor: '#24292f',
    lineNumColor: '#8c959f',
    isLight: true,
    tokens: {
      keyword: '#cf222e',
      built_in: '#953800',
      type: '#953800',
      literal: '#0550ae',
      number: '#0550ae',
      string: '#0a3069',
      comment: '#6e7781',
      function: '#8250df',
      title: '#8250df',
      params: '#24292f',
      variable: '#953800',
      attr: '#0550ae',
      tag: '#116329',
      name: '#116329',
      operator: '#cf222e',
      punctuation: '#24292f',
      meta: '#953800',
      subst: '#24292f',
    },
  },
  {
    id: 'solarized_dark',
    name: 'Solarized Dark',
    editorBg: '#002b36',
    titleBarBg: '#073642',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#839496',
    lineNumColor: '#586e75',
    tokens: {
      keyword: '#859900',
      built_in: '#b58900',
      type: '#b58900',
      literal: '#d33682',
      number: '#d33682',
      string: '#2aa198',
      comment: '#586e75',
      function: '#268bd2',
      title: '#268bd2',
      params: '#839496',
      variable: '#cb4b16',
      attr: '#2aa198',
      tag: '#268bd2',
      name: '#268bd2',
      operator: '#859900',
      punctuation: '#93a1a1',
      meta: '#cb4b16',
      subst: '#839496',
    },
  },
  {
    id: 'solarized_light',
    name: 'Solarized Light',
    editorBg: '#fdf6e3',
    titleBarBg: '#eee8d5',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    textColor: '#657b83',
    lineNumColor: '#93a1a1',
    isLight: true,
    tokens: {
      keyword: '#859900',
      built_in: '#b58900',
      type: '#b58900',
      literal: '#d33682',
      number: '#d33682',
      string: '#2aa198',
      comment: '#93a1a1',
      function: '#268bd2',
      title: '#268bd2',
      params: '#657b83',
      variable: '#cb4b16',
      attr: '#2aa198',
      tag: '#268bd2',
      name: '#268bd2',
      operator: '#859900',
      punctuation: '#586e75',
      meta: '#cb4b16',
      subst: '#657b83',
    },
  },
  {
    id: 'material_ocean',
    name: 'Material Ocean',
    editorBg: '#0f111a',
    titleBarBg: '#090b10',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#8f93a2',
    lineNumColor: '#464b5d',
    tokens: {
      keyword: '#89ddff',
      built_in: '#ffcb6b',
      type: '#ffcb6b',
      literal: '#f78c6c',
      number: '#f78c6c',
      string: '#c3e88d',
      comment: '#464b5d',
      function: '#82aaff',
      title: '#82aaff',
      params: '#8f93a2',
      variable: '#f07178',
      attr: '#ffcb6b',
      tag: '#f07178',
      name: '#f07178',
      operator: '#89ddff',
      punctuation: '#89ddff',
      meta: '#ffcb6b',
      subst: '#8f93a2',
    },
  },
  {
    id: 'cobalt_2',
    name: 'Cobalt 2',
    editorBg: '#193549',
    titleBarBg: '#122738',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    textColor: '#ffffff',
    lineNumColor: '#0088ff',
    tokens: {
      keyword: '#ff9d00',
      built_in: '#ffc600',
      type: '#80ffbb',
      literal: '#ff628c',
      number: '#ff628c',
      string: '#3ad900',
      comment: '#0088ff',
      function: '#ffc600',
      title: '#ffc600',
      params: '#ffffff',
      variable: '#9effff',
      attr: '#9effff',
      tag: '#9effff',
      name: '#9effff',
      operator: '#ff9d00',
      punctuation: '#ffffff',
      meta: '#ff9d00',
      subst: '#ffffff',
    },
  },
  {
    id: 'shades_of_purple',
    name: 'Shades of Purple',
    editorBg: '#2d2b55',
    titleBarBg: '#1e1e3f',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    textColor: '#ffffff',
    lineNumColor: '#a599e9',
    tokens: {
      keyword: '#ff9d00',
      built_in: '#fad000',
      type: '#9effff',
      literal: '#ff628c',
      number: '#ff628c',
      string: '#a5ff90',
      comment: '#b362ff',
      function: '#fad000',
      title: '#fad000',
      params: '#ffffff',
      variable: '#fad000',
      attr: '#9effff',
      tag: '#9effff',
      name: '#9effff',
      operator: '#ff9d00',
      punctuation: '#ffffff',
      meta: '#ff9d00',
      subst: '#ffffff',
    },
  },
  {
    id: 'vscode_dark',
    name: 'VS Code Dark+',
    editorBg: '#1e1e1e',
    titleBarBg: '#252526',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#d4d4d4',
    lineNumColor: '#858585',
    tokens: {
      keyword: '#569cd6',
      built_in: '#4ec9b0',
      type: '#4ec9b0',
      literal: '#569cd6',
      number: '#b5cea8',
      string: '#ce9178',
      comment: '#6a9955',
      function: '#dcdcaa',
      title: '#dcdcaa',
      params: '#9cdcfe',
      variable: '#9cdcfe',
      attr: '#9cdcfe',
      tag: '#569cd6',
      name: '#569cd6',
      operator: '#d4d4d4',
      punctuation: '#d4d4d4',
      meta: '#9cdcfe',
      subst: '#d4d4d4',
    },
  },
  {
    id: 'tokyo_night',
    name: 'Tokyo Night',
    editorBg: '#1a1b26',
    titleBarBg: '#16161e',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#a9b1d6',
    lineNumColor: '#3b4261',
    tokens: {
      keyword: '#bb9af7',
      built_in: '#7dcfff',
      type: '#2ac3de',
      literal: '#ff9e64',
      number: '#ff9e64',
      string: '#9ece6a',
      comment: '#565f89',
      function: '#7aa2f7',
      title: '#7aa2f7',
      params: '#cfc9c2',
      variable: '#c0caf5',
      attr: '#7dcfff',
      tag: '#f7768e',
      name: '#f7768e',
      operator: '#89ddff',
      punctuation: '#c0caf5',
      meta: '#bb9af7',
      subst: '#c0caf5',
    },
  },
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // Gradients
  {
    id: 'vivid_chroma',
    name: 'Vivid Chroma',
    type: 'gradient',
    value: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #ec4899 100%)',
  },
  {
    id: 'midnight_neon',
    name: 'Midnight Neon',
    type: 'gradient',
    value: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 50%, #312e81 100%)',
  },
  {
    id: 'sunset_blaze',
    name: 'Sunset Blaze',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 50%, #9333ea 100%)',
  },
  {
    id: 'emerald_matrix',
    name: 'Emerald Matrix',
    type: 'gradient',
    value: 'linear-gradient(135deg, #10b981 0%, #0d9488 50%, #0f172a 100%)',
  },
  {
    id: 'flamingo',
    name: 'Flamingo',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb923c 100%)',
  },
  {
    id: 'cosmic_purple',
    name: 'Cosmic Purple',
    type: 'gradient',
    value: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
  },
  {
    id: 'deep_ocean',
    name: 'Deep Ocean',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2563eb 0%, #0891b2 50%, #14b8a6 100%)',
  },
  {
    id: 'solar_flare',
    name: 'Solar Flare',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
  },
  {
    id: 'mystic_aurora',
    name: 'Mystic Aurora',
    type: 'gradient',
    value: 'linear-gradient(135deg, #059669 0%, #2563eb 50%, #7c3aed 100%)',
  },
  {
    id: 'hyper_dark',
    name: 'Hyper Dark',
    type: 'gradient',
    value: 'linear-gradient(135deg, #27272a 0%, #09090b 100%)',
  },

  // Solids
  {
    id: 'carbon_dark',
    name: 'Carbon Dark',
    type: 'solid',
    value: '#121212',
  },
  {
    id: 'slate_blue',
    name: 'Slate Blue',
    type: 'solid',
    value: '#1e293b',
  },
  {
    id: 'deep_indigo',
    name: 'Deep Indigo',
    type: 'solid',
    value: '#1e1b4b',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    type: 'solid',
    value: '#27272a',
  },
  {
    id: 'forest_green',
    name: 'Forest Green',
    type: 'solid',
    value: '#064e3b',
  },
  {
    id: 'crimson_wine',
    name: 'Crimson Wine',
    type: 'solid',
    value: '#4c0519',
  },
  {
    id: 'pure_black',
    name: 'Pure Black',
    type: 'solid',
    value: '#000000',
  },
  {
    id: 'pure_white',
    name: 'Pure White',
    type: 'solid',
    value: '#ffffff',
  },

  // Transparent
  {
    id: 'transparent',
    name: 'Transparent',
    type: 'transparent',
    value: 'transparent',
  },
];

export const DROP_SHADOWS: DropShadowPreset[] = [
  {
    id: 'carbon_signature',
    name: 'Carbon Signature',
    value: '0 20px 68px rgba(0, 0, 0, 0.55), 0 1px 2px rgba(0, 0, 0, 0.2)',
  },
  {
    id: 'deep_ambient',
    name: 'Deep Ambient',
    value: '0 30px 90px -12px rgba(0, 0, 0, 0.7), 0 18px 36px -18px rgba(0, 0, 0, 0.45)',
  },
  {
    id: 'subtle',
    name: 'Subtle',
    value: '0 10px 25px -5px rgba(0, 0, 0, 0.35), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
  },
  {
    id: 'neon_glow',
    name: 'Neon Glow',
    value: '0 16px 50px rgba(99, 102, 241, 0.35), 0 4px 14px rgba(0, 0, 0, 0.3)',
  },
  {
    id: 'none',
    name: 'None',
    value: 'none',
  },
];

export const FONT_FAMILIES: FontFamilyPreset[] = [
  {
    id: 'jetbrains_mono',
    name: 'JetBrains Mono',
    fontFamily: "'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  {
    id: 'fira_code',
    name: 'Fira Code',
    fontFamily: "'Fira Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
  },
  {
    id: 'source_code_pro',
    name: 'Source Code Pro',
    fontFamily: "'Source Code Pro', Menlo, Monaco, Consolas, monospace",
  },
  {
    id: 'cascadia_code',
    name: 'Cascadia Code',
    fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
  },
  {
    id: 'system_monospace',
    name: 'System Monospace',
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
];

/**
 * Generates an embedded CSS string representing the chosen CodeTheme.
 * This guarantees syntax highlighting matches the chosen theme in preview,
 * PNG, SVG, and JPEG exports.
 */
export function generateCodeThemeCss(theme: CodeTheme): string {
  const t = theme.tokens;
  return `
    .vortex-code-highlight,
    .vortex-code-highlight * {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    .vortex-code-highlight::-webkit-scrollbar,
    .vortex-code-highlight *::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    .vortex-code-highlight {
      color: ${theme.textColor};
      background-color: ${theme.editorBg};
    }
    .vortex-code-highlight .hljs-keyword { color: ${t.keyword}; font-weight: 600; }
    .vortex-code-highlight .hljs-built_in { color: ${t.built_in}; }
    .vortex-code-highlight .hljs-type { color: ${t.type}; }
    .vortex-code-highlight .hljs-literal { color: ${t.literal}; }
    .vortex-code-highlight .hljs-number { color: ${t.number}; }
    .vortex-code-highlight .hljs-string { color: ${t.string}; }
    .vortex-code-highlight .hljs-comment { color: ${t.comment}; font-style: italic; }
    .vortex-code-highlight .hljs-doctag { color: ${t.comment}; font-style: italic; }
    .vortex-code-highlight .hljs-function { color: ${t.function}; }
    .vortex-code-highlight .hljs-title { color: ${t.title}; font-weight: 600; }
    .vortex-code-highlight .hljs-title.function_ { color: ${t.function}; font-weight: 600; }
    .vortex-code-highlight .hljs-title.class_ { color: ${t.type}; font-weight: 600; }
    .vortex-code-highlight .hljs-params { color: ${t.params}; }
    .vortex-code-highlight .hljs-variable { color: ${t.variable}; }
    .vortex-code-highlight .hljs-variable.language_ { color: ${t.built_in}; }
    .vortex-code-highlight .hljs-attr { color: ${t.attr}; }
    .vortex-code-highlight .hljs-attribute { color: ${t.attr}; }
    .vortex-code-highlight .hljs-tag { color: ${t.tag}; }
    .vortex-code-highlight .hljs-name { color: ${t.name}; }
    .vortex-code-highlight .hljs-selector-tag { color: ${t.keyword}; }
    .vortex-code-highlight .hljs-selector-class { color: ${t.type}; }
    .vortex-code-highlight .hljs-selector-id { color: ${t.title}; }
    .vortex-code-highlight .hljs-property { color: ${t.attr}; }
    .vortex-code-highlight .hljs-operator { color: ${t.operator}; }
    .vortex-code-highlight .hljs-punctuation { color: ${t.punctuation}; }
    .vortex-code-highlight .hljs-meta { color: ${t.meta}; }
    .vortex-code-highlight .hljs-subst { color: ${t.subst}; }
    .vortex-code-highlight .hljs-symbol { color: ${t.literal}; }
    .vortex-code-highlight .hljs-regexp { color: ${t.string}; }
  `;
}
