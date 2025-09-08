import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // optional icons

import { Button } from "@/components/ui/button";

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(() => {
        // Try to get initial preference from localStorage
        const saved = localStorage.getItem("darkMode");
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        <Button
            className="w-12 h-12 rounded-lg shadow-lg bg-gray-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark Mode"
        >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-900 dark:text-gray-200" />}
        </Button>
    );
}