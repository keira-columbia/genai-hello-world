import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import { createClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: moments }, { data: votes }, { data: ratings }] = await Promise.all([
    supabase.from("moments").select("id,title,zone,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("caption_votes").select("id,moment_id,caption_id,captions(caption_text),moments(title)").eq("user_id", user.id).order("updated_at", { ascending: false }),
    supabase.from("moment_ratings").select("id,moment_id,value,moments(title)").eq("user_id", user.id).order("updated_at", { ascending: false }),
  ]);

  return (
    <main className="site-shell">
      <SiteHeader user={user} />
      <section className="record-hero">
        <p className="kicker">Protected route</p>
        <h1>Your survival record</h1>
        <p>Only you can open this page. It collects the signals you reported and the captions you backed.</p>
      </section>
      <section className="record-grid">
        <article className="record-panel">
          <div className="record-panel-head"><h2>Your reports</h2><span>{moments?.length || 0}</span></div>
          {!moments?.length ? <p className="record-empty">No reports yet. <Link href="/generate">Send the first one.</Link></p> : moments.map((moment) => (
            <Link className="record-row" href={`/moments/${moment.id}`} key={moment.id}><span><strong>{moment.title}</strong><small>{moment.zone}</small></span><b>→</b></Link>
          ))}
        </article>
        <article className="record-panel">
          <div className="record-panel-head"><h2>Your verdicts</h2><span>{votes?.length || 0}</span></div>
          {!votes?.length ? <p className="record-empty">No verdicts yet. <Link href="/#signals">Open the map.</Link></p> : votes.map((vote) => (
            <Link className="record-row" href={`/moments/${vote.moment_id}`} key={vote.id}><span><strong>{vote.moments?.title}</strong><small>“{vote.captions?.caption_text}”</small></span><b>→</b></Link>
          ))}
        </article>
      </section>
      <section className="record-panel record-ratings">
        <div className="record-panel-head"><h2>Your meme ratings</h2><span>{ratings?.length || 0}</span></div>
        {!ratings?.length ? <p className="record-empty">No quick ratings yet. <Link href="/#vote">Start voting.</Link></p> : ratings.map((rating) => (
          <Link className="record-row" href={`/moments/${rating.moment_id}`} key={rating.id}><span><strong>{rating.moments?.title}</strong><small>{rating.value === 1 ? "Funny ▲" : "Not for me ▼"}</small></span><b>→</b></Link>
        ))}
      </section>
    </main>
  );
}
