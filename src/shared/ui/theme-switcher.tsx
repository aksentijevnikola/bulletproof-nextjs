"use client";

import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useHasMounted } from "@/shared/hooks/use-has-mounted";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";

const THEME_LABELS = {
  light: "Light",
  dark: "Dark",
  system: "System",
} as const;

export type ThemeName = keyof typeof THEME_LABELS;

export function ThemeSwitcher() {
  const mounted = useHasMounted();
  const { setTheme, theme } = useTheme();

  if (!mounted) {
    return <Skeleton className="size-11" aria-label="Loading theme control" />;
  }

  const currentTheme: ThemeName =
    theme === "light" || theme === "dark" ? theme : "system";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="button"
          aria-label={`Theme: ${THEME_LABELS[currentTheme]}`}
        >
          {currentTheme === "light" ? (
            <SunIcon aria-hidden="true" />
          ) : currentTheme === "dark" ? (
            <MoonIcon aria-hidden="true" />
          ) : (
            <LaptopIcon aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color theme</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup value={currentTheme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
