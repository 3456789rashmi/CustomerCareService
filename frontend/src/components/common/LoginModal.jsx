import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

export default function LoginModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(s => s.auth);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (!isOpen) return null;

  const initialValues = { email: '', password: '' };
  const validation = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6,'Min 6 chars').required('Required')
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <h3 className="text-xl font-semibold mb-4">Login</h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={async (values) => {
            const res = await dispatch(loginUser(values));
            if (res.type === 'auth/loginUser/fulfilled') {
              toast.success('Login successful');
              onClose();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label className="block mb-2">Email</label>
              <Field name="email" type="email" className="w-full p-2 border rounded" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

              <label className="block mt-4 mb-2">Password</label>
              <Field name="password" type="password" className="w-full p-2 border rounded" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

              <div className="flex justify-between items-center mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  disabled={loading || isSubmitting}
                >
                  {loading ? 'Logging...' : 'Login'}
                </button>

                <button onClick={onClose} type="button" className="text-sm text-gray-600">Cancel</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
