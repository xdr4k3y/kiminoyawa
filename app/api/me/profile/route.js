import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentUserEmail } from "@/lib/server-user";

async function ensureProfile(supabase, email) {
  const { data: existing, error: existingError } = await supabase
    .from("user_profiles")
    .select("email, display_name, avatar_url, bio, preferences")
    .eq("email", email)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message || "Failed to load profile.");
  }

  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from("user_profiles")
    .insert({ email })
    .select("email, display_name, avatar_url, bio, preferences")
    .single();

  if (createError) {
    throw new Error(createError.message || "Failed to create profile.");
  }

  return created;
}

export async function GET() {
  const email = await getCurrentUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  try {
    const profile = await ensureProfile(supabase, email);
    return NextResponse.json({
      data: {
        email: profile.email,
        displayName: profile.display_name || "",
        avatarUrl: profile.avatar_url || "",
        bio: profile.bio || "",
        preferences: profile.preferences || {},
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load profile." },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  const email = await getCurrentUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const displayName = (body?.displayName || "").toString().slice(0, 120);
  const avatarUrl = (body?.avatarUrl || "").toString().slice(0, 500);
  const bio = (body?.bio || "").toString().slice(0, 800);
  const preferences =
    body?.preferences && typeof body.preferences === "object"
      ? body.preferences
      : {};

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
        bio,
        preferences,
      },
      { onConflict: "email" },
    )
    .select("email, display_name, avatar_url, bio, preferences")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    data: {
      email: data.email,
      displayName: data.display_name || "",
      avatarUrl: data.avatar_url || "",
      bio: data.bio || "",
      preferences: data.preferences || {},
    },
  });
}
