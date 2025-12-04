import { createSlice } from '@reduxjs/toolkit';
const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: { list: [], loading: false, error: null },
  reducers: {}
});
export default bookingsSlice.reducer;
