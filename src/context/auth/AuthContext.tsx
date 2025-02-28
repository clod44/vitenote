import { AuthUser, Provider } from "@supabase/supabase-js";
import { createContext } from "react";

//SIGNIN
export interface SignInMethodEmail {
    method: "email";
    email: string;
    password: string;
}
export interface SignInMethodAnonymous {
    method: "anonymous";
}
export interface SignInMethodOAuth {
    method: "oauth";
    provider: Provider;
}
export type SignInMethod = SignInMethodEmail | SignInMethodAnonymous | SignInMethodOAuth;

//SIGN UP
export interface SignUpMethodEmail {
    method: "email";
    email: string;
    password: string;
}
export type SignUpMethod = SignUpMethodEmail;


export interface AuthContextType {
    user: AuthUser | null;
    signUp: (args: SignUpMethod) => Promise<void>;
    signIn: (args: SignInMethod) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
