import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { embedText } from "@/lib/embeddings";

export async function POST(request: Request) {
  const auth = await requireUser(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase } = auth;

  const { query } = await request.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "no query" }, { status: 400 });
  }

  const embedding = await embedText(query);

  const { data, error } = await supabase.rpc("match_screenshots", {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: 10,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}