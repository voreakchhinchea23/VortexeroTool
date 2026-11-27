// Pure TypeScript utility engines for everyday VortexeroTool modules

// =========================================================
// 1. Document Scanner: 4-Point Perspective Homography & Filters
// =========================================================
export interface Point2D {
  x: number;
  y: number;
}

export type DocScanFilter = 'original' | 'magic' | 'bw' | 'grayscale' | 'whiteboard';

/**
 * Solves an 8x8 linear system Ax = b via Gaussian elimination with partial pivoting.
 */
function solveLinear8(A: number[][], b: number[]): number[] | null {
  const n = 8;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > maxVal) {
        maxVal = Math.abs(M[r][col]);
        maxRow = r;
      }
    }
    if (maxVal < 1e-10) return null;
    if (maxRow !== col) {
      [M[col], M[maxRow]] = [M[maxRow], M[col]];
    }

    const pivot = M[col][col];
    for (let j = col; j <= n; j++) {
      M[col][j] /= pivot;
    }

    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r][col];
      for (let j = col; j <= n; j++) {
        M[r][j] -= factor * M[col][j];
      }
    }
  }

  return M.map((row) => row[n]);
}

/**
 * Computes the 3x3 homography matrix mapping dst points -> src points (for inverse warping).
 * Points order: [TopLeft, TopRight, BottomRight, BottomLeft].
 */
export function computeInverseHomography(srcPts: [Point2D, Point2D, Point2D, Point2D], dstW: number, dstH: number): number[] | null {
  const dstPts: [Point2D, Point2D, Point2D, Point2D] = [
    { x: 0, y: 0 },
    { x: dstW, y: 0 },
    { x: dstW, y: dstH },
    { x: 0, y: dstH },
  ];

  // Map (u, v) in dst -> (x, y) in src:
  // x = (h0*u + h1*v + h2) / (h6*u + h7*v + 1)
  // y = (h3*u + h4*v + h5) / (h6*u + h7*v + 1)
  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i++) {
    const u = dstPts[i].x;
    const v = dstPts[i].y;
    const x = srcPts[i].x;
    const y = srcPts[i].y;

    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x]);
    b.push(x);

    A.push([0, 0, 0, u, v, 1, -u * y, -v * y]);
    b.push(y);
  }

  const h = solveLinear8(A, b);
  if (!h) return null;
  return [...h, 1];
}

export function estimateOutputDimensions(corners: [Point2D, Point2D, Point2D, Point2D], maxEdge = 1600): { width: number; height: number } {
  const [tl, tr, br, bl] = corners;
  const dist = (p1: Point2D, p2: Point2D) => Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const wTop = dist(tl, tr);
  const wBot = dist(bl, br);
  const hLeft = dist(tl, bl);
  const hRight = dist(tr, br);

  let width = Math.max(100, Math.round((wTop + wBot) / 2));
  let height = Math.max(100, Math.round((hLeft + hRight) / 2));

  const scale = Math.min(1, maxEdge / Math.max(width, height));
  width = Math.max(64, Math.round(width * scale));
  height = Math.max(64, Math.round(height * scale));
  return { width, height };
}

/**
 * Applies bilinear perspective warp + document enhancement filter to RGBA ImageData buffers.
 */
