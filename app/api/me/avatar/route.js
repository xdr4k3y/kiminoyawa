import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentUserEmail } from "@/lib/server-user";

function extensionForType(contentType) {
  if (!contentType) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  return "jpg";
}

function sanitizeEmail(email) {
  return email.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request) {
  const email = await getCurrentUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be 5MB or less." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  await supabase.storage.createBucket("avatars", { public: true }).catch(() => null);

  const ext = extensionForType(file.type);
  const path = `${sanitizeEmail(email)}/avatar.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message || "Failed to upload avatar." },
      { status: 500 },
    );
  }

  const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = publicData?.publicUrl || "";

  const { error: updateError } = await supabase
    .from("user_profiles")
    .upsert({ email, avatar_url: avatarUrl }, { onConflict: "email" });

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message || "Failed to save avatar." },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: { avatarUrl } });
}
