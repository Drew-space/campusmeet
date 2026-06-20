import { StreamClient } from "@stream-io/node-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const client = new StreamClient(
      process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      process.env.STREAM_SECRET_KEY!,
    );

    const token = client.generateUserToken({ user_id: userId });

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Stream token error:", err);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 },
    );
  }
}

// import { StreamClient } from "@stream-io/node-sdk";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { userId, username } = await req.json();

//     if (!userId) {
//       return NextResponse.json({ error: "userId required" }, { status: 400 });
//     }

//     const client = new StreamClient(
//       process.env.NEXT_PUBLIC_STREAM_API_KEY!,
//       process.env.STREAM_SECRET_KEY!,
//     );

//     // Make sure this user actually exists in Stream with an explicit
//     // role before handing them a token. Without this, a brand new
//     // userId may not resolve to the "user" role's grants (send-video etc).
//     await client.upsertUsers([
//       {
//         id: userId,
//         name: username ?? userId,
//         role: "user",
//       },
//     ]);

//     const token = client.generateUserToken({ user_id: userId });

//     return NextResponse.json({ token });
//   } catch (err) {
//     console.error("Stream token error:", err);
//     return NextResponse.json(
//       { error: "Failed to generate token" },
//       { status: 500 },
//     );
//   }
// }
