import { createClient } from "@/lib/supabase/server";
import EditRecordPage from "@/records/ui/EdtiRecords";

interface PageProps {
  params: {
    recordId: string;
  };
}

async function getRecord(recordId: string) {
  const supabase = await createClient();

  const { data: record, error } = await supabase
    .from("records")
    .select("*")
    .eq("transaction_id", recordId)
    .single();

  if (error || !record) {
    return null;
  }

  return record;
}

export default async function Page(props: {
  params: Promise<{ accountId: string; recordId: string }>;
}) {
  const { accountId, recordId } = await props.params;

  const record = await getRecord(recordId);

  return <EditRecordPage transaction={record} accountId={accountId} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { recordId } = await params;

  const record = await getRecord(recordId);

  return {
    title: record ? `Edit ${record.name}` : "Edit Transaction",
    description: "Edit transaction details",
  };
}
