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

const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const budgetOptions = [
  { label: "General", value: "general" },
  { label: "Credit Card", value: "credit-card" },
  { label: "Investments", value: "investments" },
];

const icons = [
  { label: "general", icon: <Wallet /> },
  { label: "credit-card", icon: <CreditCard /> },
  { label: "investments", icon: <PiggyBank /> },
];

const getIconByType = (budgetType: string) => {
  const iconItem = icons.find((item) => item.label === budgetType)!;
  return iconItem?.icon;
};

export default async function ExpensesPage() {
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

      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-[10%] left-1/2 transform -translate-x-1/2"
            variant="outline"
          >
            Add +
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new budget</DialogTitle>

            <form action={createAccount} className="space-y-4">
              <div className="mb-4">
                <InputWithLabel
                  htmlFor="name"
                  name="name"
                  inputType="text"
                  placeholder="Type the record name"
                  label="Record"
                />
              </div>

              <div className="mb-3 flex flex-col gap-3">
                <Label className="text-gray-600 font-normal">
                  Budget month
                </Label>
                <Combobox
                  items={months}
                  label="Select the month"
                  name="budget-month"
                />
              </div>

              <div className="mb-3 flex flex-col gap-3">
                <Label className="text-gray-600 font-normal">Budget type</Label>
                <Combobox
                  items={budgetOptions}
                  label="Select a type for your budget"
                  name="type"
                />
              </div>

              <div className="mb-4">
                <InputWithLabel
                  htmlFor="initial_balance"
                  name="initial_balance"
                  inputType="text"
                  placeholder="Starting amount"
                  label="Starting amount"
                />
              </div>

              <Button type="submit">Save</Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
