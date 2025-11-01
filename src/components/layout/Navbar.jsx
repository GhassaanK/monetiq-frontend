import { motion } from "framer-motion";
import { Bell, Search, Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
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
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#1a1a1d]/80 text-gray-100 rounded-lg pl-9 pr-3 py-1.5 text-sm border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all duration-200 placeholder-gray-500"
          />
          <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg hover:bg-[#1a1a1d]/70 transition-colors"
        >
          <Bell size={19} className="text-gray-200" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
        </motion.button>

        {/* Avatar */}
        <motion.div whileHover={{ scale: 1.07 }} className="hidden sm:flex items-center gap-2">
          <img
            src={`https://api.dicebear.com/9.x/identicon/svg?seed=monetiq`}
            alt="user avatar"
            className="w-8 h-8 rounded-full border border-sky-600/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
          />
          <div className="text-sm font-medium text-gray-200">👋 Welcome!</div>
        </motion.div>
      </div>
    </header>
  );
}
