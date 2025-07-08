"use server";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Card from "@/ui/budgets/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { createAccount } from "./actions";
import { CreditCard, PiggyBank, Wallet } from "lucide-react";
import Link from "next/link";
import { AccountForm } from "./ui/AccountForm";

const icons = [
  { label: "general", icon: <Wallet /> },
  { label: "credit-card", icon: <CreditCard /> },
  { label: "investments", icon: <PiggyBank /> },
];

const getIconByType = (budgetType: string) => {
  const iconItem = icons.find((item) => item.label === budgetType)!;
  return iconItem?.icon;
};

export default async function Page() {
  const supabase = await createClient();

  const { data: monthly_accounts, error } = await supabase
    .from("accounts")
    .select("*");

  console.log({ monthly_accounts });

  const formatAmount = (amount: number) => {
    if (!amount && amount !== 0) return "$0.00";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-800 md:text-5xl lg:text-5xl dark:text-white">
        My Budgets
      </h1>

      {monthly_accounts?.map((account) => {
        return (
          <Link key={account.account_id} href={`budgets/${account.account_id}`}>
            <Card animation>
              <div className="grid grid-cols-4">
                <div className="flex items-center gap-0.5 col-span-2">
                  <span className="mr-2">{getIconByType(account.type)} </span>
                  <span className=" font-medium tracking-tight text-gray-900 dark:text-white ">
                    {account.name}
                  </span>
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-400 ">
                  {account.type}
                </span>
                <span className="font-medium text-right text-gray-700 dark:text-gray-400 ">
                  {formatAmount(account.amount)}
                </span>
              </div>
            </Card>
          </Link>
        );
      })}

      <AccountForm />
    </>
  );
}
