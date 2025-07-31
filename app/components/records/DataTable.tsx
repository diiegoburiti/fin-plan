"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Pencil, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteRecordButton } from "./DeleteRecordButton";
import { formattedDate } from "@/utils";

export interface Record {
  transaction_id: string;
  name: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  date: Date;
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyComponent?: ReactNode;
}

interface RecordsTable {
  records: Record[];
  accountId: string;
  initialAmount: number;
}

function DataTable<TData, TValue>({
  columns,
  data,
  emptyComponent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (data.length === 0 && emptyComponent) {
    return <div>{emptyComponent}</div>;
  }

  console.log({ data });

  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-200 bg-gray-50/50"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 px-6 text-left align-middle font-semibold text-gray-700 [&:has([role=checkbox])]:pr-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`
                    border-b border-gray-100 transition-colors hover:bg-gray-50/50
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}
                  `}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 align-middle [&:has([role=checkbox])]:pr-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const createColumns = (accountId: string): ColumnDef<Record>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
        >
          Transaction
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="font-semibold text-gray-900 text-sm">
          {row.getValue("name")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
        >
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      const isIncome = type === "income";

      return (
        <div className="flex items-center gap-2">
          {isIncome ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <Badge
            variant={isIncome ? "default" : "destructive"}
            className={`
              font-medium capitalize
              ${
                isIncome
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              }
            `}
          >
            {type}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const record = row.original;
      const isIncome = record.type === "income";

      return (
        <div className="text-right">
          <div
            className={`
              text-lg font-bold tabular-nums
              ${isIncome ? "text-green-600" : "text-red-600"}
            `}
          >
            {isIncome ? "+" : "-"}
            {formatAmount(Math.abs(record.amount))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const record = row.original;
      return (
        <div className="text-right">
          <div className="font-semibold text-gray-900 text-sm">
            {formattedDate(record.date)}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                title="Open menu"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <span className="sr-only">Open menu</span>
                <div className="flex flex-col gap-0.5">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-20">
              <DropdownMenuItem asChild>
                <Link
                  href={`/records/${accountId}/edit/${record.transaction_id}`}
                  className="flex items-center gap-2 cursor-pointer h-8 pl-0 font-medium"
                >
                  <Pencil />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteRecordButton
                  recordId={record.transaction_id}
                  recordName={record.name}
                  accountId={accountId}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function RecordsTable({
  records,
  accountId,
  initialAmount,
}: RecordsTable) {
  const columns = useMemo(() => createColumns(accountId), [accountId]);

  const totalIncome = records
    .filter((record) => record.type === "income")
    .reduce((sum, record) => sum + record.amount, 0);

  const totalExpenses = records
    .filter((record) => record.type === "expense")
    .reduce((sum, record) => sum + Math.abs(record.amount), 0);

  const netAmount = initialAmount + totalIncome - totalExpenses;

  console.log({ initialAmount });

  return (
    <div className="space-y-6">
      {records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Total Income
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {formatAmount(totalIncome)}
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                Total Expenses
              </span>
            </div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {formatAmount(totalExpenses)}
            </div>
          </div>

          <div
            className={`
            bg-gradient-to-r border rounded-lg p-4
            ${
              netAmount >= 0
                ? "from-blue-50 to-blue-100 border-blue-200"
                : "from-orange-50 to-orange-100 border-orange-200"
            }
          `}
          >
            <div className="flex items-center gap-2">
              <div
                className={`
                h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold
                ${
                  netAmount >= 0
                    ? "bg-blue-600 text-white"
                    : "bg-orange-600 text-white"
                }
              `}
              >
                $
              </div>
              <span
                className={`
                text-sm font-medium
                ${netAmount >= 0 ? "text-blue-700" : "text-orange-700"}
              `}
              >
                Net Amount
              </span>
            </div>
            <div
              className={`
              text-2xl font-bold mt-1
              ${netAmount >= 0 ? "text-blue-600" : "text-orange-600"}
            `}
            >
              {formatAmount(netAmount)}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Data Table */}
      <DataTable
        columns={columns}
        data={records}
        emptyComponent={
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-sm">
              Start tracking your finances by adding your first transaction.
              Keep tabs on your income and expenses all in one place.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/records/${accountId}/new`}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Add Your First Transaction
              </Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}

// Export the main component as default
export default RecordsTable;
