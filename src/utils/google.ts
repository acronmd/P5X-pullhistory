// Declare global type fallback
declare const google: any;

import type { pullData } from "@/components/ImageOCRUploader"

import { IDMap } from "@/components/CharacterPicker";

import { toUnixWithOffset } from "@/utils/sharedFunctions.tsx";
import { getContractId} from "@/utils/sharedFunctions.tsx";

let accessToken: string | null = null;
let tokenExpiry: number | null = null; // unix timestamp (ms)

export let tokenClient: google.accounts.oauth2.TokenClient | null = null;

export function initGoogleClient(clientId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        gapi.load("client", async () => {
            try {
                await gapi.client.init({
                    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
                });

                // Create tokenClient with no callback initially
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: "https://www.googleapis.com/auth/drive.file",
                    callback: () => {}, // placeholder, will override below
                });

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    });
}

export function signIn(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject("Token client not initialized");
            return;
        }

        (tokenClient as any).callback = (resp: any) => {
            if (resp.error) {
                reject(resp.error);
            } else {
                accessToken = resp.access_token;
                tokenExpiry = Date.now() + (resp.expires_in * 1000); // expires_in is in seconds
                resolve();
            }
        };

        tokenClient.requestAccessToken();
    });
}

export async function getValidAccessToken(): Promise<string> {
    if (!accessToken) {
        throw new Error("No access token yet — user not signed in");
    }

    if (accessToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
        // still valid (with 1min buffer)
        return accessToken;
    }

    // refresh silently
    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject("Token client not initialized");
            return;
        }

        (tokenClient as any).callback = (resp: { error?: any; access_token?: string; expires_in?: number }) => {
            if (resp.error) {
                reject(resp.error);
            } else if (resp.access_token) {
                accessToken = resp.access_token;
                tokenExpiry = Date.now() + (resp.expires_in! * 1000);
                resolve(accessToken);
            } else {
                reject("No access token returned");
            }
        };

        tokenClient.requestAccessToken({ prompt: "" });
    });
}




export const requestAccessToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject("Token client not initialized");
            return;
        }

        // Temporarily override the callback to resolve/reject the promise:
        (tokenClient as any).callback = (resp: { error?: any; access_token?: string }) => {
            if (resp.error) {
                reject(resp.error);
            } else if (resp.access_token) {
                accessToken = resp.access_token;
                resolve(accessToken);
            } else {
                reject("No access token returned");
            }
        };


        // Request the token; no args needed here
        tokenClient.requestAccessToken();
    });
};

export async function loadPicker(): Promise<void> {
    return new Promise((resolve) => {
        gapi.load("picker", () => {
            resolve();
        });
    });
}

/*
export const createPicker = (
    callback: (spreadsheetId: string) => void
) => {
    const view = new google.picker.View(google.picker.ViewId.SPREADSHEETS);

    const picker = new google.picker.PickerBuilder()
        .setOAuthToken(getAccessToken())
        .addView(view)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_SHEETS_API_KEY)
        .setCallback((data: any) => {
            if (data.action === google.picker.Action.PICKED) {
                const doc = data.docs[0];
                callback(doc.id); // This is the spreadsheetId
            }
        })
        .build();

    picker.setVisible(true);
};
 */

export const createPicker = async (callback: (spreadsheetId: string) => void) => {
    const token = await getValidAccessToken(); // <-- await

    const view = new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
        .setMode(google.picker.DocsViewMode.CREATE);

    const picker = new google.picker.PickerBuilder()
        .setOAuthToken(token) // <-- real string
        .addView(view)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_SHEETS_API_KEY)
        .setAppId("834180572925")
        .setCallback((data: any) => {
            if (data.action === google.picker.Action.PICKED) {
                const doc = data.docs[0];
                callback(doc.id);
            }
        })
        .build();

    picker.setVisible(true);
};



export const signOut = () => {
    const token = gapi.client.getToken();
    if (token) {
        google.accounts.oauth2.revoke(token.access_token, () => {
            gapi.client.setToken(null);
        });
    }
};

interface Character {
    name: string;
    rarity: "none" | "common" | "standard" | "rare" | "superrare";
}

const rarityMap: Record<Character["rarity"], number> = {
    none: 0,
    common: 2,
    standard: 3,
    rare: 4,
    superrare: 5,
};

export async function appendCharactersToSheet(
    spreadsheetId: string | null,
    sheetName: string,
    characters: (Character | null)[],
    bannerSublabel: string,
    date: Date,
    time: string
): Promise<void> {
    const token = getValidAccessToken();
    if (!token) throw new Error("Access token is missing");

    const validCharacters = characters.filter(
        (char): char is Character =>
            char !== null && char.rarity !== null && char.rarity !== "none"
    );

    const rows = validCharacters.map((char) => [
        rarityMap[char.rarity],
        char.name,
        bannerSublabel,
        date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0") + " " + time,
    ]);

    if (rows.length === 0) return;

    const range = `${sheetName}!A:E`; // Adjust columns if needed

    await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
            values: rows,
        },
    });
}

