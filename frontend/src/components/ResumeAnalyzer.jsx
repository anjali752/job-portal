import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiFileText, FiUpload, FiCheckCircle, FiCpu, FiAlertCircle } from "react-icons/fi";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a resume file first");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1").replace("/api/v1", "");
      const res = await fetch(`${apiBase}/analyze-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.reply);
        toast.success("Analysis complete!");
      } else {
        toast.error(data.message || "Failed to analyze resume");
      }
    } catch (error) {
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-analyzer-container" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <FiCpu style={{ color: "var(--primary)" }} /> AI Resume Analyzer
        </h2>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Optimize your resume for ATS systems and landing your dream job.</p>
      </div>

      <div className="glass-card" style={{ padding: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        
        <div style={{ 
          width: "100%", 
          maxWidth: "500px", 
          position: "relative", 
          border: "2px dashed #e2e8f0", 
          borderRadius: "20px", 
          padding: "3rem 2rem", 
          textAlign: "center",
          backgroundColor: file ? "#f0fdf4" : "transparent",
          borderColor: file ? "#22c55e" : "#e2e8f0",
          transition: "var(--transition)"
        }}>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
          />
          {!file ? (
            <>
              <FiUpload size={48} style={{ color: "#94a3b8", marginBottom: "1.5rem" }} />
              <p style={{ fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Upload your resume (PDF, TXT, DOCX)</p>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Drag and drop or click to browse</p>
            </>
          ) : (
            <>
              <FiCheckCircle size={48} style={{ color: "#22c55e", marginBottom: "1.5rem" }} />
              <p style={{ fontWeight: 700, color: "#166534", marginBottom: "0.5rem" }}>{file.name}</p>
              <p style={{ fontSize: "0.85rem", color: "#166534" }}>Ready for deep analysis</p>
            </>
          )}
        </div>

        <button 
          onClick={handleUpload} 
          disabled={loading || !file}
          style={{ 
            backgroundColor: "#0f172a", 
            color: "white", 
            padding: "1rem 3rem", 
            borderRadius: "12px", 
            fontWeight: 700, 
            fontSize: "1.1rem", 
            border: "none", 
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            transition: "var(--transition)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}>
          {loading ? (
            <>Analyzing Brain... <FiCpu className="spin-animation" /></>
          ) : (
            <>Start Analysis <FiFileText /></>
          )}
        </button>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .spin-animation { animation: spin 2s linear infinite; }
        `}</style>
      </div>

      {result && (
        <div className="glass-card" style={{ marginTop: "3rem", padding: "3rem", animation: "slideUp 0.5s ease-out" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <FiAlertCircle style={{ color: "var(--primary)" }} /> Analysis Report
          </h3>
          <div style={{ 
            backgroundColor: "#f8fafc", 
            padding: "2rem", 
            borderRadius: "16px", 
            border: "1px solid #e2e8f0",
            color: "#334155",
            lineHeight: 1.8,
            fontSize: "1.05rem",
            whiteSpace: "pre-wrap"
          }}>
            {result}
          </div>
          
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
             <button onClick={() => setResult("")} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
               Clear Report & Start Over
             </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalyzer;