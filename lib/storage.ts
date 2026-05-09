import {
  PROGRESS_SCHEMA_VERSION,
  emptyProgress,
  type Progress,
} from "@/types/progress";

const STORAGE_KEY = "nova-learn:progress:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadProgress(): Progress {
  if (!isBrowser()) return emptyProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    if (parsed.schemaVersion !== PROGRESS_SCHEMA_VERSION) return emptyProgress;
    return {
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      masteredConcepts: parsed.masteredConcepts ?? {},
      exercises: parsed.exercises ?? {},
      sessions: parsed.sessions ?? {},
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: Progress): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function exportProgress(): string {
  return JSON.stringify(loadProgress(), null, 2);
}

export function importProgress(json: string): Progress {
  const parsed = JSON.parse(json) as Partial<Progress>;
  if (parsed.schemaVersion !== PROGRESS_SCHEMA_VERSION) {
    throw new Error(
      `Schema version mismatch: expected ${PROGRESS_SCHEMA_VERSION}, got ${String(parsed.schemaVersion)}`,
    );
  }
  const next: Progress = {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    masteredConcepts: parsed.masteredConcepts ?? {},
    exercises: parsed.exercises ?? {},
    sessions: parsed.sessions ?? {},
  };
  saveProgress(next);
  return next;
}
