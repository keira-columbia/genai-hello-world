import Link from "next/link";

const zones = [
  { key: "Library", className: "zone-library", icon: "⌁", label: "Library" },
  { key: "Dorms", className: "zone-dorms", icon: "▥", label: "Dorms" },
  { key: "Dining", className: "zone-dining", icon: "◇", label: "Dining" },
  { key: "Classroom", className: "zone-classroom", icon: "▤", label: "Classrooms" },
  { key: "Subway", className: "zone-subway", icon: "ⓜ", label: "Subway" },
  { key: "City", className: "zone-city", icon: "✦", label: "NYC weekends" },
  { key: "Other", className: "zone-other", icon: "?", label: "Unclassified" },
];

export default function CampusMap({ moments }) {
  return (
    <div className="campus-map">
      <div className="map-grid" aria-hidden="true" /><div className="map-river" aria-hidden="true"><span>THE CITY</span></div>
      <div className="map-path path-one" aria-hidden="true" /><div className="map-path path-two" aria-hidden="true" />
      {zones.map((zone) => (
        <div className={`map-zone ${zone.className}`} key={zone.key}>
          <span className="zone-icon">{zone.icon}</span><strong>{zone.label}</strong>
          <small>{moments.filter((moment) => moment.zone === zone.key).length} signals</small>
        </div>
      ))}
      {moments.slice(0, 12).map((moment, index) => (
        <Link aria-label={`Open ${moment.title} in ${moment.zone}`} className={`signal-pin signal-${moment.zone.toLowerCase()} offset-${index % 4}`} href={`/moments/${moment.id}`} key={moment.id}>
          <span className="signal-wave" /><span className="signal-dot" /><span className="signal-label">{moment.title}</span>
        </Link>
      ))}
      {!moments.length && <div className="map-empty-note"><strong>No active signals</strong><span>The first field report will appear here.</span></div>}
      <div className="map-legend"><span className="legend-dot" /> Live student signal</div>
    </div>
  );
}
