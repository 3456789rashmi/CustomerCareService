import { createSlice } from '@reduxjs/toolkit';
const servicesSlice = createSlice({
  name: 'services',
  initialState: { list: [], loading: false, error: null },
  reducers: {}
});
export default servicesSlice.reducer;
