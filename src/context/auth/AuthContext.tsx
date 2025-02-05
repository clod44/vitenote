import { createContext } from "react";

export interface AuthContextType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
