"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const stops = [
  { id:"gates", zone:"Classroom", eyebrow:"116th Street · Main gates", title:"Enter College Walk", copy:"Start at the gates and follow the conversation through the center of campus.", left:"Dorms", right:"Library", accent:"GATE 01", place:"COLUMBIA UNIVERSITY", object:"gates" },
  { id:"library", zone:"Library", eyebrow:"Butler Library · South Lawn", title:"The all-nighter district", copy:"Printer drama, study plans and the quiet-floor moments everyone recognizes.", left:"Classrooms", right:"Dining", accent:"STOP 02", place:"BUTLER LIBRARY", object:"library" },
  { id:"dorms", zone:"Dorms", eyebrow:"Residence walk · West campus", title:"Where roommate lore begins", copy:"Tiny rooms, laundry negotiations and everything that happens after midnight.", left:"Subway", right:"Dining", accent:"STOP 03", place:"RESIDENCE HALL", object:"dorms" },
  { id:"dining", zone:"Dining", eyebrow:"Dining courtyard · Campus center", title:"The unofficial debate hall", copy:"A live record of trays, lines and opinions students will defend forever.", left:"Library", right:"City", accent:"STOP 04", place:"CAMPUS DINING", object:"dining" },
  { id:"subway", zone:"Subway", eyebrow:"116th Street station · Broadway", title:"The commute portal", copy:"Delays, express-train mistakes and the moment a weekend plan leaves campus.", left:"Dorms", right:"City", accent:"STOP 05", place:"116 ST · COLUMBIA", object:"subway" },
  { id:"city", zone:"City", eyebrow:"Beyond the gates · New York City", title:"Weekend side quests", copy:"The city chapter of college life, submitted by students who actually made it downtown.", left:"Subway", right:"Classroom", accent:"STOP 06", place:"NEW YORK CITY", object:"city" },
];

export default function ImmersiveCampus({ moments }) {
  const [index, setIndex] = useState(0);
  const stop = stops[index];
  const visible = useMemo(() => moments.filter((m) => m.zone === stop.zone).slice(0,3), [moments, stop.zone]);
  const move = (step) => setIndex((index + step + stops.length) % stops.length);
  return <div className={`campus-walk stop-${stop.id}`}>
    <div className="walk-sky"><span className="walk-cloud cloud-a"/><span className="walk-cloud cloud-b"/></div>
    <div className="walk-buildings" aria-hidden="true"><div className="building west"><i/><i/><i/></div><div className="building center"><b>{stop.place}</b><i/><i/><i/><i/></div><div className="building east"><i/><i/><i/></div></div>
    <div className={`scene-object scene-${stop.object}`} aria-hidden="true">
      <span className="scene-sign">{stop.place}</span><i/><i/><i/><i/><i/><i/>
    </div>
    <div className="walk-ground" aria-hidden="true"><span className="path-left"/><span className="path-right"/><span className="walk-lawn left"/><span className="walk-lawn right"/></div>
    <div className="walk-hud">
      <div className="walk-status"><span className="live-pulse"/> LIVE CAMPUS WALK <b>{stop.accent}</b></div>
      <div className="walk-copy"><p>{stop.eyebrow}</p><h3>{stop.title}</h3><span>{stop.copy}</span></div>
      <div className="walk-hotspots">
        {visible.length ? visible.map((moment, i) => <Link className={`walk-hotspot hotspot-${i}`} href={`/moments/${moment.id}`} key={moment.id}><i>{i+1}</i><span><b>{moment.title}</b>Open signal →</span></Link>) : <Link className="walk-hotspot hotspot-empty" href="/generate"><i>＋</i><span><b>No signal here yet</b>Report the first →</span></Link>}
      </div>
      <button className="walk-control previous" aria-label="Walk to previous campus stop" onClick={()=>move(-1)}>←<small>{stop.left}</small></button>
      <button className="walk-control next" aria-label="Walk to next campus stop" onClick={()=>move(1)}><small>{stop.right}</small>→</button>
      <div className="walk-compass">N<span>◆</span></div>
      <div className="walk-minimap" aria-label="Choose campus location"><div className={`mini-route marker-${index}`}><i/></div>{stops.map((item,i)=><button className={i===index?"active":""} aria-label={`Walk to ${item.zone}`} key={item.id} onClick={()=>setIndex(i)}><span/>{item.zone}</button>)}</div>
    </div>
  </div>;
}
