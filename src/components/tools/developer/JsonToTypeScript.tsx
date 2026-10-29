import React, { useState, useMemo } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Sparkles, 
  Braces, 
  Layers, 
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

type OutputFormat = 'ts-interface' | 'ts-type' | 'zod' | 'go-struct';

const SAMPLES = {
  user: `{
  "id": "usr_99824",
  "name": "Alex Mercer",
  "email": "alex.mercer@prototype.io",
  "isVerified": true,
  "role": "lead_developer",
  "profile": {
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    "bio": "Building scalable web tools",
    "reputation": 4520,
    "skills": ["TypeScript", "Rust", "React", "Docker"]
  },
  "settings": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false,
      "slack": true
    }
  },
  "tags": ["core-team", "maintainer"]
}`,
  apiResponse: `{
  "status": 200,
  "message": "Success",
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 1420,
    "totalPages": 71,
    "hasNext": true
  },
  "data": [
    {
      "productId": "prd_001",
      "title": "Ergonomic Mechanical Keyboard",
      "price": 149.99,
      "currency": "USD",
      "inStock": true,
      "rating": 4.8
    }
  ]
}`,
};

export const JsonToTypeScript: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLES.user);
  const [rootName, setRootName] = useState('Root');
  const [format, setFormat] = useState<OutputFormat>('ts-interface');
  const [makeOptional, setMakeOptional] = useState(false);
  const [makeReadonly, setMakeReadonly] = useState(false);
  const [useExport, setUseExport] = useState(true);
  const [copied, setCopied] = useState(false);

  const { addToast } = useToast();

  const toPascalCase = (str: string): string => {
    return str
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
  };

  const parsedJson = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      return { data: parsed, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Invalid JSON' };
    }
  }, [jsonInput]);

  const generatedOutput = useMemo(() => {
    if (!parsedJson.data) return '// Waiting for valid JSON input...';

    const rootTypeName = toPascalCase(rootName) || 'Root';
    const subTypes: { name: string; content: string }[] = [];
    const definedTypeNames = new Set<string>();

    const isValidJsIdentifier = (str: string): boolean => {
      return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str);
    };

    const quoteProp = (key: string): string => {
      return isValidJsIdentifier(key) ? key : JSON.stringify(key);
    };

    const getType = (val: any, propName: string): string => {
      if (val === null) return 'any';
      if (typeof val === 'string') return 'string';
      if (typeof val === 'number') return 'number';
      if (typeof val === 'boolean') return 'boolean';

      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]';
        // Check types in array
        const elementTypes = Array.from(new Set(val.map(item => {
          if (item === null) return 'null';
          if (typeof item === 'object') return 'object';
          return typeof item;
        })));

        if (elementTypes.length === 1 && elementTypes[0] === 'object') {
          const subTypeName = `${toPascalCase(propName)}Item`;
          buildType(val[0], subTypeName);
          return `${subTypeName}[]`;
        }

        if (elementTypes.length === 1) {
          return `${getType(val[0], propName)}[]`;
        }

        const unionTypes = Array.from(new Set(val.map(item => getType(item, propName)))).join(' | ');
        return `(${unionTypes})[]`;
      }

      if (typeof val === 'object') {
        const subTypeName = toPascalCase(propName);
        buildType(val, subTypeName);
        return subTypeName;
      }

      return 'any';
    };

    const buildType = (obj: Record<string, any>, typeName: string) => {
      if (definedTypeNames.has(typeName)) return;
      definedTypeNames.add(typeName);

      if (format === 'ts-interface') {
        const exp = useExport ? 'export ' : '';
        let str = `${exp}interface ${typeName} {\n`;
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          const ro = makeReadonly ? 'readonly ' : '';
          const opt = makeOptional ? '?' : '';
          const propType = getType(val, key);
          const propKey = quoteProp(key);
          str += `  ${ro}${propKey}${opt}: ${propType};\n`;
        }
        str += `}\n`;
        subTypes.push({ name: typeName, content: str });
      } else if (format === 'ts-type') {
        const exp = useExport ? 'export ' : '';
        let str = `${exp}type ${typeName} = {\n`;
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          const ro = makeReadonly ? 'readonly ' : '';
          const opt = makeOptional ? '?' : '';
          const propType = getType(val, key);
          const propKey = quoteProp(key);
          str += `  ${ro}${propKey}${opt}: ${propType};\n`;
        }
        str += `};\n`;
        subTypes.push({ name: typeName, content: str });
      } else if (format === 'zod') {
        const exp = useExport ? 'export ' : '';
        const getZodType = (v: any, pName: string): string => {
          if (v === null) return 'z.any().nullable()';
          if (typeof v === 'string') return 'z.string()';
          if (typeof v === 'number') return 'z.number()';
          if (typeof v === 'boolean') return 'z.boolean()';
          if (Array.isArray(v)) {
            if (v.length === 0) return 'z.array(z.any())';
            const f = v[0];
            if (typeof f === 'object' && f !== null) {
              const subZodName = `${toPascalCase(pName)}ItemSchema`;
              buildZod(f, subZodName);
              return `z.array(${subZodName})`;
            }
            return `z.array(${getZodType(f, pName)})`;
          }
          if (typeof v === 'object') {
            const subZodName = `${toPascalCase(pName)}Schema`;
            buildZod(v, subZodName);
            return subZodName;
          }
          return 'z.any()';
        };

        const buildZod = (o: Record<string, any>, schemaName: string) => {
          let str = `${exp}const ${schemaName} = z.object({\n`;
          for (const key of Object.keys(o)) {
            let zType = getZodType(o[key], key);
            if (makeOptional) zType += '.optional()';
            const propKey = quoteProp(key);
            str += `  ${propKey}: ${zType},\n`;
          }
          str += `});\n\n`;
          str += `${exp}type ${toPascalCase(schemaName.replace('Schema', ''))} = z.infer<typeof ${schemaName}>;\n`;
          subTypes.push({ name: schemaName, content: str });
        };

        buildZod(obj, `${rootTypeName}Schema`);
      } else if (format === 'go-struct') {
        const getGoType = (v: any, pName: string): string => {
          if (v === null) return 'interface{}';
          if (typeof v === 'string') return 'string';
          if (typeof v === 'number') return Number.isInteger(v) ? 'int64' : 'float64';
          if (typeof v === 'boolean') return 'bool';
          if (Array.isArray(v)) {
            if (v.length === 0) return '[]interface{}';
            const f = v[0];
            if (typeof f === 'object' && f !== null) {
              const subGoName = `${toPascalCase(pName)}Item`;
              buildGo(f, subGoName);
              return `[]${subGoName}`;
            }
            return `[]${getGoType(f, pName)}`;
          }
          if (typeof v === 'object') {
            const subGoName = toPascalCase(pName);
            buildGo(v, subGoName);
            return subGoName;
          }
          return 'interface{}';
        };

        const buildGo = (o: Record<string, any>, structName: string) => {
          let str = `type ${structName} struct {\n`;
          for (const key of Object.keys(o)) {
            let fieldName = toPascalCase(key);
            if (!fieldName) fieldName = 'Field';
            if (/^[0-9]/.test(fieldName)) fieldName = `Field${fieldName}`;
            const goType = getGoType(o[key], key);
            const omitempty = makeOptional ? ',omitempty' : '';
            str += `\t${fieldName} ${goType} \`json:"${key}${omitempty}"\`\n`;
          }
          str += `}\n`;
          subTypes.push({ name: structName, content: str });
        };

        buildGo(obj, rootTypeName);
      }
    };

    if (Array.isArray(parsedJson.data)) {
      if (parsedJson.data.length > 0 && typeof parsedJson.data[0] === 'object' && parsedJson.data[0] !== null) {
        buildType(parsedJson.data[0], `${rootTypeName}Item`);
        const exp = useExport ? 'export ' : '';
        if (format === 'ts-interface' || format === 'ts-type') {
          subTypes.push({
            name: rootTypeName,
            content: `${exp}type ${rootTypeName} = ${rootTypeName}Item[];\n`
          });
        } else if (format === 'zod') {
          subTypes.push({
            name: rootTypeName,
            content: `${exp}const ${rootTypeName}Schema = z.array(${rootTypeName}ItemSchema);\n${exp}type ${rootTypeName} = z.infer<typeof ${rootTypeName}Schema>;\n`
          });
        } else if (format === 'go-struct') {
          subTypes.push({
            name: rootTypeName,
            content: `type ${rootTypeName} []${rootTypeName}Item\n`
          });
        }
      } else {
        const itemType = parsedJson.data.length > 0 ? getType(parsedJson.data[0], 'item') : 'any';
        const exp = useExport ? 'export ' : '';
        if (format === 'ts-interface' || format === 'ts-type') {
          subTypes.push({
            name: rootTypeName,
            content: `${exp}type ${rootTypeName} = ${itemType}[];\n`
          });
        }
      }
    } else if (typeof parsedJson.data === 'object' && parsedJson.data !== null) {
      buildType(parsedJson.data, rootTypeName);
    }

    if (format === 'zod') {
      return `import { z } from 'zod';\n\n` + subTypes.map(s => s.content).join('\n');
    }

    return subTypes.map(s => s.content).join('\n');
  }, [parsedJson, rootName, format, makeOptional, makeReadonly, useExport]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    addToast('Type definitions copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormatJson = () => {
    if (parsedJson.data) {
      setJsonInput(JSON.stringify(parsedJson.data, null, 2));
      addToast('Formatted JSON', 'info');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <FileCode2 size={20} />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">JSON to TypeScript & Schema Studio</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                TypeScript • Zod • Go
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Generate strong TypeScript interfaces, type aliases, runtime Zod validation schemas, and Go structs from raw JSON with nested type separation.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400">Samples:</span>
            <button
              onClick={() => setJsonInput(SAMPLES.user)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 text-xs font-medium transition-all"
            >
              User Profile
            </button>
            <button
              onClick={() => setJsonInput(SAMPLES.apiResponse)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 text-xs font-medium transition-all"
            >
              API Response
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: JSON Input */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Braces size={14} className="text-blue-500" />
              Raw JSON Input
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFormatJson}
                disabled={!parsedJson.data}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40"
              >
                Prettify
              </button>
              <button
                onClick={() => setJsonInput('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw size={12} />
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste JSON object or array here..."
            rows={14}
            className="w-full flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
          />

          {/* Validation Status */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            {parsedJson.error ? (
              <span className="text-rose-500 flex items-center gap-1.5 font-mono">
                <AlertCircle size={14} />
                JSON Error: {parsedJson.error}
              </span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-1.5 font-mono">
                <CheckCircle2 size={14} />
                Valid JSON Structure
              </span>
            )}
            <span className="text-slate-400 font-mono">
              {jsonInput.length} chars
            </span>
          </div>
        </div>

        {/* Right: Output and Settings */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col space-y-4">
          {/* Format Selector Pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-2xl">
              {[
                { id: 'ts-interface', label: 'TS Interface' },
                { id: 'ts-type', label: 'TS Type' },
                { id: 'zod', label: 'Zod Schema' },
                { id: 'go-struct', label: 'Go Struct' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFormat(item.id as OutputFormat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    format === item.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          {/* Configuration Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Root Type Name
              </label>
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                placeholder="Root"
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={makeOptional}
                  onChange={(e) => setMakeOptional(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Optional (?)</span>
              </label>
            </div>

            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={makeReadonly}
                  onChange={(e) => setMakeReadonly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Readonly</span>
              </label>
            </div>

            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useExport}
                  onChange={(e) => setUseExport(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Export</span>
              </label>
            </div>
          </div>

          {/* Generated Code Area */}
          <div className="relative flex-1">
            <pre className="h-full min-h-[300px] p-4 rounded-2xl bg-[#090d16] text-blue-100 border border-slate-800 font-mono text-xs overflow-auto leading-relaxed">
              <code>{generatedOutput}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
