import type { Metadata } from "next";

type Params = Promise<{ id: string; sessionId: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { sessionId } = await params;
  return { title: `Session ${sessionId}` };
}

export default async function SessionPage({ params }: { params: Params }) {
  const { id, sessionId } = await params;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <p className="text-primary text-xs font-medium tracking-widest uppercase">
        Session
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {sessionId}
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
        Module <code className="font-mono text-xs">{id}</code>. Phase 3
        placeholder — concepts, exercises and the notes editor land in Phase 5.
      </p>
    </div>
  );
}
