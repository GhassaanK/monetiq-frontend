import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Plus,
  Edit,
  Trash2,
  Target,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function BudgetPlanner() {
  const [goals, setGoals] = useState([
    { id: 1, name: "Emergency Fund", target: 5000, saved: 2500 },
    { id: 2, name: "Vacation", target: 3000, saved: 1200 },
    { id: 3, name: "New Laptop", target: 1500, saved: 800 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({ name: "", target: "", saved: "" });

  const COLORS = ["#38bdf8", "#8b5cf6", "#ec4899", "#22c55e"];

  const expenseData = [
    { name: "Housing", value: 1200 },
    { name: "Food", value: 800 },
    { name: "Transport", value: 300 },
    { name: "Entertainment", value: 200 },
  ];

  const budgetTrend = [
    { month: "Jan", budget: 2500, spent: 2200 },
    { month: "Feb", budget: 2600, spent: 2100 },
    { month: "Mar", budget: 2700, spent: 2450 },
    { month: "Apr", budget: 2800, spent: 2500 },
    { month: "May", budget: 2900, spent: 2600 },
    { month: "Jun", budget: 3000, spent: 2750 },
  ];

  const handleSaveGoal = () => {
    if (!goalForm.name || !goalForm.target) return;
    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) => (g.id === editingGoal.id ? { ...g, ...goalForm } : g))
      );
    } else {
      setGoals((prev) => [
        ...prev,
        { id: Date.now(), ...goalForm, target: +goalForm.target, saved: +goalForm.saved },
      ]);
    }
    setShowModal(false);
  };

  const handleDeleteGoal = (id) => setGoals((prev) => prev.filter((g) => g.id !== id));

  const openModal = (goal = null) => {
    setEditingGoal(goal);
    setGoalForm(goal || { name: "", target: "", saved: "" });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090a0c] via-[#121315] to-[#090a0c] text-gray-100 px-4 py-6 sm:px-8 md:px-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
          Budget Planner
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Track your spending, plan smarter, and visualize your money growth journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-md backdrop-blur-xl"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-emerald-400">
                Monthly Budget vs Actual Spend
              </h3>
              <TrendingUp className="text-emerald-400" size={18} />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={budgetTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                <Line type="monotone" dataKey="budget" stroke="#38bdf8" strokeWidth={3} />
                <Line type="monotone" dataKey="spent" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-md shadow">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
                Expense Breakdown
              </h3>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={90}>
                      {expenseData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-md shadow">
              <h3 className="text-lg font-semibold mb-2 text-emerald-400">
                Spending Habits
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>💡 <span className="text-gray-300">Food</span> accounts for 32% of your total spending.</li>
                <li>🏠 <span className="text-gray-300">Housing</span> remains consistent, showing stability.</li>
                <li>🛍️ <span className="text-gray-300">Shopping</span> spikes typically near month-end.</li>
                <li>🎯 You’re saving <span className="text-emerald-400">18%</span> of your monthly income on average.</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
              Goals Tracker
            </h3>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 transition text-sm"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="space-y-4">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-base">{goal.name}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(goal)} className="text-gray-400 hover:text-sky-400">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-400 hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-2">
                  ${goal.saved} / ${goal.target}
                </p>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.saved / goal.target) * 100}%` }}
                    className="h-full bg-gradient-to-r from-sky-500 to-violet-600"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-lg z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-gray-900/90 border border-gray-800 p-6 rounded-2xl w-full max-w-md text-gray-200 backdrop-blur-2xl shadow-2xl">
                <h3 className="text-xl font-semibold mb-4">
                  {editingGoal ? "Edit Goal" : "Add New Goal"}
                </h3>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Goal name"
                    value={goalForm.name}
                    onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                    className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-sky-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Target amount"
                    value={goalForm.target}
                    onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                    className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-sky-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Saved amount"
                    value={goalForm.saved}
                    onChange={(e) => setGoalForm({ ...goalForm, saved: e.target.value })}
                    className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-sky-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGoal}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
