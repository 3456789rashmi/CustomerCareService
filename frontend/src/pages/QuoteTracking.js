import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiArrowLeft,
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
    FiTrash2,
    FiStar,
    FiMessageSquare,
    FiCreditCard,
    FiSmartphone,
    FiCheck,
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [feedbackComment, setFeedbackComment] = useState("");
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [feedbackError, setFeedbackError] = useState("");
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);
    const [paymentData, setPaymentData] = useState({
        paymentMethod: "",
        cardNumber: "",
        cardHolderName: "",
        cardExpiry: "",
        cardCVV: "",
        upiId: "",
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        ifscCode: "",
    });
    const [paymentError, setPaymentError] = useState("");
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const paymentMethods = [
        { value: "credit_card", label: "Credit Card", icon: FiCreditCard, desc: "Visa, Mastercard, Rupay" },
        { value: "debit_card", label: "Debit Card", icon: FiCreditCard, desc: "All bank debit cards" },
        { value: "upi", label: "UPI / Online", icon: FiSmartphone, desc: "GPay, PhonePe, Paytm" },
        { value: "net_banking", label: "Net Banking", icon: FiDollarSign, desc: "All major banks" },
        { value: "cash", label: "Cash on Delivery", icon: FiDollarSign, desc: "Pay after service" },
    ];

    const fetchQuoteDetails = useCallback(async () => {
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
    }, [quoteId]);

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        } else {
            fetchQuoteDetails();
        }
    }, [user, navigate, quoteId, fetchQuoteDetails]);

    const handleDeleteQuote = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete quote ${quote.quoteId}? This action cannot be undone.`
        );

        if (!confirmDelete) {
            return;
        }

        setIsDeleting(true);

        try {
            await quoteAPI.deleteQuote(quote._id);
            alert("Quote deleted successfully");
            navigate("/dashboard", { replace: true });
        } catch (err) {
            alert(
                err.response?.data?.message || "Failed to delete quote. Please try again."
            );
            console.error("Delete quote error:", err);
            setIsDeleting(false);
        }
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        setIsSubmittingFeedback(true);
        setFeedbackError("");
        setFeedbackSuccess(false);

        try {
            if (feedbackRating === 0) {
                setFeedbackError("Please select a rating");
                setIsSubmittingFeedback(false);
                return;
            }

            const feedbackData = {
                quoteId: quote._id,
                rating: feedbackRating,
                comment: feedbackComment.trim(),
            };

            // Call API to submit feedback
            await quoteAPI.submitFeedback(feedbackData);

            setFeedbackSuccess(true);
            setFeedbackRating(0);
            setFeedbackComment("");

            // Refresh quote to get updated feedback
            setTimeout(() => {
                fetchQuoteDetails();
                setFeedbackSuccess(false);
            }, 2000);
        } catch (err) {
            console.error("Feedback submission error:", err);
            setFeedbackError(
                err.response?.data?.message || "Failed to submit feedback. Please try again."
            );
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const handlePaymentInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingPayment(true);
        setPaymentError("");
        setPaymentSuccess(false);

        try {
            // Validate payment method
            if (!paymentData.paymentMethod) {
                setPaymentError("Please select a preferred payment method");
                setIsSubmittingPayment(false);
                return;
            }

            // Validate payment details based on selected method
            if (paymentData.paymentMethod === "credit_card" || paymentData.paymentMethod === "debit_card") {
                if (!paymentData.cardHolderName || !paymentData.cardNumber || !paymentData.cardExpiry || !paymentData.cardCVV) {
                    setPaymentError("Please fill in all card details");
                    setIsSubmittingPayment(false);
                    return;
                }
                const cardDigits = paymentData.cardNumber.replace(/\s/g, "");
                if (cardDigits.length !== 16) {
                    setPaymentError("Card number must be 16 digits");
                    setIsSubmittingPayment(false);
                    return;
                }
                if (paymentData.cardCVV.length !== 3) {
                    setPaymentError("CVV must be 3 digits");
                    setIsSubmittingPayment(false);
                    return;
                }
            }

            if (paymentData.paymentMethod === "upi") {
                if (!paymentData.upiId) {
                    setPaymentError("Please enter your UPI ID");
                    setIsSubmittingPayment(false);
                    return;
                }
                if (!paymentData.upiId.includes("@")) {
                    setPaymentError("Invalid UPI ID format");
                    setIsSubmittingPayment(false);
                    return;
                }
            }

            if (paymentData.paymentMethod === "net_banking") {
                if (!paymentData.bankName || !paymentData.accountHolder || !paymentData.accountNumber || !paymentData.ifscCode) {
                    setPaymentError("Please fill in all net banking details");
                    setIsSubmittingPayment(false);
                    return;
                }
                if (!/^\d{9,18}$/.test(paymentData.accountNumber.trim())) {
                    setPaymentError("Account number must be 9-18 digits");
                    setIsSubmittingPayment(false);
                    return;
                }
                if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(paymentData.ifscCode.trim())) {
                    setPaymentError("Invalid IFSC code format (e.g., SBIN0123456)");
                    setIsSubmittingPayment(false);
                    return;
                }
            }

            // TODO: Call API to submit payment
            // await quoteAPI.submitPayment(quote._id, paymentData);

            setPaymentSuccess(true);
            setTimeout(() => {
                setPaymentSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Payment submission error:", err);
            setPaymentError(err.response?.data?.message || "Failed to submit payment. Please try again.");
        } finally {
            setIsSubmittingPayment(false);
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
            { status: "cancelled", label: "Cancelled", icon: FiAlertCircle },
            { status: "accepted", label: "Accepted", icon: FiCheckCircle },
            { status: "completed", label: "Completed", icon: FiCheckCircle },
        ];
        return steps;
    };

    const getStatusIndex = (status) => {
        const statusOrder = [
            "pending",
            "reviewing",
            "cancelled",
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
                        className={`rounded-xl p-8 mb-8 ${isCancelled
                            ? "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-400"
                            : "bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-400"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isCancelled
                                ? "bg-gray-300"
                                : "bg-red-300"
                                }`}>
                                <FiAlertCircle
                                    className={`text-3xl ${isCancelled ? "text-gray-700" : "text-red-700"
                                        }`}
                                />
                            </div>
                            <div className="flex-1">
                                <h3
                                    className={`text-2xl font-bold mb-3 ${isCancelled ? "text-gray-900" : "text-red-900"
                                        }`}
                                >
                                    {isCancelled ? "🚫 Quote Cancelled" : "❌ Quote Rejected"}
                                </h3>
                                <div className={`space-y-3 ${isCancelled ? "text-gray-700" : "text-red-800"
                                    }`}>
                                    <p className="text-lg font-medium">
                                        {isCancelled
                                            ? "This quote has been cancelled by the administration."
                                            : "This quote has been rejected. Please submit a new quote for different requirements."}
                                    </p>
                                    {quote.adminNotes && (
                                        <div className={`p-4 rounded-lg border-l-4 ${isCancelled
                                            ? "bg-gray-200 border-gray-500"
                                            : "bg-red-100 border-red-500"
                                            }`}>
                                            <p className="font-semibold mb-1">Admin Notes:</p>
                                            <p className="text-sm">{quote.adminNotes}</p>
                                        </div>
                                    )}
                                    <p className="text-sm mt-4">
                                        If you have any questions, please contact our support team at{" "}
                                        <a href="mailto:support@movingservice.com" className="font-semibold underline hover:no-underline">
                                            support@movingservice.com
                                        </a>
                                    </p>
                                </div>
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

                {/* Payment Section - Only for accepted quotes */}
                {quote.status === "accepted" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-8 mt-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FiCreditCard className="text-primary" />
                            Complete Payment
                        </h2>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                            <p className="text-blue-800 font-medium">
                                Quote Amount: <span className="font-bold text-lg">₹{quote.estimatedCost?.toLocaleString() || "0"}</span>
                            </p>
                        </div>

                        {paymentSuccess && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                                <FiCheckCircle />
                                <span>Payment submitted successfully! We will process it shortly.</span>
                            </div>
                        )}

                        {paymentError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                                <FiAlertCircle />
                                <span>{paymentError}</span>
                            </div>
                        )}

                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Preferred Payment Method *
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.value}
                                            onClick={() =>
                                                setPaymentData((prev) => ({
                                                    ...prev,
                                                    paymentMethod: method.value,
                                                }))
                                            }
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${paymentData.paymentMethod === method.value
                                                    ? "border-primary bg-primary/5 shadow-md"
                                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <method.icon
                                                className={`text-2xl mx-auto mb-2 ${paymentData.paymentMethod === method.value
                                                        ? "text-primary"
                                                        : "text-gray-500"
                                                    }`}
                                            />
                                            <p
                                                className={`font-semibold text-sm ${paymentData.paymentMethod === method.value
                                                        ? "text-primary"
                                                        : "text-gray-700"
                                                    }`}
                                            >
                                                {method.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Credit/Debit Card Form */}
                            {(paymentData.paymentMethod === "credit_card" || paymentData.paymentMethod === "debit_card") && (
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 space-y-4">
                                    <h4 className="font-semibold text-gray-800">
                                        {paymentData.paymentMethod === "credit_card" ? "Credit Card" : "Debit Card"} Details
                                    </h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cardholder Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="cardHolderName"
                                            value={paymentData.cardHolderName}
                                            onChange={handlePaymentInputChange}
                                            placeholder="Enter name on card"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Card Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={paymentData.cardNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, "").replace(/[^\d]/g, "");
                                                if (value.length <= 16) {
                                                    const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
                                                    setPaymentData((prev) => ({ ...prev, cardNumber: formatted }));
                                                }
                                            }}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date (MM/YY) *
                                            </label>
                                            <input
                                                type="text"
                                                name="cardExpiry"
                                                value={paymentData.cardExpiry}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, "");
                                                    if (value.length >= 2) {
                                                        value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                                    }
                                                    setPaymentData((prev) => ({ ...prev, cardExpiry: value }));
                                                }}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                CVV *
                                            </label>
                                            <input
                                                type="password"
                                                name="cardCVV"
                                                value={paymentData.cardCVV}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    if (value.length <= 3) {
                                                        setPaymentData((prev) => ({ ...prev, cardCVV: value }));
                                                    }
                                                }}
                                                placeholder="123"
                                                maxLength="3"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* UPI Form */}
                            {paymentData.paymentMethod === "upi" && (
                                <div className="bg-green-50 p-6 rounded-xl border border-green-200 space-y-4">
                                    <h4 className="font-semibold text-gray-800">UPI Details</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            UPI ID *
                                        </label>
                                        <input
                                            type="text"
                                            name="upiId"
                                            value={paymentData.upiId}
                                            onChange={handlePaymentInputChange}
                                            placeholder="yourname@upi (e.g., john@googleplay)"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                        <p className="text-xs text-gray-600 mt-2">
                                            You'll receive a payment request on this UPI ID.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Net Banking Form */}
                            {paymentData.paymentMethod === "net_banking" && (
                                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 space-y-4">
                                    <h4 className="font-semibold text-gray-800">Net Banking Details</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bank Name *
                                        </label>
                                        <select
                                            name="bankName"
                                            value={paymentData.bankName}
                                            onChange={handlePaymentInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select your bank</option>
                                            <option value="SBI">State Bank of India (SBI)</option>
                                            <option value="HDFC">HDFC Bank</option>
                                            <option value="ICICI">ICICI Bank</option>
                                            <option value="Axis">Axis Bank</option>
                                            <option value="PNB">Punjab National Bank</option>
                                            <option value="BOB">Bank of Baroda</option>
                                            <option value="Union">Union Bank of India</option>
                                            <option value="IDBI">IDBI Bank</option>
                                            <option value="Kotak">Kotak Mahindra Bank</option>
                                            <option value="Yes">Yes Bank</option>
                                            <option value="IndusInd">IndusInd Bank</option>
                                            <option value="RMHB">RBL Bank</option>
                                            <option value="Other">Other Bank</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Account Holder Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="accountHolder"
                                            value={paymentData.accountHolder}
                                            onChange={handlePaymentInputChange}
                                            placeholder="Name as per bank account"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Account Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            value={paymentData.accountNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                setPaymentData((prev) => ({ ...prev, accountNumber: value }));
                                            }}
                                            placeholder="Account number (digits only)"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            IFSC Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="ifscCode"
                                            value={paymentData.ifscCode}
                                            onChange={(e) => {
                                                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                                                if (value.length <= 11) {
                                                    setPaymentData((prev) => ({ ...prev, ifscCode: value }));
                                                }
                                            }}
                                            placeholder="e.g., SBIN0123456"
                                            maxLength="11"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                        <p className="text-xs text-gray-600 mt-1">
                                            11-character code (e.g., SBIN0123456)
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmittingPayment}
                                className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmittingPayment ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <FiCheck />
                                        Submit Payment
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Feedback Section - Only for completed quotes */}
                {quote.status === "completed" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-8 mt-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FiMessageSquare className="text-primary" />
                            Share Your Feedback
                        </h2>

                        {feedbackSuccess && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                                <FiCheckCircle />
                                <span>Thank you! Your feedback has been submitted successfully.</span>
                            </div>
                        )}

                        {feedbackError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                                <FiAlertCircle />
                                <span>{feedbackError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmitFeedback} className="space-y-6">
                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    How satisfied are you with our service? *
                                </label>
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFeedbackRating(star)}
                                            className={`text-4xl transition-transform hover:scale-110 ${feedbackRating >= star
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            <FiStar
                                                fill={feedbackRating >= star ? "#FBBF24" : "none"}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {feedbackRating > 0
                                        ? [
                                            "Poor",
                                            "Fair",
                                            "Good",
                                            "Very Good",
                                            "Excellent",
                                        ][feedbackRating - 1]
                                        : "Click stars to rate"}
                                </p>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Additional Comments (Optional)
                                </label>
                                <textarea
                                    value={feedbackComment}
                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                    placeholder="Tell us about your experience with our moving service..."
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {feedbackComment.length}/500 characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmittingFeedback}
                                className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmittingFeedback ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FiMessageSquare />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Delete Button - Only for pending and reviewing statuses */}
                {(quote.status === "pending" ||
                    quote.status === "reviewing") && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 pt-8 border-t border-gray-200 flex justify-center"
                        >
                            <div className="text-center">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDeleteQuote}
                                    disabled={isDeleting}
                                    className="flex items-center justify-center gap-2 px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50"
                                >
                                    <FiTrash2 className="text-xl" />
                                    {isDeleting ? "Deleting Quote..." : "Delete Quote"}
                                </motion.button>
                                <p className="text-center text-sm text-gray-500 mt-3">
                                    You can only delete quotes that are pending or under review
                                </p>
                            </div>
                        </motion.div>
                    )}
            </div>
        </div>
    );
};

export default QuoteTracking;
