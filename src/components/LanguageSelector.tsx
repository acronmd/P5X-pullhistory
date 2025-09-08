import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/utils/language.tsx";

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    const languages = [
        { id: 1, label: "English" },
        { id: 2, label: "Korean" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="w-12 h-12 rounded-lg shadow-lg bg-gray-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                    title="Select Language"
                >
                    🌐
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5}>
                {languages.map(lang => (
                    <DropdownMenuItem
                        key={lang.id}
                        onClick={() => setLanguage(lang.id)}
                        className={language === lang.id ? "font-bold" : ""}
                    >
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
