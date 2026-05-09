"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
  icon?: LucideIcon;
  /** When true, also highlights for any sub-route under `href`. */
  matchPrefix?: boolean;
  onNavigate?: () => void;
};

export function SidebarLink({
  href,
  label,
  icon: Icon,
  matchPrefix,
  onNavigate,
}: Props) {
  const pathname = usePathname();
  const isActive = matchPrefix
    ? pathname === href || pathname.startsWith(`${href}/`)
    : pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        isActive && "bg-muted text-foreground font-medium",
      )}
    >
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
      <span className="truncate">{label}</span>
    </Link>
  );
}
