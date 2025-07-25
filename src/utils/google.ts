// Declare global type fallback
declare const google: any;

let accessToken: string | null = null;

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
                    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly",
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
                resolve();
            }
        };

        tokenClient.requestAccessToken();
    });
}

export function getAccessToken(): string | null {
    return accessToken;
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

export const createPicker = (
    token: string,
    callback: (spreadsheetId: string) => void
) => {
    const view = new google.picker.View(google.picker.ViewId.SPREADSHEETS);

    const picker = new google.picker.PickerBuilder()
        .setOAuthToken(token)
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
    rarity: "none" | "common" | "rare" | "superrare";
}

const rarityMap: Record<Character["rarity"], number> = {
    none: 0,
    common: 2,
    rare: 4,
    superrare: 5,
};

export async function appendCharactersToSheet(
    spreadsheetId: string | null,
    sheetName: string,
    characters: (Character | null)[],
    bannerSublabel: string,
    position: string,
    date: Date,
    time: string
): Promise<void> {
    const token = getAccessToken();
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
        position,
    ]);

    if (rows.length === 0) return;

    const range = `${sheetName}!A:E`; // Adjust columns if needed

    // @ts-ignore
    // @ts-ignore
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

