import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileDashboard from "@/components/ProfileDashboard";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;

  return (
    <main className="page-enter min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="relative z-10">
          <h1 className="font-cormorant text-[clamp(2rem,8vw,4rem)] font-light tracking-[0.18em]">
            PROFILE
          </h1>
          {!user ? (
            <div className="mx-auto mt-6 max-w-xl border border-white/15 bg-white/[0.03] p-8">
              <p className="text-sm tracking-[0.12em] text-[#f5f5f0]/75">
                You are not signed in yet.
              </p>
              <p className="mt-3 text-sm tracking-[0.08em] text-[#f5f5f0]/65">
                Use the login icon and choose "Continue as Demo User".
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex border border-[#c9a962] px-5 py-2 text-xs uppercase tracking-[0.2em] text-[#c9a962] transition hover:bg-[#c9a962] hover:text-[#0d0d0d]"
              >
                Back Home
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {user ? <ProfileDashboard user={user} /> : null}
    </main>
  );
}
