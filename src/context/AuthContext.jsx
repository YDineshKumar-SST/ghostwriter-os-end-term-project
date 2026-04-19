import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const continueAsDemo = useCallback(() => {
    setUser({ id: 'demo', email: 'guest@demo.local', role: 'demo' });
    setAuthError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      continueAsDemo();
      return;
    }

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };

    initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured) {
      const error = { message: 'Supabase is not configured.' };
      setAuthError(error.message);
      return { error };
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setAuthError(error?.message ?? null);
    return { error };
  };

  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      const error = { message: 'Supabase is not configured.' };
      setAuthError(error.message);
      return { error };
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setUser(data?.user ?? null);
    setAuthError(error?.message ?? null);
    return { error };
  };

  const signOutUser = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setAuthError(null);
      return { error: null };
    }

    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    setUser(null);
    setAuthError(error?.message ?? null);
    return { error };
  };

  const value = useMemo(
    () => ({ user, loading, authError, login, signUp, signOutUser, continueAsDemo, isSupabaseConfigured }),
    [user, loading, authError, isSupabaseConfigured],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
