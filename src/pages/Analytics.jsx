import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  DollarSign,
  Target,
  PieChart as PieIcon,
  Activity,
  BarChart2,
} from "lucide-react";
import { api } from "../api/client";
import { useToast } from "../components/common/Toast";

const formatPKR = (value = 0) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `PKR ${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `PKR ${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `PKR ${(value / 1_000).toFixed(1)}k`;
  return `PKR ${value.toFixed(0)}`;
};

export default function Analytics() {
  const toast = useToast();

  const [timeRange, setTimeRange] = useState("6M");
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const COLORS = [
    "#38bdf8",
    "#8b5cf6",
    "#ec4899",
    "#22c55e",
    "#f59e0b",
    "#a855f7",
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const inc = await api.get("/api/incomes");
        const exp = await api.get("/api/expenses");
        setIncomes(Array.isArray(inc) ? inc : []);
        setExpenses(Array.isArray(exp) ? exp : []);
      } catch {
        toast("Failed to load analytics data", { type: "error" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const monthsBack = (r) => {
    if (r === "1M") return 1;
    if (r === "3M") return 3;
    if (r === "6M") return 6;
    return 12;
  };

  const monthlyData = useMemo(() => {
    const count = monthsBack(timeRange);
    const now = new Date();

    const buckets = {};
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets[key] = {
        month: d.toLocaleString(undefined, { month: "short" }),
        income: 0,
        expenses: 0,
        savings: 0,
      };
    }

    incomes.forEach((i) => {
      const d = new Date(i.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) buckets[key].income += Number(i.amount) || 0;
    });

    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) buckets[key].expenses += Number(e.amount) || 0;
    });

    return Object.values(buckets).map((m) => ({
      ...m,
      savings: m.income - m.expenses,
    }));
  }, [timeRange, incomes, expenses]);

  const expenseBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const key = e.category || "Other";
      map[key] = (map[key] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const totalIncome = incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const totalExpense = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const totalSavings = totalIncome - totalExpense;

  const stats = [
    {
      title: "Total Income",
      value: formatPKR(totalIncome),
      icon: DollarSign,
      color: "from-emerald-400 to-green-600",
    },
    {
      title: "Total Expenses",
      value: formatPKR(totalExpense),
      icon: Wallet,
      color: "from-rose-400 to-pink-600",
    },
    {
      title: "Total Savings",
      value: formatPKR(totalSavings),
      icon: PiggyBank,
      color: "from-sky-400 to-blue-600",
    },
    {
      title: "Active Entries",
      value: incomes.length + expenses.length,
      icon: Activity,
      color: "from-violet-400 to-purple-600",
    },
  ];

  const savingsTrend = monthlyData.map((m) => ({
    month: m.month,
    target: Math.round(m.income * 0.3),
    achieved: Math.max(0, m.savings),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c0f] via-[#121315] to-[#0b0c0f] p-4 sm:p-6 text-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Analytics Overview
          </h2>
          <p className="text-gray-400 text-sm">
            Financial insights based on your real data.
          </p>
        </motion.div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm"
        >
          <option value="1M">Last Month</option>
          <option value="3M">Last 3 Months</option>
          <option value="6M">Last 6 Months</option>
          <option value="12M">Last Year</option>
        </select>
      </div>

      {loading && <p className="text-gray-400 mb-4">Loading analytics…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5 bg-gray-900 border border-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{s.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{s.value}</h3>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${s.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={18} /> Income vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => formatPKR(v)} />
              <Area type="monotone" dataKey="income" stroke="#10b981" fill="#10b98155" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef444455" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <PieIcon size={18} /> Expense Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseBreakdown} dataKey="value" outerRadius={90}>
                {expenseBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatPKR(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart2 size={18} /> Savings Target vs Achieved
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={savingsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => formatPKR(v)} />
              <Bar dataKey="target" fill="#64748b" />
              <Bar dataKey="achieved" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <PiggyBank size={18} /> Savings Growth
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => formatPKR(v)} />
              <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target size={18} /> Goal Progress
          </h3>
          <div className="space-y-4">
            {[
              { label: "Emergency Fund", value: totalSavings, max: totalIncome },
              { label: "Vacation", value: totalSavings * 0.6, max: totalIncome },
              { label: "Car", value: totalSavings * 0.45, max: totalIncome },
            ].map((g, i) => {
              const pct = Math.min(100, Math.round((g.value / Math.max(1, g.max)) * 100));
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{g.label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-sky-400 to-violet-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}