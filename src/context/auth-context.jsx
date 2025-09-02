import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Estado inicial depois lê do localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    const savedId = localStorage.getItem("currentUserId");
    return savedId || (user ? user.id : null);
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUserId(user.id);
      localStorage.setItem("currentUserId", user.id);
    } else {
      localStorage.removeItem("user");
      setCurrentUserId(null);
      localStorage.removeItem("currentUserId");
    }
  }, [user]);

  // NOVA FUNÇÃO: Função de login que define o role do usuário
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  // NOVA FUNÇÃO: Pega o role atual do usuário
  const role = user?.role || user?.tipo || null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      currentUserId, 
      setCurrentUserId,
      role, 
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);