import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiUsers, 
  FiBriefcase, 
  FiFileText, 
  FiTrash2, 
  FiPieChart, 
  FiSearch,
  FiMoreVertical,
  FiCheckCircle,
  FiAlertCircle,
  FiLogOut
} from "react-icons/fi";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalSeekers: 0, totalEmployers: 0, totalJobs: 0, totalApplications: 0 });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  const { setIsAuthorized, setUser } = React.useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, jobsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/admin/jobs`, { withCredentials: true })
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
        setJobs(jobsRes.data.jobs);
      } catch (error) {
        toast.error("Failed to load administrative data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action is irreversible.")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/user/delete/${id}`, { withCredentials: true });
      toast.success("User removed successfully");
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/logout`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setIsAuthorized(false);
      setUser(null);
      navigate("/admin");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (loading) return <div className="admin-loader">Loading Admin Ecosystem...</div>;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
           <h2>RX ADMIN</h2>
        </div>
        <nav className="admin-nav">
          <button onClick={() => setActiveTab("overview")} className={activeTab === "overview" ? "active" : ""}>
            <FiPieChart /> Overview
          </button>
          <button onClick={() => setActiveTab("users")} className={activeTab === "users" ? "active" : ""}>
            <FiUsers /> User Management
          </button>
          <button onClick={() => setActiveTab("jobs")} className={activeTab === "jobs" ? "active" : ""}>
            <FiBriefcase /> Job Inventory
          </button>
          
          <div className="sidebar-divider"></div>
          
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Sign Out
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
           <div className="header-search">
              <FiSearch />
              <input type="text" placeholder="Global system search..." />
           </div>
           <div className="admin-profile">
              <span>System Administrator</span>
              <div className="avatar">A</div>
           </div>
        </header>

        <div className="admin-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
               <div className="stats-grid">
                  <StatCard title="Job Seekers" value={stats.totalSeekers} icon={<FiUsers />} color="#4f46e5" />
                  <StatCard title="Recruiters" value={stats.totalEmployers} icon={<FiBriefcase />} color="#10b981" />
                  <StatCard title="Live Jobs" value={stats.totalJobs} icon={<FiFileText />} color="#f59e0b" />
                  <StatCard title="Applications" value={stats.totalApplications} icon={<FiCheckCircle />} color="#3b82f6" />
               </div>
               
               <div className="recent-activity modern-glass">
                  <h3>System Integrity Status</h3>
                  <div className="status-row">
                     <FiCheckCircle color="#10b981" />
                     <span>Database Connection: Optimal</span>
                  </div>
                  <div className="status-row">
                     <FiCheckCircle color="#10b981" />
                     <span>API Latency: 24ms</span>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="management-tab modern-glass">
               <div className="table-header">
                  <h3>Registered Users</h3>
                  <p>Management portal for all seekers and employers</p>
               </div>
               <table className="admin-table">
                  <thead>
                     <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {users.map(user => (
                        <tr key={user._id}>
                           <td className="user-info">
                              <div className="sm-avatar">{user.name.charAt(0)}</div>
                              {user.name}
                           </td>
                           <td>{user.email}</td>
                           <td><span className={`role-badge ${user.role.replace(" ", "-")}`}>{user.role}</span></td>
                           <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                           <td>
                              <button onClick={() => handleDeleteUser(user._id)} className="delete-btn">
                                 <FiTrash2 />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="management-tab modern-glass">
               <div className="table-header">
                  <h3>Job Inventory</h3>
                  <p>Monitoring all active and expired listings</p>
               </div>
               <table className="admin-table">
                  <thead>
                     <tr>
                        <th>Title</th>
                        <th>Posted By</th>
                        <th>Category</th>
                        <th>Salary</th>
                        <th>Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {jobs.map(job => (
                        <tr key={job._id}>
                           <td style={{ fontWeight: 700 }}>{job.title}</td>
                           <td>{job.postedBy?.name || "Deleted User"}</td>
                           <td>{job.category}</td>
                           <td>{job.fixedSalary ? `₹${job.fixedSalary}` : `Range`}</td>
                           <td>
                              <span className={`status-badge ${job.expired ? "expired" : "active"}`}>
                                 {job.expired ? "Expired" : "Live"}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .admin-dashboard { display: flex; min-height: 100vh; background: #f8fafc; }
        .admin-sidebar { width: 280px; background: #0f172a; color: white; padding: 2rem; position: fixed; height: 100vh; }
        .sidebar-logo h2 { font-size: 1.5rem; font-weight: 900; color: #4f46e5; margin-bottom: 3rem; letter-spacing: 2px; }
        .admin-nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .admin-nav button {
          display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px;
          background: transparent; border: none; color: #94a3b8; font-weight: 700; cursor: pointer; transition: 0.3s; width: 100%;
        }
        .admin-nav button:hover, .admin-nav button.active { background: #1e293b; color: white; }
        .admin-nav button.active { background: #4f46e5; }
        
        .sidebar-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 1.5rem 0; }
        .logout-btn { 
          margin-top: auto; color: #f87171 !important; 
        }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.1) !important; color: #ef4444 !important; }

        .admin-main { flex: 1; margin-left: 280px; padding: 2rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; background: white; padding: 1.5rem 2.5rem; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header-search { display: flex; align-items: center; gap: 1rem; background: #f1f5f9; padding: 0.75rem 1.5rem; border-radius: 12px; flex: 0.6; }
        .header-search input { border: none; background: transparent; outline: none; width: 100%; font-weight: 500; }
        .admin-profile { display: flex; align-items: center; gap: 1.5rem; }
        .admin-profile .avatar { width: 40px; height: 40px; border-radius: 50%; background: #4f46e5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; margin-bottom: 3rem; }
        .stat-card { background: white; padding: 2rem; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .stat-info span { font-size: 0.9rem; color: #64748b; font-weight: 700; }
        .stat-info h2 { font-size: 2rem; font-weight: 900; margin: 0.5rem 0 0 0; }
        .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }

        .modern-glass { background: white; border-radius: 24px; padding: 2.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .table-header { margin-bottom: 2rem; }
        .table-header h3 { font-size: 1.25rem; font-weight: 900; margin: 0; }
        .table-header p { color: #94a3b8; font-size: 0.9rem; margin-top: 0.25rem; }

        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 1rem; color: #64748b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f1f5f9; }
        .admin-table td { padding: 1.25rem 1rem; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b; font-size: 0.95rem; }
        .user-info { display: flex; align-items: center; gap: 1rem; }
        .sm-avatar { width: 32px; height: 32px; border-radius: 8px; background: #f1f5f9; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; }
        
        .role-badge { padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.75rem; font-weight: 800; }
        .role-badge.Job-Seeker { background: #eff6ff; color: #3b82f6; }
        .role-badge.Employer { background: #ecfdf5; color: #10b981; }

        .status-badge { padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.75rem; font-weight: 800; }
        .status-badge.active { background: #ecfdf5; color: #10b981; }
        .status-badge.expired { background: #fef2f2; color: #ef4444; }

        .delete-btn { width: 36px; height: 36px; border-radius: 10px; background: #fff5f5; color: #ef4444; border: none; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
        .delete-btn:hover { background: #ef4444; color: white; }

        .status-row { display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem; font-weight: 700; color: #1e293b; }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="stat-card">
     <div className="stat-info">
        <span>{title}</span>
        <h2>{value}</h2>
     </div>
     <div className="stat-icon" style={{ backgroundColor: color + "15", color }}>
        {icon}
     </div>
  </div>
);

export default AdminDashboard;
