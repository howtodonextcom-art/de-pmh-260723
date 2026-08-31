"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugifyName } from "@/lib/cms/slug";

export function NewProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/cms/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayNameVi: name, slug: slug || slugifyName(name) }),
      });
      const raw = await res.text();
      let data: { project?: { slug: string }; error?: string } = {};
      try {
        data = raw ? (JSON.parse(raw) as { project?: { slug: string }; error?: string }) : {};
      } catch {
        data = {};
      }
      if (!res.ok || !data.project) {
        const message =
          data.error === "slug-taken"
            ? "Slug đã tồn tại."
            : data.error === "unauthorized"
              ? "Phiên đăng nhập hết hạn. Đăng nhập lại."
              : data.error === "firestore-unconfigured"
                ? "CMS chưa kết nối Firestore."
                : data.error === "persist-failed"
                  ? "Không lưu được dự án lên Firestore."
                  : "Không tạo được dự án.";
        setError(message);
        return;
      }
      router.push(`/cms/projects/${data.project.slug}`);
      router.refresh();
    } catch {
      setError("Không tạo được dự án.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Tên hiển thị</span>
        <Input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slug) setSlug(slugifyName(e.target.value));
          }}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Slug (URL)</span>
        <Input required value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Đang tạo…" : "Tạo và nhập chi tiết"}
      </Button>
    </form>
  );
}
