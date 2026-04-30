import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../main";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthorized, user } = useContext(Context);

  const { pathname } = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const navBg = isAuthPage
    ? "white"
    : isScrolled ? "rgba(255, 255, 255, 0.97)" : "rgba(255, 255, 255, 0.05)";

  const textColor = (!isScrolled && !isAuthPage) ? "#0f172a" : "#0f172a";

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        backgroundColor: navBg,
        backdropFilter: isAuthPage ? "none" : "blur(12px)",
        borderBottom: (isScrolled || isAuthPage) ? "1px solid #e2e8f0" : "none",
        transition: "all 0.3s ease",
        padding: "0.75rem 1.5rem",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "32px", height: "32px",
              backgroundColor: "#4f46e5", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: "bold", flexShrink: 0,
            }}>RX</div>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: textColor, letterSpacing: "-0.5px" }}>
              Recruite<span style={{ color: "#4f46e5" }}>X</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            <a href="/#howitworks" style={{ textDecoration: "none", color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}>How it Works</a>
            <a href="/#categories" style={{ textDecoration: "none", color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}>Categories</a>
            <Link to="/job/getall" style={{ textDecoration: "none", color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}>Explore Jobs</Link>
          </div>

          {/* Desktop Auth Actions */}
          <div className="nav-auth-desktop" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {!isAuthorized ? (
              <>
                <Link to="/login" style={{ textDecoration: "none", color: "#0f172a", fontWeight: 700, fontSize: "0.95rem", padding: "0.5rem 1rem" }}>
                  Log in
                </Link>
                <Link to="/register" style={{
                  textDecoration: "none", backgroundColor: "#0f172a", color: "white",
                  padding: "0.75rem 1.5rem", borderRadius: "10px", fontWeight: 700,
                  fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  Join Now <FiArrowRight />
                </Link>
              </>
            ) : (
              <Link to={user?.role === "Employer" ? "/recruiter/dashboard" : "/seeker/dashboard"} style={{
                textDecoration: "none", backgroundColor: "#4f46e5", color: "white",
                padding: "0.75rem 1.5rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.95rem",
              }}>
                My Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "none", border: "none", cursor: "pointer",
              color: "#0f172a", padding: "0.25rem", zIndex: 1001,
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* Responsive styles */}
        <style>{`
          @media (max-width: 768px) {
            .nav-links-desktop, .nav-auth-desktop { display: none !important; }
            .mobile-menu-toggle { display: flex !important; align-items: center; justify-content: center; }
          }
        `}</style>
      </nav>

      {/* Mobile Full-Screen Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 998,
          backgroundColor: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "2rem",
        }}>
          {/* Close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "absolute", top: "1.25rem", right: "1.5rem",
              background: "none", border: "none", cursor: "pointer", color: "#0f172a",
            }}
          >
            <FiX size={28} />
          </button>

          {/* Nav links */}
          {[
            { label: "How it Works", href: "/#howitworks" },
            { label: "Categories", href: "/#categories" },
            { label: "Explore Jobs", href: "/job/getall" },
          ].map(link => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: "1.75rem", fontWeight: 800, color: "#0f172a",
                textDecoration: "none", letterSpacing: "-0.5px",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ borderTop: "1px solid #e2e8f0", width: "80%", paddingTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            {!isAuthorized ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", textDecoration: "none" }}
                >
                  Log in
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                  style={{
                    backgroundColor: "#4f46e5", color: "white", padding: "1rem 2.5rem",
                    borderRadius: "12px", fontWeight: 700, fontSize: "1.1rem",
                    textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem",
                  }}
                >
                  Join Now <FiArrowRight />
                </Link>
              </>
            ) : (
              <Link
                to={user?.role === "Employer" ? "/recruiter/dashboard" : "/seeker/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  backgroundColor: "#4f46e5", color: "white", padding: "1rem 2.5rem",
                  borderRadius: "12px", fontWeight: 700, fontSize: "1.1rem", textDecoration: "none",
                }}
              >
                My Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;