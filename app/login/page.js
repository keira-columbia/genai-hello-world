import Link from "next/link";
import { redirect } from "next/navigation";
import { signInWithGoogle } from "../auth/actions";
import { createClient } from "../../lib/supabase/server";

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/profile");

  const params = await searchParams;

  return (
    <main className="narrow">
      <Link className="back-link" href="/">← Back to countries</Link>
      <section className="panel auth-panel">
        <p className="eyebrow">Assignment 3</p>
        <h1>Sign in</h1>
        <p>Use Google to open your profile and the private page.</p>
        {params?.error && <p className="message error">{params.error}</p>}
        <form action={signInWithGoogle}>
          <button type="submit">Continue with Google</button>
        </form>
      </section>
    </main>
  );
}
