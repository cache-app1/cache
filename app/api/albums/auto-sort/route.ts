import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const CATEGORY_LABELS: Record<string, string> = {
  recipe: "Recipes",
  outfit: "Outfits",
  travel: "Travel",
  quote: "Quotes",
  listing: "Listings",
  meme: "Memes",
  social: "Social Posts",
  receipt: "Receipts",
  other: "Other",
};

export async function POST() {
  const { data: ungrouped, error: fetchError } = await supabase
    .from("screenshots")
    .select("id, category")
    .is("album_id", null)
    .not("category", "is", null);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const byCategory = new Map<string, string[]>();
  for (const s of ungrouped ?? []) {
    if (!s.category) continue;
    const ids = byCategory.get(s.category) ?? [];
    ids.push(s.id);
    byCategory.set(s.category, ids);
  }

  const summary: { category: string; albumId: string; count: number }[] = [];

  for (const [category, ids] of byCategory) {
    const { data: existingAlbum } = await supabase
      .from("albums")
      .select("id")
      .eq("category", category)
      .maybeSingle();

    let albumId = existingAlbum?.id as string | undefined;

    if (!albumId) {
      const { data: newAlbum, error: createError } = await supabase
        .from("albums")
        .insert({ name: CATEGORY_LABELS[category] ?? category, category })
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      albumId = newAlbum.id;
    }

    const { error: updateError } = await supabase
      .from("screenshots")
      .update({ album_id: albumId })
      .in("id", ids);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    summary.push({ category, albumId: albumId!, count: ids.length });
  }

  return NextResponse.json({ sorted: summary });
}
