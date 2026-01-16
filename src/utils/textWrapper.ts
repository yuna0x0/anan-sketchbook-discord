/**
 * Text Wrapper Utility
 * Provides text wrapping algorithms for fitting text within a specified width.
 * Includes both a simple greedy algorithm and an improved Knuth-Plass algorithm.
 */

import { createCanvas, CanvasRenderingContext2D } from "canvas";

/**
 * RGB color type
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Text segment with color information
 */
export interface ColorSegment {
  text: string;
  color: RGBColor;
}

/**
 * Measure the width of text using canvas context
 */
export function measureTextWidth(
  ctx: CanvasRenderingContext2D,
  text: string
): number {
  return ctx.measureText(text).width;
}

/**
 * Check if a token is a bracket token (starts with [ or end with ])
 */
function isBracketToken(token: string): boolean {
  return token.startsWith("[") && token.endsWith("]");
}

/**
 * Split a long token into smaller pieces that fit within maxWidth
 */
function splitLongToken(
  ctx: CanvasRenderingContext2D,
  token: string,
  maxWidth: number
): string[] {
  // Quick return if token already fits
  if (measureTextWidth(ctx, token) <= maxWidth) {
    return [token];
  }

  // Handle bracket tokens specially
  if (isBracketToken(token) && token.length > 2) {
    const inner = token;
    const chunksInner: string[] = [];
    let buf = "";

    for (const ch of inner) {
      const trial = buf + ch;
      if (measureTextWidth(ctx, trial) <= maxWidth) {
        buf = trial;
      } else {
        if (buf === "") {
          // Single character exceeds maxWidth, force emit it
          chunksInner.push(ch);
        } else {
          chunksInner.push(buf);
          buf = ch;
        }
      }
    }
    if (buf) {
      chunksInner.push(buf);
    }

    // Further split any pieces that are still too long
    const safe: string[] = [];
    for (const piece of chunksInner) {
      if (measureTextWidth(ctx, piece) <= maxWidth) {
        safe.push(piece);
      } else {
        let tmp = "";
        for (const ch of piece) {
          const trial = tmp + ch;
          if (measureTextWidth(ctx, trial) <= maxWidth) {
            tmp = trial;
          } else {
            if (tmp) {
              safe.push(tmp);
            }
            tmp = ch;
          }
        }
        if (tmp) {
          safe.push(tmp);
        }
      }
    }
    return safe;
  }

  // Non-bracket long token: split by character
  const parts: string[] = [];
  let buf = "";

  for (const ch of token) {
    const trial = buf + ch;
    if (measureTextWidth(ctx, trial) <= maxWidth) {
      buf = trial;
    } else {
      if (buf === "") {
        // Single character exceeds limit, force emit it
        parts.push(ch);
      } else {
        parts.push(buf);
        buf = ch;
      }
    }
  }
  if (buf) {
    parts.push(buf);
  }

  return parts;
}

/**
 * Tokenize text for the Knuth-Plass algorithm
 * Handles brackets, spaces, and mixed content
 */
export function tokenize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const tokens: string[] = [];
  let buf = "";
  let inBracket = false;

  for (const ch of text) {
    if (ch === "[") {
      if (buf) {
        tokens.push(buf);
      }
      buf = "[";
      inBracket = true;
    } else if (ch === "]") {
      buf += "]";
      tokens.push(buf);
      buf = "";
      inBracket = false;
    } else if (inBracket) {
      buf += ch;
    } else if (/\s/.test(ch)) {
      if (buf) {
        tokens.push(buf);
        buf = "";
      }
      // Preserve single space as token
      tokens.push(ch);
    } else {
      // Treat ASCII letters as part of word, else treat as single char
      if (/[a-zA-Z]/.test(ch)) {
        buf += ch;
      } else {
        if (buf) {
          tokens.push(buf);
          buf = "";
        }
        tokens.push(ch);
      }
    }
  }
  if (buf) {
    tokens.push(buf);
  }

  // Split tokens that are too long
  const finalTokens: string[] = [];
  for (const tok of tokens) {
    if (tok === "") {
      continue;
    }
    if (measureTextWidth(ctx, tok) <= maxWidth) {
      finalTokens.push(tok);
    } else {
      const splits = splitLongToken(ctx, tok, maxWidth);
      finalTokens.push(...splits);
    }
  }

  return finalTokens;
}

/**
 * Simple greedy text wrapping algorithm
 * Wraps text to fit within the specified width
 */
