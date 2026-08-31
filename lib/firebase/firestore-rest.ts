import "server-only";

import { getFirebaseAdminEnv, getFirebaseClientEnv } from "@/lib/config/env.server";
import {
  firestoreDocId,
  firestoreDocumentsUrl,
  fromFirestoreFields,
  toFirestoreFields,
  type FirestoreValue,
} from "@/lib/firebase/firestore-codec";

type RestDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

type RestList = {
  documents?: RestDocument[];
  error?: { status?: string; message?: string };
};

function projectId(): string {
  return getFirebaseAdminEnv().projectId || getFirebaseClientEnv().projectId;
}

function apiKey(): string {
  return getFirebaseClientEnv().apiKey;
}

function url(docPath: string): string {
  return firestoreDocumentsUrl(projectId(), docPath, apiKey());
}

async function readJson(res: Response): Promise<RestList & RestDocument> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as RestList & RestDocument;
  } catch {
    return {};
  }
}

export function isFirestoreRestConfigured(): boolean {
  return Boolean(projectId() && apiKey());
}

export async function restListDocuments(
  collection: string,
): Promise<Array<{ id: string; data: Record<string, unknown> }>> {
  if (!isFirestoreRestConfigured()) return [];
  const res = await fetch(url(collection), { method: "GET", cache: "no-store" });
  const body = await readJson(res);
  if (!res.ok) return [];
  return (body.documents ?? []).map((doc) => ({
    id: firestoreDocId(doc.name || ""),
    data: fromFirestoreFields(doc.fields),
  }));
}

export async function restGetDocument(
  docPath: string,
): Promise<Record<string, unknown> | null> {
  if (!isFirestoreRestConfigured()) return null;
  const res = await fetch(url(docPath), { method: "GET", cache: "no-store" });
  if (res.status === 404) return null;
  const body = await readJson(res);
  if (!res.ok) return null;
  return fromFirestoreFields(body.fields);
}

export async function restSetDocument(
  docPath: string,
  data: Record<string, unknown>,
  idToken: string,
): Promise<{ ok: boolean; status: number }> {
  if (!isFirestoreRestConfigured() || !idToken.trim()) {
    return { ok: false, status: 0 };
  }
  const res = await fetch(url(docPath), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });
  return { ok: res.ok, status: res.status };
}

export async function restDeleteDocument(
  docPath: string,
  idToken: string,
): Promise<{ ok: boolean; status: number }> {
  if (!isFirestoreRestConfigured() || !idToken.trim()) {
    return { ok: false, status: 0 };
  }
  const res = await fetch(url(docPath), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${idToken}` },
  });
  return { ok: res.ok || res.status === 404, status: res.status };
}
