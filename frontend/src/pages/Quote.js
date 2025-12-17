import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiCalendar,
  FiPackage,
  FiUser,
  FiPhone,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiHome,
  FiTruck,
  FiBox,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import {
  FaTruck,
  FaCouch,
  FaTv,
  FaBed,
  FaChair,
  FaBoxOpen,
} from "react-icons/fa";
import { quoteAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Quote = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [quoteId, setQuoteId] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1: Location Details
    fromCity: "",
    fromAddress: "",
    fromFloor: "",
    toCity: "",
    toAddress: "",
    toFloor: "",
    // Step 2: Move Details
    moveDate: "",
    moveType: "",
    propertySize: "",
    // Step 3: Inventory
    items: {
      beds: 0,
      sofas: 0,
      tables: 0,
      chairs: 0,
      tvs: 0,
      appliances: 0,
      boxes: 0,
    },
    additionalItems: "",
    // Step 4: Contact Details
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    preferredTime: "",
    specialInstructions: "",
  });

  const [estimatedCost, setEstimatedCost] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else {
      // Pre-fill user's name and email if logged in
      setFormData((prev) => ({
        ...prev,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user, navigate]);

  const steps = [
    { number: 1, title: "Location", icon: FiMapPin },
    { number: 2, title: "Move Details", icon: FiCalendar },
    { number: 3, title: "Inventory", icon: FiPackage },
    { number: 4, title: "Contact", icon: FiUser },
  ];

  const moveTypes = [
    { value: "household", label: "Household Shifting", icon: FiHome },
    { value: "office", label: "Office Relocation", icon: FiTruck },
    { value: "vehicle", label: "Vehicle Transport", icon: FaTruck },
  ];

  const propertySizes = [
    { value: "1bhk", label: "1 BHK", desc: "Small apartment" },
    { value: "2bhk", label: "2 BHK", desc: "Medium apartment" },
    { value: "3bhk", label: "3 BHK", desc: "Large apartment" },
    { value: "4bhk", label: "4+ BHK", desc: "Large apartment" },
    { value: "villa", label: "Villa/Bungalow", desc: "Independent house" },
    { value: "office", label: "Office", desc: "Office space" },
    { value: "shop", label: "Shop", desc: "Commercial shop" },
    { value: "other", label: "Other", desc: "Other property type" },
  ];



  const inventoryItems = [
    { key: "beds", label: "Beds", icon: FaBed },
    { key: "sofas", label: "Sofas", icon: FaCouch },
    { key: "tables", label: "Tables", icon: FaChair },
    { key: "chairs", label: "Chairs", icon: FaChair },
    { key: "tvs", label: "TVs/Electronics", icon: FaTv },
    { key: "appliances", label: "Appliances", icon: FaBoxOpen },
    { key: "boxes", label: "Packed Boxes", icon: FiBox },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    // Prevent form submission when Enter is pressed on input fields
    // Users must explicitly click the Submit button to submit the quote
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleItemChange = (key, delta) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [key]: Math.max(0, prev.items[key] + delta),
      },
    }));
  };

  const calculateEstimate = () => {
    // Simple estimation logic (would be replaced with actual API call)
    let baseCost = 3999;

    // Add based on property size
    const sizeMultiplier = {
      "1bhk": 1,
      "2bhk": 1.5,
      "3bhk": 2,
      "4bhk": 3,
      "office-small": 2,
      "office-large": 4,
    };
    baseCost *= sizeMultiplier[formData.propertySize] || 1;

    // Add for floors
    const fromFloorCost = (parseInt(formData.fromFloor) || 0) * 200;
    const toFloorCost = (parseInt(formData.toFloor) || 0) * 200;
    baseCost += fromFloorCost + toFloorCost;

    // Add for items
    const itemCosts = {
      beds: 500,
      sofas: 400,
      tables: 200,
      chairs: 100,
      tvs: 300,
      appliances: 400,
      boxes: 50,
    };
    Object.keys(formData.items).forEach((key) => {
      baseCost += formData.items[key] * itemCosts[key];
    });

    setEstimatedCost(Math.round(baseCost));
  };

  const nextStep = () => {
    setSubmitError(""); // Clear previous errors
    setSubmitClicked(false); // Reset flag when navigating away

    // Validate current step before moving to next
    if (currentStep === 1) {
      // Validate location details
      if (!formData.fromCity || !formData.toCity) {
        setSubmitError("Please fill in both pickup and delivery cities");
        return;
      }
    } else if (currentStep === 2) {
      // Validate move details
      if (!formData.moveDate || !formData.moveType) {
        setSubmitError("Please select both move date and type of move");
        return;
      }
      if (!formData.propertySize) {
        setSubmitError("Please select property size");
        return;
      }
    } else if (currentStep === 3) {
      // Inventory step - no strict validation needed, but calculate estimate
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        calculateEstimate();
      }
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      if (currentStep === 3) {
        calculateEstimate();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setSubmitClicked(false); // Reset flag when navigating away
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only allow submission if the Submit button was explicitly clicked
    if (!submitClicked) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Debug: Log form data
      console.log("Form data on submit:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        moveDate: formData.moveDate,
        moveType: formData.moveType,
        paymentMethod: formData.paymentMethod,
      });

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        setSubmitError("Please fill in all contact details");
        setIsSubmitting(false);
        return;
      }
      if (!formData.fromCity || !formData.toCity) {
        setSubmitError("Please fill in pickup and delivery cities");
        setIsSubmitting(false);
        return;
      }
      if (!formData.moveDate || !formData.moveType) {
        console.log("Move date/type validation failed:", { moveDate: formData.moveDate, moveType: formData.moveType });
        setSubmitError("Please select move date and type");
        setIsSubmitting(false);
        return;
      }


      // Sanitize phone number - remove spaces, dashes, brackets
      const sanitizedPhone = formData.phone.trim().replace(/[\s()-]/g, "");

      const quoteData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: sanitizedPhone,
        fromCity: formData.fromCity.trim(),
        fromAddress: formData.fromAddress?.trim() || "",
        toCity: formData.toCity.trim(),
        toAddress: formData.toAddress?.trim() || "",
        floorFrom: parseInt(formData.fromFloor) || 0,
        floorTo: parseInt(formData.toFloor) || 0,
        moveDate: new Date(formData.moveDate).toISOString(), // Convert to ISO8601
        moveType: formData.moveType,
        propertyType: formData.propertySize || "other",
        items: formData.items,
        specialInstructions:
          formData.specialInstructions || formData.additionalItems || "",
      };

      console.log("Submitting quote:", quoteData);
      const response = await quoteAPI.create(quoteData);

      console.log("Quote creation response:", response.data);

      if (response.data.success) {
        setQuoteId(response.data.data.quoteId);
        setSubmitSuccess(true);
      } else {
        setSubmitError("Quote submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Quote submission error:", err);
      // Get detailed error message from backend
      let errorMessage = "Failed to submit quote. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      if (err.response?.data?.errors) {
        // Show validation errors
        const validationErrors = err.response.data.errors
          .map((e) => e.message)
          .join(", ");
        errorMessage = validationErrors || errorMessage;
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setSubmitClicked(false); // Reset flag after submission attempt
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Where are you moving?
            </h3>

            {/* From Location */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">
                  A
                </span>
                Pickup Location
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="fromCity"
                    value={formData.fromCity}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter city name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor Number
                  </label>
                  <select
                    name="fromFloor"
                    value={formData.fromFloor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select floor</option>
                    <option value="0">Ground Floor</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                        {n === 1
                          ? "st"
                          : n === 2
                            ? "nd"
                            : n === 3
                              ? "rd"
                              : "th"}{" "}
                        Floor
                      </option>
                    ))}
                    <option value="11">Above 10th</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address *
                  </label>
                  <textarea
                    name="fromAddress"
                    value={formData.fromAddress}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter complete address with landmarks"
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* To Location */}
            <div className="bg-green-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                  B
                </span>
                Drop Location
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="toCity"
                    value={formData.toCity}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter city name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor Number
                  </label>
                  <select
                    name="toFloor"
                    value={formData.toFloor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select floor</option>
                    <option value="0">Ground Floor</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                        {n === 1
                          ? "st"
                          : n === 2
                            ? "nd"
                            : n === 3
                              ? "rd"
                              : "th"}{" "}
                        Floor
                      </option>
                    ))}
                    <option value="11">Above 10th</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address *
                  </label>
                  <textarea
                    name="toAddress"
                    value={formData.toAddress}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter complete address with landmarks"
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Tell us about your move
            </h3>

            {/* Move Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Moving Date *
              </label>
              <input
                type="date"
                name="moveDate"
                value={formData.moveDate}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Move Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type of Move *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {moveTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, moveType: type.value }))
                    }
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.moveType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <type.icon
                      className={`text-2xl mb-2 ${formData.moveType === type.value
                        ? "text-primary"
                        : "text-gray-400"
                        }`}
                    />
                    <p
                      className={`font-medium text-sm ${formData.moveType === type.value
                        ? "text-primary"
                        : "text-gray-700"
                        }`}
                    >
                      {type.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Property Size *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propertySizes.map((size) => (
                  <div
                    key={size.value}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        propertySize: size.value,
                      }))
                    }
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.propertySize === size.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <p
                      className={`font-semibold ${formData.propertySize === size.value
                        ? "text-primary"
                        : "text-gray-700"
                        }`}
                    >
                      {size.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{size.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              What are you moving?
            </h3>

            {/* Inventory Items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {inventoryItems.map((item) => (
                <div key={item.key} className="bg-gray-50 p-4 rounded-xl">
                  <item.icon className="text-2xl text-primary mb-2" />
                  <p className="font-medium text-gray-700 text-sm mb-3">
                    {item.label}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleItemChange(item.key, -1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold text-lg">
                      {formData.items[item.key]}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleItemChange(item.key, 1)}
                      className="w-8 h-8 rounded-full bg-primary text-white hover:bg-secondary flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Items / Special Requirements
              </label>
              <textarea
                name="additionalItems"
                value={formData.additionalItems}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="List any additional items like piano, gym equipment, plants, etc."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Estimated Cost Preview */}
            {estimatedCost && (
              <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 font-medium">Estimated Cost</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{estimatedCost.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      *Final price may vary after survey
                    </p>
                  </div>
                  <FiCheckCircle className="text-4xl text-green-500" />
                </div>
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Your Contact Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Alternate number (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Contact Time
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select preferred time</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 7 PM)</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Any special requirements or instructions for our team"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Summary */}
            {estimatedCost && (
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Quote Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{formData.fromCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{formData.toCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Move Date:</span>
                    <span className="font-medium">{formData.moveDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium">
                      {formData.propertySize?.toUpperCase()}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-gray-800">
                      Estimated Cost:
                    </span>
                    <span className="font-bold text-primary text-lg">
                      ₹{estimatedCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Success Modal */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Quote Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Your quote request has been received. Our team will contact you
              shortly.
            </p>
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Your Quote ID:</p>
              <p className="text-2xl font-bold text-primary">{quoteId}</p>
              <p className="text-xs text-gray-500 mt-2">
                Save this ID to track your quote status
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setCurrentStep(1);
                  setFormData({
                    fromCity: "",
                    fromAddress: "",
                    fromFloor: "",
                    toCity: "",
                    toAddress: "",
                    toFloor: "",
                    moveDate: "",
                    moveType: "",
                    propertySize: "",
                    items: {
                      beds: 0,
                      sofas: 0,
                      tables: 0,
                      chairs: 0,
                      tvs: 0,
                      appliances: 0,
                      boxes: 0,
                    },
                    additionalItems: "",
                    name: "",
                    email: "",
                    phone: "",
                    alternatePhone: "",
                    preferredTime: "",
                    specialInstructions: "",
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
                  setEstimatedCost(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Submit Another
              </button>
              <button
                onClick={() => navigate("/dashboard", { replace: true })}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get Your Free Moving Quote
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Fill in your details and get an instant estimate. No hidden
              charges, 100% transparent pricing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentStep >= step.number
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {currentStep > step.number ? (
                        <FiCheck className="text-xl" />
                      ) : (
                        <step.icon className="text-xl" />
                      )}
                    </div>
                    <span
                      className={`text-sm mt-2 font-medium ${currentStep >= step.number
                        ? "text-primary"
                        : "text-gray-500"
                        }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded ${currentStep > step.number ? "bg-primary" : "bg-gray-200"
                        }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

              {/* Error Message */}
              {submitError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                  <FiAlertCircle className="mr-2 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${currentStep === 1
                    ? "invisible"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <FiArrowLeft className="mr-2" /> Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-all"
                  >
                    Next Step <FiArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={() => setSubmitClicked(true)}
                    disabled={isSubmitting}
                    className="flex items-center bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Quote Request <FiCheck className="ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FiShield, text: "100% Safe & Insured" },
              { icon: FiClock, text: "Quick Response" },
              { icon: FiCheckCircle, text: "No Hidden Charges" },
              { icon: FiPhone, text: "24/7 Support" },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center bg-white p-4 rounded-lg shadow"
              >
                <badge.icon className="text-primary mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quote;
