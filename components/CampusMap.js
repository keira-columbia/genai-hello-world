"use client";

import Link from "next/link";
import { useState } from "react";

const zones = [
  { key:"Library", className:"zone-library", icon:"📚", label:"Library", note:"All-nighters and printer emergencies", image:"https://upload.wikimedia.org/wikipedia/commons/a/aa/Butler_Library_Columbia_University.jpg", position:"50% 52%" },
  { key:"Dorms", className:"zone-dorms", icon:"🛏️", label:"Dorms", note:"Roommates, laundry and midnight decisions", image:"https://upload.wikimedia.org/wikipedia/commons/f/f3/John_Jay_Hall_Columbia_University.jpg", position:"50% 45%" },
  { key:"Dining", className:"zone-dining", icon:"🍽️", label:"Dining", note:"Lines, trays and fiercely held opinions", image:"https://upload.wikimedia.org/wikipedia/commons/c/c2/John_Jay_lobby.jpg", position:"50% 48%" },
  { key:"Classroom", className:"zone-classroom", icon:"✏️", label:"Classrooms", note:"The 8:40 a.m. chapter of campus life", image:"https://upload.wikimedia.org/wikipedia/commons/e/e4/College_Walk_%28116th_Street%29%2C_Columbia_University_%286337955425%29.jpg", position:"50% 54%" },
  { key:"Subway", className:"zone-subway", icon:"🚇", label:"Subway", note:"Commutes, delays and downtown plans", image:"https://upload.wikimedia.org/wikipedia/commons/e/ee/116th_Street_-_Entrance.jpg", position:"50% 52%" },
  { key:"City", className:"zone-city", icon:"🗽", label:"NYC weekends", note:"The stories that happen beyond the gates", image:"https://upload.wikimedia.org/wikipedia/commons/6/68/Central_Park_%2810164%29.jpg", position:"50% 45%" },
];

export default function CampusMap({ moments }) {
  const [active, setActive] = useState(null);
  const zone = zones.find((item) => item.key === active);
  const allZoneMoments = moments.filter((moment) => moment.zone === active);
  const zoneMoments = allZoneMoments.slice(0, 3);

  return <div className="campus-map interactive-map">
    <div className="map-grid" aria-hidden="true"/><div className="map-river" aria-hidden="true"><span>THE CITY</span></div>
    <div className="campus-boundary" aria-hidden="true"><span>116TH STREET GATES</span></div>
    <div className="college-walk walk-main" aria-hidden="true"><span>COLLEGE WALK · 116TH STREET</span></div><div className="college-walk walk-cross" aria-hidden="true"/>
    <div className="college-walk walk-north" aria-hidden="true"/><div className="college-walk walk-south" aria-hidden="true"/>
    <div className="campus-lawn lawn-one" aria-hidden="true"/><div className="campus-lawn lawn-two" aria-hidden="true"/>
    <div className="campus-plaza" aria-hidden="true"><b>LOW PLAZA</b></div>
    <div className="campus-trees" aria-hidden="true">●　●　●　●　●　●</div>

    {zones.map((item) => {
      const count = moments.filter((moment) => moment.zone === item.key).length;
      return <button className={`map-zone photo-zone ${item.className} ${active === item.key ? "active" : ""}`} key={item.key} onClick={()=>setActive(active === item.key ? null : item.key)} aria-pressed={active === item.key}>
        <span className="zone-photo" style={{backgroundImage:`url("${item.image}")`, backgroundPosition:item.position}}><i>{item.icon}</i></span>
        <span className="zone-copy"><strong>{item.label}</strong><small>{count} {count === 1 ? "signal" : "signals"}</small></span>
      </button>;
    })}

    {moments.slice(0, 12).map((moment, index) => <Link aria-label={`Open ${moment.title} in ${moment.zone}`} className={`signal-pin signal-${moment.zone.toLowerCase()} offset-${index % 4}`} href={`/moments/${moment.id}`} key={moment.id}>
      <span className="signal-wave"/><span className="signal-dot"/><span className="signal-label">{moment.title}</span>
    </Link>)}

    {zone && <>
      <button className="map-preview-scrim" aria-label="Close location preview" onClick={()=>setActive(null)}/>
      <aside className="map-preview" aria-live="polite">
        <button className="map-preview-close" aria-label="Close location preview" onClick={()=>setActive(null)}>×</button>
        <div className="map-preview-photo" style={{backgroundImage:`linear-gradient(180deg,transparent 35%,#07120dcf),url("${zone.image}")`, backgroundPosition:zone.position}}><span>{zone.icon}</span><div><small>Currently viewing</small><b>{zone.label} stories</b></div></div>
        <p>{zone.note}</p>
        <div className="map-preview-links">
          {zoneMoments.length ? zoneMoments.map((moment)=><Link href={`/moments/${moment.id}`} key={moment.id}>{moment.title}<span>OPEN →</span></Link>) : <Link href="/generate">Be the first to report here <span>CREATE →</span></Link>}
        </div>
        {allZoneMoments.length > 3 && <p className="map-preview-count">Showing 3 of {allZoneMoments.length} stories. Select the blinking pins to open the others.</p>}
      </aside>
    </>}
    <div className="map-legend"><span className="legend-dot"/> Live student submission · Select a place</div>
  </div>;
}
