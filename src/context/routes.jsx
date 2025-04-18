import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // Ensure correct path
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider

// Import pages and components
import OtpVerification from "../pages/OtpVerification";
import Layout from "../layout/Layout"; // Import Layout
import Home from "../pages/Home";
import About from "../components/About/About"
import Services from "../pages/Services";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";
import Doctors from "../pages/Doctors/Doctors";
import Hospital from "../pages/Hospital";
import DoctorsDetails from "../pages/Doctors/DoctorsDetails";
import Pharmacare from "../pages/pharmcare";
import AppointmentPage from "../pages/AppointmentPage";
import Dashboard from "../pages/Dashboard"; // Add the Dashboard page import
import Lab from "../pages/lab";
import LabServices from "../pages/LabServices";
import BookService from "../pages/BookService";
import SpecialisationPage from "../pages/SpecialisationPage";
import DoctorsBySpecialisation from "../pages/DoctorsBySpecialisation";
import LabBookings from "../pages/lab";
import DoctorsList from "../components/Doctors/DoctorList";
import FaqList from '../components/Faq/FaqList';
import Testimonial from '../components/Testimonial/Testimonial';
import DoctorDashboard from '../DoctorPages/DoctorDashboard'

// ProtectedRoute component to ensure users are authenticated
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext); // Check if user is authenticated
  return user ? children : <Navigate to="/login" />; // If user is not authenticated, redirect to login
};

const AppRoutes = () => {
  const clientId = "591370350223-4dc50dfd9vnui4jp2701a8mdkof8cu41.apps.googleusercontent.com"; // Replace with your actual Google Client ID
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Routes>
        {/* Routes without Header/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/otp-verification" element={<OtpVerification />} /> {/* OTP route */}

        {/* Routes with Header/Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/medicine" element={<Pharmacare />} />
          
          <Route path="/faq" element={<FaqList/>} />
          <Route path="/testimonial" element={<Testimonial/>} />
          <Route path="/specialisation" element={<SpecialisationPage />} />
          <Route path="/lab/:labName/services" element={<LabServices />} />
          <Route path="/book-service/:labName/:serviceName" element={<BookService />} />
          <Route path="/specialisation/:specialisationName" element={<DoctorsBySpecialisation />} />
          <Route path="/about" element={<About />}/>

          <Route path="/hospital/:id/doctors" element={<DoctorsList />} />
          
          <Route path="/dashboard/settings" element={<Dashboard activeTab="settings" />} />
        {/* ❌ No Layout for DoctorDashboard (removes header/footer) */}
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Protected Dashboard Route */}
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorsDetails />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/labservices" element={<LabServices />} />
          <Route path="/appointment/:id" element={<ProtectedRoute><AppointmentPage /></ProtectedRoute>} /> {/* Protect appointment route */}

          {/* 404 - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default AppRoutes;
