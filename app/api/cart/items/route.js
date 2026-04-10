import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

async function getArtworkIdBySlug(supabase, slug) {
  const { data, error } = await supabase
    .from("artworks")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data?.id) {
    return null;
  }

  return data.id;
}

async function getCartItemsPayload(supabase, cartId) {
  const { data, error } = await supabase
    .from("cart_items")
    .select("quantity, artworks(slug, title, image_url, price, artists(name))")
    .eq("cart_id", cartId);

  if (error) {
    throw new Error(error.message || "Failed to load cart items.");
  }

  return (data || []).map((row) => {
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

export async function POST(request) {
  const supabase = createSupabaseServerClient();
  const body = await request.json().catch(() => ({}));
  const cartId = body?.cartId;
  const slug = body?.slug;
  const quantityDelta = Number(body?.quantityDelta ?? 1);

  if (!cartId || !slug || !Number.isFinite(quantityDelta)) {
    return NextResponse.json(
      { error: "cartId, slug, and valid quantityDelta are required." },
      { status: 400 },
    );
  }

  const artworkId = await getArtworkIdBySlug(supabase, slug);
  if (!artworkId) {
    return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
  }

  const { data: existing, error: existingError } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("cart_id", cartId)
    .eq("artwork_id", artworkId)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: existingError.message || "Failed to read cart item." },
      { status: 500 },
    );
  }

  const nextQuantity = Number(existing?.quantity || 0) + quantityDelta;

  if (nextQuantity <= 0) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId)
      .eq("artwork_id", artworkId);
    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to remove cart item." },
        { status: 500 },
      );
    }
  } else if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: nextQuantity })
      .eq("cart_id", cartId)
      .eq("artwork_id", artworkId);
    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update cart item." },
        { status: 500 },
      );
    }
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, artwork_id: artworkId, quantity: nextQuantity });
    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to add cart item." },
        { status: 500 },
      );
    }
  }

  try {
    const items = await getCartItemsPayload(supabase, cartId);
    return NextResponse.json({ data: items, cartId });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load updated cart." },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  const supabase = createSupabaseServerClient();
  const body = await request.json().catch(() => ({}));
  const cartId = body?.cartId;
  const slug = body?.slug;
  const quantity = Number(body?.quantity);

  if (!cartId || !slug || !Number.isFinite(quantity)) {
    return NextResponse.json(
      { error: "cartId, slug, and valid quantity are required." },
      { status: 400 },
    );
  }

  const artworkId = await getArtworkIdBySlug(supabase, slug);
  if (!artworkId) {
    return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
  }

  if (quantity <= 0) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId)
      .eq("artwork_id", artworkId);
    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to remove cart item." },
        { status: 500 },
      );
    }
  } else {
    const { data: existing } = await supabase
      .from("cart_items")
      .select("cart_id")
      .eq("cart_id", cartId)
      .eq("artwork_id", artworkId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("cart_id", cartId)
        .eq("artwork_id", artworkId);
      if (error) {
        return NextResponse.json(
          { error: error.message || "Failed to update cart item." },
          { status: 500 },
        );
      }
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({ cart_id: cartId, artwork_id: artworkId, quantity });
      if (error) {
        return NextResponse.json(
          { error: error.message || "Failed to add cart item." },
          { status: 500 },
        );
      }
    }
  }

  try {
    const items = await getCartItemsPayload(supabase, cartId);
    return NextResponse.json({ data: items, cartId });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load updated cart." },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  const supabase = createSupabaseServerClient();
  const body = await request.json().catch(() => ({}));
  const cartId = body?.cartId;
  const slug = body?.slug;

  if (!cartId || !slug) {
    return NextResponse.json(
      { error: "cartId and slug are required." },
      { status: 400 },
    );
  }

  const artworkId = await getArtworkIdBySlug(supabase, slug);
  if (!artworkId) {
    return NextResponse.json({ error: "Artwork not found." }, { status: 404 });
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId)
    .eq("artwork_id", artworkId);

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to remove cart item." },
      { status: 500 },
    );
  }

  try {
    const items = await getCartItemsPayload(supabase, cartId);
    return NextResponse.json({ data: items, cartId });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to load updated cart." },
      { status: 500 },
    );
  }
}
