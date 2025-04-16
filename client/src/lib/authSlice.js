import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// Helper function to get the token from cookies
const getTokenFromCookies = () => {
  const match = document.cookie.match(/(^| )accessToken=([^;]+)/);
  return match ? match[2] : null;
};

export const fetchUserInfo = createAsyncThunk("auth/fetchUserInfo", async (_, { rejectWithValue }) => {
  const token = getTokenFromCookies();
  // console.log("Token from cookies:", token); // Log the token
  if (!token) return rejectWithValue("No token available");

  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/me`, {
      withCredentials: true, // Include credentials in the request
    });
    // console.log("Fetched user info:", response.data); // Log the user info
    return response.data;
  } catch (error) {
    // console.error("Error fetching user info:", error); // Log the error
    return rejectWithValue(error.response?.data || "Failed to fetch full user info");
  }
});


// Helper function to decode the JWT token without external libraries
const decodeToken = (token) => {
  if (!token) return null;

  // Split the token into its parts (header, payload, signature)
  const base64Url = token.split('.')[1];  
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  // Decode base64 URL encoding
  const decodedData = JSON.parse(atob(base64));  // Decode and parse the base64 string into a JSON object
  
  console.log("Decoded token data:", decodedData);  // Log the decoded data to verify
  return decodedData;  // Return decoded user data
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    //? Quando a pagina e iniciada mostra isto
    //userId: decodeToken(getTokenFromCookies()), // Decode id from token on initial load
    //user: fetchUserInfo(),
    isAuthenticated: !!getTokenFromCookies(), // Check if token exists in cookies
  },
  reducers: {
    //? Quando atualiza a pagina, mostra isto
    login: (state) => {
      state.userId = decodeToken(getTokenFromCookies()); // Decode id from token all the time
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userId = null;
      state.isAuthenticated = false;
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
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