export function warpAndFilterDocumentPixels(
  srcData: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  corners: [Point2D, Point2D, Point2D, Point2D],
  dstW: number,
  dstH: number,
  filter: DocScanFilter,
  brightnessAdjust = 0,
  contrastAdjust = 1.0
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(dstW * dstH * 4);
  const H = computeInverseHomography(corners, dstW, dstH);

  // Fallback identity scaling if degenerate quad
  const h0 = H ? H[0] : srcW / dstW;
  const h1 = H ? H[1] : 0;
  const h2 = H ? H[2] : 0;
  const h3 = H ? H[3] : 0;
  const h4 = H ? H[4] : srcH / dstH;
  const h5 = H ? H[5] : 0;
  const h6 = H ? H[6] : 0;
  const h7 = H ? H[7] : 0;
  const h8 = H ? H[8] : 1;

  const grayBuffer = filter === 'bw' || filter === 'whiteboard' ? new Float32Array(dstW * dstH) : null;

  for (let v = 0; v < dstH; v++) {
    for (let u = 0; u < dstW; u++) {
      const denom = h6 * u + h7 * v + h8;
      const sx = (h0 * u + h1 * v + h2) / denom;
      const sy = (h3 * u + h4 * v + h5) / denom;

      const idx = (v * dstW + u) * 4;
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const x1 = Math.min(srcW - 1, Math.max(0, x0 + 1));
      const y1 = Math.min(srcH - 1, Math.max(0, y0 + 1));
      const cx0 = Math.min(srcW - 1, Math.max(0, x0));
      const cy0 = Math.min(srcH - 1, Math.max(0, y0));
      const fx = Math.max(0, Math.min(1, sx - x0));
      const fy = Math.max(0, Math.min(1, sy - y0));

      const i00 = (cy0 * srcW + cx0) * 4;
      const i10 = (cy0 * srcW + x1) * 4;
      const i01 = (y1 * srcW + cx0) * 4;
      const i11 = (y1 * srcW + x1) * 4;

      const w00 = (1 - fx) * (1 - fy);
      const w10 = fx * (1 - fy);
      const w01 = (1 - fx) * fy;
      const w11 = fx * fy;

      let r = srcData[i00] * w00 + srcData[i10] * w10 + srcData[i01] * w01 + srcData[i11] * w11;
      let g = srcData[i00 + 1] * w00 + srcData[i10 + 1] * w10 + srcData[i01 + 1] * w01 + srcData[i11 + 1] * w11;
      let b = srcData[i00 + 2] * w00 + srcData[i10 + 2] * w10 + srcData[i01 + 2] * w01 + srcData[i11 + 2] * w11;

      if (brightnessAdjust !== 0 || contrastAdjust !== 1) {
        r = (r - 128) * contrastAdjust + 128 + brightnessAdjust;
        g = (g - 128) * contrastAdjust + 128 + brightnessAdjust;
        b = (b - 128) * contrastAdjust + 128 + brightnessAdjust;
      }

      if (filter === 'grayscale') {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const boosted = (lum - 128) * 1.2 + 135;
        r = g = b = boosted;
      } else if (filter === 'magic') {
        // High-clarity color scan boost (pushes paper background toward pure white while keeping ink vivid)
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum > 165) {
          const factor = Math.min(1, (lum - 165) / 60);
          r = r + (255 - r) * factor * 0.85;
          g = g + (255 - g) * factor * 0.85;
          b = b + (255 - b) * factor * 0.85;
        } else {
          r = (r - 128) * 1.25 + 122;
          g = (g - 128) * 1.25 + 122;
          b = (b - 128) * 1.25 + 122;
        }
      }

      out[idx] = Math.max(0, Math.min(255, r));
      out[idx + 1] = Math.max(0, Math.min(255, g));
      out[idx + 2] = Math.max(0, Math.min(255, b));
      out[idx + 3] = 255;

      if (grayBuffer) {
        grayBuffer[v * dstW + u] = 0.299 * out[idx] + 0.587 * out[idx + 1] + 0.114 * out[idx + 2];
      }
    }
  }

  // Adaptive local thresholding using integral image for crisp B&W or Whiteboard clean scan
  if ((filter === 'bw' || filter === 'whiteboard') && grayBuffer) {
    const integral = new Float64Array((dstW + 1) * (dstH + 1));
    const stride = dstW + 1;
    for (let y = 0; y < dstH; y++) {
      let rowSum = 0;
      for (let x = 0; x < dstW; x++) {
        rowSum += grayBuffer[y * dstW + x];
        integral[(y + 1) * stride + (x + 1)] = integral[y * stride + (x + 1)] + rowSum;
      }
    }

    const radius = Math.max(12, Math.round(Math.min(dstW, dstH) / 28));
    const thresholdOffset = filter === 'bw' ? 12 : 9;

    for (let y = 0; y < dstH; y++) {
      const y1 = Math.max(0, y - radius);
      const y2 = Math.min(dstH - 1, y + radius);
      for (let x = 0; x < dstW; x++) {
        const x1 = Math.max(0, x - radius);
        const x2 = Math.min(dstW - 1, x + radius);
        const count = (x2 - x1 + 1) * (y2 - y1 + 1);
        const sum =
          integral[(y2 + 1) * stride + (x2 + 1)] -
          integral[y1 * stride + (x2 + 1)] -
          integral[(y2 + 1) * stride + x1] +
          integral[y1 * stride + x1];
        const localMean = sum / count;
        const val = grayBuffer[y * dstW + x];
        const idx = (y * dstW + x) * 4;

        if (filter === 'bw') {
          const bw = val < localMean - thresholdOffset ? 18 : 255;
          out[idx] = bw;
          out[idx + 1] = bw;
          out[idx + 2] = bw;
        } else {
          // Whiteboard: clean bright paper background while keeping marker ink colors
          if (val >= localMean - thresholdOffset) {
            out[idx] = 255;
            out[idx + 1] = 255;
            out[idx + 2] = 255;
          } else {
            out[idx] = Math.max(0, Math.min(255, out[idx] * 0.88));
            out[idx + 1] = Math.max(0, Math.min(255, out[idx + 1] * 0.88));
            out[idx + 2] = Math.max(0, Math.min(255, out[idx + 2] * 0.88));
          }
        }
      }
    }
  }

  return out;
}

