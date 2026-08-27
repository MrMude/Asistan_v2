import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth.api";
import { User } from "../types";

const STORAGE_KEY = "karea_current_user_v1";

type PublicUser = Omit<User, "password">;

interface AuthContextValue {
  currentUser: PublicUser | null;
  isLocked: boolean;
  pendingPasswordSetupUser: PublicUser | null;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  setInitialPassword: (newPassword: string) => Promise<void>;
  unlock: (password: string) => void;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // currentUser/isLocked kasıtlı olarak localStorage'da tutulur — bu,
  // orijinal uygulamadaki "sayfa yenilense de oturum + kilit durumu kalıcı
  // olsun" davranışının aynısıdır (bkz. dva_current_user_v4 karşılığı).
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PublicUser) : null;
    } catch {
      return null;
    }
  });
  const [isLocked, setIsLocked] = useState(() => !!localStorage.getItem(STORAGE_KEY));
  const [pendingPasswordSetupUser, setPendingPasswordSetupUser] = useState<PublicUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Şifre, kilit ekranında karşılaştırma yapabilmek için ayrıca (yalnızca
  // bellekte, localStorage'a YAZILMADAN) tutulur.
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && !isLocked) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else if (!currentUser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser, isLocked]);

  const login = async (username: string, password: string) => {
    try {
      const res = await authApi.login(username, password);
      setError(null);
      if (res.requiresPasswordSetup) {
        setPendingPasswordSetupUser(res.user);
        return;
      }
      setCurrentUser(res.user);
      setCurrentPassword(password);
      setIsLocked(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    }
  };

  const setInitialPassword = async (newPassword: string) => {
    if (!pendingPasswordSetupUser) return;
    if (!/^\d{4}$/.test(newPassword)) {
      setError("Lütfen 4 haneli rakam giriniz.");
      return;
    }
    const res = await authApi.setInitialPassword(pendingPasswordSetupUser.id, newPassword);
    setCurrentUser(res.user);
    setCurrentPassword(newPassword);
    setPendingPasswordSetupUser(null);
    setIsLocked(false);
    setError(null);
  };

  const unlock = (password: string) => {
    if (password === currentPassword) {
      setIsLocked(false);
      setError(null);
    } else {
      setError("Şifre hatalı!");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLocked(false);
    setCurrentPassword(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ currentUser, isLocked, pendingPasswordSetupUser, error, login, setInitialPassword, unlock, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalı");
  return ctx;
}
