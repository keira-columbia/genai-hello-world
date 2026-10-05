import Image from "next/image";
import { redirect } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SubmitButton from "../../components/SubmitButton";
import { createClient } from "../../lib/supabase/server";
import { updateProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("first_name,last_name,avatar_url").eq("id", user.id).maybeSingle();
  const params = await searchParams;
  const needsName = !profile?.first_name || !profile?.last_name;
  const avatar = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <main className="site-shell">
      <SiteHeader user={user} />
      <section className="form-page profile-page">
        <div className="form-intro">
          <p className="kicker">Field identity</p><h1>Your profile</h1>
          <p>Your name and photo travel with your account while your email stays private.</p>
          <div className="profile-badge">
            {avatar ? <Image src={avatar} alt="Profile" width={90} height={90} unoptimized /> : <span>{user.email?.[0]?.toUpperCase()}</span>}
            <div><strong>{profile?.first_name || "Campus"} {profile?.last_name || "Observer"}</strong><small>{user.email}</small></div>
          </div>
        </div>
        <div className="form-card">
          {needsName && <p className="message">Add your first and last name to complete your profile.</p>}
          {params?.saved && <p className="message success">Profile saved.</p>}
          {params?.error && <p className="message error">{params.error}</p>}
          <form className="profile-form" action={updateProfile}>
            <input type="hidden" name="currentAvatar" value={profile?.avatar_url || ""} />
            <label><span>First name</span><input name="firstName" defaultValue={profile?.first_name || ""} maxLength={60} /></label>
            <label><span>Last name</span><input name="lastName" defaultValue={profile?.last_name || ""} maxLength={60} /></label>
            <label><span>Profile photo</span><input name="photo" type="file" accept="image/jpeg,image/png,image/webp" /></label>
            <SubmitButton pendingText="Saving…" className="button primary">Save profile</SubmitButton>
          </form>
        </div>
      </section>
    </main>
  );
}
