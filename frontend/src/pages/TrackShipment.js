import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiSearch,
    FiPackage,
    FiMapPin,
    FiCalendar,
    FiAlertCircle,
    FiArrowRight,
    FiClock,
    FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { quoteAPI } from "../services/api";

const TrackShipment = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedQuote, setSelectedQuote] = useState(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchQuotes();
        } else if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [user, isAuthenticated, navigate]);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            setError("");
            console.log("Fetching quotes for tracking");
            const response = await quoteAPI.getMyQuotes();
            console.log("Quotes response:", response.data);
            if (response.data.data) {
                setQuotes(response.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch quotes:", err);
            setError(err.response?.data?.message || "Failed to load quotes");
        } finally {
            setLoading(false);
        }
    };

    const handleTrackQuote = (quoteId) => {
        navigate(`/quote-tracking/${quoteId}`);
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            reviewing: "bg-blue-100 text-blue-800 border-blue-300",
            quoted: "bg-purple-100 text-purple-800 border-purple-300",
            accepted: "bg-indigo-100 text-indigo-800 border-indigo-300",
            completed: "bg-green-100 text-green-800 border-green-300",
            rejected: "bg-red-100 text-red-800 border-red-300",
            cancelled: "bg-gray-100 text-gray-800 border-gray-300",
        };
        return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: FiClock,
            reviewing: FiSearch,
            quoted: FiPackage,
            accepted: FiCheckCircle,
            completed: FiCheckCircle,
            rejected: FiAlertCircle,
            cancelled: FiAlertCircle,
        };
        return icons[status] || FiPackage;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading your shipments...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Track Your Shipment
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl">
                        Monitor the status of your moving quotes and track your shipment in real-time
                    </p>
                </motion.div>

                {/* Error Message */}
                {error && !isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg flex items-center mb-8"
                    >
                        <FiAlertCircle className="mr-3 flex-shrink-0" />
                        Please login to track your shipments
                    </motion.div>
                )}

                {/* Main Content */}
                {isAuthenticated && (
                    <>
                        {quotes.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Quotes List */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                                        <h2 className="text-2xl font-bold flex items-center">
                                            <FiPackage className="mr-3" />
                                            Your Shipments ({quotes.length})
                                        </h2>
                                    </div>

                                    <div className="divide-y max-h-[600px] overflow-y-auto">
                                        {quotes.map((quote) => {
                                            const StatusIcon = getStatusIcon(quote.status);
                                            return (
                                                <motion.div
                                                    key={quote._id}
                                                    whileHover={{ backgroundColor: "#f9fafb" }}
                                                    onClick={() => setSelectedQuote(quote)}
                                                    className={`p-5 cursor-pointer transition-all border-l-4 ${selectedQuote?._id === quote._id
                                                            ? "bg-primary/5 border-l-primary"
                                                            : "bg-white border-l-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <p className="font-bold text-gray-800 text-lg">
                                                                {quote.quoteId}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(quote.createdAt)}
                                                            </p>
                                                        </div>
                                                        <StatusIcon className="text-primary text-xl flex-shrink-0" />
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="text-sm text-gray-600 flex items-center mb-1">
                                                            <FiMapPin className="mr-1" size={14} />
                                                            {quote.fromCity} → {quote.toCity}
                                                        </p>
                                                        {quote.moveDate && (
                                                            <p className="text-sm text-gray-600 flex items-center">
                                                                <FiCalendar className="mr-1" size={14} />
                                                                {formatDate(quote.moveDate)}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                                            quote.status
                                                        )}`}
                                                    >
                                                        {quote.status.replace("_", " ").toUpperCase()}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Selected Quote Details */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    {selectedQuote ? (
                                        <motion.div
                                            key={selectedQuote._id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white rounded-xl shadow-lg p-6"
                                        >
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-2xl font-bold text-gray-800">
                                                        {selectedQuote.quoteId}
                                                    </h3>
                                                    <span
                                                        className={`px-4 py-2 rounded-full font-semibold text-sm border ${getStatusColor(
                                                            selectedQuote.status
                                                        )}`}
                                                    >
                                                        {selectedQuote.status.replace("_", " ").toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">
                                                    Submitted: {formatDate(selectedQuote.createdAt)}
                                                </p>
                                            </div>

                                            <div className="space-y-4 mb-6">
                                                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                                                    <FiMapPin className="text-primary text-xl flex-shrink-0 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">From</p>
                                                        <p className="font-semibold text-gray-800">
                                                            {selectedQuote.fromCity}
                                                        </p>
                                                        {selectedQuote.fromAddress && (
                                                            <p className="text-sm text-gray-600">
                                                                {selectedQuote.fromAddress}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                                                    <FiMapPin className="text-green-500 text-xl flex-shrink-0 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">To</p>
                                                        <p className="font-semibold text-gray-800">
                                                            {selectedQuote.toCity}
                                                        </p>
                                                        {selectedQuote.toAddress && (
                                                            <p className="text-sm text-gray-600">
                                                                {selectedQuote.toAddress}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {selectedQuote.moveDate && (
                                                    <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                                                        <FiCalendar className="text-purple-500 text-xl flex-shrink-0 mt-1" />
                                                        <div>
                                                            <p className="text-sm text-gray-600 mb-1">Moving Date</p>
                                                            <p className="font-semibold text-gray-800">
                                                                {formatDate(selectedQuote.moveDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {(selectedQuote.finalCost || selectedQuote.estimatedCost) && (
                                                    <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg">
                                                        <span className="text-amber-600 text-xl flex-shrink-0 font-bold">
                                                            ₹
                                                        </span>
                                                        <div>
                                                            <p className="text-sm text-gray-600 mb-1">Quote Amount</p>
                                                            <p className="font-semibold text-gray-800 text-xl">
                                                                {selectedQuote.finalCost
                                                                    ? `₹${selectedQuote.finalCost.toLocaleString()}`
                                                                    : selectedQuote.estimatedCost
                                                                        ? `Est. ₹${selectedQuote.estimatedCost.toLocaleString()}`
                                                                        : "Pending"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleTrackQuote(selectedQuote.quoteId)}
                                                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center group"
                                            >
                                                View Full Tracking
                                                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-white rounded-xl shadow-lg p-12 text-center"
                                        >
                                            <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500 text-lg">
                                                Select a shipment from the list to view details
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg p-12 text-center"
                            >
                                <FiPackage className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    No Shipments Yet
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    You haven't created any quotes yet. Get a free quote for your move!
                                </p>
                                <button
                                    onClick={() => navigate("/quote")}
                                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                                >
                                    Get Your First Quote
                                    <FiArrowRight className="ml-2" />
                                </button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TrackShipment;
