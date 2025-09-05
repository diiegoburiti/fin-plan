"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChartDonut } from "@/components/dashboard/ChartPieDonut";
import { AreaChart } from "@/components/dashboard/AreaChart";
import {
  CalendarIcon,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { createClient } from "@/lib/supabase/client";
import { getCategoryLabel } from "@/utils";
import { ChartPieSeparatorNone } from "@/components/dashboard/ChartPieSeparatorNone";

interface Account {
  account_id: string;
  name: string;
  type: string;
  initial_amount: number;
}

interface RecordType {
  transaction_id: string;
  account_id: string;
  type: "expense" | "income";
  amount: number;
  date: string;
  name: string;
  category: string;
}

interface DashboardData {
  accounts: Account[];
  records: RecordType[];
}

export default function Page() {
  const [data, setData] = useState<DashboardData>({
    accounts: [],
    records: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30");

  useEffect(() => {
    async function fetchData() {
      const supabase = await createClient();

      try {
        setLoading(true);

        const [accountsResponse, recordsResponse] = await Promise.all([
          supabase.from("accounts").select("*"),
          supabase
            .from("records")
            .select("*")
            .order("date", { ascending: false }),
        ]);

        console.log({ accountsResponse });

        if (accountsResponse.error) throw accountsResponse.error;
        if (recordsResponse.error) throw recordsResponse.error;

        setData({
          accounts: accountsResponse.data || [],
          records: recordsResponse.data || [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredRecords = useMemo(() => {
    let filtered = data.records;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
    filtered = filtered.filter((record) => new Date(record.date) >= cutoffDate);

    if (selectedAccount !== "all") {
      filtered = filtered.filter(
        (record) => record.account_id === selectedAccount
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((record) => record.type === selectedType);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (record) => record.category === selectedCategory
      );
    }

    return filtered;
  }, [
    data.records,
    selectedAccount,
    selectedType,
    selectedCategory,
    dateRange,
  ]);

  const summaryMetrics = useMemo(() => {
    const expenses = filteredRecords.filter((r) => r.type === "expense");
    const income = filteredRecords.filter((r) => r.type === "income");

    const totalExpenses = expenses.reduce(
      (sum, r) => sum + parseFloat(r.amount.toString()),
      0
    );
    const totalIncome = income.reduce(
      (sum, r) => sum + parseFloat(r.amount.toString()),
      0
    );
    const netAmount = totalIncome - totalExpenses;
    const totalBalance =
      data.accounts.reduce(
        (sum, acc) => sum + parseFloat(acc.initial_amount.toString()),
        0
      ) + netAmount;

    return {
      totalExpenses,
      totalIncome,
      netAmount,
      totalBalance,
      transactionCount: filteredRecords.length,
    };
  }, [filteredRecords, data.accounts]);

  const dailyData = useMemo(() => {
    const groupedData = filteredRecords.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = { date, expenses: 0, income: 0 };
      }
      if (record.type === "expense") {
        acc[date].expenses += parseFloat(record.amount.toString());
      } else {
        acc[date].income += parseFloat(record.amount.toString());
      }
      return acc;
    }, {} as Record<string, { date: string; expenses: number; income: number }>);

    return Object.values(groupedData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);
  }, [filteredRecords]);

  const categoryData = useMemo(() => {
    const categoryTotals = filteredRecords
      .filter((r) => r.type === "expense")
      .reduce((acc, record) => {
        const category = record.category || "Uncategorized";
        acc[category] =
          (acc[category] || 0) + parseFloat(record.amount.toString());
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredRecords]);

  /*   const accountData = useMemo(() => {
    const accountTotals = data.accounts.map((account) => {
      const accountRecords = filteredRecords.filter(
        (r) => r.account_id === account.account_id
      );
      const expenses = accountRecords
        .filter((r) => r.type === "expense")
        .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);

      const income = accountRecords
        .filter((r) => r.type === "income")
        .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);

      const balance =
        parseFloat(account.initial_amount.toString()) + income - expenses;

      return {
        name: account.name,
        balance,
        expenses,
        income,
      };
    });

    return accountTotals;
  }, [data.accounts, filteredRecords]); */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        data.records.map((record) => getCategoryLabel(record?.category))
      ),
    ];
    return uniqueCategories;
  }, [data.records]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className=" space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Track your expenses and income across all accounts
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account</label>
              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {data.accounts.map((account) => (
                    <SelectItem
                      key={account.account_id}
                      value={account.account_id}
                    >
                      <>
                        {console.log({ account })}
                        {account.name}
                      </>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category || ""}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryMetrics.totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatCurrency(summaryMetrics.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatCurrency(summaryMetrics.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summaryMetrics.netAmount >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {summaryMetrics.netAmount >= 0 ? "+" : ""}
              {formatCurrency(summaryMetrics.netAmount)}
            </div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryMetrics.transactionCount}
            </div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ChartPieSeparatorNone chartData={categoryData} />
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChartDonut chartData={categoryData} />
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart dailyData={dailyData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
