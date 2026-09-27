import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="narrow">
      <Link className="back-link" href="/profile">← Back to profile</Link>
      <section className="panel">
        <p className="eyebrow">Protected route</p>
        <h1>Members-only country fact</h1>
        <p>Russia is the world’s largest country by total area.</p>
        <p className="muted">Only signed-in users can view this page.</p>
      </section>
    </main>
  );
}
