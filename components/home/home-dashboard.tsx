"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, NotebookPen } from "lucide-react";

import { modules } from "@/content/curriculum";
import { useProgress } from "@/hooks/use-progress";
import {
  countSessionDone,
  countSessionItems,
  findActiveModule,
  findNextSession,
  findRecentNotes,
  globalPercent,
  modulePercent,
} from "@/lib/progress";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function HomeDashboard() {
  const { progress } = useProgress();

  const overall = globalPercent(modules, progress);
  const active = findActiveModule(modules, progress);
  const next = findNextSession(modules, progress);
  const recent = findRecentNotes(modules, progress, 3);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardDescription className="tracking-widest uppercase">
            Progreso del plan
          </CardDescription>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tabular-nums">
              {overall}%
            </span>
            <span className="text-muted-foreground text-sm">
              en {modules.length} módulos
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overall} aria-label="Progreso global del plan" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {modules.map((m) => {
              const pct = modulePercent(m, progress);
              return (
                <li key={m.id}>
                  <Link
                    href={`/module/${m.id}`}
                    className="hover:bg-muted/40 group focus-visible:ring-ring -m-2 block rounded-lg p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <p className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                      Módulo {String(m.number).padStart(2, "0")}
                    </p>
                    <p className="mt-0.5 text-sm font-medium group-hover:text-foreground">
                      {m.title}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="bg-muted h-1 flex-1 overflow-hidden rounded-full">
                        <div
                          className={cn(
                            "bg-primary h-full transition-all",
                            pct === 0 && "bg-muted-foreground/30",
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground w-8 text-right text-[10px] tabular-nums">
                        {pct}%
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardDescription className="tracking-widest uppercase">
            Módulo activo
          </CardDescription>
          {active ? (
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="text-primary size-4 shrink-0" aria-hidden />
              {active.title}
            </CardTitle>
          ) : (
            <CardTitle className="text-muted-foreground">
              Aún no hay módulos
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {active ? (
            <>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {active.description}
              </p>
              <div className="mt-5">
                <Progress
                  value={modulePercent(active, progress)}
                  aria-label={`Progreso de ${active.title}`}
                />
                <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                  <span>~{active.estimatedHours}h estimadas</span>
                  <Link
                    href={`/module/${active.id}`}
                    className="text-foreground hover:text-primary inline-flex items-center gap-1 font-medium"
                  >
                    Abrir módulo <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="tracking-widest uppercase">
            Lo que sigue
          </CardDescription>
          {next ? (
            <CardTitle>{next.session.title}</CardTitle>
          ) : (
            <CardTitle className="text-muted-foreground">Todo listo</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {next ? (
            <NextSessionBody
              moduleTitle={next.module.title}
              moduleNumber={next.module.number}
              sessionNumber={next.session.number}
              concepts={countSessionItems(next.session).concepts}
              exercises={countSessionItems(next.session).exercises}
              done={countSessionDone(next.session, progress)}
              total={countSessionItems(next.session).total}
              href={`/module/${next.module.id}/session/${next.session.id}`}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              Nada pendiente. Tomate un descanso.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardDescription className="tracking-widest uppercase">
            Notas recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <NotebookPen className="size-4 shrink-0" aria-hidden />
              <span>
                Tomá notas en una sesión y van a aparecer acá.
              </span>
            </div>
          ) : (
            <ul className="divide-border divide-y">
              {recent.map((entry) => (
                <li key={entry.session.id} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={`/module/${entry.module.id}/session/${entry.session.id}`}
                    className="hover:bg-muted/30 -mx-2 block rounded-md px-2 py-1"
                  >
                    <p className="text-muted-foreground text-xs">
                      Módulo {String(entry.module.number).padStart(2, "0")} · {entry.module.title}
                    </p>
                    <p className="mt-0.5 text-sm font-medium">
                      {entry.session.title}
                    </p>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                      {entry.notes.trim()}
                    </p>
                    {entry.notesUpdatedAt ? (
                      <p className="text-muted-foreground/70 mt-1 text-[10px] tabular-nums">
                        {formatRelative(entry.notesUpdatedAt)}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NextSessionBody({
  moduleTitle,
  moduleNumber,
  sessionNumber,
  concepts,
  exercises,
  done,
  total,
  href,
}: {
  moduleTitle: string;
  moduleNumber: number;
  sessionNumber: number;
  concepts: number;
  exercises: number;
  done: number;
  total: number;
  href: string;
}) {
  const pending = total - done;
  return (
    <>
      <p className="text-muted-foreground text-xs">
        Módulo {String(moduleNumber).padStart(2, "0")} · Sesión {sessionNumber}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        en <span className="text-foreground">{moduleTitle}</span>
      </p>
      <p className="mt-4 text-sm">
        <span className="font-medium tabular-nums">{pending}</span>{" "}
        <span className="text-muted-foreground">
          {pending === 1 ? "ítem pendiente" : "ítems pendientes"}
        </span>{" "}
        <span className="text-muted-foreground">
          ({concepts} {concepts === 1 ? "concepto" : "conceptos"} ·{" "}
          {exercises} {exercises === 1 ? "ejercicio" : "ejercicios"})
        </span>
      </p>
      <Link
        href={href}
        className="text-foreground hover:text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium"
      >
        Abrir sesión <ArrowRight className="size-3" />
      </Link>
    </>
  );
}

const RTF = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = t - Date.now();
  const minutes = Math.round(diff / 60_000);
  if (Math.abs(minutes) < 60) return RTF.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return RTF.format(hours, "hour");
  const days = Math.round(hours / 24);
  return RTF.format(days, "day");
}
