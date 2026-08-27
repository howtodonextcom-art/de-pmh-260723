"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CMS_IMAGE_CATEGORIES } from "@/lib/cms/constants";
import { emptyLegalDossier } from "@/lib/cms/empty-project";
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
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const legal = doc.legalDossier ?? emptyLegalDossier();

  function patch(partial: Partial<CmsProjectDoc>) {
    setDoc((prev) => ({ ...prev, ...partial }));
  }

  async function onUpload(file: File, category: string) {
    const body = new FormData();
    body.set("file", file);
    body.set("slug", doc.slug);
    body.set("category", category);
    body.set("alt", `${doc.displayNameVi} — ${category}`);
    const res = await fetch("/api/cms/upload", { method: "POST", body });
    const data = (await res.json()) as { asset?: CmsAsset };
    if (!data.asset) return;
    const assets = [...(doc.assets ?? []), data.asset];
    const next: Partial<CmsProjectDoc> = { assets };
    if (category === "hero" && !doc.heroAssetId) next.heroAssetId = data.asset.assetId;
    if (category !== "hero") {
      next.galleryAssetIds = [...(doc.galleryAssetIds ?? []), data.asset.assetId];
    }
    patch(next);
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/cms/projects/${doc.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
      setStatus(res.ok ? "Đã lưu. Mở trang công khai để kiểm tra." : "Lưu thất bại.");
      if (res.ok) router.refresh();
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
          Tải ảnh cho từng mục: hero, masterplan, vị trí, tiện ích, kiến trúc, thực tế, logo, sản phẩm.
        </p>
        {CMS_IMAGE_CATEGORIES.map((category) => (
          <div key={category} className="rounded-xl border border-border p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{category}</p>
              <Input
                type="file"
                accept="image/*"
                className="max-w-xs"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onUpload(file, category);
                  e.target.value = "";
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(assetsByCategory.get(category) ?? []).map((asset) => (
                <div key={asset.assetId} className="w-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.resolvedUrl ?? asset.sourceFileUrl} alt={asset.alt} className="h-16 w-24 rounded object-cover" />
                  <p className="truncate text-[10px] text-muted-foreground">{asset.assetId}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
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
