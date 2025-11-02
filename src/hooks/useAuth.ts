"use client";
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  function loadUser() {
    try {
      const userData = localStorage.getItem("mevi-user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setLoading(false);
    }
  }

  function login(userData: any) {
    localStorage.setItem("mevi-user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("mevi-user");
    setUser(null);
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    reloadUser: loadUser
  };
}

