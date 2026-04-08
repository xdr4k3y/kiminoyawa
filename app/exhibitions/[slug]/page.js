import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";
import AddToCartButton from "@/components/AddToCartButton";
import { artworks, getArtworkBySlug } from "@/data/artworks";

export function generateStaticParams() {
  return artworks.map((artwork) => ({ slug: artwork.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);

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
  const artwork = getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
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
              <p className="mt-6 font-cormorant text-4xl font-light tracking-[0.08em] text-[#c9a962]">
                ${artwork.price.toLocaleString()}
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
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
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
      </section>
    </main>
  );
}
