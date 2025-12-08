import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSend,
  FiCheck,
  FiPhone,
  FiMail,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import {
  FaHome,
  FaBuilding,
  FaCar,
  FaWarehouse,
  FaGlobe,
  FaBoxOpen,
  FaWhatsapp,
} from "react-icons/fa";
import { enquiryAPI } from "../services/api";

const Enquiry = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    serviceType: "",
    moveDate: "",
    fromLocation: "",
    toLocation: "",
    message: "",
    callbackTime: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [enquiryId, setEnquiryId] = useState(null);

  const serviceTypes = [
    { id: "household", label: "Household Shifting", icon: FaHome },
    { id: "office", label: "Office Relocation", icon: FaBuilding },
    { id: "car", label: "Car Transportation", icon: FaCar },
    { id: "storage", label: "Warehouse Storage", icon: FaWarehouse },
    { id: "international", label: "International Moving", icon: FaGlobe },
    { id: "packing", label: "Packing Only", icon: FaBoxOpen },
  ];

  const callbackTimes = [
    "Morning (9 AM - 12 PM)",
    "Afternoon (12 PM - 3 PM)",
    "Evening (3 PM - 6 PM)",
    "Any Time",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const enquiryData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        serviceType: formData.serviceType,
        movingDate: formData.moveDate,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        message: formData.message,
        callbackTime: formData.callbackTime,
      };

      const response = await enquiryAPI.create(enquiryData);

      if (response.data.success) {
        setEnquiryId(response.data.data.enquiryId);
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Failed to submit enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Quick <span className="text-light">Enquiry</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Fill out the form below and our team will get back to you within
              30 minutes
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Get in Touch
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiPhone className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Call Us</p>
                      <a
                        href="tel:+919876543210"
                        className="text-primary hover:text-secondary"
                      >
                        +91 98765 43210
                      </a>
                      <p className="text-sm text-gray-500">
                        Toll Free: 1800-123-4567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">WhatsApp</p>
                      <a
                        href="https://wa.me/919876543210"
                        className="text-primary hover:text-secondary"
                      >
                        +91 98765 43210
                      </a>
                      <p className="text-sm text-gray-500">Quick Response</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Email Us</p>
                      <a
                        href="mailto:enquiry@unitedpackers.com"
                        className="text-primary hover:text-secondary"
                      >
                        enquiry@unitedpackers.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiClock className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Working Hours
                      </p>
                      <p className="text-gray-600">Mon - Sat: 9 AM - 8 PM</p>
                      <p className="text-gray-600">Sunday: 10 AM - 5 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white">
                  <p className="font-semibold mb-2">🎁 Special Offer</p>
                  <p className="text-sm text-white/90">
                    Get 10% off on your first move! Use code: FIRST10
                  </p>
                </div>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-xl p-12 text-center"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheck className="text-green-600 text-4xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Thank You!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your enquiry has been submitted successfully. Our team will
                    contact you within 30 minutes.
                  </p>
                  <p className="text-primary font-semibold">
                    Reference ID: ENQ{Date.now().toString().slice(-8)}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-xl p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Fill Your Details
                  </h2>

                  {/* Service Type Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Service Type *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {serviceTypes.map((service) => (
                        <label
                          key={service.id}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.serviceType === service.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="serviceType"
                            value={service.id}
                            checked={formData.serviceType === service.id}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <service.icon
                            className={`text-xl ${
                              formData.serviceType === service.id
                                ? "text-primary"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              formData.serviceType === service.id
                                ? "text-primary"
                                : "text-gray-700"
                            }`}
                          >
                            {service.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Your current city"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Moving From *
                      </label>
                      <input
                        type="text"
                        name="fromLocation"
                        value={formData.fromLocation}
                        onChange={handleChange}
                        required
                        placeholder="Source location"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Moving To *
                      </label>
                      <input
                        type="text"
                        name="toLocation"
                        value={formData.toLocation}
                        onChange={handleChange}
                        required
                        placeholder="Destination location"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Move Date
                      </label>
                      <input
                        type="date"
                        name="moveDate"
                        value={formData.moveDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Best Time to Call
                      </label>
                      <select
                        name="callbackTime"
                        value={formData.callbackTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      >
                        <option value="">Select time slot</option>
                        {callbackTimes.map((time, idx) => (
                          <option key={idx} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Details
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us more about your requirements (items to move, special handling needs, etc.)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FiSend /> Submit Enquiry
                  </button>

                  <p className="text-center text-gray-500 text-sm mt-4">
                    By submitting, you agree to our terms and privacy policy
                  </p>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Enquiry;
