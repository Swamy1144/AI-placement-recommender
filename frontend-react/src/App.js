import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Cpu, CheckCircle, AlertCircle, Loader2, Award, Zap, Target, Lock, Users, LogOut, BarChart3, Layout, ChevronLeft, ShieldCheck, ArrowRight, GraduationCap, Home } from 'lucide-react';

// --- STEP 2: IMPORT LOCAL LOGO FILE FROM THE SRC DIRECTORY ---
import svuLogoLocal from './svu-logo.png';

// Dynamically handle local vs server API base routes
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function App() {
  // Navigation View Management: 'landing', 'user', 'results', 'admin'
  const [view, setView] = useState('landing');
  
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
    if (view === 'results' && result) {
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
    setLoading(true);
    setResult(null); 
    const formData = new FormData();
    formData.append("file", file);
    formData.append("interest", interest);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/candidates/analyze-resume`, formData);
      setResult(response.data);
      setView('results'); 
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
    setView('landing');
  };

  return (
    <div style={styles.page}>
      
      {/* --- CONDITIONAL GLOBAL HEADER BAR (Hidden on main landing gate for cleaner look) --- */}
      {view !== 'landing' && (
        <nav style={styles.univHeader}>
          <div style={styles.navContainer}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', cursor:'pointer' }} onClick={() => setView('landing')}>
              <img src={logoUrl} alt="SVU Logo" style={styles.logoMini} />
              <div style={styles.univTextContainer}>
                <h2 style={styles.univNameMini}>SRI VENKATESWARA UNIVERSITY</h2>
                <p style={styles.deptNameMini}>COLLEGE OF COMMERCE, MANAGEMENT & COMPUTER SCIENCE</p>
              </div>
            </div>
            
            <div style={styles.linkContainer}>
              <button onClick={() => setView('landing')} style={styles.navLinkHome}><Home size={14}/> Home Gate</button>
              <button onClick={() => { setView('user'); setResult(null); }} style={{...styles.navLink, backgroundColor: (view === 'user' || view === 'results') ? 'rgba(59, 130, 246, 0.2)' : 'transparent', color: (view === 'user' || view === 'results') ? '#60a5fa' : '#cbd5e1' }}><Cpu size={14}/> Student Hub</button>
              <button onClick={() => setView('admin')} style={{...styles.navLinkSecure, backgroundColor: view === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'transparent' }}><Lock size={14}/> Admin Portal</button>
            </div>
          </div>
        </nav>
      )}

      <div style={styles.container}>
        
        {/* ==================== SCREEN 0: THE MAIN LANDING PORTAL GATE ==================== */}
        {view === 'landing' && (
          <div style={styles.landingWrapper}>
            <div style={styles.landingHeader}>
              <img src={logoUrl} alt="SVU Large Logo" style={styles.logoLarge} />
              <h1 style={styles.landingUnivTitle}>SRI VENKATESWARA UNIVERSITY</h1>
              <h3 style={styles.landingDeptSub}>COLLEGE OF COMMERCE, MANAGEMENT & COMPUTER SCIENCE</h3>
              <div style={styles.landingDivider}></div>
              <h2 style={styles.landingProjectTitle}>AI-Driven Career & Placement Recommender</h2>
              <p style={styles.landingProjectDesc}>An automated tokenization and deep vector analytics framework matching industry benchmarks.</p>
            </div>

            <div style={styles.portalGrid}>
              {/* Option A: Student Dashboard Entry */}
              <div style={styles.portalCard} onClick={() => setView('user')}>
                <div style={styles.portalIconWrapper}><GraduationCap size={32} color="#60a5fa" /></div>
                <h3 style={styles.portalCardTitle}>Student Hub Entry</h3>
                <p style={styles.portalCardDesc}>Upload professional profile summaries to verify structural ATS compatibility rankings and filter missing competencies.</p>
                <div style={styles.portalActionBtn}>Access Engine <ArrowRight size={14} /></div>
              </div>

              {/* Option B: Placement Admin Cell Entry */}
              <div style={styles.portalCardSecure} onClick={() => setView('admin')}>
                <div style={{...styles.portalIconWrapper, background:'rgba(239,68,68,0.1)'}}><Lock size={30} color="#f87171" /></div>
                <h3 style={styles.portalCardTitle}>Placement Cell Login</h3>
                <p style={styles.portalCardDesc}>Authorized access console tracking complete matrix aggregates, candidate shorts, and database metrics verification.</p>
                <div style={styles.portalActionBtnSecure}>Management Terminal <ArrowRight size={14} /></div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SCREEN 1: INPUT UPLOADER HUB ==================== */}
        {view === 'user' && (
          <div style={{ animation: 'slideIn 0.5s ease-out' }}>
            <header style={styles.headerSection}>
              <div style={styles.aiBadge}><Zap size={12} /> ENGINE BASELINE INITIALIZED</div>
              <h1 style={styles.mainTitle}>AI Resume Parsing Interface</h1>
              <p style={styles.subTitle}>Submit raw operational data models to identify missing career match vectors</p>
            </header>

            <div style={styles.glassCard}>
              <div style={styles.inputRow}>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}><Target size={16} /> Target Designation Role</label>
                  <input type="text" placeholder="e.g. Full Stack Developer" style={styles.input} value={interest} onChange={(e) => setInterest(e.target.value)} />
                </div>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}><Upload size={16} /> Professional Resume File</label>
                  <div style={styles.customUpload}>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} style={styles.hiddenFile} id="fileInput" />
                    <label htmlFor="fileInput" style={styles.uploadLabel}>{file ? file.name : "Choose File (PDF/DOCX)"}</label>
                  </div>
                </div>
              </div>
              <button style={styles.btn} onClick={handleAnalyze} disabled={loading}>
                {loading ? <Loader2 className="spin" size={20} /> : <Cpu size={20} />}
                {loading ? " INTERPRETING DATA PROFILE..." : " EXECUTE SYSTEM ANALYSIS"}
              </button>
            </div>
          </div>
        )}

        {/* ==================== SCREEN 2: DEDICATED RESULTS VISUALIZATIONS ==================== */}
        {view === 'results' && result && (
          <div style={{ animation: 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={styles.backBar}>
              <button onClick={() => setView('user')} style={styles.backBtn}><ChevronLeft size={16}/> Back to Analytics Portal</button>
              <span style={{color: '#94a3b8', fontSize: '13px'}}>Metrics Target: <strong style={{color:'#60a5fa'}}>{interest}</strong></span>
            </div>

            <div style={styles.resultsGrid}>
              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <div style={styles.visualizationCard}>
                  <h4 style={styles.cardHeader}><Award size={18} color="#60a5fa" /> Overall Compatibility Index</h4>
                  <div style={styles.scoreCircleWrapper}>
                    <div style={styles.scoreInfo}>
                      <h2 style={styles.scoreValue}>{animatedScore}%</h2>
                      <span style={styles.scoreLabel}>ATS MATCH SCORE</span>
                    </div>
                    <svg style={styles.svgCircle}>
                      <circle cx="75" cy="75" r="68" style={styles.bgCircle} />
                      <circle cx="75" cy="75" r="68" style={{...styles.progressCircle, strokeDashoffset: 427 - (427 * animatedScore) / 100}} />
                    </svg>
                  </div>
                </div>
                <div style={styles.insightBox}>
                  <div style={{fontWeight:'700', color:'#60a5fa', marginBottom:'5px', display:'flex', alignItems:'center', gap: '5px'}}><Layout size={14}/> CLASSIFICATION ANALYSIS FEEDBACK:</div>
                  {result.message}
                </div>
              </div>

              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <div style={styles.visualizationCard}>
                  <h4 style={styles.cardHeader}><BarChart3 size={18} color="#34d399" /> Hybrid Weight Factor Breakdown</h4>
                  <div style={styles.chartRow}>
                    <div style={styles.chartMeta}><span>Technical Skill Matching (70% Weight)</span><strong>{animatedScore > 15 ? animatedScore - 5 : animatedScore}%</strong></div>
                    <div style={styles.barTrack}><div style={{...styles.barFill, width: `${animatedScore > 15 ? animatedScore - 5 : animatedScore}%`, background: 'linear-gradient(90deg, #3b82f6, #34d399)'}}></div></div>
                  </div>
                  <div style={styles.chartRow}>
                    <div style={styles.chartMeta}><span>Contextual Cosine Similarity (30% Weight)</span><strong>{animatedScore}%</strong></div>
                    <div style={styles.barTrack}><div style={{...styles.barFill, width: `${animatedScore}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'}}></div></div>
                  </div>
                </div>

                <div style={styles.visualizationCard}>
                  <h4 style={styles.cardHeader}><ShieldCheck size={18} color="#fbbf24" /> Document Structure Integrity</h4>
                  <div style={styles.matrixGrid}>
                    <div style={styles.matrixItem}><CheckCircle size={14} color="#34d399"/> Header Context Validated</div>
                    <div style={styles.matrixItem}><CheckCircle size={14} color="#34d399"/> Core Academic Mapping</div>
                    <div style={styles.matrixItem}><CheckCircle size={14} color="#34d399"/> Project Repositories Indexed</div>
                    <div style={{...styles.matrixItem, color: animatedScore > 75 ? '#34d399' : '#fbbf24'}}><AlertCircle size={14} color={animatedScore > 75 ? '#34d399' : '#fbbf24'}/> Experience Arrays Scaled</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{...styles.skillGrid, marginTop: '20px'}}>
              <div style={styles.skillCard}>
                <h4 style={styles.cardHeader}><CheckCircle size={18} color="#34d399" /> Identified Industry Proficiencies</h4>
                <div style={styles.pillContainer}>
                  {result.skills_found?.length > 0 ? result.skills_found.map((s, i) => <span key={i} style={styles.pillSuccess}>{s}</span>) : <span style={{color: '#94a3b8'}}>No explicit target domains extracted.</span>}
                </div>
              </div>
              <div style={styles.skillCard}>
                <h4 style={styles.cardHeader}><AlertCircle size={18} color="#fbbf24" /> Critical Skill Gaps Detected</h4>
                <div style={styles.pillContainer}>
                  {result.missing_skills?.length > 0 ? result.missing_skills.map((s, i) => <span key={i} style={styles.pillWarning}>{s}</span>) : <span style={{color: '#34d399'}}>Profile matches target baseline criteria flawlessly!</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SCREEN 3: ADMIN PORTAL CONSOLE ==================== */}
        {view === 'admin' && (
          <div style={{ animation: 'slideIn 0.5s ease-out' }}>
            {!isAdminLoggedIn ? (
              <div style={styles.glassCardSecure}>
                <h2 style={styles.adminTitle}><Lock size={22} color="#ef4444" /> Placement Cell Control Gate</h2>
                <form onSubmit={handleAdminLogin} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <input type="text" placeholder="Admin Username" style={styles.input} value={adminUser} onChange={e => setAdminUser(e.target.value)} />
                  <input type="password" placeholder="Security Password" style={styles.input} value={adminPass} onChange={e => setAdminPass(e.target.value)} />
                  <button type="submit" style={styles.btnSecure}>AUTHENTICATE PORTAL ACCESS</button>
                </form>
              </div>
            ) : (
              <div style={styles.glassCard}>
                <div style={styles.tableHeaderRow}>
                  <h3 style={{margin:0, display:'flex', alignItems:'center', gap:'10px'}}><Users size={22} color="#3b82f6"/> Candidate Placement Database Matrix</h3>
                  <button onClick={handleAdminLogout} style={styles.logoutBtn}><LogOut size={14} /> Close Secure Session</button>
                </div>
                <table style={styles.table}>
                  <thead>
                    <tr style={{borderBottom:'2px solid #334155', color:'#94a3b8'}}>
                      <th style={{padding:'15px'}}>Record ID</th>
                      <th>Candidate Name</th>
                      <th>Email Address</th>
                      <th>Vector Target Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidateList.length > 0 ? candidateList.map((u) => (
                      <tr key={u.id} style={{borderBottom:'1px solid #1e293b'}}>
                        <td style={{padding:'15px', color:'#3b82f6', fontWeight:'bold'}}>#00{u.id}</td>
                        <td style={{fontWeight:'600', color:'#fff'}}>{u.name}</td>
                        <td style={{color:'#cbd5e1'}}>{u.email}</td>
                        <td><span style={styles.domainBadge}>{u.interest || "Unspecified"}</span></td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" style={{padding:'30px', textAlign:'center', color:'#94a3b8'}}>No candidate files synchronized from Spring Boot Database.</td></tr>
                    )}
                  </tbody>
                </table>
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
  page: { background: 'radial-gradient(circle at top right, #1e293b, #0f172a)', minHeight: '100vh', paddingBottom: '60px', fontFamily: "'Segoe UI', sans-serif", color: '#f8fafc' },
  univHeader: { background: 'rgba(15, 23, 42, 0.95)', borderBottom: '2px solid #3b82f6', padding: '20px 50px', marginBottom: '40px', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', animation: 'slideIn 0.3s ease-out' },
  navContainer: { maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoMini: { height: '55px', width: 'auto' },
  univTextContainer: { display: 'flex', flexDirection: 'column' },
  univNameMini: { margin: 0, fontSize: '18px', fontWeight: '900', color: '#ffffff', letterSpacing: '1px' },
  deptNameMini: { margin: '2px 0 0 0', fontSize: '11px', color: '#60a5fa', fontWeight: '600' },
  linkContainer: { display: 'flex', gap: '10px', background: 'rgba(15,23,42,0.6)', padding: '5px', borderRadius: '12px', border: '1px solid #1e293b' },
  navLinkHome: { background: 'transparent', border: 'none', color: '#94a3b8', fontWeight: '700', fontSize: '13px', padding: '8px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' },
  navLink: { border: 'none', color: '#cbd5e1', fontWeight: '700', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition:'0.2s' },
  navLinkSecure: { border: 'none', color: '#fca5a5', fontWeight: '700', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition:'0.2s' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 20px' },
  landingWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 0', animation: 'slideIn 0.6s ease-out' },
  landingHeader: { textAlign: 'center', marginBottom: '50px' },
  logoLarge: { height: '140px', width: 'auto', marginBottom: '25px', filter: 'drop-shadow(0 0 15px rgba(59,130,246,0.3))' },
  landingUnivTitle: { fontSize: '32px', fontWeight: '900', letterSpacing: '2px', margin: '0 0 5px 0', color: '#fff' },
  landingDeptSub: { fontSize: '15px', color: '#60a5fa', fontWeight: '600', letterSpacing: '0.5px', margin: 0 },
  landingDivider: { height: '2px', width: '100px', background: '#3b82f6', margin: '25px auto' },
  landingProjectTitle: { fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 10px 0' },
  landingProjectDesc: { color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto' },
  portalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%', maxWidth: '850px', marginTop: '10px' },
  portalCard: { background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '35px', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  portalCardSecure: { background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '24px', padding: '35px', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  portalIconWrapper: { background: 'rgba(59,130,246,0.1)', padding: '16px', borderRadius: '16px', marginBottom: '20px' },
  portalCardTitle: { fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 12px 0' },
  portalCardDesc: { fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 25px 0', minHeight: '68px' },
  portalActionBtn: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: '700', fontSize: '14px' },
  portalActionBtnSecure: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: '700', fontSize: '14px' },
  headerSection: { textAlign: 'center', marginBottom: '40px' },
  aiBadge: { display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#3b82f633', color: '#60a5fa', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #3b82f644' },
  mainTitle: { fontSize: '36px', margin: '15px 0 5px', fontWeight: '800', color:'#fff' },
  highlight: { color: '#3b82f6' },
  subTitle: { color: '#94a3b8', fontSize: '15px', marginTop: '5px' },
  glassCard: { background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', padding: '35px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
  glassCardSecure: { background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '450px', margin: '40px auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  adminTitle: { textAlign: 'center', marginTop: 0, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', fontSize:'22px', marginBottom:'25px' },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' },
  label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' },
  input: { width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '14px', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none' },
  customUpload: { position: 'relative' },
  hiddenFile: { opacity: 0, width: '100%', height: '100%', position: 'absolute', cursor: 'pointer', left: 0, top: 0 },
  uploadLabel: { display: 'block', background: '#0f172a', border: '1px solid #334155', padding: '14px', borderRadius: '12px', textAlign: 'center', color: '#60a5fa', fontSize: '14px', fontWeight: '600' },
  btn: { width: '100%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', padding: '16px', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  btnSecure: { width: '100%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white', padding: '16px', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' },
  backBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b90', padding: '12px 25px', borderRadius: '14px', marginBottom: '25px', border: '1px solid #334155' },
  backBtn: { background: 'transparent', border: 'none', color: '#60a5fa', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  resultsGrid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '25px' },
  visualizationCard: { background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', padding: '25px', borderRadius: '20px' },
  cardHeader: { margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '700', borderBottom: '1px solid #1e293b', paddingBottom: '10px', color:'#fff' },
  scoreCircleWrapper: { position: 'relative', width: '150px', height: '150px', margin: '10px auto' },
  svgCircle: { transform: 'rotate(-90deg)', width: '150px', height: '150px' },
  bgCircle: { fill: 'none', stroke: '#0f172a', strokeWidth: '10' },
  progressCircle: { fill: 'none', stroke: '#3b82f6', strokeWidth: '10', strokeLinecap: 'round', strokeDasharray: '427', transition: 'stroke-dashoffset 1.5s ease-out' },
  scoreInfo: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' },
  scoreValue: { fontSize: '36px', margin: '0', fontWeight: '900', color: '#fff' },
  scoreLabel: { fontSize: '9px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' },
  chartRow: { marginBottom: '20px' },
  chartMeta: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' },
  barTrack: { height: '10px', background: '#0f172a', borderRadius: '5px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '5px', transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)' },
  matrixGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  matrixItem: { background: '#0f172a', padding: '12px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1', border: '1px solid #1e293b' },
  skillGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
  skillCard: { background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', padding: '25px', borderRadius: '20px' },
  pillContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  pillSuccess: { background: '#064e3b', color: '#34d399', padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' },
  pillWarning: { background: '#451a03', color: '#fbbf24', padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' },
  insightBox: { padding: '20px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '16px', borderLeft: '4px solid #3b82f6', fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' },
  tableHeaderRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center', color: '#fff' },
  logoutBtn: { background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '10px', color: '#fca5a5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' },
  domainBadge: { background: '#1e293b', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', color: '#60a5fa', border: '1px solid #334155', fontWeight: '600' }
};

export default App;