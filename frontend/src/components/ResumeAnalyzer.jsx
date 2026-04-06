import React, { useState } from "react";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("File select karo");

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("http://localhost:4000/analyze-resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResult(data.reply);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Resume Analyzer 🤖</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <br /><br />

      <button onClick={handleUpload}>Analyze Resume</button>

      <div style={{ marginTop: "20px" }}>
        <h3>Result:</h3>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;