# CampusLink

Random 1-on-1 video calls for students. Built with Next.js, Convex, Clerk, and Stream Video.

## Stack

- **Next.js 15** App Router + TypeScript + Tailwind CSS
- **Clerk** — auth (sign in / sign up)
- **Convex** — matchmaking queue + session state (real-time)
- **Stream Video** — WebRTC video calls

## Setup

### 1. Install deps
```bash
bun install
```

### 2. Clerk
1. Create a project at clerk.com
2. Copy publishable + secret keys into .env.local

### 3. Convex
```bash
bunx convex dev
```
Logs you in and creates a project. Copy the deployment URL into .env.local as NEXT_PUBLIC_CONVEX_URL.

### 4. Stream Video
1. Create a project at getstream.io (Video & Audio)
2. Copy API key + secret into .env.local

### 5. Run
```bash
# Terminal 1
bunx convex dev

# Terminal 2
bun dev
```

## How matchmaking works

1. User joins `waitingPool` in Convex with their location
2. A mutation polls every 2s with `findMatch`
3. On match: Stream call is created, both users leave the pool, a `sessions` doc is written
4. Both clients join the Stream call via the SDK
5. "Next" ends the call and re-queues both users
