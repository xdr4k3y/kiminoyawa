import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentUserEmail } from "@/lib/server-user";

async function getArtworkId(supabase, slug) {
  const { data, error } = await supabase
    .from("artworks")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data?.id) return null;
  return data.id;
}

export async function PUT(request, { params }) {
  const email = await getCurrentUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const slug = params?.slug;
  if (!slug) {
    return NextResponse.json({ error: "Missing artwork slug." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const artworkId = await getArtworkId(supabase, slug);
  if (!artworkId) {
    return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
  }

  const { error } = await supabase
    .from("user_favorites")
    .upsert({ email, artwork_id: artworkId }, { onConflict: "email,artwork_id" });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to save favorite." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const email = await getCurrentUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const slug = params?.slug;
  if (!slug) {
    return NextResponse.json({ error: "Missing artwork slug." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const artworkId = await getArtworkId(supabase, slug);
  if (!artworkId) {
    return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
  }

  const { error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("email", email)
    .eq("artwork_id", artworkId);

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to remove favorite." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
