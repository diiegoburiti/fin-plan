"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { z } from "zod";

export async function createAccount(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const budgetMonth = formData.get("budget-month") as string;
  const type = formData.get("type") as string;
  const initial_balance = formData.get("initial_balance") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("accounts") // Replace with your actual table name
    .insert([
      {
        user_id: user?.id, // Add this line
        name: "Main Bank asasausiaiusasa",
        type: "bank",
        initial_balance: 200,
        // Add other columns as needed based on your table structure
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting budget:", error);
    // Handle error (you might want to use a toast notification or error state)
    return;
  }

  console.log("Budget created successfully:", data);

  revalidatePath("/budgets");
}

const recordSchema = z.object({
  name: z.string().min(1, "Record name is required").max(100, "Name too long"),
  type: z.enum(["expense", "income"], {
    required_error: "Please select a transaction type",
  }),
  category: z.string().min(1, "Please select a category"),
  date: z.string(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    })
    .transform((val) => Number(val)), // Transform to number after validation
  accountId: z.string().uuid("Invalid account ID"),
});

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
  const validationResult = recordSchema.safeParse({
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

    revalidatePath(`budgets/${accountId}`);
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
