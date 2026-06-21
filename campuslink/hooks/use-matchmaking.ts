// "use client";

// import { useUser } from "@clerk/nextjs";
// import { useMutation, useQuery } from "convex/react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { api } from "@/convex/_generated/api";
// import { nanoid } from "nanoid";

// export type MatchState = "idle" | "waiting" | "preview" | "matched";

// export function useMatchmaking() {
//   const { user } = useUser();
//   const [state, setState] = useState<MatchState>("idle");
//   const [streamCallId, setStreamCallId] = useState<string | null>(null);
//   const [streamToken, setStreamToken] = useState<string | null>(null);
//   const [location, setLocation] = useState("all");
//   const [waitingForOther, setWaitingForOther] = useState(false);
//   const pollRef = useRef<NodeJS.Timeout | null>(null);
//   const matchingRef = useRef(false);

//   const joinPool = useMutation(api.waitingPool.join);
//   const leavePool = useMutation(api.waitingPool.leave);
//   const findMatch = useMutation(api.waitingPool.findMatch);
//   const createSession = useMutation(api.sessions.create);
//   const endSession = useMutation(api.sessions.end);
//   const createPendingMatch = useMutation(api.pendingMatches.create);
//   const respondToMatch = useMutation(api.pendingMatches.respond);
//   const cleanupMatch = useMutation(api.pendingMatches.cleanup);
//   const clearOnMount = useMutation(api.sessions.clearOnMount);

//   const session = useQuery(
//     api.sessions.getMySession,
//     user ? { userId: user.id } : "skip",
//   );

//   const pendingMatch = useQuery(
//     api.pendingMatches.getMyPendingMatch,
//     user ? { userId: user.id } : "skip",
//   );

//   const stopPolling = useCallback(() => {
//     if (pollRef.current) {
//       clearInterval(pollRef.current);
//       pollRef.current = null;
//     }
//     matchingRef.current = false;
//   }, []);

//   const fetchToken = useCallback(async (userId: string) => {
//     const res = await fetch("/api/stream/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId }),
//     });
//     const data = await res.json();
//     return data.token as string;
//   }, []);

//   const fetchCreateCall = useCallback(
//     async (callId: string, userAId: string, userBId: string) => {
//       await fetch("/api/stream/call", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ callId, userAId, userBId }),
//       });
//     },
//     [],
//   );

//   // startPolling via ref to avoid stale closure / compiler warnings
//   const startPollingRef = useRef<() => void>(() => {});

//   startPollingRef.current = () => {
//     if (!user) return;
//     pollRef.current = setInterval(async () => {
//       if (!matchingRef.current) return;
//       const match = await findMatch({ userId: user.id, location });
//       if (!match) return;

//       stopPolling();

//       const callId = nanoid();
//       const username = user.username ?? user.fullName ?? "Student";
//       const matchName = match.name;

//       await fetchCreateCall(callId, user.id, match.userId);
//       await leavePool({ userId: user.id });
//       await leavePool({ userId: match.userId });
//       // await createPendingMatch({
//       //   userAId: user.id,
//       //   userAName: username,
//       //   userBId: match.userId,
//       //   userBName: matchName,
//       //   streamCallId: callId,
//       // });
//       const matchImageUrl = match.imageUrl ?? undefined;
//       await createPendingMatch({
//         userAId: user.id,
//         userAName: username,
//         userAImageUrl: user.imageUrl ?? undefined,
//         userBId: match.userId,
//         userBName: matchName,
//         userBImageUrl: matchImageUrl,
//         streamCallId: callId,
//       });
//     }, 2000);
//   };

//   const startPolling = useCallback(() => {
//     startPollingRef.current();
//   }, []);

//   // On mount — clear any stale sessions/matches from previous visits
//   useEffect(() => {
//     if (!user) return;
//     clearOnMount({ userId: user.id });
//   }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

//   // Watch for pending match → show preview screen (only if actively searching)
//   useEffect(() => {
//     if (
//       !pendingMatch ||
//       state === "matched" ||
//       state === "preview" ||
//       state === "idle"
//     )
//       return;
//     if (pendingMatch.status === "pending") {
//       stopPolling();
//       setState("preview");
//     }
//   }, [pendingMatch, state, stopPolling]);

