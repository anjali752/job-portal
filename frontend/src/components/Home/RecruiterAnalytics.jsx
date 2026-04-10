import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../main";
import { 
  FiTrendingUp, 
  FiUsers, 
  FiBriefcase, 
  FiCheckCircle, 
  FiClock, 
  FiArrowRight,
  FiZap,
  FiActivity
} from "react-icons/fi";
import { Link } from "react-router-dom";

const RecruiterAnalytics = () => {
  const { isAuthorized } = useContext(Context);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/recruiter/stats`,
          { withCredentials: true }
        );
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching analytics", error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthorized) fetchStats();
  }, [isAuthorized]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div className="loader"></div>
    </div>
  );

  if (!stats) return null;

  const funnelData = [
    { label: "Total Reach", value: stats.totalApplicants * 2.5, color: "#ecfdf5", textColor: "#059669" },
    { label: "Applicants", value: stats.totalApplicants, color: "#eff6ff", textColor: "#2563eb" },
    { label: "Interviews", value: stats.interviewsScheduled, color: "#fff7ed", textColor: "#d97706" },
    { label: "Hired", value: stats.positionsFilled, color: "#fdf2f8", textColor: "#db2777" },
  ];

  return (
    <div className="analytics-container" style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Recruitment Analytics</h1>
        <p style={{ color: "#64748b", margin: "0.5rem 0 0 0", fontWeight: 600 }}>Real-time performance metrics for your hiring pipeline.</p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <StatCard 
          icon={<FiBriefcase />} 
          label="Active Content" 
          value={stats.activeJobs} 
          trend="+12%" 
          color="#4f46e5" 
        />
        <StatCard 
          icon={<FiUsers />} 
          label="Talent Pool" 
          value={stats.totalApplicants} 
          trend="+5%" 
          color="#10b981" 
        />
        <StatCard 
          icon={<FiClock />} 
          label="Interviews" 
          value={stats.interviewsScheduled} 
          trend="Constant" 
          color="#f59e0b" 
        />
        <StatCard 
          icon={<FiCheckCircle />} 
          label="Placements" 
          value={stats.positionsFilled} 
          trend="+20%" 
          color="#db2777" 
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem" }}>
        {/* Hiring Funnel Visualization */}
        <div className="glass-card" style={{ padding: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Hiring Velocity Funnel</h3>
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 700 }}>LAST 30 DAYS</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {funnelData.map((item, idx) => (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "0.9rem" }}>
                  <span style={{ color: "#475569" }}>{item.label}</span>
                  <span style={{ color: item.textColor }}>{item.value || 0}</span>
                </div>
                <div style={{ width: "100%", height: "12px", backgroundColor: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ 
                    width: `${Math.min((item.value / (stats.totalApplicants * 2.5 || 1)) * 100, 100)}%`, 
                    height: "100%", 
                    backgroundColor: item.textColor,
                    transition: "width 1s ease-out",
                    borderRadius: "10px"
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem", borderLeft: "4px solid #10b981", background: "#f0fdf4" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <FiZap size={24} color="#10b981" />
              <div>
                <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#166534" }}>AI Insight</h4>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "#166534", lineHeight: 1.5 }}>
                  Your "Positions Filled" rate is 20% higher than last month. Consider increasing current active job budget.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h4 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 800 }}>Efficiency Ratio</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#0f172a" }}>
                {stats.totalApplicants > 0 ? ((stats.positionsFilled / stats.totalApplicants) * 100).toFixed(1) : 0}%
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, lineHeight: 1.4 }}>
                Conversion from <br/> Applicant to Hire
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem", background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "white" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: 800 }}>Pro Feature</h4>
            <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.9, lineHeight: 1.5, marginBottom: "1.5rem" }}>
              Export detailed PDF reports of your hiring performance.
            </p>
            <button style={{ 
              width: "100%", 
              padding: "0.75rem", 
              borderRadius: "10px", 
              border: "none", 
              backgroundColor: "white", 
              color: "#4f46e5", 
              fontWeight: 800, 
              cursor: "pointer" 
            }}>
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }) => (
  <div className="glass-card" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
    <div>
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: color + "15", color: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
        {icon}
      </div>
      <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>{label}</p>
      <h2 style={{ margin: "0.25rem 0 0 0", fontSize: "1.75rem", fontWeight: 900, color: "#0f172a" }}>{value}</h2>
    </div>
    <div style={{ 
      fontSize: "0.75rem", 
      fontWeight: 800, 
      color: trend.startsWith("+") ? "#10b981" : "#64748b", 
      backgroundColor: trend.startsWith("+") ? "#ecfdf5" : "#f1f5f9",
      padding: "0.25rem 0.5rem",
      borderRadius: "6px"
    }}>
      {trend}
    </div>
  </div>
);

export default RecruiterAnalytics;
