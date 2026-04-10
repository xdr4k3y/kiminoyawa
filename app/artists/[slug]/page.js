import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";
import { createSupabaseServerClient } from "@/lib/supabase";

async function getArtistBySlug(slug) {
  const supabase = createSupabaseServerClient();
  const { data: artist, error: artistError } = await supabase
    .from("artists")
    .select("id, slug, name, specialty, bio, image_url, location, statement")
    .eq("slug", slug)
    .maybeSingle();

  if (artistError || !artist) {
    return null;
  }

  const { data: works } = await supabase
    .from("artist_works")
    .select("title, year, medium")
    .eq("artist_id", artist.id)
    .order("year", { ascending: false });

  return {
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
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) {
    return {
      title: "Artist Not Found | Kiminoyawa Gallery",
    };
  }

  return {
    title: `${artist.name} | Kiminoyawa Gallery`,
    description: artist.bio,
  };
}

export default async function ArtistProfilePage({ params }) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  return (
    <main className="page-enter min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative bg-[linear-gradient(135deg,#0d0d0d_0%,#1a1a1a_100%)] px-6 pb-12 pt-28 md:px-12">
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="font-cormorant text-xs uppercase tracking-[0.35em] text-[#c9a962]/80">
              Artist Profile
            </p>
            <h1 className="mt-4 font-cormorant text-[clamp(2.1rem,8vw,4.2rem)] font-light tracking-[0.12em]">
              {artist.name}
            </h1>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[#c9a962]">
              {artist.specialty}
            </p>
            <p className="mt-6 max-w-2xl text-[clamp(0.95rem,2.6vw,1.05rem)] leading-8 text-[#f5f5f0]/80">
              {artist.bio}
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/60">
              Based in {artist.location}
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/artists"
                className="border border-[#c9a962] px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#c9a962] transition hover:bg-[#c9a962] hover:text-[#0d0d0d]"
              >
                Back to Artists
              </Link>
              <Link
                href="/exhibitions"
                className="border border-white/20 px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/85 transition hover:border-[#c9a962] hover:text-[#c9a962]"
              >
                View Exhibitions
              </Link>
            </div>
          </div>

          <div className="overflow-hidden border border-[#c9a962]/20">
            <img
              src={artist.image}
              alt={artist.name}
              className="h-[420px] w-full object-cover md:h-[560px]"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_1fr]">
          <article className="border border-white/10 bg-white/[0.02] p-8">
            <h2 className="font-cormorant text-3xl font-light tracking-[0.1em] text-[#c9a962]">
              Artist Statement
            </h2>
            <p className="mt-5 text-[clamp(1rem,2.5vw,1.1rem)] leading-8 text-[#f5f5f0]/80">
              "{artist.statement}"
            </p>
          </article>

          <article className="border border-white/10 bg-white/[0.02] p-8">
            <h2 className="font-cormorant text-3xl font-light tracking-[0.1em] text-[#c9a962]">
              Selected Works
            </h2>
            <ul className="mt-6 space-y-4">
              {artist.works.map((work) => (
                <li
                  key={`${artist.slug}-${work.title}`}
                  className="border-b border-white/10 pb-4"
                >
                  <p className="font-cormorant text-2xl font-light tracking-[0.08em]">
                    {work.title}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/65">
                    {work.medium} · {work.year}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
