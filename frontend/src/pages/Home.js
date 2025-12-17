import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTruck,
  FiShield,
  FiClock,
  FiAward,
  FiCheckCircle,
  FiPhone,
  FiArrowRight,
  FiStar,
  FiMapPin,
  FiUsers,
  FiThumbsUp,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  FaTruck,
  FaBoxOpen,
  FaWarehouse,
  FaCar,
  FaGlobe,
  FaHandshake,
} from "react-icons/fa";

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  // Services data
  const services = [
    {
      icon: FaTruck,
      title: "Household Shifting",
      desc: "Complete home relocation with careful packing and safe transport of your belongings.",
      color: "bg-primary",
    },
    {
      icon: FaBoxOpen,
      title: "Office Relocation",
      desc: "Minimize business downtime with our efficient corporate moving solutions.",
      color: "bg-primary",
    },
    {
      icon: FaCar,
      title: "Car Transportation",
      desc: "Safe and secure vehicle shipping to any destination across India.",
      color: "bg-primary",
    },
    {
      icon: FaWarehouse,
      title: "Warehouse Storage",
      desc: "Secure storage facilities for short-term and long-term needs.",
      color: "bg-primary",
    },
    {
      icon: FaGlobe,
      title: "International Moving",
      desc: "Hassle-free international relocation with customs clearance support.",
      color: "bg-primary",
    },
    {
      icon: FaHandshake,
      title: "Corporate Solutions",
      desc: "Tailored moving solutions for businesses of all sizes.",
      color: "bg-primary",
    },
  ];

  // Features data
  const features = [
    {
      icon: FiShield,
      title: "Fully Insured",
      desc: "Complete coverage for your belongings during transit.",
    },
    {
      icon: FiClock,
      title: "On-Time Delivery",
      desc: "99% on-time delivery rate with real-time tracking.",
    },
    {
      icon: FiAward,
      title: "Expert Team",
      desc: "Trained professionals with years of experience.",
    },
    {
      icon: FiTruck,
      title: "Modern Fleet",
      desc: "GPS-enabled vehicles for safe transportation.",
    },
  ];

  // Stats data
  const stats = [
    { number: "15000+", label: "Successful Moves", icon: FiTruck },
    { number: "500+", label: "Cities Covered", icon: FiMapPin },
    { number: "50000+", label: "Happy Customers", icon: FiUsers },
    { number: "99%", label: "Satisfaction Rate", icon: FiThumbsUp },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi to Mumbai",
      rating: 5,
      text: "Excellent service! The team was professional and handled all my belongings with care. Highly recommended for anyone planning to move.",
    },
    {
      name: "Priya Sharma",
      location: "Bangalore to Chennai",
      rating: 5,
      text: "Stress-free relocation experience. They packed everything perfectly and delivered on time. Will definitely use again!",
    },
    {
      name: "Amit Patel",
      location: "Pune to Hyderabad",
      rating: 5,
      text: "Very affordable and reliable. The quote was accurate with no hidden charges. Great communication throughout the process.",
    },
  ];

  // FAQ data
  const faqs = [
    {
      q: "How do you calculate moving costs?",
      a: "Our pricing is based on the volume of items, distance, and additional services required. We provide a free, no-obligation quote after assessing your requirements.",
    },
    {
      q: "Is insurance included in the moving package?",
      a: "Yes, all our moving packages include basic transit insurance. We also offer comprehensive coverage options for valuable items at additional cost.",
    },
    {
      q: "How far in advance should I book?",
      a: "We recommend booking at least 1-2 weeks in advance for local moves and 3-4 weeks for long-distance relocations to ensure availability.",
    },
    {
      q: "Do you provide packing materials?",
      a: "Yes, we provide high-quality packing materials including boxes, bubble wrap, tape, and specialized packaging for fragile items as part of our full-service packages.",
    },
    {
      q: "Can I track my shipment?",
      a: "Absolutely! We provide real-time tracking for all shipments. You will receive updates via SMS and can track your belongings through our customer portal.",
    },
  ];

  // Perks data
  const perks = [
    "Door-to-door service with no hassle",
    "Free dismantling and reassembly of furniture",
    "Eco-friendly packing materials available",
    "Dedicated move coordinator assigned",
    "Flexible scheduling including weekends",
    "Transparent pricing with no hidden costs",
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-r from-navy via-navyLight to-navy">
        {/* Left Half Background Image */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/background.jpg)' }}></div>

        {/* Right Half Background Image with Navy Blue Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/truck.png)' }}>
          <div className="absolute inset-0 bg-navy/90"></div>
        </div>

        {/* Darker Animated Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/30"
          animate={{ opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-start-2"
            >
              <motion.span
                className="inline-block bg-primary/40 text-white px-4 py-2 rounded-full text-xs font-medium mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                🚚 #1 Rated Packers & Movers in India
              </motion.span>
              <motion.h1
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Your Trusted Partner for
                <span className="text-primary"> Seamless Moves</span>
              </motion.h1>
              <motion.p
                className="text-base text-white/90 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                From local household moves to international relocations, we handle it all with care and precision.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link
                  to="/quote"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-300"
                >
                  Get Free Quote <FiArrowRight className="ml-2" />
                </Link>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-300"
                >
                  <FiPhone className="mr-2" /> Call Now
                </a>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                className="mt-10 flex flex-wrap items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center text-white text-sm">
                  <FiCheckCircle className="text-primary mr-2" />
                  <span className="text-white">Free Estimate</span>
                </div>
                <div className="flex items-center text-white text-sm">
                  <FiCheckCircle className="text-primary mr-2" />
                  <span className="text-white">Insured Moving</span>
                </div>
                <div className="flex items-center text-white text-sm">
                  <FiCheckCircle className="text-primary mr-2" />
                  <span className="text-white">24/7 Support</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F2F2F2"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:bg-navy"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primaryDark transition-all duration-300">
                  <feature.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/80">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-lg">
              What We Offer
            </span>
            <h2 className="text-4xl font-bold text-navy mt-2 mb-4">
              Our Premium Services
            </h2>
            <p className="text-textMuted max-w-2xl mx-auto">
              From household shifting to corporate relocations, we provide
              comprehensive moving solutions tailored to your specific needs.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border-t-4 border-primary"
              >
                <div className="p-8">
                  <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primaryDark transition-colors">
                    <service.icon className="text-2xl text-white group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-textMuted mb-4">{service.desc}</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center text-primary font-medium hover:text-primaryDark"
                  >
                    Learn More{" "}
                    <FiArrowRight className="ml-2 group-hover:text-primary transition-all" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/services"
              className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primaryDark transition-colors duration-300"
            >
              View All Services <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us / Perks Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-lg">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-bold text-white mt-2 mb-6">
                Making Your Move Stress-Free Since 2010
              </h2>
              <p className="text-white/80 mb-8 text-lg leading-relaxed">
                With over a decade of experience, we've perfected the art of
                relocation. Our commitment to excellence and customer
                satisfaction sets us apart from the rest.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start">
                    <FiCheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <span className="text-white">{perk}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center bg-primary text-textDark px-8 py-4 rounded-lg font-semibold mt-8 hover:bg-primaryDark hover:text-white transition-all duration-300"
              >
                About Our Company <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop"
                alt="Professional Movers"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                    <FiAward className="text-2xl text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-textDark">
                      15+ Years
                    </p>
                    <p className="text-textMuted">Of Excellence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundImage: 'url(/satisfaction.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Orange overlay with 90% opacity */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(245, 166, 35, 0.9)' }}></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </h3>
                <p className="text-white/80 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-lg">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold text-navy mt-2 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-textMuted max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our happy customers
              have to say about their moving experience with us.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-primary fill-current" />
                  ))}
                </div>
                <p className="text-textMuted mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-navy">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-textMuted">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-lg">FAQs</span>
            <h2 className="text-4xl font-bold text-navy mt-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-textMuted">
              Find answers to common questions about our moving services.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-bgLight transition-colors"
                >
                  <span className="font-semibold text-navy text-left">
                    {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <FiChevronUp className="text-primary flex-shrink-0 ml-4" />
                  ) : (
                    <FiChevronDown className="text-textMuted flex-shrink-0 ml-4 group-hover:text-primary transition-colors" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-5 bg-bgLight border-t border-gray-200">
                    <p className="text-textMuted">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted Clients Marquee Section */}
      <section className="py-12 bg-beige overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-navy">
            Trusted By Leading Companies
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[
              { name: "Sony", logo: "/images/clients/sony.png" },
              { name: "SBI", logo: "/images/clients/sbi.png" },
              { name: "Samsung", logo: "/images/clients/samsung.png" },
              { name: "Pepsi", logo: "/images/clients/pepsi.png" },
              { name: "Coca Cola", logo: "/images/clients/cocacola.png" },
              { name: "JSW", logo: "/images/clients/jsw.png" },
              { name: "HSBC", logo: "/images/clients/hsbc.png" },
              { name: "Wipro", logo: "/images/clients/wipro.png" },
              { name: "Accenture", logo: "/images/clients/accenture.png" },
              { name: "NTPC", logo: "/images/clients/ntpc.png" },
              { name: "Sony", logo: "/images/clients/sony.png" },
              { name: "SBI", logo: "/images/clients/sbi.png" },
              { name: "Samsung", logo: "/images/clients/samsung.png" },
              { name: "Pepsi", logo: "/images/clients/pepsi.png" },
              { name: "Coca Cola", logo: "/images/clients/cocacola.png" },
              { name: "JSW", logo: "/images/clients/jsw.png" },
              { name: "HSBC", logo: "/images/clients/hsbc.png" },
              { name: "Wipro", logo: "/images/clients/wipro.png" },
              { name: "Accenture", logo: "/images/clients/accenture.png" },
              { name: "NTPC", logo: "/images/clients/ntpc.png" },
            ].map((client, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center mx-8 bg-white px-8 py-4 rounded-lg shadow-sm min-w-[150px] border border-primary/20"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-12 max-w-[120px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Primary Bottom Border */}
        <div className="h-1 bg-primary mt-8"></div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundImage: 'url(/surety.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Orange overlay with 90% opacity */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(245, 166, 35, 0.9)' }}></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make Your Move?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get a free, no-obligation quote today and experience the
              difference of professional moving services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:!bg-navy hover:!text-white hover:!border-navy transition-all duration-300"
              >
                Get Free Quote <FiArrowRight className="ml-2" />
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:!bg-navy hover:!text-white hover:!border-navy transition-all duration-300"
              >
                <FiPhone className="mr-2" /> +91 98765 43210
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
