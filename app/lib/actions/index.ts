"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function signIn(
  prevState: string | undefined,
  formData: FormData
) {
  const supabase = await createClient();

  console.log({ formData });

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return error.message;
  }

  revalidatePath("/records", "layout");
  redirect("/records");
}

export async function logOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    //todo: handle this error
    return;
  }

  revalidatePath("/", "layout");
  redirect("/auth/sign-in");
}
