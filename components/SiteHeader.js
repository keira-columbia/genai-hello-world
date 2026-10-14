import Link from "next/link";
import AccountMenu from "./AccountMenu";

export default function SiteHeader({ user }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/"><span className="brand-mark">CS</span><span>Campus Survival Map</span></Link>
      <nav aria-label="Main navigation">
        <Link href="/#campus-walk">Campus walk</Link>
        <Link href="/vote">Rate memes</Link>
        <Link href="/captions">Judge captions</Link>
        <Link href="/#leaderboard">Rankings</Link>
        <Link className="nav-create" href={user ? "/generate" : "/login?next=/generate"}>＋ Create</Link>
        <AccountMenu user={user} />
      </nav>
    </header>
  );
}
