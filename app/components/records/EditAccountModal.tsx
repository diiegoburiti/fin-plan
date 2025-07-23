"use client";

import { useActionState, startTransition } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2 } from "lucide-react";
import { editAccount } from "@/records/actions";
import { Combobox } from "@/components/ui/combobox";
import { getErrorMessage } from "@/utils";

interface EditAccountModalProps {
  account: {
    account_id: string;
    name: string;
    type: string;
    initial_balance: number;
  };
}

const budgetOptions = [
  { label: "General", value: "bank" },
  { label: "Credit Card", value: "credit" },
  { label: "Investments", value: "investments" },
];
/* TODO: RENAME initial_balance TO initial_amount */

export function EditAccountModal({ account }: EditAccountModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: account.name,
    type: account.type,
    initial_balance: account.initial_balance.toString(),
  });

  const [actionState, formAction, isPending] = useActionState(editAccount, {
    success: false,
    errors: {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      const data = new FormData();
      data.append("accountId", account.account_id);
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("initial_balance", formData.initial_balance);

      formAction(data);
    });
  };

  const generalError = getErrorMessage(actionState.errors, "general");
  const nameError = getErrorMessage(actionState.errors, "name");
  const initialAmountError = getErrorMessage(
    actionState.errors,
    "initialAmount"
  );

  if (actionState.success && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isPending}
              placeholder="Enter account name"
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="mb-3 flex flex-col gap-3">
            <Label className="text-gray-600 font-normal">Budget type</Label>
            <Combobox
              items={budgetOptions}
              label={
                budgetOptions.find((option) => option.value === account.type)
                  ?.label || "Select type"
              }
              name="type"
              withSearch
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial_balance">Initial Amount</Label>
            <Input
              id="initial_balance"
              type="number"
              step="0.01"
              value={formData.initial_balance}
              onChange={(e) =>
                setFormData({ ...formData, initial_balance: e.target.value })
              }
              disabled={isPending}
              placeholder="0.00"
            />
            {initialAmountError && (
              <p className="text-sm text-red-500">{initialAmountError}</p>
            )}
          </div>

          {generalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{generalError}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
