// Pure TypeScript 2D Mathematical Layout Analyzer & Region Segmenter for Math OCR

export interface InkComponent {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  area: number;
  cx: number;
  cy: number;
}

export interface GlyphGroup {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  comps: InkComponent[];
}

export interface BinaryMathImage {
  width: number;
  height: number;
  /** 0..255 grayscale where ink is dark (near 0) and background is bright (near 255) */
  gray: Uint8Array;
  /** 1 = ink foreground, 0 = background */
  mask: Uint8Array;
  threshold: number;
  wasInverted: boolean;
}

export type PolarityMode = 'auto' | 'normal' | 'invert';

/**
 * Computes a balanced ink/background threshold that avoids Otsu's sparse-text drift
 * toward the majority background class (which causes anti-aliased glyph halos to bleed).
 */
export function computeBalancedInkThreshold(gray: Uint8Array, bgMedianHint?: number): number {
  const hist = new Int32Array(256);
  for (let i = 0; i < gray.length; i++) {
    hist[gray[i]]++;
  }

  const total = gray.length;
  // Find dark ink core (1.5th percentile) and bright background core (85th percentile or border hint)
  let cum = 0;
  let inkCore = 20;
  let bgP85 = 230;
  let foundInk = false;
  let foundBg = false;

  for (let v = 0; v < 256; v++) {
    cum += hist[v];
    if (!foundInk && cum >= total * 0.015) {
      inkCore = v;
      foundInk = true;
    }
    if (!foundBg && cum >= total * 0.85) {
      bgP85 = v;
      foundBg = true;
    }
  }

  const bgCore = bgMedianHint !== undefined ? Math.max(bgMedianHint, bgP85) : bgP85;
  if (bgCore - inkCore < 25) {
    return 128;
  }

  // Slightly closer to ink (0.45) to keep glyph edges crisp and prevent adjacent glyphs from merging
  const balanced = Math.round(inkCore + (bgCore - inkCore) * 0.45);
  return Math.max(40, Math.min(205, balanced));
}

/**
 * Converts RGBA pixels into a dark-ink-on-light-background grayscale & binary mask,
 * automatically detecting dark-mode screenshots when polarity === 'auto'.
 */
export function prepareBinaryMathImage(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  polarity: PolarityMode = 'auto'
): BinaryMathImage {
  const n = width * height;
  const rawLum = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    const idx = i * 4;
    rawLum[i] = Math.round(0.299 * rgba[idx] + 0.587 * rgba[idx + 1] + 0.114 * rgba[idx + 2]);
  }

  // Sample outer 3-pixel border ring to infer background brightness
  const borderSamples: number[] = [];
  const ring = Math.min(3, Math.floor(Math.min(width, height) / 4));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < ring || x >= width - ring || y < ring || y >= height - ring) {
        borderSamples.push(rawLum[y * width + x]);
      }
    }
  }
  borderSamples.sort((a, b) => a - b);
  const rawBorderMedian = borderSamples.length > 0 ? borderSamples[Math.floor(borderSamples.length / 2)] : 255;

  const shouldInvert = polarity === 'invert' ? true : polarity === 'normal' ? false : rawBorderMedian < 120;

  const gray = new Uint8Array(n);
  if (shouldInvert) {
    for (let i = 0; i < n; i++) gray[i] = 255 - rawLum[i];
  } else {
    gray.set(rawLum);
  }

  const normalizedBorderBg = shouldInvert ? 255 - rawBorderMedian : rawBorderMedian;
  const threshold = computeBalancedInkThreshold(gray, normalizedBorderBg);
  const mask = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    mask[i] = gray[i] < threshold ? 1 : 0;
  }

  return { width, height, gray, mask, threshold, wasInverted: shouldInvert };
}

/**
 * Extracts 8-connected foreground ink components.
 */
