import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  FiCheck, 
  FiX, 
  FiEdit3, 
  FiTrash2, 
  FiMapPin, 
  FiDollarSign, 
  FiBriefcase, 
  FiPlusSquare,
  FiLayers,
  FiCalendar,
  FiZap,
  FiEye
} from "react-icons/fi";
import { Context } from "../../main";
import { useNavigate, Navigate, Link } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/job/getmyjobs`,
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch jobs");
        setMyJobs([]);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthorized) {
      fetchJobs();
    }
  }, [isAuthorized]);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    return <Navigate to="/login" />;
  }

  const handleEnableEdit = (jobId) => setEditingMode(jobId);
  const handleDisableEdit = () => setEditingMode(null);

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/job/update/${jobId}`,
        updatedJob,
        { withCredentials: true }
      );
      toast.success(data.message);
      setEditingMode(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/job/delete/${jobId}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setMyJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prev) =>
      prev.map((job) => job._id === jobId ? { ...job, [field]: value } : job)
    );
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="my_jobs_page" style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-1px" }}>
            Job Repository
          </h1>
          <p style={{ color: "#64748b", fontSize: "1rem", marginTop: "0.5rem" }}>
            You have <strong style={{ color: "#000" }}>{myJobs.length} active</strong> listings in your portal.
          </p>
        </div>
        <Link to="/recruiter/jobs/post" className="primary-btn" style={{ 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem',
          padding: "0.9rem 1.75rem",
          borderRadius: "14px",
          boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)"
        }}>
          <FiPlusSquare /> Create New Listing
        </Link>
      </div>

      {myJobs.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {myJobs.map((job) => (
            <div key={job._id} className="glass-card" style={{ 
              padding: editingMode === job._id ? "2.5rem" : "1.75rem", 
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: editingMode === job._id ? "2px solid var(--primary)" : "1px solid #f1f5f9",
              backgroundColor: editingMode === job._id ? "white" : "rgba(255,255,255,0.8)"
            }}>
              {editingMode === job._id ? (
                /* ELITE EDITING VIEW */
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "1.5rem" }}>
                    <div className="manage-input-group">
                      <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "0.5rem" }}>JOB TITLE</label>
                      <input 
                        type="text" 
                        value={job.title} 
                        onChange={(e) => handleInputChange(job._id, "title", e.target.value)}
                        style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none", backgroundColor: "#f8fafc", fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "0.5rem" }}>CATEGORY</label>
                      <select 
                        value={job.category} 
                        onChange={(e) => handleInputChange(job._id, "category", e.target.value)}
                        style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none", backgroundColor: "#fff" }}
                      >
                          <option value="Graphics & Design">Graphics & Design</option>
                          <option value="Mobile App Development">Mobile App Development</option>
                          <option value="Frontend Web Development">Frontend Web Development</option>
                          <option value="MERN Stack Development">MERN Stack Development</option>
                          <option value="Artificial Intelligence">Artificial Intelligence</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "0.5rem" }}>STATUS</label>
                      <select 
                        value={job.expired} 
                        onChange={(e) => handleInputChange(job._id, "expired", e.target.value === "true")}
                        style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none", backgroundColor: "#fff" }}
                      >
                          <option value={false}>ACTIVE (Hiring)</option>
                          <option value={true}>EXPIRED (Closed)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem" }}>
                    <div>
                        <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "0.5rem" }}>WORK CITY</label>
                        <input type="text" value={job.city} onChange={(e) => handleInputChange(job._id, "city", e.target.value)} style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "0.5rem" }}>PRECISE OFFICE LOCATION</label>
                        <input type="text" value={job.location} onChange={(e) => handleInputChange(job._id, "location", e.target.value)} style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                    <button onClick={handleDisableEdit} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 1.75rem", borderRadius: "12px", border: "1.5px solid #f1f5f9", backgroundColor: "white", color: "#64748b", fontWeight: 800, cursor: "pointer" }}>
                      <FiX /> Discard
                    </button>
                    <button onClick={() => handleUpdateJob(job._id)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2.5rem", borderRadius: "12px", border: "none", backgroundColor: "#10b981", color: "white", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)" }}>
                      <FiCheck /> Commit Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* PREMIUM DISPLAY VIEW */
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
                      <div style={{ 
                        width: "64px", 
                        height: "64px", 
                        borderRadius: "18px", 
                        backgroundColor: job.expired ? "#f8fafc" : "#eef2ff", 
                        color: job.expired ? "#94a3b8" : "var(--primary)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        boxShadow: job.expired ? "none" : "0 8px 15px -3px rgba(79, 70, 229, 0.1)"
                      }}>
                        {job.expired ? <FiZap size={28} /> : <FiBriefcase size={28} />}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                           <h4 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>{job.title}</h4>
                           <span style={{ 
                             fontSize: "0.7rem", 
                             fontWeight: 900, 
                             padding: "0.3rem 0.8rem", 
                             borderRadius: "8px", 
                             backgroundColor: job.expired ? "#fef2f2" : "#dcfce7", 
                             color: job.expired ? "#ef4444" : "#10b981",
                             display: "flex",
                             alignItems: "center",
                             gap: "0.3rem"
                           }}>
                              {job.expired ? <FiX size={12}/> : <FiCheck size={12}/>}
                              {job.expired ? "COMPLETED" : "HIRING NOW"}
                           </span>
                        </div>
                        <div style={{ display: "flex", gap: "1.5rem", color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>
                           <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <FiMapPin size={16} /> {job.city}
                           </span>
                           <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <FiLayers size={16} /> {job.category}
                           </span>
                           <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <FiDollarSign size={16} color="#10b981" /> {job.fixedSalary ? `$${job.fixedSalary}` : `$${job.salaryFrom} — $${job.salaryTo}`}
                           </span>
                           <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <FiCalendar size={16} /> {job.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Recently"}
                           </span>
                        </div>
                      </div>
                   </div>

                   <div style={{ display: "flex", gap: "0.85rem" }}>
                      <Link to={`/job/${job._id}`} style={{ padding: "0.7rem 0.7rem", borderRadius: "12px", border: "1.5px solid #f1f5f9", backgroundColor: "white", cursor: "pointer", color: "#64748b" }}>
                        <FiEye size={18} />
                      </Link>
                      <button onClick={() => handleEnableEdit(job._id)} style={{ padding: "0.7rem 1.25rem", borderRadius: "12px", border: "1.5px solid #f1f5f9", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, color: "#0f172a" }}>
                        <FiEdit3 size={18} /> Manage
                      </button>
                      <button onClick={() => handleDeleteJob(job._id)} style={{ padding: "0.7rem 1.25rem", borderRadius: "12px", border: "none", backgroundColor: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
                        <FiTrash2 size={18} /> Remove
                      </button>
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* PREMIUM EMPTY STATE */
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "8rem 2rem",
          backgroundColor: "#f8fafc",
          borderRadius: "32px",
          border: "2px dashed #e2e8f0"
        }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "30px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", color: "#cbd5e1", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}>
             <FiZap size={48} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.75rem", letterSpacing: "-0.5px" }}>Ignite Your Hiring</h2>
          <p style={{ color: "#64748b", marginBottom: "3rem", textAlign: "center", maxWidth: "480px", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Your job repository is currently empty. Post your first position to start discovering elite talent across the platform.
          </p>
          <Link to="/recruiter/jobs/post" className="primary-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', borderRadius: "16px", fontSize: "1.05rem", fontWeight: 800 }}>
            <FiPlusSquare size={20} /> Create Your First Posting
          </Link>
        </div>
      )}

      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          width: 32px;
          height: 32px;
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

export default MyJobs;
