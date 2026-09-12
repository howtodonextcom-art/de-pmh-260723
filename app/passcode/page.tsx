import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { SITE_ACCESS_COOKIE, SITE_LOCKED_COOKIE } from "@/lib/passcode/constants";
import { computeAccessToken } from "@/lib/passcode/sign";
import { buildTitle } from "@/lib/seo";
import { PasscodeForm } from "./passcode-form";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("passcode");
  return {
    title: buildTitle(t("metaTitle")),
  };
}

export default async function PasscodePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const t = await getTranslations("passcode");
  const { next } = await searchParams;
  const nextPath = next && next.startsWith("/") ? next : "/";
  const passcode = process.env.SITE_PASSCODE;
  const jar = await cookies();

  if (passcode) {
    const accessCookie = jar.get(SITE_ACCESS_COOKIE)?.value;
    const expected = await computeAccessToken(passcode);
    if (accessCookie === expected) {
      redirect(nextPath);
    }
  }

  const locked = Boolean(jar.get(SITE_LOCKED_COOKIE));

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-sm font-medium text-primary">{t("brand")}</p>
            <h1 className="text-2xl font-bold text-foreground">
              {locked ? t("lockedTitle") : t("title")}
            </h1>
          </div>
          <LocaleSwitcher />
        </div>
        {locked ? (
          <p className="text-sm text-muted-foreground">{t("lockedBody")}</p>
        ) : (
          <PasscodeForm nextPath={nextPath} />
        )}
      </div>
    </div>
  );
}
