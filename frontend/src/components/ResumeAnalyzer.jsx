import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiFileText, FiUploadCloud, FiCheckCircle, FiCpu, FiAlertCircle, FiBarChart2, FiTarget, FiStar, FiChevronRight } from "react-icons/fi";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
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
      console.error("Analysis error:", error);
      const errorMsg = error.response?.data?.message || "Server analysis failed. Please try a different resume or check your connection.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderJSONResponse = (data) => {
    if (!data) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: data.score > 70 ? '#10b981' : '#f59e0b' }}>
            {data.score}
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#1e293b' }}>ATS Score</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Out of 100</p>
          </div>
        </div>

        <div>
          <h3 style={{ color: '#1e293b', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Identified Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {data.skills?.map((skill, i) => (
              <span key={i} style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600 }}>{skill}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ color: '#1e293b', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Missing Keywords</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {data.missing_keywords?.map((kw, i) => (
              <span key={i} style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600 }}>{kw}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ color: '#1e293b', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Recommendations for Improvement</h3>
          <ul style={{ paddingLeft: '1.5rem', color: '#475569', lineHeight: 1.6 }}>
            {data.improvements?.map((rec, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", backgroundColor: "#e0e7ff", padding: "0.5rem 1.25rem", borderRadius: "50px", marginBottom: "1.5rem", color: "#4338ca", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.5px" }}>
          <FiStar /> PRO FEATURE
        </div>
        <h2 style={{ fontSize: "3rem", fontWeight: 900, color: "#0f172a", marginBottom: "1rem", letterSpacing: "-1px" }}>
          AI Resume <span style={{ color: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(90deg, #4f46e5, #0ea5e9)" }}>Analyzer</span>
        </h2>
        <p style={{ color: "#64748b", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
          Upload your resume and our advanced AI will instantly review it against industry standards to help you land your dream job.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1.5fr" : "1fr", gap: "2.5rem", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", alignItems: "start" }}>
        
        {/* Upload Section */}
        <div style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.8)", 
          backdropFilter: "blur(20px)", 
          borderRadius: "24px", 
          padding: "3rem 2rem", 
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          transition: "transform 0.3s ease"
        }}>
          
          <div style={{ width: "100%", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiTarget style={{ color: "#4f46e5" }} /> 1. Upload Resume
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>PDF, DOCX, or TXT format (Max 5MB)</p>
          </div>

          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            style={{ 
              width: "100%", 
              position: "relative", 
              border: dragActive ? "2px dashed #4f46e5" : file ? "2px dashed #10b981" : "2px dashed #cbd5e1", 
              borderRadius: "20px", 
              padding: "4rem 2rem", 
              textAlign: "center",
              backgroundColor: dragActive ? "#e0e7ff" : file ? "#f0fdf4" : "#f8fafc",
              transition: "all 0.2s ease",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "280px"
            }}
          >
            <input 
              ref={inputRef}
              type="file" 
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => e.target.files && e.target.files[0] && setFile(e.target.files[0])} 
              style={{ display: "none" }}
            />
            
            <div style={{ 
              width: "80px", height: "80px", borderRadius: "50%", 
              backgroundColor: dragActive ? "#c7d2fe" : file ? "#d1fae5" : "#e2e8f0", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              marginBottom: "1.5rem", transition: "all 0.3s ease"
            }}>
              {!file ? (
                <FiUploadCloud size={40} style={{ color: dragActive ? "#4f46e5" : "#64748b" }} />
              ) : (
                <FiCheckCircle size={40} style={{ color: "#10b981" }} />
              )}
            </div>

            {!file ? (
              <>
                <p style={{ fontWeight: 700, color: dragActive ? "#4338ca" : "#334155", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  {dragActive ? "Drop file here!" : "Click or drag file to upload"}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Supported formats: PDF, DOCX, TXT</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 800, color: "#065f46", fontSize: "1.1rem", marginBottom: "0.5rem", wordBreak: "break-all" }}>{file.name}</p>
                <div style={{ display: "inline-block", backgroundColor: "#10b981", color: "white", padding: "0.25rem 0.75rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: 700 }}>
                  Ready for analysis
                </div>
              </>
            )}
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); handleUpload(); }} 
            disabled={loading || !file}
            style={{ 
              width: "100%",
              marginTop: "2rem",
              background: loading ? "#94a3b8" : !file ? "#e2e8f0" : "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)", 
              color: !file ? "#94a3b8" : "white", 
              padding: "1.25rem", 
              borderRadius: "16px", 
              fontWeight: 800, 
              fontSize: "1.1rem", 
              border: "none", 
              cursor: loading || !file ? "not-allowed" : "pointer",
              boxShadow: !file || loading ? "none" : "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem"
            }}>
            {loading ? (
              <>
                <div className="loader-ring"></div>
                Analyzing Profile...
              </>
            ) : (
              <>
                <FiCpu size={22} /> Generate AI Report
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div style={{ 
            backgroundColor: "#ffffff", 
            borderRadius: "24px", 
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            animation: "fadeInRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            opacity: 0,
            transform: "translateX(20px)"
          }}>
            {/* Result Header */}
            <div style={{ 
              backgroundColor: "#f8fafc", 
              borderBottom: "1px solid #e2e8f0", 
              padding: "1.5rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.75rem", margin: 0 }}>
                <FiBarChart2 style={{ color: "#4f46e5" }} /> Actionable Insights
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontSize: "0.85rem", fontWeight: 700, backgroundColor: "#d1fae5", padding: "0.4rem 0.8rem", borderRadius: "50px" }}>
                <FiCheckCircle /> Scan Complete
              </div>
            </div>

            {/* Formatted Result Body */}
            <div style={{ 
              padding: "2rem", 
              maxHeight: "700px", 
              overflowY: "auto",
              color: "#334155",
              fontSize: "1.05rem"
            }} className="custom-scrollbar">
              {renderJSONResponse(result)}
            </div>
            
            {/* Result Footer */}
            <div style={{ 
              padding: "1.5rem 2rem", 
              backgroundColor: "#f8fafc", 
              borderTop: "1px solid #e2e8f0",
              textAlign: "right"
            }}>
               <button 
                 onClick={() => { setResult(""); setFile(null); }} 
                 style={{ 
                   background: "white", 
                   border: "1px solid #cbd5e1", 
                   color: "#475569", 
                   fontWeight: 700, 
                   padding: "0.75rem 1.5rem",
                   borderRadius: "10px",
                   cursor: "pointer",
                   transition: "all 0.2s ease"
                 }}
                 onMouseOver={(e) => { e.target.style.backgroundColor = "#f1f5f9"; e.target.style.color = "#0f172a"; }}
                 onMouseOut={(e) => { e.target.style.backgroundColor = "white"; e.target.style.color = "#475569"; }}
               >
                 Analyze Another Resume
               </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .loader-ring {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 900px) {
          .resume-analyzer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalyzer;