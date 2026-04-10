import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { 
  FiArrowLeft, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiUser, 
  FiFileText, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiZap,
  FiShield,
  FiBriefcase
} from "react-icons/fi";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/application/${id}`,
          { withCredentials: true }
        );
        setApplication(data.application);
      } catch (error) {
        toast.error("Failed to fetch application details");
        const redirectPath = user?.role === "Employer" ? "/recruiter/applications" : "/seeker/applications";
        navigateTo(redirectPath);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthorized) fetchApplication();
  }, [id, isAuthorized, navigateTo, user?.role]);

  const updateStatus = async (status) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/application/update/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success(data.message);
      setApplication(data.application);
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div className="loader"></div>
    </div>
  );

  if (!application) return null;

  const isEmployer = user?.role === "Employer";

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted": return "#10b981";
      case "Rejected": return "#ef4444";
      default: return "#f59e0b";
    }
  };

  return (
    <div className="app-detail-page" style={{ padding: "2.5rem", maxWidth: "1000px", margin: "0 auto", backgroundColor: "#fcfdff" }}>
       
       {/* Simple Header */}
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <button 
            onClick={() => navigateTo(-1)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "0.5rem 1rem", borderRadius: "8px", color: "#475569", fontWeight: 700, cursor: "pointer" }}>
            <FiArrowLeft /> Back
          </button>
          <div style={{ textAlign: "right" }}>
             <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8", fontWeight: 800 }}>SUBMISSION Manifest</p>
             <p style={{ margin: 0, fontSize: "0.9rem", color: "#0f172a", fontWeight: 800 }}>ID: {application._id}</p>
          </div>
       </div>

       {/* Targeted Position Bar */}
       <div style={{ padding: "1.25rem 2rem", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
             <FiBriefcase color="var(--primary)" size={20} />
             <div>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 800, textTransform: "uppercase" }}>Targeted Position</span>
                <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>{application.jobId?.title || "Not Available"}</h2>
             </div>
          </div>
          <Link to={`/job/${application.jobId?._id}`} style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 800, textDecoration: "none" }}>
             VIEW ORIGINAL POSTING →
          </Link>
       </div>

       <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2.5rem" }}>
          <div className="detail-main">
             <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "2.5rem" }}>
                
                <h3 style={{ margin: "0 0 2rem 0", fontSize: "1.2rem", fontWeight: 900, color: "#0f172a", borderBottom: "2px solid #f1f5f9", paddingBottom: "1rem" }}>
                   Data Structure Representation
                </h3>

                {/* Info Matrix */}
                <div style={{ display: "flex", flexDirection: "column", border: "1px solid #f1f5f9", borderRadius: "12px", overflow: "hidden", marginBottom: "3rem" }}>
                   <ManifestRow label="Full Name" value={application.name} isEven />
                   <ManifestRow label="Email Address" value={application.email} />
                   <ManifestRow label="Phone Number" value={application.phone} isEven />
                   <ManifestRow label="Mailing Address" value={application.address} />
                   <ManifestRow label="Date of Filing" value={new Date(application.createdAt).toLocaleString()} isEven />
                   <ManifestRow label="Hiring Status" value={application.status.toUpperCase()} statusColor={getStatusColor(application.status)} />
                </div>

                <div style={{ marginBottom: "2rem" }}>
                   <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 800, color: "#64748b", margin: "0 0 1rem 0", textTransform: "uppercase" }}>
                      <FiFileText /> Cover Letter Content
                   </h4>
                   <div style={{ padding: "2rem", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", lineHeight: 1.7, color: "#334155", fontSize: "1rem" }}>
                      {application.coverLetter}
                   </div>
                </div>
             </div>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
             <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "2rem" }}>
                <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1rem", fontWeight: 800 }}>{isEmployer ? "Decision Center" : "Track Status"}</h3>
                
                {isEmployer && application.status === "Pending" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                     <button onClick={() => updateStatus("Accepted")} style={{ padding: "0.85rem", borderRadius: "10px", border: "none", backgroundColor: "#10b981", color: "white", fontWeight: 800, cursor: "pointer" }}>
                       Accept Selection
                     </button>
                     <button onClick={() => updateStatus("Rejected")} style={{ padding: "0.85rem", borderRadius: "10px", border: "1px solid #fee2e2", backgroundColor: "#fff", color: "#ef4444", fontWeight: 800, cursor: "pointer" }}>
                       Decline Application
                     </button>
                  </div>
                ) : (
                  <div style={{ padding: "1.25rem", borderRadius: "10px", backgroundColor: getStatusColor(application.status) + "08", border: `1.5px solid ${getStatusColor(application.status)}40` }}>
                     <p style={{ margin: 0, fontWeight: 800, color: getStatusColor(application.status), fontSize: "0.9rem", textTransform: "uppercase", textAlign: "center" }}>
                        {application.status}
                     </p>
                  </div>
                )}
             </div>

             <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "2rem" }}>
                 <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1rem", fontWeight: 800 }}>Supporting Docs</h3>
                 <a href={application.resume.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem", borderRadius: "10px", backgroundColor: "#f1f5f9", color: "#0f172a", textDecoration: "none", fontWeight: 700, border: "1px solid #e2e8f0", justifyContent: "center", fontSize: "0.9rem" }}>
                    <FiUser size={18} /> OPEN RESUME
                 </a>
             </div>

             <div style={{ padding: "1.5rem", borderRadius: "16px", backgroundColor: "#fffbeb", border: "1px solid #fef3c7" }}>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400e", lineHeight: 1.5, display: "flex", gap: "0.5rem" }}>
                   <FiShield size={20} style={{ flexShrink: 0 }} />
                   Protected data environment enabled.
                </p>
             </div>
          </aside>
       </div>
    </div>
  );
};

const ManifestRow = ({ label, value, isEven, statusColor }) => (
  <div style={{ 
    display: "grid", 
    gridTemplateColumns: "180px 1fr", 
    padding: "1rem 1.5rem", 
    backgroundColor: isEven ? "#fafbfc" : "white",
    borderBottom: "1px solid #f1f5f9"
  }}>
    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#94a3b8" }}>{label}</span>
    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: statusColor || "#1e293b" }}>{value}</span>
  </div>
);

const DetailBox = ({ icon, label, value }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
     <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>{label}</span>
     <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b", fontWeight: 700 }}>
        <span style={{ color: "#94a3b8" }}>{icon}</span>
        {value}
     </div>
  </div>
);

export default ApplicationDetail;
