import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SITE_ACCESS_COOKIE, SITE_LOCKED_COOKIE } from "@/lib/passcode/constants";
import { computeAccessToken } from "@/lib/passcode/sign";
import { buildTitle } from "@/lib/seo";
import { PasscodeForm } from "./passcode-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: buildTitle("Nhập mã truy cập"),
};

export default async function PasscodePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
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
        <p className="mb-1 text-sm font-medium text-primary">DED-PMH</p>
        <h1 className="mb-6 text-2xl font-bold text-foreground">
          {locked ? "Trình duyệt đã bị khóa" : "Nhập mã truy cập"}
        </h1>
        {locked ? (
          <p className="text-sm text-muted-foreground">
            Bạn đã nhập sai mã quá 5 lần. Vui lòng thử lại sau 24 giờ, hoặc liên hệ quản trị viên.
          </p>
        ) : (
          <PasscodeForm nextPath={nextPath} />
        )}
      </div>
    </div>
  );
}
