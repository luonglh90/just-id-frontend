import { useState, useCallback } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { formatCountdown } from "@/lib/utils";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

interface ContentViewProps {
  content: string;
  expiresAt: number;
  id: string;
}

export function ContentView({ content, expiresAt, id }: ContentViewProps) {
  const [copied, setCopied] = useState(false);
  const remaining = useCountdown(expiresAt);

  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "a", "pre", "code",
      "ol", "ul", "li", "blockquote", "h1", "h2", "h3",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  const handleCopyText = useCallback(async () => {
    // Extract plain text from HTML
    const div = document.createElement("div");
    div.innerHTML = sanitizedContent;
    const text = div.textContent || div.innerText || "";

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }, [sanitizedContent]);

  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8 max-w-3xl mx-auto w-full">
      {/* Meta Info */}
      <div className="flex items-center justify-between px-2 sm:px-4">
        <Link
          to="/"
          className="group flex items-center gap-2 text-sm sm:text-base font-black text-gray-400 hover:text-black transition-colors uppercase tracking-wider"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="flex items-center gap-4">
          {remaining > 0 && (
            <div className={`flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-wider ${remaining < 30000 ? 'text-red-500' : 'text-accent'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatCountdown(remaining)}
            </div>
          )}
          <span className="text-sm font-black text-gray-300 uppercase tracking-widest hidden sm:inline">#{id}</span>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white border-[4px] border-gray-200 rounded-[2.5rem] p-8 sm:p-14 shadow-sm hover:shadow-md transition-all">
        <div
          className="content-display text-xl sm:text-3xl font-medium text-black leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-8">
        <button
          onClick={handleCopyText}
          className="px-10 py-5 rounded-full bg-black text-white font-black text-xl hover:scale-105 hover:bg-accent transition-all shadow-xl flex items-center gap-3 active:scale-95"
        >
          {copied ? (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Copied to clipboard!
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy text
            </>
          )}
        </button>
      </div>
    </div>
  );
}
