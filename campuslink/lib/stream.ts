"use server";

import { StreamClient } from "@stream-io/node-sdk";

const streamClient = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET_KEY!
);

export async function generateStreamToken(userId: string) {
  const token = streamClient.generateUserToken({ user_id: userId });
  return token;
}

export async function createStreamCall(
  callId: string,
  userAId: string,
  userBId: string
) {
  const call = streamClient.video.call("default", callId);

  await call.getOrCreate({
    data: {
      created_by_id: userAId,
      members: [{ user_id: userAId }, { user_id: userBId }],
      settings_override: {
        recording: { mode: "disabled" },
      },
    },
  });

  return callId;
}

export async function endStreamCall(callId: string) {
  const call = streamClient.video.call("default", callId);
  await call.end();
}
