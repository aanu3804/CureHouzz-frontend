import React from "react";
import { useParams } from "react-router-dom";
import hospitalsData from "../../assets/data/hospital"; // Import hospital data
import { doctors } from "../../assets/data/doctor"; // Import doctor data
import DoctorCard from "../../components/Doctors/DoctorCard"; // Import DoctorCard

const DoctorsList = () => {
  const { id } = useParams(); // Get hospital ID from URL

  // Find the selected hospital
  const hospital = hospitalsData.find((h) => h.id === parseInt(id));

  // Filter doctors based on the hospital name
  const hospitalDoctors = doctors.filter((doc) => doc.hospital === hospital?.name);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">{hospital?.name} - Doctors List</h2>

        {hospitalDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
            {hospitalDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No doctors available at this hospital.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
