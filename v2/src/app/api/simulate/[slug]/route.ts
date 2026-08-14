import { NextRequest, NextResponse } from "next/server";
import { algorithmBySlug } from "@/lib/algorithms";
import { hasFullEntitlement } from "@/lib/entitlement";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const algorithm = algorithmBySlug.get(slug);
  if (!algorithm) return NextResponse.json({ error: "algorithm_not_found" }, { status: 404 });
  if (algorithm.tier === "pro" && !(await hasFullEntitlement())) {
    return NextResponse.json({ error: "entitlement_required" }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as { input?: unknown } | null;
  const input = Array.isArray(body?.input)
    ? body.input.filter((value): value is number => typeof value === "number" && Number.isFinite(value)).slice(0, 12)
    : undefined;
  const normalized = input && input.length >= 2 ? input : algorithm.defaultInput;
  return NextResponse.json({ steps: algorithm.buildSteps(normalized) });
}
