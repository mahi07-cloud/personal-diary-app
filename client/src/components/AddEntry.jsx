import { useState } from 'react';
import API from '../utils/api';

const AddEntry = ({ onEntryAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/entries', { title, content });
      setTitle('');
      setContent('');
      setIsExpanded(false);
      onEntryAdded();
    } catch (err) {
      alert("Error saving entry. Session might be expired.");
    }
  };

  if (!isExpanded) {
    return (
      <button onClick={() => setIsExpanded(true)} style={expandBtn}>
        + Write a new entry
      </button>
    );
  }

  return (
    <div style={formCard}>
      <form onSubmit={handleSubmit}>
        <input 
          style={inputStyle} type="text" placeholder="Entry Title" required 
          value={title} onChange={(e) => setTitle(e.target.value)} 
        />
        <textarea 
          style={textAreaStyle} placeholder="What's on your mind?" required 
          value={content} onChange={(e) => setContent(e.target.value)} 
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={saveBtn}>Save Entry</button>
          <button type="button" onClick={() => setIsExpanded(false)} style={cancelBtn}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const formCard = { background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: 'var(--shadow)' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem' };
const textAreaStyle = { ...inputStyle, height: '120px', resize: 'none' };
const expandBtn = { width: '100%', padding: '15px', background: '#fff', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#64748b', fontSize: '1rem', marginBottom: '30px' };
const saveBtn = { background: '#2563eb', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '6px' };
const cancelBtn = { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 25px', borderRadius: '6px' };

export default AddEntry;