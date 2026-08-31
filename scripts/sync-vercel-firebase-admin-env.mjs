/**
 * Upsert Firebase Admin + CMS bootstrap env on Vercel (names only in stdout).
 * Reads .env.local + service.json. Never prints secret values.
 *
 *   VERCEL_TOKEN=... node scripts/sync-vercel-firebase-admin-env.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const PROJECT = process.env.VERCEL_PROJECT || "de-division-pmh";
const TARGETS = ["production", "preview"];

function parseDotEnv(raw) {
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    let v = t.slice(i + 1);
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[t.slice(0, i)] = v;
  }
  return out;
}

function requireToken() {
  const token = (process.env.VERCEL_TOKEN || "").trim();
  if (!token) {
    console.error("missing VERCEL_TOKEN");
    process.exit(2);
  }
  return token;
}

async function vercel(token, method, path, body) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { ok: res.ok, status: res.status, json };
}

const localEnv = existsSync(".env.local") ? parseDotEnv(readFileSync(".env.local", "utf8")) : {};
const svcPath = resolve(localEnv.GOOGLE_APPLICATION_CREDENTIALS || "./service.json");
if (!existsSync(svcPath)) {
  console.error("missing service.json");
  process.exit(2);
}
const svc = JSON.parse(readFileSync(svcPath, "utf8"));

const pairs = {
  FIREBASE_PROJECT_ID: svc.project_id || localEnv.FIREBASE_PROJECT_ID || localEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: svc.client_email || localEnv.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: svc.private_key || localEnv.FIREBASE_PRIVATE_KEY,
  CMS_BOOTSTRAP_EMAIL: localEnv.CMS_BOOTSTRAP_EMAIL || localEnv.email,
  CMS_BOOTSTRAP_PASSWORD: localEnv.CMS_BOOTSTRAP_PASSWORD || localEnv.PASS,
  NEXT_PUBLIC_SITE_URL: "https://de-division-pmh.vercel.app",
};

for (const [key, value] of Object.entries(pairs)) {
  const ok = typeof value === "string" && value.trim().length > 0;
  console.log(`local ${key} ${ok ? "present" : "MISSING"}`);
  if (!ok) {
    console.error(`cannot sync ${key}`);
    process.exit(2);
  }
}

const token = requireToken();
const listed = await vercel(token, "GET", `/v9/projects/${PROJECT}/env`);
if (!listed.ok) {
  console.error("list-env failed", listed.status, listed.json?.error?.code || listed.json?.error?.message || "unknown");
  process.exit(1);
}
const existing = Array.isArray(listed.json?.envs) ? listed.json.envs : [];

async function upsert(key, value) {
  const matches = existing.filter((e) => e.key === key);
  for (const row of matches) {
    const id = row.id;
    if (!id) continue;
    const del = await vercel(token, "DELETE", `/v9/projects/${PROJECT}/env/${id}`);
    console.log(`delete ${key} ${row.target?.join(",") || "?"} ${del.status}`);
  }
  const created = await vercel(token, "POST", `/v10/projects/${PROJECT}/env`, {
    key,
    value,
    type: "encrypted",
    target: TARGETS,
  });
  console.log(`upsert ${key} ${created.status} ${created.ok ? "ok" : created.json?.error?.code || "fail"}`);
  if (!created.ok) process.exit(1);
}

for (const [key, value] of Object.entries(pairs)) {
  await upsert(key, value);
}
console.log("done names", Object.keys(pairs).join(","));
