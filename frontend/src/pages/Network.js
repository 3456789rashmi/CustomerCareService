import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaTruck,
  FaUsers,
  FaClock,
} from "react-icons/fa";

// Add keyframe animation for blinking dots
const style = document.createElement("style");
style.textContent = `
  @keyframes blink-yellow {
    0%, 100% { 
      fill: #FFD700;
      filter: drop-shadow(0 0 3px #FFD700);
    }
    50% { 
      fill: #FFA500;
      filter: drop-shadow(0 0 8px #FFA500);
    }
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      filter: drop-shadow(0 0 5px rgba(100, 150, 255, 0.4));
    }
    50% {
      filter: drop-shadow(0 0 15px rgba(100, 150, 255, 0.8));
    }
  }
  
  .blink-dot {
    animation: blink-yellow 1.5s infinite;
  }
  
  .map-glow {
    animation: pulse-glow 3s infinite;
  }
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}

const Network = () => {
  const [selectedRegion, setSelectedRegion] = useState("all");

  const regions = [
    { id: "all", label: "All India" },
    { id: "north", label: "North India" },
    { id: "south", label: "South India" },
    { id: "east", label: "East India" },
    { id: "west", label: "West India" },
  ];

  const branches = [
    {
      city: "Delhi NCR",
      region: "north",
      address: "Sector 18, Noida",
      phone: "+91 11-4567-8901",
      isHub: true,
      staff: 150,
      vehicles: 45,
    },
    {
      city: "Mumbai",
      region: "west",
      address: "Andheri East",
      phone: "+91 22-4567-8901",
      isHub: true,
      staff: 180,
      vehicles: 55,
    },
    {
      city: "Bangalore",
      region: "south",
      address: "Whitefield",
      phone: "+91 80-4567-8901",
      isHub: true,
      staff: 120,
      vehicles: 40,
    },
    {
      city: "Chennai",
      region: "south",
      address: "T Nagar",
      phone: "+91 44-4567-8901",
      isHub: false,
      staff: 80,
      vehicles: 25,
    },
    {
      city: "Kolkata",
      region: "east",
      address: "Salt Lake",
      phone: "+91 33-4567-8901",
      isHub: true,
      staff: 100,
      vehicles: 35,
    },
    {
      city: "Hyderabad",
      region: "south",
      address: "HITEC City",
      phone: "+91 40-4567-8901",
      isHub: false,
      staff: 90,
      vehicles: 30,
    },
    {
      city: "Pune",
      region: "west",
      address: "Hinjewadi",
      phone: "+91 20-4567-8901",
      isHub: false,
      staff: 70,
      vehicles: 22,
    },
    {
      city: "Ahmedabad",
      region: "west",
      address: "SG Highway",
      phone: "+91 79-4567-8901",
      isHub: false,
      staff: 60,
      vehicles: 20,
    },
    {
      city: "Jaipur",
      region: "north",
      address: "Malviya Nagar",
      phone: "+91 141-456-7890",
      isHub: false,
      staff: 50,
      vehicles: 18,
    },
    {
      city: "Lucknow",
      region: "north",
      address: "Gomti Nagar",
      phone: "+91 522-456-7890",
      isHub: false,
      staff: 45,
      vehicles: 15,
    },
    {
      city: "Kochi",
      region: "south",
      address: "Kakkanad",
      phone: "+91 484-456-7890",
      isHub: false,
      staff: 40,
      vehicles: 12,
    },
    {
      city: "Guwahati",
      region: "east",
      address: "GS Road",
      phone: "+91 361-456-7890",
      isHub: false,
      staff: 35,
      vehicles: 10,
    },
    {
      city: "Chandigarh",
      region: "north",
      address: "Sector 22",
      phone: "+91 172-456-7890",
      isHub: false,
      staff: 40,
      vehicles: 14,
    },
    {
      city: "Bhopal",
      region: "north",
      address: "MP Nagar",
      phone: "+91 755-456-7890",
      isHub: false,
      staff: 35,
      vehicles: 12,
    },
    {
      city: "Coimbatore",
      region: "south",
      address: "RS Puram",
      phone: "+91 422-456-7890",
      isHub: false,
      staff: 30,
      vehicles: 10,
    },
    {
      city: "Indore",
      region: "north",
      address: "Vijay Nagar",
      phone: "+91 731-456-7890",
      isHub: false,
      staff: 30,
      vehicles: 10,
    },
  ];

  const filteredBranches =
    selectedRegion === "all"
      ? branches
      : branches.filter((b) => b.region === selectedRegion);

  const stats = [
    { icon: FaBuilding, number: "16+", label: "Branch Offices" },
    { icon: FaUsers, number: "1200+", label: "Team Members" },
    { icon: FaTruck, number: "400+", label: "Vehicles Fleet" },
    { icon: FaClock, number: "24/7", label: "Support Available" },
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
              Our Pan-India <span className="text-light">Network</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Connecting every corner of India with seamless relocation services
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
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-white text-2xl" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* India Map Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Our Presence Across India
            </h2>
            <p className="text-gray-600">
              Major hubs and branch offices serving all regions
            </p>
          </div>

          <div className="relative bg-white rounded-2xl shadow-xl p-8 overflow-hidden">
            {/* India Map Image */}
            <div className="relative w-full max-w-4xl mx-auto">
              {/* Map Image Container */}
              <div
                className="relative w-full rounded-lg overflow-hidden map-glow"
                style={{
                  backgroundImage: 'url(/Indianmap.png)',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  aspectRatio: '1 / 1.2',
                }}
              >
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-400" style={{
                  animation: 'blink-yellow 1.5s infinite'
                }}></div>
                <span className="text-sm text-gray-600">Regional Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" style={{
                  animation: 'blink-yellow 1.5s infinite'
                }}></div>
                <span className="text-sm text-gray-600">Branch Office</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{
                  background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
                  border: '2px solid #1565C0'
                }}></div>
                <span className="text-sm text-gray-600">Service Area</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Region Filter */}
      <section className="py-8 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedRegion === region.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch, index) => (
              <motion.div
                key={branch.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative ${branch.isHub ? "border-2 border-primary" : ""
                  }`}
              >
                {branch.isHub && (
                  <span className="absolute -top-3 left-4 bg-primary text-white px-3 py-1 text-xs rounded-full font-semibold">
                    Regional Hub
                  </span>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {branch.city}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-1 text-primary" />{" "}
                      {branch.address}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FaBuilding className="text-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <FaUsers className="text-primary mx-auto mb-1" />
                    <span className="text-lg font-bold text-gray-800">
                      {branch.staff}
                    </span>
                    <span className="text-xs text-gray-500 block">Staff</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <FaTruck className="text-primary mx-auto mb-1" />
                    <span className="text-lg font-bold text-gray-800">
                      {branch.vehicles}
                    </span>
                    <span className="text-xs text-gray-500 block">
                      Vehicles
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <a
                    href={`tel:${branch.phone}`}
                    className="flex items-center text-primary hover:text-secondary transition-colors"
                  >
                    <FaPhone className="mr-2" /> {branch.phone}
                  </a>
                  <a
                    href={`mailto:${branch.city.toLowerCase()}@unitedpackers.com`}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <FaEnvelope />
                  </a>
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
              Find Your Nearest Branch
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us for personalized relocation assistance from your city
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:!bg-navy hover:!text-white hover:!border-navy transition-all duration-300"
              >
                Contact Us
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

export default Network;
