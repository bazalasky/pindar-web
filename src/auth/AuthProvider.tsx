import { useCallback, useEffect, useState, type ReactNode } from 'react';
import * as client from '../api/client';
import { clearToken, getToken, setToken } from './tokenStorage';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  async function login(email: string, password: string) {
    const { access_token } = await client.login(email, password);
    setToken(access_token);      // persist to localStorage
    setTokenState(access_token); // trigger a re-render
  }

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  useEffect(() => {
    client.setUnauthorizedHandler(() => logout());
    return () => client.setUnauthorizedHandler(null);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
