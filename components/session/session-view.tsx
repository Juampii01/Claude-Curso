"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  CircleDashed,
  RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import { useProgress } from "@/hooks/use-progress";
import {
  countSessionDone,
  countSessionItems,
  resolveSessionStatus,
} from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Concept, Exercise, Module, Session } from "@/types/curriculum";
import type { ExerciseStatus, SessionStatus } from "@/types/progress";

type Props = {
  module: Module;
  session: Session;
};

export function SessionView({ module: mod, session }: Props) {
  const { progress } = useProgress();
  const counts = countSessionItems(session);
  const done = countSessionDone(session, progress);
  const status = resolveSessionStatus(session, progress);
  const pct = counts.total === 0 ? 0 : Math.round((done / counts.total) * 100);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
      <Link
        href={`/module/${mod.id}`}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium"
      >
        <ArrowLeft className="size-3.5" /> Volver a {mod.title}
      </Link>

      <header className="mt-4 flex flex-col gap-4">
        <div>
          <p className="text-primary text-xs font-medium tracking-widest uppercase">
            Módulo {String(mod.number).padStart(2, "0")} · Sesión {session.number}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {session.title}
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <StatusPill status={status} />
            <span className="text-muted-foreground text-xs tabular-nums">
              {done}/{counts.total} ítems
            </span>
          </div>
          <CompletionToggle sessionId={session.id} status={status} />
        </div>

        <div className="bg-muted h-1 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </header>

      {session.concepts.length > 0 ? (
        <Section title="Conceptos" count={session.concepts.length}>
          <div className="flex flex-col gap-3">
            {session.concepts.map((c) => (
              <ConceptCard key={c.id} concept={c} />
            ))}
          </div>
        </Section>
      ) : null}

      {session.exercises.length > 0 ? (
        <Section title="Ejercicios" count={session.exercises.length}>
          <div className="flex flex-col gap-3">
            {session.exercises.map((e) => (
              <ExerciseCard key={e.id} exercise={e} />
            ))}
          </div>
        </Section>
      ) : null}

      {counts.total === 0 ? (
        <div className="text-muted-foreground mt-12 rounded-lg border border-dashed p-8 text-center text-sm">
          Esta sesión todavía no tiene contenido cargado.
        </div>
      ) : null}

      <Section title="Notas">
        <NotesEditor sessionId={session.id} />
      </Section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared layout                                                               */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-baseline gap-2">
        <h2 className="text-sm font-medium tracking-widest uppercase">
          {title}
        </h2>
        {typeof count === "number" ? (
          <span className="text-muted-foreground text-xs tabular-nums">
            {count}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Status                                                                      */
/* -------------------------------------------------------------------------- */

const STATUS_META: Record<
  SessionStatus,
  { label: string; className: string }
> = {
  "not-started": {
    label: "No iniciada",
    className: "bg-muted text-muted-foreground",
  },
  "in-progress": {
    label: "En curso",
    className: "bg-primary/10 text-primary",
  },
  completed: {
    label: "Completada",
    className: "bg-primary text-primary-foreground",
  },
};

function StatusPill({ status }: { status: SessionStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}

function CompletionToggle({
  sessionId,
  status,
}: {
  sessionId: string;
  status: SessionStatus;
}) {
  const { setSessionStatus } = useProgress();
  if (status === "completed") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSessionStatus(sessionId, "in-progress")}
      >
        <RotateCcw /> Reabrir sesión
      </Button>
    );
  }
  return (
    <Button size="sm" onClick={() => setSessionStatus(sessionId, "completed")}>
      <CheckCircle2 /> Marcar como completada
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* Concept                                                                     */
/* -------------------------------------------------------------------------- */

function ConceptCard({ concept }: { concept: Concept }) {
  const { progress, toggleConcept } = useProgress();
  const mastered = !!progress.masteredConcepts[concept.id];

  return (
    <article
      className={cn(
        "bg-card text-card-foreground rounded-xl border p-5 transition-colors",
        mastered && "border-primary/30",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium">{concept.title}</h3>
        <button
          type="button"
          onClick={() => toggleConcept(concept.id)}
          aria-pressed={mastered}
          className={cn(
            "focus-visible:ring-ring inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
            mastered
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-border text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          {mastered ? (
            <CheckCircle2 className="size-3.5" aria-hidden />
          ) : (
            <Circle className="size-3.5" aria-hidden />
          )}
          {mastered ? "Dominado" : "Marcar dominado"}
        </button>
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {concept.summary}
      </p>
      <p className="mt-3 text-sm leading-relaxed">
        <span className="text-foreground font-medium">Por qué importa: </span>
        <span className="text-muted-foreground">{concept.why}</span>
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Exercise                                                                    */
/* -------------------------------------------------------------------------- */

const EXERCISE_STATUSES: Array<{ value: ExerciseStatus; label: string }> = [
  { value: "todo", label: "Por hacer" },
  { value: "doing", label: "En curso" },
  { value: "done", label: "Hecho" },
];

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const { progress, setExerciseStatus } = useProgress();
  const status = progress.exercises[exercise.id]?.status ?? "todo";
  const isDone = status === "done";

  return (
    <article
      className={cn(
        "bg-card text-card-foreground rounded-xl border p-5 transition-colors",
        isDone && "border-primary/30",
      )}
    >
      <h3 className="flex items-center gap-2 font-medium">
        {isDone ? (
          <CheckCircle2 className="text-primary size-4" aria-hidden />
        ) : status === "doing" ? (
          <CircleDashed className="text-primary size-4" aria-hidden />
        ) : (
          <Circle className="text-muted-foreground size-4" aria-hidden />
        )}
        {exercise.title}
      </h3>

      <div className="prose-sm text-muted-foreground mt-3 text-sm leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-3 last:mb-0">{children}</p>
            ),
            strong: ({ children }) => (
              <strong className="text-foreground font-semibold">
                {children}
              </strong>
            ),
            code: ({ children }) => (
              <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-[0.85em]">
                {children}
              </code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-primary/40 mb-3 border-l-2 pl-3 italic">
                {children}
              </blockquote>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">
                {children}
              </ol>
            ),
            ul: ({ children }) => (
              <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">
                {children}
              </ul>
            ),
          }}
        >
          {exercise.description}
        </ReactMarkdown>
      </div>

      <div className="mt-4 inline-flex rounded-md border bg-muted/50 p-0.5">
        {EXERCISE_STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setExerciseStatus(exercise.id, s.value)}
            aria-pressed={status === s.value}
            className={cn(
              "focus-visible:ring-ring rounded px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
              status === s.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Notes                                                                       */
/* -------------------------------------------------------------------------- */

function NotesEditor({ sessionId }: { sessionId: string }) {
  const { progress, setSessionNotes } = useProgress();
  const stored = progress.sessions[sessionId]?.notes ?? "";
  const [draft, setDraft] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const value = draft ?? stored;
  const isDirty = draft !== null && draft !== stored;

  useEffect(() => {
    if (!isDirty || draft === null) return;
    const handle = window.setTimeout(() => {
      setSessionNotes(sessionId, draft);
      setSavedAt(new Date());
    }, 600);
    return () => window.clearTimeout(handle);
  }, [isDirty, draft, sessionId, setSessionNotes]);

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={value}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Tomá notas en Markdown — se guardan solas mientras escribís…"
        rows={10}
        className="min-h-48 resize-y font-mono text-sm leading-relaxed"
      />
      <p className="text-muted-foreground h-4 text-xs">
        {isDirty
          ? "Guardando…"
          : savedAt
            ? `Guardado · ${savedAt.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`
            : ""}
      </p>
    </div>
  );
}
