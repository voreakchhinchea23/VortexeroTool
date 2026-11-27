import { create, all, MathNode, EvalFunction } from 'mathjs';

const math = create(all, {});

export type MathProblemType =
  | 'arithmetic'
  | 'linear_equation'
  | 'quadratic_equation'
  | 'polynomial_equation'
  | 'transcendental_equation'
  | 'system_2x2'
  | 'calculus_derivative'
  | 'calculus_integral'
  | 'expression_function'
  | 'error';

export interface MathStep {
  title: string;
  math: string;
  explanation: string;
}

export interface MathAlternateForm {
  label: string;
  value: string;
}

export interface PlotSeries {
  label: string;
  expr: string;
  color: string;
  type?: 'curve' | 'area';
  areaBounds?: [number, number];
}

export interface PlotPoint {
  x: number;
  y: number;
  label: string;
}

export interface MathPlotData {
  series: PlotSeries[];
  points: PlotPoint[];
  xRange: [number, number];
  yRange: [number, number];
  variable: string;
}

export interface MathSolution {
  problemType: MathProblemType;
  problemLabel: string;
  normalizedInput: string;
  finalAnswer: string;
  alternateForms: MathAlternateForm[];
  steps: MathStep[];
  verification: string | null;
  plot: MathPlotData | null;
  error?: string;
}

export interface SolveOptions {
  angleUnit?: 'rad' | 'deg';
}

const KNOWN_CONSTANTS_AND_FUNCS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
  'sqrt', 'cbrt', 'abs', 'log', 'log10', 'log2', 'ln', 'exp',
  'floor', 'ceil', 'round', 'min', 'max', 'mod', 'pow', 'nthRoot',
  'pi', 'e', 'i', 'tau', 'phi', 'deg', 'rad',
  'd', 'dx', 'diff', 'derivative', 'int', 'integrate', 'of'
]);

const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁰': '^0',
  '¹': '^1',
  '²': '^2',
  '³': '^3',
  '⁴': '^4',
  '⁵': '^5',
  '⁶': '^6',
  '⁷': '^7',
  '⁸': '^8',
  '⁹': '^9',
};

const UNICODE_FRACTION_MAP: Record<string, string> = {
  '½': '(1/2)',
  '⅓': '(1/3)',
  '⅔': '(2/3)',
  '¼': '(1/4)',
  '¾': '(3/4)',
  '⅕': '(1/5)',
  '⅖': '(2/5)',
  '⅗': '(3/5)',
  '⅘': '(4/5)',
  '⅙': '(1/6)',
  '⅚': '(5/6)',
  '⅛': '(1/8)',
  '⅜': '(3/8)',
  '⅝': '(5/8)',
  '⅞': '(7/8)',
};

/**
 * Clean raw OCR output or human shorthand into clean mathematical syntax.
 */
export function normalizeMathOcr(raw: string): string {
  if (!raw) return '';
  let text = raw.trim();

  // Strip common question prefixes like "1)", "Q1:", "Problem 2."
  text = text.replace(/^(?:Q\s*\d+|Problem\s*\d+|\d+\s*[.)\]])[:.\s]+/i, '');

  // Replace Unicode math symbols
  text = text
    .replace(/[×⋅·✕✖]/g, '*')
    .replace(/[÷∕]/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/[＝]/g, '=')
    .replace(/[＋]/g, '+')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')')
    .replace(/[\[\{]/g, '(')
    .replace(/[\]\}]/g, ')')
    .replace(/π/gi, 'pi')
    .replace(/√\s*\(([^)]+)\)/g, 'sqrt($1)')
    .replace(/√\s*([a-zA-Z0-9.]+)/g, 'sqrt($1)')
    .replace(/√/g, 'sqrt')
    .replace(/≤|≥/g, '=');

  // Convert superscript digits (e.g. x² -> x^2, x²³ -> x^23)
  text = text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (match) => {
    const digits = match
      .split('')
      .map((ch) => SUPERSCRIPT_MAP[ch]?.slice(1) ?? '')
      .join('');
    return `^${digits}`;
  });

  // Convert unicode fractions
  for (const [uni, rep] of Object.entries(UNICODE_FRACTION_MAP)) {
    text = text.split(uni).join(rep);
  }

  // Collapse multi-line splits into either single line (if split around operator) or system separator
  const rawLines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length > 1) {
    // If multiple lines each contain '=', treat as a system of equations separated by '; '
    const eqLines = rawLines.filter((l) => l.includes('='));
    if (eqLines.length >= 2 && eqLines.length === rawLines.length) {
      text = rawLines.join('; ');
    } else {
      text = rawLines.join(' ');
    }
  } else {
    text = rawLines[0] || '';
  }

  // Common OCR mistakes in math context:
  // "2 X + 5" or "x" uppercase X in equation -> lowercase x (unless hexadecimal, rare here)
  text = text.replace(/\bX\b/g, 'x').replace(/\bY\b/g, 'y');
  // OCR sometimes writes "l" or "|" next to numbers or standalone as 1 when adjacent to operators
  text = text.replace(/\|/g, '');
  // Replace "==" with "="
  text = text.replace(/={2,}/g, '=');
  // Trim trailing punctuation artifacts from OCR like "." or "?"
  text = text.replace(/[.,?]+$/g, '').trim();
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ');

  return text;
}

function buildScope(options?: SolveOptions, vars: Record<string, number> = {}): Record<string, unknown> {
  const angleUnit = options?.angleUnit || 'rad';
  const base: Record<string, unknown> = {
    ...vars,
    ln: (x: number) => Math.log(x),
  };
  if (angleUnit === 'deg') {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;
    base.sin = (x: number) => Math.sin(toRad(x));
    base.cos = (x: number) => Math.cos(toRad(x));
    base.tan = (x: number) => Math.tan(toRad(x));
    base.asin = (x: number) => toDeg(Math.asin(x));
    base.acos = (x: number) => toDeg(Math.acos(x));
    base.atan = (x: number) => toDeg(Math.atan(x));
  }
  return base;
}

