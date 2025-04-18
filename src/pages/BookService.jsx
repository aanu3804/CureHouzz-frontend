import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";  // Import AuthContext

const BookService = () => {
    const { labName, serviceName } = useParams();
    const { user } = useContext(AuthContext);  // Get user from AuthContext

    const [formData, setFormData] = useState({
        name: "",
        email: user?.email || "",  // Auto-fill email
        service: serviceName || "",  // Auto-fill service name
        date: "",  // Date selection now uses a date picker
        time: "",
        phone:"",
    });

    useEffect(() => {
        // Ensure email updates when user data changes
        setFormData((prevData) => ({
            ...prevData,
            email: user?.email || "",
            service: serviceName || "", // Ensure service is always set
        }));
    }, [user, serviceName]);

    const timeSlots = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleTimeSelection = (time) => {
        setFormData((prevData) => ({ ...prevData, time }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.service || !formData.date || !formData.time || !formData.phone) {
            alert("❌ Please fill all details before booking.");
            return;
        }

        const newServiceBooking = {
            name: formData.name,
            email: formData.email,
            service: formData.service,
            lab: labName || "Default Lab",
            date: formData.date,  // Directly store the selected date
            time: formData.time,
            phone: formData.phone,
        };

        try {
            const response = await fetch("http://localhost:5000/save-lab-booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newServiceBooking),
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Service booked successfully!");
                setFormData({
                    name: "",
                    email: user?.email || "",
                    service: serviceName || "",
                    date: "",
                    time: "",
                    phone: "",
                });
            } else {
                alert(`❌ Booking failed: ${data.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("❌ Error:", error);
            alert("❌ An error occurred while booking.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Book {serviceName || "a Service"} at {labName || "our Lab"}</h1>

            <div className="mt-4 p-4 border rounded-lg bg-gray-100 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block font-semibold">Your Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full p-2 border rounded-md"
                        required
                    />

                    <label className="block font-semibold">Your Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly  // Auto-filled and non-editable
                        className="w-full p-2 border rounded-md bg-gray-200"
                    />
                    <label className="block font-semibold">Your Phone Number:</label>
                    <input
                        type="number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your Phone Number"
                        className="w-full p-2 border rounded-md"
                        required
                    />

                    <label className="block font-semibold">Service:</label>
                    <input
                        type="text"
                        name="service"
                        value={formData.service}
                        readOnly  // Auto-filled and non-editable
                        className="w-full p-2 border rounded-md bg-gray-200"
                    />

                    {/* Updated Date Picker */}
                    <label className="block font-semibold">Select Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        min={new Date().toISOString().split("T")[0]} // Restrict past dates
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />

                    <label className="block font-semibold mt-4">Select Time:</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {timeSlots.map((time) => (
                            <button
                                type="button"
                                key={time}
                                onClick={() => handleTimeSelection(time)}
                                className={`px-4 py-2 rounded-md border ${
                                    formData.time === time ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                        ✅ Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookService;
