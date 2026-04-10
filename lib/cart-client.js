"use client";

const CART_ID_KEY = "kiminoyawa-cart-id";

function getStoredCartId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_ID_KEY);
}

function setStoredCartId(cartId) {
  if (typeof window === "undefined") return;
  if (!cartId) {
    localStorage.removeItem(CART_ID_KEY);
    return;
  }
  localStorage.setItem(CART_ID_KEY, cartId);
}

export async function ensureCart() {
  const cartId = getStoredCartId();
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || "Failed to initialize cart.");
  }
  if (payload?.cartId) setStoredCartId(payload.cartId);
  return payload?.cartId || null;
}

export async function fetchCart() {
  const cartId = getStoredCartId();
  if (!cartId) return [];

  const response = await fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`, {
    cache: "no-store",
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || "Failed to load cart.");
  }
  if (!payload?.cartId) {
    setStoredCartId(null);
    return [];
  }
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function addCartItem(slug, quantityDelta = 1) {
  const cartId = await ensureCart();
  const response = await fetch("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, slug, quantityDelta }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || "Failed to add item to cart.");
  }
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function setCartItemQuantity(slug, quantity) {
  const cartId = await ensureCart();
  const response = await fetch("/api/cart/items", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, slug, quantity }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || "Failed to update quantity.");
  }
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function removeCartItem(slug) {
  const cartId = getStoredCartId();
  if (!cartId) return [];

  const response = await fetch("/api/cart/items", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, slug }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || "Failed to remove cart item.");
  }
  return Array.isArray(payload?.data) ? payload.data : [];
}
