import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../main";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiBriefcase, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiCamera,
  FiGlobe,
  FiLinkedin,
  FiMapPin,
  FiCheckCircle,
  FiShield
} from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    jobTitle: user?.jobTitle || "",
    companyName: user?.companyName || "",
    companyLegalName: user?.companyLegalName || "",
    companyRegistrationNumber_CIN: user?.companyRegistrationNumber_CIN || "",
    gstNumber: user?.gstNumber || "",
    companyWebsite: user?.companyWebsite || "",
    officialCompanyEmail: user?.officialCompanyEmail || "",
    industryType: user?.industryType || "",
    companySize: user?.companySize || "",
    yearOfEstablishment: user?.yearOfEstablishment || "",
    officeAddress: user?.officeAddress || { street: "", city: "", state: "", pincode: "" },
    linkedInProfile: user?.linkedInProfile || "",
    bio: user?.bio || "",
    address: user?.address || "",
    portfolioUrl: user?.portfolioUrl || "",
    githubProfile: user?.githubProfile || "",
    skills: user?.skills || [],
    education: user?.education || [],
    experience: user?.experience || [],
    recruiterFullName: user?.recruiterFullName || "",
    recruiterWorkEmail: user?.recruiterWorkEmail || "",
    recruiterPhoneNumber: user?.recruiterPhoneNumber || "",
    recruiterLinkedInURL: user?.recruiterLinkedInURL || "",
  });

  const [documentFiles, setDocumentFiles] = useState({
    companyRegistrationCertificate: null,
    gstCertificate: null,
    officeAddressProof: null,
    recruiterIdProof: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        jobTitle: user.jobTitle || "",
        companyName: user.companyName || "",
        companyLegalName: user.companyLegalName || "",
        companyRegistrationNumber_CIN: user.companyRegistrationNumber_CIN || "",
        gstNumber: user.gstNumber || "",
        companyWebsite: user.companyWebsite || "",
        officialCompanyEmail: user.officialCompanyEmail || "",
        industryType: user.industryType || "",
        companySize: user.companySize || "",
        yearOfEstablishment: user.yearOfEstablishment || "",
        officeAddress: user.officeAddress || { street: "", city: "", state: "", pincode: "" },
        linkedInProfile: user.linkedInProfile || "",
        bio: user.bio || "",
        address: user.address || "",
        portfolioUrl: user.portfolioUrl || "",
        githubProfile: user.githubProfile || "",
        skills: user.skills || [],
        education: user.education || [],
        experience: user.experience || [],
        recruiterFullName: user.recruiterFullName || "",
        recruiterWorkEmail: user.recruiterWorkEmail || "",
        recruiterPhoneNumber: user.recruiterPhoneNumber || "",
        recruiterLinkedInURL: user.recruiterLinkedInURL || "",
      });
      setAvatarPreview(user?.avatar?.url || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOfficeAddressChange = (e) => {
    setFormData({
      ...formData,
      officeAddress: { ...formData.officeAddress, [e.target.name]: e.target.value }
    });
  };

  const handleDocumentChange = (e, field) => {
    setDocumentFiles({ ...documentFiles, [field]: e.target.files[0] });
  };

  const handleArrayChange = (index, field, value, type) => {
    const updatedArray = [...formData[type]];
    updatedArray[index][field] = value;
    setFormData({ ...formData, [type]: updatedArray });
  };

  const addArrayItem = (type, template) => {
    setFormData({ ...formData, [type]: [...formData[type], template] });
  };

  const removeArrayItem = (type, index) => {
    const updatedArray = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updatedArray });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const myForm = new FormData();
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key]) || typeof formData[key] === 'object') {
          myForm.append(key, JSON.stringify(formData[key]));
        } else {
          myForm.append(key, formData[key]);
        }
      });
      
      if (avatar) myForm.append("avatar", avatar);
      Object.keys(documentFiles).forEach(key => {
        if (documentFiles[key]) myForm.append(key, documentFiles[key]);
      });

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update/profile`,
        myForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("Profile updated successfully!");
      setUser(data.user);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="profile-page" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-1px" }}>Profile Settings</h1>
          <p style={{ color: "#64748b", fontSize: "1rem", marginTop: "0.5rem" }}>
            {user?.role === "Employer" ? "Authenticate your company and manage recruiter details." : "Showcase your professional identity to employers."}
          </p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.6rem", 
              padding: "0.8rem 2rem", 
              backgroundColor: "var(--primary)", 
              color: "white", 
              border: "none", 
              borderRadius: "12px", 
              fontWeight: 800, 
              cursor: "pointer",
              boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
              transition: "0.2s"
            }}>
            <FiEdit2 /> Edit details
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: isEditing ? "1fr" : "320px 1fr", gap: "3rem" }}>
        {/* Left Column - Avatar and Badges */}
        {!isEditing && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
               <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                  <div style={{ 
                    width: "160px", 
                    height: "160px", 
                    borderRadius: "24px", 
                    overflow: "hidden",
                    border: "4px solid white",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    backgroundColor: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "4rem", fontWeight: 900, color: "#3b82f6" }}>
                        {user?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
               </div>

               <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, textAlign: "center" }}>{user?.name}</h2>
               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.75rem", borderRadius: "20px", backgroundColor: "#f1f5f9", color: "#64748b", textTransform: "uppercase" }}>
                     {user?.role}
                  </span>
                  {user?.role === "Employer" && (
                    <span style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: 800, 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "20px", 
                      backgroundColor: user?.verificationStatus === "approved" ? "#dcfce7" : "#fee2e2", 
                      color: user?.verificationStatus === "approved" ? "#16a34a" : "#ef4444",
                      textTransform: "uppercase" 
                    }}>
                       {user?.verificationStatus}
                    </span>
                  )}
               </div>
            </div>

            <div className="glass-card" style={{ padding: "1.5rem", borderLeft: "4px solid #f59e0b" }}>
               <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiShield color="#f59e0b" /> Trust Score
               </h4>
               <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.5rem", lineHeight: 1.5 }}>
                 {user?.role === "Employer" ? "Verified companies receive 65% more applications." : "Complete all fields to earn the verified badge."}
               </p>
            </div>
          </div>
        )}

        {/* Right Column - Fields */}
        <div className="glass-card" style={{ padding: isEditing ? "3rem" : "2.5rem" }}>
           {isEditing && (
              <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ position: "relative" }}>
                   <div style={{ width: "120px", height: "120px", borderRadius: "20px", overflow: "hidden", border: "3px solid white", boxShadow: "0 10px 15px rgba(0,0,0,0.05)" }}>
                      <img src={avatarPreview || "/default.png"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                   </div>
                   <label style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 5px 10px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                      <FiCamera size={18} />
                      <input type="file" onChange={handleAvatarChange} style={{ display: "none" }} accept="image/*" />
                   </label>
                </div>
                <div>
                   <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>Profile Photo</h3>
                   <p style={{ margin: "0.25rem 0 0 0", color: "#64748b", fontSize: "0.9rem" }}>Update your professional image.</p>
                </div>
              </div>
           )}

           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <ProfileField label="Full Name" icon={<FiUser />} name="name" value={formData.name} onChange={handleChange} isEditing={isEditing} />
              <ProfileField label="Email Address" icon={<FiMail />} name="email" value={formData.email} isEditing={false} disabled />
              <ProfileField label="Phone Number" icon={<FiPhone />} name="phone" value={formData.phone} onChange={handleChange} isEditing={isEditing} />
              <ProfileField label={user?.role === "Employer" ? "Professional Title" : "Job Preference"} icon={<FiBriefcase />} name="jobTitle" value={formData.jobTitle} onChange={handleChange} isEditing={isEditing} placeholder="e.g. Talent Acquisition Lead" />
           </div>

           {user?.role === "Job Seeker" && (
             <>
               <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>Professional Presence</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                     <ProfileField label="Portfolio URL" icon={<FiGlobe />} name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} isEditing={isEditing} placeholder="https://yourportfolio.com" />
                     <ProfileField label="GitHub Profile" icon={<FiGlobe />} name="githubProfile" value={formData.githubProfile} onChange={handleChange} isEditing={isEditing} placeholder="https://github.com/username" />
                     <ProfileField label="LinkedIn Profile" icon={<FiLinkedin />} name="linkedInProfile" value={formData.linkedInProfile} onChange={handleChange} isEditing={isEditing} placeholder="linkedin.com/in/username" />
                     <ProfileField label="Current Location" icon={<FiMapPin />} name="address" value={formData.address} onChange={handleChange} isEditing={isEditing} placeholder="City, Country" />
                  </div>
               </div>

               <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>Skills & Expertise</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: isEditing ? "1rem" : "0" }}>
                    {formData.skills.map((skill, idx) => (
                      <span key={idx} style={{ 
                        backgroundColor: "var(--primary)", 
                        color: "white", 
                        padding: "0.4rem 1rem", 
                        borderRadius: "8px", 
                        fontSize: "0.85rem", 
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        {skill}
                        {isEditing && <FiX style={{ cursor: "pointer" }} onClick={() => removeArrayItem("skills", idx)} />}
                      </span>
                    ))}
                    {formData.skills.length === 0 && !isEditing && <span style={{ color: "#94a3b8" }}>No skills added yet.</span>}
                  </div>
                  
                  {isEditing && (
                    <div style={{ position: "relative", maxWidth: "400px", marginTop: "1rem" }}>
                      <input 
                        type="text" 
                        placeholder="Type a skill and press Enter..." 
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (e.target.value.trim() && !formData.skills.includes(e.target.value.trim())) {
                              setFormData({ ...formData, skills: [...formData.skills, e.target.value.trim()] });
                              e.target.value = "";
                            }
                          }
                        }}
                        style={{ 
                          width: "100%", 
                          padding: "0.8rem 1rem", 
                          borderRadius: "10px", 
                          border: "1.5px solid #e2e8f0", 
                          fontSize: "0.9rem",
                          outline: "none"
                        }}
                      />
                    </div>
                  )}
               </div>

               <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Work Experience</h3>
                    {isEditing && <button type="button" onClick={() => addArrayItem("experience", { company: "", role: "", duration: "", description: "" })} style={{ fontSize: "0.85rem", fontWeight: 700, color: "white", backgroundColor: "#0f172a", border: "none", padding: "0.4rem 1rem", borderRadius: "8px", cursor: "pointer" }}>+ Add Experience</button>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {formData.experience.map((exp, idx) => (
                      <div key={idx} className="glass-card" style={{ padding: "1.5rem", backgroundColor: "#f8fafc", position: "relative" }}>
                        {isEditing && <FiX style={{ position: "absolute", top: "1rem", right: "1rem", cursor: "pointer", color: "#ef4444" }} onClick={() => removeArrayItem("experience", idx)} />}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                          <ProfileField label="Company" icon={<FiBriefcase />} value={exp.company} onChange={(e) => handleArrayChange(idx, "company", e.target.value, "experience")} isEditing={isEditing} />
                          <ProfileField label="Role" icon={<FiBriefcase />} value={exp.role} onChange={(e) => handleArrayChange(idx, "role", e.target.value, "experience")} isEditing={isEditing} />
                          <ProfileField label="Duration" icon={<FiBriefcase />} value={exp.duration} onChange={(e) => handleArrayChange(idx, "duration", e.target.value, "experience")} isEditing={isEditing} placeholder="e.g. 2021 - Present" />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Education</h3>
                    {isEditing && <button type="button" onClick={() => addArrayItem("education", { institution: "", degree: "", year: "" })} style={{ fontSize: "0.85rem", fontWeight: 700, color: "white", backgroundColor: "#0f172a", border: "none", padding: "0.4rem 1rem", borderRadius: "8px", cursor: "pointer" }}>+ Add Education</button>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {formData.education.map((edu, idx) => (
                      <div key={idx} className="glass-card" style={{ padding: "1.5rem", backgroundColor: "#f8fafc", position: "relative" }}>
                        {isEditing && <FiX style={{ position: "absolute", top: "1rem", right: "1rem", cursor: "pointer", color: "#ef4444" }} onClick={() => removeArrayItem("education", idx)} />}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                          <ProfileField label="Institution" icon={<FiGlobe />} value={edu.institution} onChange={(e) => handleArrayChange(idx, "institution", e.target.value, "education")} isEditing={isEditing} />
                          <ProfileField label="Degree" icon={<FiBriefcase />} value={edu.degree} onChange={(e) => handleArrayChange(idx, "degree", e.target.value, "education")} isEditing={isEditing} />
                          <ProfileField label="Passing Year" icon={<FiBriefcase />} value={edu.year} onChange={(e) => handleArrayChange(idx, "year", e.target.value, "education")} isEditing={isEditing} />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
             </>
           )}

           {user?.role === "Employer" && (
             <>
               <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>Company Identity</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                     <ProfileField label="Company Legal Name" icon={<FiBriefcase />} name="companyLegalName" value={formData.companyLegalName} onChange={handleChange} isEditing={isEditing} placeholder="e.g. TechFlow Solutions Pvt Ltd" />
                     <ProfileField label="Official Company Email" icon={<FiMail />} name="officialCompanyEmail" value={formData.officialCompanyEmail} onChange={handleChange} isEditing={isEditing} placeholder="hr@company.com" />
                     <ProfileField label="Company Website" icon={<FiGlobe />} name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} isEditing={isEditing} placeholder="https://company.com" />
                     <ProfileSelect label="Industry Type" name="industryType" value={formData.industryType} onChange={handleChange} isEditing={isEditing} options={["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Other"]} />
                     <ProfileSelect label="Company Size" name="companySize" value={formData.companySize} onChange={handleChange} isEditing={isEditing} options={["1-10", "11-50", "51-200", "201-500", "500+"]} />
                     <ProfileField label="Year of Establishment" icon={<FiBriefcase />} name="yearOfEstablishment" value={formData.yearOfEstablishment} onChange={handleChange} isEditing={isEditing} placeholder="e.g. 2015" />
                  </div>
               </div>

               <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>Registration Details</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                     <ProfileField label="Registration Number (CIN)" icon={<FiShield />} name="companyRegistrationNumber_CIN" value={formData.companyRegistrationNumber_CIN} onChange={handleChange} isEditing={isEditing} placeholder="U12345DL2023PTC123456" />
                     <ProfileField label="GST Number (Optional)" icon={<FiShield />} name="gstNumber" value={formData.gstNumber} onChange={handleChange} isEditing={isEditing} placeholder="29AAAAA0000A1Z5" />
                  </div>
               </div>

               <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>Office Address</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                     <ProfileField label="Street / Area" icon={<FiMapPin />} name="street" value={formData.officeAddress.street} onChange={handleOfficeAddressChange} isEditing={isEditing} />
                     <ProfileField label="City" icon={<FiMapPin />} name="city" value={formData.officeAddress.city} onChange={handleOfficeAddressChange} isEditing={isEditing} />
                     <ProfileField label="State" icon={<FiMapPin />} name="state" value={formData.officeAddress.state} onChange={handleOfficeAddressChange} isEditing={isEditing} />
                     <ProfileField label="Pincode" icon={<FiMapPin />} name="pincode" value={formData.officeAddress.pincode} onChange={handleOfficeAddressChange} isEditing={isEditing} />
                  </div>
               </div>

               <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>Recruiter Details</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                     <ProfileField label="Recruiter Full Name" icon={<FiUser />} name="recruiterFullName" value={formData.recruiterFullName} onChange={handleChange} isEditing={isEditing} />
                     <ProfileField label="Work Email" icon={<FiMail />} name="recruiterWorkEmail" value={formData.recruiterWorkEmail} onChange={handleChange} isEditing={isEditing} placeholder="name@company.com" />
                     <ProfileField label="Work Phone" icon={<FiPhone />} name="recruiterPhoneNumber" value={formData.recruiterPhoneNumber} onChange={handleChange} isEditing={isEditing} />
                     <ProfileField label="LinkedIn Profile" icon={<FiLinkedin />} name="recruiterLinkedInURL" value={formData.recruiterLinkedInURL} onChange={handleChange} isEditing={isEditing} />
                  </div>
               </div>

               <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>Identity Verification Docs</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                     <DocumentUpload label="Registration Certificate" field="companyRegistrationCertificate" file={documentFiles.companyRegistrationCertificate} existing={user?.documents?.companyRegistrationCertificate?.url} onChange={handleDocumentChange} isEditing={isEditing} />
                     <DocumentUpload label="GST Certificate (Opt)" field="gstCertificate" file={documentFiles.gstCertificate} existing={user?.documents?.gstCertificate?.url} onChange={handleDocumentChange} isEditing={isEditing} />
                     <DocumentUpload label="Office Address Proof" field="officeAddressProof" file={documentFiles.officeAddressProof} existing={user?.documents?.officeAddressProof?.url} onChange={handleDocumentChange} isEditing={isEditing} />
                     <DocumentUpload label="Recruiter ID Proof (Opt)" field="recruiterIdProof" file={documentFiles.recruiterIdProof} existing={user?.documents?.recruiterIdProof?.url} onChange={handleDocumentChange} isEditing={isEditing} />
                  </div>
               </div>
             </>
           )}

           <div style={{ marginTop: "1.5rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>Professional Summary / Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                placeholder={user?.role === "Employer" ? "Tell candidates about your company hiring philosophy..." : "Briefly describe your professional journey..."}
                style={{ 
                  width: "100%", 
                  padding: "1rem", 
                  borderRadius: "12px", 
                  border: isEditing ? "1.5px solid var(--primary)" : "1.5px solid #f1f5f9",
                  backgroundColor: isEditing ? "white" : "#f8fafc",
                  outline: "none",
                  resize: "none",
                  fontSize: "0.95rem"
                }}
              />
           </div>

           {isEditing && (
             <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "3rem" }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: "0.9rem 2rem", borderRadius: "12px", border: "none", backgroundColor: "#f1f5f9", color: "#64748b", fontWeight: 700, cursor: "pointer" }}><FiX /> Cancel</button>
                <button type="submit" style={{ padding: "0.9rem 3rem", borderRadius: "12px", border: "none", backgroundColor: "var(--primary)", color: "white", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 15px rgba(79, 70, 229, 0.3)" }}><FiSave /> Update Profile</button>
             </div>
           )}
        </div>
      </form>
    </div>
  );
};

const ProfileField = ({ label, icon, name, value, onChange, isEditing, placeholder, disabled }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
    <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>{label}</label>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: "50%", left: "1rem", transform: "translateY(-50%)", color: "#64748b" }}>{icon}</div>
      <input 
        type="text" 
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing || disabled}
        placeholder={placeholder}
        style={{ 
          width: "100%", 
          padding: "0.8rem 1rem 0.8rem 2.8rem", 
          borderRadius: "12px", 
          border: isEditing && !disabled ? "1.5px solid var(--primary)" : "1.5px solid #f1f5f9",
          backgroundColor: isEditing && !disabled ? "white" : "#f8fafc",
          outline: "none",
          fontSize: "0.95rem",
          color: "#1e293b",
          fontWeight: 600
        }}
      />
    </div>
  </div>
);

const ProfileSelect = ({ label, name, value, onChange, isEditing, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
    <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>{label}</label>
    <select 
      name={name}
      value={value}
      onChange={onChange}
      disabled={!isEditing}
      style={{ 
        width: "100%", 
        padding: "0.8rem 1rem", 
        borderRadius: "12px", 
        border: isEditing ? "1.5px solid var(--primary)" : "1.5px solid #f1f5f9",
        backgroundColor: isEditing ? "white" : "#f8fafc",
        outline: "none",
        fontSize: "0.95rem",
        color: "#1e293b",
        fontWeight: 600
      }}
    >
      <option value="">Select {label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const DocumentUpload = ({ label, field, file, existing, onChange, isEditing }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
    <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>{label}</label>
    <div style={{ 
      border: "2px dashed #e2e8f0", 
      padding: "1rem", 
      borderRadius: "12px", 
      backgroundColor: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem"
    }}>
      {isEditing ? (
        <input type="file" onChange={(e) => onChange(e, field)} style={{ fontSize: "0.85rem" }} />
      ) : (
        existing ? (
          <a href={existing} target="_blank" rel="noreferrer" style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>View Uploaded Document</a>
        ) : (
          <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>No document uploaded</span>
        )
      )}
      {file && <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Selected: {file.name}</span>}
    </div>
  </div>
);

export default Profile;
