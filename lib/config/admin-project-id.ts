/**
 * Pure Admin-config rules (no process.env). Used by the server loader and tests.
 * Production cannot use GOOGLE_APPLICATION_CREDENTIALS=./service.json.
 */
export function resolveFirebaseAdminProjectId(
  adminProjectId: string,
  publicProjectId: string,
): string {
  const admin = adminProjectId.trim();
  if (admin) return admin;
  return publicProjectId.trim();
}

export function isFirebaseAdminReady(input: {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  credentialsPath: string;
}): boolean {
  if (!input.projectId.trim()) return false;
  if (input.clientEmail.trim() && input.privateKey.trim()) return true;
  return Boolean(input.credentialsPath.trim());
}
