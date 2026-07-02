/**
 * Key=Value Parser
 * Shared parsing for the compact "key=value key=value" syntax used by the
 * fine-tune and filter-settings modal fields.
 */

export interface NumericLimit {
  min: number;
  max: number;
}

export interface ParsedNumericKeyValues<K extends string> {
  values: Partial<Record<K, number>>;
  /** Tokens that were not valid key=value pairs for the given limits */
  invalidTokens: string[];
}

/**
 * Split an input string into candidate key=value tokens
 */
export function splitKeyValueTokens(input: string): string[] {
  return input.split(/[\s,]+/).filter((token) => token.length > 0);
}

/**
 * Parse tokens into a numeric value map, clamping to the given limits.
 * Unknown keys and unparsable numbers are reported as invalid tokens.
 */
export function parseNumericKeyValues<K extends string>(
  tokens: string[],
  limits: Record<K, NumericLimit>,
): ParsedNumericKeyValues<K> {
  const values: Partial<Record<K, number>> = {};
  const invalidTokens: string[] = [];

  for (const token of tokens) {
    const [key, rawValue, ...rest] = token.split("=");
    if (!key || rawValue === undefined || rest.length > 0) {
      invalidTokens.push(token);
      continue;
    }

    const normalizedKey = key.toLowerCase();
    const value = Number(rawValue);
    if (!(normalizedKey in limits) || !Number.isFinite(value)) {
      invalidTokens.push(token);
      continue;
    }

    const { min, max } = limits[normalizedKey as K];
    values[normalizedKey as K] = Math.max(min, Math.min(max, value));
  }

  return { values, invalidTokens };
}

/**
 * Serialize a numeric value map back to key=value syntax, in key order
 */
export function serializeNumericKeyValues<K extends string>(
  values: Partial<Record<K, number>> | undefined,
  keys: readonly K[],
): string {
  if (!values) {
    return "";
  }
  return keys
    .filter((key) => values[key] !== undefined)
    .map((key) => `${key}=${values[key]}`)
    .join(" ");
}
