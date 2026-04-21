import { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    
    try {
      const { data } = await API.post(endpoint, formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Action failed. Please try again.");
    }
  };

  return (
    <div style={loginWrapper}>
      <form onSubmit={handleSubmit} style={loginCard}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
          {isRegistering ? 'Create Account' : 'Personal Diary'}
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px' }}>
          {isRegistering ? 'Join us to start writing' : 'Sign in to continue'}
        </p>

        {isRegistering && (
          <input 
            style={logInput} type="text" placeholder="Full Name" required
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
        )}

        <input 
          style={logInput} type="email" placeholder="Email" required
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        
        <input 
          style={logInput} type="password" placeholder="Password" required
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />

        <button type="submit" style={logBtn}>
          {isRegistering ? 'Sign Up' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </span>
        </p>
      </form>
    </div>
  );
};

// ... Styles (Keep the same styles from previous Login.jsx)
const loginWrapper = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' };
const loginCard = { background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', width: '100%', maxWidth: '400px' };
const logInput = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' };
const logBtn = { width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' };

export default Login;