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
      <section className="bg-gradient-to-br from-primary via-secondary to-primary py-20">
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-primary text-2xl" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
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
            {/* India Map with CSS positioned markers */}
            <div className="relative w-full max-w-3xl mx-auto">
              {/* India Map SVG - Proper India shape */}
              <svg viewBox="0 0 400 500" className="w-full h-auto">
                <defs>
                  <linearGradient
                    id="mapGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FFBF00" stopOpacity="0.85" />
                    <stop
                      offset="100%"
                      stopColor="#FFA500"
                      stopOpacity="0.65"
                    />
                  </linearGradient>
                </defs>

                {/* India Mainland */}
                <path
                  fill="url(#mapGradient)"
                  stroke="#5E4F82"
                  strokeWidth="2"
                  d="M120,25 Q95,30 85,55 Q80,80 90,100 Q75,115 70,140 Q65,165 75,190 
                     Q60,210 55,240 Q50,270 60,300 Q55,330 50,360 Q48,390 60,415 
                     Q50,435 45,460 Q50,480 70,475 Q85,465 95,445 Q105,425 120,420 
                     Q135,430 145,455 Q150,480 145,505 Q155,525 175,520 Q195,510 210,490 
                     Q225,470 245,450 Q265,430 280,405 Q295,380 305,350 Q315,320 310,290 
                     Q320,260 335,235 Q345,210 340,180 Q345,150 335,125 Q340,100 330,80 
                     Q320,65 295,60 Q270,55 250,60 Q235,50 215,45 Q195,40 175,45 
                     Q155,35 135,30 Q120,25 120,25 Z"
                />

                {/* Jammu & Kashmir */}
                <path
                  fill="url(#mapGradient)"
                  stroke="#5E4F82"
                  strokeWidth="2"
                  d="M120,25 Q110,15 95,10 Q80,8 70,18 Q60,30 65,48 Q70,65 85,55 
                     Q95,45 108,40 Q120,35 120,25 Z"
                />

                {/* Northeast India */}
                <path
                  fill="url(#mapGradient)"
                  stroke="#5E4F82"
                  strokeWidth="2"
                  d="M330,80 Q350,70 370,75 Q388,85 392,105 Q390,125 375,135 
                     Q358,142 340,138 Q328,130 330,110 Q332,90 330,80 Z"
                />

                {/* City Markers - Positioned for India geography */}
                {[
                  { x: 195, y: 85, city: "Delhi", hub: true },
                  { x: 150, y: 115, city: "Jaipur", hub: false },
                  { x: 245, y: 115, city: "Lucknow", hub: false },
                  { x: 372, y: 105, city: "Guwahati", hub: false },
                  { x: 95, y: 185, city: "Ahmedabad", hub: false },
                  { x: 320, y: 205, city: "Kolkata", hub: true },
                  { x: 82, y: 270, city: "Mumbai", hub: true },
                  { x: 115, y: 310, city: "Pune", hub: false },
                  { x: 195, y: 295, city: "Hyderabad", hub: false },
                  { x: 235, y: 375, city: "Chennai", hub: false },
                  { x: 175, y: 395, city: "Bangalore", hub: true },
                  { x: 125, y: 455, city: "Kochi", hub: true },
                ].map((loc, i) => (
                  <g key={i}>
                    {/* Outer glow */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={loc.hub ? 14 : 10}
                      fill={loc.hub ? "#3B0A45" : "#5E4F82"}
                      opacity="0.25"
                    />
                    {/* Main dot */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={loc.hub ? 8 : 5}
                      fill={loc.hub ? "#3B0A45" : "#5E4F82"}
                    />
                    {/* Highlight */}
                    <circle
                      cx={loc.x - 2}
                      cy={loc.y - 2}
                      r={loc.hub ? 2.5 : 1.5}
                      fill="white"
                      opacity="0.5"
                    />
                    {/* Label */}
                    <text
                      x={
                        loc.city === "Mumbai" ||
                          loc.city === "Ahmedabad" ||
                          loc.city === "Kochi" ||
                          loc.city === "Pune"
                          ? loc.x - 12
                          : loc.city === "Kolkata" || loc.city === "Guwahati"
                            ? loc.x + 12
                            : loc.x
                      }
                      y={loc.y - 16}
                      textAnchor={
                        loc.city === "Mumbai" ||
                          loc.city === "Ahmedabad" ||
                          loc.city === "Kochi" ||
                          loc.city === "Pune"
                          ? "end"
                          : loc.city === "Kolkata" || loc.city === "Guwahati"
                            ? "start"
                            : "middle"
                      }
                      fill="#FFBF00"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {loc.city}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <span className="text-sm text-gray-600">Regional Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-sm text-gray-600">Branch Office</span>
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
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Find Your Nearest Branch
          </h2>
          <p className="text-white/80 mb-8">
            Contact us for personalized relocation assistance from your city
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-light transition-colors shadow-lg"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default Network;
