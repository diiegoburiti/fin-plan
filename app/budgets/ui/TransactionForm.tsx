"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRecordAction, TransactionActionState } from "../actions";
import { useActionState, useEffect, useRef } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface TransactionFormProps {
  accountId: string;
  categories: { label: string; value: string }[];
}

export function TransactionForm({
  accountId,
  categories,
}: TransactionFormProps) {
  const today = new Date().toLocaleDateString();
  const closeRef = useRef<HTMLButtonElement>(null);

  const initialState: TransactionActionState = {
    success: false,
    errors: {},
  };

  const [actionState, formAction, isPending] = useActionState(
    createRecordAction,
    initialState
  );

  useEffect(() => {
    if (actionState.success) {
      closeRef.current?.click();
    }
  }, [actionState]);

  const getErrorMessage = (errors: any, field: string): string | null => {
    if (!errors || typeof errors !== "object") return null;
    const fieldErrors = errors[field];
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      return fieldErrors[0];
    }
    return null;
  };

  const typeError = getErrorMessage(actionState.errors, "type");
  const nameError = getErrorMessage(actionState.errors, "name");
  const categoryError = getErrorMessage(actionState.errors, "category");
  const dateError = getErrorMessage(actionState.errors, "date");
  const amountError = getErrorMessage(actionState.errors, "amount");
  const generalError = getErrorMessage(actionState.errors, "general");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-[5%] left-1/2 transform -translate-x-1/2"
          variant="outline"
        >
          Add +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Record</DialogTitle>

          <DialogClose ref={closeRef} className="hidden" />

          <form action={formAction} className="space-y-4">
            {actionState.success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm">
                  Transaction created successfully!
                </p>
              </div>
            )}

            {generalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{generalError}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <RadioGroup
                defaultValue="expense"
                name="type"
                className="flex mb-5"
              >
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense">Expense</Label>
                </div>
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income">Income</Label>
                </div>
              </RadioGroup>
              {typeError && <p className="text-red-500 text-sm">{typeError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Record Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Type the record name"
              />
              {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Record Category</Label>
              <Select name="category">
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
              {categoryError && (
                <p className="text-red-500 text-sm">{categoryError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Transaction Date</Label>
              <DatePicker
                name="date"
                defaultValue={today}
                placeholder="Pick a transaction date"
                required
              />
              {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                type="text"
                id="amount"
                name="amount"
                step="0.01"
                placeholder="0.00"
              />
              {amountError && (
                <p className="text-red-500 text-sm">{amountError}</p>
              )}
            </div>

            <input type="hidden" name="accountId" value={accountId} />

            <Button type="submit" className="w-full">
              {isPending ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  saving...
                </span>
              ) : (
                "Save Transaction"
              )}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
