import "server-only";

import { cookies } from "next/headers";

import { CMS_SESSION_COOKIE, CMS_SESSION_MAX_AGE_MS } from "@/lib/cms/constants";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getCmsBootstrapEnv } from "@/lib/config/env.server";

export type CmsSessionUser = {
  uid: string;
  email: string | null;
};

export async function readCmsSession(): Promise<CmsSessionUser | null> {
  const auth = getAdminAuth();
  if (!auth) return null;
  const token = (await cookies()).get(CMS_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = await auth.verifySessionCookie(token, true);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}

export async function createCmsSessionCookie(idToken: string): Promise<string> {
  const auth = getAdminAuth();
  if (!auth) throw new Error("admin-unconfigured");
  return auth.createSessionCookie(idToken, { expiresIn: CMS_SESSION_MAX_AGE_MS });
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: CMS_SESSION_MAX_AGE_MS / 1000,
  };
}

export async function ensureBootstrapUser(): Promise<"created" | "exists" | "skipped"> {
  const auth = getAdminAuth();
  const { email, password } = getCmsBootstrapEnv();
  if (!auth || !email || !password) return "skipped";
  try {
    await auth.getUserByEmail(email);
    return "exists";
  } catch (err) {
    const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
    if (code !== "auth/user-not-found") return "skipped";
    await auth.createUser({ email, password });
    return "created";
  }
}
