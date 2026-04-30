import React from "react";
import { Link } from "react-router-dom";
import { 
  FiGithub, 
  FiLinkedin, 
  FiInstagram, 
  FiTwitter, 
  FiMail, 
  FiPhone,
  FiMapPin,
  FiArrowRight 
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#0f172a', 
      color: '#94a3b8', 
      padding: '80px 20px 40px',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '4rem',
          marginBottom: '60px'
        }}>
          {/* Brand Section */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                backgroundColor: '#4f46e5', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>RX</div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>Recruite<span style={{ color: '#4f46e5' }}>X</span></span>
            </div>
            <p style={{ lineHeight: 1.6, maxWidth: '300px', marginBottom: '2rem' }}>
              The premium recruitment ecosystem connecting elite talent with industry-leading companies through AI-driven matching.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[FiGithub, FiLinkedin, FiInstagram, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  transition: '0.3s'
                }} className="footer-social-icon">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Practical Links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 700 }}>Solutions</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Talent Search', 'Job Postings', 'Resume Analyzer', 'AI Chatbot'].map(link => (
                <li key={link}>
                  <Link to="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.95rem', transition: '0.3s' }} className="footer-link">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 700 }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['About Us', 'Success Stories', 'Privacy Policy', 'Contact Support'].map(link => (
                <li key={link}>
                  <Link to="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.95rem', transition: '0.3s' }} className="footer-link">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 700 }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                <FiMail style={{ color: '#4f46e5' }} /> support@recruitex.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                <FiPhone style={{ color: '#4f46e5' }} /> +91 (800) 123-4567
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                <FiMapPin style={{ color: '#4f46e5' }} /> Silicon Valley, CA
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          paddingTop: '40px', 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} RecruiteX. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
            <Link to="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cookie Policy</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: white !important; padding-left: 5px; }
        .footer-social-icon:hover { background-color: #4f46e5 !important; transform: translateY(-3px); }
      `}</style>
    </footer>
  );
};

export default Footer;