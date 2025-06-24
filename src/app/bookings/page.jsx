"use client";

import { getBookings } from "@/services/api";
import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings(); // should return bookings for the logged-in user
        setBookings(response.data); // store in state
        console.log("Bookings:", response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings(); // call the function
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>
      <p className="text-gray-600 mb-4">Here you can view all your bookings.</p>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((book) => (
            <li key={book.id} className="border p-4 rounded shadow">
              <p className="font-semibold">Booking ID: {book.id}</p>
              <p>Status: {book.status}</p>
              <p>Start Date: {book.start_date}</p>
              <p>End Date: {book.end_date}</p>
              <p>Package: {book.package_title || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
