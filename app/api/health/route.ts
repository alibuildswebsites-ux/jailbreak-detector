import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_URL || "https://srv1869613.hstgr.cloud:8443";

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