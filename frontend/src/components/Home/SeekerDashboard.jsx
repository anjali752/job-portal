import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { FiBriefcase, FiCheckCircle, FiClock, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

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

const SeekerDashboard = () => {
  const { user } = useContext(Context);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isSmall = width < 500;

  const [statsData, setStatsData] = useState({
    appliedJobs: 0,
    interviews: 0,
    offers: 0,
    profileViews: 0,
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/seeker/stats`,
          { withCredentials: true }
        );
        const appsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/recent`,
          { withCredentials: true }
        );
        setStatsData(statsRes.data.stats);
        setRecentApps(appsRes.data.applications);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Applied Jobs",  count: statsData.appliedJobs,   icon: <FiBriefcase color="#4f46e5" />, bg: "#eef2ff" },
    { title: "Interviews",    count: statsData.interviews,     icon: <FiClock color="#f59e0b" />,     bg: "#fffbeb" },
    { title: "Offers",        count: statsData.offers,         icon: <FiCheckCircle color="#10b981" />, bg: "#ecfdf5" },
    { title: "Profile Views", count: statsData.profileViews,   icon: <FiFileText color="#6366f1" />,  bg: "#f5f3ff" },
  ];

  const statusColor = (status) => {
    const map = {
      Pending:  { bg: "#fff7ed", color: "#9a3412" },
      Accepted: { bg: "#dcfce7", color: "#166534" },
      Rejected: { bg: "#fef2f2", color: "#991b1b" },
      Interview:{ bg: "#eff6ff", color: "#1e40af" },
    };
    return map[status] || { bg: "#f1f5f9", color: "#475569" };
  };

  if (loading) return (
    <div style={{ padding: "2rem", color: "var(--text-muted)", textAlign: "center" }}>
      Loading your career analytics...
    </div>
  );

  return (
    <div style={{ padding: isMobile ? "1rem" : "0" }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: isMobile ? "1.4rem" : "1.8rem", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
          Welcome back, <span style={{ color: "var(--primary)" }}>{user?.name}</span>! 👋
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.35rem", fontSize: "0.9rem" }}>
          Here's what's happening with your job search today.
        </p>
      </div>

      {/* Stats Grid — 2 cols on mobile, 4 on desktop */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isSmall ? "1fr 1fr" : isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: isMobile ? "0.75rem" : "1.5rem",
        marginBottom: "1.5rem",
      }}>
        {stats.map((stat, index) => (
          <div key={index} className="glass-card" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: isMobile ? "0.875rem" : "1.5rem",
          }}>
            <div style={{
              width: isMobile ? "38px" : "50px",
              height: isMobile ? "38px" : "50px",
              borderRadius: "10px",
              backgroundColor: stat.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isMobile ? "1.1rem" : "1.5rem",
              flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: isMobile ? "0.72rem" : "0.9rem", fontWeight: 500, margin: 0 }}>
                {stat.title}
              </p>
              <p style={{ fontSize: isMobile ? "1.2rem" : "1.5rem", fontWeight: 700, margin: 0 }}>
                {stat.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section — stacks on mobile */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
        gap: "1.5rem",
      }}>
        {/* Recent Applications */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Recent Applications</h3>
            <Link to="/seeker/applications" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
              View All
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentApps.length > 0 ? recentApps.map((app) => (
              <div key={app._id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.875rem",
                backgroundColor: "#f9fafb",
                borderRadius: "10px",
                gap: "0.5rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                  <div style={{
                    width: "36px", height: "36px",
                    backgroundColor: "#eef2ff", borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", color: "var(--primary)", flexShrink: 0,
                  }}>
                    <FiBriefcase />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {app.name}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {app.email}
                    </p>
                  </div>
                </div>
                <span style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "20px",
                  backgroundColor: statusColor(app.status).bg,
                  color: statusColor(app.status).color,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {app.status}
                </span>
              </div>
            )) : (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <FiBriefcase size={32} color="#e2e8f0" style={{ marginBottom: "0.75rem" }} />
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  No applications yet. <Link to="/seeker/jobs" style={{ color: "var(--primary)", fontWeight: 600 }}>Start browsing!</Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions panel — only shown on desktop or as a row on mobile */}
        <div className="glass-card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", margin: "0 0 1rem 0" }}>Recommended for You</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              { title: "UI/UX Designer", company: "Creative Studio", location: "NY", salary: "$80k–$120k" },
              { title: "Frontend Developer", company: "Tech Corp", location: "Remote", salary: "$100k–$150k" },
              { title: "Product Manager", company: "InnovateCo", location: "SF", salary: "$110k–$140k" },
            ].map((job, i) => (
              <div key={i} style={{
                padding: "0.75rem",
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
                border: "1px solid #f1f5f9",
              }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", margin: "0 0 0.2rem 0" }}>{job.title}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 0.25rem 0" }}>
                  {job.company} • {job.location}
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 700, margin: 0 }}>{job.salary}</p>
              </div>
            ))}
            <Link to="/seeker/jobs" style={{
              display: "block",
              textAlign: "center",
              padding: "0.75rem",
              backgroundColor: "var(--primary)",
              color: "#fff",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
              marginTop: "0.25rem",
            }}>
              Browse All Jobs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
