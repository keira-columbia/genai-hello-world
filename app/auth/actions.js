"use server";

import { headers } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function signInWithGoogle(formData) {
  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const requestedNext = formData.get("next")?.toString();
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/profile";
  const cookieStore = await cookies();
  cookieStore.set("oauth_next", next, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
