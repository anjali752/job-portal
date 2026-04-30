import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import { FiMapPin, FiBriefcase, FiDollarSign, FiCalendar, FiClock, FiArrowLeft, FiHeart, FiAlertCircle, FiCheckCircle, FiCpu, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
};

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const { isAuthorized, user } = useContext(Context);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const renderSkillMatchJSON = (data) => {
    if (!data) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#334155', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: data.matchScore >= 70 ? '#10b981' : data.matchScore >= 40 ? '#f59e0b' : '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
            {data.matchScore}%
          </div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>Match Score</div>
        </div>
        
        <div>
          <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Key Strengths</strong>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#475569' }}>
            {data.strengths?.map((s, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
          </ul>
        </div>

        <div>
          <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Skill Gaps</strong>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#ef4444' }}>
            {data.gaps?.length > 0 ? data.gaps.map((g, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{g}</li>) : <li>No major gaps detected.</li>}
          </ul>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '8px', borderLeft: '4px solid #4f46e5', marginTop: '0.5rem' }}>
          <strong>Recommendation:</strong> {data.recommendation}
        </div>
      </div>
    );
  };

  const handleAnalyzeMatch = async () => {
    setAnalyzing(true);
    try {
      const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1").replace("/api/v1", "");
      
      const { data } = await axios.post(`${apiBase}/api/ai/match`, {
        skills: user.skills ? user.skills.join(", ") : "None",
        jobDescription: job.description
      }, { withCredentials: true });
      
      setAiAnalysis(data.reply);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to analyze match.");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (isAuthorized && user?.role === "Job Seeker") {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/application/jobseeker/getall`,
            { withCredentials: true }
          );
          const applied = data.applications.some(app => {
            const appId = typeof app.jobId === 'object' ? app.jobId?._id : app.jobId;
            return appId === id;
          });
          setHasApplied(applied);
        } catch (error) {
          console.error("Failed to check status");
        }
      }
    };
    fetchApplicationStatus();
  }, [id, isAuthorized, user]);

  useEffect(() => {
    if (user?.savedJobs && job?._id) {
      setIsSaved(user.savedJobs.includes(job._id));
    }
  }, [user, job]);

  const handleSaveJob = async () => {
    try {
      if (isSaved) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/user/unsave/job/${id}`, { withCredentials: true });
        toast.success("Removed");
        setIsSaved(false);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/user/save/job`, { jobId: id }, { withCredentials: true });
        toast.success("Saved");
        setIsSaved(true);
      }
    } catch (error) {
      toast.error("Wishlist error");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/job/${id}`, { withCredentials: true });
        setJob(data.job);
      } catch (error) {
        navigateTo("/notfound");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigateTo]);

  if (!isAuthorized) return <Navigate to="/login" />;
  if (loading) return <div style={{ padding: "5rem", textAlign: "center" }}>Loading details...</div>;

  return (
    <section style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: isMobile ? "1rem 0" : "2rem 0" }}>
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.25rem" }}>
        
        <button onClick={() => navigateTo(-1)} style={{ border: "none", background: "none", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", color: "#64748b", fontWeight: 700, cursor: "pointer" }}>
          <FiArrowLeft /> Back
        </button>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ 
            padding: isMobile ? "1.5rem" : "3rem", 
            backgroundColor: "#0f172a", 
            color: "white", 
            backgroundImage: "linear-gradient(45deg, #0f172a 0%, #1e1b4b 100%)"
          }}>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1.5rem", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end" }}>
              <div>
                 <p style={{ color: "var(--primary)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.7rem", marginBottom: "0.5rem" }}>{job?.category}</p>
                 <h1 style={{ fontSize: isMobile ? "1.75rem" : "2.5rem", fontWeight: 900, marginBottom: "1rem", lineHeight: 1.2 }}>{job?.title}</h1>
                 
                 <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                      <FiMapPin color="var(--primary)" /> {job?.city}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                      <FiCalendar color="var(--primary)" /> {new Date(job?.jobPostedOn).toLocaleDateString()}
                    </div>
                 </div>
              </div>

              {user?.role === "Job Seeker" && (
                <div style={{ display: "flex", gap: "0.75rem", width: isMobile ? "100%" : "auto" }}>
                   <button onClick={handleSaveJob} style={{ width: isMobile ? "50px" : "auto", padding: "0.75rem", borderRadius: "10px", border: "none", backgroundColor: isSaved ? "#f43f5e" : "white", color: isSaved ? "white" : "#64748b", cursor: "pointer" }}>
                     <FiHeart fill={isSaved ? "white" : "none"} size={20} />
                   </button>
                   
                   {job.expired ? (
                     <div style={{ flex: 1, backgroundColor: "#fef2f2", color: "#ef4444", padding: "0.75rem", borderRadius: "10px", textAlign: "center", fontWeight: 800, fontSize: "0.9rem" }}>CLOSED</div>
                   ) : hasApplied ? (
                    <div style={{ flex: 1, backgroundColor: "#ecfdf5", color: "#059669", padding: "0.75rem", borderRadius: "10px", textAlign: "center", fontWeight: 800, fontSize: "0.9rem" }}>APPLIED ✅</div>
                   ) : (
                     <Link to={`/application/${job?._id}`} style={{ flex: 1, backgroundColor: "var(--primary)", color: "white", padding: "0.75rem 2rem", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: 700, fontSize: "1rem", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}>Apply Now</Link>
                   )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: "2rem", padding: isMobile ? "1.5rem" : "3rem" }}>
            <div>
               <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem" }}>Job Description</h3>
               <div style={{ color: "#475569", lineHeight: 1.7, fontSize: "1rem", whiteSpace: "pre-wrap" }}>{job.description}</div>
               
               <div style={{ marginTop: "2rem", borderTop: "1px solid #f1f5f9", paddingTop: "2rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.5rem" }}>Location</h3>
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}><FiMapPin /> {job.location}</p>
               </div>
            </div>

            <aside>
               <div style={{ backgroundColor: "#f8fafc", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "1.25rem" }}>Facts & Figures</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.25rem" }}>Salary</p>
                      <div style={{ color: "#10b981", fontWeight: 800, fontSize: "1.1rem" }}>${job.fixedSalary ? job.fixedSalary : `${job.salaryFrom}-${job.salaryTo}`}</div>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.25rem" }}>Category</p>
                      <div style={{ color: "#0f172a", fontWeight: 700, fontSize: "0.9rem" }}>{job.category}</div>
                    </div>
                  </div>
               </div>

               {user?.role === "Job Seeker" && (
                 <div style={{ backgroundColor: "#eef2ff", padding: "1.25rem", borderRadius: "12px", border: "1px solid #c7d2fe", marginTop: "1.5rem", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "-10px", right: "-10px", opacity: 0.1 }}>
                      <FiCpu size={80} color="#4f46e5" />
                    </div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#4338ca", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FiCpu /> AI Skill Match
                    </h3>
                    
                    {!aiAnalysis ? (
                      <>
                        <p style={{ fontSize: "0.85rem", color: "#4f46e5", marginBottom: "1rem", lineHeight: 1.5 }}>
                          See how well your profile matches this job description.
                        </p>
                        <button 
                          onClick={handleAnalyzeMatch}
                          disabled={analyzing}
                          style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "none", backgroundColor: "#4f46e5", color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: analyzing ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)" }}
                        >
                          {analyzing ? <><div className="loader-ring-small"></div> Analyzing...</> : "Run Analysis"}
                        </button>
                      </>
                    ) : (
                      <div style={{ marginTop: "1rem", borderTop: "1px solid #c7d2fe", paddingTop: "1rem" }}>
                        {renderSkillMatchJSON(aiAnalysis)}
                        <button 
                          onClick={handleAnalyzeMatch}
                          disabled={analyzing}
                          style={{ marginTop: "1rem", background: "none", border: "none", color: "#4f46e5", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", textDecoration: "underline", display: "flex", alignItems: "center", gap: "0.25rem" }}
                        >
                           {analyzing ? "Re-analyzing..." : "Run Again"}
                        </button>
                      </div>
                    )}
                 </div>
               )}
             </aside>
          </div>
        </div>
      </div>
      <style>{`
        .loader-ring-small {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default JobDetails;
