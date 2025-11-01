import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard"); // temporary redirect after login/signup
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-pink-500 via-purple-600 to-blue-500 opacity-20 blur-3xl animate-pulse" />
      </div>

      {/* 3D Card Container */}
      <motion.div
        className="relative z-10 w-[400px] min-h-[540px] [transform-style:preserve-3d]"
        animate={{ rotateY: isSignUp ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
      >
        {/* LOGIN SIDE */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-gray-700 bg-gray-900/60 p-8 backdrop-blur-xl shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="flex flex-col items-center space-y-2 mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                <Lock size={28} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
              <p className="text-gray-400 text-sm">Sign in to continue to MONETIQ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-indigo-500/25"
              >
                Sign In
              </motion.button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Sign up
            </button>
          </p>
        </motion.div>

        {/* SIGNUP SIDE */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-gray-700 bg-gray-900/60 p-8 backdrop-blur-xl shadow-2xl rotate-y-180"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <div className="flex flex-col items-center space-y-2 mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg">
                <UserPlus size={28} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
              <p className="text-gray-400 text-sm">Join MONETIQ in seconds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm text-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none transition-all duration-200"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-pink-500/25"
              >
                Sign Up
              </motion.button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="text-pink-400 hover:text-pink-300 font-medium"
            >
              Login
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
