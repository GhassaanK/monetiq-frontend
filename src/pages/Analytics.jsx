import { useState, useEffect } from "react";
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

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("6M");
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const { VITE_BACKEND } = import.meta.env;
  const API_BASE = VITE_BACKEND || "";
  const toast = useToast();

  const COLORS = ["#38bdf8", "#8b5cf6", "#ec4899", "#22c55e", "#f59e0b", "#a855f7"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // use central api helper
        const inc = await api.get('/api/incomes');
        const exp = await api.get('/api/expenses');
        setIncomes(Array.isArray(inc) ? inc : []);
        setExpenses(Array.isArray(exp) ? exp : []);
      } catch (err) {
        toast && toast("Unable to load analytics — check your network or login.", { type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE]);

  // helpers to produce monthly aggregates for the selected range
  const monthsBack = (range) => {
    if (range === "1M") return 1;
    if (range === "3M") return 3;
    if (range === "6M") return 6;
    return 12;
  };

  const buildMonthlyData = (n) => {
    const now = new Date();
    const months = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      months.push({ date: d, key, label: d.toLocaleString(undefined, { month: 'short' }) });
    }
    const incMap = {};
    const expMap = {};
    incomes.forEach((it) => {
      const d = new Date(it.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      incMap[key] = (incMap[key] || 0) + (Number(it.amount) || 0);
    });
    expenses.forEach((it) => {
      const d = new Date(it.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      expMap[key] = (expMap[key] || 0) + (Number(it.amount) || 0);
    });

    return months.map((m) => ({ month: m.label, income: incMap[m.key] || 0, expenses: expMap[m.key] || 0, savings: (incMap[m.key] || 0) - (expMap[m.key] || 0) }));
  };

  const n = monthsBack(timeRange);
  const monthlyData = buildMonthlyData(n);

  const expenseBreakdown = (() => {
    const map = {};
    expenses.forEach((e) => {
      const k = e.category || 'Other';
      map[k] = (map[k] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  const totalIncome = incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const totalExpense = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const totalSavings = totalIncome - totalExpense;

  const stats = [
    { title: "Total Income", value: `$${totalIncome.toLocaleString()}`, change: "", icon: DollarSign, color: "from-emerald-400 to-green-600" },
    { title: "Total Expenses", value: `$${totalExpense.toLocaleString()}`, change: "", icon: Wallet, color: "from-rose-400 to-pink-600" },
    { title: "Total Savings", value: `$${totalSavings.toLocaleString()}`, change: "", icon: PiggyBank, color: "from-sky-400 to-blue-600" },
    { title: "Active Entries", value: incomes.length + expenses.length, change: "", icon: Activity, color: "from-violet-400 to-purple-600" },
  ];

  const goals = [
    { goal: "Emergency Fund", progress: Math.min(100, Math.round((totalSavings / Math.max(1, totalIncome)) * 100)) },
    { goal: "Vacation Savings", progress: Math.min(100, 60) },
    { goal: "Car Purchase", progress: Math.min(100, 45) },
    { goal: "Home Downpayment", progress: Math.min(100, 30) },
  ];

  const savingsTrend = monthlyData.map((m) => ({ month: m.month, target: Math.round(m.income * 0.3), achieved: Math.max(0, m.savings) }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c0f] via-[#121315] to-[#0b0c0f] p-4 sm:p-6 text-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Analytics Overview
          </h2>
          <p className="text-gray-400 text-sm">Your finances dissected with real data insight.</p>
        </motion.div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-emerald-500 outline-none"
        >
          <option value="1M">Last Month</option>
          <option value="3M">Last 3 Months</option>
          <option value="6M">Last 6 Months</option>
          <option value="12M">Last Year</option>
        </select>
      </div>
      {loading && (
        <div className="mb-4 text-sm text-gray-400">Loading analytics data...</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5 bg-gray-900/70 border border-gray-800 shadow hover:shadow-[0_0_18px_rgba(16,185,129,0.15)] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                  <span className="text-xs font-medium text-emerald-400">{card.change}</span>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} bg-opacity-20`}>
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 bg-gray-900/70 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" /> Income vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#inc)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#exp)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <PieIcon size={18} className="text-sky-400" /> Expense Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                {expenseBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart2 size={18} className="text-teal-400" /> Savings Target vs Achieved
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={savingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Bar dataKey="target" fill="#64748b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="achieved" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <PiggyBank size={18} className="text-emerald-400" /> Savings Growth
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target size={18} className="text-sky-400" /> Goal Progress
          </h3>
          <div className="space-y-4">
            {goals.map((g, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1 text-gray-300">
                  <span>{g.goal}</span>
                  <span>{g.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${g.progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-sky-400 to-violet-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
