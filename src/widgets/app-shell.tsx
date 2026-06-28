"use client";

import {
  BoxesIcon,
  LayoutDashboardIcon,
  MenuIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routes/routes";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";

const navigation = [
  {
    href: ROUTES.dashboard,
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
  { href: ROUTES.settings, icon: SettingsIcon, label: "Settings" },
] as const;

const routeHeadings = {
  [ROUTES.dashboard]: {
    title: "Dashboard",
    description: "System overview and validated activity fixture",
  },
  [ROUTES.settings]: {
    title: "Settings",
    description: "Local profile validation and functional theme preference",
  },
} as const;

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Application" className="flex flex-col gap-1">
      {navigation.map(({ href, icon: Icon, label }) => {
        const isCurrent = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            {...(onNavigate ? { onClick: onNavigate } : {})}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              isCurrent
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60",
            )}
          >
            <Icon aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const heading =
    pathname === ROUTES.settings
      ? routeHeadings[ROUTES.settings]
      : routeHeadings[ROUTES.dashboard];

  return (
    <div className="min-h-screen bg-background/75 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r bg-sidebar lg:flex lg:flex-col">
        <div className="flex min-h-16 items-center gap-2 border-b px-5 font-semibold">
          <BoxesIcon aria-hidden="true" className="text-sidebar-primary" />
          bulletproof-nextjs
        </div>
        <div className="flex flex-1 flex-col gap-8 p-4">
          <NavigationLinks />
          <div className="mt-auto border-l-2 border-sidebar-primary pl-3 text-xs leading-5 text-muted-foreground">
            Demonstration shell
            <br />
            No authentication
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b bg-background/95">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Sheet open={isNavigationOpen} onOpenChange={setIsNavigationOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation"
                >
                  <MenuIcon aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[18rem] bg-sidebar p-0">
                <SheetHeader className="border-b text-left">
                  <SheetTitle>bulletproof-nextjs navigation</SheetTitle>
                  <SheetDescription>
                    Move between shell demonstrations.
                  </SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <NavigationLinks
                    onNavigate={() => setIsNavigationOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold">
                {heading.title}
              </h1>
              <p className="hidden truncate text-sm text-muted-foreground sm:block">
                {heading.description}
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </header>
        <main id="main-content" className="px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
