import type { Module } from "@/types/curriculum";

/**
 * Curriculum data lives here. Components must NEVER hardcode learning content.
 *
 * Module 1 ships sessions 1–2 with detailed concepts and exercises.
 * Sessions 3–4 of Module 1 and modules 2–5 are intentional shells that get
 * filled when each one is approached for real.
 */
export const modules: Module[] = [
  {
    id: "module-1",
    number: 1,
    title: "Claude Code",
    description:
      "Sub-agentes, skills, MCP, hooks, settings, slash commands y worktrees.",
    estimatedHours: 12,
    sessions: [
      {
        id: "module-1-session-1",
        number: 1,
        title: "CLAUDE.md, sub-agentes y worktrees",
        concepts: [
          {
            id: "m1-s1-c1",
            title: "CLAUDE.md",
            summary:
              "Archivo Markdown en la raíz del repo (o en ~/.claude/) que Claude Code lee al arrancar para tomar contexto del proyecto.",
            why: "Acota el espacio de búsqueda del modelo. Sin él, Claude infiere convenciones; con él, respeta las que vos definís. Es la diferencia entre un agente útil y uno que reescribe estilos a su gusto.",
          },
          {
            id: "m1-s1-c2",
            title: "Sub-agentes con la Task tool",
            summary:
              "Spawn de un agente paralelo desde el agente principal vía la tool Task. Cada uno arranca con contexto vacío y un brief escrito.",
            why: "Aísla trabajo costoso (auditorías, búsquedas amplias, refactors masivos) para que el agente principal no consuma tokens leyendo lo que no le importa. El sub-agente devuelve un summary, no su transcript completo.",
          },
          {
            id: "m1-s1-c3",
            title: "Worktrees automáticos",
            summary:
              "Claude Code puede ejecutar tareas en un git worktree separado en .claude/worktrees/<name> para no contaminar tu working tree.",
            why: "Permite probar cambios riesgosos, correr varios agentes en paralelo sobre el mismo repo, o dejar a Claude trabajando en background mientras vos seguís con otra cosa en main.",
          },
        ],
        exercises: [
          {
            id: "m1-s1-e1",
            title: "Crear CLAUDE.md en un proyecto propio",
            description:
              "Elegí Nova Scaling Dashboard, Smart Scale o Vendly.\n\nEscribí un `CLAUDE.md` de ≤80 líneas que cubra:\n\n- Stack y versiones críticas.\n- Estructura de carpetas con una línea por carpeta.\n- Convenciones (naming, imports, commits).\n- Anti-patterns que NO querés que use.\n- Comandos comunes (`pnpm dev`, `pnpm test`, etc.).\n\nProbalo abriendo Claude Code en ese repo y haciendo una pregunta como \"¿dónde definimos la lógica de pricing?\". Si la respuesta es vaga, falta contexto en el CLAUDE.md.",
          },
          {
            id: "m1-s1-e2",
            title: "Lanzar un sub-agente para auditar deuda técnica",
            description:
              "En cualquiera de tus proyectos, pedile a Claude Code:\n\n> Lanzá un sub-agente que recorra el repo y devuelva las 5 deudas técnicas más altas en una lista priorizada (TODO/FIXME, código duplicado, archivos >500 líneas, typos en types, TODOs sin issue).\n\nEl sub-agente debe devolver SOLO la lista, no el detalle de cada hallazgo. La idea es practicar el límite de scope del sub-agente.",
          },
          {
            id: "m1-s1-e3",
            title: "Mergear o cerrar un PR generado por Claude Code",
            description:
              "Pedile a Claude Code que haga un cambio chico (rename de una variable, sumar un comentario JSDoc, lo que sea) en un worktree.\n\nQue abra un PR. Vos revisás el diff, te asegurás de entender qué cambió, y o bien hacés merge o lo cerrás con un comentario explicando qué te molestó.\n\nEl objetivo es internalizar el flujo, no el cambio.",
          },
        ],
      },
      {
        id: "module-1-session-2",
        number: 2,
        title: "MCP servers",
        concepts: [
          {
            id: "m1-s2-c1",
            title: "Qué es MCP",
            summary:
              "Model Context Protocol. Estándar abierto que define cómo un LLM se conecta a herramientas externas (Postgres, Slack, GitHub, lo que sea) sin que cada cliente reimplemente cada integración.",
            why: "Antes cada herramienta era una integración custom. MCP convierte \"conectar Claude a X\" en \"instalar el server MCP de X\". Tu skill operativa cambia de programar integraciones a elegirlas y configurarlas bien.",
          },
          {
            id: "m1-s2-c2",
            title: "Transports: stdio vs HTTP",
            summary:
              "Un MCP server puede correr como subprocess local (stdio) o como servicio HTTP remoto. stdio es el default y el más rápido; HTTP sirve para servers compartidos.",
            why: "Para uso personal, todo stdio. Si querés exponer un MCP server a varios clientes (otros agentes, otros devs), HTTP. Saber cuándo elegir cada uno evita errores de latencia y de seguridad.",
          },
          {
            id: "m1-s2-c3",
            title: "Servers prioritarios",
            summary:
              "Los que de verdad cambian tu día a día: Supabase (queries sobre tu DB), GitHub (issues, PRs, code search), Filesystem (archivos fuera del proyecto), Vercel (logs, deploys, env vars).",
            why: "80% del valor con 4 instalaciones. El resto del catálogo es nice-to-have y suma ruido al picker de tools si lo instalás todo.",
          },
          {
            id: "m1-s2-c4",
            title: "El flag --read-only",
            summary:
              "La mayoría de servers MCP críticos (Supabase, GitHub, Filesystem) aceptan un flag --read-only que bloquea writes.",
            why: "Default safety. Probás todo en read-only primero. Recién cuando confiás, sacás el flag para una operación específica. Un `rm -rf` de Claude en producción es 100% prevenible si nunca le diste write.",
          },
        ],
        exercises: [
          {
            id: "m1-s2-e1",
            title: "Instalar Supabase MCP en read-only",
            description:
              "Configurá el MCP server de Supabase apuntando al proyecto de Smart Scale. Empezá con `--read-only`.\n\nVerificá en `mcp list` que aparece como readonly. Si tu config queda en `.claude/settings.json`, **no commitees el service role key** — usá una env var.",
          },
          {
            id: "m1-s2-e2",
            title: "Probarlo con 3 queries",
            description:
              "Pedile a Claude tres queries reales:\n\n1. ¿Cuántos usuarios activos hay esta semana?\n2. ¿Cuál es la última transacción registrada?\n3. Describime el schema de la tabla más grande.\n\nVerificá que las tres corren sin pedir write. Si pide, falta el flag.",
          },
          {
            id: "m1-s2-e3",
            title: "Agregar al CLAUDE.md la sección MCP",
            description:
              "En el `CLAUDE.md` del proyecto, agregá una sección `## MCP` con:\n\n- Qué servers están instalados.\n- Cuáles están en read-only y cuáles no.\n- Qué tipo de queries son apropiadas para cada uno.\n\nEsto le ahorra a Claude (y a vos) preguntar \"qué tools tengo disponibles\" cada vez.",
          },
        ],
      },
      {
        id: "module-1-session-3",
        number: 3,
        title: "Skills personalizadas y settings.json",
        concepts: [],
        exercises: [],
      },
      {
        id: "module-1-session-4",
        number: 4,
        title: "Slash commands custom y hooks",
        concepts: [],
        exercises: [],
      },
    ],
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
