import React, { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiFilter } from "react-icons/fi";
import axios from "axios";

const TalentSearch = () => {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async (searchTerm = "") => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/search?query=${searchTerm}`,
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
    fetchCandidates(query);
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
            <input type="text" placeholder="Location..." style={{ border: "none", background: "none", outline: "none", width: "100%" }} />
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
          <div key={candidate._id} className="glass-card" style={{ textAlign: "center" }}>
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
              color: "var(--primary)"
            }}>
              {candidate.name.charAt(0)}
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{candidate.name}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>{candidate.title || "Job Seeker"}</p>
            
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem", minHeight: "30px" }}>
              {candidate.skills && candidate.skills.length > 0 ? candidate.skills.map(s => (
                <span key={s} style={{ fontSize: "0.7rem", backgroundColor: "#eff6ff", color: "#3b82f6", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 600 }}>{s}</span>
              )) : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>No skills listed</span>}
            </div>

            <div style={{ display: "flex", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 700 }}>95% Match</span>
              <button style={{ color: "var(--primary)", background: "none", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>View Profile</button>
            </div>
          </div>
        ))}
        {!loading && candidates.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "var(--text-muted)" }}>No candidates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentSearch;
