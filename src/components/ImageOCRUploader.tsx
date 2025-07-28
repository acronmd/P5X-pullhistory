import React from 'react';
import Tesseract from 'tesseract.js';

import { Button } from "@/components/ui/button";

import { availableCharacters } from "@/components/CharacterPicker";

const CHARACTER_NAMES = availableCharacters.map(c => c.name);

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
    "Toshia Sumi": "Toshiya Sumi",
    "Pixy": "Pixie",
    "Nekamata": "Nekomata",
    // Add more corrections here
};

export type pullData = {
    name: string;
    contractType: string;
    timestampFull: string;
};

type Props = {
    onTextExtracted: (data: pullData[]) => void;
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

function parseOcrPulls(rawText: string) {
    const lines = rawText.split('\n');
    const pulls = [];

    for (const line of lines) {
        const cleaned = correctMistakenNames(line.trim());

        // Step 1: Find the character name
        const charName = CHARACTER_NAMES.find(name => cleaned.includes(name));
        if (!charName) {
            console.log(line);
            continue;
        }

        // Step 2: Slice everything after the character name
        const afterName = cleaned.slice(cleaned.indexOf(charName) + charName.length).trim();

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

        pulls.push({
            name: charName,
            contractType,
            timestampFull,
        });
    }

    return pulls;
}


const ImageOCRUploader: React.FC<Props> = ({ onTextExtracted }) => {
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const { data } = await Tesseract.recognize(file, 'eng');
        ///This is where I can parse data before sending it back
        const parsedData = parseOcrPulls(data.text);

        onTextExtracted(parsedData); // send formatted string
    };

    return (
        <Button
            onClick={() => document.getElementById('ocr-file-input')?.click()}
            variant="outline"
            className="w-32 font-normal"
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
    );
};

export default ImageOCRUploader;
