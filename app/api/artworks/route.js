import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request) {
  const supabase = createSupabaseServerClient();
  const artistSlug = request.nextUrl.searchParams.get("artist");

  let query = supabase
    .from("artworks")
    .select(
      "slug, title, medium, year, image_url, dimensions, price, summary, details, artists(name, slug)",
    )
    .order("year", { ascending: false });

  if (artistSlug) {
    const { data: artist, error: artistError } = await supabase
      .from("artists")
      .select("id")
      .eq("slug", artistSlug)
      .maybeSingle();

    if (artistError) {
      return NextResponse.json(
        { error: artistError.message || "Failed to load artist filter." },
        { status: 500 },
      );
    }

    if (!artist) {
      return NextResponse.json({ data: [] });
    }

    query = query.eq("artist_id", artist.id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load artworks." },
      { status: 500 },
    );
  }

  const payload = (data || []).map((artwork) => {
    const artist = Array.isArray(artwork.artists)
      ? artwork.artists[0]
      : artwork.artists;

    return {
      slug: artwork.slug,
      title: artwork.title,
      artist: artist?.name || null,
      artistSlug: artist?.slug || null,
      medium: artwork.medium,
      year: String(artwork.year),
      image: artwork.image_url,
      dimensions: artwork.dimensions,
      price: Number(artwork.price),
      summary: artwork.summary,
      details: artwork.details,
    };
  });

  return NextResponse.json({ data: payload });
}
