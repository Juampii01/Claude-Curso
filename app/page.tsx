import { modules } from "@/content/curriculum";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <p className="text-primary text-xs font-medium tracking-widest uppercase">
        Home
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Welcome back.
      </h1>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
        Phase 3 placeholder. The real dashboard — global progress %, active
        module, next session, recent notes — lands in Phase 4 once the
        curriculum is loaded.
      </p>

      <p className="text-muted-foreground mt-8 text-xs tracking-widest uppercase">
        Plan overview
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {modules.map((m) => (
          <li
            key={m.id}
            className="bg-card text-card-foreground rounded-lg border p-4"
          >
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Module {String(m.number).padStart(2, "0")} · {m.estimatedHours}h
            </p>
            <p className="mt-1 text-sm font-medium">{m.title}</p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {m.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
