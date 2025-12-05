import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />

      <main className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

