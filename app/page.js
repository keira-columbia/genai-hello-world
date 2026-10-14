import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import ImmersiveCampus from "../components/ImmersiveCampus";
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

function ratingSummary(momentId, ratings) {
  const momentRatings = ratings.filter((rating) => rating.moment_id === momentId);
  const likes = momentRatings.filter((rating) => rating.value === 1).length;
  const dislikes = momentRatings.filter((rating) => rating.value === -1).length;
  return { likes, dislikes, score: likes - dislikes };
}

export default async function Home() {
  const supabase = await createClient();
  const [{ data: { user } }, momentsResult, captionsResult, votesResult, ratingsResult, profilesResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("moments").select("id,user_id,title,zone,image_url,context,created_at").order("created_at", { ascending: false }),
    supabase.from("captions").select("id,moment_id,caption_text"),
    supabase.from("caption_votes").select("id,moment_id,caption_id"),
    supabase.from("moment_ratings").select("id,user_id,moment_id,value,created_at,updated_at"),
    supabase.from("profiles").select("id,first_name,last_name,avatar_url"),
  ]);

  const moments = momentsResult.data || [];
  const captions = captionsResult.data || [];
  const votes = votesResult.data || [];
  const ratings = ratingsResult.data || [];
  const profiles = profilesResult.data || [];
  const zoneCount = new Set(moments.map((moment) => moment.zone)).size;
  const feedMoments = moments.map((moment) => {
    const winner = winningCaption(moment, captions, votes);
    const summary = ratingSummary(moment.id, ratings);
    return { ...moment, caption: winner?.caption_text || "Caption deliberations pending.", ...summary, userRating: ratings.find((rating) => rating.moment_id === moment.id && rating.user_id === user?.id)?.value || 0 };
  });
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weeklyRatings = ratings.filter((rating) => new Date(rating.updated_at || rating.created_at) >= weekStart);
  const leaderboard = moments.map((moment) => {
    const winner = winningCaption(moment, captions, votes);
    const summary = ratingSummary(moment.id, weeklyRatings);
    return { ...moment, caption: winner?.caption_text || "Caption deliberations pending.", ...summary };
  }).sort((a, b) => b.score - a.score || b.likes - a.likes).slice(0, 5);
  const creatorLeaderboard = [...new Set(moments.map((moment) => moment.user_id))].map((creatorId) => {
    const creatorMoments = moments.filter((moment) => moment.user_id === creatorId);
    const creatorRatings = weeklyRatings.filter((rating) => creatorMoments.some((moment) => moment.id === rating.moment_id));
    const profile = profiles.find((profile) => profile.id === creatorId);
    const likes = creatorRatings.filter((rating) => rating.value === 1).length;
    const dislikes = creatorRatings.filter((rating) => rating.value === -1).length;
    return { id: creatorId, name: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Campus creator", avatar: profile?.avatar_url, posts: creatorMoments.length, likes, score: likes - dislikes };
  }).sort((a, b) => b.score - a.score || b.likes - a.likes || b.posts - a.posts).slice(0, 5);

  return (
    <main className="site-shell">
      <SiteHeader user={user} />
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Live from campus</p>
          <h1>College is a survival story. <em>Caption it.</em></h1>
          <p className="hero-lede">Explore student-life sightings, choose the AI caption that gets it, or report a moment of your own.</p>
          <div className="hero-actions">
            <a className="button primary" href="#campus-walk">Enter campus</a>
            <Link className="button secondary" href="/vote">Rate memes</Link>
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
        <div><strong>{votes.length + ratings.length}</strong><span>votes cast</span></div>
        <div><strong>{zoneCount}</strong><span>zones active</span></div>
      </section>
      <section className="map-section immersive-section" id="campus-walk">
        <div className="section-heading">
          <div><p className="kicker">First-person campus walk</p><h2>Step inside the stories students are telling.</h2></div>
          <p>Move between campus stops, discover live submissions, and open the moments attached to each place.</p>
        </div>
        <ImmersiveCampus moments={moments} />
      </section>
      <section className="two-workspaces">
        <Link className="workspace-card meme-space" href="/vote"><span>01 · RATE THE MEME</span><h2>Funny or<br/>not for me?</h2><p>Move through one campus meme at a time and react in seconds.</p><b>Enter meme deck →</b></Link>
        <Link className="workspace-card caption-space" href="/captions"><span>02 · JUDGE THE WRITING</span><h2>Which caption<br/>wins?</h2><p>See four AI captions for the same image and crown the sharpest one.</p><b>Enter caption lab →</b></Link>
      </section>
      <section className="leaderboard-section meme-leaderboard" id="leaderboard">
        <div className="leaderboard-head"><div><p className="kicker">This week</p><h2>Campus top five</h2></div><span>Resets every Monday</span></div>
        <div className="leaderboard-list">
          {leaderboard.map((moment, index) => <Link className="leaderboard-row" href={`/moments/${moment.id}`} key={moment.id}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <div className="leaderboard-thumb"><Image src={moment.image_url} alt="" fill sizes="80px" unoptimized /></div>
            <span><b>{moment.title}</b><small>“{moment.caption}”</small></span>
            <em>{moment.score >= 0 ? "+" : ""}{moment.score}</em>
          </Link>)}
        </div>
      </section>
      <section className="creator-board" id="creators">
        <div className="section-heading">
          <div><p className="kicker">Creator standings</p><h2>The accounts making campus laugh.</h2></div>
          <p>Weekly points come from likes and dislikes across every meme an account has posted.</p>
        </div>
        <div className="creator-list">
          {creatorLeaderboard.map((creator, index) => <article className="creator-row" key={creator.id}>
            <span className="creator-rank">{index === 0 ? "★" : String(index + 1).padStart(2, "0")}</span>
            {creator.avatar ? <Image className="creator-avatar" src={creator.avatar} alt="" width={58} height={58} unoptimized /> : <span className="creator-avatar fallback">{creator.name[0]}</span>}
            <span className="creator-name"><b>{creator.name}</b><small>{creator.posts} {creator.posts === 1 ? "meme" : "memes"} posted</small></span>
            <span className="creator-likes">{creator.likes} likes</span>
            <strong className="creator-score">{creator.score >= 0 ? "+" : ""}{creator.score}</strong>
          </article>)}
        </div>
      </section>
    </main>
  );
}
