import { SiteForm } from "@/components/cms/site-form";
import { loadCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CmsSitePage() {
  const { settings } = await loadCatalog();
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl">Nội dung trang chủ</h1>
      <SiteForm settings={settings} />
    </div>
  );
}
