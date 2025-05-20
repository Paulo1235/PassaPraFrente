import { useEffect } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authReducer, { decodeToken, getTokenFromCookies, isTokenExpired } from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export function ReduxProvider({ children }) {
  useEffect(() => {
    const token = getTokenFromCookies();

    if (token && isTokenExpired(token)) {
      document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      store.dispatch({ type: "auth/logout" });
    } else if (token) {
      const decodedUser = decodeToken(token);

      if (decodedUser) {
        store.dispatch({
          type: "auth/login",
          payload: decodedUser,
        });
      }
    } else {
      store.dispatch({ type: "auth/logout" });
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
