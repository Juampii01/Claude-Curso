import { Brand } from "./brand";
import { SidebarNav } from "./sidebar-nav";

/**
 * Desktop sidebar. Hidden under `lg`. Mobile uses {@link MobileNav}.
 */
export function Sidebar() {
  return (
    <aside
      aria-label="Sidebar navigation"
      className="bg-sidebar text-sidebar-foreground border-sidebar-border sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r lg:flex"
    >
      <div className="flex h-14 items-center px-5">
        <Brand />
      </div>
      <div className="border-sidebar-border border-t" />
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
    </aside>
  );
}
