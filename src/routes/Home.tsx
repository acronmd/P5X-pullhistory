import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";

export default function Home() {
    const { isSignedIn, signIn, isInitialized } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            navigate("/viewer");
        }
    }, [isSignedIn, navigate]);

    const handleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn();
        } catch (error) {
            console.error("Sign in failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                A P5X Wish Tracker
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                A P5X Wish Tracker (APT) is a website that uses Google Drive/Sheets API to
                store pull data and our site itself displays various different things like
                pull statistics, ongoing banners, pity tracking, luckiest pulls, pull percentages, etc. <br/> <br/>
                This app cannot automatically grab your pull history, but you
                can add pulls with screenshots and local image recognition using the built-in {" "}
                <a href={"https://tesseract.projectnaptha.com/"} className="text-blue-600 underline">
                    Tesseract.js OCR
                </a>
                . You can view our{" "}
                <Link to="/privacy" className="text-blue-600 underline">
                 Privacy Policy
                </Link>
                {" "}and our{" "}
                <Link to="/terms" className="text-blue-600 underline">
                    Terms of Service
                </Link>
                {" "}for more information.
            </p>
            <blockquote className="mt-6 border-l-2 pl-6 italic">
                &quot;Quite possibly the [...] best [...] software I've [...] ever [...]
                used.&quot;
            </blockquote>
            <Separator />
            <Button onClick={handleSignIn} disabled={isLoading || !isInitialized}>
                {isLoading ? "Signing in..." : "Sign In with Google"}
            </Button>
        </div>
    );
}
