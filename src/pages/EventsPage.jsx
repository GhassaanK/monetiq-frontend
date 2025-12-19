import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, List, User, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/common/Toast";
import { api } from "../api/client";
import { fmtCurrency, fmtDate } from "../utils/format";

const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_BACKEND) || "";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : null;
};

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

  const [newExpense, setNewExpense] = useState({ title: "", amount: "", date: "", category: "" });
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [expenseSaveLoading, setExpenseSaveLoading] = useState(false);

  useEffect(() => {
    const headers = authHeaders();
    if (!headers) {
      navigate("/");
      return;
    }

    api.get('/api/events')
      .then((data) => setEvents(data || []))
      .catch(() => toast("You have requested an unauthorized action, please refrain from doing that as the application is under development!", { type: "error" }))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCreateEvent = async () => {
    setCreateError("");
    setCreateLoading(true);
    const headers = authHeaders();
    if (!headers) {
      setCreateLoading(false);
      navigate("/");
      return;
    }
    const payload = { name: newEvent.name, budget: Number(newEvent.budget), date: newEvent.date };
    if (!payload.name || !Number.isFinite(payload.budget) || !payload.date) {
      setCreateError("Please provide valid name, budget and date.");
      setCreateLoading(false);
      return;
    }

    console.debug(editEvent ? "Updating event" : "Creating event", { url, headers, payload });
    try {
      try {
        const saved = editEvent ? await api.put(`/api/events/${editEvent.id}`, payload) : await api.post('/api/events', payload);
        if (editEvent) {
          setEvents((p) => p.map((e) => (e.id === saved.id ? saved : e)));
          toast("Event updated", { type: "success" });
        } else {
          setEvents((p) => [...p, saved]);
          toast("Event created", { type: "success" });
        }
      } catch (err) {
        console.error('Save event error', err);
        setCreateError(err.message || 'Network error');
      }
      setNewEvent({ name: "", budget: "", date: "" });
      setShowCreate(false);
      setEditEvent(null);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    const token = localStorage.getItem("token");
    const url = API_BASE ? `${API_BASE}/api/events/${id}` : `/api/events/${id}`;
    await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setEvents((p) => p.filter((e) => e.id !== id));
    toast("Event deleted", { type: "success" });
  };

  const handleOpenEditEvent = (evt) => {
    setEditEvent(evt);
    setNewEvent({ name: evt.name || "", budget: evt.budget || "", date: evt.date || "" });
    setShowCreate(true);
  };

  const openEvent = async (evt) => {
    setSelectedEvent(evt);
    setShowEventDrawer(true);
    const headers = authHeaders();
    if (!headers) return navigate("/");
    const url = API_BASE ? `${API_BASE}/api/events/${evt.id}/expenses` : `/api/events/${evt.id}/expenses`;
    const res = await fetch(url, { headers });
    if (res.status === 401) {
      toast("You have requested an unauthorized action, please refrain from doing that as the application is under development!", { type: "error" });
      return;
    }
    const list = await res.json();
    setEventExpenses(list || []);
  };

  const handleAddEventExpense = async () => {
    if (!selectedEvent) return;
    const headers = authHeaders();
    if (!headers) return navigate("/");
    const url = API_BASE ? `${API_BASE}/api/events/${selectedEvent.id}/expenses` : `/api/events/${selectedEvent.id}/expenses`;
    const payload = {
      title: newExpense.title,
      amount: Number(newExpense.amount),
      category: newExpense.category || "",
      date: newExpense.date,
    };

    if (!payload.title || !Number.isFinite(payload.amount) || !payload.date) return;

    // If editing an existing expense, attempt PUT to the event-expense endpoint
    if (editExpenseId) {
      setExpenseSaveLoading(true);
      const putUrl = API_BASE ? `${API_BASE}/api/events/expenses/${editExpenseId}` : `/api/events/expenses/${editExpenseId}`;
      try {
        const res = await fetch(putUrl, { method: "PUT", headers, body: JSON.stringify(payload) });
        if (res.status === 401) {
          toast("You have requested an unauthorized action, please refrain from doing that as the application is under development!", { type: "error" });
          return;
        }
        if (res.ok) {
          const updated = await res.json();
          setEventExpenses((p) => p.map((x) => (x.id === updated.id ? updated : x)));
          setNewExpense({ title: "", amount: "", date: "", category: "" });
          setEditExpenseId(null);
          return;
        }

        // PUT not supported or failed — attempt fallback: delete then re-create
        const txt = await res.text().catch(() => "");
        console.warn("PUT expense failed, falling back to delete+post", res.status, txt);
        // delete existing
        const delUrl = API_BASE ? `${API_BASE}/api/events/expenses/${editExpenseId}` : `/api/events/expenses/${editExpenseId}`;
        const delRes = await fetch(delUrl, { method: "DELETE", headers });
        if (delRes.status === 401) {
          toast("You have requested an unauthorized action, please refrain from doing that as the application is under development!", { type: "error" });
          return;
        }
        // remove locally
        setEventExpenses((p) => p.filter((x) => x.id !== editExpenseId));
        // create new
        const createRes = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
        if (createRes.status === 401) {
          toast("You have requested an unauthorized action, please refrain from doing that as the application is under development!", { type: "error" });
          return;
        }
        if (!createRes.ok) {
          const errTxt = await createRes.text().catch(() => "");
          console.error("Fallback create after delete failed", createRes.status, errTxt);
        } else {
          const created = await createRes.json();
          setEventExpenses((p) => [...p, created]);
        }
        setNewExpense({ title: "", amount: "", date: "", category: "" });
        setEditExpenseId(null);
        return;
      } catch (err) {
        console.error("Update expense error", err);
      } finally {
        setExpenseSaveLoading(false);
      }
      // ensure state reset
      setEditExpenseId(null);
      setNewExpense({ title: "", amount: "", date: "", category: "" });
      return;
    }

    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
    if (res.status === 401) {
      toast("You have requested an unauthorized action, please refrain from doing that as the application is under development!", { type: "error" });
      return;
    }
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      toast(`Failed to add expense: ${txt || res.status}`, { type: "error" });
      return;
    }
    const created = await res.json();
    setEventExpenses((p) => [...p, created]);
    setNewExpense({ title: "", amount: "", date: "", category: "" });
    toast("Expense added", { type: "success" });
  };

  const handleStartEditExpense = (ex) => {
    setEditExpenseId(ex.id);
    setNewExpense({ title: ex.title || "", amount: ex.amount || "", date: ex.date || "", category: ex.category || "" });
  };

  const handleDeleteEventExpense = async (expenseId) => {
    const token = localStorage.getItem("token");
    const url = API_BASE ? `${API_BASE}/api/events/expenses/${expenseId}` : `/api/events/expenses/${expenseId}`;
    await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setEventExpenses((p) => p.filter((x) => x.id !== expenseId));
    toast("Expense deleted", { type: "success" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090a0c] via-[#121315] to-[#090a0c] text-gray-100 px-4 py-6 sm:px-8 md:px-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Events</h2>
          <p className="text-gray-400 text-sm">Create events, track budgets and event-specific expenses.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow hover:scale-105 transform transition">
            <Plus size={16} /> New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-gray-400">No events yet. Create one to get started.</div>
        ) : (
          events.map((evt) => (
            <motion.div key={evt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-gray-900/60 border border-gray-800 rounded-2xl hover:shadow-lg hover:scale-105 transform transition cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{evt.name}</h3>
                  <p className="text-gray-400 text-sm">{evt.date} • <span className="font-medium">Budget:</span> ${evt.budget}</p>
                  <p className="text-gray-400 text-sm">Total expenses: ${evt.totalExpense ?? 0}</p>
                  <div className="mt-3">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: `${Math.min(100, Math.round(((evt.totalExpense || 0) / (evt.budget || 1)) * 100))}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{Math.min(100, Math.round(((evt.totalExpense || 0) / (evt.budget || 1)) * 100))}% of budget used</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => openEvent(evt)} className="px-3 py-1 rounded-md bg-gray-800/40 text-gray-200 hover:bg-gray-800/60">View</button>
                  <button onClick={() => handleDeleteEvent(evt.id)} className="px-3 py-1 rounded-md bg-gray-800/30 text-rose-300 hover:bg-rose-600/10">Delete</button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div className="fixed inset-0 flex items-center justify-center z-50 px-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-3">Create Event</h3>
              <div className="space-y-3">
                <label className="text-sm text-gray-300">Name</label>
                <input type="text" placeholder="Event name" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <label className="text-sm text-gray-300">Budget</label>
                <input type="number" placeholder="Budget" value={newEvent.budget} onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <label className="text-sm text-gray-300">Date</label>
                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                {createError && <p className="text-sm text-rose-400 mt-1">{createError}</p>}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowCreate(false)} className="px-3 py-2 rounded-lg bg-gray-700">Cancel</button>
                <button onClick={handleCreateEvent} disabled={createLoading} className={`px-3 py-2 rounded-lg text-white ${createLoading ? 'opacity-60 cursor-not-allowed bg-emerald-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
                  {createLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showEventDrawer && selectedEvent && (
          <motion.div className="fixed inset-0 flex items-end md:items-center justify-center z-50 px-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-6 w-full max-w-3xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2"><Calendar size={18} /> {selectedEvent.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedEvent.date} • Budget: ${selectedEvent.budget}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setShowEventDrawer(false); setSelectedEvent(null); }} className="px-3 py-2 bg-gray-700 rounded-lg">Close</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold mb-2">Expenses</h4>
                  <div className="space-y-3">
                    {eventExpenses.length === 0 ? (
                      <p className="text-gray-400">No expenses for this event yet.</p>
                    ) : (
                      eventExpenses.map((ex) => (
                        <div key={ex.id} className="p-3 bg-gray-800/50 rounded-lg flex items-start justify-between">
                          <div>
                            <p className="font-medium">{ex.title}</p>
                            <p className="text-gray-400 text-sm">{ex.date} • <span className="font-semibold">${ex.amount}</span> • <span className="text-sm text-gray-300">{ex.category}</span></p>
                          </div>
                          <div className="flex gap-2 items-start">
                            <button onClick={() => handleStartEditExpense(ex)} className="text-gray-300 hover:text-emerald-400 px-2 py-1 rounded-md">Edit</button>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded-md text-gray-200">${ex.amount}</span>
                            <button onClick={() => handleDeleteEventExpense(ex.id)} className="text-gray-400 hover:text-rose-500"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="md:col-span-1 bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Add Expense</h4>
                  <div className="space-y-2">
                    <input type="text" placeholder="Title" value={newExpense.title} onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })} className="w-full p-2 rounded-lg bg-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    <input type="text" placeholder="Category (e.g. Food)" value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} className="w-full p-2 rounded-lg bg-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    <input type="number" placeholder="Amount" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} className="w-full p-2 rounded-lg bg-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} className="w-full p-2 rounded-lg bg-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    <div className="flex gap-2">
                      <button onClick={handleAddEventExpense} disabled={expenseSaveLoading} className={`flex-1 px-3 py-2 rounded-lg text-white ${expenseSaveLoading ? 'opacity-60 cursor-not-allowed bg-emerald-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
                        {editExpenseId ? (expenseSaveLoading ? 'Saving...' : 'Save') : 'Add Expense'}
                      </button>
                      {editExpenseId && (
                        <button onClick={() => { setEditExpenseId(null); setNewExpense({ title: "", amount: "", date: "", category: "" }); }} className="px-3 py-2 rounded-lg bg-gray-700">Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}