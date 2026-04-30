import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { FiPlus, FiUsers, FiStar, FiTrendingUp, FiZap, FiActivity } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Hook to detect screen width reactively
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
};

const RecruiterDashboard = () => {
  const { user } = useContext(Context);
  const navigateTo = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isSmall = width < 500;

  const [statsData, setStatsData] = useState({
    activeJobs: 4,
    totalApplicants: 12,
    interviewsScheduled: 3,
    positionsFilled: 1
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const appsRes = await axios.get(`${import.meta.env.VITE_API_URL}/application/employer/getall`, { withCredentials: true });
        setRecentApps(appsRes.data.applications.slice(0, 5));
        
        setStatsData({
           activeJobs: appsRes.data.applications.length > 0 ? 5 : 0, 
           totalApplicants: appsRes.data.applications.length,
           interviewsScheduled: 2,
           positionsFilled: 1
        });
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Active Jobs", count: statsData.activeJobs, icon: <FiStar color="#4f46e5" />, bg: "#eef2ff", trend: "+12%" },
    { title: "Applications", count: statsData.totalApplicants, icon: <FiUsers color="#10b981" />, bg: "#ecfdf5", trend: "+24%" },
    { title: "Interviews", count: statsData.interviewsScheduled, icon: <FiActivity color="#f59e0b" />, bg: "#fffbeb", trend: "Stable" },
    { title: "Hired", count: statsData.positionsFilled, icon: <FiZap color="#ec4899" />, bg: "#fdf2f8", trend: "+5%" },
  ];

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="recruiter-dashboard" style={{ animation: "fadeIn 0.5s ease-out", padding: isMobile ? "0.5rem" : "0" }}>
      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: isMobile ? "flex-start" : "flex-end", 
        marginBottom: "2.5rem",
        gap: "1.5rem"
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-1px" }}>
            Welcome back, <span style={{ color: "var(--primary)" }}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 0 0", fontSize: "1rem" }}>Here's what's happening with your recruitment pipeline today.</p>
        </div>
        <button 
          onClick={() => navigateTo("/recruiter/jobs/manage")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            width: isMobile ? "100%" : "auto",
            gap: "0.6rem", 
            padding: "0.8rem 1.75rem", 
            backgroundColor: "#0f172a", 
            color: "#fff", 
            border: "none", 
            borderRadius: "12px", 
            fontWeight: 700, 
            cursor: "pointer",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            transition: "0.3s"
          }}>
          <FiPlus /> Post a New Position
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isSmall ? "1fr 1fr" : isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: isMobile ? "1rem" : "1.5rem", 
        marginBottom: "2.5rem" 
      }}>
        {stats.map((stat, index) => (
          <div key={index} className="glass-card" style={{ padding: isMobile ? "1.25rem" : "1.75rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", background: stat.bg, opacity: 0.3, borderRadius: "50%", zIndex: 0 }}></div>
            <div style={{ position: "relative", zIndex: 1 }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? "0.75rem" : "1.25rem" }}>
                  <div style={{ 
                    width: isMobile ? "40px" : "48px", 
                    height: isMobile ? "40px" : "48px", 
                    borderRadius: "12px", 
                    backgroundColor: stat.bg, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: isMobile ? "1.1rem" : "1.3rem"
                  }}>
                    {stat.icon}
                  </div>
                  {!isMobile && <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 800, backgroundColor: "#dcfce7", padding: "0.25rem 0.6rem", borderRadius: "20px" }}>{stat.trend}</span>}
               </div>
               <h3 style={{ fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 900, margin: "0.5rem 0", color: "#0f172a" }}>{stat.count || 0}</h3>
               <p style={{ color: "#64748b", fontSize: isMobile ? "0.75rem" : "0.9rem", fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: "2rem" }}>
        {/* Recent Applicants */}
        <div className="glass-card" style={{ padding: isMobile ? "1.25rem" : "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
             <h3 style={{ fontSize: isMobile ? "1.1rem" : "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Recent Candidates</h3>
             <button onClick={() => navigateTo("/recruiter/applications")} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>View All</button>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "400px" : "auto" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f1f5f9" }}>
                  <th style={{ padding: "0 0 1rem 0", color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>Candidate Profile</th>
                  <th style={{ padding: "0 0 1rem 0", color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "0 0 1rem 0", color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.length > 0 ? recentApps.map((applicant, i) => (
                  <tr key={applicant._id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "1.25rem 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                         <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#475569", fontSize: "0.85rem" }}>
                           {applicant.name?.charAt(0)}
                         </div>
                         <div>
                            <p style={{ fontWeight: 700, margin: 0, color: "#1e293b", fontSize: "0.9rem" }}>{applicant.name}</p>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>{applicant.email}</p>
                         </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.25rem 0" }}>
                       <span style={{ 
                          padding: "0.3rem 0.75rem", 
                          borderRadius: "8px", 
                          backgroundColor: "#fef3c7", 
                          color: "#92400e", 
                          fontSize: "0.7rem", 
                          fontWeight: 800 
                        }}>
                          NEW
                        </span>
                    </td>
                    <td style={{ padding: "1.25rem 0", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>
                       {new Date(applicant.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" style={{ padding: "3rem 0", textAlign: "center" }}>
                       <FiUsers size={32} style={{ color: "#e2e8f0", marginBottom: "1rem" }} />
                       <p style={{ margin: 0, color: "#94a3b8", fontWeight: 600 }}>No candidates yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hiring Insights Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
           <div className="glass-card" style={{ backgroundColor: "#0f172a", color: "white", padding: isMobile ? "1.5rem" : "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                 <FiTrendingUp color="#10b981" size={24} />
                 <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Hiring Velocity</h3>
              </div>
              <p style={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Your average time-to-hire has improved by <strong style={{color: "white"}}>15%</strong> this month. You're doing better than 80% of local recruiters.
              </p>
              <div style={{ padding: "1.25rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem", fontSize: "0.85rem", fontWeight: 600 }}>
                    <span>Profile Strength</span>
                    <span style={{ color: "#10b981" }}>85%</span>
                 </div>
                 <div style={{ height: "6px", width: "100%", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "85%", backgroundColor: "#10b981" }}></div>
                 </div>
              </div>
           </div>

           <div className="glass-card" style={{ padding: isMobile ? "1.5rem" : "2rem", borderLeft: "4px solid var(--primary)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>Quick Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                 <button onClick={() => navigateTo("/recruiter/search")} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "white", fontWeight: 700, color: "#475569", cursor: "pointer", textAlign: "left", fontSize: "0.85rem" }}>🔍 Search Top Talent</button>
                 <button onClick={() => navigateTo("/recruiter/profile")} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "white", fontWeight: 700, color: "#475569", cursor: "pointer", textAlign: "left", fontSize: "0.85rem" }}>⚙️ Account Settings</button>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .loader {
          border: 3px solid #f3f3f3;
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RecruiterDashboard;
