// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    signIn as googleSignIn,
    signOut as googleSignOut,
    getValidAccessToken,
    initGoogleClient
} from "@/utils/google";

interface AuthContextType {
    isSignedIn: boolean;
    isInitialized: boolean;
    signIn: () => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        async function initialize() {
            try {
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

                if (!clientId) throw new Error("Google Client ID is missing");

                await initGoogleClient(clientId);
                setIsInitialized(true);

                // Try silent refresh, but don’t force a sign-in
                try {
                    const token = await getValidAccessToken();
                    setIsSignedIn(!!token);
                } catch {
                    // No token or refresh failed → stay signed out
                    setIsSignedIn(false);
                }
            } catch (error) {
                console.error("Failed to initialize Google client:", error);
            }
        }
        initialize();
    }, []);



    async function signIn() {
        if (!isInitialized) {
            console.error("Google client not initialized");
            return;
        }
        await googleSignIn();
        setIsSignedIn(true);
    }

    function signOut() {
        googleSignOut();
        setIsSignedIn(false);
    }

    return (
        <AuthContext.Provider value={{ isSignedIn, isInitialized, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
