import React from "react";

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h2>Welcome {user?.name}</h2>
      <p>You're logged in as <strong>Patient</strong>.</p>
      <p>Your ID: {user?.id}</p>
      {/* Later: Add list of doctors, messages, etc. */}
    </div>
  );
};

export default PatientDashboard;
