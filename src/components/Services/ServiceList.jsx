import React from "react";
import { useNavigate } from "react-router-dom";

// Import images
import Urology from "../../assets/images/Urology.png";
import Neurology from "../../assets/images/Neurology.png";
import Orthopedic from "../../assets/images/Orthopedic.png";
import Cardiologist from "../../assets/images/Cardiologist.png";
import Dentist from "../../assets/images/Dentist.png";
import ConsultantPhy from "../../assets/images/con_physician.png";
import Generalphy from "../../assets/images/gen_physician.png";

// Specialties data
const specialties = [
  { name: "Urology", icon: Urology },
  { name: "Neurology", icon: Neurology },
  { name: "Orthopedic", icon: Orthopedic },
  { name: "Cardiologist", icon: Cardiologist },
  { name: "Dentist", icon: Dentist },
  { name: "Consultant Physician", icon: ConsultantPhy },
  { name: "General Physician", icon: Generalphy },
];

const SpecialtyCard = ({ name, icon }) => {
  return (
    <div className="flex flex-col items-center w-42 h-42">
      <div className="relative">
        <img src={icon} alt={name} className="w-30 h-30 rounded-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
      </div>
      <p className="mt-2 text-gray-800">{name}</p>
    </div>
  );
};

const ServiceList = () => {
  const navigate = useNavigate(); // Fix: Define useNavigate inside the component

  return (
    <div className="container mx-auto py-12">
      <div className="relative mb-8">
        <button
          onClick={() => navigate("/specialisation")} // Fix: Use navigate correctly
          className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
        >
          View All Specialities
        </button>
      </div>

      <div className="flex justify-center space-x-10">
        {specialties.map((specialty, index) => (
          <SpecialtyCard key={index} name={specialty.name} icon={specialty.icon} />
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
