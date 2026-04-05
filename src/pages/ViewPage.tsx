import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPaste, type PasteResponse, ApiRequestError } from "@/lib/api";
import { ContentView } from "@/components/ContentView";
import { BrandHeader } from "@/components/BrandHeader";

export function ViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paste, setPaste] = useState<PasteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<{
    type: "expired" | "not_found" | "error";
    message: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (!id || id.length !== 4) {
      setErrorState({ 
        type: "not_found", 
        message: "Lost?", 
        description: "The content you're looking for doesn't exist or the link is invalid." 
      });
      setLoading(false);
      return;
    }

    const fetchPaste = async () => {
      try {
        const data = await getPaste(id);
        setPaste(data);
      } catch (err) {
        if (err instanceof ApiRequestError) {
          if (err.status === 410) {
            setErrorState({ 
              type: "expired", 
              message: "Gone!", 
              description: "Content on copy.baby expires after 2 minutes. This one has already vanished." 
            });
          } else if (err.status === 404) {
            setErrorState({ 
              type: "not_found", 
              message: "Missing?", 
              description: "We couldn't find anything with that code. Maybe it was already deleted?" 
            });
          } else {
            setErrorState({ 
              type: "error", 
              message: "Oops!", 
              description: err.message 
            });
          }
        } else {
          setErrorState({ 
            type: "error", 
            message: "Error", 
            description: "Failed to load content. Please try again." 
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  return (
    <div className="min-h-dvh flex flex-col bg-background selection:bg-accent selection:text-white">
      <BrandHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl flex flex-col items-center">
          {loading ? (
            <div className="flex flex-col items-center gap-6 animate-pulse-soft">
              <div className="text-4xl font-black tracking-tighter text-gray-200">...</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching content</div>
            </div>
          ) : paste ? (
            <ContentView
              content={paste.content}
              expiresAt={paste.expiresAt}
              id={paste.id}
            />
          ) : errorState ? (
            <div className="text-center space-y-8 animate-fade-in max-w-md">
              <h1 className="text-[6rem] sm:text-[8rem] font-black tracking-tighter text-black leading-none">
                {errorState.message}
              </h1>
              <p className="text-xl font-bold text-gray-400 leading-relaxed">
                {errorState.description}
              </p>
              <div className="pt-8">
                <button
                  onClick={() => navigate("/")}
                  className="px-10 py-4 rounded-full bg-accent text-white font-black text-lg hover:scale-105 hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  Create New Paste
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="py-8 w-full text-center opacity-30">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          Auto delete • copy.baby
        </div>
      </footer>
    </div>
  );
}
