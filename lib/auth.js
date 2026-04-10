import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createSupabaseServerClient } from "@/lib/supabase";
import { verifyPassword } from "@/lib/password";

function isConfigured(value) {
  if (!value) return false;
  return !value.startsWith("your_") && !value.startsWith("replace_with_");
}

const googleClientId =
  process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "";
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "";

const providers = [
  CredentialsProvider({
    id: "credentials",
    name: "Email Login",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const expectedUser = process.env.DEMO_USER || "demo";
      const expectedPassword = process.env.DEMO_PASSWORD || "demo123";

      const email = (credentials?.email || "").toString().trim().toLowerCase();
      const password = credentials?.password || "";
      if (email === expectedUser && password === expectedPassword) {
        return {
          id: "demo-user",
          name: "Demo Collector",
          email: "demo@kiminoyawa.gallery",
          image: "/images/2.jpg",
        };
      }

      const supabase = createSupabaseServerClient();
      const { data: user, error } = await supabase
        .from("user_profiles")
        .select("id, email, display_name, avatar_url, password_hash")
        .eq("email", email)
        .maybeSingle();

      if (error || !user?.password_hash) {
        return null;
      }
      if (!verifyPassword(password, user.password_hash)) {
        return null;
      }

      return {
        id: user.id,
        name: user.display_name || user.email,
        email: user.email,
        image: user.avatar_url || null,
      };
    },
  }),
];

if (isConfigured(googleClientId) && isConfigured(googleClientSecret)) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const authOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};
