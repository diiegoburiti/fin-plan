import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "BRL"
  | "CNY"
  | "INR"
  | string; // Extend with more currencies as needed

type FormatCurrencyOptions = {
  locale?: string;
  currency?: CurrencyCode;
  fallbackCurrency?: CurrencyCode;
  fallbackLocale?: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (
  amount: number,
  options: FormatCurrencyOptions = {}
) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return formatFallbackAmount(0, options.fallbackCurrency || "USD");
  }

  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
