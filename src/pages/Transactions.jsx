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
} from "lucide-react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Transactions() {
    const [transactions, setTransactions] = useState([
        { id: 1, type: "income", category: "Salary", amount: 5000, date: "2025-10-01", notes: "Monthly salary" },
        { id: 2, type: "expense", category: "Food", amount: 120, date: "2025-10-02", notes: "Dinner" },
        { id: 3, type: "expense", category: "Transport", amount: 60, date: "2025-10-03", notes: "Uber" },
        { id: 4, type: "income", category: "Freelance", amount: 850, date: "2025-10-06", notes: "Web project" },
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

    // --- Filtering Logic ---
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

    // --- Calculated Stats ---
    const totals = useMemo(() => {
        const income = filteredTransactions
            .filter((t) => t.type === "income")
            .reduce((a, b) => a + b.amount, 0);
        const expense = filteredTransactions
            .filter((t) => t.type === "expense")
            .reduce((a, b) => a + b.amount, 0);
        return { income, expense, net: income - expense };
    }, [filteredTransactions]);

    const categories = [...new Set(transactions.map((t) => t.category))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] via-[#141414] to-[#0f0f10] p-6 text-gray-200">
            {/* Header + Add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent"
                >
                    Transactions
                </motion.h2>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-medium shadow-md hover:shadow-sky-500/20 transition-all"
                >
                    <Plus size={18} /> Add Transaction
                </motion.button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="p-5 bg-gray-900/70 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-sm">Total Income</p>
                        <Wallet size={20} className="text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mt-1 text-green-400">${totals.income.toFixed(2)}</h3>
                </div>
                <div className="p-5 bg-gray-900/70 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-sm">Total Expenses</p>
                        <ArrowDownRight size={20} className="text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold mt-1 text-red-400">${totals.expense.toFixed(2)}</h3>
                </div>
                <div className="p-5 bg-gray-900/70 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-sm">Net Balance</p>
                        <PiggyBank size={20} className="text-sky-400" />
                    </div>
                    <h3
                        className={`text-2xl font-bold mt-1 ${totals.net >= 0 ? "text-sky-400" : "text-red-400"
                            }`}
                    >
                        ${totals.net.toFixed(2)}
                    </h3>
                </div>
            </div>

            {/* Summary Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 mb-8 shadow-lg"
            >
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
                    Monthly Income vs Expenses
                </h3>
                <ResponsiveContainer width="100%" height={250}>
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
                        <Bar
                            dataKey="expense"
                            fill="url(#expGradient)"
                            radius={[6, 6, 0, 0]}
                            barSize={25}
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#38bdf8"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#38bdf8" }}
                        />
                        <defs>
                            <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                <stop offset="100%" stopColor="#1e1e1e" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>
                    </ComposedChart>
                </ResponsiveContainer>
            </motion.div>


            {/* Filters */}
            <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4 mb-6 flex flex-wrap gap-3 items-center">
                <Filter size={18} className="text-sky-400" />
                <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-sky-500 outline-none"
                >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-sky-500 outline-none"
                >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>

                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-sky-500 outline-none"
                />
                <span className="text-gray-500 text-sm">to</span>
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-sky-500 outline-none"
                />
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-lg shadow-lg">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-800/70 text-gray-400 text-xs uppercase">
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
                                className="border-t border-gray-800 hover:bg-gray-800/60 transition-colors"
                            >
                                <td className="px-4 py-3 flex items-center gap-2">
                                    {t.type === "income" ? (
                                        <ArrowUpRight size={16} className="text-green-400" />
                                    ) : (
                                        <ArrowDownRight size={16} className="text-red-400" />
                                    )}
                                    <span
                                        className={`capitalize ${t.type === "income" ? "text-green-400" : "text-red-400"
                                            }`}
                                    >
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{t.category}</td>
                                <td className="px-4 py-3">${t.amount}</td>
                                <td className="px-4 py-3">{t.date}</td>
                                <td className="px-4 py-3 text-gray-400">{t.notes}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[90%] sm:w-[400px] shadow-xl"
                        >
                            <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    {["income", "expense"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setNewTransaction({ ...newTransaction, type })}
                                            className={`flex-1 py-2 rounded-lg border ${newTransaction.type === type
                                                    ? type === "income"
                                                        ? "border-green-400 text-green-400"
                                                        : "border-red-400 text-red-400"
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
                                        onChange={(e) =>
                                            setNewTransaction({ ...newTransaction, [field]: e.target.value })
                                        }
                                        className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-sky-500 outline-none"
                                    />
                                ))}

                                <textarea
                                    placeholder="Notes (optional)"
                                    value={newTransaction.notes}
                                    onChange={(e) =>
                                        setNewTransaction({ ...newTransaction, notes: e.target.value })
                                    }
                                    className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-sky-500 outline-none"
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
                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-medium shadow-md hover:shadow-sky-500/20 transition-all"
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
