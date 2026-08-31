export function firebaseStorageUploadUrl(bucket: string, objectPath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o?name=${encodeURIComponent(objectPath)}`;
}

export function firebaseStorageDownloadUrl(bucket: string, objectPath: string, token = ""): string {
  const base = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(objectPath)}?alt=media`;
  return token ? `${base}&token=${encodeURIComponent(token)}` : base;
}
