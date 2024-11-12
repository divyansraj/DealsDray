import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";

const store = configureStore({
  reducer: {
    authentication: AuthSlice,
  },
});


export default store;