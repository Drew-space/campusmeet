// "use client";

// import { useEffect, useState } from "react";
// import { Check, X } from "lucide-react";

// interface PendingMatchScreenProps {
//   matchedName: string;
//   matchedLocation: string;
//   onAccept: () => void;
//   onDecline: () => void;
//   waitingForOther: boolean; // true = you accepted, waiting for them
// }

// export function PendingMatchScreen({
//   matchedName,
//   matchedLocation,
//   onAccept,
//   onDecline,
//   waitingForOther,
// }: PendingMatchScreenProps) {
//   const [timeLeft, setTimeLeft] = useState(15);
//   const [accepted, setAccepted] = useState(false);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onDecline();
//       return;
//     }
//     const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timeLeft, onDecline]);

//   const handleAccept = () => {
//     setAccepted(true);
//     onAccept();
//   };

//   const initials = matchedName
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
//       <nav className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
//         <span className="text-white font-medium text-[15px] tracking-tight">
//           campus<span className="text-[#4B7BF5]">link</span>
//         </span>
//         <span className="text-xs text-[#4B7BF5]/80 border border-[#4B7BF5]/30 bg-[#4B7BF5]/08 rounded-full px-3 py-1">
//           match found
//         </span>
//       </nav>

//       <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
//         {/* Timer ring */}
//         <div className="relative flex items-center justify-center">
//           <svg
//             className="absolute"
//             width="100"
//             height="100"
//             viewBox="0 0 100 100"
//           >
//             <circle
//               cx="50"
//               cy="50"
//               r="45"
//               fill="none"
//               stroke="rgba(75,123,245,0.1)"
//               strokeWidth="3"
//             />
//             <circle
//               cx="50"
//               cy="50"
//               r="45"
//               fill="none"
//               stroke="#4B7BF5"
//               strokeWidth="3"
//               strokeDasharray={`${2 * Math.PI * 45}`}
//               strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / 15)}`}
//               strokeLinecap="round"
//               transform="rotate(-90 50 50)"
//               className="transition-all duration-1000"
//             />
//           </svg>
//           {/* Avatar */}
//           <div className="w-20 h-20 rounded-full bg-[#4B7BF5]/15 border-2 border-[#4B7BF5]/30 flex items-center justify-center">
//             <span className="text-2xl font-semibold text-[#4B7BF5]">
//               {initials}
//             </span>
//           </div>
//         </div>

//         <div className="text-center space-y-1.5">
//           <p className="text-white/40 text-sm">Match found!</p>
//           <p className="text-white text-2xl font-medium tracking-tight">
//             {matchedName}
//           </p>
//           <p className="text-white/35 text-sm">{matchedLocation}</p>
//         </div>

//         {waitingForOther ? (
//           <div className="text-center space-y-2">
//             <div className="flex items-center gap-2 text-emerald-400 text-sm">
//               <Check size={16} />
//               <span>You accepted — waiting for them…</span>
//             </div>
//             <p className="text-white/25 text-xs">
//               They have {timeLeft}s to respond
//             </p>
//           </div>
//         ) : (
//           <>
//             <p className="text-white/40 text-sm text-center">
//               Do you want to connect with this person?
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={onDecline}
//                 className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/25 transition-all active:scale-95"
//               >
//                 <X size={24} />
//               </button>
//               <button
//                 onClick={handleAccept}
//                 disabled={accepted}
//                 className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
//               >
//                 <Check size={24} />
//               </button>
//             </div>
//             <p className="text-white/20 text-xs">
//               Auto-declining in {timeLeft}s
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

interface PendingMatchScreenProps {
  myName: string;
  myImageUrl?: string;
  matchedName: string;
  matchedImageUrl?: string;
  onAccept: () => void;
  onDecline: () => void;
  waitingForOther: boolean;
}

function Avatar({
  name,
  imageUrl,
  size = 72,
}: {
  name: string;
  imageUrl?: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid rgba(75,123,245,0.4)",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(75,123,245,0.15)",
        border: "2px solid rgba(75,123,245,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.3,
        fontWeight: 600,
        color: "#4B7BF5",
      }}
    >
      {initials}
    </div>
  );
}

export function PendingMatchScreen({
  myName,
  myImageUrl,
  matchedName,
  matchedImageUrl,
  onAccept,
  onDecline,
  waitingForOther,
}: PendingMatchScreenProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onDecline]);

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
  };

  const circumference = 2 * Math.PI * 45;
  const progress = circumference * (1 - timeLeft / 15);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "0 16px",
      }}
    >
      <div
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "32px 24px",
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(75,123,245,0.1)",
              border: "1px solid rgba(75,123,245,0.25)",
              borderRadius: 999,
              padding: "4px 14px",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4B7BF5",
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#4B7BF5",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.08em",
              }}
            >
              MATCH FOUND
            </span>
          </div>
        </div>

        {/* Both avatars */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {/* Me */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Avatar name={myName} imageUrl={myImageUrl} size={72} />
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {myName}
              </p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                You
              </p>
            </div>
          </div>

          {/* VS divider with timer ring */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div style={{ position: "relative" }}>
              <svg width="48" height="48" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(75,123,245,0.1)"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#4B7BF5"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={progress}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#4B7BF5",
                }}
              >
                {timeLeft}
              </div>
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: 10,
                letterSpacing: "0.1em",
              }}
            >
              VS
            </span>
          </div>

          {/* Them */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Avatar name={matchedName} imageUrl={matchedImageUrl} size={72} />
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {matchedName}
              </p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                Student
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {waitingForOther ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                border: "2px solid rgba(75,123,245,0.3)",
                borderTopColor: "#4B7BF5",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              Waiting for {matchedName} to accept…
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, width: "100%" }}>
            <button
              onClick={onDecline}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 14,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "rgba(239,68,68,0.9)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.background =
                  "rgba(239,68,68,0.18)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.background =
                  "rgba(239,68,68,0.1)")
              }
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={accepted}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 14,
                background: accepted ? "rgba(75,123,245,0.5)" : "#4B7BF5",
                border: "none",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                cursor: accepted ? "default" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!accepted)
                  (e.target as HTMLElement).style.background = "#3a6ae0";
              }}
              onMouseLeave={(e) => {
                if (!accepted)
                  (e.target as HTMLElement).style.background = "#4B7BF5";
              }}
            >
              Accept
            </button>
          </div>
        )}

        <p
          style={{
            color: "rgba(255,255,255,0.15)",
            fontSize: 11,
            textAlign: "center",
          }}
        >
          Both must accept • auto-declining in {timeLeft}s
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
