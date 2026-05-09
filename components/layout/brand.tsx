import Link from "next/link";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** When `link` is false, renders a plain element (used inside the mobile
   *  sheet header where the parent is already a heading or trigger). */
  link?: boolean;
};

export function Brand({ className, link = true }: Props) {
  const content = (
    <>
      <span
        aria-hidden
        className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-md"
      >
        <Sparkles className="size-4" />
      </span>
      <span>Nova Learn</span>
    </>
  );

  const classes = cn(
    "flex items-center gap-2 text-sm font-semibold tracking-tight",
    className,
  );

  if (!link) return <span className={classes}>{content}</span>;
  return (
    <Link
      href="/"
      className={cn(classes, "focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none")}
    >
      {content}
    </Link>
  );
}
