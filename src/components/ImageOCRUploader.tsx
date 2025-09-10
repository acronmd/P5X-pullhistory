import React, {useState} from 'react';
import Tesseract from 'tesseract.js';

import { Button } from "@/components/ui/button";

import { availableCharacters } from "@/components/CharacterPicker";
import { availableWeapons } from "@/components/CharacterPicker"

import fileIconBig from "@/assets/file-icon-big.png";

const CHARACTER_NAMES = availableCharacters.map(c => c.name_en);
const WEAPON_NAMES = availableWeapons.map(c => c.name_en);

import { enNameMap } from "@/components/CharacterPicker";
import {Loader2} from "lucide-react";


const MISTAKEN_NAMES_MAP: Record<string, string> = {
    "Agathlon": "Agathion",
    "Jack-o0'-Lantern": "Jack-o'-Lantern",
    "Jack-o-Lantern": "Jack-o'-Lantern",
    "Jack-0'-Lantern": "Jack-o'-Lantern",
    "Jack-O'-Lantern": "Jack-o'-Lantern",
    "Jack-O-Lantern": "Jack-o'-Lantern",
    "Jack-0-Lantern": "Jack-o'-Lantern",
    "Jack-o0-Lantern": "Jack-o'-Lantern",
    "Jack-0™-Lantern": "Jack-o'-Lantern",
    "Jack-o\"-Lantern": "Jack-o'-Lantern",
    "Bicom": "Bicorn",
    "Yulimi Fujikawa": "Yukimi Fujikawa",
    "saki Mitama": "Saki Mitama",
    "Makoto Niijima" : "Makoto Nijima",
    "Sweety 5G": "Sweety SG",
    "shrill" : "Shrill",
    "Rosethomn" : "Rosethorn",
    "CA. Explorer" : "C.A. Explorer",
    "C.A Explorer" : "C.A. Explorer",
    "CA Explorer" : "C.A. Explorer",
    "Ayaka Sali" : "Ayaka Sakai",
};

type itemData = {
    src: string;
    modalsrc: string;
    collectionsrc: string;
    rarity: "none" | "common" | "standard" | "rare" | "superrare";
    name_en: string;
    name_ko?: string;
    codename: string;
    affinity: "Cleave" | "Fire" | "Ice" | "Elec" | "Wind" | "Psi" | "Nuclear" | "Bless" | "Curse" | "Support";
    id: number;

    assChara?: number;
}

export type pullData = {
    matchedCharacter: itemData
    name: string;
    contractType: string;
    timestampFull: string;
};

type Props = {
    onTextExtracted: (data: pullData[]) => void;
    setAlertDialogBoolean: (value: boolean) => void
    setAlertDialogError: (error: string) => void
    currentBannerSublabel: string;
};

function correctMistakenNames(line: string): string {
    let correctedLine = line;
    for (const [mistake, correct] of Object.entries(MISTAKEN_NAMES_MAP)) {
        if (correctedLine.includes(mistake)) {
            correctedLine = correctedLine.replaceAll(mistake, correct);
        }
    }
    return correctedLine;
}

function parseOcrPulls(rawText: string, sublabel: string) {
    const lines = rawText.split('\n');
    const pulls = [];

    for (const line of lines) {
        const cleaned = correctMistakenNames(line.trim());

        let matchedName: string | undefined;

        for (const name in enNameMap) {
            if (line.includes(name)) {
                matchedName = name;
                break; // stop once we find a match
            }
        }

        if (matchedName) {
            console.log(`Matched hero: ${matchedName}, id=${enNameMap[matchedName]}`);
        } else {
            console.log("Tesseract unknown names: " + line);
            continue;
        }

        // Step 2: Slice everything after the character name
        const afterName = cleaned.slice(cleaned.indexOf(matchedName) + matchedName.length).trim();

        // Step 3: Extract timestamp (match format like 00:00:00 or similar)
        const timestampMatch = cleaned.match(/\d{2}:\d{2}:\d{2}/);
        const timestamp = timestampMatch ? timestampMatch[0] : null;
        let timestampFull = "";

        // Step 4: Guess contract type from what's between name and timestamp
        let contractType = afterName;
        if (timestamp) {
            const timestampIndex = afterName.indexOf(timestamp);
            contractType = afterName.slice(0, timestampIndex - 12).trim();
            timestampFull = afterName.slice((timestampIndex - 11), timestampIndex + 8);
        }

        if (timestampFull.length == 0) {
            console.log(matchedName + " was recognized but could not find a timestamp");
            continue;
        }

        pulls.push({
            matchedCharacter: enNameMap[matchedName],
            name: matchedName,
            contractType,
            timestampFull,
        });
    }

    return pulls;
}

