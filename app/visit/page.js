import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";

export const metadata = {
  title: "Visit | Kiminoyawa Gallery",
  description: "Plan your visit to Kiminoyawa Gallery",
};

const visitDetails = [
  { label: "Location", value: "18 Serenity Lane, Downtown Arts District" },
  { label: "Opening Hours", value: "Tue - Sun, 10:00 AM - 7:00 PM" },
  { label: "Late Evening", value: "Fri until 9:00 PM" },
  { label: "Contact", value: "+65 6123 4567 | visits@kiminoyawa.gallery" },
];

export default function VisitPage() {
  return (
    <main className="page-enter min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative flex min-h-[52vh] items-center justify-center bg-[linear-gradient(135deg,#0d0d0d_0%,#1a1a1a_100%)] px-6 pt-28 text-center">
        <div className="relative z-10 max-w-3xl">
          <p className="mb-3 font-cormorant text-[clamp(0.7rem,2vw,0.95rem)] font-light tracking-[0.45em] text-[#c9a962]/90">
            訪問
          </p>
          <h1 className="font-cormorant text-[clamp(2.1rem,8vw,3.9rem)] font-light tracking-[0.2em] sm:tracking-[0.28em]">
            VISIT
          </h1>
          <p className="mt-6 text-[clamp(0.95rem,2.8vw,1.05rem)] font-light leading-8 tracking-[0.02em] text-[#f5f5f0]/80">
            Plan your time at Kiminoyawa. We designed each gallery sequence to
            be experienced at a calm pace, with space for reflection between
            rooms and installations.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2">
        <article className="border border-[#c9a962]/20 bg-white/[0.02] p-8">
          <h2 className="font-cormorant text-3xl tracking-[0.1em] text-[#c9a962]">
            Visitor Information
          </h2>
          <dl className="mt-6 space-y-4">
            {visitDetails.map((item) => (
              <div key={item.label} className="border-b border-white/10 pb-3">
                <dt className="text-xs uppercase tracking-[0.16em] text-[#c9a962]">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-light leading-7 text-[#f5f5f0]/85">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="border border-[#c9a962]/20 bg-white/[0.02] p-8">
          <h2 className="font-cormorant text-3xl tracking-[0.1em] text-[#c9a962]">
            Admission
          </h2>
          <div className="mt-6 space-y-4 text-sm font-light leading-7 text-[#f5f5f0]/82">
            <p>General: $18</p>
            <p>Students & Seniors: $12</p>
            <p>Members: Complimentary</p>
            <p>Children under 12: Complimentary with adult supervision</p>
          </div>
          <p className="mt-8 border-t border-white/10 pt-5 text-sm leading-7 text-[#f5f5f0]/70">
            Timed entry is recommended for weekends. You can reserve slots by
            phone or email before arrival.
          </p>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="border border-[#c9a962]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-10 text-center">
          <h2 className="font-cormorant text-[clamp(1.7rem,5vw,2.6rem)] font-light tracking-[0.14em] text-[#c9a962]">
            Before You Arrive
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-[clamp(0.92rem,2.7vw,1rem)] font-light leading-8 tracking-[0.02em] text-[#f5f5f0]/80">
            Photography without flash is welcome in most spaces. For special
            exhibitions, signage at each room will indicate whether image
            capture is permitted.
          </p>
        </div>
      </section>
    </main>
  );
}
