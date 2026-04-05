import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { type CreateResponse } from "@/lib/api";
import { formatCountdown } from "@/lib/utils";

function CountdownTimer({ expiresAt }: { expiresAt: number }) {
  const remaining = useCountdown(expiresAt);
  if (remaining <= 0) return <span className="text-red-500">Expired</span>;
  return <span>{formatCountdown(remaining)}</span>;
}

type HomeResultStateProps = {
  result: CreateResponse;
  onCreateAnother: () => void;
};

export function HomeResultState({ result, onCreateAnother }: HomeResultStateProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(result.url);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = result.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayUrl = result.url.replace(/^https?:\/\//, "");

  return (
    <div className="space-y-6 animate-fade-in relative z-10 w-full flex flex-col items-center">

      <div className="py-2">
        <h2 className="text-2xl font-normal tracking-tight text-zinc-700 uppercase opacity-80">Say this code:</h2>
        <span className="font-code text-[8rem] sm:text-[12rem] leading-none font-black text-foreground drop-shadow-xl brand-text">
          {result.id}
        </span>
      </div>

      <div className="w-full max-w-6xl mb-4 fade-in" style={{ animationDelay: "200ms" }}>
        <div className="rounded-2xl border border-zinc-200 bg-white/90 backdrop-blur-xl px-6 py-6 sm:px-10 sm:py-8 shadow-[0_25px_80px_-45px_rgba(15,23,42,0.25)]">
          <p className="text-zinc-500 text-sm mb-4 font-semibold text-left ml-2">Share this link</p>
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            <input
              type="text"
              value={displayUrl}
              readOnly
              aria-label="Share link"
              className="flex-1 min-w-0 bg-white border border-zinc-300 rounded-2xl px-5 py-4 text-base sm:text-lg font-mono text-zinc-900"
            />
            <button
              type="button"
              onClick={copyUrl}
              className="glow-button sm:shrink-0 px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg shadow-[0_12px_30px_-12px_rgba(59,130,246,0.8)] transition-all"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 fade-in" style={{ animationDelay: "300ms" }}>
        <div className="rounded-2xl border border-zinc-200 bg-white/90 backdrop-blur-xl px-8 py-5 shadow-md">
          <div className="text-zinc-800 font-mono font-semibold text-2xl sm:text-3xl tracking-tight flex items-center gap-3 sm:gap-4">
            <svg className="timer-pulse w-6 h-6 sm:w-7 sm:h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-orange-400"><CountdownTimer expiresAt={result.expiresAt} /></span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 fade-in" style={{ animationDelay: "400ms" }}>
        <button
          type="button"
          onClick={onCreateAnother}
          className="glow-button min-w-56 px-10 py-4 rounded-2xl border border-zinc-300 bg-zinc-100 text-zinc-800 font-bold text-lg hover:bg-zinc-200 transition-all"
        >
          Create New
        </button>
        <a
          href={result.url}
          target="_blank"
          rel="noreferrer"
          className="glow-button min-w-56 px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg shadow-[0_14px_34px_-16px_rgba(59,130,246,0.85)] hover:brightness-110 transition-all"
        >
          View Paste
        </a>
      </div>
    </div>
  );
}
