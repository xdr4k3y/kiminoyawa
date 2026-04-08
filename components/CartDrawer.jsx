"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const CART_KEY = "kiminoyawa-cart";
const TAX_RATE = 0.08;

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [items],
  );
  const taxes = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const total = useMemo(() => subtotal + taxes, [subtotal, taxes]);

  const syncCart = () => setItems(readCart());

  useEffect(() => {
    syncCart();

    const handleOpen = () => {
      syncCart();
      setIsOpen(true);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("cart-open", handleOpen);
    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("cart-open", handleOpen);
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const writeCart = (nextItems) => {
    localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
    setItems(nextItems);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const increaseQty = (slug) => {
    const nextItems = items.map((item) =>
      item.slug === slug ? { ...item, quantity: (item.quantity || 1) + 1 } : item,
    );
    writeCart(nextItems);
  };

  const decreaseQty = (slug) => {
    const nextItems = items
      .map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 0) }
          : item,
      )
      .filter((item) => (item.quantity || 0) > 0);
    writeCart(nextItems);
  };

  const removeItem = (slug) => {
    writeCart(items.filter((item) => item.slug !== slug));
  };

  return (
    <div
      className={`fixed inset-0 z-[120] transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        className={`absolute inset-0 bg-black/50 transition ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-label="Close cart"
      />

      <aside
        className={`absolute bottom-0 left-0 right-0 flex h-[82vh] flex-col rounded-t-2xl border border-white/10 bg-[rgba(14,14,14,0.72)] text-[#f5f5f0] shadow-[0_-12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-transform duration-300 md:bottom-0 md:left-auto md:right-0 md:top-0 md:h-full md:w-full md:max-w-[560px] md:rounded-none md:border-l md:border-t-0 ${
          isOpen
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-x-full md:translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-7 md:py-6">
          <div>
            <h2 className="text-xl font-normal leading-none md:text-2xl">
              Cart Summary
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-4xl leading-none text-[#f5f5f0]/55 transition hover:text-[#c9a962]"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-7 py-10">
              <p className="text-lg text-[#f5f5f0]/70">Your cart is empty.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {items.map((item) => (
                <div key={item.slug} className="px-7 py-8">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-14 w-14 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-normal leading-tight md:text-xl">
                        {item.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeItem(item.slug)}
                      className="h-9 w-9 rounded-full border border-[#c9a962]/40 bg-[#c9a962]/10 text-xl leading-none text-[#c9a962] transition hover:bg-[#c9a962]/20"
                      aria-label={`Remove ${item.title}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="mx-auto h-4 w-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M7 6l1 14h8l1-14" />
                        <path d="M10 10v7" />
                        <path d="M14 10v7" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#f5f5f0]/70">Quantity</p>
                      <div className="mt-2 flex items-center gap-4 border border-white/15 bg-black/20 px-3 py-2">
                        <button
                          onClick={() => decreaseQty(item.slug)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl leading-none text-[#f5f5f0]/90"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-lg font-medium">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => increaseQty(item.slug)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl leading-none text-[#f5f5f0]/90"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-xl font-normal text-[#c9a962] md:text-2xl">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-y border-white/10 px-7 py-8">
            <button className="w-full border border-white/20 bg-black/20 px-4 py-4 text-center text-base text-[#f5f5f0]/85 transition hover:border-[#c9a962] hover:text-[#c9a962]">
              Promo code?
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/15 px-7 py-6">
          <div className="space-y-2 text-xs text-[#f5f5f0]/85 md:text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#f5f5f0]/60">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-[#f5f5f0]/60">
              <span>Taxes</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 text-xl font-normal text-[#c9a962] md:text-2xl">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-3 rounded border border-[#c9a962] bg-[#c9a962] px-5 py-4 text-base font-normal text-[#0d0d0d] transition hover:bg-[#d5b775]">
            Checkout
            <span aria-hidden>→</span>
          </button>

          <div className="mt-5 text-center">
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="text-sm text-[#f5f5f0]/80 underline underline-offset-4 transition hover:text-[#c9a962] md:text-base"
            >
              View detailed cart
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
