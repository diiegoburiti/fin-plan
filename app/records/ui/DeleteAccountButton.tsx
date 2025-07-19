"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { deleteAccount } from "@/records/actions";

interface DeleteAccountButtonProps {
  accountId: string;
  accountName: string;
}

export function DeleteAccountButton({
  accountId,
  accountName,
}: DeleteAccountButtonProps) {
  const [state, formAction, isPending] = useActionState(deleteAccount, {
    success: false,
    errors: {},
  });

  useEffect(() => {
    console.log({ state });
  }, [state]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer" variant="destructive">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the account{" "}
            <strong>"{accountName}"</strong>? This action cannot be undone and
            will permanently delete all associated transactions.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!state.success && state.errors?.general && (
          <div className="text-red-500 text-sm">
            {state.errors.general.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="accountId" value={accountId} />
            <AlertDialogAction
              type="submit"
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
