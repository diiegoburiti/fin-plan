"use server";
import { createClient } from "@/lib/supabase/server";

export default async function ExpensesPage() {
  const supabase = createClient();

  const { data: transactions, error } = await (await supabase)
    .from("monthly_accounts")
    .select("*");

  return (
    <h1>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi soluta enim
      ipsa totam culpa aspernatur nobis, rerum omnis, est cumque eius cupiditate
      facere rem nisi maiores quas natus aut doloribus.
    </h1>
  );
}
