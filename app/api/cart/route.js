import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

async function cartExists(supabase, cartId) {
  if (!cartId) return false;
  const { data, error } = await supabase
    .from("carts")
    .select("id")
    .eq("id", cartId)
    .maybeSingle();
  if (error) return false;
  return Boolean(data?.id);
}

function mapCartItems(rows) {
  return (rows || []).map((row) => {
    const artwork = Array.isArray(row.artworks) ? row.artworks[0] : row.artworks;
    const artist = Array.isArray(artwork?.artists)
      ? artwork.artists[0]
      : artwork?.artists;

    return {
      slug: artwork?.slug || "",
      title: artwork?.title || "",
      artist: artist?.name || "",
      image: artwork?.image_url || "",
      price: Number(artwork?.price || 0),
      quantity: Number(row.quantity || 1),
    };
  });
}

export async function GET(request) {
  const cartId = request.nextUrl.searchParams.get("cartId");
  if (!cartId) {
    return NextResponse.json({ data: [], cartId: null });
  }

  const supabase = createSupabaseServerClient();
  const exists = await cartExists(supabase, cartId);
  if (!exists) {
    return NextResponse.json({ data: [], cartId: null });
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("quantity, artworks(slug, title, image_url, price, artists(name))")
    .eq("cart_id", cartId);

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load cart." },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: mapCartItems(data), cartId });
}

export async function POST(request) {
  const supabase = createSupabaseServerClient();
  const body = await request.json().catch(() => ({}));
  const requestedCartId = body?.cartId || null;

  if (requestedCartId) {
    const exists = await cartExists(supabase, requestedCartId);
    if (exists) {
      return NextResponse.json({ cartId: requestedCartId });
    }
  }

  const { data, error } = await supabase
    .from("carts")
    .insert({})
    .select("id")
    .single();

  if (error || !data?.id) {
    return NextResponse.json(
      { error: error?.message || "Failed to create cart." },
      { status: 500 },
    );
  }

  return NextResponse.json({ cartId: data.id }, { status: 201 });
}
