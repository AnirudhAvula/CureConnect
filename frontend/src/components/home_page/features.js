import React from 'react';

function Features() {
  const features = [
    {
      icon: "📅",
      title: "Smart Scheduling",
      description: "Automate appointments, cancellations, and reminders with our AI-driven system."
    },
    {
      icon: "💬",
      title: "Real-Time Chat",
      description: "Connect patients and doctors instantly via WebSocket-powered chat."
    },
    {
      icon: "🚨",
      title: "Priority Queue",
      description: "Route critical concerns to specialists immediately for urgent care."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-100">
      <div className="features-container">
        <h2 className="features-title">Why Choose CureConnect?</h2>
        <div className="features-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="feature-card p-6 text-center">
              <div className="text-blue-600 text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;