import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { hashPassword } from "@/lib/password";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = (body?.email || "").toString().trim().toLowerCase();
  const password = (body?.password || "").toString();
  const displayName = (body?.displayName || "").toString().trim().slice(0, 120);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: existing, error: existingError } = await supabase
    .from("user_profiles")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: existingError.message || "Failed to check account." },
      { status: 500 },
    );
  }
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const { error } = await supabase.from("user_profiles").insert({
    email,
    display_name: displayName || email.split("@")[0],
    password_hash: hashPassword(password),
    preferences: {},
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create account." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
