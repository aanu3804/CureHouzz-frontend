import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import hospitalsData from "../assets/data/hospital"; // Import hospital data
import { doctors } from "../assets/data/doctor"; // Import doctor data

const HospitalSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filter hospitals based on search term
  const filteredHospitals = hospitalsData.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Search Input */}
        <div className="mb-6 bg-blue-600 p-4 rounded-lg shadow">
          <input 
            type="text"
            placeholder="Search hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>

        {/* Hospital Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => {
            // Get all doctors in this hospital
            const hospitalDoctors = doctors.filter((doc) => doc.hospital === hospital.name);
            
            // Count doctors correctly
            const doctorCount = hospitalDoctors.length;

            // Extract unique specialties from doctors
            const specialties = [...new Set(hospitalDoctors.map((doc) => doc.specialization))];

            return (
              <div key={hospital.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                
                {/* Hospital Image */}
                <img 
                  src={hospital.image} 
                  alt={hospital.name} 
                  className="w-full h-48 object-cover rounded"
                />

                {/* Hospital Name */}
                <h3 className="text-lg font-semibold mt-4">{hospital.name}</h3>

                {/* Location */}
                <p className="text-sm text-gray-600">{hospital.location}</p>

                {/* Correct Specialties */}
                <p className="text-sm text-gray-800 mt-2">
                  <strong>Specialties:</strong> {specialties.length > 0 ? specialties.join(", ") : "No specializations available"}
                </p>

                {/* Correct Number of Doctors */}
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Doctors Available:</strong> {doctorCount}
                </p>

                {/* View Doctors Button */}
                <button 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => navigate(`/hospital/${hospital.id}/doctors`)}
                >
                  View Doctors
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HospitalSearch;
