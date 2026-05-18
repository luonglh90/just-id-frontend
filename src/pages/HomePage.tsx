import { useState, useCallback, useRef } from "react";
import { useStatus } from "@/hooks/useStatus";
import { createPaste, type CreateResponse, ApiRequestError } from "@/lib/api";
import { TurnstileWidget, type TurnstileWidgetRef } from "@/components/TurnstileWidget";
import { HomeInputState } from "./components/HomeInputState";
import { HomeResultState } from "./components/HomeResultState";

export function HomePage() {
  const { refetch } = useStatus();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateResponse | null>(null);
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  const handleCreate = useCallback(async (textToSubmit = content) => {
    if (!textToSubmit.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    // Trigger Turnstile widget on create — managed mode shows only when needed.
    const token = await turnstileRef.current?.execute();

    if (!token) {
      setError("Bot verification failed. Please try again.");
      setSubmitting(false);
      turnstileRef.current?.reset();
      return;
    }

    // Basic Delta for plain text to support Lexical viewer
    const delta = { root: { children: [{ type: "paragraph", children: [{ type: "text", version: 1, text: textToSubmit }], direction: "ltr", format: "", indent: 0, version: 1 }], direction: "ltr", format: "", indent: 0, type: "root", version: 1 } };

    try {
      const res = await createPaste(textToSubmit, delta, token);
      setContent(""); // Clear input when done
      setResult(res);
      refetch();

      try {
        await navigator.clipboard.writeText(`${window.location.origin}/${res.id}`);
      } catch {
        /* noop */
      }
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
      turnstileRef.current?.reset();
    }
  }, [content, submitting, refetch]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("Text");
    if (pastedText && pastedText.trim().length > 0) {
      setContent(pastedText);
    }
  }, []);

  const handleCreateAnother = useCallback(() => {
    setContent("");
    setResult(null);
    setError(null);
  }, []);

  const canSubmit = Boolean(content.trim()) && !submitting;

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background px-4 pt-20 pb-2 selection:bg-accent selection:text-white">
      {/* Turnstile Widget — renders on Create click */}
      <TurnstileWidget ref={turnstileRef} />

      <main className="w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl text-center space-y-8 snap-effect flex-1 flex flex-col items-center justify-center">
        {result ? (
          <HomeResultState result={result} onCreateAnother={handleCreateAnother} />
        ) : (
          <HomeInputState
            content={content}
            submitting={submitting}
            error={error}
            canSubmit={canSubmit}
            onContentChange={setContent}
            onPaste={handlePaste}
            onCreate={() => handleCreate()}
          />
        )}
      </main>

      <footer className="py-0 w-full text-center mt-auto">
        <div className="flex items-center justify-center gap-6 text-[12px] font-black text-muted-foreground uppercase tracking-[0.25em] opacity-80">
          <span>No login</span>
          <span>•</span>
          <span>No history</span>
          <span>•</span>
          <span>Auto delete</span>
        </div>
      </footer>
    </div>
  );
}
