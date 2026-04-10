"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const providers = [
  "Continue with Gallery email",
  "Continue with Apple",
  "Continue with Google",
  "Continue with Facebook",
  "Continue with Microsoft",
  "Continue with email",
  "Continue with work email",
];

function providerGlyph(label) {
  if (label.includes("Apple")) return "A";
  if (label.includes("Google")) return "G";
  if (label.includes("Facebook")) return "F";
  if (label.includes("Microsoft")) return "M";
  if (label.includes("work")) return "W";
  if (label.includes("email")) return "@";
  return "K";
}

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("welcome");

  const handleGoogleSignIn = () => {
    const callbackUrl =
      typeof window !== "undefined" ? window.location.href : "/";
    setIsOpen(false);
    signIn("google", { callbackUrl });
  };

  useEffect(() => {
    const openLogin = () => {
      setView("welcome");
      setIsOpen(true);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("login-open", openLogin);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("login-open", openLogin);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[130] transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        className={`absolute inset-0 bg-black/65 backdrop-blur-sm transition ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-label="Close login modal"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Login modal"
        className={`absolute left-1/2 top-1/2 flex h-[86vh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/20 bg-[rgba(10,10,10,0.4)] shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl transition duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-xl text-[#f5f5f0]/85 transition hover:border-[#c9a962] hover:text-[#c9a962]"
          aria-label="Close login modal"
        >
          x
        </button>

        <div className="relative hidden md:block md:w-[52%]">
          <div className="relative h-full w-full overflow-hidden">
            <img
              src="/images/2.jpg"
              alt="Gallery visitor preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-black/40" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-cormorant text-3xl font-light tracking-[0.08em] text-[#f5f5f0]">
                Evening Access
              </p>
              <p className="mt-2 text-xs tracking-[0.12em] text-[#f5f5f0]/80">
                Save favorites, view collections, and checkout smoothly.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`flex w-full flex-col px-5 pb-6 pt-7 md:w-[48%] md:px-9 md:pb-8 md:pt-10 ${
            view === "welcome"
              ? "bg-[rgba(16,16,16,0.45)] text-[#f5f5f0] backdrop-blur-2xl"
              : "bg-[rgba(16,16,16,0.45)] text-[#f5f5f0] backdrop-blur-2xl"
          }`}
        >
          {view === "welcome" ? (
            <>
              <h2 className="pr-10 font-cormorant text-[clamp(1.9rem,4.3vw,2.5rem)] font-light leading-tight tracking-[0.03em]">
                Welcome back!
              </h2>
              <p className="mt-6 text-[0.95rem] leading-7 text-[#f5f5f0]/75">
                Last time you used Google to log in.
              </p>

              <div className="mt-7 mx-auto flex w-full max-w-[430px] flex-col items-center">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#c9a962]/45 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-base font-medium text-[#f5f5f0] shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] transition hover:border-[#c9a962] hover:bg-[rgba(255,255,255,0.07)]"
                >
                  <span className="text-3xl leading-none text-[#4285F4]">G</span>
                  Continue with Google
                </button>

                <button
                  onClick={() => setView("options")}
                  className="mt-5 w-full text-center text-[1.05rem] font-medium tracking-normal text-[#f5f5f0] transition hover:text-[#c9a962]"
                >
                  Continue another way
                </button>
              </div>

              <p className="mt-8 text-base leading-7 text-[#f5f5f0]/65">
                By continuing, you agree to Kiminoyawa Terms of Use and Privacy
                Policy.
              </p>
            </>
          ) : (
            <>
              <h2 className="pr-10 font-cormorant text-[clamp(1.7rem,4.4vw,2.35rem)] font-light tracking-[0.05em] text-[#f5f5f0]">
                Continue to Kiminoyawa
              </h2>

              <div className="mt-6 flex-1 space-y-3 overflow-y-auto pr-1">
                {providers.map((provider) => (
                  <button
                    key={provider}
                    onClick={() => {
                      if (provider.includes("Google")) handleGoogleSignIn();
                    }}
                    className="flex w-full items-center gap-4 rounded-lg border border-white/20 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-left text-[0.95rem] text-[#f5f5f0]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-[#c9a962] hover:bg-[#c9a962]/10"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 text-xs font-semibold text-[#c9a962]">
                      {providerGlyph(provider)}
                    </span>
                    <span className="leading-6">{provider}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setView("welcome")}
                className="mt-5 text-left text-sm leading-6 text-[#c9a962] transition hover:text-[#f5f5f0]"
              >
                Back to quick sign in
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
