import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Navigate, Link } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFileText, 
  FiTrash2, 
  FiEye, 
  FiClock,
  FiBriefcase,
  FiInbox,
  FiPlus,
  FiUser,
  FiChevronRight
} from "react-icons/fi";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const endpoint = user?.role === "Employer" 
          ? "application/employer/getall" 
          : "application/jobseeker/getall";
        
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
          withCredentials: true,
        });
        setApplications(data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchApplications();
    }
  }, [isAuthorized, user]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  const deleteApplication = async (id) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/application/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="applications_page" style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          {user?.role === "Employer" ? "Application Portal" : "My Applications"}
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
          {user?.role === "Employer" 
            ? "Manage and review candidates who applied for your roles." 
            : "Track the status of your sent job applications."}
        </p>
      </div>

      {applications.length <= 0 ? (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "5rem 2rem",
          backgroundColor: "white",
          borderRadius: "24px",
          border: "2px dashed #e2e8f0"
        }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            borderRadius: "50%", 
            backgroundColor: "#f8fafc", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            marginBottom: "1.5rem",
            color: "#94a3b8"
          }}>
            <FiInbox size={40} />
          </div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>No Applications Yet</h3>
          <p style={{ color: "#64748b", marginBottom: "2rem", textAlign: "center", maxWidth: "400px" }}>
            {user?.role === "Employer" 
              ? "When candidates apply for your listed jobs, they will appear here." 
              : "Start your career journey by exploring open positions and applying."}
          </p>
          {user?.role === "Employer" ? (
             <Link to="/recruiter/jobs/post" className="primary-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiPlus /> Post a New Job
             </Link>
          ) : (
             <Link to="/seeker/jobs" className="primary-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBriefcase /> Browse Jobs
             </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {applications.map((element) => (
            user?.role === "Employer" ? (
              <EmployerCard key={element._id} element={element} openModal={openModal} />
            ) : (
              <JobSeekerCard key={element._id} element={element} deleteApplication={deleteApplication} openModal={openModal} />
            )
          ))}
        </div>
      )}

      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted": return { bg: "#dcfce7", color: "#166534", label: "ACCEPTED" };
      case "Rejected": return { bg: "#fef2f2", color: "#ef4444", label: "REJECTED" };
      default: return { bg: "#fef3c7", color: "#92400e", label: "PENDING" };
    }
  };

  const statusStyle = getStatusStyle(element.status);

  return (
    <Link to={`/seeker/application/${element._id}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="glass-card application-card-seeker" style={{ 
        padding: "1.75rem", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative"
      }}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <div style={{ 
            width: "60px", 
            height: "60px", 
            borderRadius: "14px", 
            backgroundColor: "#f0f7ff", 
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <FiBriefcase size={26} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
               {element.jobId?.title || "Original Application"}
            </h4>
            <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "var(--primary)", fontWeight: 800, textTransform: "uppercase" }}>
               {element.jobId?.category || "Career Opportunity"}
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", alignItems: "center" }}>
               <span style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FiClock /> {new Date(element.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
               </span>
               <span style={{ 
                 fontSize: "0.75rem", 
                 fontWeight: 800, 
                 padding: "0.3rem 0.8rem", 
                 borderRadius: "8px", 
                 backgroundColor: statusStyle.bg, 
                 color: statusStyle.color,
                 display: "flex",
                 alignItems: "center",
                 gap: "0.4rem"
               }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: statusStyle.color }}></div>
                  {statusStyle.label}
               </span>
            </div>
          </div>
        </div>
        
        <div style={{ color: "#cbd5e1", transition: "all 0.3s" }} className="chevron-link">
           <FiChevronRight size={24} />
        </div>

        <style>{`
          .application-card-seeker:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1);
            border-color: var(--primary);
          }
          .application-card-seeker:hover .chevron-link {
            color: var(--primary);
            transform: translateX(5px);
          }
        `}</style>
      </div>
    </Link>
  );
};

const EmployerCard = ({ element, openModal }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted": return "#10b981";
      case "Rejected": return "#ef4444";
      default: return "#f59e0b";
    }
  };

  return (
    <div className="glass-card" style={{ padding: "1.75rem", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "2rem", alignItems: "start" }}>
      {/* Avatar/Initials */}
      <div style={{ 
        width: "64px", 
        height: "64px", 
        borderRadius: "16px", 
        backgroundColor: "#ecfdf5", 
        color: "#10b981",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        fontWeight: 800,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
      }}>
        {element.name?.charAt(0).toUpperCase()}
      </div>

      {/* Details */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
          <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>{element.name}</h4>
          <span style={{ 
            fontSize: "0.7rem", 
            fontWeight: 800, 
            padding: "0.2rem 0.6rem", 
            borderRadius: "6px", 
            backgroundColor: getStatusColor(element.status) + "15", 
            color: getStatusColor(element.status) 
          }}>
            {element.status.toUpperCase()}
          </span>
          {element.status === "Pending" && (
             <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "6px", backgroundColor: "#f1f5f9", color: "#64748b" }}>NEW CANDIDATE</span>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", margin: "0.25rem 0 1rem 0" }}>
           <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Targeting Position:</p>
           <p style={{ margin: 0, color: "var(--primary)", fontSize: "0.95rem", fontWeight: 800 }}>{element.jobId?.title || "Platform Posting"}</p>
        </div>
        
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "0.85rem" }}>
              <FiMail style={{ color: "#94a3b8" }} /> {element.email}
           </div>
           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "0.85rem" }}>
              <FiPhone style={{ color: "#94a3b8" }} /> {element.phone}
           </div>
           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "0.85rem" }}>
              <FiMapPin style={{ color: "#94a3b8" }} /> {element.address}
           </div>
        </div>

        <div style={{ marginTop: "1.25rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "12px", borderLeft: `4px solid ${getStatusColor(element.status)}` }}>
           <p style={{ margin: 0, fontSize: "0.85rem", color: "#334155", fontStyle: "italic", lineHeight: 1.6 }}>
             <FiFileText size={12} style={{ marginRight: "0.5rem" }} />
             "{element.coverLetter.length > 150 ? element.coverLetter.slice(0, 150) + "..." : element.coverLetter}"
           </p>
        </div>
      </div>

      {/* Sidebar Action */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
         <Link 
           to={`/recruiter/application/${element._id}`}
           style={{ 
             padding: "0.75rem 1.25rem", 
             borderRadius: "12px", 
             border: "none", 
             backgroundColor: "var(--primary)", 
             color: "white", 
             cursor: "pointer", 
             display: "flex", 
             alignItems: "center", 
             gap: "0.5rem", 
             fontWeight: 700,
             textDecoration: "none",
             textAlign: "center",
             justifyContent: "center",
             boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)"
           }}>
           <FiUser /> Review Application
         </Link>
         <button 
           onClick={() => openModal(element.resume.url)}
           style={{ 
             padding: "0.7rem 1.25rem", 
             borderRadius: "12px", 
             border: "1.5px solid #e2e8f0", 
             backgroundColor: "white", 
             color: "#1e293b", 
             cursor: "pointer", 
             display: "flex", 
             alignItems: "center", 
             gap: "0.5rem", 
             fontWeight: 700,
             justifyContent: "center"
           }}>
           <FiEye /> Resume
         </button>
      </div>
    </div>
  );
};
