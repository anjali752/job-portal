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
      <aside
        className={`sk-sidebar ${sidebarOpen ? 'sk-open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 300,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div className="sk-logo-area">
          <div className="sk-logo-icon">RX</div>
          <div>
            <div className="sk-brand-name">
              Recruite<span style={{ color: '#818cf8' }}>X</span>
            </div>
            <div className="sk-brand-sub">Dream Finder</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sk-nav">
          {visibleLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={`sk-nav-link ${isActive ? 'sk-active' : ''}`}
              >
                <span className="sk-nav-icon">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: User + Logout */}
        <div className="sk-bottom">
          <div className="sk-user-card">
            <div className="sk-user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p className="sk-user-name">{user?.name || 'Job Seeker'}</p>
              <p className="sk-user-role">Job Seeker</p>
            </div>
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="sk-logout">
            <FiLogOut className="sk-logout-icon" />
            <span>Logout</span>
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

        /* ═══════════════════════════════════════════
           SIDEBAR — DESKTOP (default)
           ═══════════════════════════════════════════ */
        .sk-sidebar {
          width: 280px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sk-logo-area {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1.75rem 1.5rem 1.5rem;
          flex-shrink: 0;
        }
        .sk-logo-icon {
          width: 54px; height: 54px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #4f46e5, #4338ca);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 900; font-size: 1.4rem;
          letter-spacing: -1px;
          box-shadow: 0 8px 16px -4px rgba(79,70,229,0.5);
        }
        .sk-brand-name {
          font-size: 1.8rem; font-weight: 950; color: white;
          letter-spacing: -1.5px; line-height: 1;
        }
        .sk-brand-sub {
          font-size: 0.65rem; font-weight: 800; color: #64748b;
          letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px;
        }
        .sk-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 0.5rem 0; margin-top: 0.5rem;
        }
        .sk-nav-link {
          display: flex; align-items: center;
          gap: 1rem;
          margin: 0.2rem 1rem;
          padding: 0.9rem 1.25rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600; font-size: 0.9rem;
          color: #94a3b8;
          background-color: transparent;
          border-left: 3px solid transparent;
          transition: all 0.15s;
        }
        .sk-nav-link.sk-active {
          color: #fff;
          background-color: rgba(79,70,229,0.18);
          border-left-color: #818cf8;
        }
        .sk-nav-icon {
          font-size: 1.3rem; color: #4b5563; flex-shrink: 0;
        }
        .sk-active .sk-nav-icon { color: #818cf8; }
        .sk-bottom {
          flex-shrink: 0;
          padding: 0.5rem 1rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .sk-user-card {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.7rem; border-radius: 10px;
          background: rgba(79,70,229,0.08);
          margin-bottom: 0.4rem;
        }
        .sk-user-avatar {
          width: 36px; height: 36px; flex-shrink: 0;
          background: #4f46e5; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 800; font-size: 0.9rem;
        }
        .sk-user-name {
          color: #e2e8f0; font-weight: 700; font-size: 0.85rem;
          margin: 0; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .sk-user-role {
          color: #4b5563; font-size: 0.68rem; margin: 0;
        }
        .sk-logout {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.9rem 1.25rem; border-radius: 10px;
          color: #f87171; text-decoration: none;
          font-weight: 700; font-size: 0.9rem;
          transition: 0.2s;
        }
        .sk-logout-icon { font-size: 1.3rem; flex-shrink: 0; }

        /* ═══════════════════════════════════════════
           SIDEBAR — MOBILE (≤1024px)
           ═══════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .sk-sidebar {
            width: 260px;
            transform: translateX(-280px);
            box-shadow: none;
          }
          .sk-sidebar.sk-open {
            transform: translateX(0);
            box-shadow: 8px 0 32px rgba(0,0,0,0.4);
          }
          .sk-logo-area {
            gap: 0.6rem;
            padding: 0.85rem 0.85rem 0.75rem;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .sk-logo-icon {
            width: 36px; height: 36px;
            border-radius: 9px;
            font-size: 0.85rem;
            box-shadow: 0 3px 8px -2px rgba(79,70,229,0.4);
          }
          .sk-brand-name {
            font-size: 1.1rem;
            letter-spacing: -0.5px;
          }
          .sk-brand-sub {
            font-size: 0.48rem;
          }
          .sk-nav {
            padding: 0.25rem 0;
            margin-top: 0.1rem;
          }
          .sk-nav-link {
            gap: 0.65rem;
            margin: 1px 0.5rem;
            padding: 0.55rem 0.75rem;
            border-radius: 9px;
            font-size: 0.82rem;
          }
          .sk-nav-icon {
            font-size: 1rem;
          }
          .sk-bottom {
            padding: 0.5rem 0.5rem 0.7rem;
          }
          .sk-user-card {
            padding: 0.5rem;
          }
          .sk-user-avatar {
            width: 30px; height: 30px;
            font-size: 0.75rem;
          }
          .sk-user-name { font-size: 0.75rem; }
          .sk-user-role { font-size: 0.55rem; }
          .sk-logout {
            gap: 0.6rem;
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
          }
          .sk-logout-icon { font-size: 0.95rem; }
        }

        /* Desktop: ensure sidebar always visible */
        @media (min-width: 1025px) {
          .sk-sidebar {
            transform: translateX(0) !important;
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
