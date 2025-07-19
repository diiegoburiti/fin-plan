"use server";
import { createClient } from "@/lib/supabase/server";
import { CreditCard, PiggyBank, Wallet } from "lucide-react";
import Link from "next/link";
import { AccountForm } from "./ui/AccountForm";
import Card from "@/ui/records/card";

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

  const { data: monthly_accounts } = await supabase
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
        My records
      </h1>

      {monthly_accounts?.map((account) => {
        return (
          <Link key={account.account_id} href={`records/${account.account_id}`}>
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
                  {formatAmount(account.initial_balance)}
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
