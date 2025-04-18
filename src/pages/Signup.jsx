import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImg from "../assets/images/signup.gif";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import uploadImageToCloudinary from "../utils/uploadCloudinary";

const Signup = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    reEnterPassword: "",
    photo: "",
    gender: "",
    role: "patient",
    specializations: "", // Additional field for doctors
    hospitalOrClinicName: "", // Additional field for doctors
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "role") {
      setFormData((prev) => ({
        ...prev,
        role: value,
        specializations: value === "doctor" ? "" : prev.specializations,
        hospitalOrClinicName: value === "doctor" ? "" : prev.hospitalOrClinicName,
      }));
    } else if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      setFormData({ ...formData, dob: value, age });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      toast.info("Uploading image, please wait...");
      const data = await uploadImageToCloudinary(file);
      setPreviewURL(data.url);
      setSelectedFile(data.url);
      setFormData({ ...formData, photo: data.url }); // Update photo field
      toast.success("Profile photo uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image. Try again.");
    }
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    console.log("Submit handler called!"); // Debugging log
    setLoading(true);
  
    console.log("Form Data:", formData); // Debugging: Check form data
  
    const requiredFields = [
      "firstName", "lastName", "dob", "email", "phone", "password", "reEnterPassword", "gender", "role"
  ];
  
    const isFormValid = requiredFields.every((field) => {
      if (field === "photo") return true; // Skip validation for photo
    
      if (typeof formData[field] === "string" && !formData[field].trim()) {
        console.log(`Missing field: ${field}`);
        return false;
      } else if (typeof formData[field] !== "string" && !formData[field]) {
        console.log(`Missing field: ${field}`);
        return false;
      }
      return true;
    });    
  
    if (!isFormValid) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }
  
    if (formData.password !== formData.reEnterPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }
  
    if (formData.age < 18) {
      toast.error("You must be at least 18 years old to sign up.");
      setLoading(false);
      return;
    }

    if (formData.role === "doctor") {
      if (!formData.specializations.trim() || !formData.hospitalOrClinicName.trim()) {
        toast.error("Doctors must provide specialization and hospital/clinic name.");
        setLoading(false);
        return;
      }
    }    
  
    const requestBody = {
      firstName: formData.firstName || "",  
      lastName: formData.lastName || "",
      email: formData.email || "",
      password: formData.password || "",
      role: formData.role || "",
      gender: formData.gender || "",
      dob: formData.dob || "",
      age: formData.age || "", // ✅ Ensure this is sent
      phone: formData.phone || "",
      ...(formData.photo && { photo: formData.photo }), // ✅ Exclude if empty
      ...(formData.role === "doctor" && { // ✅ Only include these fields if it's a doctor
        specialization: formData.specializations || "",  
        hospitalName: formData.hospitalOrClinicName || "", 
        experience: formData.experience || "",
      }),
    };
       
  
    console.log("Request Body:", requestBody); // Debugging: Log API request body
  
    const apiBase = "http://localhost:5000"; // Ensure the correct base URL
    const apiEndpoint = formData.role === "doctor" 
  ? "http://localhost:5000/doctor/signup" // ✅ Correct API for doctor signup
  : "http://localhost:5000/signup";
  
    try {
      console.log("Sending request to:", apiEndpoint); // Debugging: Log API endpoint
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      console.log("Raw Response:", res); // Debugging: Log raw response
  
      const result = await res.json();
      console.log("Parsed Response:", result); // Debugging: Log parsed response
  
      if (!res.ok) throw new Error(result.message || "Signup failed.");
  
      setEmail(result.email);
      setOtpSent(true);
      toast.success("OTP sent to your email. Please verify.");
    } catch (err) {
      console.error("Error:", err); // Debugging: Log error
      toast.error(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };  

  const verifyOtpHandler = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    setLoading(true);
    // Determine the API base URL based on the role
    const apiBase = formData.role === "doctor" ? "http://localhost:5000/doctor" : "http://localhost:5000";
    const apiEndpoint = `${apiBase}/verify-otp`;

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "OTP verification failed.");

      toast.success("Account created successfully! 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    setLoading(true);
    // Determine the API base URL based on the role
    const apiBase = formData.role === "doctor" ? "http://localhost:5000/doctor" : "http://localhost:5000";
    const apiEndpoint = `${apiBase}/resend-otp`;

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to resend OTP.");

      toast.success("OTP resent successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 shadow-lg rounded-lg overflow-hidden border border-gray-700">
          <div className="lg:block bg-primaryColor">
            <figure>
              <img src={signupImg} alt="Signup" className="w-full h-full" />
            </figure>
          </div>

          <div className="p-8 bg-white">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-6">
              Create an <span className="text-primaryColor">Account</span>
            </h3>

            {!otpSent ? (
              <form onSubmit={submitHandler} className="space-y-4">
                {/* Basic Fields */}
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                
                {/* Role Selection */}
                <div className="flex gap-4">
                  <label><input type="radio" name="role" value="patient" checked={formData.role === "patient"} onChange={handleInputChange} /> Patient</label>
                  <label><input type="radio" name="role" value="doctor" checked={formData.role === "doctor"} onChange={handleInputChange} /> doctor</label>
                </div>

                {/* Doctor-Specific Fields */}
                {formData.role === "doctor" && (
                  <>
                    <input type="text" name="specializations" placeholder="Specializations" value={formData.specializations} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                    <input type="text" name="hospitalOrClinicName" placeholder="Hospital/Clinic Name" value={formData.hospitalOrClinicName} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                    <input type="number" name="experience" placeholder="Experience (in years)" value={formData.experience} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                  </>
                )}

                {/* Common Fields */}
                <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                <input type="password" name="reEnterPassword" placeholder="Re-enter Password" value={formData.reEnterPassword} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md" />
                <select name="gender" value={formData.gender} onChange={handleInputChange} required className="border border-gray-700 p-3 w-full rounded-md">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input type="file" name="photo" onChange={handleFileInputChange} className="border border-gray-700 p-3 w-full rounded-md" />

                {/* Submit Button */}
<button type="submit" className="w-full bg-primaryColor text-white p-3 rounded-md">
  {loading ? <HashLoader size={25} color="#ffffff" /> : "Sign Up"}
</button>

{/* Already Have an Account? Login */}
<p className="mt-5 text-center text-gray-700">
  Already have an account? 
  <span 
    onClick={() => navigate("/login")} 
    className="text-primaryColor font-medium cursor-pointer ml-1 hover:underline"
  >
    Login
  </span>
</p>

              </form>
            ) : (
              <div className="space-y-4">
                <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="border border-gray-700 p-3 w-full rounded-md" />
                <button onClick={verifyOtpHandler} className="w-full bg-primaryColor text-white p-3 rounded-md">Verify OTP</button>
                <button onClick={resendOtpHandler} className="w-full bg-secondaryColor text-white p-3 rounded-md">Resend OTP</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;