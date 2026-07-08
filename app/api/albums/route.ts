import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const auth = await requireUser(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase, user } = auth;

  const { name } = await request.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "no name" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("albums")
    .insert({ name, user_id: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function GET(request: Request) {
  const auth = await requireUser(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase } = auth;

  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}