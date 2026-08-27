"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CmsSiteSettings } from "@/lib/cms/types";

export function SiteForm({ settings }: { settings: CmsSiteSettings }) {
  const [brand, setBrand] = useState(settings.brandStatementVi);
  const [updatesText, setUpdatesText] = useState(
    (settings.updates ?? [])
      .map((u) => [u.date, u.projectSlug, u.textVi].join(" | "))
      .join("\n"),
  );
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const updates = updatesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [date, projectSlug, ...rest] = line.split("|").map((p) => p.trim());
        return {
          id: `u-${index + 1}`,
          date: date || new Date().toISOString().slice(0, 10),
          projectSlug: projectSlug || "",
          textVi: rest.join(" | "),
        };
      });
    const res = await fetch("/api/cms/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandStatementVi: brand, updates }),
    });
    setStatus(res.ok ? "Đã lưu." : "Lưu thất bại.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Brand statement</span>
        <textarea
          className="min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Cập nhật (mỗi dòng: ngày | slug | nội dung)</span>
        <textarea
          className="min-h-32 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm"
          value={updatesText}
          onChange={(e) => setUpdatesText(e.target.value)}
        />
      </label>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      <Button type="submit">Lưu</Button>
    </form>
  );
}
