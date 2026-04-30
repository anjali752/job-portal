import React, { useContext, useState, useEffect } from "react";
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
  FiX,
  FiSearch
} from "react-icons/fi";

// Hook to detect screen width reactively
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
};

const SeekerLayout = () => {
  const { user, setIsAuthorized, setUser } = useContext(Context);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigateTo = useNavigate();
  const width = useWindowWidth();
  
  const isMobile = width <= 1024;
  const isSmall = width <= 640;

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

  const isProfileComplete = user?.role === "Job Seeker" ? (
    user?.address && 
    user?.skills?.length > 0 && 
    user?.jobTitle && 
    user?.education?.length > 0
  ) : true;

  useEffect(() => {
    if (user?.role === "Job Seeker" && !isProfileComplete && location.pathname !== "/seeker/profile") {
      toast.error("Please complete your profile to access all features!");
      navigateTo("/seeker/profile");
    }
  }, [user, location.pathname, isProfileComplete]);

  const navLinks = [
    { name: "My Profile", path: "/seeker/profile", icon: <FiFileText /> },
    { name: "Dashboard", path: "/seeker/dashboard", icon: <FiHome />, hidden: !isProfileComplete },
    { name: "Explore Jobs", path: "/seeker/jobs", icon: <FiBriefcase />, hidden: !isProfileComplete },
    { name: "My Applications", path: "/seeker/applications", icon: <FiFileText />, hidden: !isProfileComplete },
    { name: "Saved Jobs", path: "/seeker/saved", icon: <FiFileText />, hidden: !isProfileComplete },
    { name: "Resume Hub", path: "/seeker/resume", icon: <FiFileText />, hidden: !isProfileComplete },
    { name: "Messages", path: "/seeker/messages", icon: <FiMessageSquare />, hidden: !isProfileComplete },
  ];

  const visibleLinks = navLinks.filter(link => !link.hidden);

  return (
    <div className={`dashboard-layout ${isMobile ? 'mobile-mode' : ''}`}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
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
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`} style={{
        left: isMobile && !sidebarOpen ? '-280px' : '0',
        transition: 'all 0.3s ease',
        backgroundColor: '#0f172a',
        borderRight: 'none',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 1.5rem 0 1.5rem' }}>
          <div style={{ 
            width: '54px', 
            height: '54px', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)', 
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 900,
            fontSize: '1.6rem',
            boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)'
          }}>RX</div>
          <div>
            <span style={{ fontSize: '1.8rem', fontWeight: 950, color: 'white', display: 'block', lineHeight: 1, letterSpacing: '-1.5px' }}>Recruite<span style={{ color: 'var(--primary)' }}>X</span></span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', letterSpacing: '1.5px', marginTop: '2px', display: 'block', textTransform: 'uppercase' }}>Dream Finder</span>
          </div>
        </div>
        
        <nav className="sidebar-menu" style={{ marginTop: '1rem', flex: 1 }}>
          {visibleLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={location.pathname === link.path ? "active" : ""}
              onClick={() => isMobile && setSidebarOpen(false)}
              style={{
                margin: '0.2rem 1rem',
                padding: '0.9rem 1.25rem',
                fontSize: '0.9rem',
                borderRadius: '12px',
                color: location.pathname === link.path ? 'white' : '#94a3b8',
                backgroundColor: location.pathname === link.path ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                textDecoration: 'none',
                fontWeight: 600,
                transition: '0.2s',
                borderLeft: location.pathname === link.path ? '3px solid var(--primary)' : '3px solid transparent'
              }}
            >
              <span style={{ fontSize: '1.3rem', color: location.pathname === link.path ? 'var(--primary)' : '#64748b' }}>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
          
          <div style={{ marginTop: 'auto', padding: '1rem' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.9rem 1.25rem',
              borderRadius: '12px',
              color: '#f87171',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: '0.2s'
            }}>
              <FiLogOut style={{ fontSize: '1.3rem' }} />
              <span>Logout Account</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-content" style={{ marginLeft: isMobile ? '0' : '280px' }}>
        {/* Top Header */}
        <header className="dashboard-header" style={{ left: isMobile ? '0' : '280px' }}>
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '1rem' : '1.5rem', flex: 1 }}>
            {isMobile && (
              <div className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer' }}>
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </div>
            )}
            
            {!isSmall && (
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
                <FiSearch size={18} color="#94a3b8" />
                <input 
                  name="search"
                  type="text" 
                  placeholder="Search for jobs..." 
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    outline: 'none', 
                    fontSize: '0.9rem',
                    width: '100%'
                  }} 
                />
              </form>
            )}
          </div>
          
          <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '1rem' : '1.5rem' }}>
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

            <Link to="/seeker/profile" className="user-profile" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {!isSmall && (
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{user?.name || "Seeker"}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>Candidate</p>
                </div>
              )}
              <div className="avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-main" style={{ padding: isSmall ? '1rem' : '2rem', marginTop: '70px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .dashboard-layout {
          min-height: 100vh;
          background-color: #f8fafc;
          display: flex;
        }
        .dashboard-sidebar {
          width: 280px;
          height: 100vh;
          background-color: white;
          border-right: 1px solid #e2e8f0;
          position: fixed;
          top: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          padding: 2rem 0;
        }
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0 1rem;
          margin-top: 2rem;
          flex: 1;
        }
        .sidebar-menu a {
          display: flex;
          alignItems: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          color: #64748b;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }
        .sidebar-menu a:hover, .sidebar-menu a.active {
          background-color: #eef2ff;
          color: var(--primary);
        }
        .sidebar-menu a svg {
          font-size: 1.25rem;
        }
        .dashboard-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .dashboard-header {
          height: 70px;
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          position: fixed;
          top: 0;
          right: 0;
          z-index: 90;
          transition: left 0.3s ease;
        }
        .avatar {
          width: 40px;
          height: 40px;
          background-color: var(--primary);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SeekerLayout;
