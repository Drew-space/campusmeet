// "use client";

// import Image from "next/image";
// import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
// import { useQuery } from "convex/react";
// import { Video, ShieldCheck, Globe2 } from "lucide-react";
// import { api } from "@/convex/_generated/api";
// import { useMatchmaking } from "@/hooks/use-matchmaking";
// import { WaitingScreen } from "@/components/waiting-screen";
// import { CallView } from "@/components/call-view";
// import { PendingMatchScreen } from "@/components/pending-match-screen";
// import { cn } from "@/lib/utils";

// const LOCATIONS = [
//   { label: "Alihame", value: "alihame" },
//   { label: "Owa-Oyibu ", value: "owa-oyibu" },
//   { label: "Owa-Alero", value: "owa-alero" },
// ];

// const FEATURES = [
//   { label: "Video calls", icon: Video },
//   { label: "Verified students", icon: ShieldCheck },
//   { label: "Global match", icon: Globe2 },
// ];

// export function Lobby() {
//   const { user } = useUser();
//   const onlineCount = useQuery(api.waitingPool.getOnlineCount) ?? 0;
//   const {
//     state,
//     streamCallId,
//     streamToken,
//     location,
//     setLocation,
//     pendingMatch,
//     waitingForOther,
//     startMatching,
//     acceptMatch,
//     declineMatch,
//     next,
//     stop,
//   } = useMatchmaking();

//   const username = user?.username ?? user?.fullName ?? "Student";

//   if (state === "waiting") {
//     return (
//       <WaitingScreen
//         location={location}
//         onlineCount={onlineCount}
//         onCancel={stop}
//       />
//     );
//   }

//   if (state === "preview" && pendingMatch) {
//     const isUserA = pendingMatch.userAId === user!.id;
//     const matchedName = isUserA
//       ? pendingMatch.userBName
//       : pendingMatch.userAName;
//     const matchedImageUrl = isUserA
//       ? pendingMatch.userBImageUrl
//       : pendingMatch.userAImageUrl;

//     return (
//       <PendingMatchScreen
//         myName={username}
//         myImageUrl={user?.imageUrl ?? undefined}
//         matchedName={matchedName}
//         matchedImageUrl={matchedImageUrl ?? undefined}
//         onAccept={acceptMatch}
//         onDecline={declineMatch}
//         waitingForOther={waitingForOther}
//       />
//     );
//   }

