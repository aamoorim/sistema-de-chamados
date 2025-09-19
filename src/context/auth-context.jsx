  import { createContext, useContext, useEffect, useState } from "react";

  const AuthContext = createContext(null);

  export function AuthProvider({ children }) {
    // Lê o usuário salvo no localStorage no carregamento inicial
    const [user, setUser] = useState(() => {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    });

    const [currentUserId, setCurrentUserId] = useState(() => {
      const savedId = localStorage.getItem("currentUserId");
      return savedId || (user ? user.id : null);
    });

    // Sincroniza localStorage ao alterar user
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

    // Função de login, deve receber objeto user com token e role
    const login = (userData) => {
      setUser({
        ...userData,
        name: userData.name || userData.nome || "", 
      });
    };

    const logout = () => {
      setUser(null);
    };

    // Extrai token do usuário para facilitar acesso
    const token = user?.token || null;

    // Extrai role/tipo do usuário para facilitar acesso
    const role = user?.role || user?.tipo || null;

    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          currentUserId,
          setCurrentUserId,
          role,
          login,
          logout,
          token,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  // Hook para consumir o contexto Auth
  export const useAuth = () => useContext(AuthContext);
