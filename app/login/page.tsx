import { redirect } from "next/navigation";

import { LoginForm } from "@/app/login/login-form";
import { readCmsSession } from "@/lib/firebase/session";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await readCmsSession();
  const { next } = await searchParams;
  const dest = next && next.startsWith("/cms") ? next : "/cms";
  if (session) redirect(dest);
  return <LoginForm nextPath={dest} />;
}
