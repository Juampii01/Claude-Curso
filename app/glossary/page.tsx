import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glosario",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <p className="text-primary text-xs font-medium tracking-widest uppercase">
        Referencia
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Glosario</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
        Lista buscable de términos (CLAUDE.md, MCP, sub-agente, skill, hook,
        RAG, vector store, …). Disponible en una fase posterior.
      </p>
    </div>
  );
}
