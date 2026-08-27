import { NextResponse } from "next/server";

import { ensureBootstrapUser } from "@/lib/firebase/session";

export async function POST() {
  const result = await ensureBootstrapUser();
  return NextResponse.json({ ok: true, result });
}
