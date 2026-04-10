import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Context } from "../../main";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFileText, 
  FiUpload, 
  FiArrowLeft, 
  FiCheckCircle,
  FiInfo,
  FiShield
} from "react-icons/fi";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [job, setJob] = useState(null);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/job/${id}`, { withCredentials: true });
        setJob(data.job);
        // Pre-fill user data if available
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone(user.phone || "");
        }
      } catch (error) {
        toast.error("Job details could not be loaded.");
      }
    };
    fetchJob();
  }, [id, user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError("");
    
    if (!file) {
      setResume(null);
      return;
    }
    
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Invalid format. Please use PNG, JPEG, or WEBP.");
      setResume(null);
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setFileError("File too large. Maximum size is 2MB.");
      setResume(null);
      return;
    }
    
    setResume(file);
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error("Please upload your resume");

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/application/post`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Application submitted! Taking you to your dashboard.");
      setTimeout(() => navigateTo("/seeker/applications"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", position: "relative" }}>
      {/* Background Decor */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "300px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", zIndex: 0 }}></div>

      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem", position: "relative", zIndex: 1 }}>
        <button 
          onClick={() => navigateTo(-1)}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "0.6rem 1.2rem", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>
          <FiArrowLeft /> Back to Job Details
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2rem", alignItems: "start" }}>
          
          {/* Left Column: Job Info */}
          <div style={{ position: "sticky", top: "2rem" }}>
             <div className="glass-card" style={{ padding: "2.5rem", backgroundColor: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                   <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: 800 }}>
                      {job?.title?.charAt(0) || "J"}
                   </div>
                   <div>
                      <h4 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>{job?.title}</h4>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>{job?.category}</p>
                   </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem" }}>
                   <div style={{ display: "flex", gap: "1rem" }}>
                      <FiInfo style={{ color: "var(--primary)", flexShrink: 0, marginTop: "0.2rem" }} />
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569", lineHeight: 1.5 }}>
                        <strong>Quick Tip:</strong> Tailor your cover letter to highlight specific skills mentioned in the job description.
                      </p>
                   </div>
                   <div style={{ display: "flex", gap: "1rem" }}>
                      <FiShield style={{ color: "#10b981", flexShrink: 0, marginTop: "0.2rem" }} />
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                        Your application is securely sent directly to the employer's dashboard.
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: Form */}
          <div className="glass-card" style={{ padding: "3.5rem", backgroundColor: "white" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.5rem" }}>Send Application</h2>
            <p style={{ color: "#64748b", marginBottom: "3rem" }}>Double check your contact information before submitting.</p>

            <form onSubmit={handleApplication} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>Name</label>
                <div style={{ position: "relative" }}>
                  <FiUser style={{ position: "absolute", top: "50%", left: "1rem", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                    style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", outline: "none", transition: "0.2s" }}
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>Email</label>
                <div style={{ position: "relative" }}>
                  <FiMail style={{ position: "absolute", top: "50%", left: "1rem", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", outline: "none" }}
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>Phone</label>
                <div style={{ position: "relative" }}>
                  <FiPhone style={{ position: "absolute", top: "50%", left: "1rem", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required
                    style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", outline: "none" }}
                    placeholder="+91..."
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>Location</label>
                <div style={{ position: "relative" }}>
                  <FiMapPin style={{ position: "absolute", top: "50%", left: "1rem", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required
                    style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.75rem", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", outline: "none" }}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>Cover Letter</label>
                <textarea 
                  value={coverLetter} 
                  onChange={(e) => setCoverLetter(e.target.value)} 
                  required
                  rows={6}
                  style={{ width: "100%", padding: "1.2rem", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", outline: "none", resize: "none", lineHeight: 1.6 }}
                  placeholder="Tell the employer why you are a great fit..."
                />
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>Resume / Certification (PNG/JPG/WEBP)</label>
                <div style={{ 
                  position: "relative", 
                  border: "2px dashed #cbd5e1", 
                  borderRadius: "16px", 
                  padding: "2.5rem", 
                  textAlign: "center",
                  backgroundColor: resume ? "#f0fdf4" : "#f8fafc",
                  borderColor: resume ? "#22c55e" : "#cbd5e1",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}>
                  <input 
                    type="file" 
                    accept=".png,.jpg,.jpeg,.webp" 
                    onChange={handleFileChange} 
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} 
                  />
                  {!resume ? (
                    <>
                      <FiUpload size={32} style={{ color: "#94a3b8", marginBottom: "0.75rem" }} />
                      <p style={{ margin: 0, fontWeight: 700, color: "#475569" }}>Click to upload or drag & drop</p>
                      <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.4rem" }}>Professional visual resume preferred (Max 2MB)</p>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={32} style={{ color: "#22c55e", marginBottom: "0.75rem" }} />
                      <p style={{ margin: 0, fontWeight: 800, color: "#166534" }}>{resume.name}</p>
                      <p style={{ fontSize: "0.8rem", color: "#166534", marginTop: "0.2rem", textDecoration: "underline" }}>Click to replace file</p>
                    </>
                  )}
                </div>
                {fileError && <p style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: 600 }}>{fileError}</p>}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  gridColumn: "1 / -1", 
                  backgroundColor: "#0f172a", 
                  color: "white", 
                  padding: "1.2rem", 
                  borderRadius: "14px", 
                  fontWeight: 800, 
                  fontSize: "1.1rem", 
                  border: "none", 
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "1.5rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: "0.3s"
                }}
              >
                {loading ? "Processing..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;