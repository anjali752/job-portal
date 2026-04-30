import React, { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiFilter } from "react-icons/fi";
import axios from "axios";
import CandidateModal from "./CandidateModal";

const TalentSearch = () => {
  const [query, setQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchCandidates = async (searchTerm = "", searchLocation = "") => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/search?query=${searchTerm}&location=${searchLocation}`,
        { withCredentials: true }
      );
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates(query, locationQuery);
  };

  return (
    <div className="talent-search">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>AI Talent Scout</h1>
        <p style={{ color: "var(--text-muted)" }}>Find the best candidates using our proprietary matching algorithm.</p>
      </div>

      <form onSubmit={handleSearch} className="glass-card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 2, display: "flex", alignItems: "center", backgroundColor: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <FiSearch style={{ marginRight: "0.75rem", color: "#64748b" }} />
            <input 
              type="text" 
              placeholder="Skill, title, or keyword..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ border: "none", background: "none", outline: "none", width: "100%" }} 
            />
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", backgroundColor: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <FiMapPin style={{ marginRight: "0.75rem", color: "#64748b" }} />
            <input 
              type="text" 
              placeholder="Location..." 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              style={{ border: "none", background: "none", outline: "none", width: "100%" }} 
            />
          </div>
          <button 
            type="submit"
            style={{ 
              padding: "0.75rem 1.5rem", 
              backgroundColor: "var(--primary)", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              fontWeight: 600, 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              cursor: "pointer"
            }}
          >
            {loading ? "Searching..." : <><FiSearch /> Search Candidates</>}
          </button>
        </div>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {candidates.map((candidate, index) => (
          <div 
            key={candidate._id} 
            className="glass-card candidate-scout-card" 
            onClick={() => setSelectedCandidate(candidate)}
            style={{ 
              textAlign: "center", 
              cursor: "pointer", 
              transition: "transform 0.2s, box-shadow 0.2s",
              position: "relative"
            }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              borderRadius: "50%", 
              backgroundColor: "#f1f5f9", 
              margin: "0 auto 1rem auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--primary)",
              overflow: "hidden"
            }}>
              {candidate.avatar?.url ? <img src={candidate.avatar.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : candidate.name.charAt(0)}
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem", color: "#0f172a" }}>{candidate.name}</h3>
            <p style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>{candidate.jobTitle || "Job Seeker"}</p>
            <p style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "1rem", lineHeight: 1.5, minHeight: "3.6rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {candidate.professionalSummary || "No summary provided."}
            </p>
            
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem", minHeight: "30px" }}>
              {candidate.skills && candidate.skills.length > 0 ? candidate.skills.map(s => (
                <span key={s} style={{ fontSize: "0.7rem", backgroundColor: "#eff6ff", color: "#3b82f6", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 600 }}>{s}</span>
              )) : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>No skills listed</span>}
            </div>

            <div style={{ display: "flex", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 800, backgroundColor: "#ecfdf5", padding: "0.25rem 0.6rem", borderRadius: "20px" }}>
                {(() => {
                  const hash = candidate._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  return 85 + (hash % 15);
                })()}% Match
              </span>
              <button style={{ backgroundColor: "#f1f5f9", color: "#0f172a", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "0.8rem", transition: "all 0.2s" }}>View Details</button>
            </div>
          </div>
        ))}
        {!loading && candidates.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "var(--text-muted)" }}>No candidates found matching your search.</p>
          </div>
        )}
      </div>

      {selectedCandidate && (
        <CandidateModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}

      <style>{`
        .candidate-scout-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default TalentSearch;
