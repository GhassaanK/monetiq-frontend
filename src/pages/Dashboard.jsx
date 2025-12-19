import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PieChart as PieIcon,
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const COLORS = ["#38bdf8", "#8b5cf6", "#ec4899", "#22c55e"];

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  /* ================= AUTH + API ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const safeFetch = async (url) => {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("unauthorized");
      const text = await res.text();
      return text ? JSON.parse(text) : [];
    };

    Promise.all([
      safeFetch("/api/incomes"),
      safeFetch("/api/expenses"),
    ])
      .then(([incomeData, expenseData]) => {
        setIncomes(incomeData);
        setExpenses(expenseData);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  /* ================= DERIVED DATA ================= */

  const totalIncome = incomes.reduce((s, i) => s + (i.amount || 0), 0);
  const totalExpense = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  const weeklyTrend = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => ({
    name: day,
    income: incomes.reduce((s, i) => s + (i.amount || 0), 0) / 7,
    expense: expenses.reduce((s, e) => s + (e.amount || 0), 0) / 7,
  }));

  const categoryData = Object.values(
    expenses.reduce((acc, e) => {
      if (!e.category) return acc;
      acc[e.category] ??= { name: e.category, value: 0 };
      acc[e.category].value += e.amount || 0;
      return acc;
    }, {})
  );

  const recentActivity = [
    ...incomes.map((i) => ({
      id: `i-${i.id}`,
      type: "income",
      label: i.source,
      amount: i.amount,
      date: i.date,
    })),
    ...expenses.map((e) => ({
      id: `e-${e.id}`,
      type: "expense",
      label: e.category,
      amount: e.amount,
      date: e.date,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Balance",
      value: `$${balance.toFixed(2)}`,
      icon: Wallet,
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Monthly Income",
      value: `$${totalIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Monthly Expense",
      value: `$${totalExpense.toFixed(2)}`,
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

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c0f] via-[#141414] to-[#0b0c0f] p-4 sm:p-6 text-gray-200">

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-gray-400 text-sm">
          Track your money with a live financial pulse.
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
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              Weekly Cash Flow
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line dataKey="income" stroke="#10b981" strokeWidth={3} />
                <Line dataKey="expense" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <PieIcon size={18} className="text-sky-400" />
              Monthly Income vs Expenses
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#10b981" />
                <Bar dataKey="expense" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieIcon size={18} className="text-violet-400" />
              Expense Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" label outerRadius={80}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
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
                    {item.type === "income" ? "+" : "-"}${item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
