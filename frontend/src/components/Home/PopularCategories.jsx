import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit3,
  FiCode,
  FiPieChart,
  FiCpu,
  FiLayers,
  FiPlay,
  FiSmartphone,
  FiMonitor
} from "react-icons/fi";

const PopularCategories = () => {
  const navigateTo = useNavigate();
  const categories = [
    {
      id: 1,
      title: "Design & Creative",
      subTitle: "305 Open Roles",
      icon: <FiEdit3 />,
      color: "#fef2f2",
      iconColor: "#ef4444"
    },
    {
      id: 2,
      title: "Engineering",
      subTitle: "1.2k+ Positions",
      icon: <FiCode />,
      color: "#eff6ff",
      iconColor: "#3b82f6"
    },
    {
      id: 3,
      title: "Data Science",
      subTitle: "867 Openings",
      icon: <FiPieChart />,
      color: "#f0fdf4",
      iconColor: "#22c55e"
    },
    {
      id: 4,
      title: "AI & ML",
      subTitle: "450 Positions",
      icon: <FiCpu />,
      color: "#faf5ff",
      iconColor: "#a855f7"
    },
    {
      id: 5,
      title: "Marketing",
      subTitle: "150 Open Roles",
      icon: <FiLayers />,
      color: "#fff7ed",
      iconColor: "#f97316"
    },
    {
      id: 6,
      title: "Video & Motion",
      subTitle: "94 Openings",
      icon: <FiPlay />,
      color: "#fdf2f8",
      iconColor: "#ec4899"
    },
    {
      id: 7,
      title: "Mobile Dev",
      subTitle: "200 Positions",
      icon: <FiSmartphone />,
      color: "#ecfeff",
      iconColor: "#06b6d4"
    },
    {
      id: 8,
      title: "Product Mgmt",
      subTitle: "120 Open Roles",
      icon: <FiMonitor />,
      color: "#f1f5f9",
      iconColor: "#475569"
    },
  ];

  return (
    <section style={{ padding: '100px 20px', backgroundColor: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="categories-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Explore by <span style={{ color: '#4f46e5' }}>Category</span>
            </h2>
            <p style={{ color: '#64748b' }}>Find the path that fits your passion.</p>
          </div>
          <button style={{ 
            color: '#4f46e5', 
            fontWeight: 700, 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1rem' 
          }}>
            View All Categories →
          </button>
        </div>

        <div className="categories-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {categories.map((element) => (
            <div 
              key={element.id} 
              className="category-card" 
              onClick={() => navigateTo(`/job/getall?search=${element.title}`)}
              style={{ 
                padding: '2rem', 
                borderRadius: '24px', 
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                backgroundColor: '#fff'
              }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                backgroundColor: element.color, 
                color: element.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                {element.icon}
              </div>
              <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{element.title}</h5>
              <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>{element.subTitle}</p>
              <style>{`
                .category-card:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
                  border-color: #4f46e5;
                }
              `}</style>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
