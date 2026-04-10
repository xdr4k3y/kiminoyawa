import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request, { params }) {
  const supabase = createSupabaseServerClient();
  const slug = params?.slug;

  if (!slug) {
    return NextResponse.json(
      { error: "Missing artwork slug." },
      { status: 400 },
    );
  }

  const { data: artwork, error } = await supabase
    .from("artworks")
    .select(
      "slug, title, medium, year, image_url, dimensions, price, summary, details, artists(name, slug)",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load artwork." },
      { status: 500 },
    );
  }

  if (!artwork) {
    return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
  }

  const artist = Array.isArray(artwork.artists)
    ? artwork.artists[0]
    : artwork.artists;

  return NextResponse.json({
    data: {
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
    },
  });
}
