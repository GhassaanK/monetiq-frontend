import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Filter,
  BarChart2,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Transactions() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: "income", category: "Salary", amount: 5000, date: "2025-10-01", notes: "Monthly salary" },
    { id: 2, type: "expense", category: "Food", amount: 120, date: "2025-10-02", notes: "Dinner" },
    { id: 3, type: "expense", category: "Transport", amount: 60, date: "2025-10-03", notes: "Uber" },
    { id: 4, type: "income", category: "Freelance", amount: 850, date: "2025-10-06", notes: "Web project" },
    { id: 5, type: "expense", category: "Shopping", amount: 300, date: "2025-10-10", notes: "Clothes" },
  ]);

  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    startDate: "",
    endDate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "income",
    category: "",
    amount: "",
    date: "",
    notes: "",
  });

  const handleAdd = () => {
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.date) return;
    setTransactions([
      ...transactions,
      { ...newTransaction, id: Date.now(), amount: parseFloat(newTransaction.amount) },
    ]);
    setNewTransaction({ type: "income", category: "", amount: "", date: "", notes: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => setTransactions(transactions.filter((t) => t.id !== id));

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filters.type === "all" || t.type === filters.type;
      const matchesCategory = filters.category === "all" || t.category === filters.category;
      const withinDate =
        (!filters.startDate || t.date >= filters.startDate) &&
        (!filters.endDate || t.date <= filters.endDate);
      return matchesType && matchesCategory && withinDate;
    });
  }, [transactions, filters]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const expense = filteredTransactions.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);
    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  const categories = [...new Set(transactions.map((t) => t.category))];

  // Category data for visualization
  const categorySpending = useMemo(() => {
    const data = {};
    transactions.forEach((t) => {
      if (t.type === "expense") data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data).map(([category, value]) => ({ category, value }));
  }, [transactions]);

  const weeklyTrend = [
    { week: "Week 1", income: 1500, expense: 1000 },
    { week: "Week 2", income: 1800, expense: 1300 },
    { week: "Week 3", income: 2000, expense: 1600 },
    { week: "Week 4", income: 1600, expense: 1200 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090a0c] via-[#121315] to-[#090a0c] text-gray-100 px-4 py-6 sm:px-6 md:px-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-5">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent"
        >
          Transactions
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium shadow-lg hover:shadow-emerald-500/30 transition-all"
        >
          <Plus size={18} /> Add Transaction
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {[
          { title: "Total Income", value: totals.income, color: "emerald", icon: Wallet },
          { title: "Total Expenses", value: totals.expense, color: "rose", icon: ArrowDownRight },
          { title: "Net Balance", value: totals.net, color: totals.net >= 0 ? "sky" : "rose", icon: PiggyBank },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-gray-900/70 border border-gray-800 rounded-2xl backdrop-blur-lg shadow-lg hover:border-emerald-400/30 transition"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">{item.title}</p>
              <item.icon size={22} className={`text-${item.color}-400`} />
            </div>
            <h3 className={`text-xl sm:text-2xl font-semibold mt-2 text-${item.color}-400`}>
              ${item.value.toFixed(2)}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur-md"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart2 size={18} className="text-teal-400" /> Income vs Expenses (Monthly)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={[
                { month: "Jan", income: 4200, expense: 2500 },
                { month: "Feb", income: 3800, expense: 2600 },
                { month: "Mar", income: 4600, expense: 3100 },
                { month: "Apr", income: 4900, expense: 3400 },
                { month: "May", income: 5200, expense: 3700 },
                { month: "Jun", income: 5500, expense: 4200 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={20} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur-md"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Filter size={18} className="text-sky-400" /> Category Insights
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart2 />
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart layout="vertical" data={categorySpending} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="category" type="category" stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                <Bar dataKey="value" fill="#38bdf8" radius={[0, 6, 6, 0]} barSize={15} />
              </ComposedChart>
            </ResponsiveContainer>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 mb-10"
      >
        <h3 className="text-lg font-semibold mb-3 text-emerald-400">Weekly Cash Flow Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
            <XAxis dataKey="week" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
            <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={20} />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-md">
        <div className="min-w-full w-max sm:w-full">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/70 text-gray-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    {t.type === "income" ? (
                      <ArrowUpRight size={16} className="text-emerald-400" />
                    ) : (
                      <ArrowDownRight size={16} className="text-rose-400" />
                    )}
                    <span className={`capitalize ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{t.category}</td>
                  <td className="px-4 py-3">${t.amount}</td>
                  <td className="px-4 py-3">{t.date}</td>
                  <td className="px-4 py-3 text-gray-400 truncate max-w-[150px]">{t.notes}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-rose-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-black/60 z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900/95 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  {["income", "expense"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewTransaction({ ...newTransaction, type })}
                      className={`flex-1 py-2 rounded-lg border ${
                        newTransaction.type === type
                          ? type === "income"
                            ? "border-emerald-400 text-emerald-400"
                            : "border-rose-400 text-rose-400"
                          : "border-gray-700 text-gray-400"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                {["category", "amount", "date"].map((field) => (
                  <input
                    key={field}
                    type={field === "amount" ? "number" : field === "date" ? "date" : "text"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newTransaction[field]}
                    onChange={(e) => setNewTransaction({ ...newTransaction, [field]: e.target.value })}
                    className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                ))}

                <textarea
                  placeholder="Notes (optional)"
                  value={newTransaction.notes}
                  onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-md hover:shadow-emerald-500/30 transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
