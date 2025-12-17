import React from "react";
import { motion } from "framer-motion";
import { FaBuilding, FaHandshake, FaStar, FaQuoteLeft } from "react-icons/fa";

const Clients = () => {
  // Actual clients from United Packers website
  const clients = [
    { name: "Sony", logo: "/images/clients/sony.png" },
    { name: "Samsung", logo: "/images/clients/samsung.png" },
    { name: "Pepsi", logo: "/images/clients/pepsi.png" },
    { name: "Coca Cola", logo: "/images/clients/cocacola.png" },
    { name: "JSW", logo: "/images/clients/jsw.png" },
    { name: "State Bank of India", logo: "/images/clients/sbi.png" },
    { name: "NTPC", logo: "/images/clients/ntpc.png" },
    { name: "Philips", logo: "/images/clients/philips.png" },
    { name: "Vodafone", logo: "/images/clients/vodafone.png" },
    { name: "Yes Bank", logo: "/images/clients/yesbank.png" },
    { name: "HSBC", logo: "/images/clients/hsbc.png" },
    { name: "Accenture", logo: "/images/clients/accenture.png" },
    { name: "Wipro", logo: "/images/clients/wipro.png" },
    { name: "Navayuga", logo: "/images/clients/navayuga.png" },
    { name: "Bharathi Cement", logo: "/images/clients/bharathi.png" },
    { name: "UltraTech Cement", logo: "/images/clients/ultratech.png" },
    { name: "IDBI Bank", logo: "/images/clients/idbi.png" },
    { name: "ONGC", logo: "/images/clients/ongc.png" },
    { name: "BHEL", logo: "/images/clients/bhel.png" },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Infosys",
      role: "Facilities Manager",
      text: "United Packers handled our office relocation with exceptional professionalism. The entire process was smooth and well-coordinated.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      company: "HDFC Bank",
      role: "Operations Head",
      text: "We have been working with United Packers for 5 years now. Their attention to detail and commitment to timelines is remarkable.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      company: "Tech Mahindra",
      role: "Admin Manager",
      text: "The team handled our sensitive IT equipment with utmost care. Highly recommend their corporate moving services.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "500+", label: "Corporate Clients" },
    { number: "15+", label: "Years of Trust" },
    { number: "10,000+", label: "Successful Relocations" },
    { number: "98%", label: "Client Retention" },
  ];

  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Trusted <span className="text-light">Clients</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Partnering with India's leading organizations for seamless
              relocations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundImage: 'url(/satisfaction.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Orange overlay with 90% opacity */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(245, 166, 35, 0.9)' }}></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Companies We've Served
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From Fortune 500 companies to emerging startups, we've earned the
              trust of diverse organizations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center"
              >
                <div className="h-16 flex items-center justify-center mb-4">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-16 max-w-full object-contain hover:scale-110 transition-all duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-700 text-center text-sm">
                  {client.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Companies Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Companies Choose Us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaBuilding,
                title: "Corporate Expertise",
                desc: "Specialized in large-scale office relocations with minimal business disruption",
              },
              {
                icon: FaHandshake,
                title: "Dedicated Account Manager",
                desc: "Single point of contact for seamless communication and coordination",
              },
              {
                icon: FaStar,
                title: "Premium Service",
                desc: "Customized solutions tailored to your specific corporate requirements",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-xl bg-gradient-to-br from-primary/5 to-accent/10"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 relative"
              >
                <FaQuoteLeft className="text-4xl text-primary/20 absolute top-4 right-4" />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-primary">{testimonial.role}</p>
                  <p className="text-xs text-gray-500">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to Experience Our Service?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get a free quote and let us handle your next move with the same care and professionalism
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/quote"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:!bg-navy hover:!text-white hover:!border-navy transition-all duration-300"
              >
                Get Free Quote
              </a>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:!bg-navy hover:!text-white hover:!border-navy transition-all duration-300"
              >
                +91 98765 43210
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Clients;
