import React from "react";
import { FiSearch, FiTarget, FiZap, FiAward } from "react-icons/fi";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="hero-v2" style={{ 
      background: 'radial-gradient(circle at top right, #e0e7ff 0%, #ffffff 50%)',
      padding: '6rem 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container-v2" style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        textAlign: "center",
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          backgroundColor: '#eff6ff', 
          color: '#3b82f6', 
          padding: '0.5rem 1.25rem', 
          borderRadius: '50px', 
          fontSize: '0.85rem', 
          fontWeight: 700, 
          marginBottom: '2rem' 
        }}>
          <FiZap /> The Future of Career Growth
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          fontWeight: 900, 
          lineHeight: 1.1, 
          letterSpacing: '-2px',
          color: '#0f172a',
          marginBottom: '1.5rem'
        }}>
          Get hired by <span style={{ 
            background: 'linear-gradient(to right, #4f46e5, #9333ea)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>modern companies</span>
        </h1>

        <p style={{ 
          fontSize: '1.25rem', 
          color: '#64748b', 
          maxWidth: '700px', 
          margin: '0 auto 3rem auto',
          lineHeight: 1.6
        }}>
          HireStream connects the next generation of talent with startups that actually care. No more shouting into the void. Just real connections.
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          flexWrap: 'wrap' 
        }}>
          <Link to="/register" style={{ 
            padding: '1.25rem 2.5rem', 
            backgroundColor: '#4f46e5', 
            color: 'white', 
            borderRadius: '12px', 
            fontWeight: 700, 
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.4)'
          }}>
            I'm a Job Seeker
          </Link>
          <Link to="/register" style={{ 
            padding: '1.25rem 2.5rem', 
            backgroundColor: 'white', 
            color: '#0f172a', 
            borderRadius: '12px', 
            fontWeight: 700, 
            fontSize: '1.1rem',
            textDecoration: 'none',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s'
          }}>
            I'm Hiring Talent
          </Link>
        </div>

        {/* Floating Cards (Visual Decorative Elements) */}
        <div className="stats-grid-v2" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem', 
          marginTop: '6rem' 
        }}>
          {[
            { label: 'Active Opportunities', val: '12k+', icon: <FiTarget /> },
            { label: 'Fortune 500 Partners', val: '450+', icon: <FiSearch /> },
            { label: 'Success Rate', val: '94%', icon: <FiAward /> }
          ].map((stat, i) => (
            <div key={i} style={{ 
              backgroundColor: 'rgba(255,255,255,0.8)', 
              backdropFilter: 'blur(10px)',
              padding: '1.5rem', 
              borderRadius: '24px', 
              border: '1px solid #f1f5f9',
              textAlign: 'left'
            }}>
              <div style={{ color: '#4f46e5', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{stat.val}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
