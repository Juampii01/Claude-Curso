import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <p className="text-primary text-xs font-medium tracking-widest uppercase">
        Reference
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
        Phase 3 placeholder. Reset progress, export / import JSON and theme
        controls land in Phase 6.
      </p>
    </div>
  );
}