export function extractInkComponents(mask: Uint8Array, width: number, height: number): InkComponent[] {
  const visited = new Uint8Array(width * height);
  const comps: InkComponent[] = [];
  const queue = new Int32Array(width * height);
  let nextId = 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x;
      if (mask[start] === 0 || visited[start] === 1) continue;

      let head = 0;
      let tail = 0;
      queue[tail++] = start;
      visited[start] = 1;

      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
      let area = 0;

      while (head < tail) {
        const idx = queue[head++];
        const cx = idx % width;
        const cy = (idx - cx) / width;
        area++;

        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        for (let dy = -1; dy <= 1; dy++) {
          const ny = cy + dy;
          if (ny < 0 || ny >= height) continue;
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = cx + dx;
            if (nx < 0 || nx >= width) continue;
            const nIdx = ny * width + nx;
            if (mask[nIdx] === 1 && visited[nIdx] === 0) {
              visited[nIdx] = 1;
              queue[tail++] = nIdx;
            }
          }
        }
      }

      const w = maxX - minX + 1;
      const h = maxY - minY + 1;
      if (area >= 4 || (w >= 2 && h >= 2)) {
        const comp: InkComponent = {
          id: nextId++,
          x: minX,
          y: minY,
          w,
          h,
          area,
          cx: minX + w / 2,
          cy: minY + h / 2,
        };
        const split = trySplitTouchingSuperscript(comp, mask, width);
        if (split) {
          for (const sub of split) {
            comps.push({ ...sub, id: nextId++ });
          }
        } else {
          comps.push(comp);
        }
      }
    }
  }

  return mergeBrokenGlyphFragments(comps).sort((a, b) => a.x - b.x || a.y - b.y);
}

/**
 * Re-attaches tiny disconnected serif hooks/specks and horizontally-overlapping
 * fractured digit strokes (such as the flat bottom foot of '2' or '3' broken by
 * anti-aliasing in low-res screenshots) while preserving minus signs, decimal dots,
 * and superscripts.
 */
