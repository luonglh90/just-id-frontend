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
  return (
    <div className="animate-fade-in relative z-10 w-full flex flex-col items-center space-y-12">
      <div className="w-full max-w-3xl mx-auto flex flex-col shrink-0 mb-6 mt-4">
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight brand-text leading-tight">
          Just copy, baby.
        </h1>
        <p className="text-xl text-zinc-400 mb-8">Share content that disappears in 2 minutes</p>

        <div className="w-full h-64 bg-background border-2 border-black rounded-3xl p-6 mt-12 relative">
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onPaste={onPaste}
            disabled={submitting}
            placeholder="Paste your content here..."
            className="home-paste-input w-full h-full resize-none bg-transparent border-0 outline-none ring-0 m-0 text-lg sm:text-xl"
            autoFocus
          />

          {submitting && (
            <div className="absolute inset-0 bg-background/80 rounded-[3.5rem] flex items-center justify-center backdrop-blur-[2px] z-20">
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-4 h-4 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-4 h-4 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-4 h-4 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <div className="justify-center fade-in pt-10">
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
        <div className="h-6 sm:h-6 shrink-0" aria-hidden />
      </div>

      {error && <div className="mt-8 text-red-500 font-bold bg-red-50/50 px-6 py-3 rounded-full border border-red-100/50 text-sm">{error}</div>}
    </div>
  );
}
