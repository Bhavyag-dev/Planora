import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'college_admin' | 'dept_admin' | 'student' | 'admin';
  college?: string;
  department?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.email === 'vvishwas221@gmail.com') {
        parsedUser.role = 'super_admin';
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    
    // Redirect based on role
    if (userData.role === 'super_admin') {
      navigate('/super-admin');
    } else if (userData.role === 'college_admin') {
      navigate('/college-admin');
    } else if (userData.role === 'dept_admin') {
      navigate('/dept-admin');
    } else {
      navigate('/events');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
};
