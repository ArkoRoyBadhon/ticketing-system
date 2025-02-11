import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout() {
      return { user: null, token: null };
    },

  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
