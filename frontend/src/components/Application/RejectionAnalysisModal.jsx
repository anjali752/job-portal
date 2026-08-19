import React from "react";
import { FiX, FiCheckCircle, FiAlertCircle, FiTrendingUp } from "react-icons/fi";

const RejectionAnalysisModal = ({ analysis, onClose }) => {
  if (!analysis) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10000,
      backdropFilter: "blur(5px)"
    }}>
      <div className="glass-card" style={{
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        backgroundColor: "white",
        borderRadius: "24px",
        overflowY: "auto",
        padding: "2rem",
        position: "relative",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        animation: "fadeIn 0.3s ease-out"
      }}>
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1.5rem", right: "1.5rem", border: "none", background: "#f1f5f9", borderRadius: "50%", padding: "0.5rem", cursor: "pointer", display: "flex" }}
        >
          <FiX size={20} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "80px", height: "80px", margin: "0 auto 1rem", position: "relative" }}>
             <svg width="80" height="80" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke="#4f46e5" strokeWidth="8" 
                  strokeDasharray={`${2.82 * analysis.matchScore} 282`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
             </svg>
             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "1.2rem", fontWeight: 800, color: "#4f46e5" }}>
               {analysis.matchScore}%
             </div>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>AI Feedback Report</h2>
          <p style={{ color: "#64748b" }}>Deep analysis of your application match.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Section icon={<FiAlertCircle color="#ef4444" />} title="Why was it rejected?" items={analysis.reasons} bg="#fef2f2" />
          <Section icon={<FiCheckCircle color="#10b981" />} title="Missing Skills" items={analysis.missingSkills} bg="#f0fdf4" />
          <Section icon={<FiTrendingUp color="#3b82f6" />} title="Suggested Improvements" items={analysis.improvements} bg="#eff6ff" />
        </div>

        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <button 
            onClick={onClose}
            style={{ padding: "0.75rem 2.5rem", borderRadius: "12px", border: "none", background: "#4f46e5", color: "white", fontWeight: 700, cursor: "pointer" }}
          >
            Got it, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ icon, title, items, bg }) => {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ backgroundColor: bg, padding: "1.25rem", borderRadius: "16px" }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 0.75rem 0", fontSize: "1rem", fontWeight: 800 }}>
        {icon} {title}
      </h4>
      <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.9rem", color: "#334155", lineHeight: 1.6 }}>
        {items.map((item, idx) => <li key={idx} style={{ marginBottom: "0.4rem" }}>{item}</li>)}
      </ul>
    </div>
  );
};

export default RejectionAnalysisModal;
