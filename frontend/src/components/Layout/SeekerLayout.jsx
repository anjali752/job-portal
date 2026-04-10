import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FiHome, 
  FiBriefcase, 
  FiFileText, 
  FiMessageSquare, 
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";

const SeekerLayout = () => {
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
    { name: "Dashboard", path: "/seeker/dashboard", icon: <FiHome /> },
    { name: "My Profile", path: "/seeker/profile", icon: <FiFileText /> },
    { name: "Explore Jobs", path: "/seeker/jobs", icon: <FiBriefcase /> },
    { name: "My Applications", path: "/seeker/applications", icon: <FiFileText /> },
    { name: "Saved Jobs", path: "/seeker/saved", icon: <FiFileText /> },
    { name: "Resume Hub", path: "/seeker/resume", icon: <FiFileText /> },
    { name: "Messages", path: "/seeker/chat", icon: <FiMessageSquare /> },
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
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: 'var(--primary)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>RX</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Recruiter<span style={{ color: 'var(--primary)' }}>X</span></span>
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
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value;
                if(query) navigateTo(`/seeker/jobs?search=${query}`);
              }}
              className="search-bar" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                backgroundColor: '#f1f5f9', 
                padding: '0.5rem 1rem', 
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px'
              }}
            >
              <FiBriefcase size={18} color="#94a3b8" />
              <input 
                name="search"
                type="text" 
                placeholder="Search for jobs, companies..." 
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
                <FiMessageSquare size={22} color="var(--text-muted)" />
                <span style={{ 
                  position: 'absolute', 
                  top: '-5px', 
                  right: '-5px', 
                  backgroundColor: '#ef4444', 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%',
                  border: '2px solid #fff'
                }}></span>
             </div>

            <Link to="/seeker/profile" className="user-profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ textAlign: "right", display: window.innerWidth > 640 ? "block" : "none" }}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{user?.name || "Seeker"}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>Candidate Account</p>
              </div>
              <div className="avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
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

export default SeekerLayout;
