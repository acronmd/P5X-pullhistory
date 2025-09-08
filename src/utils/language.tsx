import { createContext, useContext, useState, type ReactNode } from "react";

interface LanguageContextType {
    language: number;
    setLanguage: (id: number) => void;
}

const LANGUAGE_KEY = "selectedLanguage";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Load initial language from localStorage, fallback to 1
    const [language, setLanguageState] = useState<number>(() => {
        const stored = localStorage.getItem(LANGUAGE_KEY);
        return stored ? parseInt(stored, 10) : 1;
    });

    // Whenever language changes, save to localStorage
    const setLanguage = (id: number) => {
        setLanguageState(id);
        localStorage.setItem(LANGUAGE_KEY, id.toString());
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
}
