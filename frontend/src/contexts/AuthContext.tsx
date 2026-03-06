import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isMock } from '../lib/supabase';
import type { Profile } from '../lib/database.types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (isMock) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    if (isMock) {
      // Return a basic mock profile if none matched in the hardcoded intercepts above,
      // though typically in mock mode it comes from the intercept
      setProfile({
        id: userId,
        full_name: 'Mock User',
        phone: '',
        role: 'customer',
      } as Profile);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    setProfile(data);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isMock) {
      alert('Mock Mode: Sign up simulated successfully. Please login with demo credentials.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        phone: '',
        role: 'customer',
      } as never);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Hardcoded Admin Login Intercept
    if (email === 'afsal@123' && password === 'asdasd') {
      const mockAdminUser = {
        id: 'mock-admin-id',
        email: 'afsal@123',
        role: 'authenticated',
      } as User;

      const mockAdminProfile = {
        id: 'mock-admin-id',
        full_name: 'Store Administrator',
        phone: '',
        role: 'admin',
      } as Profile;

      setUser(mockAdminUser);
      setProfile(mockAdminProfile);
      return;
    }

    // Hardcoded Demo User Intercept
    if (email === 'demo@123' && password === 'demodemo') {
      const mockDemoUser = {
        id: 'mock-demo-id',
        email: 'demo@123',
        role: 'authenticated',
      } as User;

      const mockDemoProfile = {
        id: 'mock-demo-id',
        full_name: 'Demo User',
        phone: '',
        role: 'customer',
      } as Profile;

      setUser(mockDemoUser);
      setProfile(mockDemoProfile);
      return;
    }

    if (isMock) {
      alert('Invalid demo credentials. Use admin@123/asdasd or demo@123/demodemo.');
      throw new Error('Invalid credentials');
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    if (isMock) {
      alert('Google Sign-in is simulated in mock mode.');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) throw error;
  };

  const signOut = async () => {
    if (isMock) {
      setUser(null);
      setProfile(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithGoogle, signOut, showAuthModal, setShowAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
