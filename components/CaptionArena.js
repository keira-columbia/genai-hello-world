"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { castVote } from "../app/moments/actions";

export default function CaptionArena({ moments, signedIn }) {
  const [index,setIndex]=useState(0); const [selected,setSelected]=useState({});
  if(!moments.length)return null; const moment=moments[index];
  async function choose(formData){const captionId=formData.get("captionId");setSelected(s=>({...s,[moment.id]:captionId}));await castVote(formData);}
  return <div className="caption-arena">
    <div className="arena-image"><div className="arena-counter">CASE {String(index+1).padStart(2,"0")} / {String(moments.length).padStart(2,"0")}</div><Image src={moment.image_url} alt={moment.title} fill sizes="(max-width:800px) 100vw,50vw" unoptimized/><div className="arena-title"><span>{moment.zone}</span><h2>{moment.title}</h2></div></div>
    <div className="arena-ballot"><p className="kicker">Choose the official caption</p><h3>Which line belongs on this image?</h3><div className="arena-options">{moment.captions.map((caption,i)=><form action={choose} key={caption.id}><input type="hidden" name="momentId" value={moment.id}/><input type="hidden" name="captionId" value={caption.id}/><input type="hidden" name="workspace" value="captions"/>{signedIn?<button className={(selected[moment.id]||moment.userVote)===caption.id?"chosen":""}><i>{String.fromCharCode(65+i)}</i><span>{caption.caption_text}</span><small>{caption.votes} votes</small></button>:<Link href="/login?next=/captions"><i>{String.fromCharCode(65+i)}</i><span>{caption.caption_text}</span><small>Sign in</small></Link>}</form>)}</div><div className="arena-nav"><button onClick={()=>setIndex((index-1+moments.length)%moments.length)}>← Previous</button><span>{index+1} of {moments.length}</span><button onClick={()=>setIndex((index+1)%moments.length)}>Next →</button></div></div>
  </div>;
}
