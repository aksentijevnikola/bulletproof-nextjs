import type { Metadata } from "next";
import { HomePage } from "@/widgets/home-page";

export const metadata: Metadata = {
  title: "bulletproof-nextjs — Next.js application shell",
  description:
    "A production-minded Next.js starter shell with explicit architecture and verification boundaries.",
};

export default function Page() {
  return <HomePage />;
}
