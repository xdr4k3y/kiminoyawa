"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const openLogin = () => {
      setMode("signin");
      setError("");
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

  const closeModal = () => setIsOpen(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/profile",
    });
    setIsLoading(false);

    if (!result?.ok) {
      setError("Invalid email or password.");
      return;
    }

    setIsOpen(false);
    window.location.href = result.url || "/profile";
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, password }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/profile",
      });
      setIsLoading(false);
      if (!login?.ok) {
        setError("Account created. Please sign in.");
        setMode("signin");
        return;
      }

      setIsOpen(false);
      window.location.href = login.url || "/profile";
    } catch {
      setIsLoading(false);
      setError("Failed to create account.");
    }
  };

  const handleGoogleSignIn = async () => {
    closeModal();
    const callbackUrl = typeof window !== "undefined" ? window.location.href : "/";
    await signIn("google", { callbackUrl });
  };

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
        onClick={closeModal}
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
          onClick={closeModal}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-xl text-[#f5f5f0]/85 transition hover:border-[#c9a962] hover:text-[#c9a962]"
          aria-label="Close login modal"
        >
          x
        </button>

        <div className="relative hidden md:block md:w-[52%]">
          <img
            src="/images/2.jpg"
            alt="Gallery visitor preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-black/45" />
          <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-md border border-[#c9a962]/70 bg-black/35">
            <span className="font-cormorant text-2xl font-semibold text-white">K</span>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <p className="font-cormorant text-3xl font-light tracking-[0.08em] text-[#f5f5f0]">
              Evening Access
            </p>
            <p className="mt-2 text-xs tracking-[0.12em] text-[#f5f5f0]/80">
              Save favorites, view collections, and checkout smoothly.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col bg-[#0b0b10] px-5 pb-6 pt-8 text-[#f5f5f0] md:w-[48%] md:px-9">
          <h2 className="font-inter text-[clamp(1.35rem,2.4vw,1.7rem)] font-semibold leading-tight text-[#f5f5f0]">
            {mode === "signin" ? "Welcome to Kiminoyawa" : "Create account"}
          </h2>
          {mode === "signin" ? (
            <p className="mt-1 text-[0.82rem] font-medium tracking-normal text-[#f5f5f0]/55">
              Where your art journey begins.
            </p>
          ) : null}

          <form
            className="mt-6 space-y-3"
            onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
          >
            {mode === "signup" ? (
              <label className="block">
                <span className="text-xs text-[#f5f5f0]/70">Name</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-[#f5f5f0] outline-none focus:border-[#c9a962]"
                  placeholder="Your name"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-xs text-[#f5f5f0]/70">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-[#f5f5f0] outline-none focus:border-[#c9a962]"
                placeholder="alex.jordan@gmail.com"
              />
            </label>

            <label className="block">
              <span className="text-xs text-[#f5f5f0]/70">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-[#f5f5f0] outline-none focus:border-[#c9a962]"
                placeholder="******"
              />
            </label>

            {mode === "signup" ? (
              <label className="block">
                <span className="text-xs text-[#f5f5f0]/70">Confirm Password</span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-[#f5f5f0] outline-none focus:border-[#c9a962]"
                  placeholder="******"
                />
              </label>
            ) : (
              <button
                type="button"
                className="text-left text-sm text-[#c9a962] transition hover:text-[#e0c487]"
              >
                Forgot password?
              </button>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-[#f5f5f0]/70">Remember sign in details</span>
              <button
                type="button"
                onClick={() => setRemember((prev) => !prev)}
                aria-pressed={remember}
                className={`relative h-7 w-12 rounded-full transition ${
                  remember ? "bg-[#c9a962]" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    remember ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            {error ? (
              <p className="rounded-lg border border-[#c94b4b]/50 bg-[#c94b4b]/20 px-3 py-2 text-sm text-[#ffd4d4]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-full bg-[linear-gradient(135deg,#c9a962,#b8944d)] px-4 py-3 text-sm font-medium text-[#0d0d0d] transition hover:brightness-110 disabled:opacity-70"
            >
              {isLoading ? "Please wait..." : mode === "signin" ? "Log in" : "Register"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-[#f5f5f0]/45">
            <div className="h-px flex-1 bg-white/15" />
            <span>OR</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#f5f5f0] transition hover:border-[#c9a962]/70"
          >
            <span className="text-xl font-bold text-[#4285F4]">G</span>
            Continue with Google
          </button>

          <button
            onClick={async () => {
              setIsOpen(false);
              await signIn("credentials", {
                email: "demo",
                password: "demo123",
                callbackUrl: "/profile",
              });
            }}
            className="mt-3 text-sm text-[#c9a962] transition hover:text-[#f5f5f0]"
          >
            Use demo account
          </button>

          <p className="mt-5 text-center text-sm text-[#f5f5f0]/55">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode((prev) => (prev === "signin" ? "signup" : "signin"));
                setError("");
              }}
              className="font-medium text-[#c9a962] transition hover:text-[#e0c487]"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
