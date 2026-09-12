import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_MAX_AGE_SEC, ATTEMPTS_MAX_AGE_SEC, LOCK_MAX_AGE_SEC, MAX_ATTEMPTS, SITE_ACCESS_COOKIE, SITE_ATTEMPTS_COOKIE, SITE_LOCKED_COOKIE } from "@/lib/passcode/constants";
import { computeAccessToken } from "@/lib/passcode/sign";

function cookieOptions(maxAgeSec: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

export async function POST(request: Request) {
  const passcode = process.env.SITE_PASSCODE;
  if (!passcode) {
    return NextResponse.json({ error: "not-configured" }, { status: 500 });
  }

  const jar = await cookies();
  if (jar.get(SITE_LOCKED_COOKIE)) {
    const locked = NextResponse.json({ error: "locked" }, { status: 423 });
    locked.headers.set("Retry-After", String(LOCK_MAX_AGE_SEC));
    return locked;
  }

  const body = (await request.json().catch(() => null)) as { code?: string } | null;
  const code = body?.code?.trim() ?? "";

  if (code && code === passcode) {
    const token = await computeAccessToken(passcode);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SITE_ACCESS_COOKIE, token, cookieOptions(ACCESS_MAX_AGE_SEC));
    response.cookies.set(SITE_ATTEMPTS_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
    return response;
  }

  const currentAttempts = Number(jar.get(SITE_ATTEMPTS_COOKIE)?.value ?? "0") + 1;
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - currentAttempts);
  const response = NextResponse.json({ error: "invalid", attemptsLeft }, { status: 401 });

  if (currentAttempts >= MAX_ATTEMPTS) {
    response.cookies.set(SITE_LOCKED_COOKIE, "1", cookieOptions(LOCK_MAX_AGE_SEC));
    response.cookies.set(SITE_ATTEMPTS_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
    response.headers.set("Retry-After", String(LOCK_MAX_AGE_SEC));
  } else {
    response.cookies.set(SITE_ATTEMPTS_COOKIE, String(currentAttempts), cookieOptions(ATTEMPTS_MAX_AGE_SEC));
  }

  return response;
}
