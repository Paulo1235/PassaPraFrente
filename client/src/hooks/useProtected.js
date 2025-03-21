import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UserAuth from "./userAuth";

export default function Protected({ children }) {
  const isAuthenticated = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]); 

  if (!isAuthenticated) {
    return null; 
  }

  return children;
}
