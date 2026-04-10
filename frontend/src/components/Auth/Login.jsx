import React, { useContext, useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiBriefcase } from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) return toast.error("Please select your role");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        { email, password, role },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setUser(data.user);
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) {
    if (user?.role === "Employer") return <Navigate to={'/recruiter/dashboard'} />;
    return <Navigate to={'/seeker/dashboard'} />;
  }

  return (
    <section style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc' }}>
      {/* Visual Side */}
      <div style={{ 
        flex: 1.2, 
        backgroundColor: '#0f172a', 
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: window.innerWidth > 1024 ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem',
        color: 'white'
      }}>
        <div style={{ maxWidth: '500px' }}>
           <h2 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem' }}>
             Welcome back to the <span style={{ color: '#4f46e5' }}>future</span> of work.
           </h2>
           <p style={{ fontSize: '1.25rem', opacity: 0.8, lineHeight: 1.6 }}>
             Log in to access your dashboard, track applications, and manage your hiring pipeline.
           </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Login</h2>
            <p style={{ color: '#64748b' }}>Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Role Selection */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
              {[
                { label: 'Candidate', val: 'Job Seeker', icon: <FiUser /> },
                { label: 'Employer', val: 'Employer', icon: <FiBriefcase /> }
              ].map((item) => (
                <div 
                  key={item.val}
                  onClick={() => setRole(item.val)}
                  style={{ 
                    flex: 1, 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: `2px solid ${role === item.val ? '#4f46e5' : '#e2e8f0'}`,
                    backgroundColor: role === item.val ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ fontSize: '1.25rem', color: role === item.val ? '#4f46e5' : '#64748b' }}>{item.icon}</div>
                  <span style={{ fontWeight: 700, color: role === item.val ? '#4f46e5' : '#0f172a', fontSize: '0.85rem' }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', outlineColor: '#4f46e5' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                style={{ width: '100%', padding: '1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', outlineColor: '#4f46e5' }}
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8' }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ color: '#4f46e5', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                backgroundColor: '#0f172a', 
                color: 'white', 
                borderRadius: '12px', 
                fontWeight: 700, 
                border: 'none', 
                cursor: 'pointer'
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              Don't have an account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
