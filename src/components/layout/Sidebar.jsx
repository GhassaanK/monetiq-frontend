import { Home, BarChart3, Settings, LogOut, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
    { name: "Settings", icon: Settings, path: "/Transactions" },
  ];

  return (
    <>
      {/* Backdrop for mobile only */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#0f0f10] via-[#141414] to-[#0f0f10] text-gray-200 border-r border-gray-800 p-4
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
            MONETIQ
          </h1>
          <button
            className="md:hidden text-gray-400 hover:text-gray-200"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={i}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500/20 to-violet-500/20 border border-sky-500/30 text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1d]/70"
                  }`
                }
              >
                <Icon size={18} className="text-sky-400" />
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout button pinned to bottom */}
        <div className="pt-4 border-t border-gray-800">
          <button className="flex items-center gap-3 w-full text-sm text-gray-400 hover:text-red-400 transition-colors duration-200">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
