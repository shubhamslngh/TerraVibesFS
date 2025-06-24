"use client";

import { useState } from "react";

export default function BookingForm({ packageId, defaultStart, defaultEnd }) {
  const [formData, setFormData] = useState({
    first_name: "Shubham",
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      name: `${formData.first_name} ${formData.last_name}`,
      email: formData.email,
      phone: formData.phone,
      package: packageId,
      start_date: formData.start_date,
      end_date: formData.end_date,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      country: formData.country,
      address: formData.address,
    };
const url= `${process.env.NEXT_PUBLIC_API_URL}/graphql`;
    const res = await fetch(
     url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-4 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">Book This Experience</h2>

      <div className="flex gap-4">
        <input
          name="first_name"
          placeholder="First Name*"
          required
          value={formData.first_name}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="last_name"
          placeholder="Last Name*"
          required
          value={formData.last_name}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <select
        name="gender"
        required
        value={formData.gender}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="email"
        name="email"
        placeholder="Email*"
        required
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="date"
        name="date_of_birth"
        placeholder="Date of Birth*"
        required
        value={formData.date_of_birth}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex gap-4">
        <input
          type="date"
          name="start_date"
          placeholder="Start Date*"
          required
          value={formData.start_date}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          name="end_date"
          placeholder="End Date*"
          required
          value={formData.end_date}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition">
        Book Now
      </button>

      {status === "success" && (
        <p className="text-green-600 text-sm">Booking successful!</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
