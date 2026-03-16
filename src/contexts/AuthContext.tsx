import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { api, clearToken, getToken, setToken } from "@/lib/api";

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  license_no: string | null;
  clinic: string | null;
  location: string | null;
  hospital: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AppUser {
  id: string;
  email: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: any) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.auth.me();
      setUser(res.user);
      setProfile(res.profile);
    } catch (e) {
      // token invalid/expired
      clearToken();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      setToken(res.token);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (payload: any) => {
    setLoading(true);
    try {
      const res = await api.auth.signup(payload);
      setToken(res.token);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    clearToken();
    setUser(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({ user, profile, loading, signIn, signUp, signOut, refresh }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}