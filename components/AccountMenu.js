"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "../app/auth/actions";

export default function AccountMenu({ user }) {
  const [open, setOpen] = useState(false);
  const menu = useRef(null);
  useEffect(() => {
    function close(event) { if (!menu.current?.contains(event.target)) setOpen(false); }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  if (!user) return <Link className="account-signin" href="/login">Sign in</Link>;
  const avatar = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Account";
  return <div className="account-menu" ref={menu}>
    <button className="avatar-trigger" aria-label="Open account menu" aria-expanded={open} onClick={() => setOpen(!open)}>
      {avatar ? <Image src={avatar} alt="" width={38} height={38} unoptimized /> : <span>{name[0]?.toUpperCase()}</span>}
    </button>
    {open && <div className="account-popover">
      <div className="account-identity"><strong>{name}</strong><small>{user.email}</small></div>
      <Link href="/account">Profile & activity <span>→</span></Link>
      <Link href="/generate">Create a campus moment <span>→</span></Link>
      <form action={signOut}><button>Sign out</button></form>
    </div>}
  </div>;
}
