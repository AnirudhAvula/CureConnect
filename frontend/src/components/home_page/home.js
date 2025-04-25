import React, { useEffect } from 'react';
import Header from './header';
import Hero from './hero';
import Features from './features';
import About from './about';
import Footer from './footer';

function Home() {
  useEffect(() => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }, []);
  return (
    <div className="bg-gray-100">
      <Header />
      <Hero />
      <Features />
      <About />
      <Footer />
    </div>
  );
}

export default Home;