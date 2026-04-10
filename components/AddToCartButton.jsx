"use client";

import { useState } from "react";
import { addCartItem } from "@/lib/cart-client";

export default function AddToCartButton({ artwork }) {
  const [added, setAdded] = useState(false);

  const addToCart = async () => {
    try {
      await addCartItem(artwork.slug, 1);
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("cart-open"));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      setAdded(false);
    }
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
