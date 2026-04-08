"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/artists", label: "Artists" },
  { href: "#", label: "Visit" },
  { href: "#", label: "About" },
];

export default function GalleryNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const getCount = () => {
      try {
        const parsedCart = JSON.parse(
          localStorage.getItem("kiminoyawa-cart") || "[]",
        );
        const total = parsedCart.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0,
        );
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    getCount();
    window.addEventListener("storage", getCount);
    window.addEventListener("cart-updated", getCount);

    return () => {
      window.removeEventListener("storage", getCount);
      window.removeEventListener("cart-updated", getCount);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
          <Link
            href="/profile"
            className="relative flex h-10 w-10 items-center justify-center text-[#f5f5f0] transition hover:text-[#c9a962]"
            aria-label="Open profile"
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
          </Link>

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
            <Link
              href="/profile"
              className="relative flex items-center text-[#f5f5f0]/80 transition hover:text-[#c9a962]"
              aria-label="Open profile"
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
            </Link>
          </li>
        </ul>
      </div>

      <div
        className={`overflow-hidden bg-[#111111] px-6 transition-all duration-300 md:hidden ${
          isOpen ? "max-h-72 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <ul className="list-none space-y-4 font-cormorant">
          <li>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="block text-xs uppercase tracking-[0.15em] text-[#f5f5f0]/80 transition hover:text-[#c9a962]"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="block text-xs uppercase tracking-[0.15em] text-[#f5f5f0]/80 transition hover:text-[#c9a962]"
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
                  className={`block text-xs uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? "text-[#c9a962]"
                      : "text-[#f5f5f0]/80 hover:text-[#c9a962]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
