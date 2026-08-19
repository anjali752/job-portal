import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUploadCloud, FiCheckCircle, FiCpu, FiBarChart2, FiStar, FiTarget, FiAlertCircle } from "react-icons/fi";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a resume file first");
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1").replace("/api/v1", "");
      const { data } = await axios.post(`${apiBase}/api/ai/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setResult(data.reply);
      toast.success("Analysis complete!");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Analysis failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const ScoreRing = ({ score }) => {
    const color = score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", backgroundColor: "#f8fafc", padding: "1.25rem", borderRadius: "16px", marginBottom: "1.5rem" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: `5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, backgroundColor: "white" }}>
          <span style={{ fontSize: "1.4rem", fontWeight: 900, color }}>{score}</span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>ATS Score</p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
            {score >= 70 ? "🎉 Great match! Keep it up." : score >= 50 ? "⚠️ Needs some improvement." : "❗ Significant improvements needed."}
          </p>
        </div>
      </div>
    );
  };

  const renderResults = (data) => {
    if (!data) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <ScoreRing score={data.score} />

        {data.skills?.length > 0 && (
          <div>
            <h3 style={{ margin: "0 0 0.75rem", color: "#1e293b", fontSize: "1rem", fontWeight: 800 }}>✅ Identified Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {data.skills.map((skill, i) => (
                <span key={i} style={{ backgroundColor: "#e0e7ff", color: "#4338ca", padding: "0.3rem 0.75rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: 600 }}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {data.missing_keywords?.length > 0 && (
          <div>
            <h3 style={{ margin: "0 0 0.75rem", color: "#1e293b", fontSize: "1rem", fontWeight: 800 }}>🔍 Missing Keywords</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {data.missing_keywords.map((kw, i) => (
                <span key={i} style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "0.3rem 0.75rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: 600 }}>{kw}</span>
              ))}
            </div>
          </div>
        )}

        {data.improvements?.length > 0 && (
          <div>
            <h3 style={{ margin: "0 0 0.75rem", color: "#1e293b", fontSize: "1rem", fontWeight: 800 }}>💡 Recommendations</h3>
            <ul style={{ padding: "0 0 0 1.25rem", margin: 0, color: "#475569", lineHeight: 1.7 }}>
              {data.improvements.map((rec, i) => (
                <li key={i} style={{ marginBottom: "0.4rem", fontSize: "0.9rem" }}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ra-wrapper">
      <style>{`
        .ra-wrapper {
          padding: 1.5rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
        }
        .ra-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .ra-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #e0e7ff;
          color: #4338ca;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          padding: 0.35rem 1rem;
          border-radius: 50px;
          margin-bottom: 1rem;
        }
        .ra-title {
          font-size: 1.75rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 0.75rem;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .ra-subtitle {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0 auto;
          line-height: 1.6;
          max-width: 500px;
        }
        .ra-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        .ra-upload-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08);
          border: 1px solid rgba(226,232,240,0.8);
        }
        .ra-drop-zone {
          width: 100%;
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          padding: 2rem 1rem;
          text-align: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 160px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .ra-drop-zone.drag { border-color: #4f46e5; background: #e0e7ff; }
        .ra-drop-zone.has-file { border-color: #10b981; background: #f0fdf4; }
        .ra-drop-zone.empty { background: #f8fafc; }
        .ra-icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }
        .ra-filename {
          font-weight: 800;
          color: #065f46;
          font-size: 0.95rem;
          word-break: break-word;
          overflow-wrap: anywhere;
          white-space: normal;
          max-width: 100%;
          text-align: center;
          margin-bottom: 0.5rem;
          display: block;
          padding: 0 0.5rem;
        }
        .ra-analyze-btn {
          width: 100%;
          margin-top: 1.25rem;
          padding: 1rem;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.3s ease;
        }
        .ra-result-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          animation: fadeUp 0.5s ease forwards;
        }
        .ra-result-header {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 1.25rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: space-between;
          align-items: center;
        }
        .ra-result-body {
          padding: 1.25rem;
          max-height: 65vh;
          overflow-y: auto;
        }
        .ra-result-footer {
          padding: 1rem 1.25rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          text-align: right;
        }
        .ra-reset-btn {
          background: white;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-weight: 700;
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .ra-reset-btn:hover { background: #f1f5f9; color: #0f172a; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .loader-ring {
          display: inline-block;
          width: 18px; height: 18px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Tablet and up */
        @media (min-width: 768px) {
          .ra-wrapper { padding: 2rem; }
          .ra-title { font-size: 2.5rem; }
          .ra-header { margin-bottom: 3rem; }
          .ra-upload-card { padding: 2.5rem 2rem; }
          .ra-drop-zone { padding: 3rem 2rem; min-height: 220px; }
          .ra-icon-circle { width: 75px; height: 75px; }
          .ra-result-body { padding: 1.75rem; }
          .ra-result-header { padding: 1.25rem 1.75rem; }
        }

        /* Desktop: two-column when result is shown */
        @media (min-width: 1024px) {
          .ra-title { font-size: 3rem; }
          .ra-grid.has-result {
            grid-template-columns: 1fr 1.5fr;
          }
        }
      `}</style>

      {/* Header */}
      <div className="ra-header">
        <div className="ra-badge">
          <FiStar /> PRO FEATURE
        </div>
        <h2 className="ra-title">
          AI Resume <span style={{ color: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(90deg, #4f46e5, #0ea5e9)" }}>Analyzer</span>
        </h2>
        <p className="ra-subtitle">
          Upload your resume and our AI will instantly review it against industry standards to help you land your dream job.
        </p>
      </div>

      {/* Main Grid */}
      <div className={`ra-grid ${result ? "has-result" : ""}`}>

        {/* Upload Card */}
        <div className="ra-upload-card">
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiTarget style={{ color: "#4f46e5" }} /> 1. Upload Resume
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>PDF, DOCX, or TXT format (Max 5MB)</p>
          </div>

          {/* Drop Zone */}
          <div
            className={`ra-drop-zone ${dragActive ? "drag" : file ? "has-file" : "empty"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              style={{ display: "none" }}
            />

            <div className="ra-icon-circle" style={{ backgroundColor: dragActive ? "#c7d2fe" : file ? "#d1fae5" : "#e2e8f0" }}>
              {!file
                ? <FiUploadCloud size={32} style={{ color: dragActive ? "#4f46e5" : "#64748b" }} />
                : <FiCheckCircle size={32} style={{ color: "#10b981" }} />
              }
            </div>

            {!file ? (
              <>
                <p style={{ fontWeight: 700, color: dragActive ? "#4338ca" : "#334155", fontSize: "1rem", margin: "0 0 0.25rem" }}>
                  {dragActive ? "Drop it here!" : "Click or drag file here"}
                </p>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>PDF, DOCX, TXT supported</p>
              </>
            ) : (
              <>
                <span className="ra-filename">{file.name}</span>
                <div style={{ backgroundColor: "#10b981", color: "white", padding: "0.2rem 0.75rem", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 700 }}>
                  Ready for analysis
                </div>
              </>
            )}
          </div>

          {/* Analyze Button */}
          <button
            className="ra-analyze-btn"
            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
            disabled={loading || !file}
            style={{
              background: loading ? "#94a3b8" : !file ? "#e2e8f0" : "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
              color: !file ? "#94a3b8" : "white",
              cursor: loading || !file ? "not-allowed" : "pointer",
              boxShadow: !file || loading ? "none" : "0 8px 20px -5px rgba(79,70,229,0.4)",
            }}
          >
            {loading ? <><div className="loader-ring" /> Analyzing...</> : <><FiCpu size={20} /> Generate AI Report</>}
          </button>
        </div>

        {/* Results Card */}
        {result && (
          <div className="ra-result-card">
            <div className="ra-result-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.6rem", margin: 0 }}>
                <FiBarChart2 style={{ color: "#4f46e5" }} /> Actionable Insights
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#10b981", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "#d1fae5", padding: "0.35rem 0.75rem", borderRadius: "50px" }}>
                <FiCheckCircle /> Scan Complete
              </div>
            </div>

            <div className="ra-result-body custom-scrollbar">
              {renderResults(result)}
            </div>

            <div className="ra-result-footer">
              <button className="ra-reset-btn" onClick={() => { setResult(""); setFile(null); }}>
                ↩ Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;