import { useState, useContext } from "react";
import React from "react";
import { AuthContext } from "../context/AuthContext";

const Pharmacare = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [userName, setUserName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");


  const medicines = [
    { id: 1, name: "Paracetamol", description: "Pain reliever", price: 5, image: "https://assets.truemeds.in/Images/ProductImage/TM-TACR1-011691/dolo-650-tablet-15_dolo-650-tablet-15--TM-TACR1-011691_1.png?width=320" },
    { id: 2, name: "Ibuprofen", description: "Anti-inflammatory", price: 8, image: "https://images.theconversation.com/files/321639/original/file-20200319-22610-18gca3.jpg?ixlib=rb-4.1.0&rect=0%2C25%2C5644%2C3844&q=45&auto=format&w=926&fit=clip" },
    { id: 3, name: "Amoxicillin", description: "Antibiotic", price: 12, image: "https://m.media-amazon.com/images/I/41-bx-fCENL.AC_UF1000,1000_QL80.jpg" },
    { id: 4, name: "Cetirizine", description: "Allergy relief", price: 6, image: "https://5.imimg.com/data5/SELLER/Default/2022/11/PC/QG/YD/122957552/cetirizine-allergy-relief-tablets.jpg" },
    { id: 5, name: "Metformin", description: "Diabetes management", price: 10, image: "https://images.ctfassets.net/4w8qvp17lo47/36aCkc13mwOuumQ2seygc4/e2e002b451a77e75e6fd98857df4b9eb/pregnancy-metformin-is-it-safe_thumb.jpg" },
    { id: 6, name: "Atorvastatin", description: "Cholesterol reducer", price: 15, image: "https://5.imimg.com/data5/SELLER/Default/2023/11/361596748/TB/EJ/SI/28656627/atorvastatin-10-mg-tablets.jpg" },
    { id: 7, name: "Losartan", description: "Blood pressure management", price: 9, image: "https://5.imimg.com/data5/SELLER/Default/2023/2/HF/OG/ZP/102456860/losartas-50-mg-losartan-tablet-500x500.jpeg" },
    { id: 8, name: "Omeprazole", description: "Acid reflux relief", price: 7, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-6UBd12aI-eQiEThsoOJUdgYwjM8COkIL2Q&s" },
    { id: 9, name: "Vitamin D3", description: "Bone health", price: 4, image: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ntl/ntl05889/y/49.jpg" },
    { id: 10, name: "Aspirin", description: "Blood thinner", price: 6, image: "https://www.grxstatic.com/d4fuqqd5l3dbz/products/cwf_tms/Package_25470.PNG" },
    { id: 11, name: "Ciprofloxacin", description: "Antibiotic", price: 11, image: "https://5.imimg.com/data5/SELLER/Default/2022/9/EE/NQ/SR/154492060/ciprofloxacin-tablets-i-p-500-mg.png" },
    { id: 12, name: "Levothyroxine", description: "Thyroid management", price: 14, image: "https://c8.alamy.com/comp/TAA7C4/hypothyroidism-thyroid-hormone-treatment-synthetic-levothyroxine-and-natural-dried-and-powdered-animal-thyroid-containing-t4-and-t3-drug-jars-TAA7C4.jpg" },
    { id: 13, name: "Furosemide", description: "Diuretic", price: 8, image: "https://www.bambangpharma.com/cdn/shop/files/436609038_1176725193752140_7118678576762279821_n.jpg?v=1715310779" },
    { id: 14, name: "Hydroxychloroquine", description: "Anti-malarial", price: 13, image: "https://static01.nyt.com/images/2020/04/01/science/01VIRUS-HYDROXY/01VIRUS-HYDROXY-mediumSquareAt3X.jpg" },
    { id: 15, name: "Clopidogrel", description: "Blood thinner", price: 10, image: "https://5.imimg.com/data5/SELLER/Default/2023/2/HN/TN/VF/125943365/clopilet-clopidogrel-tablets.jpg" }
  ];

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(0, prev + amount));
  };

  const handleMedicineSelect = (medicine) => {
    setSelectedMedicine(medicine);
    setQuantity(1);
    setUserName(user?.name || "");
    setAddress(user?.address || "");
    setPhone(user?.phone || "");
  };

  const handleBuyNow = async () => {
    if (!userName || !address || phone.trim() === "" ||quantity < 1) {
      alert("Please enter all details and select at least one quantity.");
      return;
    }

    const bookingData = {
      userName,
      email: user?.email || "",
      address,
      phone,
      medicine: selectedMedicine.name,
      quantity,
      price: selectedMedicine.price * quantity,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/book-medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert("Booking Confirmed!");
        setSelectedMedicine(null);
        setQuantity(0);
      } else {
        alert("Failed to book medicine.");
      }
    } catch (error) {
      console.error("Error booking medicine:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Pharmacare</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for medicines..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-400 p-2 w-full mb-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {selectedMedicine ? (
        <div className="border p-6 rounded-lg shadow-md w-full flex flex-col md:flex-row gap-6 bg-gray-50">
          {/* Medicine Card */}
          <div className="flex flex-col items-center w-full md:w-1/2 p-4">
            <img
              src={selectedMedicine.image}
              alt={selectedMedicine.name}
              className="w-60 h-60 object-cover mb-2 rounded-lg"
            />
            <h2 className="text-xl font-semibold">{selectedMedicine.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{selectedMedicine.description}</p>
            <p className="text-lg font-bold">Price: ${selectedMedicine.price}</p>

            {/* Quantity Selector */}
            <div className="flex items-center mt-3">
              <button className="border px-3 py-1 text-lg bg-gray-200 rounded-md" onClick={() => handleQuantityChange(-1)}>-</button>
              <span className="mx-4 text-lg">{quantity}</span>
              <button className="border px-3 py-1 text-lg bg-gray-200 rounded-md" onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          {/* User Information Section */}
          {quantity >= 1 && (
            <div className="w-full md:w-1/2 bg-white p-6 rounded-md shadow-lg">
              <label className="text-sm font-semibold text-gray-700">Name:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="border p-2 w-full mb-2 rounded-md focus:ring-2 focus:ring-blue-400"
              />

              <label className="text-sm font-semibold text-gray-700">Email:</label>
              <input
                type="text"
                value={user?.email || ""}
                readOnly
                className="border p-2 w-full mb-2 rounded-md bg-gray-200"
              />

              <label className="text-sm font-semibold text-gray-700">Phone:</label>
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your Phone Number"
                className="border p-2 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-400"
              />

              <label className="text-sm font-semibold text-gray-700">Address:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="border p-2 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-400"
              />

              {/* Buy Now Button */}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMedicines.map((medicine) => (
            <div
              key={medicine.id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer w-60"
              onClick={() => handleMedicineSelect(medicine)}
            >
              <img src={medicine.image} alt={medicine.name} className="w-32 h-32 object-cover mb-2 rounded-md" />
              <h2 className="text-sm font-semibold">{medicine.name}</h2>
              <p className="text-xs text-gray-600">{medicine.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pharmacare;