function mergeBrokenGlyphFragments(rawComps: InkComponent[]): InkComponent[] {
  let comps = rawComps.map((c) => ({ ...c }));

  const unionPair = (a: InkComponent, b: InkComponent): InkComponent => {
    const minX = Math.min(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxX = Math.max(a.x + a.w, b.x + b.w);
    const maxY = Math.max(a.y + a.h, b.y + b.h);
    const w = maxX - minX;
    const h = maxY - minY;
    return {
      id: a.id,
      x: minX,
      y: minY,
      w,
      h,
      area: a.area + b.area,
      cx: minX + w / 2,
      cy: minY + h / 2,
    };
  };

  // Step 1: Absorb tiny broken serif specks into adjacent/enclosing parent glyphs
  const removed = new Set<number>();
  for (let i = 0; i < comps.length; i++) {
    if (removed.has(comps[i].id)) continue;
    const s = comps[i];
    const isSmallSpeck = s.area <= 48 && Math.max(s.w, s.h) <= 9;
    if (!isSmallSpeck) continue;

    let bestParentIdx = -1;
    let bestScore = Infinity;

    for (let j = 0; j < comps.length; j++) {
      if (i === j || removed.has(comps[j].id)) continue;
      const big = comps[j];
      if (big.h < Math.max(14, s.h * 2.0)) continue;

      const insideBbox =
        s.cx >= big.x - 1 &&
        s.cx <= big.x + big.w + 1 &&
        s.cy >= big.y - 1 &&
        s.cy <= big.y + big.h + 1;

      const xGap = Math.max(0, Math.max(s.x - (big.x + big.w), big.x - (s.x + s.w)));
      const yOverlaps = s.y + s.h >= big.y - 2 && s.y <= big.y + big.h + 2;
      const isTrailingBaselineDot = s.x >= big.x + big.w + 1 && s.cy > big.y + big.h * 0.65;

      if (insideBbox || (xGap <= 2 && yOverlaps && !isTrailingBaselineDot)) {
        const dist = Math.hypot(s.cx - big.cx, s.cy - big.cy);
        if (dist < bestScore) {
          bestScore = dist;
          bestParentIdx = j;
        }
      }
    }

    if (bestParentIdx !== -1) {
      comps[bestParentIdx] = unionPair(comps[bestParentIdx], s);
      removed.add(s.id);
    }
  }

  comps = comps.filter((c) => !removed.has(c.id));

  // Preserve any thin horizontal bar that sits between components above and below it (fraction bar)
  const isProtectedBar = (idx: number): boolean => {
    const b = comps[idx];
    if (b.w / Math.max(1, b.h) < 2.0) return false;
    let hasAbove = false;
    let hasBelow = false;
    for (let k = 0; k < comps.length; k++) {
      if (k === idx) continue;
      const c = comps[k];
      if (c.cx >= b.x - 4 && c.cx <= b.x + b.w + 4) {
        if (c.y + c.h <= b.y + 3) hasAbove = true;
        else if (c.y >= b.y + b.h - 3) hasBelow = true;
      }
      if (hasAbove && hasBelow) return true;
    }
    return false;
  };

  // Step 2: Re-merge vertically-split broken feet/bars of single digits (e.g. serif '2')
  let mergedAny = true;
  while (mergedAny) {
    mergedAny = false;
    outer: for (let i = 0; i < comps.length; i++) {
      for (let j = i + 1; j < comps.length; j++) {
        if (isProtectedBar(i) || isProtectedBar(j)) continue;
        const a = comps[i];
        const b = comps[j];
        const top = a.y <= b.y ? a : b;
        const bot = a.y <= b.y ? b : a;
        const vGap = bot.y - (top.y + top.h);
        if (vGap < 0 || vGap > 8) continue;
        if (Math.max(top.w, bot.w) > 32) continue;

        const overlap = Math.max(0, Math.min(top.x + top.w, bot.x + bot.w) - Math.max(top.x, bot.x));
        const minW = Math.max(1, Math.min(top.w, bot.w));
        if (overlap / minW < 0.65) continue;

        const topIsThinBar = top.h <= 10 && top.w / Math.max(1, top.h) >= 2.0;
        const botIsThinBar = bot.h <= 10 && bot.w / Math.max(1, bot.h) >= 2.0;
        const isSplitDigitFoot =
          (botIsThinBar && top.h >= 10 && !topIsThinBar) ||
          (topIsThinBar && bot.h >= 10 && !botIsThinBar && vGap <= 4);

        if (isSplitDigitFoot) {
          comps[i] = unionPair(a, b);
          comps.splice(j, 1);
          mergedAny = true;
          break outer;
        }
      }
    }
  }

  return comps;
}

/**
 * Splits a wide component where an elevated superscript touches its base operand by a thin
 * anti-aliased bridge (e.g. "e^(2x)" or "x^2" in rasterized/scaled screenshots).
 */
function trySplitTouchingSuperscript(
  comp: InkComponent,
  mask: Uint8Array,
  imgWidth: number
): Omit<InkComponent, 'id'>[] | null {
  // Only consider wide non-bar components (avoid thin horizontal fraction/minus bars)
  if (comp.w < comp.h * 1.15 || comp.h < 16 || comp.w < 20) return null;

  const colInk = new Int32Array(comp.w);
  const colMinY = new Int32Array(comp.w).fill(comp.y + comp.h);
  const colMaxY = new Int32Array(comp.w).fill(comp.y - 1);

  for (let dx = 0; dx < comp.w; dx++) {
    const gx = comp.x + dx;
    let cnt = 0;
    for (let dy = 0; dy < comp.h; dy++) {
      const gy = comp.y + dy;
      if (mask[gy * imgWidth + gx] === 1) {
        cnt++;
        if (gy < colMinY[dx]) colMinY[dx] = gy;
        if (gy > colMaxY[dx]) colMaxY[dx] = gy;
      }
    }
    colInk[dx] = cnt;
  }

  const minSideW = Math.max(6, Math.round(comp.h * 0.3));
  const maxBridgeInk = Math.max(3, Math.round(comp.h * 0.16));

  let bestSplitDx = -1;
  let bestScore = Infinity;

  for (let dx = minSideW; dx <= comp.w - minSideW; dx++) {
    if (colInk[dx] > maxBridgeInk) continue;

    // Measure bounding vertical span strictly left of dx vs strictly right of dx
    let lMinY = Infinity;
    let lMaxY = -Infinity;
    let lArea = 0;
    for (let i = 0; i < dx; i++) {
      if (colInk[i] > 0) {
        lArea += colInk[i];
        if (colMinY[i] < lMinY) lMinY = colMinY[i];
        if (colMaxY[i] > lMaxY) lMaxY = colMaxY[i];
      }
    }

    let rMinY = Infinity;
    let rMaxY = -Infinity;
    let rArea = 0;
    for (let i = dx + 1; i < comp.w; i++) {
      if (colInk[i] > 0) {
        rArea += colInk[i];
        if (colMinY[i] < rMinY) rMinY = colMinY[i];
        if (colMaxY[i] > rMaxY) rMaxY = colMaxY[i];
      }
    }

    if (lArea < 8 || rArea < 8) continue;
    const lH = lMaxY - lMinY + 1;
    const rH = rMaxY - rMinY + 1;
    const lCy = (lMinY + lMaxY) / 2;
    const rCy = (rMinY + rMaxY) / 2;

    // Right side must sit cleanly in the upper superscript region relative to left base
    const isElevated =
      lH >= 8 &&
      rH >= 6 &&
      lMaxY - rMaxY >= Math.max(4, comp.h * 0.22) &&
      rMaxY <= lMinY + lH * 0.6 &&
      rCy < lCy - lH * 0.12 &&
      rH <= lH * 1.15;

    if (isElevated && colInk[dx] < bestScore) {
      bestScore = colInk[dx];
      bestSplitDx = dx;
    }
  }

  if (bestSplitDx === -1) return null;

  const measureSlice = (startDx: number, endDx: number): Omit<InkComponent, 'id'> | null => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let area = 0;
    for (let dx = startDx; dx < endDx; dx++) {
      const gx = comp.x + dx;
      for (let dy = 0; dy < comp.h; dy++) {
        const gy = comp.y + dy;
        if (mask[gy * imgWidth + gx] === 1) {
          area++;
          if (gx < minX) minX = gx;
          if (gx > maxX) maxX = gx;
          if (gy < minY) minY = gy;
          if (gy > maxY) maxY = gy;
        }
      }
    }
    if (area < 4) return null;
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    return { x: minX, y: minY, w, h, area, cx: minX + w / 2, cy: minY + h / 2 };
  };

  const leftSlice = measureSlice(0, bestSplitDx);
  const rightSlice = measureSlice(bestSplitDx + 1, comp.w);
  if (!leftSlice || !rightSlice) return null;
  return [leftSlice, rightSlice];
}

