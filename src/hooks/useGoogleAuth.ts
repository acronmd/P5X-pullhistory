import { useEffect, useState } from "react";
import {
    signIn as googleSignIn,
    signOut as googleSignOut,
    getAccessToken,
    initGoogleClient
} from "@/utils/google";

export function useGoogleAuth() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        async function initialize() {
            try {
                await initGoogleClient(import.meta.env.VITE_GOOGLE_CLIENT_ID);
                setIsInitialized(true);

                const token = getAccessToken();
                setIsSignedIn(!!token);
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

    return { isSignedIn, signIn, signOut, isInitialized };
}