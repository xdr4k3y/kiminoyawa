"use client";

import { useEffect } from "react";
import Link from "next/link";
import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";
import { artists } from "@/data/artists";

export default function ArtistsPage() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const delay = Number(entry.target.getAttribute("data-delay") || "0");
          setTimeout(() => entry.target.classList.add("is-visible"), delay);
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative flex min-h-[50vh] flex-col items-center justify-center bg-[linear-gradient(135deg,#0d0d0d_0%,#1a1a1a_100%)] pt-24">
        <div className="relative z-10 text-center">
          <h1
            data-reveal
            className="reveal-item font-cormorant text-[clamp(2.1rem,9vw,4.2rem)] font-light tracking-[0.2em] sm:tracking-[0.3em]"
          >
            ARTISTS
          </h1>
          <p
            data-reveal
            data-delay="100"
            className="reveal-item mt-4 font-cormorant text-[clamp(0.95rem,3.2vw,1.25rem)] font-light tracking-[0.12em] sm:tracking-[0.2em] text-[#c9a962]"
          >
            Visionaries shaping contemporary expression
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a] px-8 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 xl:grid-cols-3">
          {artists.map((artist, index) => (
            <article
              key={artist.name}
              data-reveal
              data-delay={String(index * 100)}
              className="reveal-item group overflow-hidden border border-[#c9a962]/15 bg-white/[0.02] transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-[#c9a962]/35 hover:shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="artist-image-wrap relative h-[420px] overflow-hidden md:h-[450px]">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="artist-image h-full w-full object-cover grayscale brightness-90 contrast-110 transition duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100"
                />
                <div className="artist-overlay absolute inset-0 z-10 flex items-center justify-center bg-[#0d0d0d]/70 opacity-0 pointer-events-none backdrop-blur-sm transition duration-300">
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="artist-overlay-button inline-flex translate-y-3 border border-[#c9a962] px-8 py-3 text-xs uppercase tracking-[0.2em] text-[#c9a962] opacity-0 transition duration-300 hover:bg-[#c9a962] hover:text-[#0d0d0d]"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-b from-transparent to-black/40 p-8 text-center">
                <h3 className="font-cormorant text-[clamp(1.5rem,4.5vw,1.9rem)] font-normal tracking-[0.12em] text-[#f5f5f0] transition group-hover:text-[#c9a962]">
                  {artist.name}
                </h3>
                <p className="mt-2 text-[clamp(0.62rem,1.8vw,0.75rem)] uppercase tracking-[0.18em] text-[#c9a962]">
                  {artist.specialty}
                </p>
                <p className="mt-4 text-[clamp(0.85rem,2.2vw,0.95rem)] font-light leading-7 text-[#f5f5f0]/70 transition group-hover:text-[#f5f5f0]/90">
                  {artist.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
