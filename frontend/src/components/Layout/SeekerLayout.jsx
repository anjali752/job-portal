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

      {/* Sidebar - All critical styles are INLINE to prevent any CSS conflicts */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100%',
          backgroundColor: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 300,
          transform: isMobile && !sidebarOpen ? 'translateX(-280px)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: sidebarOpen && isMobile ? '8px 0 32px rgba(0,0,0,0.4)' : 'none',
          overflow: 'hidden',
        }}
      >
        {/* ── TOP: Logo Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: '1.75rem 1.5rem 1.5rem',
          flexShrink: 0,
        }}>
          {/* RX Icon - matches Image 1 size */}
          <div style={{
            width: '54px', height: '54px', flexShrink: 0,
            background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 900, fontSize: '1.4rem',
            letterSpacing: '-1px',
            boxShadow: '0 8px 16px -4px rgba(79,70,229,0.5)',
          }}>RX</div>
          {/* Brand Name */}
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 950, color: 'white', letterSpacing: '-1.5px', lineHeight: 1 }}>
              Recruite<span style={{ color: 'var(--primary, #4f46e5)' }}>X</span>
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px' }}>
              Dream Finder
            </div>
          </div>
        </div>

        {/* ── MIDDLE: Navigation ── */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0.5rem 0', marginTop: '0.5rem' }}>
          {visibleLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => isMobile && setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  margin: '0.2rem 1rem',
                  padding: '0.9rem 1.25rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive ? '#fff' : '#94a3b8',
                  backgroundColor: isActive ? 'rgba(79,70,229,0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary, #4f46e5)' : '3px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.3rem', color: isActive ? 'var(--primary, #4f46e5)' : '#64748b', flexShrink: 0 }}>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── BOTTOM: Logout only (matches Image 1) ── */}
        <div style={{ flexShrink: 0, padding: '0.5rem 1rem 1.5rem' }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.9rem 1.25rem', borderRadius: '12px',
              color: '#f87171', textDecoration: 'none',
              fontWeight: 700, fontSize: '0.9rem',
              transition: '0.2s',
            }}
          >
            <FiLogOut style={{ fontSize: '1.3rem', flexShrink: 0 }} />
            <span>Logout Account</span>
          </a>
        </div>
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

        /* ── Sidebar Base ── */
        .dashboard-sidebar {
          width: 280px;
          height: 100vh;
          background-color: #0f172a;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 200;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          overflow: hidden;
        }

        /* Desktop: always visible */
        @media (min-width: 1025px) {
          .dashboard-sidebar {
            transform: translateX(0) !important;
          }
        }

        /* Mobile: slide in/out with transform */
        @media (max-width: 1024px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
            box-shadow: 4px 0 30px rgba(0,0,0,0.3);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
        }

        .dashboard-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .dashboard-header {
          height: 70px;
          background-color: rgba(255, 255, 255, 0.9);
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
          background-color: #4f46e5;
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
