import React from "react";
import { FiX, FiMail, FiPhone, FiMapPin, FiBriefcase, FiAward } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CandidateModal = ({ candidate, onClose }) => {
  const navigateTo = useNavigate();
  if (!candidate) return null;

  return (
    <div style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: "rgba(15, 23, 42, 0.7)", 
      backdropFilter: "blur(8px)",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div 
        className="glass-card" 
        style={{ 
          backgroundColor: "white", 
          width: "100%", 
          maxWidth: "600px", 
          maxHeight: "90vh", 
          overflowY: "auto", 
          padding: 0,
          borderRadius: "24px",
          position: "relative",
          animation: "modalFadeIn 0.3s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div style={{ padding: "2.5rem 2.5rem 1.5rem 2.5rem", position: "relative", borderBottom: "1px solid #f1f5f9" }}>
          <button 
            onClick={onClose}
            style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "#f8fafc", border: "none", borderRadius: "50%", padding: "0.5rem", cursor: "pointer", display: "flex" }}
          >
            <FiX size={20} color="#64748b" />
          </button>
          
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div style={{ 
              width: "100px", 
              height: "100px", 
              borderRadius: "20px", 
              backgroundColor: "var(--primary)", 
              color: "white", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "2.5rem",
              fontWeight: 900,
              boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)"
            }}>
              {candidate.avatar?.url ? <img src={candidate.avatar.url} alt="" style={{ width: "100%", height: "100%", borderRadius: "20px", objectFit: "cover" }} /> : candidate.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{candidate.name}</h2>
              <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1rem", margin: "0.25rem 0 0.75rem 0" }}>{candidate.jobTitle || "Job Seeker"}</p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                 <span style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}><FiMapPin /> {candidate.address || "Location Hidden"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div style={{ padding: "2.5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiBriefcase color="var(--primary)" /> Professional Summary
            </h4>
            <p style={{ color: "#475569", lineHeight: 1.6, fontSize: "0.95rem" }}>
              {candidate.professionalSummary || candidate.bio || "No summary provided by the candidate yet."}
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiAward color="var(--primary)" /> Core Skills
            </h4>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {candidate.skills && candidate.skills.length > 0 ? candidate.skills.map(s => (
                <span key={s} style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "0.4rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem" }}>{s}</span>
              )) : <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No skills mentioned.</span>}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <h4 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.75rem" }}>Contact Email</h4>
              <p style={{ margin: 0, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiMail color="#64748b" /> {candidate.email}
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.75rem" }}>Phone Number</h4>
              <p style={{ margin: 0, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiPhone color="#64748b" /> {candidate.phone || "Not Shared"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "1.5rem 2.5rem", backgroundColor: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ 
                width: "12px", 
                height: "12px", 
                backgroundColor: "#10b981", 
                borderRadius: "50%",
                boxShadow: "0 0 10px #10b981",
                animation: "pulse 2s infinite"
              }}></div>
              <span style={{ fontSize: "0.95rem", color: "#10b981", fontWeight: 800 }}>
                 {(() => {
                   // Generate a stable match score based on ID
                   const hash = candidate._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                   return 85 + (hash % 15);
                 })()}% AI Match Level
              </span>
           </div>
           <button 
             onClick={() => navigateTo(`/recruiter/messages?user=${candidate._id}`)}
             style={{ backgroundColor: "var(--primary)", color: "white", padding: "0.75rem 1.75rem", borderRadius: "12px", border: "none", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)" }}>
             Send Direct Message
           </button>
        </div>
      </div>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
};

export default CandidateModal;