//   // Watch for accepted/declined status changes (only if not idle)
//   useEffect(() => {
//     if (!pendingMatch || !user) return;

//     if (
//       pendingMatch.status === "accepted" &&
//       state !== "matched" &&
//       state !== "idle"
//     ) {
//       const startCall = async () => {
//         await createSession({
//           userAId: pendingMatch.userAId,
//           userBId: pendingMatch.userBId,
//           streamCallId: pendingMatch.streamCallId,
//         });
//         const token = await fetchToken(user.id);
//         setStreamToken(token);
//         setStreamCallId(pendingMatch.streamCallId);
//         setWaitingForOther(false);
//         setState("matched");
//       };
//       startCall();
//     }

//     if (pendingMatch.status === "declined" && state === "preview") {
//       setWaitingForOther(false);
//       setState("waiting");
//       matchingRef.current = true;
//       startPollingRef.current();
//     }
//   }, [pendingMatch?.status, pendingMatch?.streamCallId]); // eslint-disable-line react-hooks/exhaustive-deps

//   // User B: session appears → matched (only if actively waiting, not on refresh)
//   useEffect(() => {
//     if (!user || !session || state === "matched") return;
//     if (state === "idle") return; // don't auto-join on page refresh
//     const handleSession = async () => {
//       stopPolling();
//       const token = await fetchToken(user.id);
//       setStreamToken(token);
//       setStreamCallId(session.streamCallId);
//       setState("matched");
//     };
//     handleSession();
//   }, [session, user]); // eslint-disable-line react-hooks/exhaustive-deps

//   const startMatching = useCallback(async () => {
//     if (!user || matchingRef.current) return;
//     matchingRef.current = true;
//     setState("waiting");
//     setWaitingForOther(false);

//     const username = user.username ?? user.fullName ?? "Student";
//     await joinPool({
//       userId: user.id,
//       clerkId: user.id,
//       name: username,
//       location,
//     });

//     startPolling();
//   }, [user, location, joinPool, startPolling]);

//   const acceptMatch = useCallback(async () => {
//     if (!user || !pendingMatch) return;
//     setWaitingForOther(true);
//     await respondToMatch({
//       matchId: pendingMatch._id,
//       userId: user.id,
//       accepted: true,
//     });
//   }, [user, pendingMatch, respondToMatch]);

//   const declineMatch = useCallback(async () => {
//     if (!user || !pendingMatch) return;
//     await respondToMatch({
//       matchId: pendingMatch._id,
//       userId: user.id,
//       accepted: false,
//     });
//     setWaitingForOther(false);
//     setState("waiting");
//     matchingRef.current = true;

//     const username = user.username ?? user.fullName ?? "Student";
//     await joinPool({
//       userId: user.id,
//       clerkId: user.id,
//       name: username,
//       location,
//     });
//     startPolling();
//   }, [user, pendingMatch, respondToMatch, joinPool, location, startPolling]);

//   const next = useCallback(async () => {
//     if (!user) return;
//     stopPolling();
//     if (session) await endSession({ sessionId: session._id });
//     setStreamCallId(null);
//     setStreamToken(null);
//     setWaitingForOther(false);
//     setState("idle");
//     setTimeout(() => startMatching(), 300);
//   }, [user, session, endSession, stopPolling, startMatching]);

//   const stop = useCallback(async () => {
//     if (!user) return;
//     stopPolling();
//     if (session) await endSession({ sessionId: session._id });
//     if (pendingMatch && pendingMatch.status === "pending") {
//       await cleanupMatch({ matchId: pendingMatch._id });
//     }
//     await leavePool({ userId: user.id });
//     setStreamCallId(null);
//     setStreamToken(null);
//     setWaitingForOther(false);
//     setState("idle");
//   }, [
//     user,
//     session,
//     pendingMatch,
//     endSession,
//     leavePool,
//     cleanupMatch,
//     stopPolling,
//   ]);

//   useEffect(() => {
//     return () => stopPolling();
//   }, [stopPolling]);

//   return {
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
//   };
// }

"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { nanoid } from "nanoid";

export type MatchState = "idle" | "waiting" | "preview" | "matched";

