import { useMemo } from "react";

interface JsonViewProps {
  data: unknown;
}

type TokenType = "key" | "string" | "number" | "boolean" | "null" | "bracket" | "punctuation";

interface Token {
  type: TokenType;
  value: string;
}

/**
 * Tokenize a JSON string for syntax highlighting.
 */
function tokenizeJson(json: string): Token[][] {
  const lines = json.split("\n");
  return lines.map((line) => {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
      const ch = line[i];

      // Whitespace
      if (ch === " " || ch === "\t") {
        let ws = "";
        while (i < line.length && (line[i] === " " || line[i] === "\t")) {
          ws += line[i];
          i++;
        }
        tokens.push({ type: "punctuation", value: ws });
        continue;
      }

      // Brackets
      if (ch === "{" || ch === "}" || ch === "[" || ch === "]") {
        tokens.push({ type: "bracket", value: ch });
        i++;
        continue;
      }

      // Comma, colon
      if (ch === "," || ch === ":") {
        tokens.push({ type: "punctuation", value: ch === ":" ? ": " : "," });
        i++;
        // Skip space after colon in source
        if (ch === ":" && i < line.length && line[i] === " ") i++;
        continue;
      }

      // String
      if (ch === '"') {
        let str = '"';
        i++;
        while (i < line.length && line[i] !== '"') {
          if (line[i] === "\\") {
            str += line[i];
            i++;
          }
          str += line[i];
          i++;
        }
        str += '"';
        i++; // closing quote

        // Check if this is a key (followed by colon)
        let j = i;
        while (j < line.length && line[j] === " ") j++;
        if (j < line.length && line[j] === ":") {
          tokens.push({ type: "key", value: str });
        } else {
          tokens.push({ type: "string", value: str });
        }
        continue;
      }

      // Numbers
      if (ch === "-" || (ch >= "0" && ch <= "9")) {
        let num = "";
        while (i < line.length && /[0-9eE.+\-]/.test(line[i])) {
          num += line[i];
          i++;
        }
        tokens.push({ type: "number", value: num });
        continue;
      }

      // Booleans and null
      if (line.slice(i, i + 4) === "true") {
        tokens.push({ type: "boolean", value: "true" });
        i += 4;
        continue;
      }
      if (line.slice(i, i + 5) === "false") {
        tokens.push({ type: "boolean", value: "false" });
        i += 5;
        continue;
      }
      if (line.slice(i, i + 4) === "null") {
        tokens.push({ type: "null", value: "null" });
        i += 4;
        continue;
      }

      // Fallback
      tokens.push({ type: "punctuation", value: ch });
      i++;
    }

    return tokens;
  });
}

const tokenColors: Record<TokenType, string> = {
  key: "text-violet-600",
  string: "text-emerald-600",
  number: "text-amber-600",
  boolean: "text-sky-600",
  null: "text-gray-400",
  bracket: "text-gray-500",
  punctuation: "text-gray-400",
};

export function JsonView({ data }: JsonViewProps) {
  const formatted = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const tokenizedLines = useMemo(() => tokenizeJson(formatted), [formatted]);

  return (
    <div className="json-view relative">
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-violet-100 text-violet-600 text-[10px] font-black uppercase tracking-wider">
        JSON
      </div>
      <pre className="overflow-x-auto text-sm sm:text-base leading-relaxed font-mono p-0 m-0 bg-transparent">
        <code>
          {tokenizedLines.map((tokens, lineIdx) => (
            <div key={lineIdx} className="whitespace-pre">
              {tokens.map((token, tokenIdx) => (
                <span key={tokenIdx} className={tokenColors[token.type]}>
                  {token.value}
                </span>
              ))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