//   if (state === "matched" && streamCallId && streamToken) {
//     return (
//       <CallView
//         callId={streamCallId}
//         token={streamToken}
//         userId={user!.id}
//         username={username}
//         onNext={next}
//         onEnd={stop}
//       />
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-[#0F0E17] flex flex-col overflow-hidden">
//       {/* ambient gradient glow, matches the auth.png reference treatment */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-[#6C5CE7]/20 blur-[100px]" />
//         <div className="absolute top-1/3 -right-24 w-[320px] h-[320px] rounded-full bg-[#6C5CE7]/15 blur-[90px]" />
//       </div>

//       <nav className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
//         <span className="text-white font-medium text-[15px] tracking-tight">
//           campus<span className="text-[#6C5CE7]">link</span>
//         </span>
//         <div className="flex items-center gap-3">
//           <span className="text-xs text-white/40">
//             <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 mb-px" />
//             {onlineCount} online
//           </span>
//           {user ? (
//             <>
//               <span className="text-xs text-white/50 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1">
//                 {username}
//               </span>
//               <UserButton />
//             </>
//           ) : (
//             <SignInButton mode="modal" fallbackRedirectUrl="/">
//               <button className="text-xs text-white/50 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1 hover:bg-white/[0.08] transition-colors cursor-pointer">
//                 Sign in
//               </button>
//             </SignInButton>
//           )}
//         </div>
//       </nav>

//       <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 gap-8 py-8">
//         <div className="text-center space-y-3">
//           <h1 className="text-4xl font-medium text-white tracking-tight leading-tight">
//             Meet students
//             <br />
//             <span className="text-[#6C5CE7]">around the campus</span>
//           </h1>
//           <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
//             One tap connects you to student, around the campus. No profiles, no
//             swiping, just a conversation.
//           </p>
//         </div>

//         {/* hero illustration */}
//         <div className="relative w-[340px] h-[340px] flex items-center justify-center">
//           <div className="absolute inset-0 rounded-full bg-[#6C5CE7]/25 blur-[60px]" />
//           <Image
//             src="/auth.png"
//             alt="Two students on a CampusLink video call"
//             width={1000}
//             height={1000}
//             priority
//             className="relative z-10 object-contain drop-shadow-[0_8px_40px_rgba(108,92,231,0.35)]"
//           />
//         </div>

//         {/* feature pills */}
//         <div className="flex items-center gap-2">
//           {FEATURES.map(({ label, icon: Icon }) => (
//             <span
//               key={label}
//               className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60"
//             >
//               <Icon className="w-3.5 h-3.5 text-[#6C5CE7]" strokeWidth={2} />
//               {label}
//             </span>
//           ))}
//         </div>

//         <div className="w-full max-w-sm space-y-3">
//           <p className="text-[11px] text-white/30 uppercase tracking-widest">
//             Match with location
//           </p>
//           <div className="grid grid-cols-3 gap-2">
//             {LOCATIONS.map((loc) => (
//               <button
//                 key={loc.value}
//                 onClick={() => setLocation(loc.value)}
//                 className={cn(
//                   "rounded-xl py-2.5 px-2 text-xs border transition-all duration-150 text-center",
//                   location === loc.value
//                     ? "bg-[#6C5CE7]/15 border-[#6C5CE7]/50 text-[#6C5CE7]"
//                     : "bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.07] hover:text-white/80",
//                 )}
//               >
//                 {loc.label}
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={() => setLocation("all")}
//             className={cn(
//               "w-full rounded-xl py-2.5 text-xs border transition-all duration-150",
//               location === "all"
//                 ? "bg-[#6C5CE7]/15 border-[#6C5CE7]/50 text-[#6C5CE7]"
//                 : "bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.07] hover:text-white/80",
//             )}
//           >
//             🌍 &nbsp;Match with everyone
//           </button>
//         </div>

//         {user ? (
//           <button
//             onClick={startMatching}
//             className="w-full max-w-sm bg-[#6C5CE7] hover:bg-[#5b4cd6] active:scale-[0.98] text-white font-medium text-[15px] rounded-xl py-4 transition-all duration-150 tracking-tight"
//           >
//             Start matching
//           </button>
//         ) : (
//           <SignInButton mode="modal" fallbackRedirectUrl="/">
//             <button className="w-full max-w-sm bg-[#6C5CE7] hover:bg-[#5b4cd6] active:scale-[0.98] text-white font-medium text-[15px] rounded-xl py-4 transition-all duration-150 tracking-tight">
//               Start matching
//             </button>
//           </SignInButton>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Video, ShieldCheck, Globe2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useMatchmaking } from "@/hooks/use-matchmaking";
import { WaitingScreen } from "@/components/waiting-screen";
import { CallView } from "@/components/call-view";
import { PendingMatchScreen } from "@/components/pending-match-screen";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  { label: "Alihame", value: "alihame" },
  { label: "Owa-Oyibu ", value: "owa-oyibu" },
  { label: "Owa-Alero", value: "owa-alero" },
];

const FEATURES = [
  { label: "Video calls", icon: Video },
  { label: "Verified students", icon: ShieldCheck },
  { label: "Global match", icon: Globe2 },
];

