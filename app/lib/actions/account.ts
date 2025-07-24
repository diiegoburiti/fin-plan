"use server";

import { createClient } from "@/lib/supabase/server";
import { accountSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type accountActionState = {
  success: boolean;
  errors: {
    name?: string[];
    type?: string[];
    initialAmount?: string[];
    general?: string[];
  };
};

export async function createAccount(
  prevState: accountActionState,
  formData: FormData
) {
  const supabase = await createClient();

  const rawData = {
    name: formData.get("name"),
    type: formData.get("type"),
    initialBalance: formData.get("initial_balance"),
  };

  const validationResult = accountSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error?.flatten().fieldErrors || {},
    };
  }

  const { name, type, initialBalance } = validationResult.data;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("accounts") // Replace with your actual table name
    .insert([
      {
        user_id: user?.id, // Add this line
        name,
        type,
        initial_balance: initialBalance,
      },
    ])
    .select();

  if (error) {
    console.error("Database error:", error);
    return {
      success: false,
      errors: { general: ["Database error occurred"] },
    };
  }

  console.log("Budget created successfully:", data);

  revalidatePath("/records");
  return {
    success: true,
    errors: {},
  };
}
export async function deleteAccount(
  prevState: accountActionState,
  formData: FormData
) {
  const supabase = await createClient();

  const accountId = formData.get("accountId");

  if (!accountId) {
    return {
      success: false,
      errors: { general: ["Account ID is required"] },
    };
  }

  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("account_id", accountId);

  if (error) {
    console.error("Database error:", error);
    return {
      success: false,
      errors: { general: ["Failed to delete account"] },
    };
  }

  console.log("Account deleted successfully");
  revalidatePath("/records");
  redirect("/records");
  return {
    success: true,
    errors: {},
  };
}

export async function editAccount(
  prevState: accountActionState,
  formData: FormData
) {
  const supabase = await createClient();

  const rawData = {
    accountId: formData.get("accountId"),
    name: formData.get("name"),
    type: formData.get("type"),
    initialBalance: formData.get("initial_balance"),
  };

  if (!rawData.accountId) {
    return {
      success: false,
      errors: { general: ["Account ID is required"] },
    };
  }

  const validationResult = accountSchema.safeParse({
    name: rawData.name,
    type: rawData.type,
    initialBalance: rawData.initialBalance,
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error?.flatten().fieldErrors || {},
    };
  }

  const { name, type, initialBalance } = validationResult.data;

  const { error } = await supabase
    .from("accounts")
    .update({
      name,
      type,
      initial_balance: initialBalance,
    })
    .eq("account_id", rawData.accountId);

  if (error) {
    console.error("Database error:", error);
    return {
      success: false,
      errors: { general: ["Failed to update account"] },
    };
  }

  console.log("Account updated successfully");
  revalidatePath("/records");

  return {
    success: true,
    errors: {},
  };
}
