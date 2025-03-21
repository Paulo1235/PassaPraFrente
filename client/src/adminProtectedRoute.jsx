import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchUserInfo } from "./lib/authSlice";

const AdminProtectedRoute = ({ element }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserInfo());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user?.message?.TipoUtilizador === "admin") {
    return element;
  } else {
    return <Navigate to="/index" replace />;
  }
};

export default AdminProtectedRoute;
