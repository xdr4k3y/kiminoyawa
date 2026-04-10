import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentUserEmail } from "@/lib/server-user";

export async function GET() {
  const email = await getCurrentUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_favorites")
    .select(
      "created_at, artworks(slug, title, image_url, price, artists(name, slug))",
    )
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load favorites." },
      { status: 500 },
    );
  }

  const payload = (data || []).map((entry) => {
    const artwork = Array.isArray(entry.artworks) ? entry.artworks[0] : entry.artworks;
    const artist = Array.isArray(artwork?.artists)
      ? artwork.artists[0]
      : artwork?.artists;
    return {
      slug: artwork?.slug || "",
      title: artwork?.title || "",
      image: artwork?.image_url || "",
      price: Number(artwork?.price || 0),
      artist: artist?.name || "",
      artistSlug: artist?.slug || "",
      createdAt: entry.created_at,
    };
  });

  return NextResponse.json({ data: payload });
}
