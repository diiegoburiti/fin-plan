import { z } from "zod";

export const accountSchema = z.object({
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

export const createRecordSchema = z.object({
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

export const editRecordSchema = z.object({
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
