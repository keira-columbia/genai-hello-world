import SiteHeader from "../../components/SiteHeader";
import MomentFeed from "../../components/MomentFeed";
import { createClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

function winner(momentId, captions, votes) {
  return captions.filter(c=>c.moment_id===momentId).map(c=>({...c,count:votes.filter(v=>v.caption_id===c.id).length})).sort((a,b)=>b.count-a.count)[0];
}

export default async function VotePage() {
  const supabase=await createClient();
  const [{data:{user}},{data:moments=[]},{data:captions=[]},{data:votes=[]},{data:ratings=[]}]=await Promise.all([
    supabase.auth.getUser(),
    supabase.from("moments").select("id,title,zone,image_url,created_at").order("created_at",{ascending:false}),
    supabase.from("captions").select("id,moment_id,caption_text"),
    supabase.from("caption_votes").select("caption_id"),
    supabase.from("moment_ratings").select("user_id,moment_id,value"),
  ]);
  const cards=moments.map(m=>{const selected=winner(m.id,captions,votes);const mine=ratings.find(r=>r.user_id===user?.id&&r.moment_id===m.id);return {...m,caption:selected?.caption_text||"Caption pending.",likes:ratings.filter(r=>r.moment_id===m.id&&r.value===1).length,dislikes:ratings.filter(r=>r.moment_id===m.id&&r.value===-1).length,userRating:mine?.value||0};});
  return <main className="site-shell vote-page"><SiteHeader user={user}/><section className="workspace-hero"><p className="kicker">Workspace 01 · Meme deck</p><h1>Trust your first reaction.</h1><p>One image. One AI caption. Decide whether it lands, then move to the next.</p><div className="workspace-switch"><span className="active">Rate memes</span><a href="/captions">Judge captions →</a></div></section>{cards.length?<MomentFeed moments={cards} signedIn={Boolean(user)} standalone/>:<p>No memes yet.</p>}</main>;
}
