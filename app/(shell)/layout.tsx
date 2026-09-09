import type { ReactNode } from "react";
import { AppShell } from "@/_app/layouts";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