/**
 * Finds the widest horizontal fraction bar (vinculum) in a component set that has
 * ink components strictly above and strictly below it within its horizontal span.
 */
export function findTopFractionBar(comps: InkComponent[], regionHeight: number): InkComponent | null {
  if (comps.length < 3) return null;

  const maxBarH = Math.max(12, Math.round(regionHeight * 0.1));
  const thinBars = comps.filter((b) => {
    const aspect = b.w / Math.max(1, b.h);
    const fill = b.area / Math.max(1, b.w * b.h);
    return aspect >= 2.2 && b.h <= maxBarH && fill >= 0.5;
  });

  // Detect pairs of twin parallel horizontal bars (i.e. '=' signs)
  const equalsBarIds = new Set<number>();
  for (let i = 0; i < thinBars.length; i++) {
    for (let j = i + 1; j < thinBars.length; j++) {
      const a = thinBars[i];
      const b = thinBars[j];
      const overlap = horizontalOverlapRatio(a, b);
      const maxW = Math.max(a.w, b.w);
      const widthDiff = Math.abs(a.w - b.w);
      const vDist = Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h);
      if (
        overlap >= 0.6 &&
        widthDiff <= Math.max(8, maxW * 0.35) &&
        vDist >= 0 &&
        vDist <= Math.max(16, maxW * 0.9)
      ) {
        equalsBarIds.add(a.id);
        equalsBarIds.add(b.id);
      }
    }
  }

  let bestBar: InkComponent | null = null;
  for (const b of comps) {
    if (equalsBarIds.has(b.id)) continue;
    const aspect = b.w / Math.max(1, b.h);
    const fill = b.area / Math.max(1, b.w * b.h);
    if (aspect < 3.0 || b.h > maxBarH || fill < 0.55) continue;

    const spanLeft = b.x - 4;
    const spanRight = b.x + b.w + 4;
    let hasAbove = false;
    let hasBelow = false;
    let closestAboveMaxY = -Infinity;
    let closestBelowMinY = Infinity;

    for (const c of comps) {
      if (c.id === b.id || equalsBarIds.has(c.id)) continue;
      if (c.cx >= spanLeft && c.cx <= spanRight) {
        if (c.y + c.h <= b.y + 3) {
          hasAbove = true;
          if (c.y + c.h > closestAboveMaxY) closestAboveMaxY = c.y + c.h;
        } else if (c.y >= b.y + b.h - 3) {
          hasBelow = true;
          if (c.y < closestBelowMinY) closestBelowMinY = c.y;
        }
      }
    }

    if (hasAbove && hasBelow) {
      const aboveGap = Math.max(0, b.y - closestAboveMaxY);
      const belowGap = Math.max(0, closestBelowMinY - (b.y + b.h));
      const maxAllowedGap = Math.max(20, b.w * 1.15, b.h * 8);
      if (aboveGap <= maxAllowedGap && belowGap <= maxAllowedGap) {
        if (!bestBar || b.w > bestBar.w) {
          bestBar = b;
        }
      }
    }
  }

  return bestBar;
}

