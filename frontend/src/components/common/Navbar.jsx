import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import LoginModal from './LoginModal.jsx';
import RegisterModal from './RegisterModal.jsx';

export default function Navbar() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <nav className='px-6 py-4 shadow flex justify-between bg-white items-center'>
        <Link to='/' className='text-xl font-bold'>Packers & Movers</Link>

        <div className='flex items-center gap-4'>
          <Link to='/services'>Services</Link>
          <Link to='/contact'>Contact</Link>

          {!user ? (
            <>
              <button onClick={() => setLoginOpen(true)} className='px-3 py-1 bg-blue-600 text-white rounded'>Login</button>
              <button onClick={() => setRegisterOpen(true)} className='px-3 py-1 border rounded'>Register</button>
            </>
          ) : (
            <>
              <span className='px-3 py-1 border rounded'>Hi, {user.name}</span>
              <button onClick={() => dispatch(logout())} className='text-sm underline'>Logout</button>
            </>
          )}
        </div>
      </nav>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
}

