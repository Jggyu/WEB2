import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('TMDb-Key');
    setIsAuthenticated(!!token);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === email && u.password === password);

      if (user) {
        localStorage.setItem('TMDb-Key', user.password);
        setIsAuthenticated(true);
        resolve(user);
      } else {
        reject(new Error('Login failed'));
      }
    });
  };

  const register = async (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(user => user.id === email);

        if (userExists) {
          throw new Error('User already exists');
        }

        const newUser = { id: email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('TMDb-Key');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    register,
    logout
  };
};