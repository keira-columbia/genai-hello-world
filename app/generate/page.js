import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SubmitButton from "../../components/SubmitButton";
import { createClient } from "../../lib/supabase/server";
import { generateMoment } from "./actions";

export default async function GeneratePage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  return (
    <main className="site-shell form-shell">
      <SiteHeader user={user} />
      <div className="report-layout">
        <section className="report-intro">
          <Link className="back-link" href="/">← Back to the map</Link>
          <p className="kicker">Protected field station</p>
          <h1>Report a campus moment.</h1>
          <p>Upload the evidence. Gemini will first read the scene accurately, then turn that description into four captions for the campus to judge.</p>
          <div className="chain-visual">
            <div><span>01</span><strong>Visual scan</strong><small>AI describes only what it sees.</small></div>
            <div><span>02</span><strong>Humor pass</strong><small>AI writes with your context and tone.</small></div>
            <div><span>03</span><strong>Campus vote</strong><small>Signed-in students choose the record.</small></div>
          </div>
        </section>
        <section className="report-form-card">
          <div className="form-card-top"><span>NEW SIGNAL</span><span>AUTHENTICATED</span></div>
          {params?.error && <p className="message error">{params.error}</p>}
          <form action={generateMoment} className="report-form">
            <label>Photo evidence<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required /></label>
            <label>Short title<input name="title" type="text" maxLength="70" placeholder="The printer has chosen violence" required /></label>
            <div className="form-row">
              <label>Campus zone<select name="zone" defaultValue="Library"><option>Library</option><option>Dorms</option><option>Dining</option><option>Classroom</option><option>Subway</option><option>City</option><option>Other</option></select></label>
              <label>Humor style<select name="tone" defaultValue="Painfully relatable"><option>Painfully relatable</option><option>Dry</option><option>Chaotic</option><option>Deadpan</option><option>Dramatic</option></select></label>
            </div>
            <label>Context for the caption writer <span className="optional">optional</span><textarea name="context" maxLength="280" rows="4" placeholder="Butler at 3 a.m. during midterms. The coffee machine was broken." /></label>
            <p className="privacy-note">Avoid uploading identifiable people without their permission. JPG, PNG, or WebP; 5MB maximum.</p>
            <SubmitButton pendingText="Scanning scene + writing captions…">Generate field report</SubmitButton>
          </form>
        </section>
      </div>
    </main>
  );
}
