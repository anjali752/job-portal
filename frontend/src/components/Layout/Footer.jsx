import React from "react";
import { FaGithub, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";

function Footer() {
  return (
    <footer className="footer">
      
      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-section">
          <h3>CareerConnect</h3>
          <p>Find your dream job or hire the best talent easily.</p>
        </div>

        {/* CENTER */}
        <div className="footer-section">
          <h4>Contact</h4>

          <p>
            <MdEmail /> email@example.com
          </p>

          <p>
            <FaPhoneAlt /> +91 9876543210
          </p>
        </div>

        {/* RIGHT */}
        <div className="footer-section">
          <h4>Follow Us</h4>

          <div className="social-icons">
            <a href="https://github.com/exclusiveabhi" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>

            <a href="https://leetcode.com/u/exclusiveabhi/" target="_blank" rel="noreferrer">
              <SiLeetcode />
            </a>

            <a href="https://www.linkedin.com/in/abhishek-rajput-/" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>

            <a href="https://www.instagram.com/exclusiveabhi/" target="_blank" rel="noreferrer">
              <RiInstagramFill />
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CareerConnect | All Rights Reserved
      </div>

    </footer>
  );
}

export default Footer;