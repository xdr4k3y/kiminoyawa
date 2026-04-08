"use client";

import { useState } from "react";
import Link from "next/link";
import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";
import { artworks, exhibitionArtists } from "@/data/artworks";

export default function ExhibitionsPage() {
  const [selectedArtist, setSelectedArtist] = useState("All");

  const visibleArtworks =
    selectedArtist === "All"
      ? artworks
      : artworks.filter((work) => work.artist === selectedArtist);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative flex min-h-[52vh] flex-col items-center justify-center bg-[linear-gradient(135deg,#0d0d0d_0%,#1a1a1a_100%)] px-6 pt-24 text-center">
        <div className="relative z-10">
          <p className="font-cormorant text-sm tracking-[0.4em] text-[#c9a962]/80">
            CURATED PROGRAM 2026
          </p>
          <h1 className="mt-3 font-cormorant text-[clamp(2.1rem,10vw,4.5rem)] font-light tracking-[0.18em] sm:tracking-[0.22em]">
            EXHIBITIONS
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 tracking-[0.08em] text-[#f5f5f0]/75 md:text-base">
            A living sequence of artist-led rooms featuring signature works,
            new pieces, and thematic installations across the Kiminoyawa
            collection.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20 pt-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap gap-3">
            {exhibitionArtists.map((artist) => {
              const isActive = selectedArtist === artist;
              return (
                <button
                  key={artist}
                  onClick={() => setSelectedArtist(artist)}
                  className={`border px-4 py-2 text-xs uppercase tracking-[0.2em] transition md:text-sm ${
                    isActive
                      ? "border-[#c9a962] bg-[#c9a962] text-[#0d0d0d]"
                      : "border-white/20 text-[#f5f5f0]/80 hover:border-[#c9a962] hover:text-[#c9a962]"
                  }`}
                >
                  {artist}
                </button>
              );
            })}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {visibleArtworks.map((work) => (
              <Link
                key={`${work.artist}-${work.title}`}
                href={`/exhibitions/${work.slug}`}
                className="group overflow-hidden border border-white/10 bg-[#111111]/70 transition duration-500 hover:-translate-y-1 hover:border-[#c9a962]/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={work.image}
                    alt={`${work.title} by ${work.artist}`}
                    className="h-full w-full object-cover brightness-90 transition duration-700 group-hover:scale-110 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                  <p className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.2em] text-[#c9a962]">
                    {work.artist}
                  </p>
                </div>
                <div className="p-5">
                  <h3 className="font-cormorant text-3xl font-light tracking-[0.08em] text-[#f5f5f0]">
                    {work.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#f5f5f0]/70">
                    {work.summary}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/65">
                    <span>{work.medium}</span>
                    <span>{work.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
