
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Sau này bạn có thể thêm productReducer, orderReducer... ở đây
  },
});

export default store;