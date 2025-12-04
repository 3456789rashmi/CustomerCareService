import React, { useState } from 'react';
import LoginModal from './LoginModal.jsx';
import RegisterModal from './RegisterModal.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

export default function Navbar() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 shadow">
        <div className="text-xl font-bold">Packers & Movers</div>
        <div className="space-x-4 flex items-center">
          <button onClick={() => setLoginOpen(true)} className="px-3 py-1 rounded bg-blue-600 text-white">Login</button>
          <button onClick={() => setRegisterOpen(true)} className="px-3 py-1 rounded border">Register</button>
          {user && <button onClick={() => dispatch(logout())}>Logout</button>}
        </div>
      </nav>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
}