export function wrapLinesGreedy(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];

  // Split by newlines first
  const paragraphs = text.split("\n");

  for (const para of paragraphs) {
    if (para === "") {
      lines.push("");
      continue;
    }

    const hasSpace = para.includes(" ");
    const units = hasSpace ? para.split(" ") : [...para];
    let buf = "";

    const unitJoin = (a: string, b: string): string => {
      if (!a) return b;
      return hasSpace ? `${a} ${b}` : `${a}${b}`;
    };

    for (const u of units) {
      const trial = unitJoin(buf, u);
      const w = measureTextWidth(ctx, trial);

      if (w <= maxWidth) {
        buf = trial;
        continue;
      }

      // Line would be too long, emit current buffer
      if (buf) {
        lines.push(buf);
      }

      // Handle current unit
      if (hasSpace && u.length > 1) {
        let tmp = "";
        for (const ch of u) {
          if (measureTextWidth(ctx, tmp + ch) <= maxWidth) {
            tmp += ch;
          } else {
            if (tmp) {
              lines.push(tmp);
            }
            tmp = ch;
          }
        }
        buf = tmp;
        continue;
      }

      if (measureTextWidth(ctx, u) <= maxWidth) {
        buf = u;
      } else {
        lines.push(u);
        buf = "";
      }
    }

    if (buf !== "") {
      lines.push(buf);
    }
  }

  return lines;
}

/**
 * Improved Knuth-Plass text wrapping algorithm
 * Uses dynamic programming to minimize raggedness
 */
export function wrapLinesKnuthPlass(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const tokens = tokenize(ctx, text, maxWidth);
  const n = tokens.length;

  if (n === 0) {
    return [""];
  }

  // Calculate cumulative widths
  const widths = tokens.map((t) => measureTextWidth(ctx, t));
  const cum: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    cum[i + 1] = cum[i] + widths[i];
  }

  const INF = Number.MAX_SAFE_INTEGER;
  const dp: number[] = new Array(n + 1).fill(INF);
  const prev: number[] = new Array(n + 1).fill(-1);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    // Iterate j backwards for early break when width > maxWidth
    for (let j = i - 1; j >= 0; j--) {
      const lineWidth = cum[i] - cum[j];
      if (lineWidth > maxWidth) {
        break;
      }

      const remaining = maxWidth - lineWidth;
      // No penalty for the last line
      const badness = i === n ? 0 : remaining ** 2;
      const cost = dp[j] + badness;

      if (cost < dp[i]) {
        dp[i] = cost;
        prev[i] = j;
      }
    }
  }

  // If no feasible layout found, fallback to greedy
  if (prev[n] === -1) {
    const lines: string[] = [];
    let cur = "";
    for (const tok of tokens) {
      const trial = cur + tok;
      if (measureTextWidth(ctx, trial) <= maxWidth) {
        cur = trial;
      } else {
        if (cur) {
          lines.push(cur);
        }
        cur = tok;
      }
    }
    if (cur) {
      lines.push(cur);
    }
    return lines;
  }

  // Backtrack to build lines
  const lines: string[] = [];
  let idx = n;
  while (idx > 0) {
    const j = prev[idx];
    lines.push(tokens.slice(j, idx).join(""));
    idx = j;
  }
  lines.reverse();

  return lines;
}

/**
 * Parse text into color segments
 * Text inside brackets [] uses the bracket color
 */
export function parseColorSegments(
  text: string,
  inBracket: boolean,
  bracketColor: RGBColor,
  normalColor: RGBColor
): { segments: ColorSegment[]; inBracket: boolean } {
  const segments: ColorSegment[] = [];
  let buf = "";

  for (const ch of text) {
    if (ch === "[") {
      if (buf) {
        segments.push({
          text: buf,
          color: inBracket ? bracketColor : normalColor,
        });
        buf = "";
      }
      segments.push({ text: ch, color: bracketColor });
      inBracket = true;
    } else if (ch === "]") {
      if (buf) {
        segments.push({ text: buf, color: bracketColor });
        buf = "";
      }
      segments.push({ text: ch, color: bracketColor });
      inBracket = false;
    } else {
      buf += ch;
    }
  }

  if (buf) {
    segments.push({
      text: buf,
      color: inBracket ? bracketColor : normalColor,
    });
  }

  return { segments, inBracket };
}

/**
 * Measure the dimensions of a text block
 */
export function measureTextBlock(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  fontSize: number,
  lineSpacing: number
): { width: number; height: number; lineHeight: number } {
  // Calculate line height based on font size and spacing
  const lineHeight = Math.ceil(fontSize * (1 + lineSpacing));

  // Find the maximum width among all lines
  let maxWidth = 0;
  for (const line of lines) {
    const width = measureTextWidth(ctx, line);
    if (width > maxWidth) {
      maxWidth = width;
    }
  }

  // Calculate total height
  const totalHeight = Math.max(lineHeight * Math.max(1, lines.length), 1);

  return {
    width: Math.ceil(maxWidth),
    height: totalHeight,
    lineHeight,
  };
}

/**
 * Text wrapping algorithm type
 */
export type WrapAlgorithm = "greedy" | "knuth_plass";

/**
 * Wrap text using the specified algorithm
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  algorithm: WrapAlgorithm = "greedy"
): string[] {
  if (algorithm === "knuth_plass") {
    return wrapLinesKnuthPlass(ctx, text, maxWidth);
  }
  return wrapLinesGreedy(ctx, text, maxWidth);
}
