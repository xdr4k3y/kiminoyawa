"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchCart } from "@/lib/cart-client";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/artists", label: "Artists" },
  { href: "/visit", label: "Visit" },
  { href: "/about", label: "About" },
];

export default function GalleryNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const profileMenuRef = useRef(null);

  const openLoginModal = () => {
    window.dispatchEvent(new Event("login-open"));
  };

  useEffect(() => {
    const getCount = async () => {
      try {
        const items = await fetchCart();
        const total = items.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0,
        );
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    getCount();
    window.addEventListener("cart-updated", getCount);

    return () => {
      window.removeEventListener("cart-updated", getCount);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAvatar() {
      if (!session?.user) {
        if (!cancelled) setAvatarUrl("");
        return;
      }
      try {
        const response = await fetch("/api/me/profile", { cache: "no-store" });
        const payload = await response.json();
        if (!cancelled) {
          setAvatarUrl(payload?.data?.avatarUrl || session.user.image || "");
        }
      } catch {
        if (!cancelled) {
          setAvatarUrl(session?.user?.image || "");
        }
      }
    }

    loadAvatar();
    window.addEventListener("profile-updated", loadAvatar);

    return () => {
      cancelled = true;
      window.removeEventListener("profile-updated", loadAvatar);
    };
  }, [session?.user]);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kiminoyawa-dark-mode");
      const next = stored === "true";
      setDarkMode(next);
      document.body.classList.toggle("theme-dark", next);
    } catch {}
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.body.classList.toggle("theme-dark", next);
    try {
      localStorage.setItem("kiminoyawa-dark-mode", String(next));
    } catch {}
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50  bg-[#131313]">
      <div className="flex items-center justify-between px-6 py-4 md:px-12">
        <Link
          href="/"
          className="font-cormorant text-xl font-bold tracking-[0.1em] text-[#f5f5f0]"
        >
          Kiminoyawa
        </Link>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center text-[#f5f5f0] transition hover:text-[#c9a962]"
            aria-label="Open cart"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.2 10.5h10.3l2-7.5H6.2" />
              </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-[#c9a962] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[#0d0d0d]">
                {cartCount}
              </span>
            )}
          </Link>
          {session?.user ? (
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#c9a962]/45"
              aria-label="Open profile menu"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs uppercase text-[#c9a962]">ME</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              className="relative flex h-10 w-10 items-center justify-center text-[#f5f5f0] transition hover:text-[#c9a962]"
              aria-label="Open login modal"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center text-[#f5f5f0] transition hover:text-[#c9a962]"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 top-0 block h-0.5 w-5 bg-current transition ${
                  isOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-3 block h-0.5 w-5 bg-current transition ${
                  isOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        <ul className="hidden list-none items-center gap-8 font-cormorant md:flex">
          {links.map((link) => {
            const isActive = link.href !== "#" && pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? "text-[#c9a962]"
                      : "text-[#f5f5f0]/70 hover:text-[#c9a962]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/cart"
              className="relative flex items-center text-[#f5f5f0]/80 transition hover:text-[#c9a962]"
              aria-label="Open cart"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M3 4h2l2.2 10.5h10.3l2-7.5H6.2" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-[#c9a962] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[#0d0d0d]">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            {session?.user ? (
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#c9a962]/45"
                aria-label="Open profile menu"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] uppercase text-[#c9a962]">ME</span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="relative flex items-center text-[#f5f5f0]/80 transition hover:text-[#c9a962]"
                aria-label="Open login modal"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="8" r="3.2" />
                  <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
                </svg>
              </button>
            )}
          </li>
        </ul>
      </div>

      <div
        className={`overflow-hidden bg-[#111111] px-6 transition-all duration-300 md:hidden ${
          isOpen ? "max-h-72 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <ul className="list-none space-y-3">
          <li>
            {session?.user ? (
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="block text-sm text-[#f5f5f0]/85 transition hover:text-[#c9a962]"
              >
                Profile
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openLoginModal();
                }}
                className="block text-sm text-[#f5f5f0]/85 transition hover:text-[#c9a962]"
              >
                Sign Up / Login
              </button>
            )}
          </li>
          <li>
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="block text-sm text-[#f5f5f0]/85 transition hover:text-[#c9a962]"
            >
              Cart {cartCount > 0 ? `(${cartCount})` : ""}
            </Link>
          </li>
          {links.map((link) => {
            const isActive = link.href !== "#" && pathname === link.href;
            return (
              <li key={`mobile-${link.label}`}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm transition-colors ${
                    isActive
                      ? "text-[#c9a962]"
                      : "text-[#f5f5f0]/85 hover:text-[#c9a962]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {session?.user && isProfileMenuOpen ? (
        <div
          ref={profileMenuRef}
          className="absolute right-6 top-[74px] w-[290px] rounded-2xl border border-[#c9a962]/30 bg-[#121212] p-3 text-[#f5f5f0] shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:right-12"
        >
          <ul className="list-none">
            <li className="border-b border-white/10">
              <Link
                href="/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-base font-medium text-[#f5f5f0] transition hover:bg-[#c9a962]/10 hover:text-[#c9a962]"
              >
                <span>Profile</span>
              </Link>
            </li>
            <li className="border-b border-white/10">
              <Link
                href="/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-base font-medium text-[#f5f5f0] transition hover:bg-[#c9a962]/10 hover:text-[#c9a962]"
              >
                <span>Edit Profile</span>
              </Link>
            </li>
            <li className="border-b border-white/10">
              <button
                type="button"
                className="flex w-full items-center px-3 py-3 text-left text-base font-medium text-[#f5f5f0] transition hover:bg-[#c9a962]/10 hover:text-[#c9a962]"
              >
                <span>Wallet</span>
              </button>
            </li>
            <li className="border-b border-white/10">
              <button
                type="button"
                className="flex w-full items-center px-3 py-3 text-left text-base font-medium text-[#f5f5f0] transition hover:bg-[#c9a962]/10 hover:text-[#c9a962]"
              >
                <span>Upgrade Plan</span>
              </button>
            </li>
            <li className="border-b border-white/10">
              <button
                type="button"
                className="flex w-full items-center px-3 py-3 text-left text-base font-medium text-[#f5f5f0] transition hover:bg-[#c9a962]/10 hover:text-[#c9a962]"
              >
                <span>Help Center</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center px-3 py-3 text-left text-base font-medium text-[#f5f5f0] transition hover:bg-[#c9a962]/10 hover:text-[#c9a962]"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={toggleDarkMode}
        aria-pressed={darkMode}
        aria-label="Toggle dark mode"
        className="fixed bottom-6 right-6 z-[55] flex h-12 w-12 items-center justify-center rounded-lg border border-[#c9a962]/55 bg-[#111111]/85 text-lg text-[#c9a962] shadow-[0_10px_25px_rgba(0,0,0,0.45)] transition hover:border-[#c9a962] hover:bg-[#191919]"
      >
        {darkMode ? "☀" : "☾"}
      </button>
    </nav>
  );
}
