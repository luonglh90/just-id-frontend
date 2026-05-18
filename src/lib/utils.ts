// utils.ts
/**
 * Format seconds into MM:SS countdown string.
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "Expires in 0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `Expires in  ${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Extract plain text from HTML string.
 */
export function extractPlainText(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/**
 * Try to parse a string as JSON. Returns the parsed object/array if valid, null otherwise.
 */
export function tryParseJson(text: string): unknown | null {
  const trimmed = text.trim();
  // Quick check: must start with { or [ to be a JSON object/array
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

/**
 * Detect if content (HTML or plain text) is JSON.
 * Returns the parsed JSON if valid, null otherwise.
 */
export function detectJson(content: string): unknown | null {
  // First try the raw content (for plain text pastes)
  const directParse = tryParseJson(content);
  if (directParse !== null) return directParse;

  // Try extracting plain text from HTML
  const plainText = extractPlainText(content);
  return tryParseJson(plainText);
}
