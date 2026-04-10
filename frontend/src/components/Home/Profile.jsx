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
    companyWebsite: user?.companyWebsite || "",
    linkedInProfile: user?.linkedInProfile || "",
    bio: user?.bio || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        jobTitle: user.jobTitle || "",
        companyName: user.companyName || "",
        companyWebsite: user.companyWebsite || "",
        linkedInProfile: user.linkedInProfile || "",
        bio: user.bio || "",
        address: user.address || "",
      });
      setAvatarPreview(user?.avatar?.url || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        myForm.append(key, formData[key]);
      });
      
      if (avatar) {
        myForm.append("avatar", avatar);
      }

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
    <div className="profile-page" style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
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
              padding: "0.8rem 1.5rem", 
              backgroundColor: "#0f172a", 
              color: "white", 
              border: "none", 
              borderRadius: "12px", 
              fontWeight: 700, 
              cursor: "pointer",
              transition: "0.2s"
            }}>
            <FiEdit2 /> Edit details
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "3rem" }}>
        {/* Left Column - Avatar and Badges */}
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
                  backgroundColor: user?.role === "Employer" ? "#ecfdf5" : "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "4rem", fontWeight: 900, color: user?.role === "Employer" ? "#10b981" : "#3b82f6" }}>
                      {user?.name?.charAt(0)}
                    </span>
                  )}
                </div>
                
                {isEditing && (
                  <label style={{ 
                    position: "absolute", 
                    bottom: "-10px", 
                    right: "-10px", 
                    width: "44px", 
                    height: "44px", 
                    borderRadius: "14px", 
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    border: "1px solid #e2e8f0"
                  }}>
                    <FiCamera size={20} color="#0f172a" />
                    <input type="file" onChange={handleAvatarChange} style={{ display: "none" }} accept="image/*" />
                  </label>
                )}
             </div>

             <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, textAlign: "center" }}>{user?.name}</h2>
             <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.75rem", borderRadius: "20px", backgroundColor: "#f1f5f9", color: "#64748b", textTransform: "uppercase" }}>
                   {user?.role}
                </span>
                {user?.isVerified && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 800, color: "#10b981", backgroundColor: "#dcfce7", padding: "0.25rem 0.75rem", borderRadius: "20px" }}>
                    <FiCheckCircle /> VERIFIED
                  </span>
                )}
             </div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem", borderLeft: user?.isVerified ? "4px solid #10b981" : "4px solid #f59e0b" }}>
             <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiShield color={user?.isVerified ? "#10b981" : "#f59e0b"} /> Trust Score
             </h4>
             <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.5rem", lineHeight: 1.5 }}>
               {user?.isVerified 
                 ? "Your account is fully authenticated. Candidates see you as a trusted recruiter." 
                 : "Complete all fields to earn the verified badge and increase applicant trust."}
             </p>
          </div>
        </div>

        {/* Right Column - Fields */}
        <div className="glass-card" style={{ padding: "2.5rem" }}>
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <ProfileField label="Full Name" icon={<FiUser />} name="name" value={formData.name} onChange={handleChange} isEditing={isEditing} />
              <ProfileField label="Email Address" icon={<FiMail />} name="email" value={formData.email} isEditing={false} disabled />
              <ProfileField label="Phone Number" icon={<FiPhone />} name="phone" value={formData.phone} onChange={handleChange} isEditing={isEditing} />
              <ProfileField label={user?.role === "Employer" ? "Professional Title" : "Job Preference"} icon={<FiBriefcase />} name="jobTitle" value={formData.jobTitle} onChange={handleChange} isEditing={isEditing} placeholder="e.g. Talent Acquisition Lead" />
           </div>

           {user?.role === "Employer" && (
             <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>Company Authentication</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                   <ProfileField label="Company Name" icon={<FiShield />} name="companyName" value={formData.companyName} onChange={handleChange} isEditing={isEditing} placeholder="e.g. TechFlow Solutions" />
                   <ProfileField label="Website URL" icon={<FiGlobe />} name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} isEditing={isEditing} placeholder="https://company.com" />
                   <ProfileField label="LinkedIn Profile" icon={<FiLinkedin />} name="linkedInProfile" value={formData.linkedInProfile} onChange={handleChange} isEditing={isEditing} placeholder="linkedin.com/in/username" />
                   <ProfileField label="Office Location" icon={<FiMapPin />} name="address" value={formData.address} onChange={handleChange} isEditing={isEditing} placeholder="City, Country" />
                </div>
             </div>
           )}

           <div style={{ marginTop: "1.5rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>Professional Summary / Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell candidates about your hiring philosophy..."
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
             <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2.5rem" }}>
                <button type="button" onClick={() => setIsEditing(false)} className="secondary-btn" style={{ padding: "0.8rem 1.5rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem" }}><FiX /> Cancel</button>
                <button type="submit" className="primary-btn" style={{ padding: "0.8rem 2.5rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem" }}><FiSave /> Save Profile</button>
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

export default Profile;
