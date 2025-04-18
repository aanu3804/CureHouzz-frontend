import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

import { useLocation } from "react-router-dom"; 

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [labBookings, setLabBookings] = useState([]);
    const [medicineOrders, setMedicineOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.pathname.includes("settings") ? "settings" : "profile");
    const [address, setAddress] = useState("Fetching location...");
    const [editName, setEditName] = useState(user?.name || "");
    const [editGender, setEditGender] = useState(user?.gender || "");
    const [editDob, setEditDob] = useState(user?.dob || "");
    const [editAge, setEditAge] = useState(user?.age || "");
    const [editPhone, setEditPhone] = useState(user?.phone || "");
    const [showMessage, setShowMessage] = useState(false);
    const [password, setPassword] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");



    useEffect(() => {
        const fetchData = async () => {
            if (user?.email) {
                try {
                    const [appointmentsRes, labsRes, medicineRes] = await Promise.all([
                        fetch(`http://localhost:5000/appointments/${encodeURIComponent(user.email)}`),
                        fetch(`http://localhost:5000/lab/${encodeURIComponent(user.email)}`),
                        fetch(`http://localhost:5000/book-medicine/${encodeURIComponent(user.email)}`),
                    ]);
    
                    const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : [];
                    const labsData = labsRes.ok ? await labsRes.json() : [];
                    const medicineData = medicineRes.ok ? await medicineRes.json() : [];
    
                    console.log("🩺 Appointments Data:", appointmentsData);
    
                    setAppointments(appointmentsData);
                    setLabBookings(labsData);
                    setMedicineOrders(medicineData);
                } catch (error) {
                    console.error("❌ Error fetching data:", error.message);
                } finally {
                    setLoading(false);
                }
            }
        };
    
        fetchData();
    }, [user?.email]);
    

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
    
                    console.log("📍 Latitude:", latitude, " | Longitude:", longitude);
    
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
    
                        setAddress(data.display_name || "Location not found");
                    } catch (error) {
                        console.error("❌ Error fetching location:", error.message);
                        setAddress("Unable to fetch location");
                    }
                },
                (error) => {
                    console.error("❌ Geolocation error:", error.message);
                    setAddress("Location access denied or unavailable");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Improved accuracy settings
            );
        } else {
            setAddress("Geolocation not supported");
        }
    }, []);
    
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
    
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age;
    };
    
    const handleUpdateProfile = async () => {
        try {
            const response = await fetch(`http://localhost:5000/update-profile/${encodeURIComponent(user.email)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editName,
                    gender: editGender,
                    dob: editDob,
                    age: editAge,
                    phone: editPhone
                })
            });
            
            const data = await response.json();
            
            if (data.logout) {
                // Show success message
                alert("✅ Details saved successfully! You'll be logged out after clicking Ok ....");
                
                // Wait for 5 seconds before logging out
                setTimeout(() => {
                    // Clear user authentication state
                    localStorage.removeItem("user");
                    sessionStorage.clear();
                    // Redirect to login page
                    window.location.href = "/login";
                }, 1000);
            } else if (response.ok) {
                alert("✅ Profile updated successfully!");
                // Optionally, update the context or refetch user data
            } else {
                console.error("❌ Failed to update profile");
                alert(data.message || "❌ Failed to update profile");
            }
        } catch (error) {
            console.error("❌ Error updating profile:", error.message);
            alert("Something went wrong. Please try again.");
        }
    };
    
    const handleDeleteAccount = async () => {
        try {
            // Validate password first (Using Login API)
            const loginResponse = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, password }),
            });
    
            const loginData = await loginResponse.json();
    
            if (!loginResponse.ok) {
                setErrorMessage("Incorrect password. Please try again.");
                return;
            }
    
            // Proceed to delete account after password validation
            const deleteResponse = await fetch(`http://localhost:5000/delete-account/${encodeURIComponent(user.email)}`, {
                method: "DELETE",
            });
    
            if (deleteResponse.ok) {
                alert("✅ Account deleted successfully! You'll be logged out.");
                
                setTimeout(() => {
                    // Clear user authentication state
                    localStorage.removeItem("user");
                    sessionStorage.clear();
    
                    // Redirect to login page
                    window.location.href = "/login";
                }, 1000); // Show message for 5 seconds before logging out
            } else {
                console.error("❌ Error deleting account.");
                alert("Error deleting account. Please try again.");
            }
        } catch (error) {
            console.error("❌ Error:", error.message);
            alert("Something went wrong. Please try again.");
        }
    };
    

    const handleDobChange = (e) => {
        const newDob = e.target.value;
        setEditDob(newDob);
        setEditAge(calculateAge(newDob));
    };
    const handleDeleteMedicineOrder = async (order) => {
        if (!window.confirm(`Delete medicine order for ${order.medicine}?`)) return;
        try {
            const response = await fetch(
                `http://localhost:5000/book-medicine/${encodeURIComponent(user.email)}/${encodeURIComponent(order.medicine)}`,
                { method: "DELETE" }
            );
            if (response.ok) {
                alert("✅ Medicine order deleted successfully!");
                setMedicineOrders((prev) => prev.filter((item) => item !== order));
            } else {
                console.error("❌ Failed to delete medicine order");
            }
        } catch (error) {
            console.error("❌ Error deleting medicine order:", error.message);
        }
    };

    const handleDeleteLabBooking = async (labTest) => {
        if (!window.confirm(`Delete lab booking for ${labTest.service} at ${labTest.lab} on ${labTest.date}?`)) return;

        try {
            const response = await fetch(
                `http://localhost:5000/lab/${encodeURIComponent(user.email)}/${encodeURIComponent(labTest.date)}/${encodeURIComponent(labTest.time)}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                alert("✅ Lab booking deleted successfully!");
                setLabBookings((prev) => prev.filter((item) => item !== labTest));
            } else {
                console.error("❌ Failed to delete lab booking");
            }
        } catch (error) {
            console.error("❌ Error deleting lab booking:", error.message);
        }
    };

    const handleDeleteAppointment = async (appointment) => {
        if (!window.confirm(`Delete doctor appointment with Dr. ${appointment.doctorName} on ${appointment.date}?`)) return;

        try {
            const response = await fetch(
                `http://localhost:5000/appointments/${encodeURIComponent(user.email)}/${encodeURIComponent(appointment.date)}/${encodeURIComponent(appointment.time)}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                alert("✅ Doctor appointment deleted successfully!");
                setAppointments((prev) => prev.filter((item) => item !== appointment));
            } else {
                console.error("❌ Failed to delete doctor appointment");
            }
        } catch (error) {
            console.error("❌ Error deleting doctor appointment:", error.message);
        }
    };

    return (
        <div className="flex min-h-screen font-sans bg-gray-100">
 <div className="w-64 bg-blue-800 text-white p-6">
    <h3 className="text-lg font-semibold mb-6">📜 Menu</h3>
    <ul className="space-y-3">
        {[
            { name: "👤 Profile", key: "profile" },
            { name: "🩺 Doctor Appointments", key: "doctorAppointments" },
            { name: "🧪 Lab Bookings", key: "labBookings" },
            { name: "💊 Medicine Orders", key: "medicineOrders" },
            { name: "⚙️ Settings", key: "settings" },
            { name: "🗑️ Delete Account", key: "deleteAccount" },
        ].map((item) => (
            <li
                key={item.key}
                className={`p-3 rounded cursor-pointer flex items-center ${
                    activeTab === item.key ? "bg-blue-600" : "hover:bg-blue-500"
                }`}
                onClick={() => setActiveTab(item.key)}
            >
                <span className="mr-2">{item.name.split(" ")[0]}</span> {/* Extracting emoji */}
                {item.name.substring(2)} {/* Removing emoji from text */}
            </li>
        ))}
    </ul>
</div>
            <div className="flex-1 p-6">
            {activeTab === "profile" && (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
            <span className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl mr-2">
                {user?.name ? user.name.charAt(0).toUpperCase() : "N"}
            </span>
            Profile
        </h2>

        <div className="flex flex-col space-y-4 text-lg">
            {[
                { 
                    label: user?.gender?.toLowerCase() === "male" ? "👦 Name" : user?.gender?.toLowerCase() === "female" ? "👧 Name" : "👤 Name", 
                    value: user?.name || "N/A" 
                },
                { label: "📧 Email", value: user?.email || "N/A" },
                { label: "⚧ Gender", value: user?.gender.toUpperCase() || "N/A" },
                { label: "🎂 Date-Of-Birth", value: user?.dob || "N/A" },
                { label: "📅 Age", value: user?.age || "N/A" },
                { label: "📞 Phone", value: user?.phone || "N/A" },
            ].map((item, index) => (
                <div 
                    key={index} 
                    className="bg-gray-100 px-3 py-2 rounded-md shadow flex items-center"
                > 
                    <strong className="mr-2">{item.label}:</strong>
                    <span className="text-gray-800">{item.value}</span>
                </div>
            ))}

            {/* Address Section - Fixed Alignment */}
            <div className="bg-gray-100 px-3 py-2 rounded-md shadow flex flex-col">
                <strong className="mr-2">📍 Address:</strong>
                <span className="text-gray-800">{address || "N/A"}</span>
            </div>
        </div>
    </div>
)}
{activeTab === "doctorAppointments" && (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">🩺 Doctor Appointments</h2>

        {/* Total Doctor Appointments Box */}
<div className="flex items-center justify-center p-4 border border-gray-400 rounded-lg shadow bg-blue-100 text-blue-900 mb-6">
    <h3 className="text-lg font-semibold text-blue-800 flex items-center">
        🩺 Total Doctor Appointments:
    </h3>
    <span className="text-2xl font-bold ml-2">{appointments.length}</span>
</div>

        {loading ? (
            <p className="text-center">Loading...</p>
        ) : appointments.length === 0 ? (
            <p className="text-gray-600 mt-4 text-center">No doctor appointments yet.</p>
        ) : (
            appointments.map((appointment, index) => (
                <div key={index} className="p-4 border-2 border-gray-300 rounded-lg shadow bg-gray-100 mb-3">
                    <h3 className="text-lg font-semibold bg-blue-500 text-white p-2 rounded-lg text-center">
                        🏥 Appointment {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-lg p-2">
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>👨‍⚕️ Doctor:</strong> {appointment.doctorName}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>📅 Date:</strong> {appointment.date}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>⏰ Time:</strong> {appointment.time}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>🏥 Hospital:</strong> {appointment.hospital}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>🙍‍♂️ Patient Name:</strong> {appointment.patientName}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>📧 Email:</strong> {appointment.email || "N/A"}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>📞 Phone Number:</strong> {appointment.phone || "N/A"}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>🎯 Specialization:</strong> {appointment.specialization}
                        </div>
                    </div>
                    <button
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                        onClick={() => handleDeleteAppointment(appointment)}
                    >
                         Delete Appointment
                    </button>
                </div>
            ))
        )}
    </div>
)}
{activeTab === "labBookings" && (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">🧪 Lab Bookings</h2>

{/* Total Lab Bookings Box */}
<div className="flex items-center justify-center p-4 border border-gray-400 rounded-lg shadow bg-green-100 text-green-900 mb-6">
    <h3 className="text-lg font-semibold text-green-800 flex items-center">
        🧪 Total Lab Bookings:
    </h3>
    <span className="text-2xl font-bold ml-2">{labBookings.length}</span>
</div>
        {loading ? (
            <p className="text-center">Loading...</p>
        ) : labBookings.length === 0 ? (
            <p className="text-gray-600 mt-4 text-center">No lab test bookings yet.</p>
        ) : (
            labBookings.map((labTest, index) => (
                <div key={index} className="p-4 border-2 border-gray-300 rounded-lg shadow bg-gray-100 mb-3">
                    <h3 className="text-lg font-semibold bg-blue-500 text-white p-2 rounded-lg text-center">
                        🔬 Lab Booking {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-lg p-2">
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>🧪 Test:</strong> {labTest.service}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>🏥 Lab:</strong> {labTest.lab}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>📅 Date:</strong> {labTest.date}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>⌚ Time:</strong> {labTest.time}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>🙍‍♂️ Patient Name:</strong> {labTest.name}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>📧 Email:</strong> {user.email}
                        </div>
                        <div className="border border-gray-400 p-2 rounded-md bg-white">
                            <strong>📞 Phone:</strong> {user.phone}
                        </div>
                    </div>
                    <button
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                        onClick={() => handleDeleteLabBooking(labTest)}
                    >
                         Delete Lab Booking
                    </button>
                </div>
            ))
        )}
    </div>
)}
{activeTab === "medicineOrders" && (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">💊 Medicine Orders</h2>
        {/* Total Medicine Orders Box */}
        <div className="flex items-center justify-center p-4 border border-gray-400 rounded-lg shadow bg-purple-100 text-purple-900 mb-6">
            <h3 className="text-lg font-semibold text-purple-800 flex items-center">
                📦 Total Medicine Orders:
            </h3>
            <span className="text-2xl font-bold ml-2">{medicineOrders.length}</span>
        </div>
        {loading ? (
            <p className="text-center">Loading...</p>
        ) : medicineOrders.length === 0 ? (
            <p className="text-gray-600 mt-4 text-center">No medicine orders yet.</p>
        ) : (
            medicineOrders.map((order, index) => (
                <div key={index} className="p-4 border rounded-lg shadow bg-gray-100 mb-3">
                    <h3 className="text-lg font-semibold bg-purple-500 text-white p-2 rounded-lg">
                        📦 Order {index + 1}
                    </h3>
                    <div className="flex flex-col space-y-3 p-2">
                        <div className="border p-3 rounded-lg bg-white shadow">
                            <strong>🙍‍♂️ Name:</strong> {order.userName}
                        </div>
                        <div className="border p-3 rounded-lg bg-white shadow">
                            <strong>📧 Email:</strong> {order.email}
                        </div>
                        <div className="border p-3 rounded-lg bg-white shadow">
                            <strong>📞 Phone:</strong> {order.phone}
                        </div>
                        <div className="border p-3 rounded-lg bg-white shadow">
                            <strong>⚕️ Medicine:</strong> {order.medicine}
                        </div>
                        <div className="border p-3 rounded-lg bg-white shadow">
                            <strong>🛒 Quantity:</strong> {order.quantity}
                        </div>
                        <div className="border p-3 rounded-lg bg-white shadow">
                            <strong>📅 Order Date:</strong> {new Date(order.timestamp).toLocaleDateString()}
                        </div>
                        <div className="border p-3 rounded-lg bg-white shadow">
                            <strong>💰 Price:</strong> ${order.price}
                        </div>
                        <div className="border p-3 rounded-lg bg-white shadow">
                            <strong>🏠 Address:</strong> {order.address}
                        </div>
                    </div>
                    <button
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleDeleteMedicineOrder(order)}
                    >
                         Delete Medicine Order
                    </button>
                </div>
            ))
        )}
    </div>
)}
{activeTab === "settings" && (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">⚙️ Update Profile</h2>

        <div className="flex flex-col space-y-4 text-lg">
            <div className="flex flex-col">
                <label className="font-semibold">👨‍💼 Name:</label>
                <input
                    type="text"
                    className="border px-3 py-2 rounded-md"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                />
            </div>
            <div className="flex flex-col">
                <label className="font-semibold">⚧ Gender:</label>
                <select
                    className="border px-3 py-2 rounded-md"
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold">🎂 Date of Birth:</label>
                <input
                    type="date"
                    className="border px-3 py-2 rounded-md"
                    value={editDob}
                    onChange={handleDobChange}
                />
            </div>
            <div className="flex flex-col">
                <label className="font-semibold">📅 Age:</label>
                <input
                    type="number"
                    className="border px-3 py-2 rounded-md bg-gray-100"
                    value={editAge}
                    readOnly
                />
            </div>
            <div className="flex flex-col">
                <label className="font-semibold">📞 Phone:</label>
                <input
                    type="text"
                    className="border px-3 py-2 rounded-md"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                />
            </div>
            
            {/* Save Changes Button */}
            <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={handleUpdateProfile}
            >
                Save Changes
            </button>

            {/* Popup Message */}
        </div>
    </div>
)}
{activeTab === "deleteAccount" && (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Delete Account</h2>

        <p className="text-gray-700 text-center mb-4">
        ⚠️ Warning: Deleting your account will remove all your data permanently. This action cannot be undone.
        </p>

        {/* Password Input */}
        <div className="flex flex-col mb-4">
            <label className="font-semibold">&nbsp; Enter Your Password one last time to Delete your Account 👇</label>
            <input
                type="password"
                className="border px-3 py-2 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        {/* Error Message */}
        {errorMessage && <p className="text-red-600 text-center mb-2">{errorMessage}</p>}

        {/* Delete Account Button */}
        <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
            onClick={handleDeleteAccount}
        >
            Permanently Delete My Account
        </button>
    </div>
)}

            </div>
        </div>
    );
};
export default Dashboard;