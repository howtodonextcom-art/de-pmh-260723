import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  getFirebaseAdminEnv,
  getFirebaseClientEnv,
  isFirebaseAdminConfigured,
} from "@/lib/config/env.server";

let initError: string | null = null;

function loadServiceAccount(): Record<string, string> | null {
  const env = getFirebaseAdminEnv();
  if (env.clientEmail && env.privateKey) {
    return {
      project_id: env.projectId,
      client_email: env.clientEmail,
      private_key: env.privateKey.replace(/\\n/g, "\n"),
    };
  }
  if (!env.credentialsPath) return null;
  const abs = path.resolve(process.cwd(), env.credentialsPath);
  if (!existsSync(abs)) return null;
  return JSON.parse(readFileSync(abs, "utf8")) as Record<string, string>;
}

export function getFirebaseAdminApp(): App | null {
  if (getApps().length > 0) return getApps()[0]!;
  if (!isFirebaseAdminConfigured()) {
    initError = "admin-unconfigured";
    return null;
  }
  try {
    const account = loadServiceAccount();
    if (!account) {
      initError = "credentials-missing";
      return null;
    }
    const client = getFirebaseClientEnv();
    const projectId = account.project_id || getFirebaseAdminEnv().projectId;
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail: account.client_email,
        privateKey: account.private_key,
      }),
      projectId,
      storageBucket: client.storageBucket || undefined,
    });
    initError = null;
    return app;
  } catch {
    initError = "admin-init-failed";
    return null;
  }
}

export function getFirebaseAdminInitError(): string | null {
  return initError;
}

export function getAdminAuth(): Auth | null {
  const app = getFirebaseAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminDb(): Firestore | null {
  const app = getFirebaseAdminApp();
  return app ? getFirestore(app) : null;
}

export function getAdminStorage(): Storage | null {
  const app = getFirebaseAdminApp();
  return app ? getStorage(app) : null;
}
