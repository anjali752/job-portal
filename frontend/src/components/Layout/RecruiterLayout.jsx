import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FiHome, 
  FiPlusCircle, 
  FiList, 
  FiUsers, 
  FiLogOut,
  FiMenu,
  FiX,
  FiTrendingUp
} from "react-icons/fi";

const RecruiterLayout = () => {
  const { user, setIsAuthorized, setUser } = useContext(Context);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1"}/user/logout`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setUser({});
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logged out.");
    }
  };

  const navLinks = [
    { name: "Overview", path: "/recruiter/dashboard", icon: <FiHome /> },
    { name: "My Profile", path: "/recruiter/profile", icon: <FiUsers /> },
    { name: "Job Management", path: "/recruiter/jobs/manage", icon: <FiList /> },
    { name: "Applicants", path: "/recruiter/applications", icon: <FiUsers /> },
    { name: "Talent Search", path: "/recruiter/search", icon: <FiUsers /> },
    { name: "Analytics", path: "/recruiter/analytics", icon: <FiTrendingUp /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`} style={{ borderRightColor: "var(--primary)" }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 2rem' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#10b981', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>RX</div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', lineHeight: 1 }}>Recruiter<span style={{ color: '#10b981' }}>X</span></span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.5px' }}>FOR EMPLOYERS</span>
          </div>
        </div>
        
        <div style={{ padding: "0 1.5rem", marginBottom: "1rem", fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>
          Employer Portal
        </div>

        <nav className="sidebar-menu">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={location.pathname === link.path ? "active" : ""}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{marginTop: "auto"}}>
            <FiLogOut />
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            <div className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer', display: window.innerWidth <= 1024 ? 'block' : 'none' }}>
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </div>
            
            <div className="employer-status" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                backgroundColor: '#fef3c7', 
                color: '#d97706', 
                fontWeight: 800, 
                padding: '0.25rem 0.6rem', 
                borderRadius: '6px',
                letterSpacing: '0.5px'
              }}>PRO PLAN</span>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value;
                if(query) navigateTo(`/recruiter/search?query=${query}`);
              }}
              className="search-bar" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                backgroundColor: '#f1f5f9', 
                padding: '0.5rem 1rem', 
                borderRadius: '8px',
                marginLeft: '1rem',
                width: '100%',
                maxWidth: '400px'
              }}
            >
              <FiUsers size={18} color="#94a3b8" />
              <input 
                name="search"
                type="text" 
                placeholder="Search candidates, skills..." 
                style={{ 
                  border: 'none', 
                  background: 'none', 
                  outline: 'none', 
                  fontSize: '0.9rem',
                  width: '100%'
                }} 
              />
            </form>
          </div>
          
          <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div className="notifications" style={{ position: 'relative', cursor: 'pointer' }}>
                <FiUsers size={22} color="var(--text-muted)" />
                <span style={{ 
                   position: 'absolute', 
                   top: '-2px', 
                   right: '-1px', 
                   backgroundColor: '#10b981', 
                   width: '6px', 
                   height: '6px', 
                   borderRadius: '50%'
                }}></span>
             </div>

            <Link to="/recruiter/profile" className="user-profile" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ textAlign: "right", display: window.innerWidth > 640 ? "block" : "none" }}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{user?.name || "Employer"}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>HR Manager</p>
              </div>
              <div className="avatar" style={{ background: "#10b981", boxShadow: '0 0 0 2px #fff, 0 0 0 4px #10b981' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "E"}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
