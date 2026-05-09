import { ThemeToggle } from "@/components/theme/theme-toggle";

import { Brand } from "./brand";
import { MobileNav } from "./mobile-nav";

/**
 * Sticky top bar. On desktop the brand lives in the sidebar, so the topbar
 * just carries actions. On mobile it shows a hamburger and the brand.
 */
export function Topbar() {
  return (
    <header
      className="bg-background/85 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 lg:px-6"
    >
      <MobileNav />
      <div className="lg:hidden">
        <Brand />
      </div>
      <div className="flex-1" />
      <ThemeToggle />
    </header>
  );
}
