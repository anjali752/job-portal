import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import { FiMapPin, FiBriefcase, FiDollarSign, FiCalendar, FiClock, FiArrowLeft, FiHeart, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (isAuthorized && user?.role === "Job Seeker") {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/application/jobseeker/getall`,
            { withCredentials: true }
          );
          // Check if any application matches this job ID
          const applied = data.applications.some(app => {
            const appId = typeof app.jobId === 'object' ? app.jobId?._id : app.jobId;
            return appId === id;
          });
          setHasApplied(applied);
        } catch (error) {
          console.error("Failed to check application status");
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
        toast.success("Removed from wishlist");
        setIsSaved(false);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/user/save/job`, { jobId: id }, { withCredentials: true });
        toast.success("Saved to wishlist");
        setIsSaved(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
        const { data } = await axios.get(`${apiUrl}/job/${id}`, {
          withCredentials: true,
        });
        setJob(data.job);
      } catch (error) {
        navigateTo("/notfound");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigateTo]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  if (loading) return <div style={{ padding: "5rem", textAlign: "center", color: "var(--text-muted)" }}>Loading opportunity details...</div>;

  return (
    <section className="job-details-page" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "2rem 0" }}>
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <button 
          onClick={() => navigateTo(-1)}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            marginBottom: "2rem", 
            background: "none", 
            border: "none", 
            color: "#64748b", 
            fontWeight: 600, 
            cursor: "pointer",
            fontSize: "0.95rem"
          }}>
          <FiArrowLeft /> Back to Jobs
        </button>

        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Hero Header */}
            <div style={{ 
              padding: "3rem", 
              backgroundColor: "#0f172a", 
              color: "white", 
              backgroundImage: "linear-gradient(45deg, #0f172a 0%, #1e1b4b 100%)",
              position: "relative",
              zIndex: 1
            }}>
              <div style={{ 
                position: "absolute", 
                top: 0, 
                right: 0, 
                bottom: 0, 
                width: "30%", 
                background: "linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.1))",
                zIndex: -1 
              }}></div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 2 }}>
              <div style={{ flex: 1, minWidth: "300px" }}>
                 <p style={{ color: "var(--primary)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", fontSize: "0.75rem", marginBottom: "1rem" }}>{job?.category}</p>
                 <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "1.5rem", lineHeight: 1.1 }}>{job?.title}</h1>
                 
                 <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", opacity: 0.9 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem" }}>
                      <FiMapPin style={{ color: "var(--primary)" }} /> {job?.city}, {job?.country}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem" }}>
                      <FiCalendar style={{ color: "var(--primary)" }} /> Posted {job?.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString() : ""}
                    </div>
                 </div>
              </div>

              {user && (user.role === "Job Seeker" || user.role === "job seeker") && (
                <div style={{ display: "flex", gap: "1rem" }}>
                   <button 
                     onClick={handleSaveJob}
                     style={{ 
                       backgroundColor: isSaved ? "#f43f5e" : "white", 
                       color: isSaved ? "white" : "#64748b",
                       padding: "1rem", 
                       borderRadius: "12px", 
                       border: isSaved ? "none" : "1.5px solid #e2e8f0", 
                       cursor: "pointer",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "center",
                       transition: "all 0.2s"
                     }}>
                     <FiHeart fill={isSaved ? "white" : "none"} size={22} />
                   </button>
                   
                   {job.expired ? (
                     <div style={{ 
                       backgroundColor: "#fef2f2", 
                       color: "#ef4444", 
                       padding: "1rem 2.5rem", 
                       borderRadius: "12px", 
                       fontWeight: 800,
                       fontSize: "1.1rem",
                       border: "2px solid #fee2e2",
                       display: "flex",
                       alignItems: "center",
                       gap: "0.6rem"
                     }}>
                       <FiAlertCircle size={22} /> Hiring Closed
                     </div>
                   ) : hasApplied ? (
                    <div style={{ 
                      backgroundColor: "#f0fdf4", 
                      color: "#166534", 
                      padding: "1rem 2.5rem", 
                      borderRadius: "12px", 
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      border: "2px solid #dcfce7",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem"
                    }}>
                      <FiCheckCircle size={22} /> Already Applied
                    </div>
                   ) : (
                     <Link to={`/application/${job?._id || id}`} style={{ 
                       backgroundColor: "var(--primary)", 
                       color: "white", 
                       padding: "1rem 2.5rem", 
                       borderRadius: "12px", 
                       textDecoration: "none", 
                       fontWeight: 700,
                       fontSize: "1.1rem",
                       boxShadow: "0 10px 20px -5px rgba(79, 70, 229, 0.4)",
                       transition: "all 0.2s",
                       display: "inline-block",
                       position: "relative",
                       zIndex: 10
                     }}>
                       Apply Now
                     </Link>
                   )}
                </div>
              )}
            </div>
          </div>

          {/* Details Content */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", padding: "3rem" }}>
            <div className="job-body">
               <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                 Description
               </h3>
               <div style={{ color: "#334155", lineHeight: 1.8, fontSize: "1.05rem", whiteSpace: "pre-wrap" }}>
                 {job.description}
               </div>

               <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Office Location</h3>
                  <p style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FiMapPin /> {job.location}
                  </p>
               </div>
            </div>

            <aside>
               <div style={{ backgroundColor: "#f8fafc", padding: "1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Opportunity Summary</h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.4rem" }}>Salary Range</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontWeight: 700, fontSize: "1.1rem" }}>
                        <FiDollarSign /> {job.fixedSalary ? `${job.fixedSalary}` : `${job.salaryFrom} - ${job.salaryTo}`}
                      </div>
                    </div>

                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.4rem" }}>Job Category</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0f172a", fontWeight: 600 }}>
                        <FiBriefcase /> {job.category}
                      </div>
                    </div>

                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.4rem" }}>Job Type</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0f172a", fontWeight: 600 }}>
                        <FiClock /> Full-time / Remote
                      </div>
                    </div>
                  </div>

                  {user && user.role === "Employer" && (
                    <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#fffbeb", border: "1px solid #fef3c7", borderRadius: "8px", fontSize: "0.85rem", color: "#92400e" }}>
                       This is your job posting. Applicants will appear in your recruiter dashboard.
                    </div>
                  )}
               </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
