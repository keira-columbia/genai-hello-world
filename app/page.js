import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import CampusMap from "../components/CampusMap";
import { createClient } from "../lib/supabase/server";

export const dynamic = "force-dynamic";

function winningCaption(moment, captions, votes) {
  const choices = captions.filter((caption) => caption.moment_id === moment.id);
  if (!choices.length) return null;

  return choices
    .map((caption) => ({
      ...caption,
      votes: votes.filter((vote) => vote.caption_id === caption.id).length,
    }))
    .sort((a, b) => b.votes - a.votes)[0];
}

export default async function Home() {
  const supabase = await createClient();
  const [{ data: { user } }, momentsResult, captionsResult, votesResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("moments").select("id,user_id,title,zone,image_url,context,created_at").order("created_at", { ascending: false }),
    supabase.from("captions").select("id,moment_id,caption_text"),
    supabase.from("caption_votes").select("id,moment_id,caption_id"),
  ]);

  const moments = momentsResult.data || [];
  const captions = captionsResult.data || [];
  const votes = votesResult.data || [];
  const zoneCount = new Set(moments.map((moment) => moment.zone)).size;

  return (
    <main className="site-shell">
      <SiteHeader user={user} />
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Live from campus</p>
          <h1>College is a survival story. <em>Caption it.</em></h1>
          <p className="hero-lede">Explore student-life sightings, choose the AI caption that gets it, or report a moment of your own.</p>
          <div className="hero-actions">
            <a className="button primary" href="#signals">Explore signals</a>
            <Link className="button secondary" href={user ? "/generate" : "/login"}>Report a moment</Link>
          </div>
        </div>
        <aside className="dispatch-card" aria-label="How the archive works">
          <div className="dispatch-light" />
          <p className="dispatch-label">How it works</p>
          <ol>
            <li><span>01</span> Upload a campus moment</li>
            <li><span>02</span> AI reads the scene</li>
            <li><span>03</span> AI writes four captions</li>
            <li><span>04</span> The campus picks the winner</li>
          </ol>
        </aside>
      </section>
      <section className="pulse-strip" aria-label="Archive statistics">
        <div><strong>{moments.length}</strong><span>signals reported</span></div>
        <div><strong>{captions.length}</strong><span>AI captions</span></div>
        <div><strong>{votes.length}</strong><span>verdicts cast</span></div>
        <div><strong>{zoneCount}</strong><span>zones active</span></div>
      </section>
      <section className="map-section" id="signals">
        <div className="section-heading">
          <div><p className="kicker">The survival map</p><h2>Where is campus losing it today?</h2></div>
          <p>Each blinking signal is a real submission. Open one and choose the caption that belongs in the official record.</p>
        </div>
        <CampusMap moments={moments} />
      </section>
      <section className="latest-section">
        <div className="section-heading compact"><div><p className="kicker">Latest field notes</p><h2>Fresh from the archive</h2></div></div>
        {moments.length === 0 ? (
          <div className="empty-state">
            <span className="empty-signal">✦</span>
            <h3>The archive is quiet—for now.</h3>
            <p>Report the first campus moment and let AI put it on the record.</p>
            <Link className="button primary" href={user ? "/generate" : "/login"}>Report a moment</Link>
          </div>
        ) : (
          <div className="moment-grid">
            {moments.slice(0, 6).map((moment, index) => {
              const winner = winningCaption(moment, captions, votes);
              return (
                <Link className={`moment-card tilt-${index % 3}`} href={`/moments/${moment.id}`} key={moment.id}>
                  <div className="photo-wrap">
                    <Image src={moment.image_url} alt={moment.title} fill sizes="(max-width: 760px) 100vw, 33vw" unoptimized />
                    <span className="zone-chip">{moment.zone}</span>
                  </div>
                  <div className="moment-card-copy">
                    <p className="case-number">Signal {String(index + 1).padStart(3, "0")}</p>
                    <h3>{moment.title}</h3>
                    <p className="winning-line">“{winner?.caption_text || "Caption deliberations pending."}”</p>
                    <div className="card-footer"><span>{winner?.votes || 0} verdicts</span><span>Open record →</span></div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