// =========================================================
// 2. QR & Barcode Payload Parser
// =========================================================
export type ParsedQrType = 'url' | 'wifi' | 'vcard' | 'email' | 'sms' | 'geo' | 'phone' | 'text';

export interface ParsedQrPayload {
  type: ParsedQrType;
  label: string;
  raw: string;
  fields: { label: string; value: string; sensitive?: boolean }[];
  actionUrl?: string;
}

export function parseQrPayload(raw: string): ParsedQrPayload {
  const trimmed = raw.trim();

  // Wi-Fi QR: WIFI:S:MySSID;T:WPA;P:MyPassword;H:false;;
  if (/^WIFI:/i.test(trimmed)) {
    const extractWifiField = (tag: string) => {
      const match = trimmed.match(new RegExp(`${tag}:((?:\\\\;|[^;])*)`, 'i'));
      return match ? match[1].replace(/\\([;:,\\])/g, '$1') : '';
    };
    const ssid = extractWifiField('S');
    const security = extractWifiField('T') || 'Open';
    const password = extractWifiField('P');
    const hidden = extractWifiField('H');
    return {
      type: 'wifi',
      label: 'Wi-Fi Network',
      raw: trimmed,
      fields: [
        { label: 'Network (SSID)', value: ssid || 'Unknown' },
        { label: 'Security', value: security.toUpperCase() },
        ...(password ? [{ label: 'Password', value: password, sensitive: true }] : []),
        ...(hidden ? [{ label: 'Hidden SSID', value: hidden === 'true' ? 'Yes' : 'No' }] : []),
      ],
    };
  }

  // vCard
  if (/^BEGIN:VCARD/i.test(trimmed)) {
    const getLine = (prefix: string) => {
      const m = trimmed.match(new RegExp(`^${prefix}[^:]*:(.*)$`, 'im'));
      return m ? m[1].trim() : '';
    };
    const fn = getLine('FN') || getLine('N').replace(/;/g, ' ').trim();
    const org = getLine('ORG');
    const tel = getLine('TEL');
    const email = getLine('EMAIL');
    const url = getLine('URL');
    return {
      type: 'vcard',
      label: 'Contact Card (vCard)',
      raw: trimmed,
      fields: [
        ...(fn ? [{ label: 'Full Name', value: fn }] : []),
        ...(org ? [{ label: 'Organization', value: org }] : []),
        ...(tel ? [{ label: 'Phone', value: tel }] : []),
        ...(email ? [{ label: 'Email', value: email }] : []),
        ...(url ? [{ label: 'Website', value: url }] : []),
      ],
    };
  }

  // URL
  if (/^https?:\/\/\S+/i.test(trimmed)) {
    let host = trimmed;
    try {
      host = new URL(trimmed).hostname;
    } catch {
      // ignore
    }
    return {
      type: 'url',
      label: 'Website URL',
      raw: trimmed,
      fields: [
        { label: 'Domain', value: host },
        { label: 'Full Link', value: trimmed },
      ],
      actionUrl: trimmed,
    };
  }

  // Email (mailto: or MATMSG:)
  if (/^mailto:/i.test(trimmed)) {
    const clean = trimmed.replace(/^mailto:/i, '');
    const [addr, query = ''] = clean.split('?');
    const params = new URLSearchParams(query);
    return {
      type: 'email',
      label: 'Email Address',
      raw: trimmed,
      fields: [
        { label: 'To', value: addr },
        ...(params.get('subject') ? [{ label: 'Subject', value: params.get('subject')! }] : []),
        ...(params.get('body') ? [{ label: 'Body', value: params.get('body')! }] : []),
      ],
      actionUrl: trimmed,
    };
  }

  // SMS (SMSTO:phone:message or sms:phone)
  if (/^(?:SMSTO|SMS):/i.test(trimmed)) {
    const clean = trimmed.replace(/^(?:SMSTO|SMS):/i, '');
    const [phone, ...msgParts] = clean.split(':');
    return {
      type: 'sms',
      label: 'SMS Message',
      raw: trimmed,
      fields: [
        { label: 'Phone', value: phone },
        ...(msgParts.length > 0 ? [{ label: 'Message', value: msgParts.join(':') }] : []),
      ],
    };
  }

  // Phone (tel:)
  if (/^tel:/i.test(trimmed)) {
    const phone = trimmed.replace(/^tel:/i, '');
    return {
      type: 'phone',
      label: 'Phone Number',
      raw: trimmed,
      fields: [{ label: 'Number', value: phone }],
      actionUrl: trimmed,
    };
  }

  // Geo coordinates (geo:lat,lng)
  if (/^geo:/i.test(trimmed)) {
    const coords = trimmed.replace(/^geo:/i, '').split('?')[0];
    const [lat, lng] = coords.split(',');
    return {
      type: 'geo',
      label: 'Geographic Location',
      raw: trimmed,
      fields: [
        { label: 'Latitude', value: lat || '' },
        { label: 'Longitude', value: lng || '' },
      ],
      actionUrl: lat && lng ? `https://maps.google.com/?q=${encodeURIComponent(`${lat},${lng}`)}` : undefined,
    };
  }

  return {
    type: 'text',
    label: 'Plain Text / Code',
    raw: trimmed,
    fields: [{ label: 'Decoded Content', value: trimmed }],
  };
}

