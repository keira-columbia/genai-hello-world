import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { signOut } from "../auth/actions";
import { updateProfile } from "./actions";
import { createAdminClient } from "../../lib/supabase/admin";
import { createClient } from "../../lib/supabase/server";

export default async function ProfilePage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("first_name,last_name,avatar_url")
    .eq("id", user.id)
    .maybeSingle();
  const params = await searchParams;
  const needsName = !profile?.first_name || !profile?.last_name;
  const avatar = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <main className="narrow">
      <nav className="page-nav">
        <Link href="/">Countries</Link>
        <Link href="/private">Private page</Link>
        <form action={signOut}><button className="link-button">Sign out</button></form>
      </nav>

      <section className="panel">
        <p className="eyebrow">Profile</p>
        <h1>Your profile</h1>
        <p className="muted">Signed in as {user.email}</p>

        {(params?.welcome || needsName) && (
          <p className="message">Please add your first and last name.</p>
        )}
        {params?.saved && <p className="message success">Profile saved.</p>}
        {params?.error && <p className="message error">{params.error}</p>}

        {avatar && (
          <Image
            className="avatar"
            src={avatar}
            alt="Profile"
            width={112}
            height={112}
            unoptimized
          />
        )}

        <form className="profile-form" action={updateProfile}>
          <input type="hidden" name="currentAvatar" value={profile?.avatar_url || ""} />
          <label>
            First name
            <input name="firstName" defaultValue={profile?.first_name || ""} />
          </label>
          <label>
            Last name
            <input name="lastName" defaultValue={profile?.last_name || ""} />
          </label>
          <label>
            Profile photo
            <input name="photo" type="file" accept="image/*" />
          </label>
          <button type="submit">Save profile</button>
        </form>
      </section>
    </main>
  );
}
