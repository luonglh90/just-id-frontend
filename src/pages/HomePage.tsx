import { useState, useCallback, useRef } from "react";
import { useStatus } from "@/hooks/useStatus";
import { createPaste, type CreateResponse, ApiRequestError } from "@/lib/api";
import { TurnstileWidget, type TurnstileWidgetRef } from "@/components/TurnstileWidget";
import { useCountdown } from "@/hooks/useCountdown";
import { formatCountdown } from "@/lib/utils";

function CountdownTimer({ expiresAt }: { expiresAt: number }) {
  const remaining = useCountdown(expiresAt);
  if (remaining <= 0) return <span className="text-red-500">Expired</span>;
  return <span>{formatCountdown(remaining)}</span>;
}

export function HomePage() {
  const { refetch } = useStatus();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateResponse | null>(null);
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  const handleCreate = useCallback(async (textToSubmit = content) => {
    if (!textToSubmit.trim() || submitting) return;

    const token = turnstileRef.current?.getToken();
    if (!token) {
      setError("Bot verification pending. Please wait a moment and try again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    // Basic Delta for plain text to support Lexical viewer
    const delta = { root: { children: [{ type: "paragraph", children: [{ type: "text", version: 1, text: textToSubmit }], direction: "ltr", format: "", indent: 0, version: 1 }], direction: "ltr", format: "", indent: 0, type: "root", version: 1 } };

    try {
      const res = await createPaste(textToSubmit, delta, token);
      setContent(""); // Clear input when done
      setResult(res);
      refetch();

      try {
        await navigator.clipboard.writeText(res.url);
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
    const pastedText = e.clipboardData.getData("Text");
    if (pastedText && pastedText.trim().length > 0) {
      setContent(pastedText);
      // Auto submit on paste wait a tick for content to settle
      setTimeout(() => {
        handleCreate(pastedText);
      }, 50);
    }
  }, [handleCreate]);

  const handleCreateAnother = useCallback(() => {
    setContent("");
    setResult(null);
    setError(null);
  }, []);

  const canSubmit = Boolean(content.trim()) && !submitting;

  const [copied, setCopied] = useState(false);
  const copyUrl = async () => {
    if (result) {
      try {
         await navigator.clipboard.writeText(result.url);
      } catch {
         // fallback
         const textArea = document.createElement("textarea");
         textArea.value = result.url;
         document.body.appendChild(textArea);
         textArea.select();
         document.execCommand("copy");
         document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-background px-4 py-20 selection:bg-accent selection:text-white">
      {/* Invisible Turnstile Widget */}
      <TurnstileWidget ref={turnstileRef} />

      <main className="w-full max-w-4xl text-center space-y-8 snap-effect flex-1 flex flex-col items-center justify-center">
        {result ? (
          /* Result State */
          <div className="space-y-8 animate-fade-in relative z-10 w-full flex flex-col items-center">
            <h2 className="text-2xl font-black tracking-tight text-muted-foreground uppercase opacity-50">Say this code:</h2>
            
            <div className="py-6">
              <span className="font-code text-[8rem] sm:text-[12rem] leading-none font-black text-foreground select-all drop-shadow-xl brand-text">
                {result.id}
              </span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div 
                className="text-2xl sm:text-3xl font-bold text-foreground border-4 border-dashed border-border rounded-3xl px-12 py-6 cursor-pointer hover:border-accent hover:bg-accent/5 transition-all shadow-sm" 
                onClick={copyUrl}
              >
                {result.url.replace(/^https?:\/\//, '')}
              </div>
              <div className="text-accent font-black text-xl tracking-wide uppercase flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Expires in <CountdownTimer expiresAt={result.expiresAt} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 w-full sm:w-auto">
              <button 
                onClick={copyUrl}
                className="px-12 py-5 rounded-2xl border-4 border-foreground font-black text-foreground hover:bg-foreground hover:text-background transition-all shadow-md text-xl active:scale-95"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button 
                onClick={handleCreateAnother}
                className="px-12 py-5 rounded-2xl brand-bg font-black text-background hover:scale-105 transition-all shadow-xl shadow-accent/20 text-xl active:scale-95"
              >
                New Paste
              </button>
            </div>
          </div>
        ) : (
          /* Input State */
          <div className="animate-fade-in relative z-10 w-full flex flex-col items-center space-y-16">
            
              

            {/* <div className="w-full max-w-2xl mb-8 mt-10 fade-in" style={{ animationDelay: "200ms" }}>
                        <textarea 
                            id="pasteInput"
                            className="w-full h-64 bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-lg text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono"
                            placeholder="Paste your content here..."
                        ></textarea>
                    </div> */}


            <div className="w-full max-w-3xl mx-auto flex flex-col shrink-0 mb-8 mt-4">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight brand-text leading-tight">
                Just copy, baby.
              </h1>
              <p className="text-xl text-zinc-400 mb-12">
                Share content that disappears in 2 minutes
              </p>
              
              <div className="h-14 sm:h-16 shrink-0" aria-hidden />

              <div className="w-full h-64 bg-background border-2 border-black rounded-3xl p-6 mt-12 relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={handlePaste}
                  disabled={submitting}
                  placeholder="Paste your content here..."
                  className="home-paste-input w-full h-full resize-none bg-transparent border-0 outline-none ring-0 m-0 text-lg sm:text-xl"
                  autoFocus
                />
                
                {submitting && (
                  <div className="absolute inset-0 bg-background/80 rounded-[3.5rem] flex items-center justify-center backdrop-blur-[2px] z-20">
                    <div className="animate-pulse flex items-center gap-4">
                      <div className="w-4 h-4 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-4 h-4 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-4 h-4 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="h-12 sm:h-12 shrink-0" aria-hidden />

              <div className="justify-center fade-in pt-18">
                <button
                  type="button"
                  onClick={() => handleCreate()}
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
            

            {error && <div className="mt-8 text-red-500 font-bold bg-red-50/50 px-6 py-3 rounded-full border border-red-100/50 text-sm">{error}</div>}
          </div>
        )}
      </main>

      <footer className="py-8 w-full text-center mt-auto mb-8 sm:h-10">
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
