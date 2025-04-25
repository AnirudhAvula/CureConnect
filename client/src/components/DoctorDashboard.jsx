import React from "react";

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h2>Welcome Dr. {user?.name}</h2>
      <p>You're logged in as <strong>Doctor</strong>.</p>
      <p>Your ID: {user?.id}</p>
      {/* Later: Add appointments, chat list, etc. */}
    </div>
  );
};

export default DoctorDashboard;
