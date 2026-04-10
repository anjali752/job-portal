import React, { useContext, useState } from "react";
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiEdit2, FiBriefcase } from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!role) return toast.error("Please select a role");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/register`,
        { name, phone, email, role, password },
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Start your journey</h2>
            <p style={{ color: '#64748b' }}>Join thousands of companies and job seekers today.</p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Role Selection */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { label: 'Candidate', val: 'Job Seeker', icon: <FiUser /> },
                { label: 'Employer', val: 'Employer', icon: <FiBriefcase /> }
              ].map((item) => (
                <div 
                  key={item.val}
                  onClick={() => setRole(item.val)}
                  style={{ 
                    flex: 1, 
                    padding: '1.25rem', 
                    borderRadius: '16px', 
                    border: `2px solid ${role === item.val ? '#4f46e5' : '#e2e8f0'}`,
                    backgroundColor: role === item.val ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', color: role === item.val ? '#4f46e5' : '#64748b' }}>{item.icon}</div>
                  <span style={{ fontWeight: 700, color: role === item.val ? '#4f46e5' : '#0f172a', fontSize: '0.9rem' }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div style={{ position: 'relative' }}>
              <FiEdit2 style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', outlineColor: '#4f46e5' }}
              />
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
              <FiPhone style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Phone Number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', outlineColor: '#4f46e5' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Create Password" 
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
                cursor: 'pointer',
                marginTop: '1rem' 
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Decorative Side */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#4f46e5', 
        backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        display: window.innerWidth > 1024 ? 'flex' : 'none',
        alignItems: 'center',
        padding: '5rem',
        color: 'white'
      }}>
        <div>
           <h2 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem' }}>
             Start building your <span style={{ color: '#c7d2fe' }}>future</span> today.
           </h2>
           <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.6 }}>
             Join HireStream and get access to exclusive opportunities and top-tier talent.
           </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
