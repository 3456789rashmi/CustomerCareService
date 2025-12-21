import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCalendar,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiDollarSign,
  FiPhone,
  FiMail,
  FiPackage,
  FiHome,
  FiEdit,
  FiSave,
  FiStar
} from "react-icons/fi";
import { quoteAPI, adminAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const AdminQuoteDetail = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else {
      fetchQuoteDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, quoteId]);

  const fetchQuoteDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await quoteAPI.getQuoteDetail(quoteId);
      if (response.data.success && response.data.data) {
        setQuote(response.data.data);
        setEditData({
          estimatedCost: response.data.data.estimatedCost || "",
          finalCost: response.data.data.finalCost || "",
          adminNotes: response.data.data.adminNotes || "",
          status: response.data.data.status || "",
        });
        fetchQuoteFeedback(response.data.data._id);
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

  const fetchQuoteFeedback = async (quoteObjectId) => {
    try {
      setFeedbackLoading(true);
      const response = await quoteAPI.getQuoteFeedback(quoteObjectId);
      if (response.data.success && response.data.data) {
        setFeedback(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveMessage("");
      await adminAPI.updateQuote(quote._id, editData);
      setSaveMessage({ type: "success", text: "Quote updated successfully!" });
      setIsEditing(false);
      fetchQuoteDetails();
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save quote:", err);
      setSaveMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save changes",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      reviewing: "bg-blue-100 text-blue-800 border-blue-200",
      quoted: "bg-purple-100 text-purple-800 border-purple-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quote details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
            <FiAlertCircle className="text-red-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            Error
          </h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate("/admin")}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary py-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-white mb-4 hover:opacity-80 transition-opacity"
          >
            <FiArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">Quote Details</h1>
              <div className="mt-3 flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg border border-white/30">
                  <p className="text-white/70 text-xs uppercase tracking-wide">
                    Tracking ID
                  </p>
                  <p className="text-white font-mono font-bold text-lg">
                    {quote.quoteId}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(quote.quoteId);
                    alert("Tracking ID copied to clipboard!");
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  title="Copy Tracking ID"
                >
                  Copy
                </button>
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-lg border font-semibold text-sm ${getStatusColor(
                quote.status
              )}`}
            >
              {quote.status?.charAt(0).toUpperCase() + quote.status?.slice(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Save Message */}
            {saveMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                  saveMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {saveMessage.type === "success" ? (
                  <FiCheckCircle />
                ) : (
                  <FiAlertCircle />
                )}
                {saveMessage.text}
              </motion.div>
            )}

            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiHome />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {quote.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {quote.name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FiMail size={16} /> Email
                  </p>
                  <p className="font-semibold text-gray-800">{quote.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FiPhone size={16} /> Phone
                  </p>
                  <p className="font-semibold text-gray-800">{quote.phone}</p>
                </div>
              </div>
            </motion.div>

            {/* Move Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiTruck />
                Move Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Move Type</p>
                    <p className="text-lg font-semibold text-gray-800 capitalize">
                      {quote.moveType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="text-lg font-semibold text-gray-800 capitalize">
                      {quote.propertyType || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200 cursor-pointer group">
                  <p className="text-sm text-blue-600 font-semibold mb-2 group-hover:text-white">
                    📍 FROM
                  </p>
                  <p className="text-lg font-bold text-gray-800 group-hover:text-white">
                    {quote.fromCity}
                  </p>
                  {quote.fromAddress && (
                    <p className="text-sm text-gray-600 group-hover:text-white">
                      {quote.fromAddress}
                    </p>
                  )}
                  {quote.fromPincode && (
                    <p className="text-sm text-gray-600 group-hover:text-white">
                      Pincode: {quote.fromPincode}
                    </p>
                  )}
                  {quote.floorFrom !== undefined && (
                    <p className="text-sm text-gray-600 group-hover:text-white mt-1">
                      Floor: {quote.floorFrom}
                      {quote.liftAvailableFrom && " (Lift Available)"}
                    </p>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200 hover:bg-green-100 hover:border-green-300 transition-colors duration-200 cursor-pointer group">
                  <p className="text-sm text-green-600 font-semibold mb-2 group-hover:text-white">
                    📍 TO
                  </p>
                  <p className="text-lg font-bold text-gray-800 group-hover:text-white">
                    {quote.toCity}
                  </p>
                  {quote.toAddress && (
                    <p className="text-sm text-gray-600 group-hover:text-white">
                      {quote.toAddress}
                    </p>
                  )}
                  {quote.toPincode && (
                    <p className="text-sm text-gray-600 group-hover:text-white">
                      Pincode: {quote.toPincode}
                    </p>
                  )}
                  {quote.floorTo !== undefined && (
                    <p className="text-sm text-gray-600 group-hover:text-white mt-1">
                      Floor: {quote.floorTo}
                      {quote.liftAvailableTo && " (Lift Available)"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors duration-200 cursor-pointer group">
                    <p className="text-sm text-purple-600 font-semibold mb-1 group-hover:text-white">
                      <FiCalendar className="inline mr-1" />
                      Moving Date
                    </p>
                    <p className="text-lg font-bold text-gray-800 group-hover:text-white">
                      {new Date(quote.moveDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 font-semibold mb-1">
                      Date Flexibility
                    </p>
                    <p className="text-lg font-bold text-gray-800 capitalize">
                      {quote.flexibility || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Items & Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiPackage />
                Items & Services
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Beds</p>
                  <p className="text-2xl font-bold text-primary">
                    {quote.items?.beds || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Sofas</p>
                  <p className="text-2xl font-bold text-primary">
                    {quote.items?.sofas || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">TVs</p>
                  <p className="text-2xl font-bold text-primary">
                    {quote.items?.tvs || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={quote.packingRequired}
                    disabled
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-gray-700">
                    Packing Required
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={quote.unpackingRequired}
                    disabled
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-gray-700">
                    Unpacking Required
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={quote.storageRequired}
                    disabled
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-gray-700">
                    Storage Required
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={quote.insuranceRequired}
                    disabled
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-gray-700">
                    Insurance Required
                  </span>
                </label>
              </div>

              {quote.specialInstructions && (
                <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-amber-700 mb-2">
                    📝 Special Instructions
                  </p>
                  <p className="text-gray-700">{quote.specialInstructions}</p>
                </div>
              )}
            </motion.div>

            {/* Admin Edit Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FiEdit />
                  Admin Details
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isEditing
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="quoted">Quoted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium capitalize">
                      {quote.status}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiDollarSign className="inline mr-1" />
                      Estimated Cost (₹)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="estimatedCost"
                        value={editData.estimatedCost}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Enter estimated cost"
                      />
                    ) : (
                      <p className="text-gray-800 font-semibold">
                        {quote.estimatedCost
                          ? `₹${quote.estimatedCost.toLocaleString("en-IN")}`
                          : "Not set"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiDollarSign className="inline mr-1" />
                      Final Cost (₹)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="finalCost"
                        value={editData.finalCost}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Enter final cost"
                      />
                    ) : (
                      <p className="text-gray-800 font-semibold">
                        {quote.finalCost
                          ? `₹${quote.finalCost.toLocaleString("en-IN")}`
                          : "Not set"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  {isEditing ? (
                    <textarea
                      name="adminNotes"
                      value={editData.adminNotes}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none min-h-[120px] resize-vertical"
                      placeholder="Add notes for this quote..."
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {quote.adminNotes || "No notes added"}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:from-primaryDark hover:to-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiSave />
                        Save Changes
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quote Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-32"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Quote Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Quote ID</span>
                  <span className="font-semibold text-primary">
                    {quote.quoteId}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(quote.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      quote.status
                    )}`}
                  >
                    {quote.status?.charAt(0).toUpperCase() +
                      quote.status?.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Move Date</span>
                  <span className="text-sm font-medium">
                    {new Date(quote.moveDate).toLocaleDateString("en-IN")}
                  </span>
                </div>
                {quote.estimatedCost && (
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Est. Cost</span>
                    <span className="font-bold text-primary">
                      ₹{quote.estimatedCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {quote.finalCost && (
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Final Cost</span>
                    <span className="font-bold text-green-600">
                      ₹{quote.finalCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {quote.paymentStatus && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        quote.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : quote.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {quote.paymentStatus}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Feedback Section */}
            {feedback && !feedbackLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 border border-amber-200"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiStar className="text-yellow-500" />
                  Customer Feedback
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={20}
                        className={
                          i < feedback.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Rating: {feedback.rating}/5
                  </p>
                  {feedback.comment && (
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        Comment
                      </p>
                      <p className="text-sm text-gray-700 italic">
                        "{feedback.comment}"
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    On{" "}
                    {new Date(feedback.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuoteDetail;
