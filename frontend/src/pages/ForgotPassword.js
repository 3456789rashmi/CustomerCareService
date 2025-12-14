import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiMail,
    FiLock,
    FiArrowRight,
    FiAlertCircle,
    FiCheckCircle,
    FiCode,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";
import { authAPI } from "../services/api";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code and new password
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});

    const validateStep1 = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!resetCode) {
            newErrors.resetCode = "Reset code is required";
        } else if (resetCode.length !== 6) {
            newErrors.resetCode = "Reset code must be 6 digits";
        }
        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            newErrors.newPassword =
                "Password must contain uppercase, lowercase, and number";
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRequestCode = async (e) => {
        e.preventDefault();
        if (validateStep1()) {
            setIsLoading(true);
            setApiError("");
            setSuccessMessage("");

            try {
                const response = await authAPI.forgotPassword(email);
                if (response.data.success) {
                    setSuccessMessage(response.data.message);
                    setTimeout(() => {
                        setStep(2);
                        setSuccessMessage("");
                    }, 1500);
                }
            } catch (err) {
                setApiError(
                    err.response?.data?.message || "Failed to send reset code"
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (validateStep2()) {
            setIsLoading(true);
            setApiError("");
            setSuccessMessage("");

            try {
                const response = await authAPI.resetPassword({
                    email,
                    resetCode,
                    newPassword,
                });
                if (response.data.success) {
                    setSuccessMessage(response.data.message);
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                }
            } catch (err) {
                setApiError(
                    err.response?.data?.message || "Failed to reset password"
                );
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
            </div>

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary px-8 py-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-white/80 text-sm">
                            {step === 1
                                ? "Enter your email to receive a reset code"
                                : "Enter the code and your new password"}
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="px-8 py-8">
                        {/* Error Message */}
                        {apiError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center"
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
                                className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center"
                            >
                                <FiCheckCircle className="mr-2 flex-shrink-0" />
                                <span className="text-sm">{successMessage}</span>
                            </motion.div>
                        )}

                        {/* Step 1: Request Code */}
                        {step === 1 && (
                            <form onSubmit={handleRequestCode} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors({ ...errors, email: "" });
                                                setApiError("");
                                            }}
                                            className={`w-full pl-12 pr-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"
                                                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: "0 10px 30px rgba(59, 10, 69, 0.3)",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Code"}
                                    <FiArrowRight />
                                </motion.button>
                            </form>
                        )}

                        {/* Step 2: Reset Password */}
                        {step === 2 && (
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                {/* Reset Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reset Code
                                    </label>
                                    <div className="relative">
                                        <FiCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            maxLength="6"
                                            value={resetCode}
                                            onChange={(e) => {
                                                setResetCode(e.target.value.replace(/\D/g, ""));
                                                if (errors.resetCode)
                                                    setErrors({ ...errors, resetCode: "" });
                                                setApiError("");
                                            }}
                                            className={`w-full pl-12 pr-4 py-3 border ${errors.resetCode ? "border-red-500" : "border-gray-300"
                                                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center text-2xl tracking-widest`}
                                            placeholder="000000"
                                        />
                                    </div>
                                    {errors.resetCode && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.resetCode}
                                        </p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                if (errors.newPassword)
                                                    setErrors({ ...errors, newPassword: "" });
                                                setApiError("");
                                            }}
                                            className={`w-full pl-12 pr-12 py-3 border ${errors.newPassword ? "border-red-500" : "border-gray-300"
                                                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.newPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                if (errors.confirmPassword)
                                                    setErrors({ ...errors, confirmPassword: "" });
                                                setApiError("");
                                            }}
                                            className={`w-full pl-12 pr-12 py-3 border ${errors.confirmPassword
                                                ? "border-red-500"
                                                : "border-gray-300"
                                                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: "0 10px 30px rgba(59, 10, 69, 0.3)",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                    <FiArrowRight />
                                </motion.button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        setResetCode("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                        setErrors({});
                                    }}
                                    className="w-full text-primary hover:text-secondary font-medium py-2"
                                >
                                    Back
                                </button>
                            </form>
                        )}

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 text-sm">
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className="text-primary hover:text-secondary font-semibold"
                                >
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