// =========================================================
// 3. GPA, Course Grade & Final Exam Target Calculator
// =========================================================
export interface GpaCourseItem {
  id: string;
  name: string;
  credits: number;
  gradePoints: number; // on selected scale (or 0-100 converted)
}

export const GRADE_SCALE_4_0: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

export const GRADE_SCALE_4_3: Record<string, number> = {
  'A+': 4.3,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

export function percentToGpa4(pct: number): { letter: string; gpa: number } {
  if (pct >= 97) return { letter: 'A+', gpa: 4.0 };
  if (pct >= 93) return { letter: 'A', gpa: 4.0 };
  if (pct >= 90) return { letter: 'A-', gpa: 3.7 };
  if (pct >= 87) return { letter: 'B+', gpa: 3.3 };
  if (pct >= 83) return { letter: 'B', gpa: 3.0 };
  if (pct >= 80) return { letter: 'B-', gpa: 2.7 };
  if (pct >= 77) return { letter: 'C+', gpa: 2.3 };
  if (pct >= 73) return { letter: 'C', gpa: 2.0 };
  if (pct >= 70) return { letter: 'C-', gpa: 1.7 };
  if (pct >= 67) return { letter: 'D+', gpa: 1.3 };
  if (pct >= 63) return { letter: 'D', gpa: 1.0 };
  if (pct >= 60) return { letter: 'D-', gpa: 0.7 };
  return { letter: 'F', gpa: 0.0 };
}

export function calculateGpaSummary(
  courses: GpaCourseItem[],
  priorGpa = 0,
  priorCredits = 0
): {
  semesterGpa: number;
  semesterCredits: number;
  totalQualityPoints: number;
  cumulativeGpa: number;
  totalCredits: number;
} {
  let semesterCredits = 0;
  let totalQualityPoints = 0;

  for (const c of courses) {
    const cr = Math.max(0, c.credits);
    semesterCredits += cr;
    totalQualityPoints += cr * Math.max(0, c.gradePoints);
  }

  const semesterGpa = semesterCredits > 0 ? totalQualityPoints / semesterCredits : 0;
  const safePriorCredits = Math.max(0, priorCredits);
  const safePriorGpa = Math.max(0, priorGpa);
  const totalCredits = semesterCredits + safePriorCredits;
  const cumulativeGpa =
    totalCredits > 0 ? (totalQualityPoints + safePriorCredits * safePriorGpa) / totalCredits : 0;

  return {
    semesterGpa: Number(semesterGpa.toFixed(3)),
    semesterCredits,
    totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
    cumulativeGpa: Number(cumulativeGpa.toFixed(3)),
    totalCredits,
  };
}

export function calculateFinalExamNeeded(
  currentGradePct: number,
  desiredCourseGradePct: number,
  finalExamWeightPct: number
): {
  requiredScore: number;
  status: 'guaranteed' | 'achievable' | 'challenging' | 'extra_credit';
  maxPossibleGrade: number;
  minPossibleGrade: number;
} {
  const w = Math.max(0.01, Math.min(99.99, finalExamWeightPct)) / 100;
  const currentWeight = 1 - w;
  const required = (desiredCourseGradePct - currentGradePct * currentWeight) / w;
  const maxPossible = currentGradePct * currentWeight + 100 * w;
  const minPossible = currentGradePct * currentWeight;

  let status: 'guaranteed' | 'achievable' | 'challenging' | 'extra_credit' = 'achievable';
  if (required <= 0) status = 'guaranteed';
  else if (required > 100) status = 'extra_credit';
  else if (required >= 85) status = 'challenging';

  return {
    requiredScore: Number(required.toFixed(2)),
    status,
    maxPossibleGrade: Number(maxPossible.toFixed(2)),
    minPossibleGrade: Number(minPossible.toFixed(2)),
  };
}

// =========================================================
// 4. Age, Birthday, Zodiac & Date Duration Calculator
// =========================================================
export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  bornWeekday: string;
  westernZodiac: string;
  animalZodiac: string;
  generation: string;
  daysUntilNextBirthday: number;
  nextBirthdayWeekday: string;
  tenThousandDaysDate: string;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CHINESE_ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

export function getWesternZodiac(month1to12: number, day: number): string {
  if ((month1to12 === 1 && day >= 20) || (month1to12 === 2 && day <= 18)) return 'Aquarius';
  if ((month1to12 === 2 && day >= 19) || (month1to12 === 3 && day <= 20)) return 'Pisces';
  if ((month1to12 === 3 && day >= 21) || (month1to12 === 4 && day <= 19)) return 'Aries';
  if ((month1to12 === 4 && day >= 20) || (month1to12 === 5 && day <= 20)) return 'Taurus';
  if ((month1to12 === 5 && day >= 21) || (month1to12 === 6 && day <= 20)) return 'Gemini';
  if ((month1to12 === 6 && day >= 21) || (month1to12 === 7 && day <= 22)) return 'Cancer';
  if ((month1to12 === 7 && day >= 23) || (month1to12 === 8 && day <= 22)) return 'Leo';
  if ((month1to12 === 8 && day >= 23) || (month1to12 === 9 && day <= 22)) return 'Virgo';
  if ((month1to12 === 9 && day >= 23) || (month1to12 === 10 && day <= 22)) return 'Libra';
  if ((month1to12 === 10 && day >= 23) || (month1to12 === 11 && day <= 21)) return 'Scorpio';
  if ((month1to12 === 11 && day >= 22) || (month1to12 === 12 && day <= 21)) return 'Sagittarius';
  return 'Capricorn';
}

export function getGenerationLabel(year: number): string {
  if (year >= 2025) return 'Gen Beta';
  if (year >= 2013) return 'Gen Alpha';
  if (year >= 1997) return 'Gen Z';
  if (year >= 1981) return 'Millennial';
  if (year >= 1965) return 'Gen X';
  if (year >= 1946) return 'Baby Boomer';
  return 'Silent Generation';
}

export function calculateAgeBreakdown(birthIso: string, referenceNow: Date = new Date()): AgeBreakdown | null {
  const parts = birthIso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [by, bm, bd] = parts;
  const birth = new Date(by, bm - 1, bd, 0, 0, 0, 0);
  if (isNaN(birth.getTime())) return null;

  const refDay = new Date(referenceNow.getFullYear(), referenceNow.getMonth(), referenceNow.getDate());
  if (birth > refDay) return null;

  let years = refDay.getFullYear() - birth.getFullYear();
  let months = refDay.getMonth() - birth.getMonth();
  let days = refDay.getDate() - birth.getDate();

  if (days < 0) {
    const prevMonthLastDay = new Date(refDay.getFullYear(), refDay.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const diffMs = Math.max(0, referenceNow.getTime() - birth.getTime());
  const totalDays = Math.floor((refDay.getTime() - birth.getTime()) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(diffMs / 3600000);
  const totalMinutes = Math.floor(diffMs / 60000);
  const totalSeconds = Math.floor(diffMs / 1000);

  let nextBday = new Date(refDay.getFullYear(), bm - 1, bd);
  if (nextBday < refDay) {
    nextBday = new Date(refDay.getFullYear() + 1, bm - 1, bd);
  }
  const daysUntilNextBirthday = Math.round((nextBday.getTime() - refDay.getTime()) / 86400000);

  const tenKDate = new Date(birth.getTime() + 10000 * 86400000);
  const tenThousandDaysDate = `${tenKDate.getFullYear()}-${String(tenKDate.getMonth() + 1).padStart(2, '0')}-${String(tenKDate.getDate()).padStart(2, '0')}`;

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    bornWeekday: WEEKDAYS[birth.getDay()],
    westernZodiac: getWesternZodiac(bm, bd),
    animalZodiac: CHINESE_ANIMALS[((by - 1900) % 12 + 12) % 12],
    generation: getGenerationLabel(by),
    daysUntilNextBirthday,
    nextBirthdayWeekday: WEEKDAYS[nextBday.getDay()],
    tenThousandDaysDate,
  };
}

export function calculateDateDuration(startIso: string, endIso: string): {
  totalDays: number;
  businessDays: number;
  weekendDays: number;
  years: number;
  months: number;
  days: number;
} | null {
  const sParts = startIso.split('-').map(Number);
  const eParts = endIso.split('-').map(Number);
  if (sParts.length !== 3 || eParts.length !== 3 || sParts.some(isNaN) || eParts.some(isNaN)) return null;

  let start = new Date(sParts[0], sParts[1] - 1, sParts[2]);
  let end = new Date(eParts[0], eParts[1] - 1, eParts[2]);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (start > end) [start, end] = [end, start];

  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000);

  let businessDays = 0;
  let weekendDays = 0;
  const cursor = new Date(start);
  while (cursor < end) {
    const dow = cursor.getDay();
    if (dow === 0 || dow === 6) weekendDays++;
    else businessDays++;
    cursor.setDate(cursor.getDate() + 1);
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { totalDays, businessDays, weekendDays, years, months, days };
}

export function addDateOffset(
  baseIso: string,
  operation: 'add' | 'subtract',
  amount: number,
  unit: 'days' | 'weeks' | 'months' | 'years'
): { iso: string; weekday: string } | null {
  const parts = baseIso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  if (isNaN(d.getTime())) return null;

  const sign = operation === 'add' ? 1 : -1;
  const delta = sign * Math.round(amount);

  if (unit === 'days') d.setDate(d.getDate() + delta);
  else if (unit === 'weeks') d.setDate(d.getDate() + delta * 7);
  else if (unit === 'months') d.setMonth(d.getMonth() + delta);
  else if (unit === 'years') d.setFullYear(d.getFullYear() + delta);

  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { iso, weekday: WEEKDAYS[d.getDay()] };
}

// =========================================================
// 5. Smart Shopping Discount, Tax & Unit Price Comparator
// =========================================================
export interface DiscountResult {
  subtotal: number;
  afterPrimaryDiscount: number;
  afterExtraCoupon: number;
  totalDiscountSaved: number;
  effectiveDiscountPct: number;
  taxAmount: number;
  finalTotal: number;
}

export function calculateDiscountSummary(
  unitPrice: number,
  quantity: number,
  primaryDiscountPct: number,
  extraCouponPct: number,
  taxPct: number
): DiscountResult {
  const subtotal = Math.max(0, unitPrice) * Math.max(1, quantity);
  const d1 = Math.max(0, Math.min(100, primaryDiscountPct)) / 100;
  const d2 = Math.max(0, Math.min(100, extraCouponPct)) / 100;
  const tax = Math.max(0, taxPct) / 100;

  const afterPrimaryDiscount = subtotal * (1 - d1);
  const afterExtraCoupon = afterPrimaryDiscount * (1 - d2);
  const totalDiscountSaved = subtotal - afterExtraCoupon;
  const effectiveDiscountPct = subtotal > 0 ? (totalDiscountSaved / subtotal) * 100 : 0;
  const taxAmount = afterExtraCoupon * tax;
  const finalTotal = afterExtraCoupon + taxAmount;

  return {
    subtotal,
    afterPrimaryDiscount,
    afterExtraCoupon,
    totalDiscountSaved,
    effectiveDiscountPct,
    taxAmount,
    finalTotal,
  };
}

export interface ProductPackOption {
  id: string;
  label: string;
  price: number;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'oz' | 'lb' | 'pcs';
}

export interface EvaluatedPackOption extends ProductPackOption {
  baseUnits: number;
  pricePerStandardUnit: number; // per 100g / 100ml / 1 piece
  standardUnitLabel: string;
  isBestValue: boolean;
  savingsVsWorstPct: number;
}

const TO_BASE_UNIT_FACTOR: Record<ProductPackOption['unit'], { group: 'mass' | 'vol' | 'count'; factor: number; label: string }> = {
  g: { group: 'mass', factor: 1, label: '100g' },
  kg: { group: 'mass', factor: 1000, label: '100g' },
  oz: { group: 'mass', factor: 28.3495, label: '100g' },
  lb: { group: 'mass', factor: 453.592, label: '100g' },
  ml: { group: 'vol', factor: 1, label: '100ml' },
  l: { group: 'vol', factor: 1000, label: '100ml' },
  pcs: { group: 'count', factor: 1, label: '1 pc' },
};

export function compareUnitPrices(options: ProductPackOption[]): EvaluatedPackOption[] {
  const evaluated = options.map((opt) => {
    const meta = TO_BASE_UNIT_FACTOR[opt.unit];
    const baseUnits = Math.max(0.0001, opt.quantity * meta.factor);
    const scale = meta.group === 'count' ? 1 : 100;
    const pricePerStandardUnit = (Math.max(0, opt.price) / baseUnits) * scale;
    return {
      ...opt,
      baseUnits,
      pricePerStandardUnit,
      standardUnitLabel: meta.label,
      isBestValue: false,
      savingsVsWorstPct: 0,
    };
  });

  if (evaluated.length === 0) return [];
  const minPrice = Math.min(...evaluated.map((e) => e.pricePerStandardUnit));
  const maxPrice = Math.max(...evaluated.map((e) => e.pricePerStandardUnit));

  return evaluated.map((e) => ({
    ...e,
    isBestValue: Math.abs(e.pricePerStandardUnit - minPrice) < 1e-9,
    savingsVsWorstPct: maxPrice > 0 ? Math.max(0, ((maxPrice - e.pricePerStandardUnit) / maxPrice) * 100) : 0,
  }));
}
