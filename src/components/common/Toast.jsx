import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type: opts.type || "info" };
    setToasts((t) => [toast, ...t]);
    const timeout = opts.duration ?? 4500;
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  // expose a simple global hook for non-react modules to show toasts
  React.useEffect(() => {
    window.__SHOW_TOAST__ = (msg, opts) => showToast(msg, opts);
    return () => { window.__SHOW_TOAST__ = null; };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-2 rounded-lg shadow-lg text-sm text-white flex items-center gap-3 transition transform origin-bottom-right
              ${t.type === "error" ? "bg-rose-500" : t.type === "success" ? "bg-emerald-500" : "bg-gray-800"}`}
          >
            <div className="flex-1">{t.message}</div>
            <button onClick={() => removeToast(t.id)} className="text-white/80 hover:text-white">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.showToast;
}

export default ToastProvider;
