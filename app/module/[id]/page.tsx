import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { modules } from "@/content/curriculum";

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
  return { title: mod?.title ?? "Module" };
}

export default async function ModulePage({ params }: { params: Params }) {
  const { id } = await params;
  const mod = modules.find((m) => m.id === id);
  if (!mod) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <p className="text-primary text-xs font-medium tracking-widest uppercase">
        Module {String(mod.number).padStart(2, "0")} · ~{mod.estimatedHours}h
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {mod.title}
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
        {mod.description}
      </p>

      <p className="text-muted-foreground mt-10 text-xs">
        Phase 3 placeholder. Sessions list lands in Phase 4 (Module 1) and
        Phase 4+ (Modules 2–5).
      </p>
    </div>
  );
}
