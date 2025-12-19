import { useState, useMemo, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
    : null;
};



export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    startDate: "",
    endDate: "",
  });

  const [transactionType, setTransactionType] = useState("income");

  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    date: "",
    notes: "",
  });

  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });


  /* ================= AUTH + LOAD ================= */

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
      return res.json();
    };

    Promise.all([
      safeFetch("/api/incomes"),
      safeFetch("/api/expenses"),
    ])
      .then(([incomes, expenses]) => {
        setTransactions([
          ...incomes.map((i) => ({
            id: `i-${i.id}`,
            backendId: i.id,
            type: "income",
            category: i.source,
            amount: Number(i.amount),
            date: i.date,
            notes: i.notes || "",
          })),
          ...expenses.map((e) => ({
            id: `e-${e.id}`,
            backendId: e.id,
            type: "expense",
            category: e.category,
            amount: Number(e.amount),
            date: e.date,
            notes: e.description || "",
          })),
        ]);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  /* ================= CREATE ================= */

  const handleAdd = async () => {
    const headers = authHeaders();
    if (!headers) {
      navigate("/");
      return;
    }

    const isIncome = transactionType === "income";
    const url = isIncome ? "/api/incomes" : "/api/expenses";
    const payload = isIncome
      ? {
        source: newIncome.source,
        amount: Number(newIncome.amount),
        date: newIncome.date,
        notes: newIncome.notes,
      }
      : {
        category: newExpense.category,
        amount: Number(newExpense.amount),
        date: newExpense.date,
        description: newExpense.description,
      };

    if (
      payload.amount === "" ||
      Number.isNaN(payload.amount) ||
      !payload.date ||
      (isIncome ? !payload.source.trim() : !payload.category.trim())
    ) return;


    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      console.error("401 on expense add - check backend auth");
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    if (!res.ok) {
      console.error("Failed to add:", res.status, await res.text());
      return;
    }

    if (!res.ok) return;

    const created = await res.json();

    setTransactions((prev) => [
      ...prev,
      {
        id: `${isIncome ? "i" : "e"}-${created.id}`,
        backendId: created.id,
        type: transactionType,
        category: isIncome ? created.source : created.category,
        amount: Number(created.amount),
        date: created.date,
        notes: isIncome ? created.notes || "" : created.description || "",
      },
    ]);

    setNewIncome({ source: "", amount: "", date: "", notes: "" });
    setNewExpense({ category: "", amount: "", date: "", description: "" });
    setShowModal(false);
  };


  /* ================= DELETE ================= */

  const handleDelete = async (t) => {
    const token = localStorage.getItem("token");
    const url =
      t.type === "income"
        ? `/api/incomes/${t.backendId}`
        : `/api/expenses/${t.backendId}`;

    await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setTransactions((prev) => prev.filter((x) => x.id !== t.id));
  };

  /* ================= DERIVED ================= */

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
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);
    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  const categorySpending = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(map).map(([category, value]) => ({ category, value }));
  }, [transactions]);

  const weeklyTrend = useMemo(() => {
    const weeks = {};
    transactions.forEach((t) => {
      const week = `Week ${Math.ceil(new Date(t.date).getDate() / 7)}`;
      if (!weeks[week]) weeks[week] = { week, income: 0, expense: 0 };
      weeks[week][t.type] += t.amount;
    });
    return Object.values(weeks);
  }, [transactions]);

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
            {/* <BarChart2 /> */}
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
                    <button onClick={() => handleDelete(t)} className="text-gray-400 hover:text-rose-500 transition">
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
                      onClick={() => setTransactionType(type)}
                      className={`flex-1 py-2 rounded-lg border ${transactionType === type
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

                {transactionType === "income" && (
                  <>
                    <input
                      type="text"
                      placeholder="Income Source"
                      value={newIncome.source}
                      onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={newIncome.amount}
                      onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
                    />
                    <input
                      type="date"
                      value={newIncome.date}
                      onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
                    />
                    <textarea
                      placeholder="Notes (optional)"
                      value={newIncome.notes}
                      onChange={(e) => setNewIncome({ ...newIncome, notes: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
                    />
                  </>
                )}

                {transactionType === "expense" && (
                  <>
                    <input
                      type="text"
                      placeholder="Expense Category"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
                    />
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
                    />
                    <textarea
                      placeholder="Description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
                    />
                  </>
                )}
              </div>

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}