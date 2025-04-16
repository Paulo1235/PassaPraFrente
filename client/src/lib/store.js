import React, { useEffect } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authReducer from "./authSlice";

// Helper function to get the token from cookies
const getTokenFromCookies = () => {
  const match = document.cookie.match(/(^| )accessToken=([^;]+)/);
  console.log(match)
  return match ? match[2] : null;
};

// Helper function to decode the JWT token manually
const decodeToken = (token) => {
  if (!token) return null;

  // Split the token into its parts (header, payload, signature)
  const base64Url = token.split('.')[1];  
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  // Decode base64 URL encoding
  const decodedData = JSON.parse(atob(base64));  // Decode and parse the base64 string into a JSON object
  
  console.log("Decoded token data:", decodedData);  // Log the decoded data to verify
  return decodedData;  // Return decoded user data
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export function ReduxProvider({ children }) {
  useEffect(() => {
    // Check for existing token on mount
    const token = getTokenFromCookies();

    if (token) {
      const decodedUser = decodeToken(token); // Decode the user data from the token

      if (decodedUser) {
        // Dispatch login action with decoded user info
        store.dispatch({
          type: "auth/login",
          payload: decodedUser, // Set user information
        });
      }
    } else {
      store.dispatch({ type: "auth/logout" }); // No token, logout
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
