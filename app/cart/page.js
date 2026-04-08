"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GalleryNav from "@/components/GalleryNav";
import GrainOverlay from "@/components/GrainOverlay";

export default function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const parsedCart = JSON.parse(
        localStorage.getItem("kiminoyawa-cart") || "[]",
      );
      setItems(Array.isArray(parsedCart) ? parsedCart : []);
    } catch {
      setItems([]);
    }
  }, []);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [items],
  );

  const writeCart = (nextItems) => {
    localStorage.setItem("kiminoyawa-cart", JSON.stringify(nextItems));
    window.dispatchEvent(new Event("cart-updated"));
    setItems(nextItems);
  };

  const changeQuantity = (slug, nextQty) => {
    const parsedQty = Number(nextQty);
    if (!Number.isFinite(parsedQty)) return;

    const safeQty = Math.max(1, Math.floor(parsedQty));
    const nextItems = items.map((item) =>
      item.slug === slug ? { ...item, quantity: safeQty } : item,
    );
    writeCart(nextItems);
  };

  const clearCart = () => {
    writeCart([]);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5f5f0]">
      <GalleryNav />
      <GrainOverlay />

      <section className="hero-pattern relative flex min-h-[40vh] flex-col items-center justify-center bg-[linear-gradient(135deg,#0d0d0d_0%,#1a1a1a_100%)] px-6 pt-24 text-center">
        <div className="relative z-10">
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
                    <div className="mt-2 flex items-center gap-2 text-sm text-[#f5f5f0]/70">
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
                    </div>
                  </div>
                  <p className="self-center font-cormorant text-3xl text-[#c9a962]">
                    ${(item.price * (item.quantity || 1)).toLocaleString()}
                  </p>
                </article>
              ))}

              <div className="flex flex-col items-start justify-between gap-4 border border-[#c9a962]/30 bg-[rgba(201,169,98,0.08)] p-6 md:flex-row md:items-center">
                <p className="font-cormorant text-3xl font-light tracking-[0.1em]">
                  Total: ${totalPrice.toLocaleString()}
                </p>
                <button
                  onClick={clearCart}
                  className="border border-[#c9a962] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#c9a962] transition hover:bg-[#c9a962] hover:text-[#0d0d0d]"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
