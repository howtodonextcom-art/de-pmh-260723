"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function PasscodeForm({ nextPath }: { nextPath: string }) {
  const t = useTranslations("passcode");
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        router.push(nextPath);
        router.refresh();
        return;
      }

      if (res.status === 423) {
        router.refresh();
        return;
      }

      const data = (await res.json().catch(() => ({}))) as { attemptsLeft?: number };
      if (typeof data.attemptsLeft === "number" && data.attemptsLeft <= 0) {
        router.refresh();
        return;
      }
      setAttemptsLeft(typeof data.attemptsLeft === "number" ? data.attemptsLeft : null);
      setError(t("wrong"));
    } catch {
      setError(t("error"));
    } finally {
      setSubmitting(false);
      setCode("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        inputMode="numeric"
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={t("placeholder")}
        aria-invalid={Boolean(error)}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
      />
      {error && (
        <p className="text-sm text-destructive">
          {error}
          {attemptsLeft !== null ? ` ${t("attemptsLeft", { count: attemptsLeft })}` : ""}
        </p>
      )}
      <Button type="submit" size="lg" disabled={submitting || !code} className="w-full">
        {submitting ? t("checking") : t("submit")}
      </Button>
    </form>
  );
}
