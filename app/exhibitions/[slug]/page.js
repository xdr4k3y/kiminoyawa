import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";
import AddToCartButton from "@/components/AddToCartButton";
import { createSupabaseServerClient } from "@/lib/supabase";

async function getArtworkBySlug(slug) {
  const supabase = createSupabaseServerClient();
  const { data: artwork, error } = await supabase
    .from("artworks")
    .select(
      "slug, title, medium, year, image_url, dimensions, price, summary, details, artists(name)",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !artwork) {
    return null;
  }

  const artist = Array.isArray(artwork.artists)
    ? artwork.artists[0]
    : artwork.artists;

  return {
    slug: artwork.slug,
    title: artwork.title,
    artist: artist?.name || "",
    medium: artwork.medium,
    year: String(artwork.year),
    image: artwork.image_url,
    dimensions: artwork.dimensions,
    price: Number(artwork.price),
    summary: artwork.summary,
    details: artwork.details,
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return { title: "Artwork Not Found | Kiminoyawa Gallery" };
  }

  return {
    title: `${artwork.title} | Kiminoyawa Gallery`,
    description: artwork.summary,
  };
}

export default async function ExhibitionArtworkPage({ params }) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  return (
    <main className="page-enter min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative bg-[linear-gradient(135deg,#0d0d0d_0%,#1a1a1a_100%)] px-6 pb-10 pt-28 md:px-10">
        <div className="relative z-10 mx-auto max-w-7xl">
          <Link
            href="/exhibitions"
            className="text-xs uppercase tracking-[0.2em] text-[#c9a962] transition hover:text-[#f5f5f0]"
          >
            {"<"} Back to Exhibitions
          </Link>
          <div className="mt-6 grid gap-10 md:grid-cols-[1.2fr_1fr]">
            <div className="overflow-hidden border border-white/10">
              <img
                src={artwork.image}
                alt={`${artwork.title} by ${artwork.artist}`}
                className="h-[420px] w-full object-cover md:h-[620px]"
              />
            </div>
            <div className="self-center">
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9a962]">
                {artwork.artist}
              </p>
              <h1 className="mt-3 font-cormorant text-[clamp(2rem,6vw,4rem)] font-light tracking-[0.1em]">
                {artwork.title}
              </h1>
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#f5f5f0]/60">
                {artwork.medium} · {artwork.year}
              </p>
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#f5f5f0]/60">
                {artwork.dimensions}
              </p>
              <p className="mt-6 text-base font-medium tracking-normal text-[#f5f5f0]">
                Price: ${artwork.price.toLocaleString()}
              </p>
              <div className="mt-8">
                <AddToCartButton
                  artwork={{
                    slug: artwork.slug,
                    title: artwork.title,
                    artist: artwork.artist,
                    image: artwork.image,
                    price: artwork.price,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <article className="mb-8 border border-white/10 bg-white/[0.02] p-8">
            <h2 className="font-cormorant text-4xl font-light tracking-[0.08em] text-[#c9a962]">
              Preview In Room
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#f5f5f0]/75">
              This mockup gives a quick look at how the artwork can appear in a
              real interior before purchase.
            </p>
            <div className="mt-6 overflow-hidden border border-white/15 bg-black/30 p-3">
              <div className="relative mx-auto max-w-5xl">
                <img
                  src="/images/mockup.jpg"
                  alt="Interior wall mockup"
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-[30%] top-[25%] w-[39%] border-4 border-[#2a2a2a] bg-[#111] p-2 shadow-[0_20px_45px_rgba(0,0,0,0.55)] md:left-[33%] md:top-[23%] md:w-[33%]">
                  <img
                    src={artwork.image}
                    alt={`${artwork.title} room preview`}
                    className="aspect-[4/5] h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-8 md:grid-cols-2">
          <article className="border border-white/10 bg-white/[0.02] p-8">
            <h2 className="font-cormorant text-4xl font-light tracking-[0.08em] text-[#c9a962]">
              Summary
            </h2>
            <p className="mt-5 text-base leading-8 text-[#f5f5f0]/80">
              {artwork.summary}
            </p>
          </article>
          <article className="border border-white/10 bg-white/[0.02] p-8">
            <h2 className="font-cormorant text-4xl font-light tracking-[0.08em] text-[#c9a962]">
              Details
            </h2>
            <p className="mt-5 text-base leading-8 text-[#f5f5f0]/80">
              {artwork.details}
            </p>
          </article>
          </div>
        </div>
      </section>
    </main>
  );
}
