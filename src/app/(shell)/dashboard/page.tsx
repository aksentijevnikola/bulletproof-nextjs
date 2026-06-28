import type { Metadata } from "next";
import { DashboardPage } from "@/widgets/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "bulletproof-nextjs dashboard shell and local activity fixture.",
};

export default function Page() {
  return <DashboardPage />;
}
