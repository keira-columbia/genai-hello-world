"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "../../lib/supabase/admin";
import { createClient } from "../../lib/supabase/server";

export async function updateProfile(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const firstName = formData.get("firstName")?.toString().trim() || null;
  const lastName = formData.get("lastName")?.toString().trim() || null;
  const photo = formData.get("photo");
  let avatarUrl = formData.get("currentAvatar")?.toString() || null;
  const admin = createAdminClient();

  if (photo && photo.size > 0) {
    if (!photo.type.startsWith("image/")) {
      redirect("/profile?error=Please%20choose%20an%20image%20file");
    }

    if (photo.size > 5 * 1024 * 1024) {
      redirect("/profile?error=The%20photo%20must%20be%205MB%20or%20smaller");
    }

    const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${extension}`;
    const { error: uploadError } = await admin.storage
      .from("avatars")
      .upload(path, photo, { contentType: photo.type, upsert: true });

    if (uploadError) {
      redirect(`/profile?error=${encodeURIComponent(uploadError.message)}`);
    }

    const { data } = admin.storage.from("avatars").getPublicUrl(path);
    avatarUrl = data.publicUrl;
  }

  const { error } = await admin.from("profiles").upsert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/profile");
  redirect("/profile?saved=1");
}
