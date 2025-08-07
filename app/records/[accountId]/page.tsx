import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/shared/card";
import { ArrowLeft } from "lucide-react";
import { CreateRecord } from "@/components/records/CreateRecord";
import { DeleteAccountButton } from "@/components/records/DeleteAccountButton";
import { EditAccountModal } from "@/components/records/EditAccountModal";
import Link from "next/link";
import RecordsTable, { Record } from "@/components/records/DataTable";

export default async function Page(props: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await props.params;

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
              <span className="font-normal">{fullDetails.name}</span>
            </div>

            <div className="col-span-3">
              <span className="line-clamp-1 flex gap-2 font-medium">Type</span>
              <span className="font-normal">{fullDetails.type}</span>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-3">
              <span className="line-clamp-1 flex gap-2 font-medium">
                Initial Amount
              </span>
              <span className="font-normal">{fullDetails.initial_amount}</span>
            </div>

            <div className="col-span-3">
              <span className="line-clamp-1 flex gap-2 font-medium">
                Expenses
              </span>
              <span className="font-normal">{fullDetails.type}</span>
            </div>
            <div className="col-span-3">
              <span className="line-clamp-1 flex gap-2 font-medium">
                Current balance
              </span>
              <span className="font-normal">999999</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="container mx-auto py-10">
        <RecordsTable
          records={records as Record[]}
          accountId={accountId}
          initialAmount={fullDetails.initial_amount}
        />
      </div>

      <CreateRecord accountId={accountId} categories={categories} />
    </>
  );
}
