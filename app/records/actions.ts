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

  revalidatePath("/records");
  return {
    success: true,
    errors: {},
  };
}

const createRecordSchema = z.object({
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

const editRecordSchema = z.object({
  name: z.string().min(1, "Record name is required").max(100, "Name too long"),
  type: z.enum(["expense", "income"], {
    required_error: "Please select a record type",
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
  recordId: z.string().min(1, "record ID is required"),
});

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

  const { recordId, name, category, amount, type, accountId } =
    validationResult.data;

  const supabase = await createClient();

  const { error } = await supabase
    .from("records")
    .update({ name, category, amount, type })
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

  return {
    success: true,
    errors: {},
  };
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
  console.log("record updated!!!");

  revalidatePath(`records/${accountId}`);

  return {
    success: true,
    errors: {},
  };
}
