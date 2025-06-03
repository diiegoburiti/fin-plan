"use server";

import { createClient } from "@/app/lib/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
  const supabse = createClient();

  await supabse.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getUser() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  console.log({ data });

  /*   if (user) {
    redirect("/");
  } */
}
