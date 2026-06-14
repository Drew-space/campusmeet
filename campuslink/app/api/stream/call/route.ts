// import { StreamClient } from "@stream-io/node-sdk";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { callId, userAId, userBId } = await req.json();

//     const client = new StreamClient(
//       process.env.NEXT_PUBLIC_STREAM_API_KEY!,
//       process.env.STREAM_SECRET_KEY!,
//     );

//     const call = client.video.call("default", callId);

//     await call.getOrCreate({
//       data: {
//         created_by_id: userAId,
//         members: [{ user_id: userAId }, { user_id: userBId }],
//         settings_override: {
//           recording: { mode: "disabled" },
//         },
//       },
//     });

//     return NextResponse.json({ callId });
//   } catch (err) {
//     console.error("Stream call error:", err);
//     return NextResponse.json(
//       { error: "Failed to create call" },
//       { status: 500 },
//     );
//   }
// }

import { StreamClient } from "@stream-io/node-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { callId, userAId, userBId } = await req.json();

    const client = new StreamClient(
      process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      process.env.STREAM_SECRET_KEY!,
    );

    const call = client.video.call("default", callId);

    await call.getOrCreate({
      data: {
        created_by_id: userAId,
        members: [{ user_id: userAId }, { user_id: userBId }],
        settings_override: {
          recording: { mode: "disabled" },
          video: {
            camera_default_on: true,
            target_resolution: { width: 1280, height: 720 },
          },
          audio: {
            default_device: "speaker",
            noise_cancellation: { mode: "disabled" },
          },
        },
      },
    });

    return NextResponse.json({ callId });
  } catch (err) {
    console.error("Stream call error:", err);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 },
    );
  }
}
