import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { modules } from "@/content/curriculum";
import { ModuleSessionsList } from "@/components/module/sessions-list";

type Params = Promise<{ id: string }>;

export function generateStaticParams(): Array<{ id: string }> {
  return modules.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const mod = modules.find((m) => m.id === id);
  return { title: mod?.title ?? "Módulo" };
}

export default async function ModulePage({ params }: { params: Params }) {
  const { id } = await params;
  const mod = modules.find((m) => m.id === id);
  if (!mod) notFound();

  const totalConcepts = mod.sessions.reduce((acc, s) => acc + s.concepts.length, 0);
  const totalExercises = mod.sessions.reduce(
    (acc, s) => acc + s.exercises.length,
    0,
  );

  const sessionsLabel =
    mod.sessions.length === 1 ? "1 sesión" : `${mod.sessions.length} sesiones`;
  const conceptsLabel =
    totalConcepts === 1 ? "1 concepto" : `${totalConcepts} conceptos`;
  const exercisesLabel =
    totalExercises === 1 ? "1 ejercicio" : `${totalExercises} ejercicios`;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:px-8 lg:py-12">
      <header className="mb-8">
        <p className="text-primary text-xs font-medium tracking-widest uppercase">
          Módulo {String(mod.number).padStart(2, "0")} · ~{mod.estimatedHours}h
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {mod.title}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          {mod.description}
        </p>
        <p className="text-muted-foreground mt-4 text-xs">
          {sessionsLabel}
          {totalConcepts + totalExercises > 0
            ? ` · ${conceptsLabel} · ${exercisesLabel}`
            : ""}
        </p>
      </header>

      <ModuleSessionsList moduleId={mod.id} />
    </div>
  );
}
