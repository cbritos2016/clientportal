import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Nav() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        setIsAuthenticated(!!token);
        setUsername(storedUsername);

        if (token && !storedUsername) {
          // Fetch username from API if not in localStorage
          try {
            const res = await fetch('http://localhost:5000/api/auth/user', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            localStorage.setItem('username', data.username);
            setUsername(data.username);
          } catch (error) {
            console.error('Error fetching username:', error);
            setUsername(null);
          }
        }
      }
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('authChange', handleStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('authChange', handleStorageChange);
      }
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.dispatchEvent(new Event('authChange'));
    }
    router.push('/login');
  };

  return (
    <nav className="nav-menu">
      <div className="nav-container">
        <ul className="nav-list">
          <li className="nav-item dropdown">
            <span className="nav-link">Main Menu</span>
            <ul className="dropdown-content">
              <li className="nav-item">
                <Link href="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/register">Register</Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link href="/about">About</Link>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <Link href="/add">Add New</Link>
            </li>
          )}
        </ul>
        {isAuthenticated && router.pathname !== '/login' && (
          <div className="nav-logout">
            {username && (
              <span className="nav-username">Welcome, {username}</span>
            )}
            <span className="nav-item">
              <a onClick={handleLogout} style={{ cursor: 'pointer' }}>Log Out</a>
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}