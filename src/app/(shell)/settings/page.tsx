import type { Metadata } from "next";
import { SettingsPage } from "@/widgets/settings-page";

export const metadata: Metadata = {
  title: "Settings",
  description: "Locally validated bulletproof-nextjs settings demonstration.",
};

export default function Page() {
  return <SettingsPage />;
}
