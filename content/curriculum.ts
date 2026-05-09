import type { Module } from "@/types/curriculum";

/**
 * Curriculum data lives here. Components must NEVER hardcode learning content.
 *
 * Phase 3 ships the five module shells (id + metadata only). Module 1 sessions
 * are filled in Phase 4; modules 2–5 are intentionally placeholders.
 */
export const modules: Module[] = [
  {
    id: "module-1",
    number: 1,
    title: "Claude Code",
    description:
      "Sub-agentes, skills, MCP, hooks, settings, slash commands y worktrees.",
    estimatedHours: 12,
    sessions: [],
  },
  {
    id: "module-2",
    number: 2,
    title: "API y SDK a nivel producción",
    description:
      "Tool use, prompt caching, batch, streaming, rate limits.",
    estimatedHours: 10,
    sessions: [],
  },
  {
    id: "module-3",
    number: 3,
    title: "Agentes con n8n + Claude",
    description:
      "Loops, memoria, herramientas custom, integraciones (WhatsApp, Postgres).",
    estimatedHours: 14,
    sessions: [],
  },
  {
    id: "module-4",
    number: 4,
    title: "Arquitectura multi-LLM",
    description: "RAG, vector stores, routing, fallbacks, eval, costos.",
    estimatedHours: 12,
    sessions: [],
  },
  {
    id: "module-5",
    number: 5,
    title: "Operación y escalado",
    description:
      "Versionado de prompts, A/B testing, debugging en producción, migraciones.",
    estimatedHours: 10,
    sessions: [],
  },
];
