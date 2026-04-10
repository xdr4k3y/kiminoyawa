"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";

export default function ExhibitionsPage() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("All");
  const [loveCounts, setLoveCounts] = useState({});
  const [lovedItems, setLovedItems] = useState({});
  const [useAccountFavorites, setUseAccountFavorites] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadArtworks() {
      try {
        const response = await fetch("/api/artworks", { cache: "no-store" });
        const payload = await response.json();
        if (!cancelled) {
          setArtworks(Array.isArray(payload?.data) ? payload.data : []);
        }
      } catch {
        if (!cancelled) {
          setArtworks([]);
        }
      }
    }

    loadArtworks();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      try {
        const response = await fetch("/api/me/favorites", { cache: "no-store" });
        if (response.status === 401) {
          throw new Error("Not authenticated");
        }
        const payload = await response.json();
        const map = {};
        for (const item of payload?.data || []) {
          map[item.slug] = true;
        }
        if (!cancelled) {
          setUseAccountFavorites(true);
          setLovedItems(map);
          setLoveCounts({});
        }
      } catch {
        try {
          const storedCounts = JSON.parse(
            localStorage.getItem("kiminoyawa-love-counts") || "{}",
          );
          const storedLoved = JSON.parse(
            localStorage.getItem("kiminoyawa-loved-items") || "{}",
          );
          if (!cancelled) {
            setUseAccountFavorites(false);
            setLoveCounts(
              storedCounts && typeof storedCounts === "object" ? storedCounts : {},
            );
            setLovedItems(
              storedLoved && typeof storedLoved === "object" ? storedLoved : {},
            );
          }
        } catch {
          if (!cancelled) {
            setUseAccountFavorites(false);
            setLoveCounts({});
            setLovedItems({});
          }
        }
      }
    }

    loadFavorites();
    return () => {
      cancelled = true;
    };
  }, []);

  const exhibitionArtists = [
    "All",
    ...new Set(artworks.map((work) => work.artist).filter(Boolean)),
  ];

  const toggleLove = async (event, slug) => {
    event.preventDefault();
    event.stopPropagation();

    const isLoved = Boolean(lovedItems[slug]);
    const currentCount = Number(loveCounts[slug] || 0);
    const nextCount = isLoved
      ? Math.max(0, currentCount - 1)
      : currentCount + 1;

    const nextLoved = { ...lovedItems, [slug]: !isLoved };
    const nextCounts = { ...loveCounts, [slug]: nextCount };

    setLovedItems(nextLoved);
    setLoveCounts(nextCounts);

    if (useAccountFavorites) {
      try {
        await fetch(`/api/me/favorites/${slug}`, {
          method: isLoved ? "DELETE" : "PUT",
        });
      } catch {}
      return;
    }

    localStorage.setItem("kiminoyawa-loved-items", JSON.stringify(nextLoved));
    localStorage.setItem("kiminoyawa-love-counts", JSON.stringify(nextCounts));
  };

  const visibleArtworks =
    selectedArtist === "All"
      ? artworks
      : artworks.filter((work) => work.artist === selectedArtist);

  return (
    <main className="page-enter min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
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
                  <button
                    onClick={(event) => toggleLove(event, work.slug)}
                    aria-label={`Love ${work.title}`}
                    className={`absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border text-base backdrop-blur-sm transition ${
                      lovedItems[work.slug]
                        ? "border-[#c9a962] bg-[#c9a962]/20 text-[#f5f5f0]"
                        : "border-white/20 bg-black/35 text-[#f5f5f0]/90 hover:border-[#c9a962] hover:text-[#c9a962]"
                    }`}
                  >
                    <span>{lovedItems[work.slug] ? "\u2665" : "\u2661"}</span>
                  </button>
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
