"use server";

import { revalidatePath } from "next/cache";
import { createRecordSchema, editRecordSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type RecordActionState = {
  success: boolean;
  errors: {
    name?: string[];
    type?: string[];
    category?: string[];
    amount?: string[];
    general?: string[];
    date?: string[];
    accountId?: string[];
  };
};

export async function createRecordAction(
  prevState: RecordActionState,
  formData: FormData
) {
  const validationResult = createRecordSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    category: formData.get("category"),
    amount: formData.get("amount"),
    date: formData.get("date"),
    accountId: formData.get("accountId"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error?.flatten().fieldErrors || {},
    };
  }
  const { name, type, category, amount, date, accountId } =
    validationResult.data;

  try {
    const supabase = await createClient();

    const { error: insertError } = await supabase.from("records").insert({
      name,
      type,
      category,
      amount,
      date,
      account_id: accountId,
    });

    if (insertError) {
      console.error("Database error:", insertError);
      return {
        success: false,
        errors: { general: ["Database error occurred"] },
      };
    }

    revalidatePath(`records/${accountId}`);
    return {
      success: true,
      errors: {},
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      errors: { general: ["An unexpected error occurred"] },
    };
  }
}

export async function editRecord(
  prevState: RecordActionState,
  formData: FormData
) {
  const validationResult = editRecordSchema.safeParse({
    recordId: formData.get("recordId") as string,
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    category: formData.get("category") as string,
    amount: formData.get("amount") as string,
    date: formData.get("date") as string,
    accountId: formData.get("accountId") as string,
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error?.flatten().fieldErrors || {},
    };
  }

  const { recordId, name, category, amount, type, accountId, date } =
    validationResult.data;

  const supabase = await createClient();

  const { error } = await supabase
    .from("records")
    .update({ name, category, amount, type, date: date })
    .eq("transaction_id", recordId);

  if (error) {
    console.error("Database error:", error);
    return {
      success: false,
      errors: { general: ["Failed to update record"] },
    };
  }
  console.log("record updated!!!");

  revalidatePath(`records/${accountId}`);
  redirect(`/records/${accountId}`);

  /* return {
    success: true,
    errors: {},
  }; */
}

export async function deleteRecord(
  prevState: RecordActionState,
  formData: FormData
) {
  const recordId = formData.get("recordId") as string;
  const accountId = formData.get("accountId") as string;

  const supabase = await createClient();

  const { error } = await supabase
    .from("records")
    .delete()
    .eq("transaction_id", recordId);

  if (error) {
    console.error("Database error:", error);
    return {
      success: false,
      errors: { general: ["Failed to update record"] },
    };
  }

  revalidatePath(`records/${accountId}`);

  return {
    success: true,
    errors: {},
  };
}
