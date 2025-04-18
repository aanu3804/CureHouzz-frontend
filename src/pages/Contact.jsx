import React, { useState, useContext, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Contact = () => {
  const { user } = useContext(AuthContext); // Get user from context
  const [formData, setFormData] = useState({
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Ensure email is updated when user logs in
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Validate inputs before sending
  const validateForm = () => {
    if (!formData.email || !formData.subject.trim() || !formData.message.trim()) {
      setError("All fields are required.");
      return false;
    }
    setError(""); // Clear error if everything is fine
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails
    setIsSending(true);

    const emailParams = {
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: "ntrdannandan555@gmail.com",
    };

    emailjs
      .send(
        "service_g75c4vv",
        "template_y66kwgv",
        emailParams,
        "TAaM-8S0e6GrGpLpS"
      )
      .then(
        () => {
          alert("Message sent successfully!");
          setFormData({ email: user.email, subject: "", message: "" });
        },
        (error) => {
          alert("Failed to send message. Please try again.");
          console.error("EmailJS Error:", error);
        }
      )
      .finally(() => setIsSending(false));
  };

  // Show login prompt if user is not logged in
  if (!user) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-red-500">Login first to ask a query</h2>
      </div>
    );
  }

  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text__para">
          Got a technical issue? Want to send feedback about a beta feature? Let us know.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="form__label">Your Email</label>
            <input
              type="email"
              id="email"
              className="form__input mt-1 bg-gray-200 cursor-not-allowed"
              value={formData.email}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="subject" className="form__label">Subject</label>
            <input
              type="text"
              id="subject"
              placeholder="Let us know how we can help you"
              className="form__input mt-1"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="form__label">Your Message</label>
            <textarea
              rows="6"
              id="message"
              placeholder="Leave your message here"
              className="form__input mt-1"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg py-3"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
