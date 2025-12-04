import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import Home from "./pages/Home.jsx";

import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Quote from './pages/Quote';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}