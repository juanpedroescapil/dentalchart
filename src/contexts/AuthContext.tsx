"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth status from localStorage or an API
    try {
      const storedAuth = localStorage.getItem('dentalAuth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        if (authData.isAuthenticated && authData.email) {
          setIsAuthenticated(true);
          setUserEmail(authData.email);
        }
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem('dentalAuth');
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('dentalAuth', JSON.stringify({ isAuthenticated: true, email }));
    router.push('/dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('dentalAuth');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
