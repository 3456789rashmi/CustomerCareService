import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { logout } from '../../redux/slices/authSlice';

export default function Navbar() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 shadow">
        <Link to="/" className="text-xl font-bold">Packers & Movers</Link>

        <div className="space-x-4 flex items-center">
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>

          {user ? (
            <>
              <Link to="/dashboard" className="px-3 py-1 rounded bg-gray-100">{user.name?.split(' ')[0]}</Link>
              <button className="text-sm" onClick={() => dispatch(logout())}>Logout</button>
            </>
          ) : (
            <>
              <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => setLoginOpen(true)}>Login</button>
              <button className="px-3 py-1 rounded border" onClick={() => setRegisterOpen(true)}>Register</button>
            </>
          )}
        </div>
      </nav>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
}
