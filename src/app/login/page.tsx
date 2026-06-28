import type { Metadata } from "next";
import { LoginPage } from "@/widgets/login-page";

export const metadata: Metadata = {
  title: "Login",
  description: "Local login-form validation demonstration.",
};

export default function Page() {
  return <LoginPage />;
}
