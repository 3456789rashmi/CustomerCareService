import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiPhone,
  FiMail,
  FiChevronDown,
  FiExternalLink,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import {
  FaHome,
  FaBuilding,
  FaCar,
  FaWarehouse,
  FaGlobe,
  FaBoxOpen,
  FaImages,
  FaMapMarkedAlt,
  FaEnvelopeOpenText,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Refs for timeout management
  const servicesTimeoutRef = useRef(null);
  const moreTimeoutRef = useRef(null);
  const userTimeoutRef = useRef(null);

  // Dropdown delay in milliseconds (500ms = half second delay before closing)
  const DROPDOWN_CLOSE_DELAY = 400;

  // Handlers for Services dropdown
  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setShowServicesDropdown(true);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setShowServicesDropdown(false);
    }, DROPDOWN_CLOSE_DELAY);
  };

  // Handlers for More dropdown
  const handleMoreEnter = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setShowMoreDropdown(true);
  };

  const handleMoreLeave = () => {
    moreTimeoutRef.current = setTimeout(() => {
      setShowMoreDropdown(false);
    }, DROPDOWN_CLOSE_DELAY);
  };

  // Handlers for User dropdown
  const handleUserEnter = () => {
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    setShowUserDropdown(true);
  };

  const handleUserLeave = () => {
    userTimeoutRef.current = setTimeout(() => {
      setShowUserDropdown(false);
    }, DROPDOWN_CLOSE_DELAY);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
      if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  const servicesDropdown = {
    mainServices: [
      {
        icon: FaHome,
        label: "Household Shifting",
        desc: "Complete home relocation",
        path: "/services#household",
      },
      {
        icon: FaBuilding,
        label: "Office Relocation",
        desc: "Corporate moving solutions",
        path: "/services#office",
      },
      {
        icon: FaCar,
        label: "Car Transportation",
        desc: "Safe vehicle shipping",
        path: "/services#car",
      },
      {
        icon: FaWarehouse,
        label: "Warehouse Storage",
        desc: "Secure storage facilities",
        path: "/services#warehouse",
      },
      {
        icon: FaGlobe,
        label: "International Moving",
        desc: "Worldwide relocations",
        path: "/services#international",
      },
      {
        icon: FaBoxOpen,
        label: "Packing Services",
        desc: "Professional packing",
        path: "/services#packing",
      },
    ],
    quickLinks: [
      { label: "View All Services", path: "/services" },
      { label: "Get Free Quote", path: "/quote" },
      { label: "Track Shipment", path: "/track-shipment" },
    ],
  };

  const moreDropdown = [
    {
      icon: FaUsers,
      label: "Our Clients",
      desc: "Trusted by top companies",
      path: "/clients",
    },
    {
      icon: FaImages,
      label: "Gallery",
      desc: "See our work process",
      path: "/gallery",
    },
    {
      icon: FaMapMarkedAlt,
      label: "Our Network",
      desc: "Pan India presence",
      path: "/network",
    },
    {
      icon: FaEnvelopeOpenText,
      label: "Enquiry",
      desc: "Quick enquiry form",
      path: "/enquiry",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <a
              href="tel:+919876543210"
              className="flex items-center hover:text-accent transition-colors"
            >
              <FiPhone className="mr-2" /> +91 98765 43210
            </a>
            <a
              href="mailto:info@unitedpackerspro.com"
              className="flex items-center hover:text-accent transition-colors"
            >
              <FiMail className="mr-2" /> info@unitedpackerspro.com
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span>24/7 Support Available</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-white shadow-md"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo with Company Badge */}
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Company Logo Image */}
              <img
                src="/unitedpackers.png"
                alt="United Packers Logo"
                className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    United
                  </span>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                    Packers
                  </span>
                </div>
                <span className="block text-xs font-medium text-gray-400 tracking-wider uppercase -mt-1">
                  Pro Movers
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.slice(0, 1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors duration-200 ${isActive(link.path)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-gray-700 hover:text-primary"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Services Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <button className="flex items-center font-medium text-gray-700 hover:text-primary transition-colors">
                  Services{" "}
                  <FiChevronDown
                    className={`ml-1 transition-transform ${showServicesDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showServicesDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="grid grid-cols-2">
                      {/* Main Services */}
                      <div className="p-6 bg-gray-50">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                          Our Services
                        </h4>
                        <div className="space-y-1">
                          {servicesDropdown.mainServices.map((service, idx) => (
                            <Link
                              key={idx}
                              to={service.path}
                              className="flex items-start p-3 rounded-lg hover:bg-white transition-colors group"
                            >
                              <service.icon className="text-primary mt-1 mr-3 group-hover:text-secondary" />
                              <div>
                                <p className="font-medium text-gray-800 group-hover:text-primary">
                                  {service.label}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {service.desc}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Quick Links & CTA */}
                      <div className="p-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                          Quick Links
                        </h4>
                        <div className="space-y-3 mb-6">
                          {servicesDropdown.quickLinks.map((link, idx) => (
                            <Link
                              key={idx}
                              to={link.path}
                              className="block text-gray-700 hover:text-primary font-medium"
                            >
                              → {link.label}
                            </Link>
                          ))}
                        </div>
                        <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-lg text-white">
                          <p className="font-semibold mb-2">
                            Need Help Moving?
                          </p>
                          <p className="text-sm text-white/80 mb-3">
                            Get a free quote today!
                          </p>
                          <Link
                            to="/quote"
                            className="inline-block bg-white text-primary px-4 py-2 rounded font-semibold text-sm hover:bg-accent hover:text-white transition-colors"
                          >
                            Get Quote
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* More Dropdown (Clients, Gallery, Network, Enquiry) - SupportYourApp Style */}
              <div
                className="relative"
                onMouseEnter={handleMoreEnter}
                onMouseLeave={handleMoreLeave}
              >
                <button className="flex items-center font-medium text-gray-700 hover:text-primary transition-colors">
                  More{" "}
                  <FiChevronDown
                    className={`ml-1 transition-transform ${showMoreDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showMoreDropdown && (
                  <div
                    className="absolute top-full -left-32 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    style={{ width: "580px" }}
                  >
                    <div className="flex">
                      {/* Left Side - Image Card */}
                      <div className="w-56 p-4">
                        <div className="relative h-full bg-gradient-to-br from-primary via-secondary to-accent rounded-xl overflow-hidden">
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="relative p-6 h-full flex flex-col justify-end">
                            <p className="text-white/80 text-sm mb-1">
                              Our clients report
                            </p>
                            <p className="text-white text-3xl font-bold mb-1">
                              99.5%
                            </p>
                            <p className="text-white/90 text-lg">
                              satisfaction rate
                            </p>
                            <div className="mt-4 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <FiExternalLink className="text-white" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Navigation Links */}
                      <div className="flex-1 p-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                          EXPLORE MORE
                        </h4>
                        <div className="space-y-1">
                          {moreDropdown.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              className="flex items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-all">
                                <item.icon className="text-primary group-hover:text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors duration-200 ${isActive(link.path)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-gray-700 hover:text-primary"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Login/User Button */}
              {isAuthenticated ? (
                <div
                  className="relative"
                  onMouseEnter={handleUserEnter}
                  onMouseLeave={handleUserLeave}
                >
                  <button className="relative inline-flex items-center px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-primary via-secondary to-accent rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
                    <FiUser className="w-4 h-4 mr-2" />
                    {user?.firstName}
                    <FiChevronDown
                      className={`ml-2 transition-transform ${showUserDropdown ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="p-4 bg-gray-50 border-b">
                        <p className="font-semibold text-gray-800">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        {user?.role === "admin" && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        {user?.role === "admin" && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                          >
                            🛡️ Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          to="/quote"
                          className="block px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                        >
                          Get Quote
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
                        >
                          <FiLogOut className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="relative inline-flex items-center px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-primary via-secondary to-accent rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Login
                  </span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-primary focus:outline-none"
              >
                {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-2 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-medium px-4 py-2 rounded-lg transition-colors ${isActive(link.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/services"
                  onClick={() => setIsOpen(false)}
                  className="font-medium px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Services
                </Link>
                {moreDropdown.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="font-medium px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <item.icon className="mr-2 text-primary" /> {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200 my-2 mx-4"></div>
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Logged in as{" "}
                      <span className="font-semibold text-gray-800">
                        {user?.firstName}
                      </span>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="font-medium px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FiUser className="mr-2 text-primary" /> Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="font-medium px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center w-full text-left"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="font-medium px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="font-medium px-4 py-2 rounded-lg text-primary hover:bg-gray-100"
                    >
                      Create Account
                    </Link>
                  </>
                )}
                <Link
                  to="/quote"
                  onClick={() => setIsOpen(false)}
                  className="bg-primary text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-secondary transition-colors mx-4"
                >
                  Get Free Quote
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