export async function appendCharactersToSheetWithOCR(
    spreadsheetId: string | null,
    sheetName: string,
    ocrResultArray: pullData[],
    bannerSublabel: string,
): Promise<void> {
    const token = getValidAccessToken();
    if (!token) throw new Error("Access token is missing");

    const rows = ocrResultArray.map((data) => {

        const rarity = rarityMap[data.matchedCharacter.rarity];

        return [
            rarity,
            getContractId(bannerSublabel),
            toUnixWithOffset(data.timestampFull, "JST"),
            data.matchedCharacter.id,
            "123",
            data.name,
            data.matchedCharacter.name_en,
            data.matchedCharacter.name_ko,
        ];
    });

    if (rows.length === 0) return;

    const range = `${sheetName}!A:H`; // Adjust columns if needed

    await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
            values: rows
        },
    });
}
/*
export async function appendCharactersToSheetWithAPI(
    spreadsheetId: string,
    sheetName: string,
    bannerData: any,
): Promise<void> {
    const token = getAccessToken();
    if (!token) throw new Error("Access token is missing");

    if (!bannerData || bannerData.length === 0) {
        return;
    }

    const rows = bannerData.map((pull: any) => {
        const mapped = IDMap[pull.id];
        return [
        pull.rarity,
        pull.gachaType,
        pull.timestamp,
        pull.id,
        pull.gachaId,
        pull.name,
        mapped?.name_en ?? "",
        mapped?.name_ko ?? "",
        ]
    });

    const range = `${sheetName}!A:H`; // Adjust columns if needed

    await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
            values: rows,
        },
    });
}

 */

// Normalizes a gachaId coming from the sheet or API into a comparable string.
// Also strips a leading apostrophe if present.
function normalizeId(v: unknown): string {
    const s = String(v ?? "").trim();
    return s.startsWith("'") ? s.slice(1) : s;
}

export async function appendCharactersToSheetWithAPI(
    spreadsheetId: string,
    sheetName: string,
    bannerData: any[],
): Promise<void> {
    const token = getValidAccessToken();
    if (!token) throw new Error("Access token is missing");
    if (!bannerData || bannerData.length === 0) {
        console.log("No banner data → nothing to do");
        return;
    }

    // 1) Read existing rows
    const existingResp = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:H`,
    });

    const existingValues: string[][] = existingResp.result.values || [];
    const existingIds = existingValues.map(row => normalizeId(row?.[4]));

    // 2) Prepare incoming IDs (strings)
    const incomingIds = bannerData.map(p => normalizeId(p.gachaId));
    const incomingIdSet = new Set(incomingIds);

    // 3) Find the FIRST row in the sheet that matches ANY incoming gachaId
    //    (this is where we start replacing to kill any "garbage" below it)
    const firstMatchRow = existingIds.findIndex(id => id && incomingIdSet.has(id));

    // 4) Build rows to write. We prefix the gachaId with an apostrophe to force TEXT in Sheets
    //    so it won’t become 3.94E+16 and break matching later.
    const rows = bannerData.map(pull => {
        const mapped = IDMap[pull.id];
        const gachaStr = normalizeId(pull.gachaId);
        return [
            pull.rarity,
            pull.gachaType,
            pull.timestamp,
            pull.id,
            `'${gachaStr}`,                // <-- force TEXT in Sheets
            pull.name,
            mapped?.name_en ?? "",
            mapped?.name_ko ?? "",
        ];
    });

    // 5) If the sheet is empty, just append everything.
    if (existingValues.length === 0) {
        console.log("Sheet empty → append all");
        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:H`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: { values: rows },
        });
        return;
    }

    // 6) If no match at all, append everything to the end (history cutoff case).
    if (firstMatchRow === -1) {
        console.log("No matches → append all at end");
        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:H`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: { values: rows },
        });
        return;
    }

    // 7) We DO have a match inside the sheet.
    //    Find where that same ID sits in the incoming list so we align slices.
    const matchedId = existingIds[firstMatchRow];
    const startIncomingIdx = incomingIds.indexOf(matchedId); // guaranteed ≥ 0 because of the set check

    // 8) Clear from the first matched row *inclusive* down to the last used row,
    //    so the matched row (“3” in your example) and everything after it is replaced.
    const startRow = firstMatchRow + 1;                // 1-based for Sheets
    const endRow = existingValues.length;
    console.log(`First match at row ${startRow}. Clearing ${sheetName}!A${startRow}:H${endRow}`);
    await gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetName}!A${startRow}:H${endRow}`,
        resource: {},
    });

    // 9) Append only the tail of incoming rows starting from the matched ID.
    const toAppend = rows.slice(startIncomingIdx);
    console.log(`Appending ${toAppend.length} rows from incoming index ${startIncomingIdx}`);
    await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A${startRow}:H`,
        valueInputOption: "RAW",
        insertDataOption: "OVERWRITE", // replaces in-place instead of shifting down
        resource: { values: toAppend },
    });

}

