import { HomeDashboard } from "@/components/home/home-dashboard";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8 lg:py-12">
      <header className="mb-6 lg:mb-8">
        <p className="text-primary text-xs font-medium tracking-widest uppercase">
          Home
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Welcome back, Juampi.
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
          Your plan to master Claude end-to-end. Mark concepts as mastered and
          exercises as done from each session — progress lands here.
        </p>
      </header>
      <HomeDashboard />
    </div>
  );
}
