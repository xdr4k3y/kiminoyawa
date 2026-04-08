"use client";

import { useState } from "react";

export default function AddToCartButton({ artwork }) {
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cartKey = "kiminoyawa-cart";
    const parsedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");

    const existingItem = parsedCart.find((item) => item.slug === artwork.slug);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      parsedCart.push({ ...artwork, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(parsedCart));
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("cart-open"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={addToCart}
      className="border border-[#c9a962] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#c9a962] transition hover:bg-[#c9a962] hover:text-[#0d0d0d]"
    >
      {added ? "Added" : "Add to Cart"}
    </button>
  );
}
