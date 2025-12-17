import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from "react-icons/fi";
import { FaImages, FaTruck, FaBoxOpen, FaWarehouse } from "react-icons/fa";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Photos", icon: FaImages },
    { id: "packing", label: "Packing", icon: FaBoxOpen },
    { id: "moving", label: "Moving", icon: FaTruck },
    { id: "storage", label: "Storage", icon: FaWarehouse },
  ];

  const galleryImages = [
    {
      id: 1,
      src: "/household.jpg",
      category: "moving",
      title: "Household Shifting",
      desc: "Complete home relocation services with care",
    },
    {
      id: 2,
      src: "/loading-unloading.jpg",
      category: "moving",
      title: "Loading & Unloading",
      desc: "Professional loading and unloading services",
    },
    {
      id: 3,
      src: "/insurance.jpg",
      category: "packing",
      title: "Insurance Coverage",
      desc: "Full insurance protection for your belongings",
    },
    {
      id: 4,
      src: "/loading.jpg",
      category: "moving",
      title: "Secure Loading",
      desc: "Careful loading of your belongings",
    },
    {
      id: 5,
      src: "/8-Years-Working-Exprience.jpg",
      category: "moving",
      title: "8+ Years Experience",
      desc: "Trusted expertise in relocation services",
    },
    {
      id: 6,
      src: "/images.jpg",
      category: "packing",
      title: "Our Services",
      desc: "Complete packing and moving solutions",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
      category: "storage",
      title: "Warehouse Storage",
      desc: "Climate-controlled storage facilities",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=400&fit=crop",
      category: "packing",
      title: "Packing Materials",
      desc: "Quality packing supplies for all items",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      category: "moving",
      title: "New Home Setup",
      desc: "Unpacking and arranging at destination",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop",
      category: "storage",
      title: "Organized Storage",
      desc: "Systematic inventory management",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop",
      category: "moving",
      title: "Professional Team",
      desc: "Trained experts for efficient moving",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1600573472591-ee6c8e695481?w=600&h=400&fit=crop",
      category: "packing",
      title: "Box Packing",
      desc: "Secure packaging for all items",
    },
  ];

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const currentIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Work <span className="text-light">Gallery</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Take a visual journey through our professional moving and packing
              services
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === cat.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <cat.icon className="mr-2" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg">
                        {image.title}
                      </h3>
                      <p className="text-white/80 text-sm">{image.desc}</p>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FiZoomIn className="text-white text-2xl" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <FiX className="text-2xl" />
            </button>

            {/* Navigation */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <FiChevronLeft className="text-2xl" />
              </button>
            )}
            {currentIndex < filteredImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <FiChevronRight className="text-2xl" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedImage.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[80vh] relative"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white font-bold text-xl">
                  {selectedImage.title}
                </h3>
                <p className="text-white/80">{selectedImage.desc}</p>
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
              {currentIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundImage: 'url(/surety.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Orange overlay with 90% opacity */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(245, 166, 35, 0.9)' }}></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
