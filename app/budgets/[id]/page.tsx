import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Card from "@/ui/budgets/card";
import { ArrowLeft } from "lucide-react";
import { createTransaction } from "../actions";
import { TransactionForm } from "../ui/TransactionForm";

import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { Combobox } from "@/components/ui/combobox";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: details, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("account_id", id);

  const { data: records } = await supabase
    .from("records")
    .select("*")
    .eq("account_id", id);

  /*   const calculateExpenses = () => {
    const expensesRecords  = expenses?.filter(expense => expense.) 
  } */

  const categories = [
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

  console.log({ records });

  const fullDetails = details![0];

  return (
    <>
      <Card>
        <div className="flex justify-between flex-col">
          <div className="flex justify-between">
            <div className="flex">
              <Button>
                <ArrowLeft />
              </Button>
              <h6>Account detail</h6>
            </div>

            <div className="">
              <Button>Edit</Button>
              <Button>Delete</Button>
            </div>
          </div>
          <div className="mt-10 mb-6 grid grid-cols-12">
            <div className="col-span-3">
              <span className="line-clamp-1 flex gap-2 font-medium">Name</span>
              <span className="text-">{fullDetails.name}</span>
            </div>

            <div className="col-span-3">
              <span className="line-clamp-1 flex gap-2 font-medium">Type</span>
              <span className="text-">{fullDetails.type}</span>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-3">
              <span className="line-clamp-1 flex gap-2 font-medium">
                Initial Amount
              </span>
              <span className="text-">{fullDetails.initial_balance}</span>
            </div>

            <div className="col-span-3">
              <span className="line-clamp-1 flex gap-2 font-medium">
                Expenses
              </span>
              <span className="text-">{fullDetails.type}</span>
            </div>
            <div className="col-span-3">
              <span className="line-clamp-1 flex gap-2 font-medium">
                Current balance
              </span>
              <span className="text-">999999</span>
            </div>
          </div>
        </div>
      </Card>

      <div>
        {records?.map((record) => {
          return (
            <Card key={record.transaction_id} animation>
              <span>{record.name}</span>
            </Card>
          );
        })}
      </div>

      <TransactionForm accountId={id} categories={categories} />
    </>
  );
}
