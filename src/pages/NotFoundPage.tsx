import { useNavigate } from "react-router-dom";
import { BrandHeader } from "@/components/BrandHeader";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex flex-col bg-background selection:bg-accent selection:text-white">
      <BrandHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center space-y-10 animate-fade-in max-w-md">
          <h1 className="text-[7rem] sm:text-[10rem] font-black tracking-tighter text-black leading-none">
            404
          </h1>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-black">Whoops!</h2>
            <p className="text-xl font-bold text-gray-400 leading-relaxed">
              We couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </div>
          <div className="pt-8">
            <button
              onClick={() => navigate("/")}
              className="px-10 py-4 rounded-full bg-black text-white font-bold text-lg hover:scale-105 transition-transform shadow-xl active:scale-95"
            >
              Back to home
            </button>
          </div>
        </div>
      </main>

      <footer className="py-8 w-full text-center opacity-30">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          No history • copy.baby
        </div>
      </footer>
    </div>
  );
}
