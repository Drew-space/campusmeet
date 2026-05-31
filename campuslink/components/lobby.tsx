"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMatchmaking } from "@/hooks/use-matchmaking";
import { WaitingScreen } from "@/components/waiting-screen";
import { CallView } from "@/components/call-view";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  { label: "🇳🇬 Nigeria", value: "nigeria" },
  { label: "🇬🇧 UK", value: "uk" },
  { label: "🇺🇸 USA", value: "usa" },
  { label: "🇨🇦 Canada", value: "canada" },
  { label: "🇩🇪 Germany", value: "germany" },
  { label: "🇦🇺 Australia", value: "australia" },
];

export function Lobby() {
  const { user } = useUser();
  const onlineCount = useQuery(api.waitingPool.getOnlineCount) ?? 0;
  const { state, streamCallId, streamToken, location, setLocation, startMatching, next, stop } =
    useMatchmaking();

  const username = user?.username ?? user?.fullName ?? "Student";

  if (state === "waiting") {
    return <WaitingScreen location={location} onlineCount={onlineCount} onCancel={stop} />;
  }

  if (state === "matched" && streamCallId && streamToken) {
    return (
      <CallView
        callId={streamCallId}
        token={streamToken}
        userId={user!.id}
        username={username}
        onNext={next}
        onEnd={stop}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <nav className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <span className="text-white font-medium text-[15px] tracking-tight">
          campus<span className="text-[#4B7BF5]">link</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 mb-px" />
            {onlineCount} online
          </span>
          <span className="text-xs text-white/50 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1">
            {username}
          </span>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-medium text-white tracking-tight leading-tight">
            Meet students<br />
            <span className="text-[#4B7BF5]">around the world</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
            Random 1-on-1 video calls with verified students only.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <p className="text-[11px] text-white/30 uppercase tracking-widest">
            Match with location
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.value}
                onClick={() => setLocation(loc.value)}
                className={cn(
                  "rounded-xl py-2.5 px-2 text-xs border transition-all duration-150 text-center",
                  location === loc.value
                    ? "bg-[#4B7BF5]/15 border-[#4B7BF5]/50 text-[#4B7BF5]"
                    : "bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.07] hover:text-white/80"
                )}
              >
                {loc.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setLocation("all")}
            className={cn(
              "w-full rounded-xl py-2.5 text-xs border transition-all duration-150",
              location === "all"
                ? "bg-[#4B7BF5]/15 border-[#4B7BF5]/50 text-[#4B7BF5]"
                : "bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.07] hover:text-white/80"
            )}
          >
            🌍 &nbsp;Match with everyone
          </button>
        </div>

        <button
          onClick={startMatching}
          className="w-full max-w-sm bg-[#4B7BF5] hover:bg-[#3a6ae0] active:scale-[0.98] text-white font-medium text-[15px] rounded-xl py-4 transition-all duration-150 tracking-tight"
        >
          Start matching
        </button>
      </div>

      <div className="flex border-t border-white/[0.06]">
        {["explore", "profile", "settings"].map((tab, i) => (
          <button
            key={tab}
            className={cn(
              "flex-1 py-3 text-[10px] tracking-wide transition-colors",
              i === 0 ? "text-[#4B7BF5]" : "text-white/25"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
