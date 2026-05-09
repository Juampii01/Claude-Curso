"use client";

import { useCallback, useSyncExternalStore } from "react";

import { loadProgress, saveProgress } from "@/lib/storage";
import {
  emptyProgress,
  type ExerciseStatus,
  type Progress,
  type SessionStatus,
} from "@/types/progress";

const SYNC_EVENT = "nova-learn:progress-changed";

/* -------------------------------------------------------------------------- */
/* Module-level snapshot cache                                                 */
/*                                                                             */
/* `useSyncExternalStore` requires `getSnapshot` to return the SAME reference  */
/* between calls when the underlying data hasn't changed. We cache the result  */
/* of `loadProgress()` and invalidate the cache whenever a sync event fires    */
/* (custom event from a same-tab mutation, or the browser `storage` event     */
/* from another tab).                                                          */
/* -------------------------------------------------------------------------- */

let cachedSnapshot: Progress = emptyProgress;
let cacheValid = false;

function invalidateCache(): void {
  cacheValid = false;
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    invalidateCache();
    onChange();
  };
  window.addEventListener(SYNC_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(SYNC_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): Progress {
  if (typeof window === "undefined") return emptyProgress;
  if (!cacheValid) {
    cachedSnapshot = loadProgress();
    cacheValid = true;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): Progress {
  return emptyProgress;
}

function broadcast(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SYNC_EVENT));
}

/**
 * Read and mutate user progress.
 *
 * The hook is backed by `useSyncExternalStore`, so it stays in sync across
 * components in the same tab (via a custom event) and across tabs (via the
 * native `storage` event) without manual subscriptions.
 *
 * On the server and on the very first client render the hook returns
 * `emptyProgress`; React then re-renders with the real localStorage value
 * during the commit phase. Consumers can show a 0% baseline that animates to
 * the real value — no skeleton needed.
 */
export function useProgress() {
  const progress = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const update = useCallback(
    (mutator: (p: Progress) => Progress): void => {
      // Always read fresh from storage so we don't operate on a stale cache
      // if multiple mutators fire close together.
      const current = loadProgress();
      const next = mutator(current);
      saveProgress(next);
      invalidateCache();
      broadcast();
    },
    [],
  );

  const toggleConcept = useCallback(
    (conceptId: string): void => {
      update((p) => {
        const masteredConcepts = { ...p.masteredConcepts };
        if (masteredConcepts[conceptId]) {
          delete masteredConcepts[conceptId];
        } else {
          masteredConcepts[conceptId] = true;
        }
        return { ...p, masteredConcepts };
      });
    },
    [update],
  );

  const setExerciseStatus = useCallback(
    (exerciseId: string, status: ExerciseStatus): void => {
      update((p) => {
        const completedAt =
          status === "done" ? new Date().toISOString() : undefined;
        return {
          ...p,
          exercises: {
            ...p.exercises,
            [exerciseId]: { status, completedAt },
          },
        };
      });
    },
    [update],
  );

  const setSessionStatus = useCallback(
    (sessionId: string, status: SessionStatus): void => {
      update((p) => {
        const prev = p.sessions[sessionId];
        const completedAt =
          status === "completed"
            ? new Date().toISOString()
            : prev?.completedAt;
        return {
          ...p,
          sessions: {
            ...p.sessions,
            [sessionId]: {
              status,
              notes: prev?.notes ?? "",
              completedAt,
              notesUpdatedAt: prev?.notesUpdatedAt,
            },
          },
        };
      });
    },
    [update],
  );

  const setSessionNotes = useCallback(
    (sessionId: string, notes: string): void => {
      update((p) => {
        const prev = p.sessions[sessionId];
        return {
          ...p,
          sessions: {
            ...p.sessions,
            [sessionId]: {
              status: prev?.status ?? "not-started",
              completedAt: prev?.completedAt,
              notes,
              notesUpdatedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [update],
  );

  return {
    progress,
    toggleConcept,
    setExerciseStatus,
    setSessionStatus,
    setSessionNotes,
  };
}
