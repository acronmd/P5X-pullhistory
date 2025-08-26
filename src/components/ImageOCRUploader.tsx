import React from 'react';
import Tesseract from 'tesseract.js';

import { Button } from "@/components/ui/button";

import { availableCharacters } from "@/components/CharacterPicker";
import { availableWeapons } from "@/components/CharacterPicker"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

const CHARACTER_NAMES = availableCharacters.map(c => c.name);
const WEAPON_NAMES = availableWeapons.map(c => c.name);

const MISTAKEN_NAMES_MAP: Record<string, string> = {
    "Agathlon": "Agathion",
    "Jack-o0'-Lantern": "Jack-o'-Lantern",
    "Jack-o-Lantern": "Jack-o'-Lantern",
    "Jack-0'-Lantern": "Jack-o'-Lantern",
    "Jack-O'-Lantern": "Jack-o'-Lantern",
    "Jack-O-Lantern": "Jack-o'-Lantern",
    "Jack-0-Lantern": "Jack-o'-Lantern",
    "Jack-o0-Lantern": "Jack-o'-Lantern",
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
};

export type pullData = {
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

        let itemName: string | undefined;
        // Step 1: Find the character name
        /* Weapon */
        if (sublabel == "Arms Deals" || sublabel == "Arms Deal"){
            itemName = WEAPON_NAMES.find(name => cleaned.includes(name));
        }
        /* Limited and Standard */
        else{
            itemName = CHARACTER_NAMES.find(name => cleaned.includes(name));
        }
        if (itemName == undefined) {
            console.log("Tesseract unknown names: " + line);
            continue;
        }

        // Step 2: Slice everything after the character name
        const afterName = cleaned.slice(cleaned.indexOf(itemName) + itemName.length).trim();

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
            console.log(itemName + " was recognized but could not find a timestamp");
            continue;
        }

        pulls.push({
            name: itemName,
            contractType,
            timestampFull,
        });
    }

    return pulls;
}

const ImageOCRUploader: React.FC<Props> = ({ onTextExtracted, setAlertDialogBoolean, setAlertDialogError, currentBannerSublabel }) => {

    async function tesseractParsing(file: File) {
        const {data} = await Tesseract.recognize(file, 'eng');
        ///This is where I can parse data before sending it back
        const parsedData = parseOcrPulls(data.text, currentBannerSublabel);

        onTextExtracted(parsedData); // send formatted string
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        await tesseractParsing(file);
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
        <div className={"flex flex-row gap-5"}>
                    <Button
                        onClick={() => {
                            document.getElementById('ocr-file-input')?.click()}
                        }
                        variant="outline"
                    >
                        Upload Image
                        <input
                            type="file"
                            id="ocr-file-input"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </Button>
                    <Button
                        onClick={() => {
                        handleClipboardImage()
                        }}
                        variant="outline"
                    >
                        Select Image from Clipboard
                     </Button>
        </div>
    );
};

export default ImageOCRUploader;
