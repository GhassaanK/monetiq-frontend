import { useEffect, useMemo, useState } from "react";
import { useToast } from "../components/common/Toast";
import { api } from "../api/client";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  /* ================= AUTH + API ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    Promise.all([api.get("/api/incomes"), api.get("/api/expenses")])
      .then(([incomeData, expenseData]) => {
        setIncomes(Array.isArray(incomeData) ? incomeData : []);
        setExpenses(Array.isArray(expenseData) ? expenseData : []);
      })
      .catch(() => {
        toast(
          "You have requested an unauthorized action, please refrain from doing that as the application is under development!",
          { type: "error" }
        );
      });
  }, [navigate]);

  /* ================= HELPERS ================= */

  const formatPKR = (value = 0) => {
    if (value >= 1_000_000_000) return `PKR ${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `PKR ${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `PKR ${(value / 1_000).toFixed(1)}k`;
    return `PKR ${Math.round(value)}`;
  };

  const isCurrentMonth = (date) => {
    const d = new Date(date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  /* ================= DERIVED DATA ================= */

  const monthlyIncomes = incomes.filter((i) => isCurrentMonth(i.date));
  const monthlyExpenses = expenses.filter((e) => isCurrentMonth(e.date));

  const totalIncome = monthlyIncomes.reduce((s, i) => s + (i.amount || 0), 0);
  const totalExpense = monthlyExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  const weeklyTrend = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map = {};

    days.forEach((d) => {
      map[d] = { name: d, income: 0, expense: 0 };
    });

    monthlyIncomes.forEach((i) => {
      const day = days[new Date(i.date).getDay()];
      map[day].income += i.amount || 0;
    });

    monthlyExpenses.forEach((e) => {
      const day = days[new Date(e.date).getDay()];
      map[day].expense += e.amount || 0;
    });

    return Object.values(map);
  }, [monthlyIncomes, monthlyExpenses]);

  const topCategories = useMemo(() => {
    const map = {};
    monthlyExpenses.forEach((e) => {
      if (!e.category) return;
      if (!map[e.category]) {
        map[e.category] = { category: e.category, amount: 0 };
      }
      map[e.category].amount += e.amount || 0;
    });

    return Object.values(map)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [monthlyExpenses]);

  const recentActivity = useMemo(() => {
    return [
      ...monthlyIncomes.map((i) => ({
        id: `i-${i.id}`,
        type: "income",
        label: i.source,
        amount: i.amount,
        date: i.date,
      })),
      ...monthlyExpenses.map((e) => ({
        id: `e-${e.id}`,
        type: "expense",
        label: e.category,
        amount: e.amount,
        date: e.date,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [monthlyIncomes, monthlyExpenses]);

  const statCards = [
    {
      title: "Total Balance",
      value: formatPKR(balance),
      icon: Wallet,
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Monthly Income",
      value: formatPKR(totalIncome),
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Monthly Expense",
      value: formatPKR(totalExpense),
      icon: TrendingDown,
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Active Entries",
      value: incomes.length + expenses.length,
      icon: CreditCard,
      color: "from-violet-500 to-purple-600",
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c0f] via-[#141414] to-[#0b0c0f] p-4 sm:p-6 text-gray-200">

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-gray-400 text-sm">
          Your financial overview for this month.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} className="rounded-2xl p-5 bg-gray-900/70 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            Weekly Cash Flow
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => formatPKR(v)} />
              <Line dataKey="income" stroke="#10b981" strokeWidth={3} />
              <Line dataKey="expense" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart2 size={18} className="text-sky-400" />
            Top Spending Categories
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(v) => formatPKR(v)} />
              <Bar dataKey="amount" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 mt-6">
        <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex justify-between bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                {item.type === "income" ? (
                  <ArrowUpRight className="text-emerald-400" />
                ) : (
                  <ArrowDownRight className="text-rose-400" />
                )}
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
              </div>
              <span className={item.type === "income" ? "text-emerald-400" : "text-rose-400"}>
                {item.type === "income" ? "+" : "-"}
                {formatPKR(item.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
