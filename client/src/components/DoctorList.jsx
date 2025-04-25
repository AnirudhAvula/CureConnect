import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorList = ({ onSelect }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Doctors</h2>
      <ul className="space-y-3">
        {doctors.map((doc) => (
          <li
            key={doc._id}
            className="p-3 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(doc)}
          >
            <div className="font-semibold">{doc.name}</div>
            <div className="text-sm text-gray-600">{doc.specialization}</div>
            <div className="text-xs text-gray-500">{doc.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
