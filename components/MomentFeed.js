"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { rateMoment } from "../app/ratings/actions";

export default function MomentFeed({ moments, signedIn, standalone = false }) {
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState(() => Object.fromEntries(moments.map((moment) => [moment.id, moment.userRating])));
  const [totals, setTotals] = useState(() => Object.fromEntries(moments.map((moment) => [moment.id, { likes: moment.likes, dislikes: moment.dislikes }])));
  const [shared, setShared] = useState(false);
  if (!moments.length) return null;

  const moment = moments[index];
  const currentRating = ratings[moment.id];

  async function vote(formData) {
    const value = Number(formData.get("value"));
    const previous = currentRating;
    setRatings((current) => ({ ...current, [moment.id]: value }));
    setTotals((current) => ({
      ...current,
      [moment.id]: {
        likes: current[moment.id].likes + (value === 1 ? 1 : 0) - (previous === 1 ? 1 : 0),
        dislikes: current[moment.id].dislikes + (value === -1 ? 1 : 0) - (previous === -1 ? 1 : 0),
      },
    }));
    const result = await rateMoment(formData);
    if (result?.error) {
      setRatings((current) => ({ ...current, [moment.id]: previous }));
      setTotals((current) => ({
        ...current,
        [moment.id]: {
          likes: current[moment.id].likes - (value === 1 ? 1 : 0) + (previous === 1 ? 1 : 0),
          dislikes: current[moment.id].dislikes - (value === -1 ? 1 : 0) + (previous === -1 ? 1 : 0),
        },
      }));
    }
  }

  async function share() {
    const url = `${window.location.origin}/moments/${moment.id}`;
    try {
      if (navigator.share) await navigator.share({ title: moment.title, text: moment.caption, url });
      else await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      // Closing the system share sheet simply leaves the card unchanged.
    }
  }

  return (
    <div className={`voting-stage ${standalone ? "standalone" : ""}`}>
      <button className="feed-arrow" aria-label="Previous meme" onClick={() => setIndex((index - 1 + moments.length) % moments.length)}>←</button>
      <article className="voting-card">
        <div className="voting-progress"><span>MEME {index + 1} / {moments.length}</span><span>{moment.zone}</span></div>
        <div className="voting-photo"><Image src={moment.image_url} alt={moment.title} fill sizes="(max-width: 760px) 92vw, 620px" unoptimized /></div>
        <div className="voting-copy">
          <p className="kicker">AI caption contender</p>
          <h3>{moment.title}</h3>
          <p className="feed-caption">“{moment.caption}”</p>
          <div className="quick-actions">
            {signedIn ? <>
              <form action={vote}><input type="hidden" name="momentId" value={moment.id} /><input type="hidden" name="value" value="1" /><button aria-label="Like this meme" className={currentRating === 1 ? "reaction active" : "reaction"}>▲ <span>Funny</span></button></form>
              <form action={vote}><input type="hidden" name="momentId" value={moment.id} /><input type="hidden" name="value" value="-1" /><button aria-label="Dislike this meme" className={currentRating === -1 ? "reaction active down" : "reaction down"}>▼ <span>Not for me</span></button></form>
            </> : <Link className="reaction signin-reaction" href={`/login?next=${encodeURIComponent("/vote")}`}>Sign in to vote</Link>}
            <button className="share-button" onClick={share}>{shared ? "Link copied!" : "Share ↗"}</button>
          </div>
          <div className="feed-meta"><span>{totals[moment.id].likes} likes · {totals[moment.id].dislikes} dislikes</span><Link href="/captions">Judge AI captions →</Link></div>
        </div>
      </article>
      <button className="feed-arrow" aria-label="Next meme" onClick={() => setIndex((index + 1) % moments.length)}>→</button>
      <div className="feed-dots" aria-label="Choose a meme">{moments.map((item, dot) => <button aria-label={`Show ${item.title}`} className={dot === index ? "active" : ""} key={item.id} onClick={() => setIndex(dot)} />)}</div>
    </div>
  );
}
