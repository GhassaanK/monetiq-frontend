import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../api/auth";
import { useToast } from "../components/common/Toast";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  const showToast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoadingSignup(true);
    try {
      const res = await signup(signupData);
      localStorage.setItem("token", res.token);
      showToast("Account created successfully", { type: "success" });
      navigate("/dashboard");
    } catch (err) {
      showToast(err.message || "Registration failed", { type: "error" });
    } finally {
      setLoadingSignup(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);
    try {
      const res = await login(loginData);
      localStorage.setItem("token", res.token);
      showToast("Logged in successfully", { type: "success" });
      navigate("/dashboard");
    } catch (err) {
      showToast(err.message || "Login failed", { type: "error" });
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* global toasts handled by ToastProvider */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-pink-500 via-purple-600 to-blue-500 opacity-20 blur-3xl animate-pulse" />
      </div>

      <motion.div
        className="relative z-10 w-[400px] min-h-[540px] [transform-style:preserve-3d]"
        animate={{ rotateY: isSignUp ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
      >
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

            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />

              <motion.button
                disabled={loadingLogin}
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 font-semibold flex items-center justify-center gap-2"
              >
                {loadingLogin && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Sign In
              </motion.button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="text-indigo-400"
            >
              Sign up
            </button>
          </p>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-gray-700 bg-gray-900/60 p-8 backdrop-blur-xl shadow-2xl"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="flex flex-col items-center space-y-2 mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg">
                <UserPlus size={28} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
              <p className="text-gray-400 text-sm">Join MONETIQ in seconds</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />

              <motion.button
                disabled={loadingSignup}
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold flex items-center justify-center gap-2"
              >
                {loadingSignup && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Sign Up
              </motion.button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="text-pink-400"
            >
              Login
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
