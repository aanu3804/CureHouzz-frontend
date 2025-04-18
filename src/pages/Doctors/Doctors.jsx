import React, { useState } from "react";
import DoctorCard from "./../../components/Doctors/DoctorCard";
import { doctors } from "./../../assets/data/doctor";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <section className="bd-[#ff9ea]">
        <div className="container text-center">
          <h2 className="heading">Find a Doctor</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            
            {/* Search Input */}
            <input
              type="search"
              className="py-4 pl-4 pr-2 b-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Search Doctor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on change
            />
            
            {/* Search Button (Optional, Search works dynamically on input) */}
            <button className="btn mt-0 rounded-[0px] rounded-r-md">
              Search
            </button>

          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 m:grid-cols-3 lg:grid-cols-4 gap-5">
            
            {/* Display Filtered Doctors */}
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No doctors found.</p>
            )}

          </div>
        </div>
      </section>
    </>
  );
};

export default Doctors;
