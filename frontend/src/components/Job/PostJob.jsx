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

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
};

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
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width < 1024;

  const handleJobPost = async (e) => {
    e.preventDefault();
    const jobData = salaryType === "Fixed Salary" 
      ? { title, description, category, country, city, location, fixedSalary, jobType }
      : { title, description, category, country, city, location, salaryFrom, salaryTo, jobType };
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/job/post`, jobData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (!isAuthorized || (user && user.role !== "Employer")) return <Navigate to="/login" />;

  return (
    <section style={{ padding: isMobile ? "1rem" : "2rem", display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 340px", gap: "2rem" }}>
      <div className="glass-card" style={{ padding: isMobile ? "1.5rem" : "2.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: isMobile ? "1.5rem" : "1.8rem", fontWeight: 800 }}>Post a New Job</h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Reach thousands of candidates.</p>
        </div>

        <form onSubmit={handleJobPost} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
             <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#64748b", display: "block", marginBottom: "0.4rem" }}>JOB TITLE</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
             </div>
             <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#64748b", display: "block", marginBottom: "0.4rem" }}>CATEGORY</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white" }}>
                  <option value="">Select</option>
                  <option value="Frontend Web Development">Frontend Web Development</option>
                  <option value="MERN Stack Development">MERN Stack Development</option>
                </select>
             </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "#fffbeb", borderRadius: "12px", border: "1px solid #fef3c7" }}>
             <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "#92400e", display: "block", marginBottom: "0.75rem" }}>TYPE</label>
             <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="button" onClick={() => setJobType("Job")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: jobType === "Job" ? "2px solid #ea580c" : "1px solid #e2e8f0", backgroundColor: jobType === "Job" ? "white" : "#f8fafc", fontWeight: 800, color: jobType === "Job" ? "#ea580c" : "#64748b" }}>Job</button>
                <button type="button" onClick={() => setJobType("Internship")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: jobType === "Internship" ? "2px solid #ea580c" : "1px solid #e2e8f0", backgroundColor: jobType === "Internship" ? "white" : "#f8fafc", fontWeight: 800, color: jobType === "Internship" ? "#ea580c" : "#64748b" }}>Internship</button>
             </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
             <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
             <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          </div>

          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Full Address" style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />

          <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
             <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1rem" }}>
                <select value={salaryType} onChange={(e) => setSalaryType(e.target.value)} style={{ padding: "0.6rem", borderRadius: "8px", border: "1.5px solid #e2e8f0" }}>
                  <option value="default">Salary Type</option>
                  <option value="Fixed Salary">Fixed</option>
                  <option value="Ranged Salary">Range</option>
                </select>
                <div style={{ flex: 1 }}>
                  {salaryType === "Fixed Salary" ? <input type="number" placeholder="Amount" value={fixedSalary} onChange={(e) => setFixedSalary(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1.5px solid #e2e8f0" }} /> : salaryType === "Ranged Salary" ? <div style={{ display: "flex", gap: "0.5rem" }}><input type="number" placeholder="Min" value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} style={{ flex: 1, padding: "0.6rem", border: "1.5px solid #e2e8f0", borderRadius: "8px" }} /><input type="number" placeholder="Max" value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} style={{ flex: 1, padding: "0.6rem", border: "1.5px solid #e2e8f0", borderRadius: "8px" }} /></div> : <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>Select salary type</p>}
                </div>
             </div>
          </div>

          <textarea rows="5" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Job description..." style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", resize: "none" }} />

          <button type="submit" style={{ backgroundColor: "#0f172a", color: "white", padding: "1rem", borderRadius: "12px", fontWeight: 800, border: "none", cursor: "pointer" }}>Publish Job Post</button>
        </form>
      </div>

      <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
         <div className="glass-card" style={{ padding: "1.25rem", background: "#f0f9ff", border: "1px solid #bae6fd" }}>
            <h4 style={{ margin: "0 0 0.75rem 0", color: "#0369a1", fontWeight: 800 }}>PRO TIPS</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none", fontSize: "0.8rem", color: "#0c4a6e", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
               <li>• Use clear job titles.</li>
               <li>• Specify tech stacks.</li>
               <li>• Add salary ranges.</li>
            </ul>
         </div>
      </aside>
    </section>
  );
};

export default PostJob;
