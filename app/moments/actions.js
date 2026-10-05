"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function castVote(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const momentId = formData.get("momentId")?.toString();
  const captionId = formData.get("captionId")?.toString();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/moments/${momentId}`)}`);
  if (!momentId || !captionId) redirect("/");

  const { data: caption } = await supabase.from("captions").select("id,moment_id").eq("id", captionId).eq("moment_id", momentId).maybeSingle();
  if (!caption) redirect(`/moments/${momentId}?error=That%20caption%20is%20not%20available`);

  const { error } = await supabase.from("caption_votes").upsert({ user_id: user.id, moment_id: momentId, caption_id: captionId, value: 1 }, { onConflict: "user_id,moment_id" });
  if (error) redirect(`/moments/${momentId}?error=${encodeURIComponent(error.message)}`);
  revalidatePath(`/moments/${momentId}`);
  revalidatePath("/");
  redirect(`/moments/${momentId}?voted=1`);
}
