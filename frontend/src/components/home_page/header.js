import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">CureConnect</div>
        <div className="hidden md:flex space-x-4 items-center">
          <a href="#home" className="text-gray-600 hover:text-blue-600">Home</a>
          <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
          <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
          <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</a>
        </div>
        <button
          className="md:hidden text-blue-600 text-2xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </nav>
      <div className={`nav-links ${isMenuOpen ? 'flex' : 'hidden'} flex-col items-center bg-white shadow-md md:hidden px-6 py-4 space-y-4`}>
        <a href="#home" className="text-gray-600 hover:text-blue-600">Home</a>
        <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
        <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
        <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</a>
      </div>
    </header>
  );
};

export default Header;