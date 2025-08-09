// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    signIn as googleSignIn,
    signOut as googleSignOut,
    getAccessToken,
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
                console.log("Google Client ID:", clientId);

                if (!clientId) throw new Error("Google Client ID is missing");

                await initGoogleClient(clientId);
                setIsInitialized(true);

                const token = getAccessToken();
                setIsSignedIn(!!token);
            } catch (error) {
                console.error("Failed to initialize Google client:", error);
                if (error instanceof Error) {
                    console.error("Error message:", error.message);
                    console.error("Error stack:", error.stack);
                } else {
                    try {
                        console.error("Error details:", JSON.stringify(error));
                    } catch {
                        console.error("Could not stringify error");
                    }
                }
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
