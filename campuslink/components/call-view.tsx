// "use client";

// import { useEffect, useRef, useState } from "react";
// import {
//   StreamVideo,
//   StreamVideoClient,
//   StreamCall,
//   useCall,
//   useCallStateHooks,
//   ParticipantView,
// } from "@stream-io/video-react-sdk";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   PhoneOff,
//   SkipForward,
// } from "lucide-react";

// interface CallViewProps {
//   callId: string;
//   token: string;
//   userId: string;
//   username: string;
//   onNext: () => void;
//   onEnd: () => void;
// }

// function CallUI({ onNext, onEnd }: { onNext: () => void; onEnd: () => void }) {
//   const call = useCall();
//   const {
//     useMicrophoneState,
//     useCameraState,
//     useLocalParticipant,
//     useRemoteParticipants,
//   } = useCallStateHooks();
//   const { isMute: isMicMuted, microphone } = useMicrophoneState();
//   const { isMute: isCamMuted, camera } = useCameraState();
//   const localParticipant = useLocalParticipant();
//   const remoteParticipants = useRemoteParticipants();
//   const remoteParticipant = remoteParticipants[0];
//   const [secs, setSecs] = useState(0);

//   useEffect(() => {
//     const t = setInterval(() => setSecs((s) => s + 1), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const fmt = (s: number) =>
//     `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
//       {/* Navbar */}
//       <nav className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
//         <span className="text-white font-medium text-[15px] tracking-tight">
//           campus<span className="text-[#4B7BF5]">link</span>
//         </span>
//         <div className="flex items-center gap-2">
//           <span className="text-xs text-white/30">{fmt(secs)}</span>
//           <span className="text-xs text-emerald-400/80 border border-emerald-400/30 bg-emerald-400/[0.06] rounded-full px-3 py-1">
//             ● live
//           </span>
//         </div>
//       </nav>

//       {/* Video area - FaceTime style */}
//       <div className="flex-1 relative bg-[#0e0e0e] overflow-hidden">
//         {/* Remote participant — full screen */}
//         <div className="absolute inset-0">
//           {remoteParticipant ? (
//             <ParticipantView
//               participant={remoteParticipant}
//               className="w-full h-full"
//             />
//           ) : (
//             <div className="w-full h-full flex flex-col items-center justify-center gap-3">
//               <div className="w-16 h-16 rounded-full bg-[#4B7BF5]/15 border border-[#4B7BF5]/30 flex items-center justify-center text-2xl font-medium text-[#4B7BF5]">
//                 ?
//               </div>
//               <p className="text-white/30 text-sm">
//                 Waiting for the other person…
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Remote name label */}
//         {remoteParticipant && (
//           <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
//             <p className="text-white text-xs font-medium">
//               {remoteParticipant.name || remoteParticipant.userId}
//             </p>
//           </div>
//         )}

//         {/* Local participant — PiP corner box */}
//         {localParticipant && (
//           <div className="absolute top-4 right-4 w-28 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#1a1a1a]">
//             <ParticipantView
//               participant={localParticipant}
//               className="w-full h-full"
//             />
//             {/* "You" label */}
//             <div className="absolute bottom-1.5 left-0 right-0 flex justify-center">
//               <span className="text-[10px] text-white/60 bg-black/40 rounded px-1.5 py-0.5">
//                 You
//               </span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Controls */}
//       <div className="bg-[#0d0d0d] border-t border-white/[0.06] px-6 py-4 flex items-center justify-center gap-3">
//         <button
//           onClick={() =>
//             isMicMuted ? microphone.enable() : microphone.disable()
//           }
//           className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
//             isMicMuted
//               ? "bg-red-500/15 border-red-500/30 text-red-400"
//               : "bg-white/[0.06] border-white/10 text-white/70 hover:bg-white/10"
//           }`}
//           aria-label="Toggle mic"
//         >
//           {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
//         </button>

