"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react"; // optional icon

export default function BookingForm({
  pkg,
  packageId,
  defaultStart,
  defaultEnd,
  onDateChange,
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    country: "India",
    email: "",
    date_of_birth: "",
    phone: "",
    address: "",
    start_date: defaultStart?.split("T")[0] || "",
    end_date: defaultEnd?.split("T")[0] || "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "start_date" || name === "end_date") {
      onDateChange?.({
        startDate: name === "start_date" ? value : formData.start_date,
        endDate: name === "end_date" ? value : formData.end_date,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const payload = {
      ...formData,
      name: `${formData.first_name} ${formData.last_name}`,
      package: packageId,
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL}/graphql`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus("success");
      setFormData({
        first_name: "",
        last_name: "",
        gender: "",
        country: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
        start_date: "",
        end_date: "",
      });
    } else {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 font-[var(--font-playfair)] rounded-md bg-white dark:bg-zinc-900 text-black dark:text-white border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6 space-y-6 border border-gray-200 dark:border-zinc-700">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 font-medium mb-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <h2 className="text-3xl font-[monoton] text-black dark:text-red-600">
        Book This Experience
      </h2>

     

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="first_name"
          placeholder="First Name*"
          required
          value={formData.first_name}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="last_name"
          placeholder="Last Name*"
          required
          value={formData.last_name}
          onChange={handleChange}
          className={inputClass}
        />
        <select
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
          className={inputClass}>
          <option value="">Select Gender*</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="nonbinary">Non-Binary</option>
          <option value="other">Other</option>
        </select>
        <input
          name="country"
          placeholder="Country*"
          value={formData.country}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          placeholder="Email*"
          required
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="date"
          name="date_of_birth"
          placeholder="Date of Birth*"
          required
          value={formData.date_of_birth}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="date"
          name="start_date"
          placeholder="Start Date*"
          required
          value={formData.start_date}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="date"
          name="end_date"
          placeholder="End Date*"
          required
          value={formData.end_date}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-200">
        Book Now
      </button>

      {status === "success" && (
        <p className="text-green-600 dark:text-green-400 text-sm text-center">
          Booking successful!
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 dark:text-red-400 text-sm text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </motion.form>
  );
}
