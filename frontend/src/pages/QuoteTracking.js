import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiArrowLeft,
    FiMapPin,
    FiCalendar,
    FiTruck,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiDollarSign,
    FiPhone,
    FiMail,
    FiPackage,
    FiHome,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { quoteAPI } from "../services/api";

const QuoteTracking = () => {
    const { quoteId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        } else {
            fetchQuoteDetails();
        }
    }, [user, navigate, quoteId]);

    const fetchQuoteDetails = async () => {
        try {
            setLoading(true);
            setError("");
            console.log("Fetching quote details for:", quoteId);
            const response = await quoteAPI.getQuoteDetail(quoteId);
            console.log("Quote details response:", response.data);
            if (response.data.success && response.data.data) {
                setQuote(response.data.data);
            } else {
                setError("Invalid quote data received");
            }
        } catch (err) {
            console.error("Failed to fetch quote details:", err);
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Failed to load quote details";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: "bg-yellow-100 text-yellow-800",
            reviewing: "bg-blue-100 text-blue-800",
            quoted: "bg-purple-100 text-purple-800",
            accepted: "bg-indigo-100 text-indigo-800",
            rejected: "bg-red-100 text-red-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-gray-100 text-gray-800",
        };
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusSteps = () => {
        const steps = [
            { status: "pending", label: "Submitted", icon: FiClock },
            { status: "reviewing", label: "Under Review", icon: FiAlertCircle },
            { status: "quoted", label: "Quote Ready", icon: FiDollarSign },
            { status: "accepted", label: "Accepted", icon: FiCheckCircle },
            { status: "completed", label: "Completed", icon: FiCheckCircle },
        ];
        return steps;
    };

    const getStatusIndex = (status) => {
        const statusOrder = [
            "pending",
            "reviewing",
            "quoted",
            "accepted",
            "completed",
        ];
        return statusOrder.indexOf(status);
    };

    const isCancelled = quote?.status === "cancelled";
    const isRejected = quote?.status === "rejected";

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading quote details...</p>
                </div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="min-h-screen bg-neutral py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <FiAlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500 opacity-50" />
                        <p className="text-xl text-gray-600 mb-4">{error || "Quote not found"}</p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back to Dashboard
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    const statusSteps = getStatusSteps();
    const currentStatusIndex = getStatusIndex(quote.status);

    return (
        <div className="min-h-screen bg-neutral py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center text-primary hover:text-secondary font-semibold mb-6 transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                Quote #{quote.quoteId}
                            </h1>
                            <p className="text-gray-600">
                                Submitted on {formatDate(quote.createdAt)}
                            </p>
                        </div>
                        <span
                            className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                                quote.status
                            )}`}
                        >
                            {quote.status.replace("_", " ").toUpperCase()}
                        </span>
                    </div>
                </motion.div>

                {/* Status Progress */}
                {!isCancelled && !isRejected && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-8">
                            Quote Progress
                        </h2>

                        <div className="flex items-center justify-between">
                            {statusSteps.map((step, index) => {
                                const isActive = index <= currentStatusIndex;
                                const isCompleted = index < currentStatusIndex;
                                const StepIcon = step.icon;

                                return (
                                    <React.Fragment key={step.status}>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex flex-col items-center flex-1"
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${isActive
                                                        ? isCompleted
                                                            ? "bg-green-500 text-white"
                                                            : "bg-primary text-white ring-4 ring-primary/20"
                                                        : "bg-gray-200 text-gray-400"
                                                    }`}
                                            >
                                                <StepIcon className="text-xl" />
                                            </div>
                                            <p
                                                className={`text-sm font-semibold text-center ${isActive ? "text-gray-800" : "text-gray-400"
                                                    }`}
                                            >
                                                {step.label}
                                            </p>
                                        </motion.div>

                                        {index < statusSteps.length - 1 && (
                                            <div
                                                className={`flex-1 h-1 mx-2 transition-all ${isCompleted ? "bg-green-500" : "bg-gray-200"
                                                    }`}
                                                style={{ marginBottom: "2rem" }}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Cancellation/Rejection Notice */}
                {(isCancelled || isRejected) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl p-6 mb-8 ${isCancelled
                                ? "bg-gray-100 border-2 border-gray-300"
                                : "bg-red-50 border-2 border-red-300"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <FiAlertCircle
                                className={`text-3xl flex-shrink-0 ${isCancelled ? "text-gray-600" : "text-red-600"
                                    }`}
                            />
                            <div>
                                <h3
                                    className={`text-xl font-bold mb-2 ${isCancelled ? "text-gray-800" : "text-red-800"
                                        }`}
                                >
                                    {isCancelled ? "Quote Cancelled" : "Quote Rejected"}
                                </h3>
                                <p
                                    className={`${isCancelled ? "text-gray-700" : "text-red-700"
                                        }`}
                                >
                                    {quote.adminNotes ||
                                        (isCancelled
                                            ? "This quote has been cancelled."
                                            : "This quote has been rejected. Please submit a new quote for different requirements.")}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Quote Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Moving Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* From Location */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <FiHome className="text-primary mr-2" />
                                Pickup Location
                            </h3>
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">City</p>
                                    <p className="font-semibold text-gray-800">{quote.fromCity}</p>
                                </div>
                                {quote.fromAddress && (
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-semibold text-gray-800">
                                            {quote.fromAddress}
                                        </p>
                                    </div>
                                )}
                                {quote.floorFrom !== undefined && (
                                    <div>
                                        <p className="text-sm text-gray-600">Floor</p>
                                        <p className="font-semibold text-gray-800">
                                            {quote.floorFrom === 0
                                                ? "Ground Floor"
                                                : `${quote.floorFrom}${quote.floorFrom === 1
                                                    ? "st"
                                                    : quote.floorFrom === 2
                                                        ? "nd"
                                                        : quote.floorFrom === 3
                                                            ? "rd"
                                                            : "th"
                                                } Floor`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* To Location */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <FiTruck className="text-green-500 mr-2" />
                                Drop Location
                            </h3>
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">City</p>
                                    <p className="font-semibold text-gray-800">{quote.toCity}</p>
                                </div>
                                {quote.toAddress && (
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-semibold text-gray-800">
                                            {quote.toAddress}
                                        </p>
                                    </div>
                                )}
                                {quote.floorTo !== undefined && (
                                    <div>
                                        <p className="text-sm text-gray-600">Floor</p>
                                        <p className="font-semibold text-gray-800">
                                            {quote.floorTo === 0
                                                ? "Ground Floor"
                                                : `${quote.floorTo}${quote.floorTo === 1
                                                    ? "st"
                                                    : quote.floorTo === 2
                                                        ? "nd"
                                                        : quote.floorTo === 3
                                                            ? "rd"
                                                            : "th"
                                                } Floor`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Move Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Move Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Move Date</p>
                            <p className="font-semibold text-gray-800 flex items-center">
                                <FiCalendar className="text-primary mr-2" />
                                {formatDate(quote.moveDate)}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Move Type</p>
                            <p className="font-semibold text-gray-800 capitalize">
                                {quote.moveType.replace("_", " ")}
                            </p>
                        </div>

                        {quote.propertyType && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Property Type</p>
                                <p className="font-semibold text-gray-800">
                                    {quote.propertyType.toUpperCase()}
                                </p>
                            </div>
                        )}

                        {(quote.packingRequired ||
                            quote.unpackingRequired ||
                            quote.storageRequired ||
                            quote.insuranceRequired) && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Additional Services</p>
                                    <div className="space-y-1">
                                        {quote.packingRequired && (
                                            <p className="text-sm font-semibold text-gray-800">
                                                ✓ Packing Required
                                            </p>
                                        )}
                                        {quote.unpackingRequired && (
                                            <p className="text-sm font-semibold text-gray-800">
                                                ✓ Unpacking Required
                                            </p>
                                        )}
                                        {quote.storageRequired && (
                                            <p className="text-sm font-semibold text-gray-800">
                                                ✓ Storage Required
                                            </p>
                                        )}
                                        {quote.insuranceRequired && (
                                            <p className="text-sm font-semibold text-gray-800">
                                                ✓ Insurance Required
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </motion.div>

                {/* Items Summary */}
                {quote.items && Object.values(quote.items).some((v) => v > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FiPackage className="text-primary mr-2" />
                            Items to Move
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            {quote.items.beds > 0 && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Beds</p>
                                    <p className="font-bold text-lg text-gray-800">
                                        {quote.items.beds}
                                    </p>
                                </div>
                            )}
                            {quote.items.sofas > 0 && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Sofas</p>
                                    <p className="font-bold text-lg text-gray-800">
                                        {quote.items.sofas}
                                    </p>
                                </div>
                            )}
                            {quote.items.tables > 0 && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Tables</p>
                                    <p className="font-bold text-lg text-gray-800">
                                        {quote.items.tables}
                                    </p>
                                </div>
                            )}
                            {quote.items.chairs > 0 && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Chairs</p>
                                    <p className="font-bold text-lg text-gray-800">
                                        {quote.items.chairs}
                                    </p>
                                </div>
                            )}
                            {quote.items.tvs > 0 && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">TVs/Electronics</p>
                                    <p className="font-bold text-lg text-gray-800">
                                        {quote.items.tvs}
                                    </p>
                                </div>
                            )}
                            {quote.items.appliances > 0 && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Appliances</p>
                                    <p className="font-bold text-lg text-gray-800">
                                        {quote.items.appliances}
                                    </p>
                                </div>
                            )}
                            {quote.items.boxes > 0 && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Packed Boxes</p>
                                    <p className="font-bold text-lg text-gray-800">
                                        {quote.items.boxes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Contact Information
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                            <FiMail className="text-primary text-xl" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold text-gray-800">{quote.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                            <FiPhone className="text-primary text-xl" />
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-semibold text-gray-800">{quote.phone}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Pricing Section */}
                {(quote.estimatedCost || quote.finalCost) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg p-8 text-white"
                    >
                        <h2 className="text-2xl font-bold mb-6">Quote Amount</h2>

                        <div className="space-y-4">
                            {quote.estimatedCost && (
                                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                                    <p className="text-lg">Estimated Cost:</p>
                                    <p className="text-2xl font-bold">
                                        ₹{quote.estimatedCost.toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {quote.finalCost && (
                                <div className="flex justify-between items-center pt-4">
                                    <p className="text-lg font-semibold">Final Quote Amount:</p>
                                    <p className="text-3xl font-bold">
                                        ₹{quote.finalCost.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Special Instructions */}
                {quote.specialInstructions && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-8 mt-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Special Instructions
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {quote.specialInstructions}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default QuoteTracking;
