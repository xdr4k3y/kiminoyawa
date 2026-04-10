import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";

export default function ProfilePage() {
  return (
    <main className="page-enter min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="relative z-10">
          <h1 className="font-cormorant text-[clamp(2rem,8vw,4rem)] font-light tracking-[0.18em]">
            PROFILE
          </h1>
          <p className="mt-4 text-sm tracking-[0.12em] text-[#f5f5f0]/75">
            Your account profile page is ready for customization.
          </p>
        </div>
      </section>
    </main>
  );
}
