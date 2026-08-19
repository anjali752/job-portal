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
  FiShield,
  FiBriefcase,
  FiChevronRight,
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
    <div className="app-detail-container">
       {/* Header with Glassmorphism */}
       <div className="ad-header modern-glass">
          <button 
            onClick={() => navigateTo(-1)}
            className="ad-back-btn">
            <FiArrowLeft /> Back
          </button>
          <div className="ad-submission-info">
             <p className="ad-manifest-label">SUBMISSION Manifest</p>
             <p className="ad-submission-id">ID: {application._id}</p>
          </div>
       </div>

       {/* Targeted Position Hero */}
       <div className="ad-position-hero modern-glass">
          <div className="ad-pos-content">
             <div className="ad-pos-icon">
                <FiBriefcase size={28} />
             </div>
             <div>
                <span className="ad-pos-label">Targeted Position</span>
                <h2 className="ad-pos-title">{application.jobId?.title || "Not Available"}</h2>
             </div>
          </div>
          <Link to={`/job/${application.jobId?._id}`} className="ad-view-link">
             VIEW ORIGINAL POSTING <FiChevronRight />
          </Link>
       </div>

       <div className="ad-grid-layout">
          <div className="detail-main">
             <div className="ad-main-card modern-glass">
                <div className="ad-card-header">
                   <h3 className="ad-card-title">Candidate Profile Data</h3>
                   <span className="ad-card-subtitle">Detailed submission structure representation</span>
                </div>

                <div className="ad-manifest-grid">
                   <ManifestItem label="Full Name" value={application.name} icon={<FiUser />} />
                   <ManifestItem label="Email Address" value={application.email} icon={<FiMail />} />
                   <ManifestItem label="Phone Number" value={application.phone} icon={<FiPhone />} />
                   <ManifestItem label="Mailing Address" value={application.address} icon={<FiMapPin />} />
                   <ManifestItem label="Date of Filing" value={new Date(application.createdAt).toLocaleString()} icon={<FiClock />} />
                   <ManifestItem label="Hiring Status" value={application.status} icon={<FiCheckCircle />} statusColor={getStatusColor(application.status)} isBadge />
                </div>

                <div className="ad-cover-section">
                   <h4 className="ad-section-label">
                      <FiFileText /> Cover Letter Content
                   </h4>
                   <div className="ad-content-box">
                      {application.coverLetter}
                   </div>
                </div>
             </div>
          </div>

          <aside className="ad-sidebar">
             <div className="ad-sidebar-card modern-glass">
                <h3 className="ad-sidebar-title">{isEmployer ? "Decision Center" : "Application Progress"}</h3>
                
                {isEmployer && application.status === "Pending" ? (
                  <div className="ad-action-group">
                     <button onClick={() => updateStatus("Accepted")} className="ad-btn-primary ad-btn-accept">
                       <FiCheckCircle /> Accept Selection
                     </button>
                     <button onClick={() => updateStatus("Rejected")} className="ad-btn-secondary ad-btn-reject">
                       <FiXCircle /> Decline Application
                     </button>
                  </div>
                ) : (
                  <div className="ad-status-container">
                     <div className="ad-status-indicator" style={{ backgroundColor: getStatusColor(application.status) }}></div>
                     <span style={{ fontWeight: 800, color: getStatusColor(application.status), textTransform: "uppercase", fontSize: "0.9rem" }}>
                        {application.status}
                     </span>
                  </div>
                )}
             </div>

             <div className="ad-sidebar-card modern-glass">
                 <h3 className="ad-sidebar-title">Supporting Documentation</h3>
                 <a href={application.resume.url} target="_blank" rel="noreferrer" className="ad-resume-btn">
                    <FiFileText size={20} /> VIEW FULL RESUME
                 </a>
                 <p className="ad-hint">Verified document encrypted in transit.</p>
             </div>

             <div className="ad-info-box">
                <FiShield size={24} className="ad-info-icon" />
                <p className="ad-info-text">
                   <strong>Secure Environment</strong><br/>
                   Protected candidate data environment enabled for this manifest.
                </p>
             </div>
          </aside>
       </div>

       <style>{`
         .app-detail-container { padding: 2rem; max-width: 1200px; margin: 0 auto; min-height: 100vh; }
         .modern-glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
         
         .ad-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; margin-bottom: 2rem; }
         .ad-back-btn { display: flex; align-items: center; gap: 0.5rem; background: #fff; border: 1px solid #e2e8f0; padding: 0.6rem 1.2rem; border-radius: 12px; color: #475569; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
         .ad-back-btn:hover { transform: translateX(-4px); box-shadow: 0 6px 12px rgba(0,0,0,0.05); }
         .ad-manifest-label { margin: 0; font-size: 0.7rem; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
         .ad-submission-id { margin: 0; font-size: 0.95rem; color: #0f172a; font-weight: 800; }

         .ad-position-hero { padding: 2rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 2rem; flex-wrap: wrap; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #e2e8f0; }
         .ad-pos-content { display: flex; gap: 1.5rem; align-items: center; }
         .ad-pos-icon { width: 56px; height: 56px; background: #eff6ff; color: #3b82f6; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
         .ad-pos-label { font-size: 0.75rem; color: #64748b; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 0.25rem; }
         .ad-pos-title { margin: 0; font-size: 1.5rem; font-weight: 900; color: #0f172a; }
         .ad-view-link { display: flex; align-items: center; gap: 0.5rem; color: #3b82f6; font-weight: 800; text-decoration: none; font-size: 0.9rem; transition: 0.2s; }
         .ad-view-link:hover { gap: 0.75rem; }

         .ad-grid-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; }
         .ad-main-card { padding: 3rem; }
         .ad-card-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; }
         .ad-card-title { font-size: 1.25rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem; }
         .ad-card-subtitle { color: #94a3b8; font-size: 0.9rem; font-weight: 500; }

         .ad-manifest-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 3rem; }
         .manifest-item { display: flex; gap: 1rem; align-items: flex-start; }
         .mi-icon { width: 40px; height: 40px; border-radius: 10px; background: #f8fafc; color: #64748b; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #f1f5f9; }
         .mi-label { font-size: 0.75rem; color: #94a3b8; font-weight: 800; text-transform: uppercase; margin-bottom: 0.25rem; display: block; }
         .mi-value { font-size: 1rem; font-weight: 700; color: #334155; word-break: break-all; line-height: 1.4; }
         .mi-badge { display: inline-block; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 800; }

         .ad-cover-section { margin-top: 2rem; }
         .ad-section-label { display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 1.25rem; }
         .ad-content-box { padding: 2.5rem; background: #f8fafc; border-radius: 20px; border: 1px solid #e2e8f0; line-height: 1.8; color: #475569; font-size: 1.05rem; white-space: pre-wrap; }

         .ad-sidebar { display: flex; flex-direction: column; gap: 2rem; }
         .ad-sidebar-card { padding: 2rem; }
         .ad-sidebar-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 1.5rem; color: #0f172a; }
         .ad-action-group { display: flex; flex-direction: column; gap: 1rem; }
         .ad-btn-primary, .ad-btn-secondary { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 1rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; border: none; font-size: 0.95rem; }
         .ad-btn-accept { background: #10b981; color: white; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); }
         .ad-btn-accept:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3); }
         .ad-btn-reject { background: white; color: #ef4444; border: 1px solid #fee2e2; }
         .ad-btn-reject:hover { background: #fef2f2; }
         
         .ad-status-container { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #fff; border-radius: 12px; border: 1px solid #f1f5f9; }
         .ad-status-indicator { width: 10px; height: 10px; border-radius: 50%; }

         .ad-resume-btn { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 1.2rem; background: #0f172a; color: white; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 0.9rem; transition: 0.3s; }
         .ad-resume-btn:hover { background: #1e293b; transform: translateY(-2px); }
         .ad-hint { font-size: 0.75rem; color: #94a3b8; margin: 1rem 0 0 0; text-align: center; }

         .ad-info-box { display: flex; gap: 1rem; padding: 1.5rem; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 20px; }
         .ad-info-icon { color: #d97706; flex-shrink: 0; }
         .ad-info-text { margin: 0; font-size: 0.85rem; color: #92400e; line-height: 1.6; }

         @media (max-width: 1024px) {
           .ad-grid-layout { grid-template-columns: 1fr; }
           .ad-sidebar { flex-direction: row; }
           .ad-sidebar-card, .ad-info-box { flex: 1; min-width: 300px; }
         }

         @media (max-width: 768px) {
           .app-detail-container { padding: 1rem; }
           .ad-header { padding: 1rem; flex-direction: column; align-items: flex-start; gap: 1rem; }
           .ad-position-hero { padding: 1.5rem; }
           .ad-pos-title { font-size: 1.2rem; }
           .ad-main-card { padding: 1.5rem; }
           .ad-manifest-grid { grid-template-columns: 1fr; gap: 1.5rem; }
           .ad-content-box { padding: 1.5rem; }
           .ad-sidebar { flex-direction: column; }
         }
       `}</style>
    </div>
  );
};

const ManifestItem = ({ label, value, icon, statusColor, isBadge }) => (
  <div className="manifest-item">
    <div className="mi-icon">{icon}</div>
    <div style={{ flex: 1 }}>
      <span className="mi-label">{label}</span>
      {isBadge ? (
        <span className="mi-badge" style={{ backgroundColor: statusColor + "15", color: statusColor }}>
          {value}
        </span>
      ) : (
        <span className="mi-value">{value}</span>
      )}
    </div>
  </div>
);

export default ApplicationDetail;
