import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">United Packers & Movers</h3>
            <p>No.1 Packers & Movers in India</p>
          </div>
          <div className="space-y-3">
            <p className="flex items-center gap-3"><FiPhone /> 09704328011</p>
            <p className="flex items-center gap-3"><FiMail /> info@unitedpackers.in</p>
            <p className="flex items-center gap-3"><FiMapPin /> Delhi | Mumbai | Bangalore | All India</p>
          </div>
          <div>
            <p className="text-cyan-300 font-bold">100% Insured • 24×7 Support • ISO Certified</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          © 2025 UnitedPackers.in — Made with passion
        </div>
      </div>
    </footer>
  );
}