import { availableCharacters } from "@/components/CharacterPicker";
import { availableWeapons } from "@/components/CharacterPicker";

const ICON_DATA: Record<
    string,
    { icon: string; fullIcon: string; assChara?: string }
> = {
    ...availableCharacters.reduce((map, char) => {
        map[char.name.toLowerCase()] = {
            icon: char.modalsrc,
            fullIcon: char.collectionsrc,
        };
        return map;
    }, {} as Record<string, { icon: string; fullIcon: string }>),
    ...availableWeapons.reduce((map, weapon) => {
        map[weapon.name.toLowerCase()] = {
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
        const val = String(data[i][0] || "").trim();
        const name = String(data[i][1] || "").trim();
        pityCounter4++;
        pityCounter5++;

        const entry = ICON_DATA[name.toLowerCase()] || {
            icon: new URL(`../assets/chicons/modal/basic.png`, import.meta.url).href,
            fullIcon: new URL(`../assets/chicons/collection/basic.png`, import.meta.url).href,
        };

        if (val) counts[val] = (counts[val] || 0) + 1;

        if (val === "5") {
            pityGaps5.push(last5Index === null ? i + 1 : i - last5Index);
            last5Index = i;
            all5Stars.push({
                name,
                pity: pityCounter5,
                index: i,
                iconUrl: entry.icon,
                fullIconUrl: entry.fullIcon,
                assChara: entry.assChara,
                time: data[i][3] || "",
                rarity: 5
            });
            pityCounter5 = 0;
        }

        if (val === "4") {
            pityGaps4.push(last4Index === null ? i + 1 : i - last4Index);
            last4Index = i;
            all4Stars.push({
                name,
                pity: pityCounter4,
                index: i,
                iconUrl: entry.icon,
                fullIconUrl: entry.fullIcon,
                assChara: entry.assChara,
                time: data[i][3] || "",
                rarity: 4
            });
            pityCounter4 = 0;
        }

        for (let i = data.length - 1; i >= 0; i--) {
            const val = String(data[i][0] || "").trim();

            if (sinceLast5 === -1 && val === "5") {
                sinceLast5 = data.length - i - 1;
            }
            if (sinceLast4 === -1 && val === "4") {
                sinceLast4 = data.length - i - 1;
            }
            if (sinceLast5 !== -1 && sinceLast4 !== -1) break;
        }
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