function preprocessForMathJs(expr: string): string {
  let s = expr.trim();
  // Replace `ln(` with `log(` when calling symbolic functions
  s = s.replace(/\bln\s*\(/gi, 'log(');
  // Handle percentage phrases: "15% of 240" -> "(15/100)*(240)"
  s = s.replace(/(\d+(?:\.\d+)?)\s*%\s*of\s*([a-zA-Z0-9.()+-/*^]+)/gi, '(($1/100)*($2))');
  // Handle "200 + 15%" or "200 - 15%" -> "200 + (200 * 15 / 100)"
  s = s.replace(/(\d+(?:\.\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?)\s*%/g, '($1 $2 ($1 * $3 / 100))');
  // Standalone "25%" -> "(25/100)"
  s = s.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');
  return s;
}

export function formatNum(n: number, maxDecimals = 6): string {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-11) return '0';
  const rounded = Number(n.toFixed(maxDecimals));
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded);
}

function tryToFraction(n: number): string | null {
  if (!Number.isFinite(n) || Number.isInteger(n)) return null;
  try {
    const frac = math.fraction(n);
    if (frac.d > 1 && frac.d <= 10000) {
      const sign = frac.s < 0n ? '-' : '';
      return `${sign}${frac.n}/${frac.d}`;
    }
  } catch {
    // ignore
  }
  return null;
}

export function getPrimeFactorization(n: number): string | null {
  if (!Number.isInteger(n) || n < 2 || n > 1e11) return null;
  let rem = n;
  const factors: Map<number, number> = new Map();
  let d = 2;
  while (d * d <= rem) {
    while (rem % d === 0) {
      factors.set(d, (factors.get(d) || 0) + 1);
      rem = rem / d;
    }
    d += d === 2 ? 1 : 2;
  }
  if (rem > 1) {
    factors.set(rem, (factors.get(rem) || 0) + 1);
  }
  if (factors.size === 1 && factors.get(n) === 1) {
    return 'Prime number';
  }
  return Array.from(factors.entries())
    .map(([p, exp]) => (exp > 1 ? `${p}^${exp}` : `${p}`))
    .join(' × ');
}

function extractVariables(expr: string): string[] {
  try {
    const node = math.parse(preprocessForMathJs(expr));
    const vars = new Set<string>();
    node.traverse((n: MathNode) => {
      if (n.type === 'SymbolNode') {
        const name = (n as unknown as { name: string }).name;
        if (!KNOWN_CONSTANTS_AND_FUNCS.has(name) && /^[a-zA-Z]$/.test(name)) {
          vars.add(name);
        }
      }
    });
    return Array.from(vars);
  } catch {
    return [];
  }
}

function buildPlotBounds(
  exprs: string[],
  variable: string,
  centerHint = 0,
  spanHint = 10,
  options?: SolveOptions
): { xRange: [number, number]; yRange: [number, number] } {
  const half = Math.max(5, Math.min(50, spanHint));
  const xMin = Math.floor(centerHint - half);
  const xMax = Math.ceil(centerHint + half);
  let yMin = Infinity;
  let yMax = -Infinity;

  const samples = 80;
  for (const expr of exprs) {
    const compiled = math.compile(preprocessForMathJs(expr));
    for (let i = 0; i <= samples; i++) {
      const x = xMin + ((xMax - xMin) * i) / samples;
      try {
        const y = compiled.evaluate(buildScope(options, { [variable]: x }));
        if (typeof y === 'number' && Number.isFinite(y) && Math.abs(y) < 1e4) {
          if (y < yMin) yMin = y;
          if (y > yMax) yMax = y;
        }
      } catch {
        // skip discontinuity
      }
    }
  }

  if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
    return { xRange: [xMin, xMax], yRange: [-10, 10] };
  }
  if (Math.abs(yMax - yMin) < 1e-6) {
    yMin -= 5;
    yMax += 5;
  }
  const pad = (yMax - yMin) * 0.15;
  return {
    xRange: [xMin, xMax],
    yRange: [Math.min(-1, yMin - pad), Math.max(1, yMax + pad)],
  };
}

export function sampleExpressionCurve(
  expr: string,
  variable: string,
  xRange: [number, number],
  numSamples = 200,
  options?: SolveOptions
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  try {
    const compiled = math.compile(preprocessForMathJs(expr));
    const [xMin, xMax] = xRange;
    for (let i = 0; i <= numSamples; i++) {
      const x = xMin + ((xMax - xMin) * i) / numSamples;
      try {
        const y = compiled.evaluate(buildScope(options, { [variable]: x }));
        if (typeof y === 'number' && Number.isFinite(y)) {
          pts.push({ x, y });
        } else {
          pts.push({ x, y: NaN });
        }
      } catch {
        pts.push({ x, y: NaN });
      }
    }
  } catch {
    return [];
  }
  return pts;
}

function findRealRootsNumerical(
  expr: string,
  variable: string,
  options?: SolveOptions,
  range: [number, number] = [-50, 50]
): number[] {
  const compiled = math.compile(preprocessForMathJs(expr));
  const evalFn = (val: number): number => {
    try {
      const res = compiled.evaluate(buildScope(options, { [variable]: val }));
      return typeof res === 'number' && Number.isFinite(res) ? res : NaN;
    } catch {
      return NaN;
    }
  };

  const roots: number[] = [];
  const steps = 1000;
  const [minX, maxX] = range;
  const dx = (maxX - minX) / steps;

  const addRoot = (r: number) => {
    const clean = Math.abs(r) < 1e-9 ? 0 : Number(r.toFixed(7));
    if (!roots.some((existing) => Math.abs(existing - clean) < 1e-4)) {
      // Double check |f(r)| is genuinely near zero (filter poles/asymptotes)
      const checkVal = Math.abs(evalFn(clean));
      if (Number.isFinite(checkVal) && checkVal < 1e-3) {
        roots.push(clean);
      }
    }
  };

  let prevX = minX;
  let prevY = evalFn(prevX);

  for (let i = 1; i <= steps; i++) {
    const curX = minX + i * dx;
    const curY = evalFn(curX);

    if (Number.isFinite(prevY) && Math.abs(prevY) < 1e-8) {
      addRoot(prevX);
    }

    if (Number.isFinite(prevY) && Number.isFinite(curY) && prevY * curY < 0) {
      // Bisection refinement
      let lo = prevX;
      let hi = curX;
      let fLo = prevY;
      for (let iter = 0; iter < 50; iter++) {
        const mid = (lo + hi) / 2;
        const fMid = evalFn(mid);
        if (!Number.isFinite(fMid)) break;
        if (Math.abs(fMid) < 1e-11) {
          lo = hi = mid;
          break;
        }
        if (fLo * fMid <= 0) {
          hi = mid;
        } else {
          lo = mid;
          fLo = fMid;
        }
      }
      addRoot((lo + hi) / 2);
    }

    prevX = curX;
    prevY = curY;
  }

  return roots.sort((a, b) => a - b);
}

function solveSystem2x2(eq1: string, eq2: string, options?: SolveOptions): MathSolution | null {
  const parts1 = eq1.split('=');
  const parts2 = eq2.split('=');
  if (parts1.length !== 2 || parts2.length !== 2) return null;

  const f1Expr = `(${preprocessForMathJs(parts1[0])}) - (${preprocessForMathJs(parts1[1])})`;
  const f2Expr = `(${preprocessForMathJs(parts2[0])}) - (${preprocessForMathJs(parts2[1])})`;

  const vars = Array.from(new Set([...extractVariables(f1Expr), ...extractVariables(f2Expr)]));
  if (vars.length !== 2) return null;
  const [v1, v2] = vars.sort(); // typically ['x', 'y']

  try {
    const c1 = math.compile(f1Expr);
    const c2 = math.compile(f2Expr);

    const evalPair = (compiled: EvalFunction, a: number, b: number) =>
      Number(compiled.evaluate(buildScope(options, { [v1]: a, [v2]: b })));

    // F(v1, v2) = A*v1 + B*v2 + K = 0  =>  A*v1 + B*v2 = -K
    const k1 = evalPair(c1, 0, 0);
    const a1 = evalPair(c1, 1, 0) - k1;
    const b1 = evalPair(c1, 0, 1) - k1;
    const rhs1 = -k1;

    const k2 = evalPair(c2, 0, 0);
    const a2 = evalPair(c2, 1, 0) - k2;
    const b2 = evalPair(c2, 0, 1) - k2;
    const rhs2 = -k2;

    // Verify linearity by checking at (2, 3)
    const test1 = evalPair(c1, 2, 3) - (a1 * 2 + b1 * 3 + k1);
    const test2 = evalPair(c2, 2, 3) - (a2 * 2 + b2 * 3 + k2);
    if (Math.abs(test1) > 1e-6 || Math.abs(test2) > 1e-6) {
      return null;
    }

    const det = a1 * b2 - a2 * b1;
    const steps: MathStep[] = [
      {
        title: 'Write both equations in standard linear form',
        math: `${formatNum(a1)}${v1} + ${formatNum(b1)}${v2} = ${formatNum(rhs1)}  |  ${formatNum(a2)}${v1} + ${formatNum(b2)}${v2} = ${formatNum(rhs2)}`,
        explanation: `Rewriting both equations in the form a${v1} + b${v2} = c aligns the coefficients.`,
      },
      {
        title: 'Compute the determinant (Cramer’s Rule)',
        math: `D = (${formatNum(a1)})(${formatNum(b2)}) - (${formatNum(a2)})(${formatNum(b1)}) = ${formatNum(det)}`,
        explanation: 'The determinant tells us whether the two lines intersect at a unique point.',
      },
    ];

    if (Math.abs(det) < 1e-10) {
      const sameLine = Math.abs(a1 * rhs2 - a2 * rhs1) < 1e-8 && Math.abs(b1 * rhs2 - b2 * rhs1) < 1e-8;
      steps.push({
        title: sameLine ? 'Coincident lines detected' : 'Parallel lines detected',
        math: sameLine ? 'Infinite solutions (dependent system)' : 'No solution (inconsistent system)',
        explanation: sameLine
          ? 'Both equations represent the exact same line, so every point on the line satisfies both.'
          : 'The lines have the same slope but different intercepts, so they never intersect.',
      });

      return {
        problemType: 'system_2x2',
        problemLabel: '2×2 Linear System',
        normalizedInput: `${eq1}; ${eq2}`,
        finalAnswer: sameLine ? 'Infinitely many solutions' : 'No solution',
        alternateForms: [],
        steps,
        verification: null,
        plot: null,
      };
    }

    const detX = rhs1 * b2 - rhs2 * b1;
    const detY = a1 * rhs2 - a2 * rhs1;
    const sol1 = detX / det;
    const sol2 = detY / det;

    steps.push(
      {
        title: `Solve for ${v1}`,
        math: `${v1} = D_${v1} / D = ${formatNum(detX)} / ${formatNum(det)} = ${formatNum(sol1)}`,
        explanation: `Replace the ${v1}-coefficients with the constants to compute D_${v1} and divide by D.`,
      },
      {
        title: `Solve for ${v2}`,
        math: `${v2} = D_${v2} / D = ${formatNum(detY)} / ${formatNum(det)} = ${formatNum(sol2)}`,
        explanation: `Replace the ${v2}-coefficients with the constants to compute D_${v2} and divide by D.`,
      }
    );

    const alternateForms: MathAlternateForm[] = [];
    const fSol1 = tryToFraction(sol1);
    const fSol2 = tryToFraction(sol2);
    if (fSol1 || fSol2) {
      alternateForms.push({
        label: 'Exact Fraction Pair',
        value: `(${v1}, ${v2}) = (${fSol1 || formatNum(sol1)}, ${fSol2 || formatNum(sol2)})`,
      });
    }

    // Plot both lines as functions of v1 if b1 != 0 and b2 != 0
    let plot: MathPlotData | null = null;
    if (v1 === 'x' && v2 === 'y' && Math.abs(b1) > 1e-9 && Math.abs(b2) > 1e-9) {
      const yExpr1 = `(${rhs1} - (${a1}) * x) / (${b1})`;
      const yExpr2 = `(${rhs2} - (${a2}) * x) / (${b2})`;
      const bounds = buildPlotBounds([yExpr1, yExpr2], 'x', sol1, Math.max(8, Math.abs(sol1) + 6), options);
      plot = {
        series: [
          { label: eq1, expr: yExpr1, color: '#6366f1' },
          { label: eq2, expr: yExpr2, color: '#ec4899' },
        ],
        points: [{ x: sol1, y: sol2, label: `(${formatNum(sol1, 2)}, ${formatNum(sol2, 2)})` }],
        xRange: bounds.xRange,
        yRange: bounds.yRange,
        variable: 'x',
      };
    }

    return {
      problemType: 'system_2x2',
      problemLabel: '2×2 Linear System',
      normalizedInput: `${eq1}; ${eq2}`,
      finalAnswer: `${v1} = ${formatNum(sol1)}, ${v2} = ${formatNum(sol2)}`,
      alternateForms,
      steps,
      verification: `Eq 1: ${formatNum(a1 * sol1 + b1 * sol2)} = ${formatNum(rhs1)} | Eq 2: ${formatNum(a2 * sol1 + b2 * sol2)} = ${formatNum(rhs2)}`,
      plot,
    };
  } catch {
    return null;
  }
}

function solveCalculusCommand(input: string, options?: SolveOptions): MathSolution | null {
  // Derivative patterns: d/dx(...), diff(...), derivative(...)
  const derivMatch = input.match(/^(?:d\/d([a-zA-Z])\s*\(?(.+?)\)?|diff\s*\((.+?)(?:,\s*([a-zA-Z]))?\)|derivative\s*\((.+?)(?:,\s*([a-zA-Z]))?\))$/i);
  if (derivMatch) {
    const rawVar = derivMatch[1] || derivMatch[4] || derivMatch[6];
    const rawBody = (derivMatch[2] || derivMatch[3] || derivMatch[5] || '').trim();
    const body = rawBody.replace(/^\((.*)\)$/, '$1');
    const vars = extractVariables(body);
    const variable = rawVar || vars[0] || 'x';

    try {
      const processed = preprocessForMathJs(body);
      const dNode = math.derivative(processed, variable);
      const simplified = math.simplify(dNode).toString();
      const steps: MathStep[] = [
        {
          title: 'Identify function and differentiation variable',
          math: `f(${variable}) = ${body}`,
          explanation: `Differentiate with respect to ${variable} using symbolic differentiation rules (power, product, chain, and sum rules).`,
        },
        {
          title: 'Apply derivative rules',
          math: `d/d${variable} [${body}] = ${dNode.toString()}`,
          explanation: 'Expand the symbolic derivative term by term.',
        },
        {
          title: 'Simplify the resulting derivative',
          math: `f'(${variable}) = ${simplified}`,
          explanation: 'Combine like terms and simplify constants.',
        },
      ];

      const bounds = buildPlotBounds([processed, simplified], variable, 0, 8, options);
      return {
        problemType: 'calculus_derivative',
        problemLabel: 'Symbolic Derivative',
        normalizedInput: `d/d${variable}(${body})`,
        finalAnswer: `f'(${variable}) = ${simplified}`,
        alternateForms: [
          { label: 'Un-simplified Form', value: dNode.toString() },
        ],
        steps,
        verification: null,
        plot: {
          series: [
            { label: `f(${variable})`, expr: processed, color: '#6366f1' },
            { label: `f'(${variable})`, expr: simplified, color: '#10b981' },
          ],
          points: [],
          xRange: bounds.xRange,
          yRange: bounds.yRange,
          variable,
        },
      };
    } catch (err: unknown) {
      return {
        problemType: 'error',
        problemLabel: 'Derivative Error',
        normalizedInput: input,
        finalAnswer: 'Could not differentiate expression',
        alternateForms: [],
        steps: [],
        verification: null,
        plot: null,
        error: err instanceof Error ? err.message : 'Invalid derivative syntax',
      };
    }
  }

  // Definite integral pattern: integrate(expr, a, b) or int(expr, a, b)
  const intMatch = input.match(/^(?:integrate|int)\s*\(\s*(.+?)\s*,\s*([^,]+?)\s*,\s*([^,]+?)\s*\)$/i);
  if (intMatch) {
    const body = intMatch[1].trim();
    const lowerStr = intMatch[2].trim();
    const upperStr = intMatch[3].trim();
    try {
      const a = Number(math.evaluate(preprocessForMathJs(lowerStr), buildScope(options)));
      const b = Number(math.evaluate(preprocessForMathJs(upperStr), buildScope(options)));
      const vars = extractVariables(body);
      const variable = vars[0] || 'x';
      const processed = preprocessForMathJs(body);
      const compiled = math.compile(processed);

      // Composite Simpson's Rule with n = 1000 subintervals
      const n = 1000;
      const h = (b - a) / n;
      const f = (v: number) => Number(compiled.evaluate(buildScope(options, { [variable]: v })));
      let sum = f(a) + f(b);
      for (let i = 1; i < n; i++) {
        sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
      }
      const integralVal = (h / 3) * sum;
      if (!Number.isFinite(integralVal)) {
        throw new Error('Integral diverges or is undefined on the given interval.');
      }

      const frac = tryToFraction(integralVal);
      const center = (a + b) / 2;
      const span = Math.max(6, Math.abs(b - a) * 1.5);
      const bounds = buildPlotBounds([processed], variable, center, span, options);

      return {
        problemType: 'calculus_integral',
        problemLabel: 'Definite Integral',
        normalizedInput: `integrate(${body}, ${lowerStr}, ${upperStr})`,
        finalAnswer: formatNum(integralVal, 6),
        alternateForms: frac ? [{ label: 'Exact Fraction', value: frac }] : [],
        steps: [
          {
            title: 'Set up the definite integral',
            math: `∫[${formatNum(a)} → ${formatNum(b)}] (${body}) d${variable}`,
            explanation: `Integrate f(${variable}) = ${body} from lower limit a = ${formatNum(a)} to upper limit b = ${formatNum(b)}.`,
          },
          {
            title: 'Apply Composite Simpson’s Quadrature (n = 1000)',
            math: `Δ${variable} = (${formatNum(b)} - ${formatNum(a)}) / 1000 = ${formatNum(h, 6)}`,
            explanation: 'Divide the interval into 1,000 parabolic sub-intervals for high-precision numerical area computation.',
          },
          {
            title: 'Net Signed Area Result',
            math: `≈ ${formatNum(integralVal, 6)}${frac ? ` (${frac})` : ''}`,
            explanation: 'Represents the net signed area between the curve and the horizontal axis.',
          },
        ],
        verification: null,
        plot: {
          series: [
            { label: `f(${variable})`, expr: processed, color: '#8b5cf6', type: 'area', areaBounds: [Math.min(a, b), Math.max(a, b)] },
          ],
          points: [],
          xRange: bounds.xRange,
          yRange: bounds.yRange,
          variable,
        },
      };
    } catch (err: unknown) {
      return {
        problemType: 'error',
        problemLabel: 'Integral Error',
        normalizedInput: input,
        finalAnswer: 'Could not evaluate integral',
        alternateForms: [],
        steps: [],
        verification: null,
        plot: null,
        error: err instanceof Error ? err.message : 'Invalid integral syntax',
      };
    }
  }

  return null;
}

function solveSingleEquation(lhsRaw: string, rhsRaw: string, options?: SolveOptions): MathSolution {
  const lhsProc = preprocessForMathJs(lhsRaw);
  const rhsProc = preprocessForMathJs(rhsRaw);
  const diffExpr = `(${lhsProc}) - (${rhsProc})`;
  const vars = extractVariables(diffExpr);

  // Constant identity / numeric equality check
  if (vars.length === 0) {
    try {
      const lVal = Number(math.evaluate(lhsProc, buildScope(options)));
      const rVal = Number(math.evaluate(rhsProc, buildScope(options)));
      const isTrue = Math.abs(lVal - rVal) < 1e-9;
      return {
        problemType: 'arithmetic',
        problemLabel: 'Equation Verification',
        normalizedInput: `${lhsRaw} = ${rhsRaw}`,
        finalAnswer: isTrue ? `True (${formatNum(lVal)} = ${formatNum(rVal)})` : `False (${formatNum(lVal)} ≠ ${formatNum(rVal)})`,
        alternateForms: [],
        steps: [
          {
            title: 'Evaluate Left-Hand Side',
            math: `${lhsRaw} = ${formatNum(lVal)}`,
            explanation: 'Compute the numerical value of the left expression.',
          },
          {
            title: 'Evaluate Right-Hand Side',
            math: `${rhsRaw} = ${formatNum(rVal)}`,
            explanation: 'Compute the numerical value of the right expression.',
          },
          {
            title: 'Compare Both Sides',
            math: `${formatNum(lVal)} ${isTrue ? '=' : '≠'} ${formatNum(rVal)}`,
            explanation: isTrue ? 'Both sides are equal.' : 'The two sides are not equal.',
          },
        ],
        verification: null,
        plot: null,
      };
    } catch (err: unknown) {
      return {
        problemType: 'error',
        problemLabel: 'Equation Error',
        normalizedInput: `${lhsRaw} = ${rhsRaw}`,
        finalAnswer: 'Invalid expression',
        alternateForms: [],
        steps: [],
        verification: null,
        plot: null,
        error: err instanceof Error ? err.message : 'Unable to evaluate equation.',
      };
    }
  }

  if (vars.length > 1) {
    return {
      problemType: 'error',
      problemLabel: 'Multiple Variables Detected',
      normalizedInput: `${lhsRaw} = ${rhsRaw}`,
      finalAnswer: `Found variables: ${vars.join(', ')}`,
      alternateForms: [],
      steps: [
        {
          title: 'Tip for solving systems of equations',
          math: 'eq1; eq2',
          explanation: `Separate multiple equations with a semicolon (e.g. "2x + y = 10; x - y = 2") to solve for ${vars.join(' and ')}.`,
        },
      ],
      verification: null,
      plot: null,
      error: 'Single equation contains multiple unknown variables. Add another equation separated by ";" to solve a 2×2 system.',
    };
  }

  const v = vars[0];

  // Try symbolic polynomial rationalization first (exact for degree 0, 1, 2, 3...)
  try {
    const rat = math.rationalize(diffExpr, {}, true) as {
      coefficients: number[];
      variables: string[];
      expression: MathNode;
    };

    if (rat && Array.isArray(rat.coefficients) && rat.variables.length <= 1) {
      const coeffs = rat.coefficients; // coeffs[k] is coefficient of v^k
      // Trim trailing zero coefficients
      while (coeffs.length > 1 && Math.abs(coeffs[coeffs.length - 1]) < 1e-11) {
        coeffs.pop();
      }

      const degree = coeffs.length - 1;

      // Degree 0: constant = 0 (identity or contradiction)
      if (degree <= 0) {
        const c0 = coeffs[0] ?? 0;
        const isIdentity = Math.abs(c0) < 1e-10;
        return {
          problemType: 'linear_equation',
          problemLabel: isIdentity ? 'Identity (All Real Numbers)' : 'Contradiction (No Solution)',
          normalizedInput: `${lhsRaw} = ${rhsRaw}`,
          finalAnswer: isIdentity ? 'All real numbers (∞ solutions)' : 'No solution',
          alternateForms: [],
          steps: [
            {
              title: 'Move all terms to one side',
              math: `(${lhsRaw}) - (${rhsRaw}) = 0`,
              explanation: 'Subtract the right-hand side from the left-hand side.',
            },
            {
              title: 'Simplify and cancel variable terms',
              math: `${formatNum(c0)} = 0`,
              explanation: isIdentity
                ? `All ${v} terms cancel out and 0 = 0 is always true.`
                : `All ${v} terms cancel out, leaving an impossible statement (${formatNum(c0)} ≠ 0).`,
            },
          ],
          verification: null,
          plot: null,
        };
      }

      // Degree 1: a*v + b = 0 -> v = -b / a
      if (degree === 1) {
        const b = coeffs[0];
        const a = coeffs[1];
        const sol = -b / a;
        const frac = tryToFraction(sol);
        const lCheck = Number(math.evaluate(lhsProc, buildScope(options, { [v]: sol })));
        const rCheck = Number(math.evaluate(rhsProc, buildScope(options, { [v]: sol })));

        const steps: MathStep[] = [
          {
            title: 'Bring all terms to the left-hand side',
            math: `(${lhsRaw}) - (${rhsRaw}) = 0`,
            explanation: 'Collect variable and constant terms on one side of the equation.',
          },
          {
            title: 'Simplify into standard linear form',
            math: `${formatNum(a)}${v} ${b >= 0 ? '+' : '-'} ${formatNum(Math.abs(b))} = 0`,
            explanation: `Combine like terms to obtain a${v} + b = 0 with a = ${formatNum(a)} and b = ${formatNum(b)}.`,
          },
          {
            title: `Isolate the ${v} term`,
            math: `${formatNum(a)}${v} = ${formatNum(-b)}`,
            explanation: `${b >= 0 ? 'Subtract' : 'Add'} ${formatNum(Math.abs(b))} ${b >= 0 ? 'from' : 'to'} both sides.`,
          },
          {
            title: `Divide both sides by ${formatNum(a)}`,
            math: `${v} = ${formatNum(-b)} / ${formatNum(a)} = ${formatNum(sol)}`,
            explanation: `Solve for ${v}.`,
          },
        ];

        const bounds = buildPlotBounds([lhsProc, rhsProc], v, sol, Math.max(8, Math.abs(sol) + 5), options);
        return {
          problemType: 'linear_equation',
          problemLabel: 'Linear Equation',
          normalizedInput: `${lhsRaw} = ${rhsRaw}`,
          finalAnswer: `${v} = ${formatNum(sol)}`,
          alternateForms: frac ? [{ label: 'Exact Fraction', value: `${v} = ${frac}` }] : [],
          steps,
          verification: `LHS = ${formatNum(lCheck)} | RHS = ${formatNum(rCheck)} (Exact Match)`,
          plot: {
            series: [
              { label: `LHS: ${lhsRaw}`, expr: lhsProc, color: '#6366f1' },
              { label: `RHS: ${rhsRaw}`, expr: rhsProc, color: '#ec4899' },
            ],
            points: [{ x: sol, y: lCheck, label: `Solution (${formatNum(sol, 2)}, ${formatNum(lCheck, 2)})` }],
            xRange: bounds.xRange,
            yRange: bounds.yRange,
            variable: v,
          },
        };
      }

      // Degree 2: a*v^2 + b*v + c = 0
      if (degree === 2) {
        const c = coeffs[0];
        const b = coeffs[1];
        const a = coeffs[2];
        const discriminant = b * b - 4 * a * c;
        const vertexX = -b / (2 * a);
        const stdForm = `${formatNum(a)}${v}² ${b >= 0 ? '+' : '-'} ${formatNum(Math.abs(b))}${v} ${c >= 0 ? '+' : '-'} ${formatNum(Math.abs(c))} = 0`;

        const steps: MathStep[] = [
          {
            title: 'Rewrite in standard quadratic form (ax² + bx + c = 0)',
            math: stdForm,
            explanation: `Identify coefficients: a = ${formatNum(a)}, b = ${formatNum(b)}, c = ${formatNum(c)}.`,
          },
          {
            title: 'Compute the discriminant (Δ = b² - 4ac)',
            math: `Δ = (${formatNum(b)})² - 4(${formatNum(a)})(${formatNum(c)}) = ${formatNum(discriminant)}`,
            explanation:
              discriminant > 1e-10
                ? 'Since Δ > 0, there are 2 distinct real roots.'
                : Math.abs(discriminant) <= 1e-10
                ? 'Since Δ = 0, there is 1 repeated real root.'
                : 'Since Δ < 0, there are 2 complex conjugate roots.',
          },
        ];

        const alternateForms: MathAlternateForm[] = [
          { label: 'Discriminant (Δ)', value: formatNum(discriminant) },
          { label: 'Parabola Vertex', value: `(${formatNum(vertexX, 4)}, ${formatNum(a * vertexX * vertexX + b * vertexX + c, 4)})` },
        ];

        let finalAnswer = '';
        let verification: string | null = null;
        const points: PlotPoint[] = [];

        if (discriminant > 1e-10) {
          const sqrtD = Math.sqrt(discriminant);
          const x1 = (-b - sqrtD) / (2 * a);
          const x2 = (-b + sqrtD) / (2 * a);
          const sorted = [x1, x2].sort((p, q) => p - q);
          finalAnswer = `${v}₁ = ${formatNum(sorted[0])}, ${v}₂ = ${formatNum(sorted[1])}`;
          steps.push({
            title: 'Apply the quadratic formula',
            math: `${v} = (${formatNum(-b)} ± √${formatNum(discriminant)}) / ${formatNum(2 * a)} → ${finalAnswer}`,
            explanation: 'Substitute a, b, and √Δ into x = (-b ± √Δ) / (2a).',
          });
          const f1 = tryToFraction(sorted[0]);
          const f2 = tryToFraction(sorted[1]);
          if (f1 || f2) {
            alternateForms.push({
              label: 'Exact Fraction Roots',
              value: `${v}₁ = ${f1 || formatNum(sorted[0])}, ${v}₂ = ${f2 || formatNum(sorted[1])}`,
            });
          }
          const check1 = Number(math.evaluate(diffExpr, buildScope(options, { [v]: sorted[0] })));
          const check2 = Number(math.evaluate(diffExpr, buildScope(options, { [v]: sorted[1] })));
          verification = `Residual at ${v}₁: ${formatNum(check1, 8)} | Residual at ${v}₂: ${formatNum(check2, 8)}`;
          points.push(
            { x: sorted[0], y: 0, label: `Root (${formatNum(sorted[0], 2)}, 0)` },
            { x: sorted[1], y: 0, label: `Root (${formatNum(sorted[1], 2)}, 0)` }
          );
        } else if (Math.abs(discriminant) <= 1e-10) {
          const root = -b / (2 * a);
          finalAnswer = `${v} = ${formatNum(root)} (double root)`;
          steps.push({
            title: 'Solve repeated root',
            math: `${v} = -b / (2a) = ${formatNum(-b)} / ${formatNum(2 * a)} = ${formatNum(root)}`,
            explanation: 'When Δ = 0, the parabola touches the axis at its vertex.',
          });
          points.push({ x: root, y: 0, label: `Root (${formatNum(root, 2)}, 0)` });
          verification = `At ${v} = ${formatNum(root)}, both sides equal ${formatNum(Number(math.evaluate(lhsProc, buildScope(options, { [v]: root }))))}`;
        } else {
          const realPart = -b / (2 * a);
          const imagPart = Math.sqrt(-discriminant) / Math.abs(2 * a);
          finalAnswer = `${v} = ${formatNum(realPart)} ± ${formatNum(imagPart)}i`;
          steps.push({
            title: 'Compute complex conjugate roots',
            math: `${v} = (${formatNum(-b)} ± i√${formatNum(-discriminant)}) / ${formatNum(2 * a)} = ${finalAnswer}`,
            explanation: 'Because the discriminant is negative, the roots involve the imaginary unit i = √(-1).',
          });
        }

        const bounds = buildPlotBounds([diffExpr], v, vertexX, 8, options);
        return {
          problemType: 'quadratic_equation',
          problemLabel: 'Quadratic Equation',
          normalizedInput: `${lhsRaw} = ${rhsRaw}`,
          finalAnswer,
          alternateForms,
          steps,
          verification,
          plot: {
            series: [{ label: `f(${v}) = (${lhsRaw}) - (${rhsRaw})`, expr: diffExpr, color: '#6366f1' }],
            points,
            xRange: bounds.xRange,
            yRange: bounds.yRange,
            variable: v,
          },
        };
      }

      // Degree >= 3 polynomial -> numerical root finder
      const roots = findRealRootsNumerical(diffExpr, v, options, [-50, 50]);
      const center = roots.length > 0 ? (roots[0] + roots[roots.length - 1]) / 2 : 0;
      const span = roots.length > 1 ? Math.max(8, Math.abs(roots[roots.length - 1] - roots[0]) + 4) : 10;
      const bounds = buildPlotBounds([diffExpr], v, center, span, options);

      return {
        problemType: 'polynomial_equation',
        problemLabel: `Polynomial Equation (Degree ${degree})`,
        normalizedInput: `${lhsRaw} = ${rhsRaw}`,
        finalAnswer: roots.length > 0 ? roots.map((r, idx) => `${v}${roots.length > 1 ? `_${idx + 1}` : ''} = ${formatNum(r)}`).join(', ') : 'No real roots found in [-50, 50]',
        alternateForms: [],
        steps: [
          {
            title: `Move all terms to one side (Degree ${degree} polynomial)`,
            math: `f(${v}) = (${lhsRaw}) - (${rhsRaw}) = 0`,
            explanation: 'Rewrite the equation as finding the zeros of f(x).',
          },
          {
            title: 'Scan for sign changes and refine real roots',
            math: roots.length > 0 ? `Real roots: ${roots.map((r) => formatNum(r)).join(', ')}` : 'No sign changes found in [-50, 50]',
            explanation: 'Uses adaptive interval scanning and bisection to isolate each real zero to high precision.',
          },
        ],
        verification: roots.length > 0 ? `Verified f(${formatNum(roots[0])}) ≈ 0` : null,
        plot: {
          series: [{ label: `f(${v})`, expr: diffExpr, color: '#6366f1' }],
          points: roots.map((r) => ({ x: r, y: 0, label: `(${formatNum(r, 2)}, 0)` })),
          xRange: bounds.xRange,
          yRange: bounds.yRange,
          variable: v,
        },
      };
    }
  } catch {
    // Non-polynomial (exponential, trig, radical, rational) -> fall through to numerical solver
  }

  // General transcendental / non-polynomial single-variable equation
  try {
    const roots = findRealRootsNumerical(diffExpr, v, options, [-50, 50]);
    const center = roots.length > 0 ? (roots[0] + roots[roots.length - 1]) / 2 : 0;
    const bounds = buildPlotBounds([lhsProc, rhsProc], v, center, 10, options);

    return {
      problemType: 'transcendental_equation',
      problemLabel: 'Equation Solver',
      normalizedInput: `${lhsRaw} = ${rhsRaw}`,
      finalAnswer:
        roots.length > 0
          ? roots.map((r) => `${v} ≈ ${formatNum(r, 5)}`).join(', ')
          : 'No real solution found in [-50, 50]',
      alternateForms: [],
      steps: [
        {
          title: 'Define residual function',
          math: `g(${v}) = (${lhsRaw}) - (${rhsRaw})`,
          explanation: `Solutions occur where the LHS curve intersects the RHS curve (g(${v}) = 0).`,
        },
        {
          title: 'Numerical root isolation (Bisection)',
          math: roots.length > 0 ? roots.map((r) => `${v} ≈ ${formatNum(r, 6)}`).join(', ') : 'No roots in [-50, 50]',
          explanation: 'Locate sign-change brackets across the domain and converge to 1e-10 tolerance.',
        },
      ],
      verification:
        roots.length > 0
          ? `LHS(${formatNum(roots[0], 4)}) = ${formatNum(Number(math.evaluate(lhsProc, buildScope(options, { [v]: roots[0] }))), 4)}`
          : null,
      plot: {
        series: [
          { label: `LHS: ${lhsRaw}`, expr: lhsProc, color: '#6366f1' },
          { label: `RHS: ${rhsRaw}`, expr: rhsProc, color: '#ec4899' },
        ],
        points: roots.map((r) => {
          const y = Number(math.evaluate(lhsProc, buildScope(options, { [v]: r })));
          return { x: r, y: Number.isFinite(y) ? y : 0, label: `(${formatNum(r, 2)}, ${formatNum(y, 2)})` };
        }),
        xRange: bounds.xRange,
        yRange: bounds.yRange,
        variable: v,
      },
    };
  } catch (err: unknown) {
    return {
      problemType: 'error',
      problemLabel: 'Syntax Error',
      normalizedInput: `${lhsRaw} = ${rhsRaw}`,
      finalAnswer: 'Could not solve equation',
      alternateForms: [],
      steps: [],
      verification: null,
      plot: null,
      error: err instanceof Error ? err.message : 'Unable to parse equation.',
    };
  }
}

function buildArithmeticSteps(exprRaw: string, options?: SolveOptions): MathStep[] {
  const steps: MathStep[] = [];
  const processed = preprocessForMathJs(exprRaw);
  steps.push({
    title: 'Parse mathematical expression',
    math: exprRaw,
    explanation: 'Apply standard order of operations (Parentheses, Exponents/Roots, Multiplication/Division, Addition/Subtraction).',
  });

  try {
    const node = math.parse(processed);
    const scope = buildScope(options);
    // Collect sub-expression evaluations in post-order (excluding pure constants)
    const subSteps: string[] = [];
    const evaluateSubNodes = (n: MathNode) => {
      if (n.type === 'ParenthesisNode') {
        evaluateSubNodes((n as unknown as { content: MathNode }).content);
        return;
      }
      if (n.type === 'OperatorNode') {
        const opNode = n as unknown as { args: MathNode[]; op: string };
        opNode.args.forEach(evaluateSubNodes);
        const val = n.compile().evaluate(scope);
        if (typeof val === 'number' && Number.isFinite(val)) {
          const text = n.toString();
          if (text !== exprRaw && subSteps.length < 5) {
            subSteps.push(`${text} = ${formatNum(val)}`);
          }
        }
      } else if (n.type === 'FunctionNode') {
        const fnNode = n as unknown as { args: MathNode[] };
        fnNode.args.forEach(evaluateSubNodes);
        const val = n.compile().evaluate(scope);
        if (typeof val === 'number' && Number.isFinite(val) && subSteps.length < 5) {
          subSteps.push(`${n.toString()} = ${formatNum(val)}`);
        }
      }
    };
    evaluateSubNodes(node);

    if (subSteps.length > 0) {
      steps.push({
        title: 'Evaluate inner operations step by step',
        math: subSteps.join('  →  '),
        explanation: 'Reduce nested functions, powers, and sub-expressions from inside out.',
      });
    }
  } catch {
    // ignore AST breakdown error
  }

  return steps;
}

/**
 * Main entry point: solves arithmetic, equations, quadratics, 2x2 systems, calculus, or analyzes functions.
 */
export function solveMathProblem(rawInput: string, options?: SolveOptions): MathSolution {
  const normalized = normalizeMathOcr(rawInput);
  if (!normalized) {
    return {
      problemType: 'error',
      problemLabel: 'Empty Expression',
      normalizedInput: '',
      finalAnswer: 'Enter or scan a math problem',
      alternateForms: [],
      steps: [],
      verification: null,
      plot: null,
      error: 'Please enter a math expression, equation, or upload an image.',
    };
  }

  // 1. Explicit calculus commands
  const calcSol = solveCalculusCommand(normalized, options);
  if (calcSol) return calcSol;

  // 2. System of equations (split by ';' or ',')
  const systemParts = normalized
    .split(/[;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (systemParts.length === 2 && systemParts[0].includes('=') && systemParts[1].includes('=')) {
    const sysSol = solveSystem2x2(systemParts[0], systemParts[1], options);
    if (sysSol) return sysSol;
  }

  // 3. Single Equation (LHS = RHS)
  if (normalized.includes('=')) {
    const eqParts = normalized.split('=');
    if (eqParts.length === 2 && eqParts[0].trim() && eqParts[1].trim()) {
      return solveSingleEquation(eqParts[0].trim(), eqParts[1].trim(), options);
    }
    return {
      problemType: 'error',
      problemLabel: 'Incomplete Equation',
      normalizedInput: normalized,
      finalAnswer: 'Check equation format',
      alternateForms: [],
      steps: [],
      verification: null,
      plot: null,
      error: 'An equation needs valid expressions on both sides of the "=" sign.',
    };
  }

  // 4. Expression (either pure arithmetic or function of x)
  const vars = extractVariables(normalized);
  if (vars.length === 0) {
    try {
      const processed = preprocessForMathJs(normalized);
      const result = math.evaluate(processed, buildScope(options));

      if (typeof result === 'number') {
        if (!Number.isFinite(result)) {
          throw new Error('Division by zero or result out of range.');
        }
        const steps = buildArithmeticSteps(normalized, options);
        steps.push({
          title: 'Final Result',
          math: `${normalized} = ${formatNum(result, 8)}`,
          explanation: 'Evaluated exact numerical result.',
        });

        const alternateForms: MathAlternateForm[] = [];
        const frac = tryToFraction(result);
        if (frac) {
          alternateForms.push({ label: 'Exact Fraction', value: frac });
        }
        const primes = getPrimeFactorization(result);
        if (primes) {
          alternateForms.push({ label: 'Prime Factorization', value: primes });
        }
        if (Math.abs(result) >= 10000 || (Math.abs(result) > 0 && Math.abs(result) < 0.001)) {
          alternateForms.push({ label: 'Scientific Notation', value: result.toExponential(4) });
        }
        if (result >= 0 && result <= 10) {
          alternateForms.push({ label: 'As Percentage', value: `${formatNum(result * 100, 4)}%` });
        }

        return {
          problemType: 'arithmetic',
          problemLabel: 'Arithmetic & Scientific Evaluation',
          normalizedInput: normalized,
          finalAnswer: formatNum(result, 8),
          alternateForms,
          steps,
          verification: null,
          plot: null,
        };
      }

      // Complex or matrix result
      const formatted = math.format(result, { precision: 6 });
      return {
        problemType: 'arithmetic',
        problemLabel: 'Expression Evaluation',
        normalizedInput: normalized,
        finalAnswer: formatted,
        alternateForms: [],
        steps: [
          {
            title: 'Evaluate expression',
            math: `${normalized} = ${formatted}`,
            explanation: 'Computed symbolic/numeric value.',
          },
        ],
        verification: null,
        plot: null,
      };
    } catch (err: unknown) {
      return {
        problemType: 'error',
        problemLabel: 'Syntax Error',
        normalizedInput: normalized,
        finalAnswer: 'Could not evaluate expression',
        alternateForms: [],
        steps: [],
        verification: null,
        plot: null,
        error: err instanceof Error ? err.message : 'Invalid mathematical expression.',
      };
    }
  }

  // 5. Expression with variable -> simplify, differentiate, find roots, and plot
  if (vars.length === 1) {
    const v = vars[0];
    const processed = preprocessForMathJs(normalized);
    try {
      const simplified = math.simplify(processed).toString();
      let derivStr = '';
      try {
        derivStr = math.simplify(math.derivative(processed, v)).toString();
      } catch {
        // some functions may not differentiate cleanly
      }
      const roots = findRealRootsNumerical(processed, v, options, [-30, 30]);
      const yInt = Number(math.evaluate(processed, buildScope(options, { [v]: 0 })));
      const bounds = buildPlotBounds([processed], v, 0, 10, options);

      const steps: MathStep[] = [
        {
          title: 'Simplified algebraic form',
          math: `f(${v}) = ${simplified}`,
          explanation: 'Combine like terms and simplify constants.',
        },
      ];
      if (derivStr) {
        steps.push({
          title: `First derivative f'(${v})`,
          math: `f'(${v}) = ${derivStr}`,
          explanation: `Rate of change of f(${v}) with respect to ${v}.`,
        });
      }
      if (Number.isFinite(yInt)) {
        steps.push({
          title: 'Vertical intercept (when variable = 0)',
          math: `f(0) = ${formatNum(yInt)}`,
          explanation: 'Evaluate the expression at 0.',
        });
      }
      if (roots.length > 0) {
        steps.push({
          title: 'Real zeros / Roots (f = 0)',
          math: roots.map((r) => `${v} = ${formatNum(r)}`).join(', '),
          explanation: 'Points where the curve crosses the horizontal axis.',
        });
      }

      const alternateForms: MathAlternateForm[] = [];
      if (derivStr) alternateForms.push({ label: `Derivative f'(${v})`, value: derivStr });
      if (roots.length > 0) alternateForms.push({ label: 'Real Roots', value: roots.map((r) => formatNum(r)).join(', ') });
      if (Number.isFinite(yInt)) alternateForms.push({ label: 'f(0)', value: formatNum(yInt) });

      return {
        problemType: 'expression_function',
        problemLabel: 'Function & Expression Analysis',
        normalizedInput: normalized,
        finalAnswer: simplified,
        alternateForms,
        steps,
        verification: null,
        plot: {
          series: [
            { label: `f(${v}) = ${simplified}`, expr: processed, color: '#6366f1' },
            ...(derivStr ? [{ label: `f'(${v}) = ${derivStr}`, expr: derivStr, color: '#10b981' }] : []),
          ],
          points: roots.map((r) => ({ x: r, y: 0, label: `(${formatNum(r, 2)}, 0)` })),
          xRange: bounds.xRange,
          yRange: bounds.yRange,
          variable: v,
        },
      };
    } catch (err: unknown) {
      return {
        problemType: 'error',
        problemLabel: 'Expression Error',
        normalizedInput: normalized,
        finalAnswer: 'Could not analyze expression',
        alternateForms: [],
        steps: [],
        verification: null,
        plot: null,
        error: err instanceof Error ? err.message : 'Invalid function expression.',
      };
    }
  }

  return {
    problemType: 'error',
    problemLabel: 'Multiple Variables',
    normalizedInput: normalized,
    finalAnswer: `Contains variables: ${vars.join(', ')}`,
    alternateForms: [],
    steps: [],
    verification: null,
    plot: null,
    error: 'Use a single variable (like x) or enter a 2-equation system separated by ";".',
  };
}
