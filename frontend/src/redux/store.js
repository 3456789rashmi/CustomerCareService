import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import servicesReducer from './slices/servicesSlice'; // create empty stub if not present
import bookingsReducer from './slices/bookingsSlice'; // create stub if not present

export default configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    bookings: bookingsReducer,
  }
});
