"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";

const slides = [
  {
    src: "/images/3.jpg",
    alt: "Contemporary Exhibition Space",
    title: "The Concrete Void",
    desc: "Industrial elegance meets artistic expression",
  },
  {
    src: "/images/1.jpg",
    alt: "Modern Gallery Hall",
    title: "Monochrome Hall",
    desc: "Photography and light installations",
  },
  {
    src: "/images/2.jpg",
    alt: "Design Gallery Space",
    title: "The Atelier",
    desc: "Sculpture and contemporary design",
  },
  {
    src: "/images/4.jpg",
    alt: "Futuristic Gallery",
    title: "White Canvas",
    desc: "Minimalist purity for bold visions",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
      if (event.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative flex flex-col items-center bg-[linear-gradient(135deg,#0d0d0d_0%,#1a1a1a_100%)] pt-28">
        <div className="relative z-10 mb-0 text-center">
          <h1 className="font-cormorant text-[clamp(2.2rem,9vw,4.8rem)] font-light tracking-[0.2em] sm:tracking-[0.28em]">
            KIMINOYAWA
          </h1>
          <p className="mt-4 font-cormorant text-[clamp(0.95rem,3.2vw,1.25rem)] font-light tracking-[0.12em] sm:tracking-[0.2em] text-[#c9a962]">
            Where Art Meets Serenity
          </p>
        </div>

        <div className="relative z-10 mt-6 w-full">
          <div
            className="relative h-[48vh] min-h-[320px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.6)] md:h-[56vh]"
            onTouchStart={(event) => {
              event.currentTarget.dataset.touchStartX = String(
                event.changedTouches[0].screenX,
              );
            }}
            onTouchEnd={(event) => {
              const touchStartX = Number(
                event.currentTarget.dataset.touchStartX || "0",
              );
              const touchEndX = event.changedTouches[0].screenX;
              if (touchStartX - touchEndX > 50) nextSlide();
              if (touchEndX - touchStartX > 50) prevSlide();
            }}
          >
            {slides.map((slide, index) => (
              <article
                key={slide.title}
                className={`absolute inset-0 transition-all duration-[1200ms] ${
                  index === currentSlide
                    ? "scale-100 opacity-100"
                    : "scale-110 opacity-0"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover brightness-90 contrast-110"
                />
                <div
                  className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-8 transition-all delay-300 duration-700 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100"
                      : "translate-y-5 opacity-0"
                  }`}
                >
                  <h3 className="font-cormorant text-[clamp(1.6rem,4.6vw,2.2rem)] font-light tracking-[0.08em]">
                    {slide.title}
                  </h3>
                  <p className="mt-2 text-[clamp(0.8rem,2.4vw,0.95rem)] font-light tracking-[0.05em] text-white/80">
                    {slide.desc}
                  </p>
                </div>
              </article>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-lg text-white/90 transition hover:scale-110 hover:text-white md:left-6"
              aria-label="Previous slide"
            >
              {"<"}
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-lg text-white/90 transition hover:scale-110 hover:text-white md:right-6"
              aria-label="Next slide"
            >
              {">"}
            </button>

            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    index === currentSlide
                      ? "scale-110 bg-white"
                      : "bg-black/45 hover:bg-black/65"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-8 py-24 text-center">
        <h2 className="font-cormorant text-[clamp(1.9rem,6vw,3rem)] font-light tracking-[0.1em] sm:tracking-[0.15em] text-[#c9a962]">
          Experience the Extraordinary
        </h2>
        <p className="mt-6 text-[clamp(0.95rem,2.8vw,1.1rem)] font-light leading-8 tracking-[0.02em] text-[#f5f5f0]/80">
          Kiminoyawa is a sanctuary where contemporary art transcends boundaries.
          Our curated spaces invite contemplation and transformation through
          exhibitions that bridge Eastern aesthetics with global perspectives.
        </p>
        <button className="mt-12 border border-[#c9a962] px-10 py-4 text-[clamp(0.68rem,2.2vw,0.88rem)] tracking-[0.18em] sm:tracking-[0.2em] text-[#c9a962] transition hover:bg-[#c9a962] hover:text-[#0d0d0d]">
          ENTER GALLERY
        </button>
      </section>
    </main>
  );
}
