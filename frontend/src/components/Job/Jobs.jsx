import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Context } from "../../main";
import { FiMapPin, FiBriefcase, FiDollarSign, FiSearch, FiFilter, FiClock, FiChevronRight } from "react-icons/fi";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthorized } = useContext(Context);
  const location = useLocation();
  const width = useWindowWidth();
  const isMobile = width < 768;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const querySearch = searchParams.get("search");
    if (querySearch) {
      setSearchTerm(querySearch);
    }

    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/job/getall`, {
          withCredentials: true,
        });
        setJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [location.search]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const internships = filteredJobs.filter(job => job.jobType === "Internship");
  const regularJobs = filteredJobs.filter(job => job.jobType === "Job" || !job.jobType);

  return (
    <section className="jobs-page" style={{ padding: isMobile ? "2rem 0" : "3rem 0", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Header & Search */}
        <div style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between", 
          alignItems: isMobile ? "flex-start" : "center", 
          marginBottom: "3rem", 
          gap: "1.5rem" 
        }}>
          <div>
            <h1 style={{ fontSize: isMobile ? "1.8rem" : "2.2rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>Discover <span style={{ color: "var(--primary)" }}>Opportunities</span></h1>
            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Your next career milestone starts here.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", flex: 1, width: isMobile ? "100%" : "auto", maxWidth: isMobile ? "100%" : "500px" }}>
            <div className="glass-card" style={{ flex: 1, padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem", borderRadius: "12px" }}>
               <FiSearch color="#94a3b8" />
               <input 
                 type="text" 
                 placeholder="Search jobs..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 style={{ border: "none", background: "none", outline: "none", width: "100%", fontSize: "0.95rem" }}
               />
            </div>
          </div>
        </div>

        {/* Internships Section */}
        {internships.length > 0 && (
          <JobSection 
            title="Internships" 
            subtitle="Explore high-impact internships." 
            jobs={internships} 
            isMobile={isMobile}
          />
        )}

        {/* Jobs Section */}
        {regularJobs.length > 0 && (
          <JobSection 
            title="Full-time Jobs" 
            subtitle="Find positions that match your expertise." 
            jobs={regularJobs} 
            marginTop={internships.length > 0 ? (isMobile ? "3rem" : "5rem") : "0"}
            isMobile={isMobile}
          />
        )}

        {filteredJobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
             <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>No opportunities found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const JobSection = ({ title, subtitle, jobs, marginTop = "0", isMobile }) => (
  <div style={{ marginTop }}>
    <div style={{ 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between", 
      alignItems: isMobile ? "flex-start" : "flex-end", 
      marginBottom: "2rem",
      gap: "1rem"
    }}>
       <div style={{ borderLeft: "4px solid var(--primary)", paddingLeft: "1.25rem" }}>
          <h2 style={{ fontSize: isMobile ? "1.4rem" : "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{title}</h2>
          <p style={{ color: "#64748b", margin: "0.4rem 0 0 0", fontSize: "0.9rem" }}>{subtitle}</p>
       </div>
       {!isMobile && (
         <button style={{ 
           display: "flex", 
           alignItems: "center", 
           gap: "0.5rem", 
           padding: "0.6rem 1.25rem", 
           borderRadius: "50px", 
           border: "1.5px solid #e2e8f0", 
           backgroundColor: "white", 
           color: "var(--primary)", 
           fontWeight: 700, 
           fontSize: "0.85rem",
           cursor: "pointer" 
         }}>
           View All <FiChevronRight />
         </button>
       )}
    </div>

    <div style={{ 
      display: "grid", 
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(380px, 1fr))", 
      gap: isMobile ? "1.25rem" : "2rem" 
    }}>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} isMobile={isMobile} />
      ))}
    </div>
  </div>
);

const JobCard = ({ job, isMobile }) => (
  <div className="job-card-premium" style={{ 
    backgroundColor: "white", 
    borderRadius: "20px", 
    padding: isMobile ? "1.25rem" : "1.5rem", 
    border: "1.5px solid #f1f5f9",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    position: "relative"
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
       <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ 
            width: isMobile ? "44px" : "52px", 
            height: isMobile ? "44px" : "52px", 
            borderRadius: "12px", 
            backgroundColor: "#f0f9ff", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "var(--primary)",
            fontSize: isMobile ? "1rem" : "1.2rem",
            fontWeight: 900,
            flexShrink: 0
          }}>
            {job.title.charAt(0)}
          </div>
          <div>
             <h3 style={{ margin: 0, fontSize: isMobile ? "1rem" : "1.1rem", fontWeight: 800, color: "#0f172a" }}>{job.title}</h3>
             <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>{job.category}</p>
          </div>
       </div>
       <div style={{ 
          padding: "0.35rem 0.6rem", 
          borderRadius: "8px", 
          backgroundColor: job.expired ? "#fef2f2" : "#ecfdf5", 
          color: job.expired ? "#ef4444" : "#059669", 
          fontSize: "0.7rem", 
          fontWeight: 800,
          whiteSpace: "nowrap"
        }}>
          {job.expired ? "CLOSED" : (job.fixedSalary ? `$${job.fixedSalary}` : `$${job.salaryFrom}-$${job.salaryTo}`)}
       </div>
    </div>

    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
       <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
          <FiMapPin size={12} /> {job.city}
       </span>
       <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
          <FiClock size={12} /> {new Date(job.jobPostedOn).toLocaleDateString()}
       </span>
    </div>

    <Link 
      to={`/job/${job._id}`} 
      style={{ 
        padding: "0.8rem", 
        textAlign: "center", 
        borderRadius: "10px", 
        backgroundColor: "#f8fafc", 
        color: "#0f172a", 
        textDecoration: "none", 
        fontWeight: 800, 
        fontSize: "0.85rem",
        border: "1.5px solid #e2e8f0",
        transition: "all 0.2s"
      }}
      className="card-action-btn"
    >
      View Details
    </Link>

    <style>{`
      .job-card-premium:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.05);
        border-color: var(--primary);
      }
      .job-card-premium:hover .card-action-btn {
        background-color: var(--primary);
        color: white;
        border-color: var(--primary);
      }
    `}</style>
  </div>
);

export default Jobs;
