export type GlossaryTerm = {
  id: string;
  /** The term itself, e.g. "CLAUDE.md". */
  term: string;
  /** Short, plain-language definition. */
  definition: string;
  /** Optional synonyms or aliases for search. */
  aliases?: string[];
  /** Module this term first appears in, for context. */
  introducedIn?: string;
};
