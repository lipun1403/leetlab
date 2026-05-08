import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="z-50 bg-primary/20 p-6 rounded-sm mt-16 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/leetlab.svg"
            className="h-14 w-14 bg-primary/20 px-2 py-2 rounded-full"
            alt="LeetLab Logo"
          />
          <span className="text-lg md:text-2xl font-bold tracking-tight text-white">
            LeetLab
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-10 text-white mt-4 md:mt-0">
          <Link to="/about" className="hover:text-teal-400">About</Link>
          <Link to="/contact" className="hover:text-teal-400">Contact</Link>
          <Link to="/faq" className="hover:text-teal-400">FAQ</Link>
          <Link to="/privacy" className="hover:text-teal-400">Privacy Policy</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5 mt-4 md:mt-0 text-white">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub size={22} className="hover:text-teal-400 transition" />
          </a>

          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={22} className="hover:text-teal-400 transition" />
          </a>

          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={22} className="hover:text-teal-400 transition" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-400 text-xs mt-4">
        © {new Date().getFullYear()} LeetLab. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;