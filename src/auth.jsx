import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) { setReady(true); return; }
    api('/me').then(setUser).catch(() => localStorage.removeItem('token')).finally(() => setReady(true));
  }, []);

  const save = (r) => { localStorage.setItem('token', r.token); setUser(r.user); };
  const value = {
    user, ready,
    login: async (email, password) => save(await api('/auth/login', { method: 'POST', body: { email, password } })),
    register: async (name, email, password) => save(await api('/auth/register', { method: 'POST', body: { name, email, password } })),
    logout: () => { localStorage.removeItem('token'); setUser(null); },
    refresh: () => api('/me').then(setUser),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
