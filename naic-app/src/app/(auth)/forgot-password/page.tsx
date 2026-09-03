import type { Metadata } from "next";
import { ForgotPasswordForm } from "../AuthForms";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password-reset link for the member portal.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