export function useMatchmaking() {
  const { user } = useUser();
  const [state, setState] = useState<MatchState>("idle");
  const [streamCallId, setStreamCallId] = useState<string | null>(null);
  const [streamToken, setStreamToken] = useState<string | null>(null);
  const [location, setLocation] = useState("all");
  const [waitingForOther, setWaitingForOther] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const matchingRef = useRef(false);

  // Always-current mirror of `state`, so effects keyed on Convex data
  // (which updates independently of React state) never read a stale
  // value from a closure captured on a previous render.
  const stateRef = useRef<MatchState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const joinPool = useMutation(api.waitingPool.join);
  const leavePool = useMutation(api.waitingPool.leave);
  const findMatch = useMutation(api.waitingPool.findMatch);
  const createSession = useMutation(api.sessions.create);
  const endSession = useMutation(api.sessions.end);
  const createPendingMatch = useMutation(api.pendingMatches.create);
  const respondToMatch = useMutation(api.pendingMatches.respond);
  const cleanupMatch = useMutation(api.pendingMatches.cleanup);
  const clearOnMount = useMutation(api.sessions.clearOnMount);

  const session = useQuery(
    api.sessions.getMySession,
    user ? { userId: user.id } : "skip",
  );

  const pendingMatch = useQuery(
    api.pendingMatches.getMyPendingMatch,
    user ? { userId: user.id } : "skip",
  );

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    matchingRef.current = false;
  }, []);

  const fetchToken = useCallback(async (userId: string) => {
    const res = await fetch("/api/stream/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data.token as string;
  }, []);

  const fetchCreateCall = useCallback(
    async (callId: string, userAId: string, userBId: string) => {
      await fetch("/api/stream/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, userAId, userBId }),
      });
    },
    [],
  );

  // startPolling via ref to avoid stale closure / compiler warnings
  const startPollingRef = useRef<() => void>(() => {});

  startPollingRef.current = () => {
    if (!user) return;
    pollRef.current = setInterval(async () => {
      if (!matchingRef.current) return;
      const match = await findMatch({ userId: user.id, location });
      if (!match) return;

      stopPolling();

      const callId = nanoid();
      const username = user.username ?? user.fullName ?? "Student";
      const matchName = match.name;

      await fetchCreateCall(callId, user.id, match.userId);
      await leavePool({ userId: user.id });
      await leavePool({ userId: match.userId });

      const matchImageUrl = match.imageUrl ?? undefined;
      await createPendingMatch({
        userAId: user.id,
        userAName: username,
        userAImageUrl: user.imageUrl ?? undefined,
        userBId: match.userId,
        userBName: matchName,
        userBImageUrl: matchImageUrl,
        streamCallId: callId,
      });
    }, 2000);
  };

  const startPolling = useCallback(() => {
    startPollingRef.current();
  }, []);

  // On mount — clear any stale sessions/matches from previous visits
  useEffect(() => {
    if (!user) return;
    clearOnMount({ userId: user.id });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Watch for pending match → show preview screen.
  // Fires whenever a NEW pending match appears for this user while they
  // are actively in the matchmaking flow (waiting, or already mid-flow).
  // We intentionally allow this to fire from "waiting" — that's the
  // normal case when someone else's "Next" matches us while we're
  // sitting in the pool. We only skip it from "idle" (just landed /
  // refreshed and never pressed Start matching) to avoid auto-joining
  // a leftover match record from a previous session.
  useEffect(() => {
    if (!pendingMatch) return;
    const current = stateRef.current;
    if (current === "matched" || current === "preview" || current === "idle") {
      return;
    }
    if (pendingMatch.status === "pending") {
      stopPolling();
      setState("preview");
    }
    // pendingMatch is a Convex live query result — re-run this effect
    // every time ITS fields change, not just when local state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMatch?._id, pendingMatch?.status, stopPolling]);

  // Watch for accepted/declined status changes.
  // Reads stateRef.current instead of the `state` captured in this
  // effect's closure, so a status change arriving from Convex always
  // sees the truly-current local state, not a stale snapshot.
  useEffect(() => {
    if (!pendingMatch || !user) return;
    const current = stateRef.current;

    if (
      pendingMatch.status === "accepted" &&
      current !== "matched" &&
      current !== "idle"
    ) {
      const startCall = async () => {
        await createSession({
          userAId: pendingMatch.userAId,
          userBId: pendingMatch.userBId,
          streamCallId: pendingMatch.streamCallId,
        });
        const token = await fetchToken(user.id);
        setStreamToken(token);
        setStreamCallId(pendingMatch.streamCallId);
        setWaitingForOther(false);
        setState("matched");
      };
      startCall();
    }

    if (pendingMatch.status === "declined" && current === "preview") {
      setWaitingForOther(false);
      setState("waiting");
      matchingRef.current = true;
      startPollingRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMatch?.status, pendingMatch?.streamCallId]);

  // Session ends (other side left/ended the call) → bring this user
  // back to a safe matching state instead of leaving them stuck on a
  // "connecting" / stale call screen.
  // session goes from a real object -> null/undefined when the other
  // side calls endSession(). We watch specifically for that transition.
  const hadSessionRef = useRef(false);
  useEffect(() => {
    if (session) {
      hadSessionRef.current = true;
      return;
    }
    // session is now falsy. Only react if we previously HAD one and
    // we're currently sitting in "matched" — i.e. the call we were on
    // just ended from the other side (or our own endSession landed).
    if (hadSessionRef.current && stateRef.current === "matched") {
      hadSessionRef.current = false;
      setStreamCallId(null);
      setStreamToken(null);
      setWaitingForOther(false);
      setState("idle");
    }
  }, [session]);

  // User B: session appears → matched (only if actively waiting, not on refresh)
  useEffect(() => {
    if (!user || !session) return;
    const current = stateRef.current;
    if (current === "matched") return;
    if (current === "idle") return; // don't auto-join on page refresh
    const handleSession = async () => {
      stopPolling();
      const token = await fetchToken(user.id);
      setStreamToken(token);
      setStreamCallId(session.streamCallId);
      setState("matched");
    };
    handleSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, user]);

  const startMatching = useCallback(async () => {
    if (!user || matchingRef.current) return;
    matchingRef.current = true;
    setState("waiting");
    setWaitingForOther(false);

    const username = user.username ?? user.fullName ?? "Student";
    await joinPool({
      userId: user.id,
      clerkId: user.id,
      name: username,
      location,
    });

    startPolling();
  }, [user, location, joinPool, startPolling]);

  const acceptMatch = useCallback(async () => {
    if (!user || !pendingMatch) return;
    setWaitingForOther(true);
    await respondToMatch({
      matchId: pendingMatch._id,
      userId: user.id,
      accepted: true,
    });
  }, [user, pendingMatch, respondToMatch]);

  const declineMatch = useCallback(async () => {
    if (!user || !pendingMatch) return;
    await respondToMatch({
      matchId: pendingMatch._id,
      userId: user.id,
      accepted: false,
    });
    setWaitingForOther(false);
    setState("waiting");
    matchingRef.current = true;

    const username = user.username ?? user.fullName ?? "Student";
    await joinPool({
      userId: user.id,
      clerkId: user.id,
      name: username,
      location,
    });
    startPolling();
  }, [user, pendingMatch, respondToMatch, joinPool, location, startPolling]);

  const next = useCallback(async () => {
    if (!user) return;
    stopPolling();
    if (session) await endSession({ sessionId: session._id });
    setStreamCallId(null);
    setStreamToken(null);
    setWaitingForOther(false);
    setState("idle");
    setTimeout(() => startMatching(), 300);
  }, [user, session, endSession, stopPolling, startMatching]);

  const stop = useCallback(async () => {
    if (!user) return;
    stopPolling();
    if (session) await endSession({ sessionId: session._id });
    if (pendingMatch && pendingMatch.status === "pending") {
      await cleanupMatch({ matchId: pendingMatch._id });
    }
    await leavePool({ userId: user.id });
    setStreamCallId(null);
    setStreamToken(null);
    setWaitingForOther(false);
    setState("idle");
  }, [
    user,
    session,
    pendingMatch,
    endSession,
    leavePool,
    cleanupMatch,
    stopPolling,
  ]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
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
  };
}
