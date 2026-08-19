import React, { useContext, useState } from "react";
import { FiLock, FiMail, FiShield, FiArrowRight } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { isAuthorized, setIsAuthorized, setUser, user } = useContext(Context);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setUser(data.user);
      setIsAuthorized(true);
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized && user?.role === "Admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <section className="admin-login-page">
      <div className="login-container modern-glass">
        <div className="login-header">
           <div className="admin-badge">
              <FiShield size={24} />
              <span>Restricted Access</span>
           </div>
           <h1>Admin Portal</h1>
           <p>Sign in to manage the Recruitex ecosystem</p>
        </div>

        <form onSubmit={handleLogin} className="admin-form">
          <div className="input-group">
            <FiMail className="input-icon" />
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input 
              type="password" 
              placeholder="Access Key" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="admin-login-btn">
            {loading ? "Verifying..." : "Authorize Access"} <FiArrowRight />
          </button>
        </form>
      </div>

      <style>{`
        .admin-login-page { 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%);
          padding: 2rem;
        }
        .login-container {
          max-width: 450px;
          width: 100%;
          padding: 3.5rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          text-align: center;
          color: white;
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          padding: 0.5rem 1.25rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 2rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .login-header h1 { font-size: 2.2rem; font-weight: 900; margin-bottom: 0.5rem; letter-spacing: -1px; }
        .login-header p { color: #94a3b8; margin-bottom: 3rem; font-size: 1rem; }
        
        .admin-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .input-group { position: relative; }
        .input-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 1.2rem; }
        .input-group input {
          width: 100%;
          padding: 1.2rem 1.2rem 1.2rem 3.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: 0.3s;
        }
        .input-group input:focus { border-color: #6366f1; background: rgba(255, 255, 255, 0.08); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2); }
        
        .admin-login-btn {
          margin-top: 1rem;
          padding: 1.2rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: 0.3s;
        }
        .admin-login-btn:hover { background: #4338ca; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(79, 70, 229, 0.4); }
        .admin-login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </section>
  );
};

export default AdminLogin;
