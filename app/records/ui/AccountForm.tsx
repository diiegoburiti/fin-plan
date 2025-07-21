"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { accountActionState, createAccount } from "../actions"; // Update the import path as needed
import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

const budgetOptions = [
  { label: "General", value: "bank" },
  { label: "Credit Card", value: "credit" },
  { label: "Investments", value: "investments" },
];

export function AccountForm() {
  const initialState: accountActionState = {
    success: false,
    errors: {},
  };

  const closeRef = useRef<HTMLButtonElement>(null);

  const [actionState, formAction, isPending] = useActionState(
    createAccount,
    initialState
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getErrorMessage = (errors: any, field: string): string | null => {
    if (!errors || typeof errors !== "object") return null;
    const fieldErrors = errors[field];
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      return fieldErrors[0];
    }
    return null;
  };

  const typeError = getErrorMessage(actionState.errors, "type");
  const generalError = getErrorMessage(actionState.errors, "general");
  const nameError = getErrorMessage(actionState.errors, "name");
  const initialAmountError = getErrorMessage(
    actionState.errors,
    "initialAmount"
  );

  useEffect(() => {
    if (actionState.success) {
      toast.success("Account created");
      closeRef.current?.click();
    }
  }, [actionState]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new budget</DialogTitle>
          <DialogClose ref={closeRef} className="hidden" />

          <form action={formAction} className="space-y-4">
            {/* Success/Error Messages */}
            {actionState.success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm">
                  Budget created successfully!
                </p>
              </div>
            )}

            {generalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{generalError}</p>
              </div>
            )}

            {/* Budget Name */}
            <div className="mb-4">
              <InputWithLabel
                htmlFor="name"
                name="name"
                inputType="text"
                placeholder="Type the budget name"
                label="Budget Name"
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>

            {/* Budget Type */}
            <div className="mb-3 flex flex-col gap-3">
              <Label className="text-gray-600 font-normal">Budget type</Label>
              <Combobox
                items={budgetOptions}
                label="Select a type for your budget"
                name="type"
                withSearch
              />
              {typeError && <p className="text-red-500 text-sm">{typeError}</p>}
            </div>

            {/* Initial Balance */}
            <div className="mb-4">
              <InputWithLabel
                htmlFor="initial_balance"
                name="initial_balance"
                inputType="number"
                placeholder="0.00"
                label="Starting amount"
              />
              {initialAmountError && (
                <p className="text-red-500 text-sm mt-1">
                  {initialAmountError}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {isPending ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  saving...
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
