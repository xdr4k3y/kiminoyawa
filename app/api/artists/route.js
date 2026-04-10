import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createSupabaseServerClient();

  const { data: artists, error: artistsError } = await supabase
    .from("artists")
    .select("id, slug, name, specialty, bio, image_url, location, statement")
    .order("name", { ascending: true });

  if (artistsError) {
    return NextResponse.json(
      { error: artistsError.message || "Failed to load artists." },
      { status: 500 },
    );
  }

  const { data: works, error: worksError } = await supabase
    .from("artist_works")
    .select("artist_id, title, year, medium")
    .order("year", { ascending: false });

  if (worksError) {
    return NextResponse.json(
      { error: worksError.message || "Failed to load artist works." },
      { status: 500 },
    );
  }

  const worksByArtistId = new Map();
  for (const work of works || []) {
    const current = worksByArtistId.get(work.artist_id) || [];
    current.push({
      title: work.title,
      year: String(work.year),
      medium: work.medium,
    });
    worksByArtistId.set(work.artist_id, current);
  }

  const payload = (artists || []).map((artist) => ({
    slug: artist.slug,
    name: artist.name,
    specialty: artist.specialty,
    bio: artist.bio,
    image: artist.image_url,
    location: artist.location,
    statement: artist.statement,
    works: worksByArtistId.get(artist.id) || [],
  }));

  return NextResponse.json({ data: payload });
}
