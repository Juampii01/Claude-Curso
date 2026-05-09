import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { modules } from "@/content/curriculum";
import { SessionView } from "@/components/session/session-view";

type Params = Promise<{ id: string; sessionId: string }>;

export function generateStaticParams(): Array<{ id: string; sessionId: string }> {
  return modules.flatMap((m) =>
    m.sessions.map((s) => ({ id: m.id, sessionId: s.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id, sessionId } = await params;
  const mod = modules.find((m) => m.id === id);
  const session = mod?.sessions.find((s) => s.id === sessionId);
  return { title: session?.title ?? "Sesión" };
}

export default async function SessionPage({ params }: { params: Params }) {
  const { id, sessionId } = await params;
  const mod = modules.find((m) => m.id === id);
  if (!mod) notFound();
  const session = mod.sessions.find((s) => s.id === sessionId);
  if (!session) notFound();

  return <SessionView module={mod} session={session} />;
}
