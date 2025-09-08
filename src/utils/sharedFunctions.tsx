type Pull = {
    name?: string;
    name_en?: string;
    name_ko?: string;
    // add more languages if needed
};

export function getCharacterName(char: Pull, languageId: number): string {
    switch (languageId) {
        case 1: // English
            return char.name_en || char.name || "";
        case 2: // Korean
            return char.name_ko || char.name || "";
        default:
            return char.name || "";
    }
}

export function formatPullTime(unix: string) {
    const ts = parseInt(unix.replace(/\D/g, ""), 10); // keep only digits
    if (isNaN(ts)) return "Invalid date";

    const timestamp = ts < 1e12 ? ts * 1000 : ts;
    const date = new Date(timestamp);

    return date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
    });
}


export function formatUnixToLocal(unix: string | number): string {
    const ts = typeof unix === "string" ? parseInt(unix, 10) : unix;
    const timestamp = ts < 1e12 ? ts * 1000 : ts;
    const date = new Date(timestamp);

    const pad = (n: number) => String(n).padStart(2, "0");

    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());

    // Get short timezone name like "EST", "CST", etc.
    const tz = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
        .formatToParts(date)
        .find(part => part.type === "timeZoneName")?.value ?? "";

    return `${y}-${m}-${d} ${h}:${min}:${s} ${tz}`;
}


export function formatContractTypeSublabel(contractType: string) {
    switch (contractType) {
        case "1":
            return "Phantom Idol";
        case "2":
            return "Most Wanted Ph. Idol";
        case "3":
            return "Arms Deals";
        case "4":
            return "Newcomer Banner";
        case "5":
            return "Most wanted Ph. Idol";
    }
}

const languageColumns: Record<number, number> = {
    1: 5, // English
    2: 6, // Korean
};

const defaultLanguageColumn = 4; // fallback default name

export function getCellValueByLanguage(row: any[], languageId: number): string {
    const colIndex = languageColumns[languageId] ?? defaultLanguageColumn;

    // Check if the cell exists and has a value
    const value = row[colIndex]; // -1 because arrays are 0-indexed
    if (value && value.toString().trim() !== "") {
        return value;
    }

    // fallback to default column
    return row[defaultLanguageColumn] ?? "";
}

import { IDMap } from "@/components/CharacterPicker.tsx";

// Generic function to resolve name
export function getLocalizedName(
    id: number,
    language: number
): string {
    const item = IDMap[id];
    if (!item) return "Unknown";

    // Map your language IDs to field keys
    const langMap: Record<number, keyof typeof item> = {
        1: "name_en", // English
        2: "name_ko", // Korean
    };

    const field = langMap[language];

    // Check if the field exists and is non-empty
    if (field && item[field]) {
        return item[field] as string;
    }

    // Fallback to default name
    return "Unknown ID";
}