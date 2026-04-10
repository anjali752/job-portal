import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import { Context } from "../../main";
import { 
  FiBriefcase, 
  FiMapPin, 
  FiDollarSign, 
  FiInfo, 
  FiPlusCircle, 
  FiLayers,
  FiGlobe,
  FiSend,
  FiChevronRight
} from "react-icons/fi";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [jobType, setJobType] = useState("Job");

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleJobPost = async (e) => {
    e.preventDefault();
    
    const jobData = salaryType === "Fixed Salary" 
      ? { title, description, category, country, city, location, fixedSalary, jobType }
      : { title, description, category, country, city, location, salaryFrom, salaryTo, jobType };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/job/post`,
        jobData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      // Optional: redirect to job management
      // navigateTo("/recruiter/jobs/manage");
    } catch (err) {
      toast.error(err.response?.data?.message || "Posting failed");
    }
  };

  if (!isAuthorized || (user && user.role !== "Employer")) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="post_job_page" style={{ padding: "2rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "2.5rem", alignItems: "start" }}>
      <div className="glass-card" style={{ padding: "2.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Create a New Listing</h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem" }}>Fill in the details below to reach thousands of qualified candidates.</p>
        </div>

        <form onSubmit={handleJobPost} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Main Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
             <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                  <FiBriefcase /> JOB TITLE
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Senior Frontend Engineer" 
                  className="modern-input"
                  style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none" }}
                />
             </div>
             <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                   <FiLayers /> CATEGORY
                </label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="modern-input"
                  style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none", backgroundColor: "white" }}
                >
                  <option value="">Select Category</option>
                  <option value="Graphics & Design">Graphics & Design</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Frontend Web Development">Frontend Web Development</option>
                  <option value="Business Development Executive">Business Development Executive</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="MERN Stack Development">MERN Stack Development</option>
                </select>
             </div>
          </div>

          {/* Job Type selection */}
          <div style={{ padding: "1.5rem", backgroundColor: "#fffbeb", borderRadius: "14px", border: "1.5px solid #fef3c7" }}>
             <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "#92400e", marginBottom: "1rem" }}>WHAT ARE YOU POSTING?</label>
             <div style={{ display: "flex", gap: "1rem" }}>
                <button 
                  type="button"
                  onClick={() => setJobType("Job")}
                  style={{ 
                    flex: 1, 
                    padding: "1rem", 
                    borderRadius: "10px", 
                    border: jobType === "Job" ? "2px solid #ea580c" : "1.5px solid #e2e8f0", 
                    backgroundColor: jobType === "Job" ? "#fff" : "#f8fafc",
                    color: jobType === "Job" ? "#ea580c" : "#64748b",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}>
                  <FiBriefcase /> Full-time Job
                </button>
                <button 
                  type="button"
                  onClick={() => setJobType("Internship")}
                  style={{ 
                    flex: 1, 
                    padding: "1rem", 
                    borderRadius: "10px", 
                    border: jobType === "Internship" ? "2px solid #ea580c" : "1.5px solid #e2e8f0", 
                    backgroundColor: jobType === "Internship" ? "#fff" : "#f8fafc",
                    color: jobType === "Internship" ? "#ea580c" : "#64748b",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}>
                  <FiPlusCircle /> Internship
                </button>
             </div>
          </div>


          {/* Location */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
             <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                  <FiGlobe /> COUNTRY
                </label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none" }} />
             </div>
             <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                  <FiMapPin /> CITY
                </label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none" }} />
             </div>
          </div>

          <div className="input-group">
             <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                <FiMapPin /> FULL ADDRESS / LOCATION
             </label>
             <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Plot 42, Sector 5, Business Bay" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none" }} />
          </div>

          {/* Salary Section */}
          <div style={{ backgroundColor: "#f8fafc", padding: "1.5rem", borderRadius: "14px", border: "1.5px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
               <div style={{ minWidth: "200px" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#64748b", display: "block", marginBottom: "0.5rem" }}>SALARY STRUCTURE</label>
                  <select 
                    value={salaryType} 
                    onChange={(e) => setSalaryType(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", outline: "none" }}
                  >
                    <option value="default">Select Type</option>
                    <option value="Fixed Salary">Fixed Amount</option>
                    <option value="Ranged Salary">Salary Range</option>
                  </select>
               </div>
               
               <div style={{ flex: 1 }}>
                  {salaryType === "Fixed Salary" ? (
                    <div className="input-group">
                       <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#64748b" }}>AMOUNT ($)</label>
                       <input type="number" placeholder="Enter Amount" value={fixedSalary} onChange={(e) => setFixedSalary(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", marginTop: "0.5rem" }} />
                    </div>
                  ) : salaryType === "Ranged Salary" ? (
                    <div style={{ display: "flex", gap: "1rem" }}>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#64748b" }}>FROM ($)</label>
                          <input type="number" placeholder="Min" value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", marginTop: "0.5rem" }} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#64748b" }}>TO ($)</label>
                          <input type="number" placeholder="Max" value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", marginTop: "0.5rem" }} />
                       </div>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><FiInfo /> Competitive salary details attract 3x more applicants.</p>
                  )}
               </div>
            </div>
          </div>

          <div className="input-group">
             <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                <FiInfo /> JOB DESCRIPTION
             </label>
             <textarea rows="8" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly explain the role, requirements, and responsibilities..." style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none", resize: "none" }} />
          </div>

          <button type="submit" className="primary-btn" style={{ height: "56px", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)" }}>
            <FiSend /> Publish to Job Board
          </button>
        </form>
      </div>

      <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
         <div className="glass-card" style={{ padding: "1.75rem", backgroundColor: "#f0f9ff", border: "1px solid #bae6fd" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#0369a1", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiPlusCircle /> PRO TIPS
            </h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
               <li style={{ fontSize: "0.85rem", color: "#0c4a6e", display: "flex", gap: "0.75rem" }}>
                  <FiChevronRight style={{ flexShrink: 0, marginTop: "2px" }} />
                  Use clear, standard job titles like "Full Stack Developer" instead of "Code Ninja".
               </li>
               <li style={{ fontSize: "0.85rem", color: "#0c4a6e", display: "flex", gap: "0.75rem" }}>
                  <FiChevronRight style={{ flexShrink: 0, marginTop: "2px" }} />
                  Be specific about required tech stacks (e.g. MERN, AWS, TypeScript).
               </li>
               <li style={{ fontSize: "0.85rem", color: "#0c4a6e", display: "flex", gap: "0.75rem" }}>
                  <FiChevronRight style={{ flexShrink: 0, marginTop: "2px" }} />
                  Adding a salary range increases trust and candidate quality.
               </li>
            </ul>
         </div>

         <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: 800 }}>Need Help?</h4>
            <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>Our AI candidate screening helps you filter the best talent automatically after you post.</p>
            <button style={{ background: "none", border: "none", color: "var(--primary)", padding: 0, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem" }}>View Documentation</button>
         </div>
      </aside>
    </section>
  );
};

export default PostJob;
