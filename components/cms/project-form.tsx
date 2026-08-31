"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CMS_IMAGE_CATEGORIES } from "@/lib/cms/constants";
import { emptyLegalDossier } from "@/lib/cms/empty-project";
import { appendCmsAsset } from "@/lib/cms/project-assets";
import type { CmsAsset, CmsProjectDoc } from "@/lib/cms/types";
import { LEGAL_TABLE_ROW_LABELS, LEGAL_TABLE_ROW_ORDER, isLegalDossierKey } from "@/lib/legal-documents";

const fieldClass =
  "min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm";
const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm";

function lines(value: string[] | undefined): string {
  return (value ?? []).join("\n");
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function readJsonSafe<T>(raw: string): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function uploadErrorMessage(code?: string): string {
  if (code === "unauthorized") return "Phiên đăng nhập hết hạn. Đăng nhập lại.";
  if (code === "storage-unconfigured") return "CMS chưa kết nối Firebase Storage.";
  if (code === "firestore-unconfigured") return "CMS chưa kết nối Firestore.";
  if (code === "persist-failed") return "Không lưu được link.";
  return "Không tải được ảnh.";
}

function persistErrorMessage(code?: string): string {
  if (code === "unauthorized") return "Phiên đăng nhập hết hạn. Đăng nhập lại.";
  if (code === "firestore-unconfigured") return "CMS chưa kết nối Firestore.";
  return "Không lưu được link.";
}

function debugMedia(message: string, data: Record<string, boolean | number | string | null>) {
  fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
    body: JSON.stringify({
      sessionId: "87c57b",
      runId: "cms-media",
      hypothesisId: "A",
      location: "components/cms/project-form.tsx",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}

type FileOpError = { category: string; file: string; message: string };

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function ProjectForm({ project }: { project: CmsProjectDoc }) {
  const router = useRouter();
  const [doc, setDoc] = useState<CmsProjectDoc>(project);
  const docRef = useRef(doc);
  docRef.current = doc;
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    category: string;
    current: number;
    total: number;
  } | null>(null);
  const [fileErrors, setFileErrors] = useState<FileOpError[]>([]);

  const legal = doc.legalDossier ?? emptyLegalDossier();

  function patch(partial: Partial<CmsProjectDoc>) {
    setDoc((prev) => ({ ...prev, ...partial }));
  }

  function commitDoc(next: CmsProjectDoc) {
    docRef.current = next;
    setDoc(next);
  }

  async function persistProject(next: CmsProjectDoc): Promise<{
    ok: boolean;
    project: CmsProjectDoc;
    error?: string;
  }> {
    const res = await fetch(`/api/cms/projects/${next.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = readJsonSafe<{ project?: CmsProjectDoc; error?: string }>(await res.text());
    if (!res.ok) {
      return { ok: false, project: next, error: data?.error };
    }
    return { ok: true, project: data?.project ?? next };
  }

  async function onUploadFiles(files: File[], category: string) {
    const list = files.filter((file) => file.size > 0);
    if (!list.length || mediaBusy) return;
    setMediaBusy(true);
    setFileErrors((prev) => prev.filter((err) => err.category !== category));
    setStatus(null);
    let uploaded = 0;
    let persisted = 0;
    const errors: FileOpError[] = [];
    debugMedia("cms-upload-start", { fileCount: list.length, uploaded: false, persisted: false });
    try {
      for (let i = 0; i < list.length; i += 1) {
        const file = list[i]!;
        setUploadProgress({ category, current: i + 1, total: list.length });
        setStatus(`Đang tải ${i + 1}/${list.length}…`);
        try {
          const body = new FormData();
          body.set("file", file);
          body.set("slug", docRef.current.slug);
          body.set("category", category);
          body.set("alt", `${docRef.current.displayNameVi} — ${category}`);
          const res = await fetch("/api/cms/upload", { method: "POST", body });
          const data = readJsonSafe<{ asset?: CmsAsset; error?: string }>(await res.text());
          if (!res.ok || !data?.asset) {
            errors.push({
              category,
              file: file.name,
              message: uploadErrorMessage(data?.error),
            });
            continue;
          }
          uploaded += 1;
          const next = appendCmsAsset(docRef.current, data.asset, category);
          const saved = await persistProject(next);
          commitDoc(saved.project);
          if (!saved.ok) {
            errors.push({
              category,
              file: file.name,
              message: persistErrorMessage(saved.error),
            });
            continue;
          }
          persisted += 1;
        } catch {
          errors.push({ category, file: file.name, message: "Không tải được ảnh." });
        }
      }
      if (errors.length) setFileErrors((prev) => [...prev, ...errors]);
      if (persisted === list.length) setStatus("Đã lưu link");
      else if (persisted > 0) setStatus(`Đã lưu ${persisted}/${list.length} link. Một số file lỗi.`);
      else setStatus(errors[0]?.message ?? "Không tải được ảnh.");
      debugMedia("cms-upload-done", {
        fileCount: list.length,
        uploaded,
        persisted,
        failed: errors.length,
      });
    } finally {
      setUploadProgress(null);
      setMediaBusy(false);
    }
  }

  async function onDeleteAsset(asset: CmsAsset) {
    if (mediaBusy) return;
    if (!confirm("Xóa ảnh và file gốc?")) return;
    setMediaBusy(true);
    setStatus(null);
    try {
      const res = await fetch(
        `/api/cms/assets?slug=${encodeURIComponent(doc.slug)}&assetId=${encodeURIComponent(asset.assetId)}`,
        { method: "DELETE" },
      );
      const data = readJsonSafe<{ project?: CmsProjectDoc; error?: string }>(await res.text());
      if (!res.ok || !data?.project) {
        setStatus(
          data?.error === "unauthorized"
            ? "Phiên đăng nhập hết hạn. Đăng nhập lại."
            : data?.error === "storage-unconfigured"
              ? "CMS chưa kết nối Firebase Storage."
              : "Không xóa được ảnh.",
        );
        debugMedia("cms-delete-fail", { deleted: false, persisted: false });
        return;
      }
      commitDoc(data.project);
      setStatus("Đã xóa ảnh và file gốc.");
      debugMedia("cms-delete-ok", { deleted: true, persisted: true });
    } catch {
      setStatus("Không xóa được ảnh.");
    } finally {
      setMediaBusy(false);
    }
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setStatus(null);
    try {
      const saved = await persistProject(docRef.current);
      setStatus(saved.ok ? "Đã lưu. Mở trang công khai để kiểm tra." : persistErrorMessage(saved.error));
      if (saved.ok) {
        commitDoc(saved.project);
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Xóa dự án ${doc.displayNameVi}?`)) return;
    const res = await fetch(`/api/cms/projects/${doc.slug}`, { method: "DELETE" });
    if (res.ok) router.push("/cms");
  }

  const assetsByCategory = useMemo(() => {
    const map = new Map<string, CmsAsset[]>();
    for (const asset of doc.assets ?? []) {
      const list = map.get(asset.category) ?? [];
      list.push(asset);
      map.set(asset.category, list);
    }
    return map;
  }, [doc.assets]);

  return (
    <form onSubmit={onSave} className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-display text-lg">Hero / định danh</h2>
        <Field label="Tên hiển thị">
          <Input value={doc.displayNameVi} onChange={(e) => patch({ displayNameVi: e.target.value, navLabel: doc.navLabel || e.target.value })} />
        </Field>
        <Field label="Tên canonical">
          <Input value={doc.canonicalName} onChange={(e) => patch({ canonicalName: e.target.value })} />
        </Field>
        <Field label="Trạng thái">
          <select className={selectClass} value={doc.status} onChange={(e) => patch({ status: e.target.value })}>
            <option value="dang-trien-khai">Đang triển khai</option>
            <option value="dang-ban">Đang mở bán</option>
            <option value="da-ban-giao">Đã bàn giao</option>
            <option value="sap-mo-ban">Sắp mở bán</option>
          </select>
        </Field>
        <Field label="Ghi chú trạng thái">
          <Input value={doc.statusNote ?? ""} onChange={(e) => patch({ statusNote: e.target.value || null })} />
        </Field>
        <Field label="Vùng / region">
          <Input value={doc.region} onChange={(e) => patch({ region: e.target.value })} />
        </Field>
        <Field label="Thành phố">
          <Input value={doc.city} onChange={(e) => patch({ city: e.target.value })} />
        </Field>
        <Field label="Địa chỉ">
          <Input value={doc.address} onChange={(e) => patch({ address: e.target.value })} />
        </Field>
        <Field label="Nổi bật trang chủ">
          <select className={selectClass} value={doc.featured ? "1" : "0"} onChange={(e) => patch({ featured: e.target.value === "1" })}>
            <option value="0">Không</option>
            <option value="1">Có</option>
          </select>
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-display text-lg">Nav</h2>
        <Field label="Zone">
          <select
            className={selectClass}
            value={doc.navZone ?? "nam"}
            onChange={(e) => patch({ navZone: e.target.value as CmsProjectDoc["navZone"] })}
          >
            <option value="bac">Phía Bắc</option>
            <option value="nam">Phía Nam</option>
          </select>
        </Field>
        <Field label="Nhóm Nam">
          <select
            className={selectClass}
            value={doc.namGroup ?? "site-a"}
            onChange={(e) => patch({ namGroup: e.target.value as CmsProjectDoc["namGroup"] })}
            disabled={doc.navZone === "bac"}
          >
            <option value="site-a">Site A</option>
            <option value="outsite">Outsite</option>
          </select>
        </Field>
        <Field label="Nhãn nav">
          <Input value={doc.navLabel ?? ""} onChange={(e) => patch({ navLabel: e.target.value })} />
        </Field>
        <Field label="Lô đất / plot code">
          <Input value={doc.plotCode ?? ""} onChange={(e) => patch({ plotCode: e.target.value || null })} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-display text-lg">Fact grid</h2>
        <Field label="Diện tích đất (m²)">
          <Input
            type="number"
            value={doc.siteArea ?? ""}
            onChange={(e) =>
              patch({
                siteArea: e.target.value ? Number(e.target.value) : null,
                siteAreaStatus: e.target.value ? "da-co-du-lieu" : "chua-co-du-lieu",
              })
            }
          />
        </Field>
        <Field label="Số căn">
          <Input
            type="number"
            value={doc.totalUnits ?? ""}
            onChange={(e) =>
              patch({
                totalUnits: e.target.value ? Number(e.target.value) : null,
                totalUnitsStatus: e.target.value ? "da-co-du-lieu" : "chua-co-du-lieu",
              })
            }
          />
        </Field>
        <Field label="Blocks">
          <Input type="number" value={doc.blocks ?? ""} onChange={(e) => patch({ blocks: e.target.value ? Number(e.target.value) : null })} />
        </Field>
        <Field label="Tầng">
          <Input value={doc.floors?.toString() ?? ""} onChange={(e) => patch({ floors: e.target.value || null })} />
        </Field>
        <Field label="Phân khu (mỗi dòng)">
          <textarea className={fieldClass} value={lines(doc.subdivisions)} onChange={(e) => patch({ subdivisions: splitLines(e.target.value) })} />
        </Field>
        <Field label="Units by phase (mỗi dòng: phase | số căn)">
          <textarea
            className={fieldClass}
            value={(doc.unitsByPhase ?? []).map((u) => `${u.phase} | ${u.units}`).join("\n")}
            onChange={(e) =>
              patch({
                unitsByPhase: splitLines(e.target.value).map((line) => {
                  const [phase, units] = line.split("|").map((p) => p.trim());
                  return { phase: phase || line, units: Number(units) || 0 };
                }),
                unitsByPhaseStatus: "da-co-du-lieu",
              })
            }
          />
        </Field>
      </section>

      <section className="grid gap-4">
        <h2 className="font-display text-lg">Story</h2>
        <Field label="Mô tả ngắn">
          <textarea className={fieldClass} value={doc.shortDescriptionVi ?? ""} onChange={(e) => patch({ shortDescriptionVi: e.target.value || null })} />
        </Field>
        <Field label="Mô tả dài">
          <textarea className={fieldClass} value={doc.longDescriptionVi ?? ""} onChange={(e) => patch({ longDescriptionVi: e.target.value || null })} />
        </Field>
        <Field label="Highlights (mỗi dòng)">
          <textarea className={fieldClass} value={lines(doc.highlights)} onChange={(e) => patch({ highlights: splitLines(e.target.value) })} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-display text-lg">Vị trí</h2>
        <Field label="Lat">
          <Input
            type="number"
            step="any"
            value={doc.coordinates?.lat ?? ""}
            onChange={(e) =>
              patch({ coordinates: { ...doc.coordinates, lat: e.target.value ? Number(e.target.value) : null } })
            }
          />
        </Field>
        <Field label="Lng">
          <Input
            type="number"
            step="any"
            value={doc.coordinates?.lng ?? ""}
            onChange={(e) =>
              patch({ coordinates: { ...doc.coordinates, lng: e.target.value ? Number(e.target.value) : null } })
            }
          />
        </Field>
        <Field label="URL sa bàn (tuỳ chọn)">
          <Input value={doc.saBanUrl ?? ""} onChange={(e) => patch({ saBanUrl: e.target.value || null })} />
        </Field>
        <Field label="Website chính thức">
          <Input value={doc.officialUrl} onChange={(e) => patch({ officialUrl: e.target.value })} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-display text-lg">Kiến trúc / đối tác</h2>
        <Field label="Concept architect">
          <Input
            value={doc.conceptArchitect?.value ?? ""}
            onChange={(e) =>
              patch({
                conceptArchitect: {
                  ...doc.conceptArchitect,
                  value: e.target.value || null,
                  status: e.target.value ? "da-co-du-lieu" : "chua-co-du-lieu",
                },
              })
            }
          />
        </Field>
        <Field label="Công bố tên architect">
          <select
            className={selectClass}
            value={doc.conceptArchitect?.publicNameApproved === false ? "0" : "1"}
            onChange={(e) =>
              patch({
                conceptArchitect: {
                  ...doc.conceptArchitect,
                  publicNameApproved: e.target.value === "1",
                },
              })
            }
          >
            <option value="1">Có</option>
            <option value="0">Chưa duyệt</option>
          </select>
        </Field>
        <Field label="Interior">
          <Input
            value={doc.conceptInterior?.value ?? ""}
            onChange={(e) =>
              patch({
                conceptInterior: {
                  ...doc.conceptInterior,
                  value: e.target.value || null,
                  status: e.target.value ? "da-co-du-lieu" : "chua-co-du-lieu",
                },
              })
            }
          />
        </Field>
        <Field label="Landscape">
          <Input
            value={doc.conceptLandscape?.value ?? ""}
            onChange={(e) =>
              patch({
                conceptLandscape: {
                  ...doc.conceptLandscape,
                  value: e.target.value || null,
                  status: e.target.value ? "da-co-du-lieu" : "chua-co-du-lieu",
                },
              })
            }
          />
        </Field>
        <Field label="Partners (mỗi dòng)">
          <textarea className={fieldClass} value={lines(doc.partners)} onChange={(e) => patch({ partners: splitLines(e.target.value) })} />
        </Field>
        <Field label="Awards (mỗi dòng)">
          <textarea className={fieldClass} value={lines(doc.awards)} onChange={(e) => patch({ awards: splitLines(e.target.value) })} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-display text-lg">Sản phẩm / tiện ích</h2>
        <Field label="Loại hình (projectType, mỗi dòng)">
          <textarea className={fieldClass} value={lines(doc.projectType)} onChange={(e) => patch({ projectType: splitLines(e.target.value) })} />
        </Field>
        <Field label="Product types (mỗi dòng)">
          <textarea className={fieldClass} value={lines(doc.productTypes)} onChange={(e) => patch({ productTypes: splitLines(e.target.value) })} />
        </Field>
        <Field label="Unit mix (mỗi dòng: loại | số | diện tích)">
          <textarea
            className={fieldClass}
            value={(doc.unitMix ?? []).map((r) => `${r.type} | ${r.count} | ${r.areaRange}`).join("\n")}
            onChange={(e) =>
              patch({
                unitMix: splitLines(e.target.value).map((line) => {
                  const [type, count, areaRange] = line.split("|").map((p) => p.trim());
                  return { type: type || line, count: Number(count) || 0, areaRange: areaRange || "" };
                }),
              })
            }
          />
        </Field>
        <Field label="Amenities (mỗi dòng)">
          <textarea className={fieldClass} value={lines(doc.amenities)} onChange={(e) => patch({ amenities: splitLines(e.target.value) })} />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Pháp lý (8 nhóm)</h2>
        {LEGAL_TABLE_ROW_ORDER.filter(isLegalDossierKey).map((key) => (
          <Field key={key} label={LEGAL_TABLE_ROW_LABELS[key]}>
            <textarea
              className={fieldClass}
              value={legal[key] ?? ""}
              onChange={(e) =>
                patch({
                  legalDossier: { ...legal, [key]: e.target.value || null },
                })
              }
            />
          </Field>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Ảnh theo hạng mục trang chi tiết</h2>
        <p className="text-sm text-muted-foreground">
          Chọn nhiều ảnh cùng lúc cho từng mục (hero, masterplan, vị trí, tiện ích, kiến trúc, thực tế, logo, sản phẩm).
          Link được lưu ngay sau mỗi file thành công, không cần bấm Lưu dự án.
        </p>
        {CMS_IMAGE_CATEGORIES.map((category) => {
          const progress = uploadProgress?.category === category ? uploadProgress : null;
          const errors = fileErrors.filter((err) => err.category === category);
          return (
            <div
              key={category}
              className="rounded-xl border border-border p-3"
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (mediaBusy) return;
                const dropped = [...event.dataTransfer.files].filter((file) => file.type.startsWith("image/"));
                if (dropped.length) void onUploadFiles(dropped, category);
              }}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{category}</p>
                  <p className="text-xs text-muted-foreground">Có thể chọn nhiều file</p>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={mediaBusy}
                  className="max-w-xs"
                  aria-label={`Tải nhiều ảnh ${category}`}
                  onChange={(e) => {
                    const selected = e.target.files ? [...e.target.files] : [];
                    if (selected.length) void onUploadFiles(selected, category);
                    e.target.value = "";
                  }}
                />
              </div>
              {progress ? (
                <p className="mb-2 text-xs text-muted-foreground">
                  Đang tải {progress.current}/{progress.total}…
                </p>
              ) : null}
              {errors.length ? (
                <ul className="mb-2 space-y-0.5 text-xs text-destructive">
                  {errors.map((err) => (
                    <li key={`${err.file}-${err.message}`}>{err.file}: {err.message}</li>
                  ))}
                </ul>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {(assetsByCategory.get(category) ?? []).map((asset) => (
                  <div key={asset.assetId} className="w-28 space-y-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.resolvedUrl ?? asset.sourceFileUrl}
                      alt={asset.alt}
                      className="h-16 w-28 rounded object-cover"
                    />
                    <p className="truncate text-[10px] text-muted-foreground" title={asset.alt || asset.assetId}>
                      {asset.alt || asset.assetId}
                    </p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      disabled={mediaBusy}
                      onClick={() => void onDeleteAsset(asset)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending || mediaBusy}>
          {pending ? "Đang lưu…" : "Lưu dự án"}
        </Button>
        <Button type="button" variant="destructive" onClick={() => void onDelete()}>
          Xóa
        </Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        <a className="text-sm text-primary underline" href={`/du-an/${doc.slug}`} target="_blank" rel="noreferrer">
          Xem trang công khai
        </a>
      </section>
    </form>
  );
}
