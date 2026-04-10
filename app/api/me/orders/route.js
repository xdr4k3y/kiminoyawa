import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentUserEmail } from "@/lib/server-user";

export async function GET() {
  const email = await getCurrentUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, status, total, currency, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (ordersError) {
    return NextResponse.json(
      { error: ordersError.message || "Failed to load orders." },
      { status: 500 },
    );
  }

  const orderIds = (orders || []).map((order) => order.id);
  if (orderIds.length === 0) {
    return NextResponse.json({ data: [] });
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("order_id, quantity, unit_price, artworks(slug, title, image_url)")
    .in("order_id", orderIds);

  if (itemsError) {
    return NextResponse.json(
      { error: itemsError.message || "Failed to load order items." },
      { status: 500 },
    );
  }

  const itemsByOrder = new Map();
  for (const row of items || []) {
    const artwork = Array.isArray(row.artworks) ? row.artworks[0] : row.artworks;
    const current = itemsByOrder.get(row.order_id) || [];
    current.push({
      slug: artwork?.slug || "",
      title: artwork?.title || "",
      image: artwork?.image_url || "",
      quantity: Number(row.quantity || 1),
      unitPrice: Number(row.unit_price || 0),
    });
    itemsByOrder.set(row.order_id, current);
  }

  return NextResponse.json({
    data: (orders || []).map((order) => ({
      id: order.id,
      status: order.status,
      total: Number(order.total || 0),
      currency: order.currency,
      createdAt: order.created_at,
      items: itemsByOrder.get(order.id) || [],
    })),
  });
}