//         <button
//           onClick={() => (isCamMuted ? camera.enable() : camera.disable())}
//           className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
//             isCamMuted
//               ? "bg-red-500/15 border-red-500/30 text-red-400"
//               : "bg-white/[0.06] border-white/10 text-white/70 hover:bg-white/10"
//           }`}
//           aria-label="Toggle camera"
//         >
//           {isCamMuted ? <VideoOff size={18} /> : <Video size={18} />}
//         </button>

//         <button
//           onClick={onNext}
//           className="bg-[#4B7BF5] hover:bg-[#3a6ae0] active:scale-[0.98] text-white font-medium text-sm rounded-xl px-8 py-3 flex items-center gap-2 transition-all flex-shrink-0"
//         >
//           <SkipForward size={16} />
//           Next
//         </button>

//         <button
//           onClick={async () => {
//             await call?.leave();
//             onEnd();
//           }}
//           className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all flex-shrink-0"
//           aria-label="End call"
//         >
//           <PhoneOff size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export function CallView({
//   callId,
//   token,
//   userId,
//   username,
//   onNext,
//   onEnd,
// }: CallViewProps) {
//   const [client, setClient] = useState<StreamVideoClient | null>(null);
//   const [call, setCall] = useState<ReturnType<
//     StreamVideoClient["call"]
//   > | null>(null);
//   const leftRef = useRef(false); // prevent double-leave in dev strict mode

//   useEffect(() => {
//     leftRef.current = false;

//     const _client = new StreamVideoClient({
//       apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
//       user: { id: userId, name: username },
//       token,
//     });

//     const _call = _client.call("default", callId);
//     _call.join({ create: true });

//     setClient(_client);
//     setCall(_call);

//     return () => {
//       if (!leftRef.current) {
//         leftRef.current = true;
//         _call.leave().catch(() => {});
//         _client.disconnectUser().catch(() => {});
//       }
//     };
//   }, [callId, token, userId, username]);

//   if (!client || !call) {
//     return (
//       <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
//         <div className="text-white/40 text-sm">Connecting…</div>
//       </div>
//     );
//   }

//   return (
//     <StreamVideo client={client}>
//       <StreamCall call={call}>
//         <CallUI onNext={onNext} onEnd={onEnd} />
//       </StreamCall>
//     </StreamVideo>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  useCall,
  useCallStateHooks,
  ParticipantView,
} from "@stream-io/video-react-sdk";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  SkipForward,
} from "lucide-react";

interface CallViewProps {
  callId: string;
  token: string;
  userId: string;
  username: string;
  onNext: () => void;
  onEnd: () => void;
}

