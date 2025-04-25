import React, { useState, useEffect } from 'react';
import './patient_dashboard.css';

function PatientDashboard() {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    doctorName: '',
    appointmentDate: new Date().toISOString().substr(0, 10),
    appointmentTime: '',
  });
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [appointments, setAppointments] = useState([
    { id: 1, time: 'April 15, 2025 - 10:30 AM', doctor: 'Dr. Michael Johnson', status: 'Confirmed' },
    { id: 2, time: 'May 3, 2025 - 2:00 PM', doctor: 'Dr. Emily Chen', status: 'Pending' },
  ]);
  const [systemStatus, setSystemStatus] = useState('Checking system status...');
  const [chatResponse, setChatResponse] = useState('Enter a query above to interact with the system.');

  useEffect(() => {
    // Fetch patient data
    const fetchPatientData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/patient/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok) {
          setPatientData(result.patient);
          setAppointmentForm((prev) => ({ ...prev, patientName: result.patient.name }));
        } else {
          setError(result.errors?.server || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();

    // Simulate system status check
    setTimeout(() => {
      setSystemStatus('✓ System online and ready (DEMO MODE)');
    }, 2000);
  }, []);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    const { patientName, doctorName, appointmentDate, appointmentTime } = appointmentForm;

    if (!doctorName || !appointmentDate || !appointmentTime) {
      setAppointmentStatus('All fields are required!');
      return;
    }

    const displayDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const timeParts = appointmentTime.split(':');
    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const displayTime = `${hours}:${minutes} ${ampm}`;

    setAppointmentStatus('Scheduling appointment...');
    setTimeout(() => {
      setAppointments([
        ...appointments,
        {
          id: appointments.length + 1,
          time: `${displayDate} - ${displayTime}`,
          doctor: doctorName,
          status: 'Pending',
        },
      ]);
      setAppointmentStatus('Appointment scheduled successfully! (DEMO MODE)');
      setTimeout(() => setModalOpen(false), 2000);
    }, 1000);
  };

  const handleQuerySubmit = () => {
    const query = document.getElementById('query').value.trim();
    if (!query) {
      setChatResponse('Please enter a query first.');
      return;
    }
    setChatResponse('Processing your request...');
    setTimeout(() => {
      setChatResponse('I understand your query. How else can I assist you? (DEMO MODE)');
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 pb-4">
        <div className="flex items-center gap-3">
          <i className="fas fa-robot text-blue-600 text-3xl animate-pulse"></i>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Cure<span className="text-blue-600">Connect</span>
          </h1>
        </div>
        <div className="relative group">
          <div className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-300">
            <div className="w-12 h-12 bg-green-500 text-white font-bold flex items-center justify-center rounded-full text-xl uppercase">
              {patientData ? patientData.name.split(' ').map(word => word[0]).join('') : 'N/A'}
            </div>
            <span className="text-gray-800 font-medium">{patientData ? patientData.name : 'Loading...'}</span>
          </div>
          <div className="absolute top-14 right-0 bg-white shadow-xl rounded-lg w-40 hidden group-hover:block opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform translate-y-2 transition-all duration-300">
            <ul className="list-none m-0 p-0">
              <li className="px-4 py-3 hover:bg-gray-100">
                <a href="#" className="text-gray-800 hover:text-green-500 font-medium">Edit Profile</a>
              </li>
              <li className="px-4 py-3 hover:bg-gray-100">
                <a href="#" onClick={handleLogout} className="text-gray-800 hover:text-green-500 font-medium">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 md:col-span-4 card rounded-xl p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl font-semibold text-blue-800">Patient Information</h2>
            <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
              <i className="fas fa-user"></i>
            </div>
          </div>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : patientData ? (
            <>
              <div className="w-28 h-28 bg-blue-400 text-white font-bold flex items-center justify-center rounded-full mx-auto mb-6 text-3xl">
                {patientData.name[0].toUpperCase()}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">{patientData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium text-gray-800">{calculateAge(patientData.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800">{patientData.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="font-medium text-gray-800">{patientData.bloodGroup || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-medium text-gray-800">{patientData.height || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium text-gray-800">{patientData.weight || 'N/A'}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>

        <div className="col-span-12 md:col-span-8 card rounded-xl p-6 animate-fadeIn">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">Next-Gen Medical Agents</h1>
          <div className="flex shadow-md rounded-lg overflow-hidden mb-4">
            <input
              id="query"
              type="text"
              placeholder="Enter your query (e.g., 'I have a high fever')"
              className="flex-1 p-3 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleQuerySubmit}
              className="gradient-button text-white px-6 py-3 font-medium"
            >
              Send
            </button>
          </div>
          <div id="response" className="bg-white p-4 rounded-lg shadow-sm min-h-[100px] mb-4 text-gray-800">
            {chatResponse}
          </div>
          <div className="examples">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Example queries:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Schedule an appointment with Dr. Wilson',
                'What appointments do I have?',
                'Book a visit with Dr. Lee tomorrow',
                'I have a high fever and sore throat',
              ].map((query, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition animate-pulse"
                  onClick={() => document.getElementById('query').value = query}
                >
                  {query}
                </div>
              ))}
            </div>
          </div>
          <div className={`text-center mt-4 text-sm ${systemStatus.includes('online') ? 'text-green-500' : 'text-red-500'} font-medium`}>
            {systemStatus}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 card rounded-xl p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl font-semibold text-blue-800">Upcoming Appointments</h2>
            <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
              <i className="fas fa-calendar-check"></i>
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {appointments.map(appointment => (
              <li key={appointment.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="font-medium text-gray-800">{appointment.time}</p>
                  <p className="text-sm text-gray-500">{appointment.doctor}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'Confirmed'
                      ? 'bg-green-100 text-green-500'
                      : 'bg-orange-100 text-orange-500'
                  }`}
                >
                  {appointment.status}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full mt-4 gradient-button text-white py-3 rounded-full font-medium"
          >
            <i className="fas fa-plus mr-2"></i> Schedule New Appointment
          </button>
        </div>

        <div className="col-span-12 md:col-span-6 card rounded-xl p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl font-semibold text-blue-800">Current Medications</h2>
            <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
              <i className="fas fa-pills"></i>
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {[
              { name: 'Atorvastatin', dosage: '20mg tablet', time: 'Once daily' },
              { name: 'Metformin', dosage: '500mg tablet', time: 'Twice daily' },
              { name: 'Lisinopril', dosage: '10mg tablet', time: 'Once daily' },
            ].map((med, index) => (
              <li key={index} className="flex justify-between items-center py-3">
                <div>
                  <p className="font-medium text-gray-800">{med.name}</p>
                  <p className="text-sm text-gray-500">{med.dosage}</p>
                </div>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                  {med.time}
                </span>
              </li>
            ))}
          </ul>
          <button className="w-full mt-4 gradient-button text-white py-3 rounded-full font-medium">
            <i className="fas fa-bell mr-2"></i> Set Medication Reminder
          </button>
        </div>

        <div className="col-span-12 md:col-span-8 card rounded-xl p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl font-semibold text-blue-800">Health Trends</h2>
            <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="h-72 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            [ Blood Pressure Trend Chart Would Appear Here ]
          </div>
          <div className="flex gap-2 mt-3">
            {['Blood Pressure', 'Glucose', 'Weight'].map((metric, index) => (
              <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                {metric}
              </span>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 card rounded-xl p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl font-semibold text-blue-800">Quick Actions</h2>
            <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
              <i className="fas fa-bolt"></i>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'fa-file-prescription', text: 'Request Prescription Refill' },
              { icon: 'fa-file-medical', text: 'View Medical Records' },
              { icon: 'fa-video', text: 'Connect to Doctor' },
              { icon: 'fa-question-circle', text: 'Ask a Question' },
            ].map((action, index) => (
              <button
                key={index}
                className="action-btn flex flex-col items-center p-4 bg-white shadow-md rounded-lg hover:text-white transition"
                onClick={() => alert(`Action: ${action.text}`)}
              >
                <i className={`fas ${action.icon} text-2xl mb-2 text-blue-600`}></i>
                <span className="text-sm font-medium">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal rounded-xl p-6 w-full max-w-lg animate-modalFadeIn">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h2 className="card-title text-xl font-semibold text-blue-800">Schedule New Appointment</h2>
              <span
                className="text-2xl cursor-pointer text-gray-500 hover:text-gray-800 transition"
                onClick={() => setModalOpen(false)}
              >
                ×
              </span>
            </div>
            <form onSubmit={handleAppointmentSubmit}>
              <div className="mb-4">
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  value={appointmentForm.patientName}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name
                </label>
                <select
                  id="doctorName"
                  value={appointmentForm.doctorName}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a doctor</option>
                  {[
                    'Dr. John Doe - Cardiology',
                    'Dr. Michael Johnson - Primary Care',
                    'Dr. Emily Chen - Endocrinology',
                    'Dr. Wilson - Neurology',
                    'Dr. Lee - Orthopedics',
                  ].map((doctor, index) => (
                    <option key={index} value={doctor}>{doctor}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  value={appointmentForm.appointmentDate}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="appointmentTime"
                  value={appointmentForm.appointmentTime}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentTime: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-5 py-2 rounded-full hover:bg-gray-600 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-button text-white px-5 py-2 rounded-full font-medium"
                >
                  Schedule
                </button>
              </div>
            </form>
            {appointmentStatus && (
              <div
                className={`mt-4 p-3 rounded-lg text-center font-medium ${
                  appointmentStatus.includes('successfully')
                    ? 'bg-green-100 text-green-500'
                    : 'bg-red-100 text-red-500'
                }`}
              >
                {appointmentStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;