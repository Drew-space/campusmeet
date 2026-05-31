"use client";

interface WaitingScreenProps {
  location: string;
  onlineCount: number;
  onCancel: () => void;
}

export function WaitingScreen({ location, onlineCount, onCancel }: WaitingScreenProps) {
  const locationLabel =
    location === "all" ? "everyone" : location.charAt(0).toUpperCase() + location.slice(1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <nav className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <span className="text-white font-medium text-[15px] tracking-tight">
          campus<span className="text-[#4B7BF5]">link</span>
        </span>
        <span className="text-xs text-[#4B7BF5]/80 border border-[#4B7BF5]/30 bg-[#4B7BF5]/08 rounded-full px-3 py-1">
          searching…
        </span>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-[110px] h-[110px] rounded-full border border-[#4B7BF5]/08 animate-[ping_1.8s_ease-out_0.4s_infinite]" />
          <span className="absolute w-[90px] h-[90px] rounded-full border border-[#4B7BF5]/15 animate-[ping_1.8s_ease-out_infinite]" />
          <div className="w-[72px] h-[72px] rounded-full border-[1.5px] border-[#4B7BF5]/40 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#4B7BF5]" />
          </div>
        </div>

        <div className="text-center space-y-1.5">
          <p className="text-white font-medium text-base">Finding a match</p>
          <p className="text-white/35 text-sm">
            Looking for students in{" "}
            <span className="text-[#4B7BF5]/80">{locationLabel}</span>
          </p>
        </div>

        <div className="w-full max-w-xs bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-[11px] text-white/30 mb-2">online right now</p>
          <p className="text-3xl font-medium text-white">{onlineCount}</p>
          <p className="text-[11px] text-white/30 mt-1">students waiting</p>
        </div>

        <button
          onClick={onCancel}
          className="bg-white/[0.04] border border-white/10 rounded-xl px-6 py-2.5 text-sm text-white/50 hover:bg-white/[0.07] transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="flex border-t border-white/[0.06]">
        {["explore", "profile", "settings"].map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-[10px] tracking-wide transition-colors ${
              i === 0 ? "text-[#4B7BF5]" : "text-white/25"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
