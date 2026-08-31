import "server-only";

import { isFirebaseAdminReady, resolveFirebaseAdminProjectId } from "@/lib/config/admin-project-id";

/**
 * Server-only env (Firebase Admin credentials, credential file path).
 * Do not import from Client Components.
 */

function optional(key: string): string {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : "";
}

export type FirebaseAdminEnv = {
  projectId: string;
  clientEmail: string;
  /** Empty when GOOGLE_APPLICATION_CREDENTIALS points at service.json. */
  privateKey: string;
  credentialsPath: string;
};

export function getFirebaseAdminEnv(): FirebaseAdminEnv {
  return {
    projectId: resolveFirebaseAdminProjectId(
      optional("FIREBASE_PROJECT_ID"),
      optional("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    ),
    clientEmail: optional("FIREBASE_CLIENT_EMAIL"),
    privateKey: optional("FIREBASE_PRIVATE_KEY"),
    credentialsPath: optional("GOOGLE_APPLICATION_CREDENTIALS"),
  };
}

/** True when Admin SDK can init: projectId + (PEM env pair OR local key file). */
export function isFirebaseAdminConfigured(): boolean {
  return isFirebaseAdminReady(getFirebaseAdminEnv());
}

export type FirebaseClientEnv = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export function getFirebaseClientEnv(): FirebaseClientEnv {
  return {
    apiKey: optional("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: optional("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: optional("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: optional("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: optional("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: optional("NEXT_PUBLIC_FIREBASE_APP_ID"),
  };
}

export function isFirebaseClientConfigured(): boolean {
  const env = getFirebaseClientEnv();
  return Boolean(env.apiKey && env.projectId && env.appId);
}

export type CmsBootstrapEnv = {
  email: string;
  password: string;
};

/** Bootstrap operator. Prefers CMS_BOOTSTRAP_*; falls back to legacy `email` / `PASS`. */
export function getCmsBootstrapEnv(): CmsBootstrapEnv {
  return {
    email: optional("CMS_BOOTSTRAP_EMAIL") || optional("email"),
    password: optional("CMS_BOOTSTRAP_PASSWORD") || optional("PASS"),
  };
}
