import { useEffect, useState } from 'react';
import API from '../utils/api';
import AddEntry from '../components/AddEntry';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const fetchEntries = async () => {
    try {
      const { data } = await API.get('/entries');
      setEntries(data);
    } catch (err) { console.error(err); }
  };

  const deleteEntry = async (id) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      try {
        await API.delete(`/entries/${id}`);
        fetchEntries();
      } catch (err) { alert("Delete failed"); }
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  return (
    <div className="container">
      <header style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Welcome, {user?.name} 👋</h1>
          <p style={{ color: 'var(--text-muted)' }}>Capture your thoughts for today.</p>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} style={logoutBtn}>
          Logout
        </button>
      </header>

      <AddEntry onEntryAdded={fetchEntries} />

      <div style={timelineHeader}>Your Timeline</div>
      
      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No entries found. Start writing!</div>
      ) : (
        entries.map(e => (
          <div key={e._id} style={entryCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ marginBottom: '8px' }}>{e.title}</h3>
              <button onClick={() => deleteEntry(e._id)} style={deleteBtn}>Delete</button>
            </div>
            <p style={{ color: '#475569', marginBottom: '15px' }}>{e.content}</p>
            <div style={dateStyle}>{new Date(e.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        ))
      )}
    </div>
  );
};

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const logoutBtn = { background: 'none', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '6px', color: '#ef4444' };
const timelineHeader = { fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: '#475569' };
const entryCard = { background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: 'var(--shadow)', borderLeft: '6px solid var(--primary)' };
const dateStyle = { fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' };
const deleteBtn = { color: '#ef4444', background: 'none', border: 'none', fontSize: '0.9rem' };

export default Dashboard;