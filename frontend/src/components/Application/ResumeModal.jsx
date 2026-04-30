import React from "react";

const ResumeModal = ({ imageUrl, onClose }) => {
  const isPDF = imageUrl?.toLowerCase().endsWith(".pdf") || imageUrl?.includes("/raw/upload/");

  return (
    <div className="resume-modal" style={{ zIndex: 10000 }}>
      <div className="modal-content" style={{ width: "90%", height: "90%", maxWidth: "1000px", background: "white", borderRadius: "15px", overflow: "hidden" }}>
        <span className="close" onClick={onClose} style={{ zIndex: 10001, color: "#000", background: "rgba(255,255,255,0.8)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", top: "15px", right: "15px", fontSize: "30px" }}>
          &times;
        </span>
        {isPDF ? (
          <iframe 
            src={imageUrl} 
            width="100%" 
            height="100%" 
            style={{ border: "none" }}
            title="Resume Viewer"
          />
        ) : (
          <img src={imageUrl} alt="resume" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        )}
      </div>
    </div>
  );
};

export default ResumeModal;
