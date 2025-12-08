import React from "react";
import { Link } from "react-router-dom";
import {
  FaTruck,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Our Services" },
    { path: "/about", label: "About Us" },
    { path: "/quote", label: "Get Quote" },
    { path: "/contact", label: "Contact Us" },
  ];

  const services = [
    "Household Shifting",
    "Office Relocation",
    "Car Transportation",
    "Warehouse Storage",
    "International Moving",
    "Packing Services",
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <FaTruck className="text-3xl text-primary" />
              <div>
                <span className="text-2xl font-bold text-white">United</span>
                <span className="text-2xl font-bold text-accent">Packers</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for safe, reliable, and affordable packing
              and moving services across India. We make relocation stress-free
              with our professional team.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200"
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-accent transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-2">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, idx) => (
                <li key={idx}>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-accent transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-2">›</span> {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiMapPin className="text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  123, Business Hub, Sector 18,
                  <br />
                  Noida, Uttar Pradesh - 201301
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="text-primary mr-3 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="text-primary mr-3 flex-shrink-0" />
                <a
                  href="mailto:info@unitedpackerspro.com"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  info@unitedpackerspro.com
                </a>
              </li>
              <li className="flex items-center">
                <FiClock className="text-primary mr-3 flex-shrink-0" />
                <span className="text-gray-400">24/7 Available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} UnitedPackers Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 hover:text-accent transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/sitemap"
                className="text-gray-500 hover:text-accent transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
