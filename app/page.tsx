/**
 * Phase 2 placeholder. The real home dashboard lands in Phase 4
 * (curriculum data + global progress overview).
 */
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <p className="text-primary text-xs font-medium tracking-widest uppercase">
        Nova Learn
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Scaffolding ready.
      </h1>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
        Project bootstrapped with Next.js, Tailwind v4 and shadcn/ui. The real
        layout, routes and dashboard land in subsequent phases.
      </p>
    </main>
  );
}
