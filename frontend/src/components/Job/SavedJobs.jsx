import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Context } from "../../main";
import { 
  FiMapPin, 
  FiBriefcase, 
  FiDollarSign, 
  FiTrash2, 
  FiExternalLink, 
  FiHeart,
  FiArrowRight
} from "react-icons/fi";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/saved/jobs`,
          { withCredentials: true }
        );
        setSavedJobs(data.savedJobs);
      } catch (error) {
        toast.error("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthorized) fetchSavedJobs();
  }, [isAuthorized]);

  const removeJob = async (id) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/unsave/job/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setSavedJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove job");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="saved-jobs-page sj-page">
      <div className="sj-header">
        <h1 className="sj-title">Saved Opportunities</h1>
        <p className="sj-subtitle">Review and manage the positions you've bookmarked.</p>
      </div>

      {savedJobs.length <= 0 ? (
        <div className="sj-empty-state">
          <div className="sj-empty-icon-box">
            <FiHeart size={40} fill="#f43f5e" />
          </div>
          <h3 className="sj-empty-title">Your wishlist is empty</h3>
          <p className="sj-empty-desc">
            Explore thousands of jobs and save your favorites to review them later or apply whenever you're ready.
          </p>
          <Link to="/seeker/jobs" className="primary-btn sj-find-btn">
             Find Jobs <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="sj-grid">
          {savedJobs.map((job) => (
            <div key={job._id} className="glass-card sj-job-card">
               <div className="sj-job-main">
                  <div className="sj-job-icon">
                    {job.title.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                     <h4 className="sj-job-title">{job.title}</h4>
                     <p className="sj-job-meta">
                        <FiBriefcase size={14} /> {job.category}
                     </p>

                     <div className="sj-job-tags">
                        <span className="sj-tag tag-location">
                           <FiMapPin size={12} /> {job.city}
                        </span>
                        <span className="sj-tag tag-salary">
                           <FiDollarSign size={12} /> {job.fixedSalary ? `$${job.fixedSalary}` : `$${job.salaryFrom}-$${job.salaryTo}`}
                        </span>
                        {job.expired && (
                          <span className="sj-tag tag-expired">
                             HIRING CLOSED
                          </span>
                        )}
                     </div>
                  </div>
               </div>

               <div className="sj-job-actions">
                  <Link 
                    to={`/job/${job._id}`} 
                    className="sj-view-btn">
                    View Details <FiExternalLink size={14} />
                  </Link>
                  <button 
                    onClick={() => removeJob(job._id)}
                    className="sj-remove-btn">
                    <FiTrash2 size={18} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .sj-page {
          padding: 2rem;
        }

        .sj-header {
          margin-bottom: 2.5rem;
        }

        .sj-title {
          font-size: 1.8rem;
          fontWeight: 800;
          color: #0f172a;
          margin: 0;
        }

        .sj-subtitle {
          color: #64748b;
          margin-top: 0.25rem;
        }

        .sj-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem;
          background-color: white;
          border-radius: 24px;
          border: 2px dashed #e2e8f0;
          text-align: center;
        }

        .sj-empty-icon-box {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #fff1f2;
          color: #f43f5e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .sj-empty-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .sj-empty-desc {
          color: #64748b;
          margin-bottom: 2.5rem;
          max-width: 400px;
        }

        .sj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .sj-job-card {
          padding: 1.5rem;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .sj-job-main {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          flex: 1;
        }

        .sj-job-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background-color: #f0f7ff;
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 900;
          flex-shrink: 0;
        }

        .sj-job-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .sj-job-meta {
          margin: 0.25rem 0 0.75rem 0;
          color: #64748b;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .sj-job-tags {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .sj-tag {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .tag-location {
          color: #475569;
          background-color: #f1f5f9;
        }

        .tag-salary {
          color: #10b981;
          background-color: #ecfdf5;
        }

        .tag-expired {
          color: #ef4444;
          background-color: #fef2f2;
          font-weight: 800;
        }

        .sj-job-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 1.25rem;
        }

        .sj-view-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 10px;
          background-color: #0f172a;
          color: white;
          text-decoration: none;
          text-align: center;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .sj-remove-btn {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #fee2e2;
          background-color: #fffafa;
          color: #ef4444;
          cursor: pointer;
          font-weight: 700;
          transition: 0.2s;
        }

        .sj-remove-btn:hover {
          background-color: #fee2e2;
        }

        @media (max-width: 767px) {
          .sj-page {
            padding: 1rem;
          }

          .sj-header {
            margin-bottom: 1.5rem;
          }

          .sj-title {
            font-size: 1.5rem;
          }

          .sj-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .sj-empty-state {
            padding: 4rem 1rem;
            border-radius: 16px;
          }

          .sj-job-card {
            padding: 1rem;
          }

          .sj-job-icon {
            width: 48px;
            height: 48px;
            font-size: 1rem;
          }

          .sj-job-main {
            gap: 1rem;
          }

          .sj-view-btn {
            padding: 0.65rem;
            font-size: 0.8rem;
          }

          .sj-remove-btn {
            padding: 0.65rem 0.85rem;
          }
        }
      `}</style>
    </section>
  );
};

export default SavedJobs;
