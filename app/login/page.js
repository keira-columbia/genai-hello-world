import Link from "next/link";
import { redirect } from "next/navigation";
import { signInWithGoogle } from "../auth/actions";
import { createClient } from "../../lib/supabase/server";

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/");
  const params = await searchParams;

  return (
    <main className="login-shell">
      <Link className="brand login-brand" href="/"><span className="brand-mark">CS</span><span>Campus Survival Map</span></Link>
      <section className="login-card">
        <div className="login-stamp">AUTHORIZED<br />OBSERVERS</div>
        <p className="kicker">Join the field team</p><h1>Campus needs your verdict.</h1>
        <p>Sign in with Google to report real moments, generate AI captions, vote, and keep a private survival record.</p>
        {params?.error && <p className="message error">{params.error}</p>}
        <form action={signInWithGoogle}><button className="google-button" type="submit"><span>G</span> Continue with Google</button></form>
        <small>Browsing stays public. Creating and voting require an account.</small>
      </section>
      <Link className="back-link" href="/">← Return to the map</Link>
    </main>
  );
}
