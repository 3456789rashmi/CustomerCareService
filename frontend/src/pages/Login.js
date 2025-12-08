import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiUser,
  FiShield,
} from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

// Google Icon SVG Component (Original Google Colors)
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState("user"); // 'user' or 'admin'

  // Get redirect path from location state
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setApiError("");

      try {
        const result = await login(formData.email, formData.password);

        if (result.success) {
          // Check if login type matches user role
          const user = result.user;
          if (loginType === "admin" && user.role !== "admin") {
            setApiError("Access denied. You don't have admin privileges.");
            return;
          }
          setSuccessMessage("Login successful! Redirecting...");
          setTimeout(() => {
            // Redirect based on login type and user role
            if (user.role === "admin" && loginType === "admin") {
              navigate("/admin", { replace: true });
            } else {
              navigate(from, { replace: true });
            }
          }, 1000);
        } else {
          setApiError(result.error || "Login failed. Please try again.");
        }
      } catch (err) {
        setApiError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-light/10 rounded-full blur-2xl"
        />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-md w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <motion.img
              src="/unitedpackers.png"
              alt="Logo"
              className="w-14 h-14"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div>
              <span className="text-2xl font-extrabold text-white">United</span>
              <span className="text-2xl font-extrabold text-light">
                Packers
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back!
            </h2>
            <p className="text-gray-500 mt-2">
              Sign in to your account to continue
            </p>
          </motion.div>

          {/* Login Type Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-6"
          >
            <p className="text-sm font-medium text-gray-600 text-center mb-3">
              Login as
            </p>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setLoginType("user")}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  loginType === "user"
                    ? "bg-white text-primary shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiUser
                  className={`mr-2 ${
                    loginType === "user" ? "text-primary" : "text-gray-400"
                  }`}
                />
                User
              </button>
              <button
                type="button"
                onClick={() => setLoginType("admin")}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  loginType === "admin"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiShield
                  className={`mr-2 ${
                    loginType === "admin" ? "text-white" : "text-gray-400"
                  }`}
                />
                Admin
              </button>
            </div>
            {loginType === "admin" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-center text-purple-600 mt-2"
              >
                🔐 Admin access requires special privileges
              </motion.p>
            )}
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white"
            >
              <GoogleIcon />
              <span className="text-gray-700 font-medium">Google</span>
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white"
            >
              <FaFacebook className="text-blue-600 text-xl mr-2" />
              <span className="text-gray-700 font-medium">Facebook</span>
            </motion.button>
          </motion.div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* API Error Message */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center"
              >
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span className="text-sm">{apiError}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center"
              >
                <FiCheckCircle className="mr-2 flex-shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-secondary font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(59, 10, 69, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="relative flex items-center">
                  Sign In{" "}
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-gray-600"
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-secondary font-semibold hover:underline"
            >
              Create Account
            </Link>
          </motion.p>
        </motion.div>

        {/* Back to Home */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <Link
            to="/"
            className="text-white/80 hover:text-white transition-colors inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
