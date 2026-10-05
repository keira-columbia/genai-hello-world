"use server";

import { redirect } from "next/navigation";
import { describeImage, writeCaptions } from "../../lib/gemini";
import { createClient } from "../../lib/supabase/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedZones = new Set(["Library", "Dorms", "Dining", "Classroom", "Subway", "City", "Other"]);
const allowedTones = new Set(["Painfully relatable", "Dry", "Chaotic", "Deadpan", "Dramatic"]);

function fail(message) { redirect(`/generate?error=${encodeURIComponent(message)}`); }

export async function generateMoment(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const photo = formData.get("photo");
  const title = formData.get("title")?.toString().trim().slice(0, 70);
  const context = formData.get("context")?.toString().trim().slice(0, 280) || null;
  const zone = formData.get("zone")?.toString();
  const tone = formData.get("tone")?.toString();
  if (!title) fail("Give this moment a short title.");
  if (!photo || photo.size === 0) fail("Choose an image to report.");
  if (!allowedTypes.has(photo.type)) fail("Use a JPG, PNG, or WebP image.");
  if (photo.size > 5 * 1024 * 1024) fail("The image must be 5MB or smaller.");
  if (!allowedZones.has(zone)) fail("Choose a valid campus zone.");
  if (!allowedTones.has(tone)) fail("Choose a valid humor style.");

  const buffer = Buffer.from(await photo.arrayBuffer());
  const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
  const storagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("campus-moments").upload(storagePath, buffer, { contentType: photo.type, upsert: false });
  if (uploadError) fail(uploadError.message);

  let momentId;
  try {
    const { data: publicData } = supabase.storage.from("campus-moments").getPublicUrl(storagePath);
    const visual = await describeImage({ buffer, mimeType: photo.type, context, zone });
    const humor = await writeCaptions({ description: visual.description, context, zone, tone });
    const { data: moment, error: momentError } = await supabase.from("moments").insert({
      user_id: user.id,
      title,
      zone,
      context,
      image_path: storagePath,
      image_url: publicData.publicUrl,
      image_description: visual.description,
      description_prompt: visual.prompt,
      description_model: visual.model,
    }).select("id").single();
    if (momentError) throw new Error(momentError.message);
    momentId = moment.id;
    const { error: captionsError } = await supabase.from("captions").insert(humor.captions.map((caption) => ({
      moment_id: moment.id,
      creator_id: user.id,
      caption_text: caption,
      generation_prompt: humor.prompt,
      generation_model: humor.model,
    })));
    if (captionsError) throw new Error(captionsError.message);
  } catch (error) {
    if (momentId) await supabase.from("moments").delete().eq("id", momentId);
    await supabase.storage.from("campus-moments").remove([storagePath]);
    fail(error.message || "The campus signal could not be generated.");
  }

  redirect(`/moments/${momentId}?created=1`);
}
