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
