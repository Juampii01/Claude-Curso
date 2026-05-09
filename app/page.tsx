import { HomeDashboard } from "@/components/home/home-dashboard";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8 lg:py-12">
      <header className="mb-6 lg:mb-8">
        <p className="text-primary text-xs font-medium tracking-widest uppercase">
          Inicio
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Bienvenido de vuelta, Juampi.
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
          Tu plan para dominar Claude de punta a punta. Marcá conceptos como
          dominados y ejercicios como hechos en cada sesión — el progreso
          aparece acá.
        </p>
      </header>
      <HomeDashboard />
    </div>
  );
}
