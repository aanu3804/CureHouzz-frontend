import { useContext, useEffect, useState } from "react"; 
import { Navigate } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext"; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useContext(AuthContext);
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}"); 
      const storedToken = localStorage.getItem("token");

      // ✅ Log stored user data for debugging
      console.log("Stored user data:", storedUser);

      if (storedUser?.role && storedToken) {
        setIsAllowed(allowedRoles.includes(storedUser.role));
      } else {
        setIsAllowed(false);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setIsAllowed(false);
    }
  }, [allowedRoles]);

  if (isAllowed === null) {
    return <h2 className="text-center text-xl font-bold mt-10">Checking Access...</h2>;
  }

  return token && isAllowed ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
