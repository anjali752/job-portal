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
    <section className="jobs-page">
      <div className="jobs-container">
        {/* Modern Header Section */}
        <header className="jobs-header modern-glass">
          <div className="header-text">
            <h1 className="header-title">
              Discover <span className="highlight">Opportunities</span>
            </h1>
            <p className="header-subtitle">Find your next career milestone in our curated job board.</p>
          </div>
          <div className="search-wrapper">
             <div className="search-bar glass-card">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by title or category..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
             </div>
          </div>
        </header>

        {/* Content Sections */}
        <div className="jobs-content">
          {/* Internships Section */}
          {internships.length > 0 && (
            <div className="job-category-section">
               <div className="section-header">
                  <h2 className="section-title"><FiBriefcase /> Internships</h2>
                  <span className="section-count">{internships.length} available</span>
               </div>
               <div className="job-grid">
                  {internships.map(job => (
                    <JobCard key={job._id} job={job} />
                  ))}
               </div>
            </div>
          )}

          {/* Regular Jobs Section */}
          {regularJobs.length > 0 && (
            <div className="job-category-section">
               <div className="section-header">
                  <h2 className="section-title"><FiBriefcase /> Full-time Positions</h2>
                  <span className="section-count">{regularJobs.length} available</span>
               </div>
               <div className="job-grid">
                  {regularJobs.map(job => (
                    <JobCard key={job._id} job={job} />
                  ))}
               </div>
            </div>
          )}

          {filteredJobs.length === 0 && (
            <div className="no-results modern-glass">
               <div className="no-results-icon"><FiSearch size={48} /></div>
               <h3>No matches found</h3>
               <p>Try adjusting your search terms to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .jobs-page { background-color: #f8fafc; min-height: 100vh; padding: 3rem 1.5rem; }
        .jobs-container { max-width: 1400px; margin: 0 auto; }
        .modern-glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        
        .jobs-header { padding: 3rem; margin-bottom: 4rem; display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap; }
        .header-title { font-size: 2.5rem; font-weight: 900; color: #0f172a; margin: 0; }
        .header-title .highlight { color: var(--primary); }
        .header-subtitle { color: #64748b; margin-top: 0.5rem; font-size: 1.1rem; }
        
        .search-wrapper { flex: 1; max-width: 500px; min-width: 300px; }
        .search-bar { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; background: #fff; transition: 0.3s; }
        .search-bar:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        .search-icon { color: #94a3b8; font-size: 1.2rem; }
        .search-input { border: none; background: none; outline: none; width: 100%; font-size: 1rem; color: #1e293b; font-weight: 500; }

        .job-category-section { margin-bottom: 5rem; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 0 0.5rem; }
        .section-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.75rem; margin: 0; }
        .section-count { font-size: 0.9rem; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 0.4rem 1rem; border-radius: 20px; }

        .job-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem; }
        
        .job-card { background: white; border-radius: 20px; padding: 2rem; border: 1px solid #f1f5f9; text-decoration: none; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; position: relative; }
        .job-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); border-color: #e2e8f0; }
        
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
        .job-type-tag { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 0.35rem 0.75rem; border-radius: 8px; background: #eff6ff; color: #3b82f6; letter-spacing: 0.5px; }
        .job-title { font-size: 1.2rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem 0; line-height: 1.4; }
        .job-category { color: #64748b; font-size: 0.9rem; font-weight: 600; display: block; margin-bottom: 1.5rem; }
        
        .card-details { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
        .detail-item { display: flex; align-items: center; gap: 0.75rem; color: #475569; font-size: 0.9rem; font-weight: 500; }
        .detail-item svg { color: #94a3b8; }
        
        .card-footer { margin-top: auto; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .job-salary { font-weight: 800; color: #0f172a; font-size: 1rem; }
        .apply-btn { width: 40px; height: 40px; border-radius: 12px; background: #f8fafc; color: #0f172a; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .job-card:hover .apply-btn { background: var(--primary); color: white; }

        .no-results { padding: 4rem 2rem; text-align: center; }
        .no-results-icon { color: #cbd5e1; margin-bottom: 1.5rem; }
        .no-results h3 { color: #0f172a; font-weight: 800; margin-bottom: 0.5rem; }
        .no-results p { color: #64748b; }

        @media (max-width: 768px) {
          .jobs-page { padding: 1.5rem 1rem; }
          .jobs-header { padding: 2rem 1.5rem; margin-bottom: 3rem; }
          .header-title { font-size: 1.8rem; }
          .header-subtitle { font-size: 1rem; }
          .job-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .section-title { font-size: 1.25rem; }
        }
      `}</style>
    </section>
  );
};

const JobCard = ({ job }) => (
  <Link to={`/job/${job._id}`} className="job-card">
    <div className="card-header">
       <span className="job-type-tag">{job.jobType || "Full Time"}</span>
       <div className="time-posted"><FiClock size={14} color="#94a3b8" /></div>
    </div>
    <h3 className="job-title">{job.title}</h3>
    <span className="job-category">{job.category}</span>
    
    <div className="card-details">
       <div className="detail-item"><FiMapPin /> {job.city}, {job.country}</div>
       <div className="detail-item"><FiBriefcase /> {job.jobType || "Job"}</div>
    </div>

    <div className="card-footer">
       <div className="job-salary">
          {job.fixedSalary ? `₹${job.fixedSalary}` : `₹${job.salaryFrom} - ₹${job.salaryTo}`}
       </div>
       <div className="apply-btn"><FiChevronRight size={20} /></div>
    </div>
  </Link>
);

export default Jobs;