/**
 * Splits components into horizontal rows when there are vertical whitespace gaps.
 */
export function splitIntoHorizontalRows(comps: InkComponent[]): InkComponent[][] {
  if (comps.length === 0) return [];
  const sortedY = [...comps].sort((a, b) => a.y - b.y);
  const rawBands: { minY: number; maxY: number; items: InkComponent[] }[] = [];

  for (const c of sortedY) {
    const cMin = c.y;
    const cMax = c.y + c.h;
    const last = rawBands[rawBands.length - 1];
    if (!last || cMin > last.maxY + 2) {
      rawBands.push({ minY: cMin, maxY: cMax, items: [c] });
    } else {
      last.maxY = Math.max(last.maxY, cMax);
      last.items.push(c);
    }
  }

  // Keep inline elevated superscripts/subscripts on the same horizontal row when they
  // have no meaningful horizontal stack overlap and sit close vertically.
  const bands: { minY: number; maxY: number; items: InkComponent[] }[] = [];
  for (const band of rawBands) {
    const prev = bands[bands.length - 1];
    if (!prev) {
      bands.push(band);
      continue;
    }
    const prevBox = computeBoundingBox(prev.items);
    const curBox = computeBoundingBox(band.items);
    const vGap = band.minY - prev.maxY;
    let maxItemOverlap = 0;
    for (const a of prev.items) {
      for (const b of band.items) {
        const ov = horizontalOverlapRatio(a, b);
        if (ov > maxItemOverlap) maxItemOverlap = ov;
      }
    }
    const rowH = Math.max(prevBox.h, curBox.h);
    if (maxItemOverlap < 0.2 && vGap <= Math.max(10, Math.round(rowH * 0.45))) {
      prev.maxY = Math.max(prev.maxY, band.maxY);
      prev.items.push(...band.items);
    } else {
      bands.push(band);
    }
  }

  return bands.map((b) => b.items.sort((a, c) => a.x - c.x));
}

function horizontalOverlapRatio(a: { x: number; w: number }, b: { x: number; w: number }): number {
  const overlap = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const minW = Math.max(1, Math.min(a.w, b.w));
  return overlap / minW;
}

function computeBoundingBox(comps: { x: number; y: number; w: number; h: number }[]): { x: number; y: number; w: number; h: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const c of comps) {
    if (c.x < minX) minX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.x + c.w > maxX) maxX = c.x + c.w;
    if (c.y + c.h > maxY) maxY = c.y + c.h;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/**
 * Groups vertically-stacked sub-glyphs (such as 'i'/'j' dot + stem, or '=') that strongly overlap horizontally.
 */
function groupVerticalGlyphParts(comps: InkComponent[]): GlyphGroup[] {
  const sorted = [...comps].sort((a, b) => a.x - b.x || a.y - b.y);
  const groups: GlyphGroup[] = [];

  for (const c of sorted) {
    const match = groups.find((g) => horizontalOverlapRatio(g, c) >= 0.45);
    if (match) {
      match.comps.push(c);
      const box = computeBoundingBox(match.comps);
      match.x = box.x;
      match.y = box.y;
      match.w = box.w;
      match.h = box.h;
      match.cx = box.x + box.w / 2;
      match.cy = box.y + box.h / 2;
    } else {
      groups.push({
        x: c.x,
        y: c.y,
        w: c.w,
        h: c.h,
        cx: c.cx,
        cy: c.cy,
        comps: [c],
      });
    }
  }

  return groups.sort((a, b) => a.x - b.x);
}

