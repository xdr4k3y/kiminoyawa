"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";
import {
  fetchCart,
  setCartItemQuantity,
  removeCartItem,
} from "@/lib/cart-client";

export default function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        const nextItems = await fetchCart();
        if (!cancelled) setItems(nextItems);
      } catch {
        if (!cancelled) setItems([]);
      }
    }

    loadCart();

    const handleCartUpdated = () => {
      loadCart();
    };
    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [items],
  );
  const taxAmount = useMemo(() => totalPrice * 0.08, [totalPrice]);
  const checkoutTotal = useMemo(() => totalPrice + taxAmount, [totalPrice, taxAmount]);

  const changeQuantity = async (slug, nextQty) => {
    const parsedQty = Number(nextQty);
    if (!Number.isFinite(parsedQty)) return;

    const safeQty = Math.max(1, Math.floor(parsedQty));
    try {
      const nextItems = await setCartItemQuantity(slug, safeQty);
      setItems(nextItems);
      window.dispatchEvent(new Event("cart-updated"));
    } catch {}
  };

  const removeItem = async (slug) => {
    try {
      const nextItems = await removeCartItem(slug);
      setItems(nextItems);
      window.dispatchEvent(new Event("cart-updated"));
    } catch {}
  };

  return (
    <main className="page-enter min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative flex min-h-[40vh] flex-col items-center justify-center bg-[linear-gradient(135deg,#0d0d0d_0%,#1a1a1a_100%)] px-6 pt-24 text-center">
        <div className="relative z-10">
          <p className="mb-3 font-cormorant text-sm tracking-[0.4em] text-[#c9a962]/85">
            カート
          </p>
          <h1 className="font-cormorant text-[clamp(2rem,8vw,4rem)] font-light tracking-[0.18em]">
            CART
          </h1>
          <p className="mt-4 text-sm tracking-[0.12em] text-[#f5f5f0]/75">
            Review your selected artworks.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20 pt-10 md:px-10">
        <div className="mx-auto max-w-6xl">
          {items.length === 0 ? (
            <div className="border border-white/10 bg-white/[0.02] p-10 text-center">
              <p className="text-base text-[#f5f5f0]/80">Your cart is empty.</p>
              <Link
                href="/exhibitions"
                className="mt-6 inline-flex border border-[#c9a962] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#c9a962] transition hover:bg-[#c9a962] hover:text-[#0d0d0d]"
              >
                Browse Exhibitions
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <article
                  key={item.slug}
                  className="grid gap-5 border border-white/10 bg-white/[0.02] p-5 md:grid-cols-[120px_1fr_auto]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-28 w-full object-cover md:w-28"
                  />
                  <div>
                    <h2 className="font-cormorant text-3xl font-light tracking-[0.08em]">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#c9a962]">
                      {item.artist}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#f5f5f0]/70">
                      <span>Quantity:</span>
                      <button
                        onClick={() =>
                          changeQuantity(item.slug, (item.quantity || 1) - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center border border-white/20 text-base transition hover:border-[#c9a962] hover:text-[#c9a962]"
                        aria-label={`Decrease quantity for ${item.title}`}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity || 1}
                        onChange={(event) =>
                          changeQuantity(item.slug, event.target.value)
                        }
                        className="h-7 w-14 border border-white/20 bg-transparent px-2 text-center text-sm text-[#f5f5f0] outline-none focus:border-[#c9a962]"
                        aria-label={`Quantity for ${item.title}`}
                      />
                      <button
                        onClick={() =>
                          changeQuantity(item.slug, (item.quantity || 1) + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center border border-white/20 text-base transition hover:border-[#c9a962] hover:text-[#c9a962]"
                        aria-label={`Increase quantity for ${item.title}`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="ml-2 flex h-7 w-8 items-center justify-center border border-white/25 text-[#f5f5f0]/85 transition hover:border-[#c9a962] hover:text-[#c9a962]"
                        aria-label={`Delete ${item.title} from cart`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M7 6l1 14h8l1-14" />
                          <path d="M10 10v7" />
                          <path d="M14 10v7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="self-center text-lg font-normal text-[#f5f5f0]/90">
                    ${(item.price * (item.quantity || 1)).toLocaleString()}
                  </p>
                </article>
              ))}

              <div className="grid gap-6 border border-[#c9a962]/25 bg-[rgba(201,169,98,0.07)] p-6 md:grid-cols-[1fr_280px] md:items-center">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-[#f5f5f0]/80">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#f5f5f0]/75">
                    <span>Tax</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xl font-normal text-[#f5f5f0]">
                    <span>Total</span>
                    <span>${checkoutTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full border border-[#c9a962] bg-[#c9a962] px-5 py-3 text-xs font-normal text-[#0d0d0d] transition hover:bg-[#d4b775]">
                    Proceed to Checkout
                  </button>
                  <Link
                    href="/exhibitions"
                    className="w-full border border-[#c9a962]/45 px-5 py-3 text-center text-xs font-normal text-[#f5f5f0]/85 transition hover:border-[#c9a962] hover:text-[#c9a962]"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
