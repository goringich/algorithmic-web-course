export type MathTextSegment =
  | { kind: "text"; value: string }
  | { kind: "math"; source: string; display: boolean };

export type MathToken =
  | { kind: "identifier"; value: string; exponent?: string }
  | { kind: "number"; value: string }
  | { kind: "operator"; value: string }
  | { kind: "space"; value: string };

const superscriptByDigit: Record<string, string> = {
  "2": "²",
  "3": "³",
};

function findBalancedBigOEnd(value: string, start: number) {
  if (!value.startsWith("O(", start)) return -1;

  let depth = 0;
  for (let index = start + 1; index < value.length; index += 1) {
    const char = value[index];
    if (char === "(") depth += 1;
    if (char === ")") {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }

  return -1;
}

function nextLegacyMathStart(value: string, from: number) {
  let index = value.indexOf("O(", from);
  while (index !== -1) {
    if (findBalancedBigOEnd(value, index) !== -1) return index;
    index = value.indexOf("O(", index + 2);
  }
  return -1;
}

export function splitMathText(value: string): MathTextSegment[] {
  const segments: MathTextSegment[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const dollarStart = value.indexOf("$", cursor);
    const legacyStart = nextLegacyMathStart(value, cursor);
    const starts = [dollarStart, legacyStart].filter((index) => index >= 0);
    if (!starts.length) {
      segments.push({ kind: "text", value: value.slice(cursor) });
      break;
    }

    const start = Math.min(...starts);
    if (start > cursor) segments.push({ kind: "text", value: value.slice(cursor, start) });

    if (start === dollarStart) {
      const display = value.startsWith("$$", start);
      const delimiter = display ? "$$" : "$";
      const sourceStart = start + delimiter.length;
      const end = value.indexOf(delimiter, sourceStart);
      if (end === -1) {
        segments.push({ kind: "text", value: value.slice(start) });
        break;
      }

      const source = value.slice(sourceStart, end).trim();
      if (source) segments.push({ kind: "math", source, display });
      cursor = end + delimiter.length;
      continue;
    }

    const end = findBalancedBigOEnd(value, start);
    if (end === -1) {
      segments.push({ kind: "text", value: value.slice(start, start + 2) });
      cursor = start + 2;
      continue;
    }

    segments.push({ kind: "math", source: value.slice(start, end), display: false });
    cursor = end;
  }

  return segments.filter((segment) => segment.kind === "math" || segment.value.length !== 0);
}

export function normalizeMathSource(source: string) {
  return source
    .replace(/\\log\b/g, "log")
    .replace(/\\alpha\b/g, "α")
    .replace(/\^\{?([23])\}?/g, (_, digit: string) => superscriptByDigit[digit] ?? digit)
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeMathSource(source: string): MathToken[] {
  const normalized = normalizeMathSource(source);
  const tokens: MathToken[] = [];
  let cursor = 0;
  const tokenPattern = /([A-Za-zΑ-Ωα-ω]+)([²³])?|(\d+)|([+\-*/=(),])|(\s+)/gu;

  for (const match of normalized.matchAll(tokenPattern)) {
    const index = match.index ?? 0;
    if (index !== cursor) return [];

    if (match[1]) {
      tokens.push({
        kind: "identifier",
        value: match[1],
        exponent: match[2] === "²" ? "2" : match[2] === "³" ? "3" : undefined,
      });
    } else if (match[3]) {
      tokens.push({ kind: "number", value: match[3] });
    } else if (match[4]) {
      tokens.push({ kind: "operator", value: match[4] });
    } else if (match[5]) {
      tokens.push({ kind: "space", value: match[5] });
    }

    cursor = index + match[0].length;
  }

  return cursor === normalized.length ? tokens : [];
}

export function isSupportedMathSource(source: string) {
  const normalized = normalizeMathSource(source);
  return normalized.length > 0 && tokenizeMathSource(source).length > 0;
}

export function hasRenderableMath(value: string) {
  const mathSegments = splitMathText(value).filter((segment) => segment.kind === "math");
  return mathSegments.length > 0 && mathSegments.every((segment) => isSupportedMathSource(segment.source));
}

export function isMathTextSupported(value: string) {
  const segments = splitMathText(value);
  const mathSegments = segments.filter((segment) => segment.kind === "math");
  const hasUnparsedMathSyntax = segments.some(
    (segment) => segment.kind === "text" && (segment.value.includes("$") || segment.value.includes("O(")),
  );

  return !hasUnparsedMathSyntax && mathSegments.every((segment) => isSupportedMathSource(segment.source));
}
