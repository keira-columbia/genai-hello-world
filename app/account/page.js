import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SubmitButton from "../../components/SubmitButton";
import { createClient } from "../../lib/supabase/server";
import { updateProfile } from "../profile/actions";

export const dynamic="force-dynamic";
export default async function AccountPage({searchParams}){
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)redirect("/login");
  const [{data:profile},{data:moments=[]},{data:votes=[]},{data:ratings=[]}]=await Promise.all([
    supabase.from("profiles").select("first_name,last_name,avatar_url").eq("id",user.id).maybeSingle(),
    supabase.from("moments").select("id,title,zone").eq("user_id",user.id).order("created_at",{ascending:false}),
    supabase.from("caption_votes").select("id,moment_id,captions(caption_text),moments(title)").eq("user_id",user.id).order("updated_at",{ascending:false}),
    supabase.from("moment_ratings").select("id,moment_id,value,moments(title)").eq("user_id",user.id).order("updated_at",{ascending:false})
  ]); const params=await searchParams; const avatar=profile?.avatar_url||user.user_metadata?.avatar_url;
  return <main className="site-shell account-page"><SiteHeader user={user}/><section className="account-hero"><div>{avatar?<Image src={avatar} alt="Profile" width={104} height={104} unoptimized/>:<span>{user.email?.[0]?.toUpperCase()}</span>}<p className="kicker">Your campus identity</p><h1>{profile?.first_name||"Campus"} {profile?.last_name||"Creator"}</h1><p>{moments.length} reports · {ratings.length+votes.length} verdicts</p></div><Link className="button primary" href="/generate">＋ Create something new</Link></section>
  <section className="account-grid"><article className="account-profile"><div className="record-panel-head"><h2>Edit profile</h2><span>PRIVATE</span></div>{params?.saved&&<p className="message success">Profile saved.</p>}{params?.error&&<p className="message error">{params.error}</p>}<form className="profile-form" action={updateProfile}><input type="hidden" name="returnTo" value="/account"/><input type="hidden" name="currentAvatar" value={profile?.avatar_url||""}/><label>First name<input name="firstName" defaultValue={profile?.first_name||""} maxLength={60}/></label><label>Last name<input name="lastName" defaultValue={profile?.last_name||""} maxLength={60}/></label><label>Profile photo<input name="photo" type="file" accept="image/jpeg,image/png,image/webp"/></label><SubmitButton pendingText="Saving…" className="button primary">Save profile</SubmitButton></form></article>
  <div className="activity-stack"><article className="record-panel"><div className="record-panel-head"><h2>Your reports</h2><span>{moments.length}</span></div>{moments.length?moments.slice(0,5).map(m=><Link className="record-row" href={`/moments/${m.id}`} key={m.id}><span><strong>{m.title}</strong><small>{m.zone}</small></span><b>→</b></Link>):<p className="record-empty">Nothing posted yet.</p>}</article><article className="record-panel"><div className="record-panel-head"><h2>Your recent votes</h2><span>{ratings.length+votes.length}</span></div>{ratings.slice(0,3).map(r=><Link className="record-row" href={`/moments/${r.moment_id}`} key={r.id}><span><strong>{r.moments?.title}</strong><small>{r.value===1?"Funny":"Not for me"}</small></span><b>→</b></Link>)}</article></div></section></main>;
}
