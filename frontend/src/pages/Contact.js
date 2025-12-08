import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiMessageSquare,
  FiUser,
  FiCheckCircle,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { contactAPI } from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [contactId, setContactId] = useState(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await contactAPI.create(formData);

      if (response.data.success) {
        setContactId(response.data.data.contactId);
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: "Our Office",
      details: [
        "123, Business Hub, Sector 18,",
        "Noida, Uttar Pradesh - 201301",
      ],
      color: "bg-blue-500",
    },
    {
      icon: FiPhone,
      title: "Phone Numbers",
      details: ["+91 98765 43210", "+91 11 4567 8900"],
      color: "bg-green-500",
      link: "tel:+919876543210",
    },
    {
      icon: FiMail,
      title: "Email Address",
      details: ["info@unitedpackerspro.com", "support@unitedpackerspro.com"],
      color: "bg-purple-500",
      link: "mailto:info@unitedpackerspro.com",
    },
    {
      icon: FiClock,
      title: "Working Hours",
      details: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sunday: 10:00 AM - 4:00 PM"],
      color: "bg-orange-500",
    },
  ];

  const branches = [
    {
      city: "Delhi NCR",
      address: "123, Business Hub, Sector 18, Noida",
      phone: "+91 98765 43210",
    },
    {
      city: "Mumbai",
      address: "456, Trade Center, Andheri East",
      phone: "+91 98765 43211",
    },
    {
      city: "Bangalore",
      address: "789, Tech Park, Whitefield",
      phone: "+91 98765 43212",
    },
    {
      city: "Chennai",
      address: "321, Commerce Plaza, T. Nagar",
      phone: "+91 98765 43213",
    },
    {
      city: "Hyderabad",
      address: "654, IT Hub, HITEC City",
      phone: "+91 98765 43214",
    },
    {
      city: "Pune",
      address: "987, Business Bay, Hinjewadi",
      phone: "+91 98765 43215",
    },
  ];

  const socialLinks = [
    {
      icon: FaWhatsapp,
      href: "https://wa.me/919876543210",
      label: "WhatsApp",
      color: "hover:bg-green-500",
    },
    {
      icon: FaFacebookF,
      href: "#",
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    {
      icon: FaInstagram,
      href: "#",
      label: "Instagram",
      color: "hover:bg-pink-500",
    },
    {
      icon: FaLinkedinIn,
      href: "#",
      label: "LinkedIn",
      color: "hover:bg-blue-700",
    },
  ];

  const faqs = [
    {
      q: "How quickly will you respond to my inquiry?",
      a: "We typically respond within 2-4 hours during business hours.",
    },
    {
      q: "Can I visit your office for consultation?",
      a: "Yes! Walk-ins are welcome during working hours. For detailed consultation, we recommend scheduling an appointment.",
    },
    {
      q: "Do you provide free home surveys?",
      a: "Yes, we offer free home/office surveys for accurate quotes in most cities.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary py-20">
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
            <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              We're Here to Help
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Have questions about your move? Need a quote? Our friendly team is
              ready to assist you 24/7. Reach out and let's make your relocation
              seamless.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20 relative z-20">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow"
              >
                <div
                  className={`w-14 h-14 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <info.icon className="text-2xl text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {info.title}
                </h3>
                {info.details.map((detail, i) =>
                  info.link ? (
                    <a
                      key={i}
                      href={info.link}
                      className="block text-gray-600 hover:text-primary transition-colors"
                    >
                      {detail}
                    </a>
                  ) : (
                    <p key={i} className="text-gray-600">
                      {detail}
                    </p>
                  )
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-lg">
                Send Us a Message
              </span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-6">
                We'd Love to Hear From You
              </h2>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center"
                >
                  <FiCheckCircle className="text-2xl mr-3" />
                  <div>
                    <p className="font-semibold">Message Sent Successfully!</p>
                    <p className="text-sm">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                </motion.div>
              )}

              <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUser className="inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMail className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiPhone className="inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="quote">Request a Quote</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="tracking">Track Shipment</option>
                      <option value="complaint">Complaint</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMessageSquare className="inline mr-2" />
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-6 bg-primary text-white py-4 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  <FiSend className="mr-2" /> Send Message
                </button>
              </form>

              {/* Social Links */}
              <div className="mt-8">
                <p className="text-gray-600 mb-4">
                  Or connect with us on social media:
                </p>
                <div className="flex space-x-3">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 ${social.color} hover:text-white transition-all duration-300`}
                    >
                      <social.icon className="text-xl" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Map & Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-lg">
                Find Us
              </span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-6">
                Visit Our Office
              </h2>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-lg h-80 relative">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.7156441257!2d77.31468611508202!3d28.570885782439693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sSector%2018%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Quick Contact */}
              <div className="mt-6 bg-primary text-white p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-4">
                  Need Immediate Assistance?
                </h3>
                <p className="text-white/90 mb-4">
                  Our customer support team is available 24/7 to help you with
                  any queries.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:+919876543210"
                    className="flex items-center justify-center bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition-all"
                  >
                    <FiPhone className="mr-2" /> Call Now
                  </a>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all"
                  >
                    <FaWhatsapp className="mr-2" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-8">
                <h3 className="font-semibold text-xl text-gray-800 mb-4">
                  Quick FAQs
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow">
                      <p className="font-medium text-gray-800">{faq.q}</p>
                      <p className="text-gray-600 text-sm mt-2">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Branch Locations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold text-lg">
              Our Network
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
              Branch Locations
            </h2>
            <p className="text-gray-600">
              We have offices across major Indian cities for your convenience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-neutral p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">
                      {branch.city}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {branch.address}
                    </p>
                    <a
                      href={`tel:${branch.phone}`}
                      className="text-primary text-sm font-medium mt-2 inline-block hover:text-secondary"
                    >
                      {branch.phone}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Move?
            </h2>
            <p className="text-white/90 mb-8">
              Get a free, no-obligation quote and let us handle the rest.
            </p>
            <a
              href="/quote"
              className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-white transition-all shadow-lg"
            >
              Get Free Quote <FiArrowRight className="ml-2" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