/**
 * Segments a single horizontal row into baseline vs elevated superscript runs.
 */
export function segmentBaselineAndSuperscripts(
  comps: InkComponent[]
): { kind: 'base' | 'sup'; box: { x: number; y: number; w: number; h: number }; componentCount: number }[] {
  const groups = groupVerticalGlyphParts(comps);
  if (groups.length <= 1) {
    return groups.length === 1
      ? [{ kind: 'base', box: computeBoundingBox(groups), componentCount: groups[0].comps.length }]
      : [];
  }

  const maxH = Math.max(...groups.map((g) => g.h));
  const isEqualsGroup = (g: GlyphGroup) =>
    g.comps.length === 2 &&
    g.comps.every((c) => c.w / Math.max(1, c.h) >= 2.0 && c.h <= maxH * 0.35);
  const isThinOperatorBar = (g: GlyphGroup) =>
    (g.w / Math.max(1, g.h) >= 2.0 && g.h <= maxH * 0.42) || isEqualsGroup(g);

  const segments: { kind: 'base' | 'sup'; groups: GlyphGroup[] }[] = [];
  let prevBase: GlyphGroup | null = null;

  for (const g of groups) {
    const gBottom = g.y + g.h;
    const isOperator = isThinOperatorBar(g);

    // Elevated superscript zone relative to preceding base operand
    const isSuperscript =
      !isOperator &&
      prevBase !== null &&
      g.y <= prevBase.y + prevBase.h * 0.25 &&
      gBottom <= prevBase.y + prevBase.h * 0.58 &&
      g.cy < prevBase.cy - prevBase.h * 0.12 &&
      g.h <= prevBase.h * 1.15;

    const kind: 'base' | 'sup' = isSuperscript ? 'sup' : 'base';
    if (kind === 'base' && !isOperator) {
      prevBase = g;
    } else if (isOperator) {
      prevBase = null;
    }

    const lastSeg = segments[segments.length - 1];
    if (lastSeg && lastSeg.kind === kind) {
      lastSeg.groups.push(g);
    } else {
      segments.push({ kind, groups: [g] });
    }
  }

  return segments.map((s) => ({
    kind: s.kind,
    box: computeBoundingBox(s.groups),
    componentCount: s.groups.reduce((sum, g) => sum + g.comps.length, 0),
  }));
}

