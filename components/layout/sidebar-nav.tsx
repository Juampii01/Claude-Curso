"use client";

import { BookOpen, BookText, Settings } from "lucide-react";

import { modules } from "@/content/curriculum";

import { SidebarLink } from "./sidebar-link";

type Props = {
  /** Called when any link is clicked — used by the mobile sheet to close itself. */
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: Props) {
  return (
    <nav aria-label="Principal" className="flex flex-col gap-6 px-3 py-4">
      <Section title="Módulos">
        {modules.map((m) => (
          <SidebarLink
            key={m.id}
            href={`/module/${m.id}`}
            label={`${String(m.number).padStart(2, "0")} · ${m.title}`}
            icon={BookOpen}
            matchPrefix
            onNavigate={onNavigate}
          />
        ))}
      </Section>
      <Section title="Referencia">
        <SidebarLink
          href="/glossary"
          label="Glosario"
          icon={BookText}
          onNavigate={onNavigate}
        />
        <SidebarLink
          href="/settings"
          label="Ajustes"
          icon={Settings}
          onNavigate={onNavigate}
        />
      </Section>
    </nav>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-muted-foreground px-3 text-xs font-medium tracking-widest uppercase">
        {title}
      </p>
      <div className="mt-2 flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
