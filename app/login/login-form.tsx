"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseClientAuth, isBrowserFirebaseConfigured } from "@/lib/firebase/client";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (!isBrowserFirebaseConfigured()) {
        setError("Firebase client chưa được cấu hình.");
        return;
      }
      const bootstrap = await fetch("/api/auth/bootstrap", { method: "POST" });
      const bootstrapPayload = (await bootstrap.json().catch(() => ({}))) as { result?: string };
      const cred = await signInWithEmailAndPassword(getFirebaseClientAuth(), email.trim(), password);
      const idToken = await cred.user.getIdToken();
      const session = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const sessionPayload = (await session.json().catch(() => ({}))) as {
        error?: string;
        debug?: Record<string, unknown>;
        mode?: string;
      };
      // #region agent log
      fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
        body: JSON.stringify({
          sessionId: "87c57b",
          runId: "post-fix",
          hypothesisId: session.status === 503 ? "A" : session.ok ? "D" : "C",
          location: "app/login/login-form.tsx:onSubmit",
          message: "session-response",
          data: {
            sessionStatus: session.status,
            sessionError: sessionPayload.error ?? null,
            sessionMode: "mode" in sessionPayload ? sessionPayload.mode : null,
            sessionDebug: sessionPayload.debug ?? null,
            bootstrapOk: bootstrap.ok,
            bootstrapResult: bootstrapPayload.result ?? null,
            clientConfigured: isBrowserFirebaseConfigured(),
            hasIdToken: Boolean(idToken),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      if (!session.ok) {
        if (sessionPayload.error === "admin-unconfigured" || session.status === 503) {
          setError(
            "CMS server chưa cấu hình Firebase Admin. Cần FIREBASE_CLIENT_EMAIL và FIREBASE_PRIVATE_KEY trên Vercel.",
          );
        } else {
          setError("Không tạo được phiên đăng nhập.");
        }
        return;
      }
      window.location.assign(nextPath);
    } catch {
      setError("Email hoặc mật khẩu không đúng.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div>
          <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">DED-PMH</p>
          <h1 className="mt-1 font-display text-2xl text-foreground">Đăng nhập CMS</h1>
          <p className="mt-1 text-sm text-muted-foreground">Nhập thông tin dự án và hình ảnh catalog.</p>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Email</span>
          <Input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Mật khẩu</span>
          <Input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Đang vào…" : "Vào CMS"}
        </Button>
      </form>
    </main>
  );
}