function CallUI({ onNext, onEnd }: { onNext: () => void; onEnd: () => void }) {
  const call = useCall();
  const {
    useMicrophoneState,
    useCameraState,
    useLocalParticipant,
    useRemoteParticipants,
  } = useCallStateHooks();
  const { isMute: isMicMuted, microphone } = useMicrophoneState();
  const { isMute: isCamMuted, camera } = useCameraState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const remoteParticipant = remoteParticipants[0];
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <nav className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
        <span className="text-white font-medium text-[15px] tracking-tight">
          campus<span className="text-[#4B7BF5]">link</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30">{fmt(secs)}</span>
          <span className="text-xs text-emerald-400/80 border border-emerald-400/30 bg-emerald-400/[0.06] rounded-full px-3 py-1">
            ● live
          </span>
        </div>
      </nav>

      <div className="flex-1 relative bg-[#0e0e0e] overflow-hidden">
        {/* Remote — full screen */}
        <div className="absolute inset-0">
          {remoteParticipant ? (
            <ParticipantView
              participant={remoteParticipant}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#4B7BF5]/15 border border-[#4B7BF5]/30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#4B7BF5] animate-pulse" />
              </div>
              <p className="text-white/30 text-sm">
                Waiting for the other person…
              </p>
            </div>
          )}
        </div>

        {/* Remote name */}
        {remoteParticipant && (
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <p className="text-white text-xs font-medium">
              {remoteParticipant.name || remoteParticipant.userId}
            </p>
          </div>
        )}

        {/* Local PiP */}
        {localParticipant && (
          <div className="absolute top-4 right-4 w-28 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#1a1a1a]">
            <ParticipantView
              participant={localParticipant}
              className="w-full h-full"
            />
            <div className="absolute bottom-1.5 left-0 right-0 flex justify-center">
              <span className="text-[10px] text-white/60 bg-black/40 rounded px-1.5 py-0.5">
                You
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-[#0d0d0d] border-t border-white/[0.06] px-6 py-4 flex items-center justify-center gap-3">
        <button
          onClick={() =>
            isMicMuted ? microphone.enable() : microphone.disable()
          }
          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
            isMicMuted
              ? "bg-red-500/15 border-red-500/30 text-red-400"
              : "bg-white/[0.06] border-white/10 text-white/70 hover:bg-white/10"
          }`}
        >
          {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <button
          onClick={() => (isCamMuted ? camera.enable() : camera.disable())}
          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
            isCamMuted
              ? "bg-red-500/15 border-red-500/30 text-red-400"
              : "bg-white/[0.06] border-white/10 text-white/70 hover:bg-white/10"
          }`}
        >
          {isCamMuted ? <VideoOff size={18} /> : <Video size={18} />}
        </button>

        <button
          onClick={onNext}
          className="bg-[#4B7BF5] hover:bg-[#3a6ae0] active:scale-[0.98] text-white font-medium text-sm rounded-xl px-8 py-3 flex items-center gap-2 transition-all flex-shrink-0"
        >
          <SkipForward size={16} />
          Next
        </button>

        <button
          onClick={async () => {
            await call?.leave();
            onEnd();
          }}
          className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all flex-shrink-0"
        >
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
}

export function CallView({
  callId,
  token,
  userId,
  username,
  onNext,
  onEnd,
}: CallViewProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<
    StreamVideoClient["call"]
  > | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const callRef = useRef<ReturnType<StreamVideoClient["call"]> | null>(null);
  const leftRef = useRef(false);

  useEffect(() => {
    leftRef.current = false;

    // const setup = async () => {
    //   const _client = new StreamVideoClient({
    //     apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    //     user: { id: userId, name: username },
    //     token,
    //   });

    //   const _call = _client.call("default", callId);
    //   clientRef.current = _client;
    //   callRef.current = _call;

    //   try {
    //     await _call.camera.enable();
    //     await _call.microphone.enable();
    //   } catch {
    //     // permissions might be denied — join anyway
    //   }

    //   await _call.join({ create: true });

    //   setClient(_client);
    //   setCall(_call);
    // };
    const setup = async () => {
      const _client = new StreamVideoClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
        user: { id: userId, name: username },
        token,
      });

      // Connect user first before doing anything else
      await _client.connectUser({ id: userId, name: username }, token);

      const _call = _client.call("default", callId);
      clientRef.current = _client;
      callRef.current = _call;

      // Join the call
      await _call.join({ create: true });

      try {
        await _call.camera.enable();
      } catch {
        console.log("Camera not available");
      }

      try {
        await _call.microphone.enable();
      } catch {
        console.log("Mic not available");
      }

      // Enable camera and mic AFTER joining
      // try {
      //   await _call.camera.enable();
      //   await _call.microphone.enable();
      // } catch {
      //   // permissions denied — call still works
      // }

      setClient(_client);
      setCall(_call);
    };
    setup().catch(console.error);

    return () => {
      if (!leftRef.current) {
        leftRef.current = true;
        callRef.current?.leave().catch(() => {});
        clientRef.current?.disconnectUser().catch(() => {});
      }
    };
  }, [callId, token, userId, username]);

  if (!client || !call) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#4B7BF5] animate-pulse" />
        <p className="text-white/40 text-sm">Connecting…</p>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI onNext={onNext} onEnd={onEnd} />
      </StreamCall>
    </StreamVideo>
  );
}
