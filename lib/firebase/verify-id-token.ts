import { CMS_ID_TOKEN_COOKIE_PREFIX } from "@/lib/cms/constants";
import { getFirebaseClientEnv } from "@/lib/config/env.server";

export { CMS_ID_TOKEN_COOKIE_PREFIX, CMS_ID_TOKEN_MAX_AGE_SEC } from "@/lib/cms/constants";

export function isIdTokenSessionCookie(value: string): boolean {
  return value.startsWith(CMS_ID_TOKEN_COOKIE_PREFIX);
}

export type VerifiedFirebaseUser = {
  uid: string;
  email: string | null;
};

/**
 * Verify a Firebase ID token via Identity Toolkit (Google-signed JWT).
 * Does not require the Admin service account. Uses the public web API key.
 */
export async function lookupFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseUser | null> {
  const apiKey = getFirebaseClientEnv().apiKey;
  if (!apiKey || !idToken.trim()) return null;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      users?: Array<{ localId?: string; email?: string }>;
    };
    const user = data.users?.[0];
    if (!user?.localId) return null;
    return { uid: user.localId, email: user.email ?? null };
  } catch {
    return null;
  }
}
