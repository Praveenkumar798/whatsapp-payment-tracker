import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication (in production, use proper auth)
    if (credentials.username === 'admin' && credentials.password === 'password') {
      localStorage.setItem('authToken', 'demo-token');
      onLogin();
    } else {
      alert('Invalid credentials. Use username: admin, password: password');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Lock size={48} style={{ color: '#667eea', marginBottom: '10px' }} />
          <h2>Login to WhatsApp Payment Tracker</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Demo credentials: admin / password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Enter username"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter password"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn" style={{ width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;