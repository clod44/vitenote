import React, { useState, useEffect } from 'react';
import supabase from '@/utils/supabase';
import { AuthContextType, AuthContext, SignInMethod, SignInMethodEmail, SignInMethodOAuth, SignInMethodAnonymous, SignUpMethod, SignUpMethodEmail } from '@/context/auth/AuthContext';
import Loading from '@/components/Loading';
import { AuthUser } from '@supabase/supabase-js';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const getUser = async () => {
            setIsLoading(true);
            const { data: { user: _user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error.message);
                setUser(null);
            } else {
                setUser(_user || null);
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

    const signUp: AuthContextType['signUp'] = async (args) => {
        const signUpMethod = async (method: SignUpMethod["method"]) => {
            switch (method) {
                case "email": {
                    const emailArgs = args as SignUpMethodEmail;
                    return await supabase.auth.signUp({ email: emailArgs.email, password: emailArgs.password });
                }
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }
        };
        try {
            setIsLoading(true);
            const { error } = await signUpMethod(args.method);
            if (error) throw error;
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const signIn: AuthContextType['signIn'] = async (args) => {
        const signInMethod = async (method: SignInMethod["method"]) => {
            switch (method) {
                case "email": {
                    const emailArgs = args as SignInMethodEmail;
                    return await supabase.auth.signInWithPassword({ email: emailArgs.email, password: emailArgs.password });
                }
                case "anonymous": {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const anonymousArgs = args as SignInMethodAnonymous;
                    return await supabase.auth.signInAnonymously();
                }
                case "oauth": {
                    const oauthArgs = args as SignInMethodOAuth;
                    return await supabase.auth.signInWithOAuth({ provider: oauthArgs.provider });
                }
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }
        };
        try {
            setIsLoading(true);
            const { error } = await signInMethod(args.method);
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
        <AuthContext.Provider value={{
            user,
            signIn,
            signUp,
            signOut,
            isLoading
        }}>
            {isLoading ? (
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center z-50'>
                    <Loading label='Syncing...' />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};