import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PieChart as PieIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const COLORS = ["#38bdf8", "#8b5cf6", "#ec4899", "#22c55e"];

  const expenseData = [
    { name: "Mon", value: 300 },
    { name: "Tue", value: 200 },
    { name: "Wed", value: 450 },
    { name: "Thu", value: 320 },
    { name: "Fri", value: 500 },
    { name: "Sat", value: 280 },
    { name: "Sun", value: 360 },
  ];

  const categoryData = [
    { name: "Food", value: 400 },
    { name: "Rent", value: 600 },
    { name: "Shopping", value: 200 },
    { name: "Savings", value: 300 },
  ];

  const statCards = [
    {
      title: "Total Balance",
      value: "$12,340",
      icon: Wallet,
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Monthly Income",
      value: "$4,800",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Monthly Expense",
      value: "$2,970",
      icon: TrendingDown,
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Active Cards",
      value: "3",
      icon: CreditCard,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] via-[#141414] to-[#0f0f10] p-4 sm:p-6 text-gray-200">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
          Finance Overview
        </h2>
        <p className="text-gray-400 text-sm">Your smart money insights at a glance</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl p-5 bg-gray-900/70 border border-gray-800 shadow-[0_0_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_16px_rgba(59,130,246,0.2)] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <PieIcon size={18} className="text-sky-400" />
            Weekly Expense Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ fill: "#38bdf8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <PieIcon size={18} className="text-violet-400" />
            Expense Breakdown
          </h3>
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Insights / Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Insights 💡</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>💰 You saved 25% more than last week.</li>
              <li>📈 Food expenses increased slightly (+8%).</li>
              <li>🎯 You’re on track to meet your savings goal.</li>
              <li>🔥 3 categories are overspending — review them soon.</li>
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-5 rounded-lg bg-gradient-to-r from-sky-500 to-violet-600 py-2 font-semibold shadow-md hover:shadow-sky-500/20 transition-all"
          >
            View Detailed Report
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
