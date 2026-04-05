import { Link } from "react-router-dom";

export function BrandHeader() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b-[3px] border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-black leading-none group-hover:text-accent transition-colors">
              copy.baby
            </h1>
            <div className="w-2.5 h-2.5 rounded-full bg-accent group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(153,0,255,0.6)]" />
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-[10px] sm:text-xs font-black text-accent px-3 py-1.5 rounded-full bg-accent/10 uppercase tracking-[0.2em] border-2 border-accent/20">
            Ephemeral
          </span>
        </div>
      </div>
    </header>
  );
}
