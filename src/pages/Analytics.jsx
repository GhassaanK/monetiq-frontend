import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  PieChart as PieIcon,
  Activity,
} from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("6M");

  const COLORS = ["#38bdf8", "#8b5cf6", "#ec4899", "#22c55e", "#f59e0b", "#3b82f6"];

  // Mock data for income vs expenses
  const monthlyData = [
    { month: "Jan", income: 4200, expenses: 2900, savings: 1300 },
    { month: "Feb", income: 4600, expenses: 3100, savings: 1500 },
    { month: "Mar", income: 5000, expenses: 3300, savings: 1700 },
    { month: "Apr", income: 5400, expenses: 3600, savings: 1800 },
    { month: "May", income: 5800, expenses: 3900, savings: 1900 },
    { month: "Jun", income: 6200, expenses: 4000, savings: 2200 },
  ];

  // Category breakdown
  const expenseBreakdown = [
    { name: "Rent", value: 1200 },
    { name: "Food", value: 800 },
    { name: "Transport", value: 400 },
    { name: "Shopping", value: 350 },
    { name: "Entertainment", value: 250 },
    { name: "Healthcare", value: 200 },
  ];

  // Goal tracking
  const goals = [
    { goal: "Emergency Fund", progress: 80 },
    { goal: "Vacation Savings", progress: 60 },
    { goal: "Car Purchase", progress: 45 },
    { goal: "Home Downpayment", progress: 30 },
  ];

  // Weekly spending pattern
  const spendingHeatmap = [
    { day: "Mon", amount: 90 },
    { day: "Tue", amount: 150 },
    { day: "Wed", amount: 120 },
    { day: "Thu", amount: 200 },
    { day: "Fri", amount: 310 },
    { day: "Sat", amount: 420 },
    { day: "Sun", amount: 250 },
  ];

  // Stat summary
  const stats = [
    {
      title: "Total Income",
      value: "$31,200",
      change: "+12%",
      icon: DollarSign,
      color: "from-green-400 to-emerald-600",
    },
    {
      title: "Total Expenses",
      value: "$21,100",
      change: "+8%",
      icon: Wallet,
      color: "from-pink-400 to-rose-600",
    },
    {
      title: "Total Savings",
      value: "$10,100",
      change: "+19%",
      icon: PiggyBank,
      color: "from-sky-400 to-blue-600",
    },
    {
      title: "Net Worth",
      value: "$42,800",
      change: "+9%",
      icon: Activity,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] via-[#141414] to-[#0f0f10] p-6 text-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-teal-500 to-sky-500 bg-clip-text text-transparent">
            Financial Analytics
          </h2>
          <p className="text-gray-400 text-sm">
            Deep insights into your income, expenses, savings, and goals.
          </p>
        </motion.div>

        {/* Time Range Filter */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-sky-500 outline-none"
        >
          <option value="1M">Last Month</option>
          <option value="3M">Last 3 Months</option>
          <option value="6M">Last 6 Months</option>
          <option value="12M">Last Year</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl p-5 bg-gray-900/70 border border-gray-800 hover:shadow-[0_0_16px_rgba(56,189,248,0.15)] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                  <span className="text-xs font-medium text-green-400">
                    {card.change}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${card.color} bg-opacity-20`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Cash Flow Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 bg-gray-900/70 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-sky-400" />
            Income vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Area type="monotone" dataKey="income" stroke="#22c55e" fill="url(#income)" />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                fill="url(#expenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/70 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <PieIcon size={18} className="text-violet-400" />
            Expense Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                {expenseBreakdown.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 col-span-1"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <PiggyBank size={18} className="text-emerald-400" />
            Savings Growth
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Goals Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target size={18} className="text-sky-400" />
            Goal Progress
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
                    className="h-full bg-gradient-to-r from-sky-500 to-violet-500"
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