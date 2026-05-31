"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { nanoid } from "nanoid";

export type MatchState = "idle" | "waiting" | "matched";

export function useMatchmaking() {
  const { user } = useUser();
  const [state, setState] = useState<MatchState>("idle");
  const [streamCallId, setStreamCallId] = useState<string | null>(null);
  const [streamToken, setStreamToken] = useState<string | null>(null);
  const [location, setLocation] = useState("all");
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const matchingRef = useRef(false);

  const joinPool = useMutation(api.waitingPool.join);
  const leavePool = useMutation(api.waitingPool.leave);
  const findMatch = useMutation(api.waitingPool.findMatch);
  const createSession = useMutation(api.sessions.create);
  const endSession = useMutation(api.sessions.end);

  // Reactively watch for a session — this is how User B gets notified
  const session = useQuery(
    api.sessions.getMySession,
    user ? { userId: user.id } : "skip"
  );

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    matchingRef.current = false;
  }, []);

  // Generate stream token via API route
  const fetchToken = useCallback(async (userId: string) => {
    const res = await fetch("/api/stream/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data.token as string;
  }, []);

  // Create stream call via API route
  const fetchCreateCall = useCallback(
    async (callId: string, userAId: string, userBId: string) => {
      await fetch("/api/stream/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, userAId, userBId }),
      });
    },
    []
  );

  // KEY FIX: User B reacts to session appearing in Convex
  useEffect(() => {
    if (!user || !session || state === "matched") return;

    const handleSession = async () => {
      stopPolling();
      const token = await fetchToken(user.id);
      setStreamToken(token);
      setStreamCallId(session.streamCallId);
      setState("matched");
    };

    handleSession();
  }, [session, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const startMatching = useCallback(async () => {
    if (!user || matchingRef.current) return;

    matchingRef.current = true;
    setState("waiting");

    const username = user.username ?? user.fullName ?? "Student";

    await joinPool({
      userId: user.id,
      clerkId: user.id,
      name: username,
      location,
    });

    pollRef.current = setInterval(async () => {
      if (!matchingRef.current) return;

      const match = await findMatch({ userId: user.id, location });
      if (!match) return;

      stopPolling();

      const callId = nanoid();

      await fetchCreateCall(callId, user.id, match.userId);
      await leavePool({ userId: user.id });
      await leavePool({ userId: match.userId });
      await createSession({
        userAId: user.id,
        userBId: match.userId,
        streamCallId: callId,
      });

      // User A transitions here; User B transitions via the useEffect above
      const token = await fetchToken(user.id);
      setStreamToken(token);
      setStreamCallId(callId);
      setState("matched");
    }, 2000);
  }, [user, location, joinPool, leavePool, findMatch, createSession, fetchToken, fetchCreateCall, stopPolling]);

  const next = useCallback(async () => {
    if (!user) return;
    stopPolling();
    if (session) await endSession({ sessionId: session._id });
    setStreamCallId(null);
    setStreamToken(null);
    setState("idle");
    setTimeout(() => startMatching(), 300);
  }, [user, session, endSession, stopPolling, startMatching]);

  const stop = useCallback(async () => {
    if (!user) return;
    stopPolling();
    if (session) await endSession({ sessionId: session._id });
    await leavePool({ userId: user.id });
    setStreamCallId(null);
    setStreamToken(null);
    setState("idle");
  }, [user, session, endSession, leavePool, stopPolling]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
    state,
    streamCallId,
    streamToken,
    location,
    setLocation,
    startMatching,
    next,
    stop,
  };
}
