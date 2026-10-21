import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const cookieStore = await cookies();
      const requestedNext = cookieStore.get("oauth_next")?.value;
      const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/profile";
      cookieStore.delete("oauth_next");
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could%20not%20sign%20in`);
}
