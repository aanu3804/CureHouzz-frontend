import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/login"); // ✅ Redirect if user is not a doctor
    }
  }, [user, navigate]);

  if (!user) {
    return <h2 className="text-center text-xl font-bold mt-10">Loading...</h2>;
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  
    navigate("/login", { replace: true }); // ✅ Prevents back button navigation
    window.location.reload(); // ✅ Ensures a fresh state after logout
  };
  

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, Dr. {user.firstName} {user.lastName}</h2>
        <p className="text-lg text-gray-600">{user.specialization}</p>
        <p className="text-md text-gray-500">{user.hospitalName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Experience:</strong> {user.experience} years</p>

        <div className="mt-6 flex justify-center">
        <button
  onClick={handleLogout} // ✅ Use the correct logout function
  className="bg-red-500 text-white px-5 py-2 rounded-md"
>
  Logout
</button>

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
