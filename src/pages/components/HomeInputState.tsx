import { useMemo, useCallback, useEffect, useRef } from "react";
import { tryParseJson } from "@/lib/utils";

const MAX_CONTENT_LENGTH = 5000;

type HomeInputStateProps = {
  content: string;
  submitting: boolean;
  error: string | null;
  canSubmit: boolean;
  onContentChange: (value: string) => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onCreate: () => void;
};

export function HomeInputState({
  content,
  submitting,
  error,
  canSubmit,
  onContentChange,
  onPaste,
  onCreate,
}: HomeInputStateProps) {
  const isJson = useMemo(() => tryParseJson(content) !== null, [content]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CONTENT_LENGTH;
  const isNearLimit = charCount > MAX_CONTENT_LENGTH * 0.9;

  // Auto-grow textarea up to ~60% of viewport, then scroll internally.
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const maxHeight = window.innerHeight * 0.6;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    autoResize();
  }, [content, autoResize]);

  return (
    <div className="animate-fade-in relative z-10 w-full flex flex-col items-center space-y-12">
      <div className="w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex flex-col shrink-0 mb-6 mt-4">
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight brand-text leading-tight">
          Just copy, baby.
        </h1>
        <p className="text-xl text-zinc-400 mb-8">Share content that disappears in 2 minutes</p>

        <div className="w-full bg-background border-2 border-black rounded-3xl p-6 mt-12 relative">
          {isJson && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-violet-100 text-violet-600 text-[10px] font-black uppercase tracking-wider z-10">
              JSON
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onPaste={onPaste}
            disabled={submitting}
            placeholder="Paste your content here..."
            maxLength={MAX_CONTENT_LENGTH}
            className={`home-paste-input w-full h-64 resize-none bg-transparent border-0 outline-none ring-0 m-0 pb-6 ${isJson ? "font-mono text-sm sm:text-base" : "text-lg sm:text-xl"}`}
            autoFocus
          />

          <div
            className={`absolute bottom-3 right-4 text-[11px] font-mono font-bold tabular-nums tracking-wider z-10 transition-colors ${
              isOverLimit
                ? "text-red-500"
                : isNearLimit
                  ? "text-amber-500"
                  : "text-zinc-400"
            }`}
            aria-live="polite"
          >
            {charCount.toLocaleString()} / {MAX_CONTENT_LENGTH.toLocaleString()}
          </div>

          {submitting && (
            <div className="absolute inset-0 bg-background/80 rounded-3xl flex items-center justify-center backdrop-blur-[2px] z-20">
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-4 h-4 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-4 h-4 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-4 h-4 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={onCreate}
            disabled={!canSubmit}
            style={{ paddingInline: "1.75rem" }}
            className={
              canSubmit
                ? "inline-flex w-auto h-12 sm:h-14 items-center justify-center border-0 rounded-3xl brand-bg font-normal text-xl sm:text-2xl shadow-2xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                : "inline-flex w-auto h-12 sm:h-14 cursor-not-allowed items-center justify-center border-1 border-border rounded-3xl bg-secondary font-normal text-lg sm:text-xl text-muted-foreground shadow-sm transition-all"
            }
          >
            Get Code
          </button>
        </div>
      </div>

      {error && <div className="mt-4 text-red-500 font-bold bg-red-50/50 px-6 py-3 rounded-full border border-red-100/50 text-sm">{error}</div>}
    </div>
  );
}
