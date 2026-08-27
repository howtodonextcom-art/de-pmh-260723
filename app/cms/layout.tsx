import Link from "next/link";
import { redirect } from "next/navigation";

import { readCmsSession } from "@/lib/firebase/session";

export const dynamic = "force-dynamic";

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const session = await readCmsSession();
  if (!session) redirect("/login?next=/cms");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/cms" className="font-display text-lg">
            CMS catalog
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/cms" className="text-muted-foreground hover:text-foreground">
              Dự án
            </Link>
            <Link href="/cms/projects/new" className="text-muted-foreground hover:text-foreground">
              Tạo mới
            </Link>
            <Link href="/cms/site" className="text-muted-foreground hover:text-foreground">
              Site
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Xem site
            </Link>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="text-muted-foreground hover:text-foreground">
                Đăng xuất
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