export function Lobby() {
  const { user } = useUser();
  const onlineCount = useQuery(api.waitingPool.getOnlineCount) ?? 0;
  const {
    state,
    streamCallId,
    streamToken,
    location,
    setLocation,
    pendingMatch,
    waitingForOther,
    startMatching,
    acceptMatch,
    declineMatch,
    next,
    stop,
  } = useMatchmaking();

  const username = user?.username ?? user?.fullName ?? "Student";

  if (state === "waiting") {
    return (
      <WaitingScreen
        location={location}
        onlineCount={onlineCount}
        onCancel={stop}
      />
    );
  }

  if (state === "preview" && pendingMatch) {
    const isUserA = pendingMatch.userAId === user!.id;
    const matchedName = isUserA
      ? pendingMatch.userBName
      : pendingMatch.userAName;
    const matchedImageUrl = isUserA
      ? pendingMatch.userBImageUrl
      : pendingMatch.userAImageUrl;

    return (
      <PendingMatchScreen
        myName={username}
        myImageUrl={user?.imageUrl ?? undefined}
        matchedName={matchedName}
        matchedImageUrl={matchedImageUrl ?? undefined}
        onAccept={acceptMatch}
        onDecline={declineMatch}
        waitingForOther={waitingForOther}
      />
    );
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
    <div className="relative h-[100dvh] bg-[#0F0E17] flex flex-col overflow-hidden">
      {/* ambient gradient glow, matches the auth.png reference treatment */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-[#6C5CE7]/20 blur-[100px]" />
        <div className="absolute top-1/3 -right-24 w-[320px] h-[320px] rounded-full bg-[#6C5CE7]/15 blur-[90px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-5 py-3 sm:py-4 border-b border-white/[0.06] flex-shrink-0">
        <span className="text-white font-medium text-[15px] tracking-tight">
          campus<span className="text-[#6C5CE7]">link</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 mb-px" />
            {onlineCount} online
          </span>
          {user ? (
            <>
              <span className="text-xs text-white/50 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1">
                {username}
              </span>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <button className="text-xs text-white/50 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1 hover:bg-white/[0.08] transition-colors cursor-pointer">
                Sign in
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-6 gap-3 sm:gap-8 py-3 sm:py-8 overflow-y-auto">
        <div className="text-center space-y-1.5 sm:space-y-3">
          <h1 className="text-2xl sm:text-4xl font-medium text-white tracking-tight leading-tight">
            Meet students
            <br />
            <span className="text-[#6C5CE7]">around the campus</span>
          </h1>
          <p className="text-white/40 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
            One tap connects you to student, around the campus. No profiles, no
            swiping, just a conversation.
          </p>
        </div>

        {/* hero illustration */}
        <div className="relative w-[150px] h-[150px] sm:w-[340px] sm:h-[340px] flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-[#6C5CE7]/25 blur-[40px] sm:blur-[60px]" />
          <Image
            src="/auth.png"
            alt="Two students on a CampusLink video call"
            width={1000}
            height={1000}
            priority
            className="relative z-10 object-contain drop-shadow-[0_8px_40px_rgba(108,92,231,0.35)]"
          />
        </div>

        {/* feature pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
          {FEATURES.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-white/60"
            >
              <Icon className="w-3.5 h-3.5 text-[#6C5CE7]" strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>

        <div className="w-full max-w-sm space-y-2 sm:space-y-3">
          <p className="text-[10px] sm:text-[11px] text-white/30 uppercase tracking-widest">
            Match with location
          </p>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.value}
                onClick={() => setLocation(loc.value)}
                className={cn(
                  "rounded-xl py-2 sm:py-2.5 px-2 text-[11px] sm:text-xs border transition-all duration-150 text-center",
                  location === loc.value
                    ? "bg-[#6C5CE7]/15 border-[#6C5CE7]/50 text-[#6C5CE7]"
                    : "bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.07] hover:text-white/80",
                )}
              >
                {loc.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setLocation("all")}
            className={cn(
              "w-full rounded-xl py-2 sm:py-2.5 text-[11px] sm:text-xs border transition-all duration-150",
              location === "all"
                ? "bg-[#6C5CE7]/15 border-[#6C5CE7]/50 text-[#6C5CE7]"
                : "bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.07] hover:text-white/80",
            )}
          >
            🌍 &nbsp;Match with everyone
          </button>
        </div>

        {user ? (
          <button
            onClick={startMatching}
            className="w-full max-w-sm bg-[#6C5CE7] hover:bg-[#5b4cd6] active:scale-[0.98] text-white font-medium text-sm sm:text-[15px] rounded-xl py-3 sm:py-4 transition-all duration-150 tracking-tight flex-shrink-0"
          >
            Start matching
          </button>
        ) : (
          <SignInButton mode="modal" fallbackRedirectUrl="/">
            <button className="w-full max-w-sm bg-[#6C5CE7] hover:bg-[#5b4cd6] active:scale-[0.98] text-white font-medium text-sm sm:text-[15px] rounded-xl py-3 sm:py-4 transition-all duration-150 tracking-tight flex-shrink-0">
              Start matching
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}
