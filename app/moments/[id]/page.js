import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import SubmitButton from "../../../components/SubmitButton";
import { createClient } from "../../../lib/supabase/server";
import { castVote } from "../actions";

export const dynamic = "force-dynamic";

export default async function MomentPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const [{ data: { user } }, momentResult, captionsResult, votesResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("moments").select("id,user_id,title,zone,context,image_url,image_description,created_at").eq("id", id).maybeSingle(),
    supabase.from("captions").select("id,moment_id,caption_text").eq("moment_id", id).order("created_at"),
    supabase.from("caption_votes").select("id,user_id,moment_id,caption_id").eq("moment_id", id),
  ]);
  const moment = momentResult.data;
  if (!moment) notFound();
  const captions = captionsResult.data || [];
  const votes = votesResult.data || [];
  const userVote = votes.find((vote) => vote.user_id === user?.id)?.caption_id;

  return (
    <main className="site-shell moment-page">
      <SiteHeader user={user} />
      <Link className="back-link" href="/#signals">← Back to survival map</Link>
      <section className="case-layout">
        <div className="evidence-panel">
          <div className="evidence-head"><span>PHOTO EVIDENCE</span><span>{moment.zone.toUpperCase()}</span></div>
          <div className="evidence-photo"><img src={moment.image_url} alt={moment.title} /></div>
          <div className="ai-observation"><span>AI VISUAL SCAN</span><p>{moment.image_description}</p></div>
        </div>
        <div className="verdict-panel">
          <p className="kicker">Open campus signal</p>
          <h1>{moment.title}</h1>
          {moment.context && <p className="context-line">Uploader context: {moment.context}</p>}
          {query?.created && <p className="message success">Signal generated. The captions are ready for a campus verdict.</p>}
          {query?.voted && <p className="message success">Verdict recorded. You can change it at any time.</p>}
          {query?.error && <p className="message error">{query.error}</p>}
          <div className="caption-heading"><h2>Choose the official caption</h2><span>{votes.length} votes</span></div>
          <div className="caption-stack">
            {captions.map((caption, index) => {
              const count = votes.filter((vote) => vote.caption_id === caption.id).length;
              const selected = userVote === caption.id;
              return (
                <form action={castVote} className={`caption-ballot ${selected ? "selected" : ""}`} key={caption.id}>
                  <input type="hidden" name="momentId" value={moment.id} /><input type="hidden" name="captionId" value={caption.id} />
                  <span className="ballot-letter">{String.fromCharCode(65 + index)}</span><p>{caption.caption_text}</p>
                  <div className="vote-meta"><span>{count} {count === 1 ? "vote" : "votes"}</span>{user ? <SubmitButton pendingText="Saving…" className="stamp-button">{selected ? "Your verdict" : "Stamp this"}</SubmitButton> : <Link href="/login">Sign in to vote</Link>}</div>
                </form>
              );
            })}
          </div>
          {!user && <p className="signin-note">Browsing is public. Voting is protected so every verdict belongs to a real signed-in user.</p>}
        </div>
      </section>
    </main>
  );
}
