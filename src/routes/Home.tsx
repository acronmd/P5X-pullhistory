import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

import screenshot1 from "@/assets/screenshots/screenshot1.png";
import screenshot2 from "@/assets/screenshots/screenshot2.png";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

const screenshots = [
    { src: screenshot1, altText: "Screenshot 1", text: "The APT homepage, showing banner cards, active banners, and more" },
    { src: screenshot2, altText: "Screenshot 2", text: "The banner detailed view, showing many statistics" },
]

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
                A P5X Wish Tracker is a website that uses Google Drive/Sheets API to
                store pull data and our site itself displays various different things like
                pull statistics, ongoing banners, pity tracking, luckiest pulls, pull percentages, etc. <br/> <br/>
                This app can automatically grab pull history using iant's public API.
                {/*but you
                can add pulls with screenshots and local image recognition using the built-in {" "}
                <a href={"https://tesseract.projectnaptha.com/"} className="text-blue-600 underline">
                    Tesseract.js OCR
                </a>
                .
                 */}
                You can view our{" "}
                <Link to="/privacy" className="text-blue-600 underline">
                 Privacy Policy
                </Link>
                {" "}and our{" "}
                <Link to="/terms" className="text-blue-600 underline">
                    Terms of Service
                </Link>
                {" "}for more information.

            </p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="bg-coloredbg text-white"
                    >How to use?</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>How to use the wish tracker</DialogTitle>
                        <DialogDescription>
                            Follow these steps the first time to use this wish tracker
                        </DialogDescription>
                    </DialogHeader>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            Create a spreadsheet in  {" "}
                            <a
                                href='https://docs.google.com/spreadsheets/u/0/'
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                Google Sheets
                            </a>.
                        </li>
                        <li>
                           Sign in with Google on this screen.
                        </li>
                        <li>
                            Press the 'Set Spreadsheet from Google Drive' button and select your spreadsheet.
                        </li>
                        <li>
                            Add history with your API Link with the 'Sync from API Link' button.
                        </li>
                        <li>
                            Enjoy!
                        </li>
                    </ol>
                </DialogContent>
            </Dialog>
            <Separator />
            <Carousel>
                <CarouselContent>
                    {screenshots.map((image, i) => (
                        <CarouselItem key={i} className="relative w-full h-full">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <img
                                        src={image.src}
                                        alt={image.altText}
                                        className="w-full h-full object-contain"
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <div className="text-center">
                                        <p className="font-bold">{image.text}</p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </CarouselItem>
                        ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <Button onClick={handleSignIn} disabled={isLoading || !isInitialized}>
                {isLoading ? "Signing in..." : "Sign In with Google"}
            </Button>
        </div>
    );
}
