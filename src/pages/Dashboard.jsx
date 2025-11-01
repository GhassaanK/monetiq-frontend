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
  const COLORS = ["#38bdf8", "#8b5cf6", "#ec4899", "#22c55e"];

  const weeklyTrend = [
    { name: "Mon", income: 450, expense: 200 },
    { name: "Tue", income: 600, expense: 300 },
    { name: "Wed", income: 400, expense: 280 },
    { name: "Thu", income: 700, expense: 450 },
    { name: "Fri", income: 500, expense: 320 },
    { name: "Sat", income: 300, expense: 200 },
    { name: "Sun", income: 550, expense: 370 },
  ];

  const categoryData = [
    { name: "Food", value: 400 },
    { name: "Rent", value: 800 },
    { name: "Shopping", value: 200 },
    { name: "Savings", value: 500 },
  ];

  const recentActivity = [
    { id: 1, type: "income", label: "Freelance Project", amount: 450, date: "Today" },
    { id: 2, type: "expense", label: "Groceries", amount: 120, date: "Yesterday" },
    { id: 3, type: "income", label: "Bonus", amount: 300, date: "Oct 29" },
    { id: 4, type: "expense", label: "Netflix Subscription", amount: 18, date: "Oct 28" },
    { id: 5, type: "expense", label: "Dinner Out", amount: 65, date: "Oct 27" },
  ];

  const statCards = [
    { title: "Total Balance", value: "$12,340", icon: Wallet, color: "from-sky-500 to-blue-600" },
    { title: "Monthly Income", value: "$4,800", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
    { title: "Monthly Expense", value: "$2,970", icon: TrendingDown, color: "from-pink-500 to-rose-600" },
    { title: "Active Cards", value: "3", icon: CreditCard, color: "from-violet-500 to-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c0f] via-[#141414] to-[#0b0c0f] p-4 sm:p-6 text-gray-200">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-gray-400 text-sm">Track your money with a live financial pulse.</p>
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
              className="rounded-2xl p-5 bg-gray-900/70 border border-gray-800 shadow hover:shadow-[0_0_16px_rgba(56,189,248,0.1)] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} bg-opacity-20`}>
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left side: Charts */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              Weekly Cash Flow
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <PieIcon size={18} className="text-sky-400" />
              Monthly Income vs Expenses
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Right side: Summary & Activity */}
        <div className="flex flex-col gap-6">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieIcon size={18} className="text-violet-400" />
              Expense Breakdown
            </h3>
            <div className="h-[220px] flex justify-center items-center">
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
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {item.type === "income" ? (
                      <ArrowUpRight className="text-emerald-400" size={18} />
                    ) : (
                      <ArrowDownRight className="text-rose-400" size={18} />
                    )}
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      item.type === "income" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}${item.amount}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
