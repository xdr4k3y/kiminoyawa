import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";

export const metadata = {
  title: "About | Kiminoyawa Gallery",
  description: "About Kiminoyawa Gallery",
};

export default function AboutPage() {
  return (
    <main className="page-enter min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative flex min-h-[55vh] items-center justify-center bg-[linear-gradient(135deg,#0d0d0d_0%,#1a1a1a_100%)] px-6 pt-28 text-center">
        <div className="relative z-10 max-w-3xl">
          <p className="mb-3 font-cormorant text-[clamp(0.7rem,2vw,0.95rem)] font-light tracking-[0.45em] text-[#c9a962]/90">
            概要
          </p>
          <h1 className="font-cormorant text-[clamp(2.2rem,8vw,4rem)] font-light tracking-[0.2em] sm:tracking-[0.28em]">
            ABOUT
          </h1>
          <p className="mt-6 text-[clamp(0.95rem,2.8vw,1.05rem)] font-light leading-8 tracking-[0.02em] text-[#f5f5f0]/80">
            Kiminoyawa was founded as a quiet meeting point between
            contemporary experimentation and timeless composition. We curate
            immersive exhibitions that invite stillness, reflection, and
            conversation across cultures.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
        <article className="border border-[#c9a962]/20 bg-white/[0.02] p-8 transition hover:-translate-y-1.5 hover:border-[#c9a962]/45">
          <h2 className="font-cormorant text-3xl tracking-[0.1em] text-[#c9a962]">
            Our Vision
          </h2>
          <p className="mt-4 text-sm font-light leading-7 tracking-[0.02em] text-[#f5f5f0]/75">
            We believe art should be experienced slowly. Each exhibition is
            designed to guide visitors through a rhythm of contrast: material
            and light, silence and sound, intimacy and scale.
          </p>
        </article>

        <article className="border border-[#c9a962]/20 bg-white/[0.02] p-8 transition hover:-translate-y-1.5 hover:border-[#c9a962]/45">
          <h2 className="font-cormorant text-3xl tracking-[0.1em] text-[#c9a962]">
            Curatorial Focus
          </h2>
          <p className="mt-4 text-sm font-light leading-7 tracking-[0.02em] text-[#f5f5f0]/75">
            Our program highlights both emerging and established voices across
            painting, sculpture, photography, and mixed media that connect
            Eastern sensibility with global contemporary practice.
          </p>
        </article>

        <article className="border border-[#c9a962]/20 bg-white/[0.02] p-8 transition hover:-translate-y-1.5 hover:border-[#c9a962]/45">
          <h2 className="font-cormorant text-3xl tracking-[0.1em] text-[#c9a962]">
            The Space
          </h2>
          <p className="mt-4 text-sm font-light leading-7 tracking-[0.02em] text-[#f5f5f0]/75">
            Minimal architecture, natural textures, and controlled lighting
            shape a calm atmosphere designed for both intimate works and
            large-scale installations.
          </p>
        </article>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
        <h2 className="font-cormorant text-[clamp(1.8rem,5vw,2.6rem)] font-light tracking-[0.14em] text-[#c9a962]">
          A Place For Evening Harmony
        </h2>
        <p className="mt-5 text-[clamp(0.92rem,2.7vw,1rem)] font-light leading-8 tracking-[0.02em] text-[#f5f5f0]/80">
          Inspired by the meaning of Kiminoyawa, "Your Evening Harmony", our
          gallery invites visitors to pause and reconnect with attention itself.
          Every show is curated not only to be seen, but to be felt over time.
        </p>
      </section>
    </main>
  );
}