const ImageOCRUploader: React.FC<Props> = ({ onTextExtracted, setAlertDialogBoolean, setAlertDialogError, currentBannerSublabel }) => {
    const [imageUploading, setImageUploading] = useState(false);

    async function tesseractParsing(file: File) {
        setImageUploading(true);
        const {data} = await Tesseract.recognize(file, 'eng');
        ///This is where I can parse data before sending it back
        const parsedData = parseOcrPulls(data.text, currentBannerSublabel);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onTextExtracted(parsedData); // send formatted string
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        await tesseractParsing(file);
        setImageUploading(false);
    };

    const handleClipboardImage = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                const type = item.types.find((t) => t.startsWith("image/"));
                if (type) {
                    const blob = await item.getType(type);
                    const file = new File([blob], "clipboard-image.png", { type: blob.type });

                    await tesseractParsing(file);
                    setImageUploading(false);
                    return;
                }
            }

            setAlertDialogError("No image found in clipboard.")
            setAlertDialogBoolean(true);
        } catch (err) {
            console.error("Failed to read from clipboard", err);
            setAlertDialogError("Clipboard access failed, please ensure your browser supports image reading.")
            setAlertDialogBoolean(true);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full items-center">
            {/* Drag & Drop Zone */}
            <div
                className="w-[90%] h-72 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center transition p-6 gap-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        handleFileChange({ target: { files } } as any);
                    }
                }}
            >

                { imageUploading ? (
                    <div className={"flex flex-col gap-5 items-center justify-center"}>
                        <Loader2 className="animate-spin w-10 h-10 mr-2" />
                        <span className="text-sm md:text-md lg:text-lg font-medium text-white">
                        Uploading...
                        </span>
                    </div>
                ) : (
                    <div className={"flex flex-col gap-2 items-center justify-center"}>
                         {/* Optional graphic/icon */}
                        <img
                            src={fileIconBig}
                            alt="Upload Icon"
                            className="w-22 h-22 mb-2"
                        />

                        {/* Drag & Drop Text */}
                        <span className="text-sm md:text-md lg:text-lg font-medium text-white">
                        Drag & Drop Image Here
                        </span>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            id="ocr-file-input"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </div>
                )
                }


                {/* Or separator */}
                <div className="flex items-center w-full justify-center gap-2 text-background font-medium my-2 text-white">
                    <span className="border-t border-gray-300 flex-1 mt-1"></span>
                    <span>Or</span>
                    <span className="border-t border-gray-300 flex-1 mt-1"></span>
                </div>

                {/* Buttons inside container */}
                <div className="flex gap-4 w-full justify-center">
                    <Button
                        onClick={() => document.getElementById("ocr-file-input")?.click()}
                        disabled={imageUploading}
                        variant="outline"
                        className="flex-1 h-12 text-sm md:text-md lg:text-lg font-medium"
                    >
                        Browse Files
                    </Button>
                    <Button
                        onClick={handleClipboardImage}
                        disabled={imageUploading}
                        variant="outline"
                        className="flex-1 h-12 text-sm md:text-md lg:text-lg font-medium"
                    >
                        Upload from Clipboard
                    </Button>
                </div>
            </div>
        </div>
    );

};

export default ImageOCRUploader;
