import { StreamClient } from "@stream-io/node-sdk";

const client = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET_KEY!,
);

const callType = await client.video.getCallType({ name: "default" });
console.log(JSON.stringify(callType.grants, null, 2));
