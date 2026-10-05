import Link from "next/link";
import { signOut } from "../app/auth/actions";

export default function SiteHeader({ user }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/"><span className="brand-mark">CS</span><span>Campus Survival Map</span></Link>
      <nav aria-label="Main navigation">
        <Link href="/#signals">Map</Link>
        {user && <Link href="/generate">Report</Link>}
        {user ? (
          <><Link href="/private">My record</Link><Link href="/profile">Profile</Link><form action={signOut}><button className="nav-button">Sign out</button></form></>
        ) : <Link className="nav-signin" href="/login">Sign in to vote</Link>}
      </nav>
    </header>
  );
}
