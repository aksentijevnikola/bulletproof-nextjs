import type { Metadata } from "next";
import { AppProviders } from "@/_app/providers";
import { rootFontClassName } from "@/_app/styles";
import "@/_app/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "bulletproof-nextjs",
    template: "%s · bulletproof-nextjs",
  },
  description:
    "A standalone Next.js application shell built for clear boundaries and dependable verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={rootFontClassName}>
      <body className="flex min-h-full flex-col">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
