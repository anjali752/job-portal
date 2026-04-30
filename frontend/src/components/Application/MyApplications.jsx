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

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
};

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const width = useWindowWidth();
  const isMobile = width < 768;

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
        toast.error("Fetch failed");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthorized) fetchApplications();
  }, [isAuthorized, user]);

  if (!isAuthorized) return <Navigate to="/login" />;

  const openModal = (imageUrl) => { setResumeImageUrl(imageUrl); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };

  if (loading) return <div style={{ textAlign: "center", padding: "5rem" }}>Loading...</div>;

  return (
    <section style={{ padding: isMobile ? "1rem" : "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: isMobile ? "1.5rem" : "1.8rem", fontWeight: 800 }}>
          {user?.role === "Employer" ? "Candidates" : "My Applications"}
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Track and manage applications.</p>
      </div>

      {applications.length <= 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 2rem", background: "white", borderRadius: "20px", border: "2px dashed #e2e8f0" }}>
          <FiInbox size={40} color="#cbd5e1" style={{ marginBottom: "1rem" }} />
          <h3>No records found</h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {applications.map((element) => (
            user?.role === "Employer" ? (
              <EmployerCard key={element._id} element={element} openModal={openModal} isMobile={isMobile} />
            ) : (
              <JobSeekerCard key={element._id} element={element} isMobile={isMobile} />
            )
          ))}
        </div>
      )}

      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
    </section>
  );
};

const JobSeekerCard = ({ element, isMobile }) => {
  const status = element.status || "Pending";
  const colors = {
    Accepted: { bg: "#dcfce7", color: "#166534" },
    Rejected: { bg: "#fef2f2", color: "#ef4444" },
    Pending: { bg: "#fef3c7", color: "#92400e" }
  };
  const theme = colors[status] || colors.Pending;

  return (
    <Link to={`/seeker/application/${element._id}`} style={{ textDecoration: "none" }}>
      <div className="glass-card" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", minWidth: 0 }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FiBriefcase color="var(--primary)" />
          </div>
          <div style={{ minWidth: 0 }}>
            <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{element.jobId?.title || "Application"}</h4>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
               <span style={{ fontSize: "0.75rem", color: "#64748b" }}><FiClock /> {new Date(element.createdAt).toLocaleDateString()}</span>
               <span style={{ fontSize: "0.7rem", fontWeight: 900, padding: "0.2rem 0.5rem", borderRadius: "6px", backgroundColor: theme.bg, color: theme.color }}>{status.toUpperCase()}</span>
            </div>
          </div>
        </div>
        {!isMobile && <FiChevronRight size={20} color="#cbd5e1" />}
      </div>
    </Link>
  );
};

const EmployerCard = ({ element, openModal, isMobile }) => {
  const status = element.status || "Pending";
  const colors = { Accepted: "#10b981", Rejected: "#ef4444", Pending: "#f59e0b" };
  const color = colors[status] || colors.Pending;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recruiter/application/${element._id}`);
  };

  const handleResumeClick = (e) => {
    e.stopPropagation();
    window.open(element.resume.url, "_blank");
  };

  return (
    <div 
      className="glass-card applicant-card" 
      onClick={handleCardClick}
      style={{ 
        padding: isMobile ? "1rem" : "1.5rem", 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row", 
        gap: "1.5rem", 
        position: "relative",
        cursor: "pointer",
        transition: "all 0.3s ease"
      }}
    >
      <style>{`
        .applicant-card:hover { 
          transform: translateY(-2px);
          border-color: var(--primary) !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "#f0fdf4", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.25rem", flexShrink: 0 }}>{element.name?.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>{element.name}</h4>
            <span style={{ fontSize: "0.65rem", fontWeight: 900, padding: "0.15rem 0.4rem", borderRadius: "5px", background: color+"20", color: color }}>{status.toUpperCase()}</span>
          </div>
          <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700 }}>{element.jobId?.title}</p>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "0.75rem" }}>
        {[
          { icon: <FiMail />, val: element.email },
          { icon: <FiPhone />, val: element.phone },
          { icon: <FiMapPin />, val: element.address }
        ].map((item, i) => (
          <div key={i} style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>{item.icon} {item.val}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", width: isMobile ? "100%" : "auto", alignItems: "center" }}>
         <button onClick={handleCardClick} style={{ flex: 1, padding: "0.6rem 1rem", borderRadius: "10px", backgroundColor: "var(--primary)", color: "white", border: "none", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>Review</button>
         <button onClick={handleResumeClick} style={{ width: "80px", padding: "0.6rem 0", border: "1px solid #e2e8f0", background: "white", borderRadius: "10px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>Resume</button>
      </div>
    </div>
  );
};

export default MyApplications;
