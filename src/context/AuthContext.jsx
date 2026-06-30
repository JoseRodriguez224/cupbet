import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSessionInfo, isAuthenticated, login as authLogin, logout as authLogout } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const login = useCallback(async (password) => {
    setLoading(true);
    setError(null);
    const result = await authLogin(password);
    if (result.ok) {
      setAuthenticated(true);
    } else {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setAuthenticated(false);
    setError(null);
    window.location.hash = "";
  }, []);

  const session = useMemo(() => (authenticated ? getSessionInfo() : null), [authenticated]);

  const value = useMemo(
    () => ({
      authenticated,
      loading,
      error,
      session,
      login,
      logout,
    }),
    [authenticated, loading, error, session, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
