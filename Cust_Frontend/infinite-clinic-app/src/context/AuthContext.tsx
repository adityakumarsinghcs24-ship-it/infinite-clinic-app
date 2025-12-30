import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { cleanUserData } from '../utils/userUtils';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Clean up username if it contains email (for existing cached users)
      const cleanedUserData = cleanUserData(userData);
      
      setUser(cleanedUserData);
      // Update localStorage with cleaned data
      localStorage.setItem('user', JSON.stringify(cleanedUserData));
    }
  }, []);

  const login = (userData: User) => {
    // Clean up username if it contains email
    const cleanedUserData = cleanUserData(userData);
    
    setUser(cleanedUserData);
    localStorage.setItem('user', JSON.stringify(cleanedUserData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Call MongoDB logout API
    fetch(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
      credentials: 'include',
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoggedIn: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};