import React from "react";
import { FiUserPlus, FiSearch, FiCheckCircle } from "react-icons/fi";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiUserPlus />,
      title: "Set up your profile",
      desc: "Create a standout profile that highlights your unique skills and personality.",
    },
    {
      icon: <FiSearch />,
      title: "Find your match",
      desc: "Our AI helps you find companies that align with your values and goals.",
    },
    {
      icon: <FiCheckCircle />,
      title: "Get hired fast",
      desc: "Direct chat with hiring managers. No more middle-men or waiting weeks.",
    },
  ];

  return (
    <section style={{ backgroundColor: '#f8fafc', padding: '100px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Built for the <span style={{ color: '#4f46e5' }}>next generation</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            A streamlined process designed for speed and transparency.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem' 
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{ 
              textAlign: 'center', 
              position: 'relative',
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '32px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '50%', 
                backgroundColor: '#eff6ff', 
                color: '#4f46e5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2rem', 
                margin: '0 auto 2rem auto' 
              }}>
                {step.icon}
              </div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '1rem' }}>
                {step.title}
              </h4>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                {step.desc}
              </p>
              <div style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '2rem', 
                fontSize: '4rem', 
                fontWeight: 900, 
                color: '#f1f5f9', 
                zIndex: 0 
              }}>
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
