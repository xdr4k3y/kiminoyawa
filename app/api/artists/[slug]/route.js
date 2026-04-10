import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request, { params }) {
  const supabase = createSupabaseServerClient();
  const slug = params?.slug;

  if (!slug) {
    return NextResponse.json({ error: "Missing artist slug." }, { status: 400 });
  }

  const { data: artist, error: artistError } = await supabase
    .from("artists")
    .select("id, slug, name, specialty, bio, image_url, location, statement")
    .eq("slug", slug)
    .maybeSingle();

  if (artistError) {
    return NextResponse.json(
      { error: artistError.message || "Failed to load artist." },
      { status: 500 },
    );
  }

  if (!artist) {
    return NextResponse.json({ error: "Artist not found." }, { status: 404 });
  }

  const { data: works, error: worksError } = await supabase
    .from("artist_works")
    .select("title, year, medium")
    .eq("artist_id", artist.id)
    .order("year", { ascending: false });

  if (worksError) {
    return NextResponse.json(
      { error: worksError.message || "Failed to load artist works." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    data: {
      slug: artist.slug,
      name: artist.name,
      specialty: artist.specialty,
      bio: artist.bio,
      image: artist.image_url,
      location: artist.location,
      statement: artist.statement,
      works: (works || []).map((work) => ({
        title: work.title,
        year: String(work.year),
        medium: work.medium,
      })),
    },
  });
}
