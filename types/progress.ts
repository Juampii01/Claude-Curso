/**
 * User progress — DYNAMIC state persisted in localStorage.
 *
 * Kept separate from curriculum so static content can be edited freely
 * without touching saved progress, and progress can be exported/imported
 * as a single self-contained JSON document.
 */

export type ConceptId = string;
export type ExerciseId = string;
export type SessionId = string;

export type ExerciseStatus = "todo" | "doing" | "done";
export type SessionStatus = "not-started" | "in-progress" | "completed";

export type ExerciseProgress = {
  status: ExerciseStatus;
  /** ISO 8601 timestamp set when status flips to "done". */
  completedAt?: string;
};

export type SessionProgress = {
  status: SessionStatus;
  /** Markdown notes the user takes for this session. */
  notes: string;
  /** ISO 8601 timestamp set when status flips to "completed". */
  completedAt?: string;
  /** ISO 8601 timestamp updated whenever notes change. Drives "recent notes". */
  notesUpdatedAt?: string;
};

export type Progress = {
  /** Set of concept ids the user has marked as mastered. */
  masteredConcepts: Record<ConceptId, true>;
  exercises: Record<ExerciseId, ExerciseProgress>;
  sessions: Record<SessionId, SessionProgress>;
  /** Bump and write a migration if the shape changes. */
  schemaVersion: 1;
};

export const PROGRESS_SCHEMA_VERSION = 1 as const;

export const emptyProgress: Progress = {
  masteredConcepts: {},
  exercises: {},
  sessions: {},
  schemaVersion: PROGRESS_SCHEMA_VERSION,
};
