"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export default function ProfileDashboard({ user }) {
  const [profile, setProfile] = useState({
    email: user?.email || "",
    displayName: user?.name || "",
    avatarUrl: user?.image || "",
    address: "",
    birthday: "",
    phone: "",
  });
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const avatarInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [profileRes, favoritesRes, ordersRes] = await Promise.all([
          fetch("/api/me/profile", { cache: "no-store" }),
          fetch("/api/me/favorites", { cache: "no-store" }),
          fetch("/api/me/orders", { cache: "no-store" }),
        ]);

        const profileJson = await profileRes.json();
        const favoritesJson = await favoritesRes.json();
        const ordersJson = await ordersRes.json();

        if (cancelled) return;

        if (profileRes.ok && profileJson?.data) {
          const preferences =
            profileJson.data.preferences && typeof profileJson.data.preferences === "object"
              ? profileJson.data.preferences
              : {};
          setProfile({
            email: profileJson.data.email || user?.email || "",
            displayName: profileJson.data.displayName || user?.name || "",
            avatarUrl: profileJson.data.avatarUrl || user?.image || "",
            address: preferences.address || "",
            birthday: preferences.birthday || "",
            phone: preferences.phone || "",
          });
        }

        setFavorites(Array.isArray(favoritesJson?.data) ? favoritesJson.data : []);
        setOrders(Array.isArray(ordersJson?.data) ? ordersJson.data : []);
      } catch {
        if (!cancelled) {
          setFavorites([]);
          setOrders([]);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.image, user?.name]);

  const orderCount = useMemo(() => orders.length, [orders.length]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          bio: "",
          preferences: {
            address: profile.address,
            birthday: profile.birthday,
            phone: profile.phone,
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setStatus(payload?.error || "Failed to save profile.");
      } else {
        setStatus("Profile saved.");
        window.dispatchEvent(new Event("profile-updated"));
      }
    } catch {
      setStatus("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setStatus("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/me/avatar", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        setStatus(payload?.error || "Failed to upload avatar.");
      } else {
        setProfile((prev) => ({ ...prev, avatarUrl: payload.data.avatarUrl }));
        setStatus("Avatar uploaded.");
        window.dispatchEvent(new Event("profile-updated"));
      }
    } catch {
      setStatus("Failed to upload avatar.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="mx-auto mt-6 grid max-w-6xl gap-8 px-6 pb-16 md:px-10">
      <section className="grid gap-6 border border-white/15 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[#c9a962]/70 bg-black/30">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-[#c9a962]">
                {profile.displayName?.slice(0, 1) || "U"}
              </div>
            )}
          </div>
          <div className="min-w-[220px] flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9a962]">
              Signed In As
            </p>
            <p className="mt-3 font-cormorant text-4xl tracking-[0.08em]">
              {profile.displayName || user?.name || "Collector"}
            </p>
            <p className="mt-2 text-sm tracking-[0.08em] text-[#f5f5f0]/80">
              {profile.email || user?.email}
            </p>
          </div>
          <div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="border border-[#c9a962] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#c9a962] transition hover:bg-[#c9a962] hover:text-[#0d0d0d]"
            >
              Upload Photo
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <article className="border border-white/15 bg-white/[0.03] p-6">
          <h2 className="font-cormorant text-3xl tracking-[0.08em] text-[#c9a962]">
            Contact Details
          </h2>
          <form className="mt-5 space-y-4" onSubmit={saveProfile}>
            <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#f5f5f0]">Emails</h3>
                <button
                  type="button"
                  className="rounded-full border border-white/25 px-3 py-1 text-xs text-[#f5f5f0]/80"
                >
                  + Add
                </button>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="rounded-full bg-[#c9a962]/20 px-2 py-0.5 text-[11px] text-[#c9a962]">
                      Primary
                    </span>
                    <p className="mt-2 text-sm text-[#f5f5f0]/90">{profile.email}</p>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-[#c9a962] transition hover:text-[#e0c487]"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#f5f5f0]">Phone Numbers</h3>
                <button
                  type="button"
                  className="rounded-full border border-white/25 px-3 py-1 text-xs text-[#f5f5f0]/80"
                >
                  + Add
                </button>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/65">
                    Mobile
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={profile.phone}
                      onChange={(event) =>
                        setProfile((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      className="w-full border border-white/20 bg-transparent px-3 py-2 text-sm text-[#f5f5f0] outline-none focus:border-[#c9a962]"
                      placeholder="(+65) ***-****"
                    />
                    <button
                      type="button"
                      className="text-sm text-[#c9a962] transition hover:text-[#e0c487]"
                    >
                      Change
                    </button>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#f5f5f0]">Addresses</h3>
                <button
                  type="button"
                  className="rounded-full border border-white/25 px-3 py-1 text-xs text-[#f5f5f0]/80"
                >
                  + Add
                </button>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <label className="block">
                  <span className="rounded-full bg-[#c9a962]/20 px-2 py-0.5 text-[11px] text-[#c9a962]">
                    Primary
                  </span>
                  <textarea
                    rows={3}
                    value={profile.address}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, address: event.target.value }))
                    }
                    className="mt-3 w-full border border-white/20 bg-transparent px-3 py-2 text-sm text-[#f5f5f0] outline-none focus:border-[#c9a962]"
                    placeholder="Street, City, Postal Code"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="border border-[#c9a962] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#c9a962] transition hover:bg-[#c9a962] hover:text-[#0d0d0d] disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Contact Details"}
            </button>
            {isUploading ? (
              <p className="text-sm text-[#f5f5f0]/70">Uploading avatar...</p>
            ) : null}
            {status ? <p className="text-sm text-[#f5f5f0]/70">{status}</p> : null}
          </form>
        </article>

        <article className="border border-white/15 bg-white/[0.03] p-6">
          <h2 className="font-cormorant text-3xl tracking-[0.08em] text-[#c9a962]">
            Order History
          </h2>
          <p className="mt-2 text-sm text-[#f5f5f0]/70">
            Total orders: {orderCount}
          </p>
          <div className="mt-5 space-y-4">
            {orders.length === 0 ? (
              <p className="text-sm text-[#f5f5f0]/65">
                No orders yet. This section is ready for checkout integration.
              </p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#c9a962]">
                    {order.status}
                  </p>
                  <p className="mt-2 text-sm text-[#f5f5f0]/85">
                    {new Date(order.createdAt).toLocaleDateString()} - $
                    {order.total.toFixed(2)} {order.currency}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="border border-white/15 bg-white/[0.03] p-6">
        <h2 className="font-cormorant text-3xl tracking-[0.08em] text-[#c9a962]">
          My Favorites
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.length === 0 ? (
            <p className="text-sm text-[#f5f5f0]/65">
              You have no favorites yet. Tap hearts in exhibitions to save.
            </p>
          ) : (
            favorites.map((item) => (
              <Link
                key={item.slug}
                href={`/exhibitions/${item.slug}`}
                className="border border-white/10 bg-black/20 p-3 transition hover:border-[#c9a962]/60"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-40 w-full object-cover"
                />
                <p className="mt-3 font-cormorant text-2xl">{item.title}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[#c9a962]">
                  {item.artist}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
