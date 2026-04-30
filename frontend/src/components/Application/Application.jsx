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

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
};

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
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width < 1024;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/job/${id}`, { withCredentials: true });
        setJob(data.job);
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone(user.phone || "");
        }
      } catch (error) {
        toast.error("Error loading job.");
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
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Use PDF or Docx.");
      setResume(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError("File too large (>2MB).");
      setResume(null);
      return;
    }
    setResume(file);
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error("Upload resume");
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
      await axios.post(`${import.meta.env.VITE_API_URL}/application/post`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Submitted!");
      setTimeout(() => navigateTo("/seeker/applications"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) return <Navigate to="/login" />;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: isMobile ? "200px" : "300px", background: "#0f172a", zIndex: 0 }}></div>

      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "2rem 1rem" : "4rem 1.5rem", position: "relative", zIndex: 1 }}>
        <button onClick={() => navigateTo(-1)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "0.6rem 1rem", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}>
          <FiArrowLeft /> Back
        </button>

        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1.6fr", gap: "2rem" }}>
          
          <div style={{ position: isTablet ? "relative" : "sticky", top: "1rem" }}>
             <div className="glass-card" style={{ padding: isMobile ? "1.5rem" : "2rem", backgroundColor: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                   <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: 900 }}>{job?.title?.charAt(0)}</div>
                   <div>
                      <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{job?.title}</h4>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>{job?.category}</p>
                   </div>
                </div>
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                   <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0 }}><FiShield color="#10b981" /> Application securely encrypted.</p>
                </div>
             </div>
          </div>

          <div className="glass-card" style={{ padding: isMobile ? "1.5rem" : "3rem", backgroundColor: "white" }}>
            <h2 style={{ fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 900, marginBottom: "0.5rem" }}>Apply</h2>
            <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "0.95rem" }}>Finish your application for this opportunity.</p>

            <form onSubmit={handleApplication} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "1rem" : "1.5rem" }}>
              {[
                { label: "Name", val: name, set: setName, icon: <FiUser />, ph: "Full Name" },
                { label: "Email", val: email, set: setEmail, icon: <FiMail />, ph: "Email", type: "email" },
                { label: "Phone", val: phone, set: setPhone, icon: <FiPhone />, ph: "+91..." },
                { label: "Location", val: address, set: setAddress, icon: <FiMapPin />, ph: "City, Country" },
              ].map(field => (
                <div key={field.label} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569" }}>{field.label}</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>{field.icon}</span>
                    <input type={field.type || "text"} value={field.val} onChange={e => field.set(e.target.value)} required style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }} />
                  </div>
                </div>
              ))}
              
              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Cover Letter</label>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} required rows={5} style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", resize: "none" }} />
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Resume Document (PDF/Docx)</label>
                <div style={{ position: "relative", border: "2px dashed #cbd5e1", borderRadius: "12px", padding: "2rem", textAlign: "center", backgroundColor: resume ? "#f0fdf4" : "#f8fafc" }}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                  {resume ? <p style={{ color: "#166534", fontWeight: 700 }}>✅ {resume.name}</p> : <><FiUpload size={24} color="#94a3b8" /><p style={{ fontSize: "0.85rem", color: "#64748b" }}>Click to upload resume</p></>}
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ gridColumn: "1 / -1", backgroundColor: "#0f172a", color: "white", padding: "1rem", borderRadius: "12px", fontWeight: 800, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;