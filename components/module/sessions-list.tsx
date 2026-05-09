"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, CircleDashed } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { modules } from "@/content/curriculum";
import { useProgress } from "@/hooks/use-progress";
import {
  countSessionDone,
  countSessionItems,
  resolveSessionStatus,
  sessionPercent,
} from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { Session } from "@/types/curriculum";
import type { SessionStatus } from "@/types/progress";

type Props = {
  moduleId: string;
};

export function ModuleSessionsList({ moduleId }: Props) {
  const { progress } = useProgress();
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) return null;

  if (mod.sessions.length === 0) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
        Sessions for this module land in a later phase.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {mod.sessions.map((session) => (
        <SessionRow
          key={session.id}
          moduleId={mod.id}
          session={session}
          status={resolveSessionStatus(session, progress)}
          percent={sessionPercent(session, progress)}
          done={countSessionDone(session, progress)}
        />
      ))}
    </ol>
  );
}

function SessionRow({
  moduleId,
  session,
  status,
  percent,
  done,
}: {
  moduleId: string;
  session: Session;
  status: SessionStatus;
  percent: number;
  done: number;
}) {
  const counts = countSessionItems(session);
  const isShell = counts.total === 0;

  return (
    <li>
      <Link
        href={`/module/${moduleId}/session/${session.id}`}
        aria-label={`Open ${session.title}`}
        className={cn(
          "bg-card text-card-foreground hover:border-primary/40 group flex flex-col gap-3 rounded-xl border p-4 transition-colors",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Session {session.number}
            </p>
            <p className="mt-1 truncate text-base font-medium">{session.title}</p>
          </div>
          <StatusBadge status={status} isShell={isShell} />
        </div>

        {isShell ? (
          <p className="text-muted-foreground text-xs">Coming soon.</p>
        ) : (
          <>
            <div className="bg-muted h-1 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>
                <span className="text-foreground tabular-nums">
                  {done}/{counts.total}
                </span>{" "}
                items · {counts.concepts} concept
                {counts.concepts === 1 ? "" : "s"} · {counts.exercises} exercise
                {counts.exercises === 1 ? "" : "s"}
              </span>
              <span className="text-foreground inline-flex items-center gap-1 font-medium opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="size-3" />
              </span>
            </div>
          </>
        )}
      </Link>
    </li>
  );
}

const STATUS_META: Record<
  SessionStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  "not-started": {
    label: "Not started",
    icon: Circle,
    className: "bg-muted text-muted-foreground",
  },
  "in-progress": {
    label: "In progress",
    icon: CircleDashed,
    className: "bg-primary/10 text-primary",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-primary text-primary-foreground",
  },
};

function StatusBadge({
  status,
  isShell,
}: {
  status: SessionStatus;
  isShell: boolean;
}) {
  if (isShell) {
    return (
      <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase">
        Soon
      </span>
    );
  }
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase",
        meta.className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {meta.label}
    </span>
  );
}
