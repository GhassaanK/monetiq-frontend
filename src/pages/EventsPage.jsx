import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, List, User, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/common/Toast";
import { api } from "../api/client";
import { fmtCurrency, fmtDate } from "../utils/format";

export default function EventsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", budget: "", date: "" });
  const [editEvent, setEditEvent] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventExpenses, setEventExpenses] = useState([]);
  const [showEventDrawer, setShowEventDrawer] = useState(false);

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
  });

  const [editExpenseId, setEditExpenseId] = useState(null);
  const [expenseSaveLoading, setExpenseSaveLoading] = useState(false);

  useEffect(() => {
    api
      .get("/api/events")
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        toast(
          "You have requested an unauthorized action, please refrain from doing that as the application is under development!",
          { type: "error" }
        );
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCreateEvent = async () => {
    setCreateError("");
    setCreateLoading(true);

    const payload = {
      name: newEvent.name.trim(),
      budget: Number(newEvent.budget),
      date: newEvent.date,
    };

    if (!payload.name || !Number.isFinite(payload.budget) || !payload.date) {
      setCreateError("Please provide valid name, budget and date.");
      setCreateLoading(false);
      return;
    }

    try {
      const saved = editEvent
        ? await api.put(`/api/events/${editEvent.id}`, payload)
        : await api.post("/api/events", payload);

      setEvents((prev) =>
        editEvent
          ? prev.map((e) => (e.id === saved.id ? saved : e))
          : [...prev, saved]
      );

      toast(editEvent ? "Event updated" : "Event created", {
        type: "success",
      });

      setShowCreate(false);
      setEditEvent(null);
      setNewEvent({ name: "", budget: "", date: "" });
    } catch (err) {
      setCreateError(err.message || "Network error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await api.del(`/api/events/${id}`);
      setEvents((p) => p.filter((e) => e.id !== id));
      toast("Event deleted", { type: "success" });
    } catch {
      toast("Failed to delete event", { type: "error" });
    }
  };

  const handleOpenEditEvent = (evt) => {
    setEditEvent(evt);
    setNewEvent({
      name: evt.name || "",
      budget: evt.budget || "",
      date: evt.date || "",
    });
    setShowCreate(true);
  };

  const openEvent = async (evt) => {
    setSelectedEvent(evt);
    setShowEventDrawer(true);

    try {
      const list = await api.get(`/api/events/${evt.id}/expenses`);
      setEventExpenses(Array.isArray(list) ? list : []);
    } catch {
      toast("Failed to load expenses", { type: "error" });
    }
  };

  const handleAddEventExpense = async () => {
    if (!selectedEvent) return;

    const payload = {
      title: newExpense.title.trim(),
      amount: Number(newExpense.amount),
      category: newExpense.category || "",
      date: newExpense.date,
    };

    if (!payload.title || !Number.isFinite(payload.amount) || !payload.date)
      return;

    setExpenseSaveLoading(true);

    try {
      if (editExpenseId) {
        const updated = await api.put(
          `/api/events/expenses/${editExpenseId}`,
          payload
        );

        setEventExpenses((p) =>
          p.map((x) => (x.id === updated.id ? updated : x))
        );
      } else {
        const created = await api.post(
          `/api/events/${selectedEvent.id}/expenses`,
          payload
        );
        setEventExpenses((p) => [...p, created]);
      }

      setNewExpense({ title: "", amount: "", date: "", category: "" });
      setEditExpenseId(null);
      toast("Expense saved", { type: "success" });
    } catch {
      toast("Failed to save expense", { type: "error" });
    } finally {
      setExpenseSaveLoading(false);
    }
  };

  const handleStartEditExpense = (ex) => {
    setEditExpenseId(ex.id);
    setNewExpense({
      title: ex.title || "",
      amount: ex.amount || "",
      date: ex.date || "",
      category: ex.category || "",
    });
  };

  const handleDeleteEventExpense = async (expenseId) => {
    try {
      await api.del(`/api/events/expenses/${expenseId}`);
      setEventExpenses((p) => p.filter((x) => x.id !== expenseId));
      toast("Expense deleted", { type: "success" });
    } catch {
      toast("Failed to delete expense", { type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090a0c] via-[#121315] to-[#090a0c] text-gray-100 px-4 py-6 sm:px-8 md:px-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Events
          </h2>
          <p className="text-gray-400 text-sm">
            Create events, track budgets and event-specific expenses.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((evt) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-900/60 border border-gray-800 rounded-2xl"
            >
              <h3 className="text-lg font-semibold">{evt.name}</h3>
              <p className="text-gray-400 text-sm">
                {fmtDate(evt.date)} • Budget {fmtCurrency(evt.budget)}
              </p>
              <p className="text-gray-400 text-sm">
                Total expenses {fmtCurrency(evt.totalExpense || 0)}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEvent(evt)}
                  className="px-3 py-1 rounded-md bg-gray-800/40"
                >
                  View
                </button>
                <button
                  onClick={() => handleOpenEditEvent(evt)}
                  className="px-3 py-1 rounded-md bg-gray-800/40"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(evt.id)}
                  className="px-3 py-1 rounded-md bg-gray-800/30 text-rose-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showEventDrawer && selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-gray-900 p-6 rounded-xl w-full max-w-3xl">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar size={16} /> {selectedEvent.name}
                </h3>
                <button
                  onClick={() => setShowEventDrawer(false)}
                  className="px-3 py-1 bg-gray-700 rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3">
                {eventExpenses.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex justify-between items-start bg-gray-800/50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{ex.title}</p>
                      <p className="text-xs text-gray-400">
                        {fmtDate(ex.date)} • {ex.category}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span>{fmtCurrency(ex.amount)}</span>
                      <button onClick={() => handleStartEditExpense(ex)}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEventExpense(ex.id)}
                        className="text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={newExpense.title}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, title: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-700"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-700"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-700"
                />
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-700"
                />

                <button
                  onClick={handleAddEventExpense}
                  disabled={expenseSaveLoading}
                  className="w-full px-3 py-2 rounded-lg bg-emerald-500 text-white"
                >
                  {editExpenseId ? "Save Expense" : "Add Expense"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
              <h3 className="text-lg font-semibold mb-3">
                {editEvent ? "Edit Event" : "Create Event"}
              </h3>

              <input
                type="text"
                placeholder="Name"
                value={newEvent.name}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, name: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-gray-700 mb-2"
              />

              <input
                type="number"
                placeholder="Budget"
                value={newEvent.budget}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, budget: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-gray-700 mb-2"
              />

              <input
                type="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-gray-700 mb-2"
              />

              {createError && (
                <p className="text-sm text-rose-400">{createError}</p>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-2 bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={createLoading}
                  className="px-3 py-2 bg-emerald-500 text-white rounded-lg"
                >
                  {createLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
