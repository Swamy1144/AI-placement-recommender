import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Users, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ user: "", pass: "" });
  const [users, setUsers] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.user === "admin" && credentials.pass === "svu123") {
      setIsLoggedIn(true);
      fetchUsers();
    } else { 
      alert("❌ Access Denied: Invalid Security Key tokens."); 
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/candidates/all');
      setUsers(res.data);
    } catch (e) { 
      console.error(e); 
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.tabContent}>
        <div style={styles.glassCardSecure}>
          <h2 style={styles.adminTitle}><Lock size={22} color="#ef4444" /> Admin Authentication</h2>
          <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            <input type="text" placeholder="Admin Username" style={styles.input} onChange={e => setCredentials({...credentials, user: e.target.value})} />
            <input type="password" placeholder="Security Password" style={styles.input} onChange={e => setCredentials({...credentials, pass: e.target.value})} />
            <button type="submit" style={styles.btnSecure}>ACCESS MANAGEMENT CONSOLE</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tabContent}>
      <div style={styles.glassCard}>
        <div style={styles.tableHeaderRow}>
          <h3 style={{margin:0, display:'flex', alignItems:'center', gap:'10px'}}><Users size={22} color="#3b82f6"/> SVU Candidate Placement Matrix</h3>
          <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}><LogOut size={14} /> Revoke Session</button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr style={{borderBottom:'2px solid #334155', color:'#94a3b8'}}>
              <th style={{padding:'15px'}}>Candidate ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Target Placement Domain</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(u => (
              <tr key={u.id} style={{borderBottom:'1px solid #1e293b'}}>
                <td style={{padding:'15px', color:'#3b82f6', fontWeight:'bold'}}>#00{u.id}</td>
                <td style={{fontWeight:'600', color:'#fff'}}>{u.name}</td>
                <td style={{color:'#cbd5e1'}}>{u.email}</td>
                <td><span style={styles.domainBadge}>{u.interest || "Not Set"}</span></td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{padding:'30px', textAlign:'center', color:'#94a3b8'}}>No candidate files parsed in database state.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  tabContent: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },
  glassCardSecure: { background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '450px', margin: '40px auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  glassCard: { background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', padding: '35px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' },
  adminTitle: { textAlign: 'center', marginTop: 0, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', fontSize:'22px', marginBottom:'25px' },
  input: { width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '14px', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none' },
  btnSecure: { width: '100%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white', padding: '16px', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' },
  tableHeaderRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems:'center', color:'#fff' },
  logoutBtn: { background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', padding:'8px 16px', borderRadius:'10px', color: '#fca5a5', cursor: 'pointer', display:'flex', alignItems:'center', gap:'6px', fontWeight:'600', fontSize:'13px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize:'15px' },
  domainBadge: { background: '#1e293b', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', color: '#60a5fa', border: '1px solid #334155', fontWeight:'600' }
};