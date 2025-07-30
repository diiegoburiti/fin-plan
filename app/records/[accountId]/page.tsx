import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/shared/card";
import { ArrowLeft, Pencil } from "lucide-react";
import { CreateRecord } from "@/components/records/CreateRecord";
import { DeleteAccountButton } from "@/components/records/DeleteAccountButton";
import { EditAccountModal } from "@/components/records/EditAccountModal";
import Link from "next/link";
import { DeleteRecordButton } from "@/components/records/DeleteRecordButton";
import { formatAmount } from "@/utils";

export default async function Page(props: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await props.params;
  console.log({ accountId });

  const supabase = await createClient();

  const { data: details } = await supabase
    .from("accounts")
    .select("*")
    .eq("account_id", accountId);

  const { data: records } = await supabase
    .from("records")
    .select("*")
    .eq("account_id", accountId);

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

  const fullDetails = details![0];

  return (
    <>
      <Card>
        <div className="flex justify-between flex-col">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Link href="/records">
                <Button>
                  <ArrowLeft />
                </Button>
              </Link>
              <h6 className="text-xl">Account Details</h6>
            </div>

            <div className=" flex gap-2">
              <EditAccountModal account={fullDetails} />
              <DeleteAccountButton
                accountId={fullDetails.account_id}
                accountName={fullDetails.name}
              />
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
              <span className="text-">{fullDetails.initial_amount}</span>
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
        {records && records.length > 0 ? (
          records.map((record) => {
            return (
              <Card
                key={record.transaction_id}
                className={`${
                  record.type === "income"
                    ? "border-r-8 border-r-green-500"
                    : "border-r-8 border-r-red-500"
                }`}
                animation
              >
                <div className="flex justify-between items-center">
                  <span>{record.name}</span>
                  <span>{record.category}</span>
                  <div className="flex items-center gap-4">
                    <span
                      className={`${
                        record.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatAmount(record.amount)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-8"
                      >
                        <Link
                          href={`/records/${accountId}/edit/${record.transaction_id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteRecordButton
                        recordId={record.transaction_id}
                        recordName={record.name}
                        accountId={accountId}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium text-gray-900">
                No transactions found
              </h3>
              <p className="text-gray-500">
                Add your first transaction to get started.
              </p>
            </div>
          </Card>
        )}
      </div>

      <CreateRecord accountId={accountId} categories={categories} />
    </>
  );
}
