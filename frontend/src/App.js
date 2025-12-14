import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import {
  ProtectedRoute,
  AdminRoute,
  GuestRoute,
} from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Quote from "./pages/Quote";
import Contact from "./pages/Contact";
import Clients from "./pages/Clients";
import Gallery from "./pages/Gallery";
import Network from "./pages/Network";
import Enquiry from "./pages/Enquiry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import QuoteTracking from "./pages/QuoteTracking";
import TrackShipment from "./pages/TrackShipment";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

// Layout component to conditionally show Navbar/Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavFooter = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen bg-neutral flex flex-col">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideNavFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/quote" element={
              <ProtectedRoute>
                <Quote />
              </ProtectedRoute>
            } />
            <Route path="/contact" element={<Contact />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/network" element={<Network />} />
            <Route path="/enquiry" element={
              <ProtectedRoute>
                <Enquiry />
              </ProtectedRoute>
            } />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPassword />
                </GuestRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quote-tracking/:quoteId"
              element={
                <ProtectedRoute>
                  <QuoteTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/track-shipment"
              element={
                <ProtectedRoute>
                  <TrackShipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
