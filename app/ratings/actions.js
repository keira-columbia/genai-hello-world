"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function rateMoment(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to rate this meme." };

  const momentId = formData.get("momentId")?.toString();
  const value = Number(formData.get("value"));
  if (!momentId || ![-1, 1].includes(value)) return { error: "That rating is not valid." };

  const { data: moment } = await supabase.from("moments").select("id").eq("id", momentId).maybeSingle();
  if (!moment) return { error: "That meme is no longer available." };

  const { error } = await supabase.from("moment_ratings").upsert(
    { user_id: user.id, moment_id: momentId, value, updated_at: new Date().toISOString() },
    { onConflict: "user_id,moment_id" },
  );
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/moments/${momentId}`);
  return { ok: true, value };
}

