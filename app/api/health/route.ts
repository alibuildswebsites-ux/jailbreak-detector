import dns from "node:dns";
import { NextRequest, NextResponse } from "next/server";

// Hostinger's default hostname publishes both A and AAAA records.
// Vercel Functions can prefer IPv6, while this VPS path is reliably reachable
// over IPv4. Prefer IPv4 for this upstream without exposing port 8000.
dns.setDefaultResultOrder("ipv4first");

const BACKEND_BASE =
  process.env.BACKEND_URL || "https://srv1869613.hstgr.cloud";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/health`, {
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { status: "down", detail: err?.message || "Backend unreachable" },
      { status: 502 }
    );
  }
}