import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  Cpu,
  CheckCircle,
  AlertCircle,
  Loader2,
  Award,
  Zap,
  Target,
} from "lucide-react";

export default function UserPage() {
  const [file, setFile] = useState(null);
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (result) {
      setAnimatedScore(0);
      const timer = setTimeout(() => setAnimatedScore(result.ats_score), 300);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!file || !interest) {
      alert("⚠️ Selection Required: Please provide a Job Role and a Resume.");
      return;
    }
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("interest", interest);

    try {
      const response = await axios.post(
        "https://career-navigator-backend-96zi.onrender.com/api/candidates/analyze-resume",
        formData,
      );
      setResult(response.data);
    } catch (error) {
      alert("Connection Failed: Check if Java and Python are active!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.tabContent}>
      <header style={styles.headerSection}>
        <div style={styles.aiBadge}>
          <Zap size={12} /> CORE AI ENGINE
        </div>
        <h1 style={styles.mainTitle}>AI Resume Parsing Engine</h1>
        <p style={{ color: "#94a3b8" }}>
          Neural network baseline matching for structural documents
        </p>
      </header>

      <div style={styles.glassCard}>
        <div style={styles.inputRow}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>
              <Target size={14} /> Target Career Role
            </label>
            <input
              type="text"
              placeholder="e.g. Java Developer"
              style={styles.input}
              onChange={(e) => setInterest(e.target.value)}
            />
          </div>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>
              <Upload size={14} /> Resume File
            </label>
            <div style={styles.customUpload}>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={styles.hiddenFile}
                id="fileInput"
              />
              <label htmlFor="fileInput" style={styles.uploadLabel}>
                {file ? file.name : "Select PDF or DOCX"}
              </label>
            </div>
          </div>
        </div>
        <button style={styles.btn} onClick={handleAnalyze} disabled={loading}>
          {loading ? <Loader2 className="spin" size={20} /> : <Cpu size={20} />}
          {loading ? " INTERPRETING VECTORS..." : " COMPUTE RELEVANCE PROFILE"}
        </button>
      </div>

      {result && (
        <div style={styles.resultsArea}>
          <div style={styles.scoreCircleWrapper}>
            <div style={styles.scoreInfo}>
              <Award size={32} color="#3b82f6" />
              <h2 style={styles.scoreValue}>{animatedScore}%</h2>
              <span style={{ fontSize: "9px", color: "#94a3b8" }}>
                ATS MATCH
              </span>
            </div>
            <svg style={styles.svgCircle}>
              <circle cx="70" cy="70" r="65" style={styles.bgCircle} />
              <circle
                cx="70"
                cy="70"
                r="65"
                style={{
                  ...styles.progressCircle,
                  strokeDashoffset: 408 - (408 * animatedScore) / 100,
                }}
              />
            </svg>
          </div>
          <div style={styles.skillGrid}>
            <div style={styles.skillCard}>
              <h4
                style={{
                  margin: "0 0 10px 0",
                  color: "#34d399",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <CheckCircle size={16} /> Extracted Skills
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {result.skills_found?.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#064e3b",
                      color: "#34d399",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {s}
                  </span>
                )) || "None"}
              </div>
            </div>
            <div style={styles.skillCard}>
              <h4
                style={{
                  margin: "0 0 10px 0",
                  color: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <AlertCircle size={16} /> Targeted Enhancements
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {result.missing_skills?.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#451a03",
                      color: "#fbbf24",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {s}
                  </span>
                )) || "None"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Share local styles block
const styles = {
  tabContent: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "10px 20px",
    animation: "slideIn 0.5s ease-out",
  },
  headerSection: { textAlign: "center", marginBottom: "40px" },
  aiBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#3b82f633",
    color: "#3b82f6",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
    border: "1px solid #3b82f644",
  },
  mainTitle: {
    fontSize: "38px",
    margin: "10px 0 5px 0",
    fontWeight: "800",
    color: "#fff",
  },
  glassCard: {
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(10px)",
    padding: "35px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "25px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    background: "#0f172a",
    border: "1px solid #334155",
    padding: "14px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  customUpload: { position: "relative" },
  hiddenFile: { display: "none" },
  uploadLabel: {
    display: "block",
    background: "#0f172a",
    border: "1px solid #334155",
    padding: "14px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#3b82f6",
    cursor: "pointer",
    fontWeight: "600",
  },
  btn: {
    width: "100%",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 15px rgba(59,130,246,0.4)",
  },
  resultsArea: { marginTop: "50px" },
  scoreCircleWrapper: {
    position: "relative",
    width: "140px",
    height: "140px",
    margin: "0 auto 40px",
  },
  svgCircle: { transform: "rotate(-90deg)", width: "140px", height: "140px" },
  bgCircle: { fill: "none", stroke: "#1e293b", strokeWidth: "8" },
  progressCircle: {
    fill: "none",
    stroke: "#3b82f6",
    strokeWidth: "8",
    strokeLinecap: "round",
    strokeDasharray: "408",
    transition: "stroke-dashoffset 1.2s ease-out",
  },
  scoreInfo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    width: "100%",
  },
  scoreValue: { fontSize: "32px", margin: 0, fontWeight: "800", color: "#fff" },
  skillGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  skillCard: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #334155",
  },
};
