"use client";

import { useActionState } from "react";
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
import { AlertTriangle, Loader2, Trash } from "lucide-react";
import { deleteRecord } from "@/records/actions";

interface DeleteRecordButtonProps {
  recordId: string;
  recordName: string;
  accountId: string;
}

export function DeleteRecordButton({
  recordId,
  recordName,
  accountId,
}: DeleteRecordButtonProps) {
  const [state, formAction, isPending] = useActionState(deleteRecord, {
    success: false,
    errors: {},
  });

  console.log({ recordId });
  console.log({ recordName });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="size-8 cursor-pointer"
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Record
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the record{" "}
            <strong>&quot;{recordName}&quot;</strong>? This action cannot be
            undone and will permanently delete all associated transactions.
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
            <input type="hidden" name="recordId" value={recordId} />
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
                "Delete Record"
              )}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
