import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Layers, 
  FileCode, 
  Globe, 
  Send,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

type TargetLanguage = 'js-fetch' | 'js-axios' | 'python' | 'go' | 'rust' | 'php' | 'node';

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data: string | null;
  auth: { user: string; pass: string } | null;
}

const PRESETS = [
  {
    name: 'POST JSON with Auth',
    curl: `curl -X POST https://api.example.com/v1/users \\
  -H "Authorization: Bearer sk_live_9384729183" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Sarah Connor", "email": "sarah@cyberdyne.org", "role": "admin"}'`
  },
  {
    name: 'GET with Query Params',
    curl: `curl "https://api.example.com/v1/products?category=electronics&limit=25&sort=desc" \\
  -H "Accept: application/json" \\
  -H "X-Client-ID: vtx_web_client_99"`
  },
  {
    name: 'PUT Update Profile',
    curl: `curl -X PUT https://api.example.com/v1/users/usr_4812 \\
  -H "Content-Type: application/json" \\
  -d '{"status": "active", "newsletter": true}'`
  },
  {
    name: 'Basic Auth Request',
    curl: `curl -u admin:supersecret https://api.example.com/v1/system/status \\
  -H "Accept: application/json"`
  }
];

export const CurlToCode: React.FC = () => {
  const [curlInput, setCurlInput] = useState<string>(PRESETS[0].curl);
  const [targetLang, setTargetLang] = useState<TargetLanguage>('js-fetch');
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  // Parse cURL command
  const parsed = useMemo<ParsedCurl>(() => {
    const raw = curlInput
      .replace(/\\\n/g, ' ')
      .replace(/\\\r\n/g, ' ')
      .trim();

    let method = '';
    let url = '';
    const headers: Record<string, string> = {};
    let data: string | null = null;
    let auth: { user: string; pass: string } | null = null;

    // Tokenizer that respects single and double quotes
    const tokens: string[] = [];
    const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
    let match;
    while ((match = regex.exec(raw)) !== null) {
      tokens.push(match[1] !== undefined ? match[1] : match[2] !== undefined ? match[2] : match[0]);
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token === 'curl') continue;

      if (token === '-X' || token === '--request') {
        method = (tokens[i + 1] || '').toUpperCase();
        i++;
      } else if (token === '-H' || token === '--header') {
        const headerStr = tokens[i + 1] || '';
        const colonIdx = headerStr.indexOf(':');
        if (colonIdx > -1) {
          const key = headerStr.slice(0, colonIdx).trim();
          const val = headerStr.slice(colonIdx + 1).trim();
          headers[key] = val;
        }
        i++;
      } else if (
        token === '-d' || 
        token === '--data' || 
        token === '--data-raw' || 
        token === '--data-binary' || 
        token === '--json'
      ) {
        data = tokens[i + 1] || '';
        if (token === '--json' && !headers['Content-Type']) {
          headers['Content-Type'] = 'application/json';
        }
        i++;
      } else if (token === '-u' || token === '--user') {
        const userPass = tokens[i + 1] || '';
        const parts = userPass.split(':');
        auth = { user: parts[0] || '', pass: parts[1] || '' };
        i++;
      } else if (token.startsWith('http://') || token.startsWith('https://')) {
        url = token;
      } else if (token === '--url') {
        url = tokens[i + 1] || '';
        i++;
      }
    }

    if (!method) {
      method = data ? 'POST' : 'GET';
    }

    if (auth && !headers['Authorization']) {
      const encoded = btoa(`${auth.user}:${auth.pass}`);
      headers['Authorization'] = `Basic ${encoded}`;
    }

    return {
      url: url || 'https://api.example.com/endpoint',
      method,
      headers,
      data,
      auth
    };
  }, [curlInput]);

  // Generate code based on selected language
  const generatedCode = useMemo(() => {
    const { url, method, headers, data } = parsed;
    const hasHeaders = Object.keys(headers).length > 0;

    switch (targetLang) {
      case 'js-fetch': {
        const options: Record<string, any> = { method };
        if (hasHeaders) options.headers = headers;
        if (data) options.body = data;

        let code = `const response = await fetch('${url}', {\n`;
        code += `  method: '${method}',\n`;
        if (hasHeaders) {
          code += `  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')},\n`;
        }
        if (data) {
          // Check if valid JSON
          try {
            JSON.parse(data);
            code += `  body: JSON.stringify(${JSON.stringify(JSON.parse(data), null, 4).replace(/\n/g, '\n  ')}),\n`;
          } catch {
            code += `  body: ${JSON.stringify(data)},\n`;
          }
        }
        code += `});\n\n`;
        code += `const data = await response.json();\nconsole.log(data);`;
        return code;
      }

      case 'js-axios': {
        let code = `import axios from 'axios';\n\n`;
        code += `const { data } = await axios({\n`;
        code += `  method: '${method.toLowerCase()}',\n`;
        code += `  url: '${url}',\n`;
        if (hasHeaders) {
          code += `  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')},\n`;
        }
        if (data) {
          try {
            JSON.parse(data);
            code += `  data: ${JSON.stringify(JSON.parse(data), null, 4).replace(/\n/g, '\n  ')},\n`;
          } catch {
            code += `  data: ${JSON.stringify(data)},\n`;
          }
        }
        code += `});\n\nconsole.log(data);`;
        return code;
      }

      case 'python': {
        let code = `import requests\n\n`;
        code += `url = "${url}"\n`;
        if (hasHeaders) {
          code += `headers = ${JSON.stringify(headers, null, 4)}\n`;
        }
        if (data) {
          try {
            JSON.parse(data);
            code += `payload = ${JSON.stringify(JSON.parse(data), null, 4)}\n`;
          } catch {
            code += `data = """${data}"""\n`;
          }
        }
        code += `\nresponse = requests.${method.toLowerCase()}(\n`;
        code += `    url,\n`;
        if (hasHeaders) code += `    headers=headers,\n`;
        if (data) {
          try {
            JSON.parse(data);
            code += `    json=payload,\n`;
          } catch {
            code += `    data=data,\n`;
          }
        }
        code += `)\n\nprint(response.status_code)\nprint(response.json())`;
        return code;
      }

      case 'node': {
        let code = `import fetch from 'node-fetch';\n\n`;
        code += `async function sendRequest() {\n`;
        code += `  const res = await fetch('${url}', {\n`;
        code += `    method: '${method}',\n`;
        if (hasHeaders) {
          code += `    headers: ${JSON.stringify(headers, null, 6).replace(/\n/g, '\n    ')},\n`;
        }
        if (data) {
          code += `    body: ${JSON.stringify(data)},\n`;
        }
        code += `  });\n\n`;
        code += `  const json = await res.json();\n`;
        code += `  console.log(json);\n`;
        code += `}\n\nsendRequest();`;
        return code;
      }

      case 'go': {
        let code = `package main\n\n`;
        code += `import (\n\t"fmt"\n\t"io"\n\t"net/http"\n`;
        if (data) code += `\t"strings"\n`;
        code += `)\n\nfunc main() {\n`;
        code += `\turl := "${url}"\n`;
        if (data) {
          code += `\tpayload := strings.NewReader(\`${data.replace(/`/g, '')}\`)\n`;
          code += `\treq, err := http.NewRequest("${method}", url, payload)\n`;
        } else {
          code += `\treq, err := http.NewRequest("${method}", url, nil)\n`;
        }
        code += `\tif err != nil {\n\t\tpanic(err)\n\t}\n\n`;
        Object.entries(headers).forEach(([k, v]) => {
          code += `\treq.Header.Add("${k}", "${v}")\n`;
        });
        code += `\n\tres, err := http.DefaultClient.Do(req)\n`;
        code += `\tif err != nil {\n\t\tpanic(err)\n\t}\n`;
        code += `\tdefer res.Body.Close()\n\n`;
        code += `\tbody, _ := io.ReadAll(res.Body)\n`;
        code += `\tfmt.Println(string(body))\n}`;
        return code;
      }

      case 'rust': {
        let code = `use reqwest::header::{HeaderMap, HeaderName, HeaderValue};\n\n`;
        code += `#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n`;
        code += `    let client = reqwest::Client::new();\n`;
        code += `    let response = client\n`;
        code += `        .${method.toLowerCase()}("${url}")\n`;
        Object.entries(headers).forEach(([k, v]) => {
          code += `        .header("${k}", "${v}")\n`;
        });
        if (data) {
          code += `        .body(r#"${data}"#)\n`;
        }
        code += `        .send()\n        .await?;\n\n`;
        code += `    let body = response.text().await?;\n`;
        code += `    println!("{:#?}", body);\n`;
        code += `    Ok(())\n}`;
        return code;
      }

      case 'php': {
        let code = `<?php\n\n`;
        code += `$curl = curl_init();\n\n`;
        code += `curl_setopt_array($curl, array(\n`;
        code += `  CURLOPT_URL => '${url}',\n`;
        code += `  CURLOPT_RETURNTRANSFER => true,\n`;
        code += `  CURLOPT_CUSTOMREQUEST => '${method}',\n`;
        if (data) {
          code += `  CURLOPT_POSTFIELDS => '${data.replace(/'/g, "\\'")}',\n`;
        }
        if (hasHeaders) {
          const headerArr = Object.entries(headers).map(([k, v]) => `    '${k}: ${v}',`);
          code += `  CURLOPT_HTTPHEADER => array(\n${headerArr.join('\n')}\n  ),\n`;
        }
        code += `));\n\n`;
        code += `$response = curl_exec($curl);\n`;
        code += `curl_close($curl);\n`;
        code += `echo $response;`;
        return code;
      }

      default:
        return '';
    }
  }, [parsed, targetLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    addToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Terminal size={20} />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">cURL to Code Multi-Language Converter</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                7 Languages
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Transform terminal or browser DevTools cURL commands into production-ready client code for JavaScript, Python, Go, Node.js, Rust, and PHP.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400">Presets:</span>
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setCurlInput(p.curl)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-all"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input cURL */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} className="text-indigo-500" />
              Raw cURL Command
            </label>
            <button
              onClick={() => setCurlInput('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw size={12} />
              Clear
            </button>
          </div>

          <textarea
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            placeholder="Paste your cURL command here (e.g. curl -X POST https://api...)"
            rows={12}
            className="w-full flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
          />

          {/* Parsed Inspector Badges */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${
                parsed.method === 'GET' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                parsed.method === 'POST' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                parsed.method === 'PUT' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-600 border border-rose-500/20'
              }`}>
                {parsed.method}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {parsed.url}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span>Headers: {Object.keys(parsed.headers).length}</span>
              <span>•</span>
              <span>Body: {parsed.data ? `${parsed.data.length} bytes` : 'None'}</span>
            </div>
          </div>
        </div>

        {/* Right: Generated Output */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          {/* Target Language Tabs */}
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'js-fetch', label: 'JS (Fetch)' },
                { id: 'js-axios', label: 'Axios' },
                { id: 'python', label: 'Python' },
                { id: 'node', label: 'Node.js' },
                { id: 'go', label: 'Go' },
                { id: 'rust', label: 'Rust' },
                { id: 'php', label: 'PHP' },
              ].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setTargetLang(lang.id as TargetLanguage)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    targetLang === lang.id
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          {/* Generated Code Area */}
          <div className="relative flex-1">
            <pre className="h-full min-h-[300px] p-4 rounded-2xl bg-[#0b0f19] text-indigo-100 border border-slate-800 font-mono text-xs overflow-auto leading-relaxed">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
