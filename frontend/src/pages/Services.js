import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiPhone,
  FiTruck,
  FiPackage,
  FiHome,
  FiGlobe,
  FiBox,
  FiShield,
} from "react-icons/fi";
import {
  FaTruck,
  FaBoxOpen,
  FaWarehouse,
  FaCar,
  FaGlobe,
  FaBuilding,
  FaShippingFast,
  FaHandsHelping,
  FaBoxes,
} from "react-icons/fa";

const Services = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const services = [
    {
      id: 1,
      icon: FaTruck,
      title: "Household Shifting",
      shortDesc: "Complete home relocation services with care and precision.",
      description:
        "Our household shifting service covers everything from packing your belongings to unpacking at your new home. We use high-quality packing materials and trained professionals to ensure the safety of your valuables.",
      features: [
        "Professional packing with quality materials",
        "Careful handling of fragile items",
        "Furniture dismantling and reassembly",
        "Loading and unloading with care",
        "Unpacking and arrangement services",
        "Transit insurance coverage",
      ],
      price: "Starting from ₹4,999",
      color: "from-[#0EA5E9] to-[#06B6D4]",
      popular: true,
    },
    {
      id: 2,
      icon: FaBuilding,
      title: "Office Relocation",
      shortDesc:
        "Minimize downtime with our efficient corporate moving solutions.",
      description:
        "We understand that time is money for businesses. Our office relocation services are designed to minimize disruption and get your business up and running quickly at the new location.",
      features: [
        "Weekend and after-hours moving options",
        "IT equipment handling specialists",
        "Furniture disassembly and setup",
        "Document and file management",
        "Minimal business disruption",
        "Dedicated project manager",
      ],
      price: "Custom Quote",
      color: "from-[#0EA5E9] to-[#06B6D4]",
      popular: false,
    },
    {
      id: 3,
      icon: FaCar,
      title: "Car Transportation",
      shortDesc: "Safe and secure vehicle shipping across India.",
      description:
        "Transport your vehicle safely with our specialized car carrier services. We use enclosed and open carriers based on your preference and budget.",
      features: [
        "Enclosed and open carrier options",
        "Door-to-door delivery",
        "GPS tracking throughout transit",
        "Comprehensive insurance coverage",
        "Bike and two-wheeler transport",
        "Multi-vehicle discounts",
      ],
      price: "Starting from ₹6,999",
      color: "from-[#0EA5E9] to-[#06B6D4]",
      popular: false,
    },
    {
      id: 4,
      icon: FaWarehouse,
      title: "Warehouse & Storage",
      shortDesc: "Secure storage solutions for short and long-term needs.",
      description:
        "Our climate-controlled warehouses provide safe storage for your belongings. Whether you need storage during a move or long-term solutions, we have you covered.",
      features: [
        "Climate-controlled facilities",
        "24/7 security surveillance",
        "Flexible storage durations",
        "Easy access to your belongings",
        "Inventory management system",
        "Pest-free environment",
      ],
      price: "Starting from ₹999/month",
      color: "from-[#0EA5E9] to-[#06B6D4]",
      popular: false,
    },
    {
      id: 5,
      icon: FaGlobe,
      title: "International Moving",
      shortDesc: "Hassle-free international relocation with customs support.",
      description:
        "Moving abroad? Our international relocation experts handle everything from documentation to customs clearance, ensuring a smooth transition to your new country.",
      features: [
        "Door-to-door international service",
        "Customs documentation assistance",
        "Sea and air freight options",
        "Destination services",
        "Pet relocation assistance",
        "Cultural orientation support",
      ],
      price: "Custom Quote",
      color: "from-[#0EA5E9] to-[#06B6D4]",
      popular: false,
    },
    {
      id: 6,
      icon: FaBoxOpen,
      title: "Packing Services",
      shortDesc: "Professional packing for maximum protection.",
      description:
        "Our trained packers use industry-best materials and techniques to ensure your belongings are protected during transit. From delicate china to heavy furniture, we pack it all.",
      features: [
        "High-quality packing materials",
        "Custom crating for artwork",
        "Specialized packing for electronics",
        "Eco-friendly options available",
        "Labeling and inventory",
        "Unpacking services included",
      ],
      price: "Starting from ₹1,999",
      color: "from-[#0EA5E9] to-[#06B6D4]",
      popular: false,
    },
    {
      id: 7,
      icon: FaShippingFast,
      title: "Express Delivery",
      shortDesc: "Time-sensitive moves with guaranteed delivery dates.",
      description:
        "When time is of the essence, our express delivery service ensures your belongings reach the destination within the committed timeframe.",
      features: [
        "Guaranteed delivery dates",
        "Priority handling",
        "Dedicated vehicle",
        "Real-time tracking",
        "Direct route transport",
        "24/7 customer support",
      ],
      price: "Starting from ₹7,999",
      color: "from-[#0EA5E9] to-[#06B6D4]",
      popular: false,
    },
    {
      id: 8,
      icon: FaHandsHelping,
      title: "Loading & Unloading",
      shortDesc: "Professional labor for heavy lifting and moving.",
      description:
        "Need help with just the heavy lifting? Our trained team provides loading and unloading services for self-move customers or those who need extra hands.",
      features: [
        "Trained and insured workers",
        "Proper lifting techniques",
        "Equipment for heavy items",
        "Hourly or flat-rate pricing",
        "Furniture placement",
        "Debris removal option",
      ],
      price: "Starting from ₹1,499",
      color: "from-[#0EA5E9] to-[#06B6D4]",
      popular: false,
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Request Quote",
      desc: "Fill out our form or call us for a free estimate",
      icon: FiPhone,
    },
    {
      step: 2,
      title: "Schedule Survey",
      desc: "We assess your belongings for accurate pricing",
      icon: FiHome,
    },
    {
      step: 3,
      title: "Packing Day",
      desc: "Our team carefully packs all your items",
      icon: FiBox,
    },
    {
      step: 4,
      title: "Safe Delivery",
      desc: "Your belongings arrive safely at the destination",
      icon: FiTruck,
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
              Comprehensive Moving Solutions
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Services
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              From local household moves to international relocations, we offer
              a complete range of professional moving services tailored to your
              needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {processSteps.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                {idx < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-200" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-neutral">
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
            <h2 className="text-4xl font-bold text-gray-800 mt-2 mb-4">
              Complete Moving Solutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of services designed to make
              your move smooth and stress-free.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group"
              >
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    POPULAR
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                <div className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.shortDesc}</p>

                  <div className="space-y-2 mb-6">
                    {service.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-start text-sm">
                        <FiCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex items-center justify-between">
                    <span className="text-primary font-bold">
                      {service.price}
                    </span>
                    <Link
                      to="/quote"
                      className="inline-flex items-center text-primary font-semibold hover:text-secondary transition-colors"
                    >
                      Get Quote <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Detail Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-lg">
              Why Choose Our Services
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2 mb-4">
              The UnitedPackers Advantage
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FiShield,
                title: "Fully Insured",
                desc: "All shipments are covered with comprehensive transit insurance for your peace of mind.",
              },
              {
                icon: FiTruck,
                title: "Modern Fleet",
                desc: "Our GPS-enabled vehicles ensure safe and trackable transportation of your belongings.",
              },
              {
                icon: FiPackage,
                title: "Quality Packing",
                desc: "We use premium packing materials and techniques to protect your valuables.",
              },
              {
                icon: FaBoxes,
                title: "No Hidden Costs",
                desc: "Transparent pricing with detailed quotes. What we quote is what you pay.",
              },
              {
                icon: FiGlobe,
                title: "Pan India Network",
                desc: "With presence in 500+ cities, we can move you anywhere in India.",
              },
              {
                icon: FiPhone,
                title: "24/7 Support",
                desc: "Round-the-clock customer support to address all your queries and concerns.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start p-6 bg-neutral rounded-xl"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-xl text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Need a Custom Moving Solution?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Contact us today for a personalized quote based on your specific
              requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent hover:text-white transition-all duration-300 shadow-lg"
              >
                Get Free Quote <FiArrowRight className="ml-2" />
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300"
              >
                <FiPhone className="mr-2" /> Call: +91 98765 43210
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
