"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

const stops = [
  { id:"gates", zone:"Classroom", eyebrow:"116th Street · College Walk", title:"Enter College Walk", copy:"Start on the pedestrian path and follow the conversation through the center of campus.", left:"Dorms", right:"Library", accent:"VIEW 01", image:"https://upload.wikimedia.org/wikipedia/commons/e/e4/College_Walk_%28116th_Street%29%2C_Columbia_University_%286337955425%29.jpg", position:"50% 52%", credit:"Photo: InSapphoWeTrust / Wikimedia Commons", source:"https://commons.wikimedia.org/wiki/File:College_Walk_(116th_Street),_Columbia_University_(6337955425).jpg" },
  { id:"library", zone:"Library", eyebrow:"Butler Library · South Lawn", title:"The all-nighter district", copy:"Printer drama, study plans and the quiet-floor moments everyone recognizes.", left:"Classrooms", right:"Dining", accent:"VIEW 02", image:"https://upload.wikimedia.org/wikipedia/commons/a/aa/Butler_Library_Columbia_University.jpg", position:"50% 54%", credit:"Photo: JSquish / Wikimedia Commons", source:"https://commons.wikimedia.org/wiki/File:Butler_Library_Columbia_University.jpg" },
  { id:"dorms", zone:"Dorms", eyebrow:"John Jay Hall · West campus", title:"Where roommate lore begins", copy:"Tiny rooms, laundry negotiations and everything that happens after midnight.", left:"Subway", right:"Dining", accent:"VIEW 03", image:"https://upload.wikimedia.org/wikipedia/commons/f/f3/John_Jay_Hall_Columbia_University.jpg", position:"50% 46%", credit:"Photo: JSquish / Wikimedia Commons", source:"https://commons.wikimedia.org/wiki/File:John_Jay_Hall_Columbia_University.jpg" },
  { id:"dining", zone:"Dining", eyebrow:"John Jay · Campus dining", title:"The unofficial debate hall", copy:"A live record of trays, lines and opinions students will defend forever.", left:"Library", right:"City", accent:"VIEW 04", image:"https://upload.wikimedia.org/wikipedia/commons/c/c2/John_Jay_lobby.jpg", position:"50% 48%", credit:"Photo: Wikimedia Commons", source:"https://commons.wikimedia.org/wiki/File:John_Jay_lobby.jpg" },
  { id:"subway", zone:"Subway", eyebrow:"116th Street station · Broadway", title:"The commute portal", copy:"Delays, express-train mistakes and the moment a weekend plan leaves campus.", left:"Dorms", right:"City", accent:"VIEW 05", image:"https://upload.wikimedia.org/wikipedia/commons/e/ee/116th_Street_-_Entrance.jpg", position:"50% 55%", credit:"Photo: Harrison Leong / Wikimedia Commons", source:"https://commons.wikimedia.org/wiki/File:116th_Street_-_Entrance.jpg" },
  { id:"city", zone:"City", eyebrow:"Beyond the gates · New York City", title:"Weekend side quests", copy:"The city chapter of college life, submitted by students who actually made it downtown.", left:"Subway", right:"Classroom", accent:"VIEW 06", image:"https://upload.wikimedia.org/wikipedia/commons/6/68/Central_Park_%2810164%29.jpg", position:"50% 46%", credit:"Photo: Rhododendrites / Wikimedia Commons", source:"https://commons.wikimedia.org/wiki/File:Central_Park_(10164).jpg" },
];

export default function ImmersiveCampus({ moments }) {
  const [index, setIndex] = useState(0);
  const [pan, setPan] = useState(0);
  const drag = useRef(null);
  const stop = stops[index];
  const visible = useMemo(() => moments.filter((m) => m.zone === stop.zone).slice(0,3), [moments, stop.zone]);
  const move = (step) => { setIndex((index + step + stops.length) % stops.length); setPan(0); };
  const selectStop = (next) => { setIndex(next); setPan(0); };
  const startLook = (event) => { drag.current = { x:event.clientX, pan }; event.currentTarget.setPointerCapture(event.pointerId); };
  const lookAround = (event) => { if (!drag.current) return; setPan(Math.max(-16, Math.min(16, drag.current.pan + (event.clientX - drag.current.x) / 18))); };
  const stopLook = () => { drag.current = null; };
  return <div className={`campus-walk stop-${stop.id}`}>
    <div key={stop.id} className="walk-photo" role="img" aria-label={`Street-level photograph of ${stop.eyebrow}`} style={{backgroundImage:`url("${stop.image}")`, backgroundPosition:`calc(${stop.position.split(" ")[0]} + ${pan}%) ${stop.position.split(" ")[1]}`}} onPointerDown={startLook} onPointerMove={lookAround} onPointerUp={stopLook} onPointerCancel={stopLook}/>
    <div className="walk-hud">
      <div className="walk-status"><span className="live-pulse"/> LIVE CAMPUS WALK <b>{stop.accent}</b></div>
      <div className="walk-look">DRAG THE PHOTO TO LOOK AROUND</div>
      <div className="walk-copy"><p>{stop.eyebrow}</p><h3>{stop.title}</h3><span>{stop.copy}</span></div>
      <div className="walk-hotspots">
        {visible.length ? visible.map((moment, i) => <Link className={`walk-hotspot hotspot-${i}`} href={`/moments/${moment.id}`} key={moment.id}><i>{i+1}</i><span><b>{moment.title}</b>Open signal →</span></Link>) : <Link className="walk-hotspot hotspot-empty" href="/generate"><i>＋</i><span><b>No signal here yet</b>Report the first →</span></Link>}
      </div>
      <button className="walk-control previous" aria-label="Walk to previous campus stop" onClick={()=>move(-1)}>←<small>{stop.left}</small></button>
      <button className="walk-control next" aria-label="Walk to next campus stop" onClick={()=>move(1)}><small>{stop.right}</small>→</button>
      <div className="walk-compass">N<span>◆</span></div>
      <a className="walk-credit" href={stop.source} target="_blank" rel="noreferrer">{stop.credit}</a>
      <div className="walk-minimap" aria-label="Choose campus location"><div className={`mini-route marker-${index}`}><i/></div>{stops.map((item,i)=><button className={i===index?"active":""} aria-label={`Walk to ${item.zone}`} key={item.id} onClick={()=>selectStop(i)}><span/>{item.zone}</button>)}</div>
    </div>
  </div>;
}
