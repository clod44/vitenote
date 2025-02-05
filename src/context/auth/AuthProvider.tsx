import React, { useState, useEffect } from 'react';
import supabase from '@/utils/supabase';
import { AuthContextType, AuthContext } from './AuthContext';
//TODO:cast proper types to stuff

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUser = async () => {
            setIsLoading(true);
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error.message);
                setUser(null);
            } else {
                setUser(user || null);
            }
            setIsLoading(false);
        };

        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const signUpWithEmail: AuthContextType['signUpWithEmail'] = async (email, password) => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithEmail: AuthContextType['signInWithEmail'] = async (email, password) => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut: AuthContextType['signOut'] = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signUpWithEmail, signInWithEmail, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};