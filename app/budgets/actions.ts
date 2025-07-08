"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { z } from "zod";

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

export type accountActionState = {
  success: boolean;
  errors: {
    name?: string[];
    type?: string[];
    initialAmount?: string[];
    general?: string[];
  };
};

const accountSchema = z.object({
  name: z
    .string()
    .min(1, "Budget name is required")
    .max(100, "Budget name must be less than 100 characters")
    .trim(),
  type: z.enum(["bank", "cash", "credit", "savings", "investment"], {
    required_error: "Please select a valid account type",
  }),
  initialBalance: z
    .string()
    .min(1, "Initial balance is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Initial balance must be a valid number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Initial balance cannot be negative",
    })
    .transform((val) => Number(val)),
});

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

  revalidatePath("/budgets");
  return {
    success: true,
    errors: {},
  };
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

export async function deleteAccount(
  prevState: accountActionState,
  formData: FormData
) {
  const supabase = await createClient();

  const accountId = formData.get("accountId");

  console.log({ accountId });

  if (!accountId) {
    return {
      success: false,
      errors: { general: ["Account ID is required"] },
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  revalidatePath("/budgets");
  redirect("/budgets");
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

  // Validate account ID is present
  if (!rawData.accountId) {
    return {
      success: false,
      errors: { general: ["Account ID is required"] },
    };
  }

  // Validate the form data (reuse your existing schema, excluding accountId)
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      errors: { general: ["User not authenticated"] },
    };
  }

  // Update the account
  const { error } = await supabase
    .from("accounts")
    .update({
      name,
      type,
      initial_balance: initialBalance,
    })
    .eq("account_id", rawData.accountId)
    .eq("user_id", user.id); // Security: only update user's own accounts

  if (error) {
    console.error("Database error:", error);
    return {
      success: false,
      errors: { general: ["Failed to update account"] },
    };
  }

  console.log("Account updated successfully");
  revalidatePath("/budgets");

  return {
    success: true,
    errors: {},
  };
}
