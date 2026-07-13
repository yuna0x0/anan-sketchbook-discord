/**
 * Output Attachment Formats
 * WebP is the default (about 83% smaller than PNG at quality 90); png/jpg
 * are available via the format slash option and the Effects fine-tune field
 * (format=png). JPEG has no alpha, so it is flattened onto white at encode
 * time. Kept as a leaf module because both the generation service and the
 * locale layer need these constants.
 */

export const OUTPUT_FORMATS = ["webp", "png", "jpg"] as const;
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];
export const DEFAULT_OUTPUT_FORMAT: OutputFormat = "webp";

export function isOutputFormat(value: string): value is OutputFormat {
  return (OUTPUT_FORMATS as readonly string[]).includes(value);
}

/**
 * Resolve the slash command format option value; unset or unknown values
 * fall back to the default format
 */
export function resolveFormatOption(
  value: string | null,
): OutputFormat | undefined {
  return value !== null && isOutputFormat(value) ? value : undefined;
}
