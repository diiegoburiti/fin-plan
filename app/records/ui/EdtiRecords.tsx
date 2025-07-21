"use client";
import { useState, startTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editRecord } from "@/records/actions";
import Card from "@/ui/records/card";
import { DatePicker } from "@/components/ui/date-picker";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Transaction {
  transaction_id: string;
  account_id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  category: string;
}

interface EditRecordsProps {
  transaction: Transaction;
  accountId: string;
}

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

export default function EditRecords({
  transaction,
  accountId,
}: EditRecordsProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: transaction.name,
    type: transaction.type,
    amount: transaction.amount.toString(),
    date: transaction.date,
    category: transaction.category,
  });

  const [state, formAction, isPending] = useActionState(editRecord, {
    success: false,
    errors: {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      const data = new FormData();
      data.append("recordId", transaction.transaction_id);
      data.append("accountId", transaction.account_id);
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("category", formData.category);
      data.append("amount", formData.amount);
      data.append("date", formData.date);

      formAction(data);
    });
  };

  const handleCancel = () => {
    router.push(`/records/${accountId}`);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-4">
        <Button variant="ghost" onClick={handleCancel} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Record - {transaction.name}</h1>
      </div>

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
            </RadioGroup>
            {state.errors?.type && (
              <p className="text-sm text-red-600">{state.errors.type[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Transaction name"
              required
            />
            {state.errors?.name && (
              <p className="text-sm text-red-600">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              name="category"
              defaultValue={transaction.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {state.errors?.category && (
              <p className="text-sm text-red-600">{state.errors.category[0]}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <DatePicker
              name="date"
              defaultValue={transaction.date}
              placeholder="Pick a transaction date"
              required
            />
            {state.errors?.date && (
              <p className="text-sm text-red-600">{state.errors.date[0]}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
              required
            />
            {state.errors?.amount && (
              <p className="text-sm text-red-600">{state.errors.amount[0]}</p>
            )}
          </div>

          {/* General Error */}
          {state.errors?.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{state.errors.general[0]}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
