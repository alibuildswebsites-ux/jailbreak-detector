import dns from "node:dns";
import { NextRequest, NextResponse } from "next/server";

// Hostinger's default hostname publishes both A and AAAA records.
// Vercel Functions can prefer IPv6, while this VPS path is reliably reachable
// over IPv4. Prefer IPv4 for this upstream without exposing port 8000.
dns.setDefaultResultOrder("ipv4first");

// Backend is only reachable through the nginx reverse proxy on the VPS.
// Vercel serverless functions CAN reach it (server-to-server, no browser CORS/port limits).
const BACKEND_BASE =
  process.env.BACKEND_URL || "https://srv1869613.hstgr.cloud";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(`${BACKEND_BASE}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      // bounded server-side call — never hang the UI forever
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "upstream_unreachable",
        detail: err?.message || "Backend unreachable",
      },
      { status: 502 }
    );
  }
}