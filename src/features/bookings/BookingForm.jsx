import { useState } from "react";
import API from "../../api/axios";

const BookingForm = ({ propertyId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleBooking = async () => {
    const res = await API.post("bookings/", {
      property_id: propertyId,
      start_date: startDate,
      end_date: endDate,
    });

    window.location.href = res.data.checkout_url;
  };

  return (
    <div className="space-y-3">
      <input type="date" onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" onChange={(e) => setEndDate(e.target.value)} />
      <button onClick={handleBooking} className="bg-blue-600 text-white p-2">
        Reserve Property
      </button>
    </div>
  );
};

export default BookingForm;