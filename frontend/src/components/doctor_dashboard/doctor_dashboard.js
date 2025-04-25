import React, { useState, useEffect } from 'react';
import './doctor_dashboard.css';

function DoctorDashboard() {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Patient', text: 'Hello, I have a question.', time: '10:30 AM', received: true },
    { sender: 'You', text: 'How can I help you?', time: '10:32 AM', received: false },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Mock data (replace with backend calls)
  const appointments = [
    { id: 1, patient_name: 'Jane Doe', date: '2025-04-15', time: '10:30 AM', status: 'Confirmed', specialty: 'Cardiology' },
    { id: 2, patient_name: 'John Smith', date: '2025-05-03', time: '2:00 PM', status: 'Pending', specialty: 'Endocrinology' },
  ];
  const patients = ['Jane Doe', 'John Smith', 'Alice Brown'];

  useEffect(() => {
    const fetchDoctorData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/doctor/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok) {
          setDoctorData(result.doctor);
        } else {
          setError(result.errors?.server || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = {
      sender: 'You',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      received: false,
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');

    // Simulate response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'Patient',
          text: 'Thank you for your response!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          received: true,
        },
      ]);
    }, 1000);
  };

  const todaysAppointments = appointments.filter(
    (appt) => appt.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 pb-4">
        <div className="flex items-center gap-3">
          <i className="fas fa-robot text-blue-600 text-3xl animate-pulse"></i>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Cure<span className="text-blue-600">Connect</span> -{' '}
            {loading ? 'Loading...' : doctorData ? `Dr. ${doctorData.name}` : 'Doctor'}
          </h1>
        </div>
        <div className="relative group">
          <div className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-300">
            <div className="w-12 h-12 bg-green-500 text-white font-bold flex items-center justify-center rounded-full text-xl uppercase">
              {doctorData ? doctorData.name.split(' ').map(word => word[0]).join('') : 'N/A'}
            </div>
            <span className="text-gray-800 font-medium">
              {doctorData ? doctorData.name : 'Loading...'}
            </span>
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

      <nav className="flex gap-2 mb-6 overflow-x-auto">
        <button
          className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <i className="fas fa-bar-chart"></i> Overview
        </button>
        <button
          className={`nav-button ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => handleTabChange('appointments')}
        >
          <i className="fas fa-calendar"></i> Appointments
        </button>
        <button
          className={`nav-button ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => handleTabChange('patients')}
        >
          <i className="fas fa-users"></i> Patients
        </button>
      </nav>

      <main>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {activeTab === 'overview' && (
          <section className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6 card rounded-xl p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl font-semibold text-blue-800">Quick Statistics</h2>
                <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
                  <i className="fas fa-chart-bar"></i>
                </div>
              </div>
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-item bg-blue-50 p-4 rounded-lg">
                    <p className="stat-label text-sm text-gray-500">Total Patients</p>
                    <p className="stat-value text-2xl font-bold text-blue-600">{patients.length}</p>
                  </div>
                  <div className="stat-item bg-green-50 p-4 rounded-lg">
                    <p className="stat-label text-sm text-gray-500">Today's Appointments</p>
                    <p className="stat-value text-2xl font-bold text-green-600">{todaysAppointments.length}</p>
                  </div>
                  <div className="stat-item bg-red-50 p-4 rounded-lg">
                    <p className="stat-label text-sm text-gray-500">Critical Patients</p>
                    <p className="stat-value text-2xl font-bold text-red-600">0</p>
                  </div>
                  <div className="stat-item bg-yellow-50 p-4 rounded-lg">
                    <p className="stat-label text-sm text-gray-500">Follow-ups</p>
                    <p className="stat-value text-2xl font-bold text-yellow-600">0</p>
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-12 md:col-span-6 card rounded-xl p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl font-semibold text-blue-800">Today's Appointments</h2>
                <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
                  <i className="fas fa-calendar-check"></i>
                </div>
              </div>
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : todaysAppointments.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {todaysAppointments.map((appt) => (
                    <div key={appt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full text-blue-600">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{appt.patient_name}</p>
                        <p className="text-sm text-gray-500">{appt.specialty} appointment</p>
                      </div>
                      <p className="text-sm font-medium text-blue-600">{appt.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No appointments today.</p>
              )}
            </div>

            <div className="col-span-12 card rounded-xl p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl font-semibold text-blue-800">Recent Patients</h2>
                <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
                  <i className="fas fa-users"></i>
                </div>
              </div>
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : patients.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-left text-xs text-gray-500 uppercase">
                      <th className="p-3">Name</th>
                      <th className="p-3">Age</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.slice(0, 5).map((patient, index) => (
                      <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                        <td className="p-3">{patient}</td>
                        <td className="p-3">--</td>
                        <td className="p-3">--</td>
                        <td className="p-3">
                          <span className="status-badge bg-green-500 text-white">Info NA</span>
                        </td>
                        <td className="p-3">N/A</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">No patients available.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'appointments' && (
          <section className="card rounded-xl p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl font-semibold text-blue-800">Your Appointments</h2>
              <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
                <i className="fas fa-calendar"></i>
              </div>
            </div>
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : appointments.length > 0 ? (
              <div className="flex flex-col gap-3">
                {appointments.map((appt) => (
                  <div key={appt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full text-blue-600">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{appt.patient_name}</p>
                      <p className="text-sm text-gray-500">{appt.date} at {appt.time} ({appt.status})</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No appointments found.</p>
            )}
          </section>
        )}

        {activeTab === 'patients' && (
          <section className="card rounded-xl p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl font-semibold text-blue-800">Your Patients</h2>
              <div className="card-icon w-12 h-12 bg-blue-600 bg-opacity-10 flex items-center justify-center rounded-full text-blue-600">
                <i className="fas fa-users"></i>
              </div>
            </div>
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : patients.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left text-xs text-gray-500 uppercase">
                    <th className="p-3">Name</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                      <td className="p-3">{patient}</td>
                      <td className="p-3">
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">No patients found.</p>
            )}
          </section>
        )}
      </main>

      <div className={`chat-sidebar ${chatOpen ? 'open' : ''}`}>
        <div className="chat-header bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Emergency Chat</h2>
          <button onClick={() => setChatOpen(false)} className="text-white hover:bg-blue-700 p-2 rounded-full">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="chat-messages p-4 flex flex-col gap-3">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.received ? 'received bg-gray-100' : 'sent bg-blue-600 text-white'} p-3 rounded-lg max-w-[80%]`}>
              <p className="font-medium">{msg.sender}</p>
              <p>{msg.text}</p>
              <p className="text-xs opacity-75 mt-1">{msg.time}</p>
            </div>
          ))}
        </div>
        <div className="chat-input p-4 border-t">
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button type="submit" className="gradient-button text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;