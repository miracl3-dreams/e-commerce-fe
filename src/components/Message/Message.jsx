import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Message = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsModalOpen(false);

    try {
      await axios.post("http://localhost:8000/api/v1/inquiries/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("✅ Inquiry sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending inquiry:", err);
      toast.error("❌ Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-16 mb-16">
      <div className="bg-white p-6 rounded-md shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Send an Inquiry
        </h2>
        <p className="text-gray-500 mb-6">
          Have questions or need assistance? Send us your inquiry, and we'll get
          back to you shortly!
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-2 border rounded-xl"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-2 border rounded-xl"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your inquiry here..."
            rows="4"
            className="w-full p-2 border rounded-xl"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-xl hover:bg-blue-600 transition"
          >
            Send Inquiry
          </button>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Submission</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to send this inquiry?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Yes, Send"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Message;
