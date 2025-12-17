import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiEye,
  FiAward,
  FiUsers,
  FiTruck,
  FiMapPin,
  FiCheckCircle,
  FiArrowRight,
  FiPhone,
  FiStar,
} from "react-icons/fi";
import { FaHandshake, FaShieldAlt, FaLeaf, FaClock } from "react-icons/fa";

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const stats = [
    { number: "15+", label: "Years of Experience", icon: FiAward },
    { number: "15000+", label: "Successful Relocations", icon: FiTruck },
    { number: "500+", label: "Cities Covered", icon: FiMapPin },
    { number: "50000+", label: "Happy Customers", icon: FiUsers },
  ];

  const values = [
    {
      icon: FaHandshake,
      title: "Trust & Reliability",
      desc: "We build lasting relationships through transparent practices and consistent delivery on our promises.",
      color: "bg-blue-500",
    },
    {
      icon: FaShieldAlt,
      title: "Safety First",
      desc: "Your belongings are treated with utmost care. Every item is insured and handled by trained professionals.",
      color: "bg-green-500",
    },
    {
      icon: FaClock,
      title: "Punctuality",
      desc: "Time is valuable. We respect your schedule with on-time pickups and deliveries.",
      color: "bg-purple-500",
    },
    {
      icon: FaLeaf,
      title: "Eco-Friendly",
      desc: "We use sustainable packing materials and optimize routes to reduce our carbon footprint.",
      color: "bg-teal-500",
    },
  ];

  const team = [
    {
      name: "Rajesh Sharma",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
      desc: "20+ years in logistics industry",
    },
    {
      name: "Priya Kapoor",
      role: "Operations Head",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
      desc: "Expert in supply chain management",
    },
    {
      name: "Amit Verma",
      role: "Customer Success Manager",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      desc: "Dedicated to client satisfaction",
    },
    {
      name: "Sneha Patel",
      role: "Quality Assurance Head",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
      desc: "Ensuring service excellence",
    },
  ];

  const milestones = [
    {
      year: "2010",
      title: "Company Founded",
      desc: "Started with a single truck and a vision to transform the moving industry.",
    },
    {
      year: "2013",
      title: "Expanded to 50 Cities",
      desc: "Rapid growth led us to establish presence across major Indian cities.",
    },
    {
      year: "2016",
      title: "Launched Vehicle Transport",
      desc: "Added car and bike transportation to our service portfolio.",
    },
    {
      year: "2018",
      title: "International Moving",
      desc: "Expanded operations to international relocations across 20+ countries.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      desc: "Launched online booking, real-time tracking, and instant quotes.",
    },
    {
      year: "2023",
      title: "15000+ Relocations",
      desc: "Achieved milestone of successful relocations with 99% satisfaction rate.",
    },
  ];

  const certifications = [
    "ISO 9001:2015 Certified",
    "IBA Approved Transporter",
    "Member - Indian Movers Association",
    "FIDI Affiliate Member",
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-navy py-20">
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
              Trusted Since 2010
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              About UnitedPackers Pro
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              India's most trusted packers and movers, dedicated to making your
              relocation journey smooth, safe, and stress-free for over 15
              years.
            </p>
          </motion.div>
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

      {/* Our Story Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-lg">
                Our Story
              </span>
              <h2 className="text-4xl font-bold text-navy mt-2 mb-6">
                From a Single Truck to India's Trusted Movers
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  UnitedPackers Pro was founded in 2010 with a simple mission:
                  to transform the way India moves. What started as a small
                  operation with just one truck and a passionate team has grown
                  into one of the country's most trusted relocation companies.
                </p>
                <p>
                  Our founder, Rajesh Sharma, experienced firsthand the
                  challenges of relocating when he moved his family across
                  states. The lack of professional, reliable, and caring movers
                  inspired him to create a company that would treat every
                  customer's belongings as if they were his own.
                </p>
                <p>
                  Today, we operate in over 500 cities across India and have
                  expanded internationally to serve customers relocating abroad.
                  Our team of 500+ trained professionals handles everything from
                  household goods to precious artwork, ensuring safe and timely
                  delivery every single time.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                {certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow"
                  >
                    <FiCheckCircle className="inline mr-2 text-green-500" />
                    {cert}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=500&fit=crop"
                alt="Our Team at Work"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-navy text-white p-6 rounded-xl shadow-xl">
                <p className="text-4xl font-bold">15+</p>
                <p className="text-white/90">Years of Trust</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
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
              What Drives Us
            </span>
            <h2 className="text-4xl font-bold text-navy mt-2">
              Mission & Vision
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-navy p-8 rounded-2xl text-white"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                <FiTarget className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/90 leading-relaxed">
                To provide seamless, stress-free relocation experiences through
                professional service, innovative solutions, and unwavering
                commitment to customer satisfaction. We aim to be the most
                reliable partner for every moving need, treating each customer's
                belongings with the care they deserve.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-primary p-8 rounded-2xl text-white"
            >
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mb-6">
                <FiEye className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-white/90 leading-relaxed">
                To become the most trusted and preferred relocation company
                globally, known for excellence, innovation, and sustainability.
                We envision a future where moving is no longer a stressful event
                but an exciting new beginning, made possible by our dedicated
                team and technology-driven solutions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
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
              What We Stand For
            </span>
            <h2 className="text-4xl font-bold text-navy mt-2 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every service we
              deliver.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl hover:border-primary hover:border-2 transition-all"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {value.title}
                </h3>
                <p className="text-textMuted">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-lg">
              Our Journey
            </span>
            <h2 className="text-4xl font-bold text-navy mt-2 mb-4">
              Key Milestones
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary hidden md:block" />

            {milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex items-center mb-8 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
              >
                <div
                  className={`w-full md:w-1/2 ${idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                >
                  <div className="bg-gray-100 p-6 rounded-xl shadow-lg border-l-4 border-primary">
                    <span className="text-primary font-bold text-lg">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-semibold text-navy mt-1">
                      {milestone.title}
                    </h3>
                    <p className="text-textMuted mt-2">{milestone.desc}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet The Experts
            </span>
            <h2 className="text-4xl font-bold text-navy mt-2 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals committed to making your move seamless.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:bg-primary"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-navy group-hover:text-white transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium group-hover:text-white/90 transition-colors">{member.role}</p>
                  <p className="text-textMuted text-sm mt-2 group-hover:text-white/80 transition-colors">{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-lg">
                Why UnitedPackers Pro
              </span>
              <h2 className="text-4xl font-bold text-white mt-2 mb-6">
                What Sets Us Apart
              </h2>
              <div className="space-y-4">
                {[
                  "Trained and background-verified staff",
                  "Modern GPS-tracked fleet of vehicles",
                  "Premium quality packing materials",
                  "Comprehensive transit insurance",
                  "Dedicated move coordinator for each customer",
                  "Transparent pricing with no hidden costs",
                  "Real-time tracking and updates",
                  "24/7 customer support",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <FiCheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 p-8 rounded-2xl"
            >
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="text-yellow-400 fill-current text-2xl"
                    />
                  ))}
                </div>
                <p className="text-3xl font-bold text-white">4.9/5</p>
                <p className="text-white">Based on 10,000+ reviews</p>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg no-hover">
                  <p className="text-gray-600 italic">
                    "Best moving experience ever! Highly professional team."
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    - Verified Customer
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg no-hover">
                  <p className="text-gray-600 italic">
                    "They handled my antiques with extreme care. Impressed!"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    - Verified Customer
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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

export default About;
