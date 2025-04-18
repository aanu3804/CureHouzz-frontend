import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "/node_modules/@fortawesome/fontawesome-free/css/all.min.css";

const specialisations = [
  { id: 1, name: "Cardiology", image: "https://thumbs.dreamstime.com/z/cardiologist-working-digital-device-hands-lab-wit-doctor-holding-tablet-drawing-heart-title-88757628.jpg" },
  { id: 2, name: "Neurology", image: "https://www.beamshospital.in/wp-content/uploads/elementor/thumbs/neuro-physician-beams-hospital-640x631-pr445e5nhkd5afekzfjcaa85lq53oknvxxu9ax38d0.jpg" },
  { id: 3, name: "Orthopedics", image: "https://onphospitals.com/wp-content/uploads/2022/05/Blog-image.jpg" },
  { id: 4, name: "Dermatology", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLJED5mPcJsLWi29hGj1OaoTR5OOePA5-iIA&s" },
  { id: 5, name: "Pediatrics", image: "https://www.northshore.org/globalassets/healthy-you/blog/2012-2014/pediatric-appointments.jpg" },
];

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isDoctor = user?.role === "doctor"; // ✅ Detect if user is a doctor

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSpecializationOpen, setSpecializationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const specializationRef = useRef(null);
  const [location, setLocation] = useState("Fetching location...");

  // 🔹 Fetch Accurate Location with High Accuracy
  useEffect(() => {
    const fetchLocation = async () => {
      if (!user) return;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`📍 Coordinates: Latitude: ${latitude}, Longitude: ${longitude}`);

            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();

              if (data?.address) {
                const city = data.address.city || data.address.town || "Unknown";
                const state = data.address.state || "Unknown";
                setLocation(`${city}, ${state}`);
              } else {
                setLocation("Location not found");
              }
            } catch (error) {
              console.error("❌ Error fetching location:", error);
              setLocation("Location unavailable");
            }
          },
          (error) => {
            console.error("❌ Geolocation error:", error.message);
            setLocation("Location unavailable");
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      } else {
        setLocation("Geolocation not supported");
      }
    };

    fetchLocation();
  }, [user]);

  // 🔹 Clear Location Data on Logout
  const handleLogout = () => {
    logout();
    setLocation("Fetching location...");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (specializationRef.current && !specializationRef.current.contains(event.target)) {
        setSpecializationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <nav className="main-menu-wrapper bg-white shadow-md w-full z-10">
        <div className="bg-white shadow-md">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <Link to="/">
                <img src="/curehouzz logo.png" alt="Logo" className="h-12 w-25 cursor-pointer" />
              </Link>
              <div className="ml-2 text-sm">
                <div className="flex items-center">
                  <p>📍</p>
                  <span className="ml-2">{location}</span>
                </div>
                <div className="text-xs text-gray-500">Home Delivery & Store Pickup Available</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase() } 
                      
                    </div>
                    <span className="text-gray-800 font-medium">{user.name}</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                      <Link to={isDoctor ? "/doctor-dashboard" : "/dashboard"} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-500 bg-transparent border-2 border-blue-500 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition duration-200"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>

          {/* ❌ Hide these links for doctors */}
          {!isDoctor && (
            <div className="border-t">
              <div className="flex justify-center py-2 space-x-6">
                <Link to="/doctors" className="text-black-500">Doctors</Link>
                <div 
                  className="relative group"
                  onMouseEnter={() => setSpecializationOpen(true)}
                  onMouseLeave={() => setSpecializationOpen(false)}
                >
                  <button className="text-black-500">Specialisations</button>
                  {isSpecializationOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-2 rounded-lg w-48 z-20">
                      <ul className="space-y-1">
                        {specialisations.slice(0, 4).map((speciality) => (
                          <li 
                            key={speciality.id} 
                            className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => navigate(`/specialisation/${encodeURIComponent(speciality.name)}`)}
                          >
                            <img src={speciality.image} alt={speciality.name} className="w-6 h-6 rounded-full" />
                            <span>{speciality.name}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-blue-500 text-center p-2 cursor-pointer font-semibold hover:underline" onClick={() => navigate("/specialisation")}>
                        View All
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/lab" className="text-black-500">Lab Bookings</Link>
                <Link to="/medicine" className="text-black-500">Medicine Order</Link>
                <Link to="/hospital" className="text-black-500">Hospitals</Link>
                <Link to="/contact" className="text-black-500">Help</Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
