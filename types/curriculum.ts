/**
 * Curriculum types — STATIC content only.
 *
 * Per project rule: curriculum data does not carry user state.
 * Mastery, exercise status, notes, completion timestamps live in
 * `types/progress.ts` and are persisted in localStorage.
 */

export type Module = {
  id: string;
  number: number;
  title: string;
  description: string;
  estimatedHours: number;
  sessions: Session[];
};

export type Session = {
  id: string;
  number: number;
  title: string;
  concepts: Concept[];
  exercises: Exercise[];
};

export type Concept = {
  id: string;
  title: string;
  /** What the thing is, in 2-3 lines. */
  summary: string;
  /** Why it matters in practice. */
  why: string;
};

export type Exercise = {
  id: string;
  title: string;
  /** Markdown body with the steps. */
  description: string;
};
