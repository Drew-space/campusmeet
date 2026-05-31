"use client";

import { useEffect, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Mic, MicOff, Video, VideoOff, PhoneOff, SkipForward } from "lucide-react";

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
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { isMute: isMicMuted, microphone } = useMicrophoneState();
  const { isMute: isCamMuted, camera } = useCameraState();
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Navbar */}
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

      {/* Video area - centered, not full bleed */}
      <div className="flex-1 flex items-center justify-center bg-[#0e0e0e] p-4">
        <div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-2xl">
          <SpeakerLayout participantsBarPosition="bottom" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#0d0d0d] border-t border-white/[0.06] px-6 py-4 flex items-center justify-center gap-3">
        {/* Mic */}
        <button
          onClick={() => (isMicMuted ? microphone.enable() : microphone.disable())}
          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
            isMicMuted
              ? "bg-red-500/15 border-red-500/30 text-red-400"
              : "bg-white/[0.06] border-white/10 text-white/70 hover:bg-white/10"
          }`}
          aria-label="Toggle mic"
        >
          {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Camera */}
        <button
          onClick={() => (isCamMuted ? camera.enable() : camera.disable())}
          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
            isCamMuted
              ? "bg-red-500/15 border-red-500/30 text-red-400"
              : "bg-white/[0.06] border-white/10 text-white/70 hover:bg-white/10"
          }`}
          aria-label="Toggle camera"
        >
          {isCamMuted ? <VideoOff size={18} /> : <Video size={18} />}
        </button>

        {/* Next — fixed width, not full width */}
        <button
          onClick={onNext}
          className="bg-[#4B7BF5] hover:bg-[#3a6ae0] active:scale-[0.98] text-white font-medium text-sm rounded-xl px-8 py-3 flex items-center gap-2 transition-all flex-shrink-0"
        >
          <SkipForward size={16} />
          Next
        </button>

        {/* End call */}
        <button
          onClick={async () => {
            await call?.leave();
            onEnd();
          }}
          className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all flex-shrink-0"
          aria-label="End call"
        >
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
}

export function CallView({ callId, token, userId, username, onNext, onEnd }: CallViewProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<StreamVideoClient["call"]> | null>(null);

  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: userId,
        name: username,  // ← this makes Stream show the actual username
      },
      token,
    });

    const _call = _client.call("default", callId);
    _call.join({ create: true });

    setClient(_client);
    setCall(_call);

    return () => {
      _call.leave().catch(console.error);
      _client.disconnectUser().catch(console.error);
    };
  }, [callId, token, userId, username]);

  if (!client || !call) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/40 text-sm">Connecting…</div>
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
