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
  Lock,
  Users,
  LogOut,
  BarChart3,
  Layout,
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Home,
} from "lucide-react";

// --- STEP 2: IMPORT LOCAL LOGO FILE FROM THE SRC DIRECTORY ---
import svuLogoLocal from "./svu-logo.png";

// Dynamically handle local vs server API base routes
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://career-navigator-backend-96zi.onrender.com";

function App() {
  // Navigation View Management: 'landing', 'user', 'results', 'admin'
  const [view, setView] = useState("landing");

  // User Mode Processing States
  const [file, setFile] = useState(null);
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Admin Security States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [candidateList, setCandidateList] = useState([]);

  // Assigned Local Asset Reference
  const logoUrl = svuLogoLocal;

  useEffect(() => {
    if (view === "results" && result) {
      setAnimatedScore(0);
      const timer = setTimeout(() => setAnimatedScore(result.ats_score), 200);
      return () => clearTimeout(timer);
    }
  }, [view, result]);

  // Handle Resume Analysis
  const handleAnalyze = async () => {
    if (!file || !interest) {
      alert("⚠️ Selection Required: Please provide a Job Role and a Resume.");
      return;
    }
    setLoading(true); // ✅ Fixed: Correctly triggers the spinning state machine loader
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("interest", interest);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/candidates/analyze-resume`,
        formData,
      );
      setResult(response.data);
      setView("results");
    } catch (error) {
      alert("Connection Failed: Check if your server gateways are online!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Authorization Gate
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (adminUser === "admin" && adminPass === "svu123") {
      setIsAdminLoggedIn(true);
      fetchCandidates();
    } else {
      alert("❌ Access Denied: Invalid Security Key tokens.");
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/candidates/all`);
      setCandidateList(response.data);
    } catch (error) {
      console.error("Database connection error:", error);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser("");
    setAdminPass("");
    setView("landing");
  };

  return (
    <div style={styles.page}>
      {/* --- CONDITIONAL GLOBAL HEADER BAR --- */}
      {view !== "landing" && (
        <nav style={styles.univHeader}>
          <div style={styles.navContainer}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
              onClick={() => setView("landing")}
            >
              <img src={logoUrl} alt="SVU Logo" style={styles.logoMini} />
              <div style={styles.univTextContainer}>
                <h2 style={styles.univNameMini}>SRI VENKATESWARA UNIVERSITY</h2>
                <p style={styles.deptNameMini}>
                  COLLEGE OF COMMERCE, MANAGEMENT & COMPUTER SCIENCE
                </p>
              </div>
            </div>

            <div style={styles.linkContainer}>
              <button
                onClick={() => setView("landing")}
                style={styles.navLinkHome}
              >
                <Home size={14} /> Home Gate
              </button>
              <button
                onClick={() => {
                  setView("user");
                  setResult(null);
                }}
                style={{
                  ...styles.navLink,
                  backgroundColor:
                    view === "user" || view === "results"
                      ? "rgba(59, 130, 246, 0.2)"
                      : "transparent",
                  color:
                    view === "user" || view === "results"
                      ? "#60a5fa"
                      : "#cbd5e1",
                }}
              >
                <Cpu size={14} /> Student Hub
              </button>
              <button
                onClick={() => setView("admin")}
                style={{
                  ...styles.navLinkSecure,
                  backgroundColor:
                    view === "admin" ? "rgba(239, 68, 68, 0.2)" : "transparent",
                }}
              >
                <Lock size={14} /> Admin Portal
              </button>
            </div>
          </div>
        </nav>
      )}

      <div style={styles.container}>
        {/* ==================== SCREEN 0: THE MAIN LANDING PORTAL GATE ==================== */}
        {view === "landing" && (
          <div style={styles.landingWrapper}>
            <div style={styles.landingHeader}>
              <img
                src={logoUrl}
                alt="SVU Large Logo"
                style={styles.logoLarge}
              />
              <h1 style={styles.landingUnivTitle}>
                SRI VENKATESWARA UNIVERSITY
              </h1>
              <h3 style={styles.landingDeptSub}>
                COLLEGE OF COMMERCE, MANAGEMENT & COMPUTER SCIENCE
              </h3>
              <div style={styles.landingDivider}></div>
              <h2 style={styles.landingProjectTitle}>
                AI-Driven Career & Placement Recommender
              </h2>
              <p style={styles.landingProjectDesc}>
                An automated tokenization and deep vector analytics framework
                matching industry benchmarks.
              </p>
            </div>

            <div style={styles.portalGrid}>
              {/* Option A: Student Dashboard Entry */}
              <div style={styles.portalCard} onClick={() => setView("user")}>
                <div style={styles.portalIconWrapper}>
                  <GraduationCap size={32} color="#60a5fa" />
                </div>
                <h3 style={styles.portalCardTitle}>Student Hub Entry</h3>
                <p style={styles.portalCardDesc}>
                  Upload professional profile summaries to verify structural ATS
                  compatibility rankings and filter missing competencies.
                </p>
                <div style={styles.portalActionBtn}>
                  Access Engine <ArrowRight size={14} />
                </div>
              </div>

              {/* Option B: Placement Admin Cell Entry */}
              <div
                style={styles.portalCardSecure}
                onClick={() => setView("admin")}
              >
                <div
                  style={{
                    ...styles.portalIconWrapper,
                    background: "rgba(239,68,68,0.1)",
                  }}
                >
                  <Lock size={30} color="#f87171" />
                </div>
                <h3 style={styles.portalCardTitle}>Placement Cell Login</h3>
                <p style={styles.portalCardDesc}>
                  Authorized access console tracking complete matrix aggregates,
                  candidate shorts, and database metrics verification.
                </p>
                <div style={styles.portalActionBtnSecure}>
                  Management Terminal <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SCREEN 1: INPUT UPLOADER HUB ==================== */}
        {view === "user" && (
          <div style={{ animation: "slideIn 0.5s ease-out" }}>
            <header style={styles.headerSection}>
              <div style={styles.aiBadge}>
                <Zap size={12} /> ENGINE BASELINE INITIALIZED
              </div>
              <h1 style={styles.mainTitle}>AI Resume Parsing Interface</h1>
              <p style={styles.subTitle}>
                Submit raw operational data models to identify missing career
                match vectors
              </p>
            </header>

            <div style={styles.glassCard}>
              <div style={styles.inputRow}>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>
                    <Target size={16} /> Target Designation Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Developer"
                    style={styles.input}
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  />
                </div>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>
                    <Upload size={16} /> Professional Resume File
                  </label>
                  <div style={styles.customUpload}>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={styles.hiddenFile}
                      id="fileInput"
                    />
                    <label htmlFor="fileInput" style={styles.uploadLabel}>
                      {file ? file.name : "Choose File (PDF/DOCX)"}
                    </label>
                  </div>
                </div>
              </div>
              <button
                style={styles.btn}
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="spin" size={20} />
                ) : (
                  <Cpu size={20} />
                )}
                {loading
                  ? " INTERPRETING DATA PROFILE..."
                  : " EXECUTE SYSTEM ANALYSIS"}
              </button>
            </div>
          </div>
        )}

        {/* ==================== SCREEN 2: DEDICATED RESULTS VISUALIZATIONS ==================== */}
        {view === "results" && result && (
          <div
            style={{ animation: "slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <div style={styles.backBar}>
              <button onClick={() => setView("user")} style={styles.backBtn}>
                <ChevronLeft size={16} /> Back to Analytics Portal
              </button>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                Metrics Target:{" "}
                <strong style={{ color: "#60a5fa" }}>{interest}</strong>
              </span>
            </div>

            <div style={styles.resultsGrid}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div style={styles.visualizationCard}>
                  <h4 style={styles.cardHeader}>
                    <Award size={18} color="#60a5fa" /> Overall Compatibility Check
                  </h4>
                  <div style={styles.scoreCircleWrapper}>
                    <div style={styles.scoreInfo}>
                      <h2 style={styles.scoreValue}>{animatedScore}%</h2>
                      <span style={styles.scoreLabel}>ATS MATCH SCORE</span>
                    </div>
                    <svg style={styles.svgCircle}>
                      <circle cx="75" cy="75" r="68" style={styles.bgCircle} />
                      <circle
                        cx="75"
                        cy="75"
                        r="68"
                        style={{
                          ...styles.progressCircle,
                          strokeDashoffset: 427 - (427 * animatedScore) / 100,
                        }}
                      />
                    </svg>
                  </div>
                </div>
                <div style={styles.insightBox}>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#60a5fa",
                      marginBottom: "5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Layout size={14} /> CLASSIFICATION ANALYSIS FEEDBACK:
                  </div>
                  {result.message}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div style={styles.visualizationCard}>
                  <h4 style={styles.cardHeader}>
                    <BarChart3 size={18} color="#34d399" /> Hybrid Weight Breakdown
                  </h4>
                  <div style={styles.chartRow}>
                    <div style={styles.chartMeta}>
                      <span>Technical Skill Matching (70% Weight)</span>
                      strong>
                        {animatedScore > 15 ? animatedScore - 5 : animatedScore}%
                      </strong>
                    </div>
                    <div style={styles.barTrack}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${animatedScore > 15 ? animatedScore - 5 : animatedScore}%`,
                          background:
                            "linear-gradient(90deg, #3b82f6, #34d399)",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div style={styles.chartRow}>
                    <div style={styles.chartMeta}>
                      <span>Contextual Cosine Similarity (30% Weight)</span>
                      <strong>{animatedScore}%</strong>
                    </div>
                    <div style={styles.barTrack}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${animatedScore}%`,
                          background:
                            "linear-gradient(90deg, #3b82f6, #60a5fa)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div style={styles.visualizationCard}>
                  <h4 style={styles.cardHeader}>
                    <ShieldCheck size={18} color="#fbbf24" /> Structural Integrity
                  </h4>
                  <div style={styles.matrixGrid}>
                    <div style={styles.matrixItem}>
                      <CheckCircle size={14} color="#34d399" /> Header Context
                    </div>
                    <div style={styles.matrixItem}>
                      <CheckCircle size={14} color="#34d399" /> Core Academics
                    </div>
                    <div style={styles.matrixItem}>
                      <CheckCircle size={14} color="#34d399" /> Repositories
                    </div>
                    <div
                      style={{
                        ...styles.matrixItem,
                        color: animatedScore > 75 ? "#34d399" : "#fbbf24",
                      }}
                    >
                      <AlertCircle
                        size={14}
                        color={animatedScore > 75 ? "#34d399" : "#fbbf24"}
                      />{" "}
                      Arrays Scaled
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...styles.skillGrid, marginTop: "20px" }}>
              <div style={styles.skillCard}>
                <h4 style={styles.cardHeader}>
                  <CheckCircle size={18} color="#34d399" /> Identified Proficiencies
                </h4>
                <div style={styles.pillContainer}>
                  {result.skills_found?.length > 0 ? (
                    result.skills_found.map((s, i) => (
                      <span key={i} style={styles.pillSuccess}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#94a3b8" }}>
                      No explicit target domains extracted.
                    </span>
                  )}
                </div>
              </div>
              <div style={styles.skillCard}>
                <h4 style={styles.cardHeader}>
                  <AlertCircle size={18} color="#fbbf24" /> Critical Skill Gaps
                </h4>
                <div style={styles.pillContainer}>
                  {result.missing_skills?.length > 0 ? (
                    result.missing_skills.map((s, i) => (
                      <span key={i} style={styles.pillWarning}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#34d399" }}>
                      Flawless profile baseline match!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SCREEN 3: ADMIN PORTAL CONSOLE ==================== */}
        {view === "admin" && (
          <div style={{ animation: "slideIn 0.5s ease-out" }}>
            {!isAdminLoggedIn ? (
              <div style={styles.glassCardSecure}>
                <h2 style={styles.adminTitle}>
                  <Lock size={22} color="#ef4444" /> Placement Control Gate
                </h2>
                <form
                  onSubmit={handleAdminLogin}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Admin Username"
                    style={styles.input}
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Security Password"
                    style={styles.input}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                  />
                  <button type="submit" style={styles.btnSecure}>
                    AUTHENTICATE PORTAL ACCESS
                  </button>
                </form>
              </div>
            ) : (
              <div style={styles.glassCard}>
                <div style={styles.tableHeaderRow}>
                  <h3
                    style={{
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Users size={22} color="#3b82f6" /> Placement Database Matrix
                  </h3>
                  <button onClick={handleAdminLogout} style={styles.logoutBtn}>
                    <LogOut size={14} /> Close Session
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={styles.table}>
                    <thead>
                      <tr
                        style={{
                          borderBottom: "2px solid #334155",
                          color: "#94a3b8",
                        }}
                      >
                        <th style={{ padding: "12px" }}>Record ID</th>
                        <th>Candidate Name</th>
                        <th>Email Address</th>
                        <th>Vector Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidateList.length > 0 ? (
                        candidateList.map((u) => (
                          <tr
                            key={u.id}
                            style={{ borderBottom: "1px solid #1e293b" }}
                          >
                            <td
                              style={{
                                padding: "12px",
                                color: "#3b82f6",
                                fontWeight: "bold",
                              }}
                            >
                              #00{u.id}
                            </td>
                            <td style={{ fontWeight: "600", color: "#fff" }}>
                              {u.name}
                            </td>
                            <td style={{ color: "#cbd5e1" }}>{u.email}</td>
                            <td>
                              <span style={styles.domainBadge}>
                                {u.interest || "Unspecified"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            style={{
                              padding: "30px",
                              textAlign: "center",
                              color: "#94a3b8",
                            }}
                          >
                            No data synchronized from backend repository.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{` .spin { animation: rotate 2s linear infinite; } @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes slideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } } `}</style>
    </div>
  );
}

const styles = {
  page: {
    background: "radial-gradient(circle at top right, #1e293b, #0f172a)",
    minHeight: "100vh",
    paddingBottom: "40px",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#f8fafc",
    width: "100%",
    overflowX: "hidden",
  },
  univHeader: {
    background: "rgba(15, 23, 42, 0.95)",
    borderBottom: "2px solid #3b82f6",
    padding: "15px 20px",
    marginBottom: "25px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    width: "100%",
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },
  logoMini: { height: "45px", width: "auto" },
  univTextContainer: { display: "flex", flexDirection: "column" },
  univNameMini: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: "0.5px",
  },
  deptNameMini: {
    margin: "1px 0 0 0",
    fontSize: "9px",
    color: "#60a5fa",
    fontWeight: "600",
  },
  linkContainer: {
    display: "flex",
    gap: "5px",
    background: "rgba(15,23,42,0.6)",
    padding: "4px",
    borderRadius: "10px",
    border: "1px solid #1e293b",
    flexWrap: "wrap",
  },
  navLinkHome: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontWeight: "700",
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
  },
  navLink: {
    border: "none",
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: "12px",
    padding: "6px 12px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    transition: "0.2s",
  },
  navLinkSecure: {
    border: "none",
    color: "#fca5a5",
    fontWeight: "700",
    fontSize: "12px",
    padding: "6px 12px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    transition: "0.2s",
  },
  container: { 
    maxWidth: "1200px", 
    margin: "0 auto", 
    padding: "0 15px",
    width: "100%",
    boxSizing: "border-box"
  },
  landingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 0",
    width: "100%",
  },
  landingHeader: { textAlign: "center", marginBottom: "30px", width: "100%" },
  logoLarge: {
    height: "100px",
    width: "auto",
    marginBottom: "15px",
    filter: "drop-shadow(0 0 15px rgba(59,130,246,0.3))",
  },
  landingUnivTitle: {
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "1px",
    margin: "0 0 5px 0",
    color: "#fff",
  },
  landingDeptSub: {
    fontSize: "12px",
    color: "#60a5fa",
    fontWeight: "600",
    margin: 0,
  },
  landingDivider: {
    height: "2px",
    width: "60px",
    background: "#3b82f6",
    margin: "15px auto",
  },
  landingProjectTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 10px 0",
    padding: "0 10px",
  },
  landingProjectDesc: {
    color: "#94a3b8",
    fontSize: "13px",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "0 15px",
  },
  portalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "850px",
    marginTop: "10px",
    boxSizing: "border-box",
  },
  portalCard: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  portalCardSecure: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(239,68,68,0.15)",
    borderRadius: "20px",
    padding: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  portalIconWrapper: {
    background: "rgba(59,130,246,0.1)",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "15px",
  },
  portalCardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 10px 0",
  },
  portalCardDesc: {
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: "1.5",
    margin: "0 0 20px 0",
  },
  portalActionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#60a5fa",
    fontWeight: "700",
    fontSize: "13px",
    marginTop: "auto",
  },
  portalActionBtnSecure: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#f87171",
    fontWeight: "700",
    fontSize: "13px",
    marginTop: "auto",
  },
  headerSection: { textAlign: "center", marginBottom: "30px", width: "100%" },
  aiBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#3b82f633",
    color: "#60a5fa",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "9px",
    fontWeight: "bold",
    border: "1px solid #3b82f644",
  },
  mainTitle: {
    fontSize: "26px",
    margin: "12px 0 5px",
    fontWeight: "800",
    color: "#fff",
  },
  subTitle: { color: "#94a3b8", fontSize: "13px", marginTop: "5px", padding: "0 10px" },
  glassCard: {
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "20px",
    width: "100%",
    boxSizing: "border-box",
  },
  glassCardSecure: {
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(10px)",
    padding: "25px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    maxWidth: "450px",
    margin: "20px auto",
    width: "100%",
    boxSizing: "border-box",
  },
  adminTitle: {
    textAlign: "center",
    marginTop: 0,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "18px",
    marginBottom: "20px",
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    background: "#0f172a",
    border: "1px solid #334155",
    padding: "12px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  customUpload: { position: "relative", width: "100%" },
  hiddenFile: {
    opacity: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    cursor: "pointer",
    left: 0,
    top: 0,
  },
  uploadLabel: {
    display: "block",
    background: "#0f172a",
    border: "1px solid #334155",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
    color: "#60a5fa",
    fontSize: "13px",
    fontWeight: "600",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  btn: {
    width: "100%",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
  },
  btnSecure: {
    width: "100%",
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    color: "white",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "14px",
  },
  backBar: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1e293b90",
    padding: "12px 15px",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid #334155",
    gap: "10px",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#60a5fa",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "20px",
    width: "100%",
  },
  visualizationCard: {
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid #334155",
    padding: "20px",
    borderRadius: "16px",
    boxSizing: "border-box",
  },
  cardHeader: {
    margin: "0 0 15px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "700",
    borderBottom: "1px solid #1e293b",
    paddingBottom: "8px",
    color: "#fff",
  },
  scoreCircleWrapper: {
    position: "relative",
    width: "150px",
    height: "150px",
    margin: "10px auto",
  },
  svgCircle: { transform: "rotate(-90deg)", width: "150px", height: "150px" },
  bgCircle: { fill: "none", stroke: "#0f172a", strokeWidth: "10" },
  progressCircle: {
    fill: "none",
    stroke: "#3b82f6",
    strokeWidth: "10",
    strokeLinecap: "round",
    strokeDasharray: "427",
    transition: "stroke-dashoffset 1.5s ease-out",
  },
  scoreInfo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    width: "100%",
  },
  scoreValue: {
    fontSize: "32px",
    margin: "0",
    fontWeight: "900",
    color: "#fff",
  },
  scoreLabel: {
    fontSize: "9px",
    color: "#94a3b8",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  chartRow: { marginBottom: "15px" },
  chartMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#cbd5e1",
    marginBottom: "6px",
  },
  barTrack: {
    height: "8px",
    background: "#0f172a",
    borderRadius: "4px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  matrixGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
    gap: "10px" 
  },
  matrixItem: {
    background: "#0f172a",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#cbd5e1",
    border: "1px solid #1e293b",
  },
  skillGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", 
    gap: "20px",
    width: "100%"
  },
  skillCard: {
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid #334155",
    padding: "20px",
    borderRadius: "16px",
    boxSizing: "border-box",
  },
  pillContainer: { display: "flex", flexWrap: "wrap", gap: "6px" },
  pillSuccess: {
    background: "#064e3b",
    color: "#34d399",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  pillWarning: {
    background: "#451a03",
    color: "#fbbf24",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  insightBox: {
    padding: "15px",
    background: "rgba(59, 130, 246, 0.08)",
    borderRadius: "12px",
    borderLeft: "4px solid #3b82f6",
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#cbd5e1",
  },
  tableHeaderRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "20px",
    alignItems: "center",
    color: "#fff",
    gap: "10px",
  },
  logoutBtn: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid #ef4444",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "#fca5a5",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontWeight: "600",
    fontSize: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "13px",
  },
  domainBadge: {
    background: "#1e293b",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#60a5fa",
    border: "1px solid #334155",
    fontWeight: "600",
  },
};

export default App;