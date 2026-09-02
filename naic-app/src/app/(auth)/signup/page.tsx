import type { Metadata } from "next";
import { SignupForm } from "../AuthForms";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Join the National AI Consortium.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/portal";

  return <SignupForm redirectTo={redirectTo} />;
}
