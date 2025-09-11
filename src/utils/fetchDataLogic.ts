import { availableCharacters } from "@/components/CharacterPicker";
import { availableWeapons } from "@/components/CharacterPicker";

const ICON_DATA: Record<
    string,
    { icon: string; fullIcon: string; assChara?: string }
> = {
    ...availableCharacters.reduce((map, char) => {
        map[char.name_en.toLowerCase()] = {
            icon: char.modalsrc,
            fullIcon: char.collectionsrc,
        };
        return map;
    }, {} as Record<string, { icon: string; fullIcon: string }>),
    ...availableWeapons.reduce((map, weapon) => {
        map[weapon.name_en.toLowerCase()] = {
            icon: weapon.modalsrc,
            fullIcon: weapon.collectionsrc,
            assChara: weapon.assChara, // optional
        };
        return map;
    }, {} as Record<string, { icon: string; fullIcon: string; assChara?: string }>)
};


export async function fetchDataForSheet(sheetName: string) {
    await gapi.client.load("sheets", "v4");
    const res = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: localStorage.getItem("sharedSpreadsheetId") ?? "",
        range: sheetName,
    });

    const data: string[][] = res.result.values || [];

    const counts: Record<string, number> = {};
    const pityGaps5: number[] = [];
    const pityGaps4: number[] = [];
    let all5Stars: any[] = [];
    let all4Stars: any[] = [];
    let sinceLast5 = -1;
    let sinceLast4 = -1;

    let last5Index: number | null = null;
    let last4Index: number | null = null;
    let pityCounter4 = 0;
    let pityCounter5 = 0;

    for (let i = 0; i < data.length; i++) {
        const rarityVal = String(data[i][0] || "").trim();
        const name_en = String(data[i][6] || "").trim();
        pityCounter4++;
        pityCounter5++;

        const entry = ICON_DATA[name_en.toLowerCase()] || {
            icon: new URL(`../assets/chicons/modal/basic.png`, import.meta.url).href,
            fullIcon: new URL(`../assets/chicons/collection/basic.png`, import.meta.url).href,
        };

        if (rarityVal) counts[rarityVal] = (counts[rarityVal] || 0) + 1;

        if (rarityVal === "5") {
            pityGaps5.push(last5Index === null ? i + 1 : i - last5Index);
            last5Index = i;
            all5Stars.push({
                name: data[i][5],
                name_en: data[i][6],
                name_ko: data[i][7],
                pity: pityCounter5,
                index: i,
                iconUrl: entry.icon,
                fullIconUrl: entry.fullIcon,
                assChara: entry.assChara,
                time: data[i][2] || "",
                rarity: 5,
                id: data[i][3],
                gachaId: data[i][4]
            });
            pityCounter5 = 0;
        }

        if (rarityVal === "4") {
            pityGaps4.push(last4Index === null ? i + 1 : i - last4Index);
            last4Index = i;
            all4Stars.push({
                name: data[i][5],
                name_en: data[i][6],
                name_ko: data[i][7],
                pity: pityCounter4,
                index: i,
                iconUrl: entry.icon,
                fullIconUrl: entry.fullIcon,
                assChara: entry.assChara,
                time: data[i][2] || "",
                rarity: 4,
                id: data[i][3],
                globalId: data[i][4]
            });
            pityCounter4 = 0;
        }

        // After finishing the main loop:
        for (let i = data.length - 1; i >= 0; i--) {
            if (sinceLast5 === -1 && data[i][0] === "5") {
                sinceLast5 = data.length - i - 1;
            }
            if (sinceLast4 === -1 && data[i][0] === "4") {
                sinceLast4 = data.length - i - 1;
            }
            if (sinceLast5 !== -1 && sinceLast4 !== -1) break;
        }

        // If no 5★ or 4★ found at all, just use total pulls
        if (sinceLast5 === -1) sinceLast5 = data.length;
        if (sinceLast4 === -1) sinceLast4 = data.length;

    }

    const avg = (arr: number[]) =>
        arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
        total: data.length,
        rarityCounts: counts,
        rarityPercents: Object.fromEntries(
            Object.entries(counts).map(([r, c]) => [r, (c / data.length) * 100])
        ),
        avgPity5: avg(pityGaps5),
        avgPity4: avg(pityGaps4),
        sinceLast5,
        sinceLast4,
        all5Stars,
        all4Stars,
        allPulls: data,
    };
}
