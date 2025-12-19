import { motion } from "framer-motion";
import { Bell, Search, Menu } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../common/Toast";

export default function Navbar({ toggleSidebar }) {
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to MONETIQ — get started by adding a transaction.", read: false },
  ]);
  const nav = useNavigate();
  const toast = useToast();
  const searchRef = useRef(null);
  return (
    <header className="h-16 bg-gradient-to-r from-[#0f0f10] via-[#141414] to-[#0f0f10] border-b border-gray-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Left — Hamburger + Title */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 rounded-lg hover:bg-[#1a1a1d]/70 text-gray-300"
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-lg md:text-xl font-semibold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent"
        >
          Dashboard
        </motion.h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search — hidden on small screens */}
        <div className="relative hidden sm:block">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = (query || "").trim();
              // If empty search, show all transactions (navigate without q)
              if (!q) {
                setQuery("");
                nav(`/transactions`);
                return;
              }
              nav(`/transactions?q=${encodeURIComponent(q)}`);
            }}
          >
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search transactions..."
              className="bg-[#1a1a1d]/80 text-gray-100 rounded-lg pl-9 pr-10 py-1.5 text-sm border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all duration-200 placeholder-gray-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-sky-600/20"
            >
              <Search size={14} />
            </button>
            <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
          </form>
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications((s) => !s)}
            className="relative p-2 rounded-lg hover:bg-[#1a1a1d]/70 transition-colors"
            aria-expanded={showNotifications}
          >
            <Bell size={19} className="text-gray-200" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
            )}
          </motion.button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-3 z-50">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">Notifications</div>
                <button
                  onClick={() => {
                    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
                    toast("All notifications marked read", { type: "info" });
                  }}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Mark all
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {notifications.length === 0 && <div className="text-sm text-gray-400">No notifications</div>}
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2 rounded-md mb-1 ${n.read ? 'bg-gray-800' : 'bg-gray-800/60'}`}>
                    <div className="text-sm text-gray-200">{n.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative">
          <motion.div whileHover={{ scale: 1.07 }} className="hidden sm:flex items-center gap-2 cursor-pointer" onClick={() => setShowUserMenu((s) => !s)}>
            <img
              src={`https://api.dicebear.com/9.x/identicon/svg?seed=monetiq`}
              alt="user avatar"
              className="w-8 h-8 rounded-full border border-sky-600/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
            />
            <div className="text-sm font-medium text-gray-200">👋 Welcome!</div>
          </motion.div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-2 z-50">
              <button
                onClick={() => { setShowUserMenu(false); nav('/profile'); }}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 text-sm text-gray-200"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  localStorage.removeItem('token');
                  toast('Logged out', { type: 'info' });
                  nav('/');
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 text-sm text-rose-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
