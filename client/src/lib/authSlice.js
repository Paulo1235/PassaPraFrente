import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const getTokenFromCookies = () => {
  const match = document.cookie.match(/(^| )accessToken=([^;]+)/);
  return match ? match[2] : null;
};

export const decodeToken = (token) => {
  if (!token) return null;

  const base64Url = token.split('.')[1];  
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedData = JSON.parse(atob(base64));
  
  return decodedData;
};

export const isTokenExpired = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) return true;

  const expirationDate = decodedToken.exp * 1000;
  
  return Date.now() > expirationDate;
};

export const fetchUserInfo = createAsyncThunk("auth/fetchUserInfo", async (_, { rejectWithValue }) => {
  const token = getTokenFromCookies();
  if (!token || isTokenExpired(token)) return rejectWithValue("Token expired");

  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch full user info");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!getTokenFromCookies(),
    userId: decodeToken(getTokenFromCookies()),
    user: null,
    status: null,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userId = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;

        if (action.payload === "Token expired") {
          state.isAuthenticated = false;
          state.userId = null;
        }
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
