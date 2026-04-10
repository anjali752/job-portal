import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Context } from "../../main";
import { 
  FiMapPin, 
  FiBriefcase, 
  FiDollarSign, 
  FiTrash2, 
  FiExternalLink, 
  FiHeart,
  FiArrowRight
} from "react-icons/fi";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/saved/jobs`,
          { withCredentials: true }
        );
        setSavedJobs(data.savedJobs);
      } catch (error) {
        toast.error("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthorized) fetchSavedJobs();
  }, [isAuthorized]);

  const removeJob = async (id) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/unsave/job/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setSavedJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove job");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="saved-jobs-page" style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Saved Opportunities</h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>Review and manage the positions you've bookmarked.</p>
      </div>

      {savedJobs.length <= 0 ? (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "6rem 2rem",
          backgroundColor: "white",
          borderRadius: "24px",
          border: "2px dashed #e2e8f0"
        }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            borderRadius: "50%", 
            backgroundColor: "#fff1f2", 
            color: "#f43f5e", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            marginBottom: "1.5rem"
          }}>
            <FiHeart size={40} fill="#f43f5e" />
          </div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>Your wishlist is empty</h3>
          <p style={{ color: "#64748b", marginBottom: "2.5rem", textAlign: "center", maxWidth: "400px" }}>
            Explore thousands of jobs and save your favorites to review them later or apply whenever you're ready.
          </p>
          <Link to="/seeker/jobs" className="primary-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             Find Jobs <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "1.5rem" }}>
          {savedJobs.map((job) => (
            <div key={job._id} className="glass-card" style={{ padding: "1.5rem", position: "relative" }}>
               <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <div style={{ 
                    width: "56px", 
                    height: "56px", 
                    borderRadius: "12px", 
                    backgroundColor: "#f0f7ff", 
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    fontWeight: 900
                  }}>
                    {job.title.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                     <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>{job.title}</h4>
                     <p style={{ margin: "0.25rem 0 0.75rem 0", color: "#64748b", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <FiBriefcase size={14} /> {job.category}
                     </p>

                     <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", backgroundColor: "#f1f5f9", padding: "0.25rem 0.6rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                           <FiMapPin size={12} /> {job.city}
                        </span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#10b981", backgroundColor: "#ecfdf5", padding: "0.25rem 0.6rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                           <FiDollarSign size={12} /> {job.fixedSalary ? `$${job.fixedSalary}` : `$${job.salaryFrom}-$${job.salaryTo}`}
                        </span>
                        {job.expired && (
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#ef4444", backgroundColor: "#fef2f2", padding: "0.25rem 0.6rem", borderRadius: "6px" }}>
                             HIRING CLOSED
                          </span>
                        )}
                     </div>
                  </div>
               </div>

               <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "1.25rem" }}>
                  <Link 
                    to={`/job/${job._id}`} 
                    style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", backgroundColor: "#0f172a", color: "white", textDecoration: "none", textAlign: "center", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    View Detils <FiExternalLink size={14} />
                  </Link>
                  <button 
                    onClick={() => removeJob(job._id)}
                    style={{ padding: "0.75rem 1rem", borderRadius: "10px", border: "1.5px solid #fee2e2", backgroundColor: "#fffafa", color: "#ef4444", cursor: "pointer", fontWeight: 700 }}>
                    <FiTrash2 size={18} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SavedJobs;
