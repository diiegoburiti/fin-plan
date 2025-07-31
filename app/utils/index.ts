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
  }).format(new Date(date));
};
