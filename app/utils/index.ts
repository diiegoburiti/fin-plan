import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatAmount = (amount: number) => {
  if (!amount && amount !== 0) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (errors: any, field: string): string | null => {
  if (!errors || typeof errors !== "object") return null;
  const fieldErrors = errors[field];
  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    return fieldErrors[0];
  }
  return null;
};

export const formattedDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
};

export const categories = [
  { label: "Food", value: "food" },
  { label: "Shopping", value: "shopping" },
  { label: "House", value: "house" },
  { label: "Vehicle", value: "vehicle" },
  { label: "Life & Entertainment", value: "life_entertainment" },
  { label: "Communication & PC", value: "communication_pc" },
  { label: "Financial Expenses", value: "financial_expenses" },
  { label: "Health", value: "health" },
  { label: "Sports", value: "sports" },
  { label: "Fitness", value: "fitness" },
  { label: "Wellness", value: "wellness" },
  { label: "Income", value: "income" },
  { label: "Others", value: "others" },
  { label: "Refund", value: "refund" },
];

export const getCategoryLabel = (recordCategory: string) => {
  return categories.find((category) => category.value === recordCategory)
    ?.label;
};
