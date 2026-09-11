async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Derives the `site_access` cookie's value from SITE_PASSCODE — one-way, so
 * the cookie value alone can't be reverse-engineered into the passcode, and
 * can't be forged from a DevTools Storage editor without knowing
 * SITE_PASSCODE server-side. Uses Web Crypto (crypto.subtle) instead of
 * Node's `crypto` module so it works unmodified in both middleware's Edge
 * runtime and the API route's Node runtime.
 */
export function computeAccessToken(passcode: string): Promise<string> {
  return hmacSha256Hex(passcode, "ded-pmh-site-access-v1");
}
