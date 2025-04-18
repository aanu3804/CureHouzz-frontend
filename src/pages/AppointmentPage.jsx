import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { doctors } from "../assets/data/doctor";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const AppointmentPage = () => {
  const { id } = useParams();
  const doctor = doctors.find((doc) => doc.id === id);

  const { user } = useContext(AuthContext); // Get user data from AuthContext
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Updated available time slots (10 AM - 5 PM with 1-hour gap)
  const availableTimes = [
    "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  // Fetch email from AuthContext when user logs in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  if (!doctor) {
    return <p className="text-center mt-5">Doctor not found!</p>;
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !patientName || !email || !phone) {
      alert("⚠ Please fill all fields!");
      return;
    }

    const appointmentData = {
      doctorName: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      date: selectedDate,
      time: selectedTime,
      fee: 5000,
      patientName,
      email,
      phone,
    };

    try {
      const response = await fetch("https://curehouzz-backend.onrender.com/save-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        alert("✅ Appointment booked successfully!");
      } else {
        alert("❌ Error booking appointment.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Doctor Information */}
      <div className="flex flex-col sm:flex-row bg-white p-6 rounded-lg shadow-lg">
        <img 
          src={doctor.photo} 
          className="w-full sm:w-1/3 h-auto rounded-lg object-cover" 
          alt={doctor.name} 
        />
        <div className="sm:ml-6 flex flex-col justify-center">
          <h1 className="text-2xl font-bold">{doctor.name} <span className="text-blue-600">✔</span></h1>
          <p className="text-gray-600 text-lg">{doctor.specialization} - {doctor.totalPatients} patients</p>
          <p className="text-gray-500">At {doctor.hospital}</p>
          <p className="font-bold text-lg mt-2">Appointment fee: <span className="text-blue-600">5000</span></p>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Select Date (dd-mm-yyyy)</h2>
        <input
          type="date"
          className="mt-2 p-2 border border-gray-300 rounded-lg"
          min={new Date().toISOString().split("T")[0]} // Restrict past dates
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Time Slots */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Select Time Slot</h2>
        <div className="flex gap-2 sm:gap-3 mt-3 overflow-x-auto">
          {availableTimes.map((time, index) => (
            <button 
              key={index} 
              className={`px-3 py-2 rounded-full ${selectedTime === time ? "bg-blue-600 text-white" : "bg-gray-200"}`} 
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Details Inputs */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Enter Your Details</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          readOnly // Email is auto-filled and read-only
          className="w-full p-2 border rounded mt-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
      </div>

      {/* Book Appointment Button */}
      <button 
        className={`mt-6 w-full py-3 bg-blue-600 text-white text-lg font-bold rounded hover:bg-blue-800 transition ${!selectedDate || !selectedTime ? "opacity-50 cursor-not-allowed" : ""}`} 
        disabled={!selectedDate || !selectedTime}
        onClick={handleBooking}
      >
        Book an Appointment
      </button>
    </div>
  );
};

export default AppointmentPage;
