import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', formData.username); // Store username
          window.dispatchEvent(new Event('authChange')); // Trigger nav refresh
        }
        router.push('/');
      } else {
        console.error('Login error:', { status: res.status, message: data.message });
        setError(data.message || `Login failed (Status: ${res.status})`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to connect to server. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="button-group">
          <button type="submit" className="submit-button">Login</button>
        </div>
      </form>
    </div>
  );
}