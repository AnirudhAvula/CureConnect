import React from 'react';

function About() {
  return (
    <section id="about" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="about-title">About CureConnect</h2>
        <div className="about-section">
          <div className="md:w-1/2">
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
                alt="Healthcare professionals collaborating"
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:w-1/2 about-content">
            <p>
              CureConnect was born out of a passion to solve real-world healthcare challenges. Our AI-powered virtual receptionist system streamlines hospital operations, reduces wait times, and ensures patients get timely access to specialists.
            </p>
            <p>
              Built with a robust tech stack including Flask, PyTorch, and the Gemini API, we made it to the final round of a national hackathon, learning and growing every step of the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;