function cleanTokenText(raw: string): string {
  return raw
    .replace(/\r?\n/g, ' ')
    .replace(/[|]/g, '')
    .replace(/[—–−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanLimitSubscript(raw: string): string {
  let s = raw
    .replace(/\r?\n/g, ' ')
    .replace(/[→⟶⇒➡]/g, '->')
    .replace(/[—–−]/g, '-')
    .replace(/∞/g, 'inf')
    .replace(/\s+/g, '')
    .trim();

  s = s.replace(/^([a-zA-Z])[-–—>]+(.+)$/, (_, v, tgt) => `${v.toLowerCase()}->${tgt}`);
  return s;
}

export interface CropOcrBox {
  x: number;
  y: number;
  w: number;
  h: number;
  singleGlyph?: boolean;
}

export type CropOcrCallback = (box: CropOcrBox) => Promise<string>;

/**
 * Recursively parses 2D mathematical layout (fractions, limits + subscripts, multi-line systems,
 * and superscripts) and delegates individual clean bounding boxes to `recognizeCrop`.
 */
export async function parse2DMathLayout(
  comps: InkComponent[],
  imgWidth: number,
  imgHeight: number,
  recognizeCrop: CropOcrCallback
): Promise<string> {
  if (comps.length === 0) return '';

  const regionBox = computeBoundingBox(comps);
  const bar = findTopFractionBar(comps, regionBox.h);

  if (bar) {
    const leftComps: InkComponent[] = [];
    const rightComps: InkComponent[] = [];
    const aboveComps: InkComponent[] = [];
    const belowComps: InkComponent[] = [];

    for (const c of comps) {
      if (c.id === bar.id) continue;
      if (c.cx < bar.x - 2) {
        leftComps.push(c);
      } else if (c.cx > bar.x + bar.w + 2) {
        rightComps.push(c);
      } else if (c.cy < bar.y) {
        aboveComps.push(c);
      } else if (c.cy > bar.y + bar.h) {
        belowComps.push(c);
      }
    }

    const leftText = (await parse2DMathLayout(leftComps, imgWidth, imgHeight, recognizeCrop)).trim();
    const numText = (await parse2DMathLayout(aboveComps, imgWidth, imgHeight, recognizeCrop)).trim();
    const denText = (await parse2DMathLayout(belowComps, imgWidth, imgHeight, recognizeCrop)).trim();
    const rightText = (await parse2DMathLayout(rightComps, imgWidth, imgHeight, recognizeCrop)).trim();

    const fracExpr = `(${numText || '?'}) / (${denText || '?'})`;

    const limHeaderMatch = leftText.match(/^lim\s+([a-zA-Z]->[^\s]+)$/i);
    if (limHeaderMatch) {
      const cond = limHeaderMatch[1];
      if (!rightText) {
        return `lim(${cond}, ${fracExpr})`;
      }
      if (rightText.startsWith('=')) {
        return `lim(${cond}, ${fracExpr}) ${rightText}`;
      }
      return `lim(${cond}, ${fracExpr} ${rightText})`;
    }

    let out = fracExpr;
    if (leftText) {
      out = /[+\-*/^=(,\[]$/.test(leftText) ? `${leftText} ${out}` : `${leftText} * ${out}`;
    }
    if (rightText) {
      out = /^[+\-*/^=),\]]/.test(rightText) ? `${out} ${rightText}` : `${out} * ${rightText}`;
    }
    return out;
  }

  // No fraction bar: check vertical rows
  const rows = splitIntoHorizontalRows(comps);

  if (rows.length === 2) {
    const box0 = computeBoundingBox(rows[0]);
    const box1 = computeBoundingBox(rows[1]);
    if (horizontalOverlapRatio(box0, box1) >= 0.35) {
      const topRaw = cleanTokenText(await recognizeCrop(box0));
      const topAlpha = topRaw.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (topAlpha === 'lim' || topAlpha === 'llm' || topAlpha === 'l1m' || topAlpha === 'tim') {
        const subRaw = await recognizeCrop(box1);
        const subClean = cleanLimitSubscript(subRaw);
        return `lim ${subClean}`;
      }
    }
  }

  if (rows.length >= 2) {
    const rowStrings: string[] = [];
    for (const row of rows) {
      const line = await parseHorizontalRow(row, recognizeCrop);
      if (line) rowStrings.push(line);
    }
    return rowStrings.join('\n');
  }

  return parseHorizontalRow(comps, recognizeCrop);
}

async function parseHorizontalRow(comps: InkComponent[], recognizeCrop: CropOcrCallback): Promise<string> {
  if (comps.length === 0) return '';
  const segs = segmentBaselineAndSuperscripts(comps);

  if (segs.length === 1 && segs[0].kind === 'base') {
    const txt = cleanTokenText(
      await recognizeCrop({ ...segs[0].box, singleGlyph: segs[0].componentCount === 1 })
    );
    return normalizeSingleCharMath(txt);
  }

  const parts: string[] = [];
  for (const seg of segs) {
    const raw = cleanTokenText(
      await recognizeCrop({ ...seg.box, singleGlyph: seg.componentCount === 1 })
    );
    const token = normalizeSingleCharMath(raw);
    if (!token) continue;

    if (seg.kind === 'sup') {
      const wrapped = token.length === 1 && /^[a-zA-Z0-9]$/.test(token) ? `^${token}` : `^(${token})`;
      if (parts.length > 0) {
        parts[parts.length - 1] = `${parts[parts.length - 1]}${wrapped}`;
      } else {
        parts.push(wrapped);
      }
    } else {
      parts.push(token);
    }
  }

  return parts.join(' ').trim();
}

function normalizeSingleCharMath(txt: string): string {
  return txt.replace(/\bX\b/g, 'x').replace(/\bY\b/g, 'y');
}
