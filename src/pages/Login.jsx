import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import HashLoader from "react-spinners/HashLoader";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(""); // 🔹 Store selected role (patient/doctor)
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const dispatch = authContext?.dispatch;

  if (!dispatch) {
    console.error("Dispatch function is not available in AuthContext");
  }

  // Handle role selection (Patient/Doctor)
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  // Handle input change for email and password
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      const apiEndpoint = role === "doctor" ? `${BASE_URL}/doctor/login` : `${BASE_URL}/auth/login`;
      console.log("Logging in via:", apiEndpoint);
  
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
  
      // ✅ Log user role to debug
      console.log("User data received:", result.user);
  
      if (!result.user || !result.user.role) throw new Error("Invalid response from server!");
  
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
  
      if (dispatch) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: result.user, token: result.token },
        });
      }
  
      toast.success("Login successful!");
  
      // ✅ Debug the role before redirection
      console.log("Redirecting user with role:", result.user.role);
  
      if (result.user.role === "doctor") {
        navigate("/doctor-dashboard"); // ✅ Redirect to doctor dashboard
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  // Handle Google login
  const handleGoogleSuccess = async (response) => {
    const googleToken = response?.credential;
    if (!googleToken) return;
  
    try {
      const email = JSON.parse(atob(googleToken.split(".")[1])).email;
      const isDoctor = role === "doctor"; // Use selected role for Google Login
      const apiEndpoint = isDoctor ? `${BASE_URL}/doctor/google-login` : `${BASE_URL}/auth/google-login`;
  
      console.log("Google login via:", apiEndpoint);
  
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
  
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
  
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: result.user, token: result.token },
      });
  
      toast.success("Google login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Google login failed!");
      console.error(err);
    }
  };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
      <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
  {role === "doctor" ? (
    <>Hello Doctor, <span className="text-primaryColor">Welcome</span> Back 🎉</>
  ) : role === "patient" ? (
    <>Hello User, <span className="text-primaryColor">Welcome</span> Back 🎉</>
  ) : (
    <>Hello! <span className="text-primaryColor">Welcome</span> Back 🎉</>
  )}
</h3>


{/* 🔹 Step 1: Choose Patient or Doctor */}
{!role && (
  <>
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-4">
      {/* Patient Card */}
      <div
        className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg cursor-pointer hover:shadow-lg transition-all w-60"
        onClick={() => handleRoleSelection("patient")}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/921/921347.png" // 👤 Casual patient image
          alt="Patient Icon"
          className="w-24 md:w-36 h-24 md:h-36 mb-2"
        />
        <p className="text-lg font-semibold text-gray-700">Patient</p>
      </div>

      {/* Doctor Card */}
      <div
        className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg cursor-pointer hover:shadow-lg transition-all w-60"
        onClick={() => handleRoleSelection("doctor")}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" // 👨‍⚕️ Doctor with a stethoscope
          alt="Doctor Icon"
          className="w-24 md:w-36 h-24 md:h-36 mb-2"
        />
        <p className="text-lg font-semibold text-gray-700">Doctor</p>
      </div>
    </div>

    {/* 🔹 Buttons in a single row */}
    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
      <button
        onClick={() => handleRoleSelection("patient")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold w-60 text-center"
      >
        Login as Patient
      </button>
      <button
        onClick={() => handleRoleSelection("doctor")}
        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold w-60 text-center"
      >
        Login as Doctor
      </button>
    </div>

    {/* 🔹 "Don't have an account?" moved BELOW role selection */}
    <p className="mt-5 text-textColor text-center">
      Don&apos;t have an account?
      <Link to="/register" className="text-primaryColor font-medium ml-1">
        Register
      </Link>
    </p>
  </>
)}



        {/* 🔹 Step 2: Show Login Form if role is selected */}
        {role && (
          <form className="py-4 md:py-0" onSubmit={submitHandler}>
            <div className="mb-5">
              <input
                type="email"
                placeholder="Enter Your Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>
            <div className="mb-5">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>

            <div className="mt-7">
              <button
                type="submit"
                className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg py-3"
              >
                {loading ? <HashLoader size={25} color="#fff" /> : "Login"}
              </button>
            </div>

            <p className="mt-5 text-textColor text-center">
              Don&apos;t have an account?
              <Link to="/register" className="text-primaryColor font-medium ml-1">
                Register
              </Link>
            </p>

            {/* Google Login Button */}
            <div className="mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Error")}
                useOneTap
              />
            </div>

            {/* 🔹 Back Button to Re-Select Role */}
            <button
              onClick={() => setRole("")}
              className="mt-5 w-full text-primaryColor font-medium underline"
            >
              Back to Role Selection
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Login;
