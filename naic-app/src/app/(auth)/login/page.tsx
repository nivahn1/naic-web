import type { Metadata } from "next";
import { LoginForm } from "../AuthForms";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the National AI Consortium member portal.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;
  const redirectTo =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/portal";

  return <LoginForm redirectTo={redirectTo} initialError={error} />;
}
