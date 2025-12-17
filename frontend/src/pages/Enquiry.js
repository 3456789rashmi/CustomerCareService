import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiPhone,
  FiMail,
  FiMessageCircle,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { enquiryAPI } from "../services/api";

const Enquiry = () => {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! 👋 Welcome to UnitedPackers. How can I help you today? Feel free to ask any questions or select from the suggestions below.",
    },
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const chatEndRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    message: "",
    callbackTime: "Morning (9 AM - 12 PM)",
  });

  // Pre-prepared Q&A
  const qaDatabase = [
    {
      id: 1,
      question: "How long does delivery take?",
      answer:
        "Delivery time depends on the distance and type of move:\n\n• Local shifts (same city): 1-2 days\n• Interstate moves: 3-7 days\n• International moves: 2-4 weeks\n\nWe provide real-time tracking so you can monitor your shipment throughout the journey. For urgent deliveries, we offer our Express Delivery service with guaranteed timelines.",
    },
    {
      id: 2,
      question: "How can I track my shipment?",
      answer:
        "Tracking your shipment is easy! You can:\n\n1. Log in to your dashboard\n2. Go to 'Track Shipment' from the Services menu\n3. Select your quote to view:\n   • Current location\n   • Estimated arrival time\n   • Real-time GPS tracking\n   • Status updates\n\nYou'll also receive SMS and email notifications at each milestone.",
    },
    {
      id: 3,
      question: "Can I delete or cancel my quote?",
      answer:
        "Yes! You have the flexibility to manage your quotes:\n\n🗑️ DELETE QUOTE (Before it's quoted):\n• You can delete quotes while they're 'Pending' or 'Under Review'\n• Once a quote is marked as 'Quote Ready', it cannot be deleted\n• To delete: Visit your quote tracking page and click the Delete button\n• Deletion is permanent and cannot be undone\n\n❌ CANCEL QUOTE (After quote is provided):\n• For quotes that are quoted or accepted, you can request cancellation\n• Contact us at +91 98765 43210 for cancellation requests\n• Cancellation charges may apply depending on status\n• Refund policy varies based on when cancellation is requested\n\n⚡ Quick Tips:\n• Delete early if you change your mind (free & instant)\n• Contact support for quotes beyond the 'Under Review' stage\n• All cancellations must be confirmed with our team",
    },
    {
      id: 4,
      question: "How much will it cost?",
      answer:
        "Pricing depends on several factors:\n\n📦 Distance: Local vs interstate vs international\n📏 Volume: Number and type of items\n🚚 Services: Packing, unpacking, storage, insurance\n📅 Timing: Peak season pricing may apply\n\nWe offer:\n• Free, no-obligation quotes\n• Transparent pricing (no hidden costs)\n• Flexible payment options\n• Discounts for bulk moves\n\nGet your free quote now - it takes just 5 minutes!",
    },
    {
      id: 5,
      question: "Do you provide packing materials?",
      answer:
        "Yes! We provide comprehensive packing solutions:\n\n✓ High-quality boxes and cartons\n✓ Bubble wrap and packing paper\n✓ Foam sheets for fragile items\n✓ Wooden crates for heavy furniture\n✓ Eco-friendly options available\n\nOur expert packers use industry-best techniques to ensure maximum protection. You can also opt for:\n• DIY packing with materials provided\n• Full packing service by our team\n• Partial packing (select items)\n\nAll packing costs are included in your quote.",
    },
    {
      id: 6,
      question: "Is my shipment insured?",
      answer:
        "Absolutely! All shipments are fully insured:\n\n✓ Basic coverage: Included in all moves\n✓ Comprehensive coverage: Optional for valuable items\n✓ Transit insurance: Door-to-door protection\n✓ Warehouse coverage: If using storage services\n\nIn case of any damage or loss:\n• Report within 24 hours\n• Provide photos/documentation\n• We handle insurance claims quickly\n• Settlement within 7-10 days\n\nFor high-value items, we recommend comprehensive insurance at a nominal cost.",
    },
    {
      id: 7,
      question: "Can you move on weekends or holidays?",
      answer:
        "Yes! We offer flexible scheduling:\n\n📅 Weekend moves: Available at standard rates\n🎉 Holiday moves: Available with advance booking\n⏰ Custom timing: Early morning, late evening, night shifts\n\nFor offices:\n• After-hours moving to minimize disruption\n• Weekend shifts available\n• Extended operating hours possible\n\nBe sure to:\n• Book in advance for peak days\n• Confirm dates with our team\n• Plan for potential rate variations\n\nContact us at least 2-3 weeks before your preferred date.",
    },
    {
      id: 8,
      question: "How do I get started?",
      answer:
        "Getting started is simple and takes just 5 minutes:\n\n1️⃣ Fill out our quote form with your details\n2️⃣ Select your moving date and services\n3️⃣ Receive a detailed estimate instantly\n4️⃣ Our team will verify and confirm\n5️⃣ Schedule your move\n\nYou can also:\n• Call us for a phone consultation\n• Use 'Track Shipment' for status updates\n• Request an in-person survey for large moves\n\nHave questions? Chat with us anytime or call +91 98765 43210!",
    },
  ];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleQuestionClick = (qa) => {
    // Add user question to chat
    setChatMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "user",
        text: qa.question,
      },
    ]);

    // Simulate bot thinking
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: qa.answer,
        },
      ]);
    }, 500);

    setSelectedQuestion(qa.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Add user message to chat
      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "user",
          text: `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message}`,
        },
      ]);

      await enquiryAPI.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        message: formData.message,
        callbackTime: formData.callbackTime,
        enquiryType: "general",
        subject: "Customer Enquiry",
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        message: "",
        callbackTime: "Morning (9 AM - 12 PM)",
      });

      // Bot response
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "bot",
            text: "Thank you for your enquiry! ✓\n\nWe've received your message and will get back to you shortly. Our team will contact you during your preferred callback time.\n\nEnquiry ID: " +
              Math.random().toString(36).substr(2, 9).toUpperCase(),
          },
        ]);
      }, 500);

      setShowForm(false);
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to submit enquiry");
      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: "Sorry, there was an error submitting your enquiry. Please try again or contact us directly at +91 98765 43210.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <section className="relative bg-navy py-20 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(31, 41, 55, 0.85), rgba(31, 41, 55, 0.85)), url(/services.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <FiMessageCircle className="text-white text-4xl" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Customer Support Chat
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Ask us anything! We have instant answers to your questions and our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Chat Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col h-[600px]"
            >
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg whitespace-pre-line ${msg.type === "user"
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Form Toggle Button */}
              {!showForm && !submitted && (
                <div className="border-t p-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(true)}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primaryDark transition-colors"
                  >
                    <FiSend /> Send Your Own Enquiry
                  </motion.button>
                </div>
              )}

              {/* Form Section */}
              <AnimatePresence>
                {showForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSubmit}
                    className="border-t p-4 space-y-3 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">
                        Send us your enquiry
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX className="text-xl" />
                      </button>
                    </div>

                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />

                    <textarea
                      name="message"
                      placeholder="Your message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                    />

                    <select
                      name="callbackTime"
                      value={formData.callbackTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary"
                    >
                      <option>Morning (9 AM - 12 PM)</option>
                      <option>Afternoon (12 PM - 5 PM)</option>
                      <option>Evening (5 PM - 9 PM)</option>
                      <option>Any Time</option>
                    </select>

                    {submitError && (
                      <p className="text-red-500 text-sm">{submitError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Sending..." : <>
                        <FiSend /> Send Enquiry
                      </>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Success Message */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t p-4 bg-green-50 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-green-600 font-semibold mb-2">
                    <FiCheck className="text-xl" />
                    Enquiry Submitted Successfully!
                  </div>
                  <p className="text-green-600 text-sm mb-3">
                    We'll be in touch soon. Check your email for confirmation.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-semibold text-sm hover:underline"
                  >
                    Ask another question
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Suggested Questions Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Frequently Asked Questions
                </h3>

                <div className="space-y-2">
                  {qaDatabase.map((qa) => (
                    <motion.button
                      key={qa.id}
                      whileHover={{ x: 5 }}
                      onClick={() => handleQuestionClick(qa)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-medium ${selectedQuestion === qa.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {qa.question}
                    </motion.button>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <p className="text-sm text-gray-600 font-semibold">
                    Need immediate help?
                  </p>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-2 text-primary hover:text-secondary transition-colors text-sm font-semibold"
                  >
                    <FiPhone className="text-lg" />
                    +91 98765 43210
                  </a>
                  <a
                    href="mailto:support@unitedpackers.com"
                    className="flex items-center gap-2 text-primary hover:text-secondary transition-colors text-sm font-semibold"
                  >
                    <FiMail className="text-lg" />
                    support@unitedpackers.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Enquiry;
