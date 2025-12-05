import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

export default function RegisterModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  if (!isOpen) return null;

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid Email').required('Required'),
      password: Yup.string().min(6,'At least 6 chars').required('Required'),
    }),
    onSubmit: async (values) => {
      const res = await dispatch(registerUser(values));
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Registered');
        onClose();
      } else {
        toast.error(res.payload || 'Registration failed');
      }
    },
  });

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white w-96 rounded-lg p-6 shadow'>
        <h2 className='text-xl font-semibold mb-4'>Register</h2>
        <form onSubmit={formik.handleSubmit} className='space-y-4'>
          <input name='name' placeholder='Full name' className='w-full border p-2 rounded' onChange={formik.handleChange} value={formik.values.name} />
          <input name='email' type='email' placeholder='Email' className='w-full border p-2 rounded' onChange={formik.handleChange} value={formik.values.email} />
          <input name='password' type='password' placeholder='Password' className='w-full border p-2 rounded' onChange={formik.handleChange} value={formik.values.password} />
          <button type='submit' className='w-full bg-green-600 text-white py-2 rounded'>Register</button>
        </form>
        <button onClick={onClose} className='mt-4 text-sm underline'>Close</button>
      </div>
    </div>
  );
}

