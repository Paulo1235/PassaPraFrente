import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchUserInfo } from "../../lib/authSlice";

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
    return (
      <div className="flex bg-bgp h-screen justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b892f]"></div>
      </div>
    );
  }

  if (user?.message?.TipoUtilizador === "admin") 
  {
    return element;
  } else {
    return <Navigate to="/index" replace />;
  }
};

export default AdminProtectedRoute;
