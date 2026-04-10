import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Context } from "../../main";
import { FiMapPin, FiBriefcase, FiDollarSign, FiSearch, FiFilter, FiClock, FiChevronRight } from "react-icons/fi";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthorized } = useContext(Context);
  const location = useLocation();

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
    <section className="jobs-page" style={{ padding: "3rem 0", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Header & Search */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>Discover <span style={{ color: "var(--primary)" }}>Opportunities</span></h1>
            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Your next career milestone starts here.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", flex: 1, maxWidth: "500px" }}>
            <div className="glass-card" style={{ flex: 1, padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem", borderRadius: "12px" }}>
               <FiSearch color="#94a3b8" />
               <input 
                 type="text" 
                 placeholder="Search by title or category..." 
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
            subtitle="Explore high-impact internships to kickstart your career." 
            jobs={internships} 
          />
        )}

        {/* Jobs Section */}
        {regularJobs.length > 0 && (
          <JobSection 
            title="Full-time Jobs" 
            subtitle="Find positions that match your expertise and passion." 
            jobs={regularJobs} 
            marginTop={internships.length > 0 ? "5rem" : "0"}
          />
        )}

        {filteredJobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
             <p style={{ color: "#94a3b8", fontSize: "1.2rem" }}>No opportunities found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const JobSection = ({ title, subtitle, jobs, marginTop = "0" }) => (
  <div style={{ marginTop }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
       <div style={{ borderLeft: "4px solid var(--primary)", paddingLeft: "1.25rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{title}</h2>
          <p style={{ color: "#64748b", margin: "0.4rem 0 0 0" }}>{subtitle}</p>
       </div>
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
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "2rem" }}>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  </div>
);

const JobCard = ({ job }) => (
  <div className="job-card-premium" style={{ 
    backgroundColor: "white", 
    borderRadius: "20px", 
    padding: "1.5rem", 
    border: "1.5px solid #f1f5f9",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    position: "relative"
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
       <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ 
            width: "52px", 
            height: "52px", 
            borderRadius: "12px", 
            backgroundColor: "#f0f9ff", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "var(--primary)",
            fontSize: "1.2rem",
            fontWeight: 900
          }}>
            {job.title.charAt(0)}
          </div>
          <div>
             <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>{job.title}</h3>
             <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{job.category}</p>
          </div>
       </div>
       {job.expired ? (
         <div style={{ 
           padding: "0.4rem 0.75rem", 
           borderRadius: "8px", 
           backgroundColor: "#fef2f2", 
           color: "#ef4444", 
           fontSize: "0.7rem", 
           fontWeight: 900,
           border: "1.5px solid #fee2e2"
         }}>
           HIRING CLOSED
         </div>
       ) : (
         <div style={{ 
           padding: "0.4rem 0.75rem", 
           borderRadius: "8px", 
           backgroundColor: "#ecfdf5", 
           color: "#059669", 
           fontSize: "0.75rem", 
           fontWeight: 800 
         }}>
           {job.fixedSalary ? `$${job.fixedSalary}` : `$${job.salaryFrom}-$${job.salaryTo}`}
         </div>
       )}
    </div>

    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
       <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
          <FiMapPin size={14} /> {job.city}, {job.country}
       </span>
       <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
          <FiClock size={14} /> Posted {new Date(job.jobPostedOn).toLocaleDateString()}
       </span>
    </div>

    <Link 
      to={`/job/${job._id}`} 
      style={{ 
        padding: "0.85rem", 
        textAlign: "center", 
        borderRadius: "12px", 
        backgroundColor: "#f8fafc", 
        color: "#0f172a", 
        textDecoration: "none", 
        fontWeight: 800, 
        fontSize: "0.9rem",
        border: "1.5px solid #e2e8f0",
        transition: "all 0.2s"
      }}
      className="card-action-btn"
    >
      View Details
    </Link>

    <style>{`
      .job-card-premium:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
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
