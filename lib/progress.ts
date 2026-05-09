import type { Module, Session } from "@/types/curriculum";
import type { Progress, SessionStatus } from "@/types/progress";

/* -------------------------------------------------------------------------- */
/* Counts                                                                      */
/* -------------------------------------------------------------------------- */

export type ItemCounts = {
  concepts: number;
  exercises: number;
  total: number;
};

export function countSessionItems(session: Session): ItemCounts {
  const concepts = session.concepts.length;
  const exercises = session.exercises.length;
  return { concepts, exercises, total: concepts + exercises };
}

export function countSessionDone(session: Session, progress: Progress): number {
  const masteredConcepts = session.concepts.filter(
    (c) => progress.masteredConcepts[c.id],
  ).length;
  const doneExercises = session.exercises.filter(
    (e) => progress.exercises[e.id]?.status === "done",
  ).length;
  return masteredConcepts + doneExercises;
}

/* -------------------------------------------------------------------------- */
/* Percentages                                                                 */
/* -------------------------------------------------------------------------- */

function pct(done: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

export function sessionPercent(session: Session, progress: Progress): number {
  return pct(countSessionDone(session, progress), countSessionItems(session).total);
}

export function modulePercent(module: Module, progress: Progress): number {
  let done = 0;
  let total = 0;
  for (const s of module.sessions) {
    total += countSessionItems(s).total;
    done += countSessionDone(s, progress);
  }
  return pct(done, total);
}

export function globalPercent(modules: Module[], progress: Progress): number {
  let done = 0;
  let total = 0;
  for (const m of modules) {
    for (const s of m.sessions) {
      total += countSessionItems(s).total;
      done += countSessionDone(s, progress);
    }
  }
  return pct(done, total);
}

/* -------------------------------------------------------------------------- */
/* Status                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Resolved session status. Honors a manually set status when present,
 * otherwise derives from concept/exercise tallies.
 */
export function resolveSessionStatus(
  session: Session,
  progress: Progress,
): SessionStatus {
  const stored = progress.sessions[session.id]?.status;
  if (stored === "completed") return "completed";

  const total = countSessionItems(session).total;
  const done = countSessionDone(session, progress);

  if (total === 0) return stored ?? "not-started";
  if (done === 0) return stored ?? "not-started";
  return "in-progress";
}

/* -------------------------------------------------------------------------- */
/* Discovery helpers                                                           */
/* -------------------------------------------------------------------------- */

export function findActiveModule(
  modules: Module[],
  progress: Progress,
): Module | null {
  // First module that's been started but isn't 100%.
  const inProgress = modules.find((m) => {
    const p = modulePercent(m, progress);
    return p > 0 && p < 100;
  });
  if (inProgress) return inProgress;

  // Otherwise, first module with content that isn't 100%.
  const upcoming = modules.find((m) => {
    const hasContent = m.sessions.some(
      (s) => s.concepts.length + s.exercises.length > 0,
    );
    return hasContent && modulePercent(m, progress) < 100;
  });
  if (upcoming) return upcoming;

  return modules[0] ?? null;
}

export type NextSession = { module: Module; session: Session };

export function findNextSession(
  modules: Module[],
  progress: Progress,
): NextSession | null {
  for (const m of modules) {
    for (const s of m.sessions) {
      const hasContent = s.concepts.length + s.exercises.length > 0;
      if (!hasContent) continue;
      if (resolveSessionStatus(s, progress) !== "completed") {
        return { module: m, session: s };
      }
    }
  }
  return null;
}

export type RecentNote = {
  module: Module;
  session: Session;
  notes: string;
  notesUpdatedAt?: string;
};

export function findRecentNotes(
  modules: Module[],
  progress: Progress,
  limit: number,
): RecentNote[] {
  const items: RecentNote[] = [];
  for (const m of modules) {
    for (const s of m.sessions) {
      const sp = progress.sessions[s.id];
      if (sp?.notes && sp.notes.trim().length > 0) {
        items.push({
          module: m,
          session: s,
          notes: sp.notes,
          notesUpdatedAt: sp.notesUpdatedAt,
        });
      }
    }
  }
  // Latest first; entries without a timestamp sort to the bottom.
  items.sort((a, b) => {
    const ta = a.notesUpdatedAt ?? "";
    const tb = b.notesUpdatedAt ?? "";
    return tb.localeCompare(ta);
  });
  return items.slice(0, limit);
}
