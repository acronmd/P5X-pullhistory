interface Pull {
    name: string;
    name_en: string;
    name_ko: string;
    id: number;
    gachaId: number;
    rarity: 4 | 5;
    index: number;
    time: string;
    pity: number;
    iconUrl: string;
    fullIconUrl: string;
    assChara?: string;
}

import type { heroBanner } from "@/utils/allHeroBanners.ts";

interface MostPulled {
    name: string;
    name_en: string;
    name_ko: string;
    id: number;
    gachaId: number;
    count: number;
    iconUrl: string;
    fullIconUrl: string;
    time: string;
    assChara?: string;
    rarity?: 4 | 5;
}

type MostPulledList = MostPulled[];

interface PullStats {
    fiftyFiftyWins: number;
    fiftyFiftyAttempts: number;
    fiftyFiftyRate: number;
    mostPulled5StarLimited?: MostPulled;
    mostPulled5StarStandard?: MostPulled;
    mostPulled4Star?: MostPulled;
    allMostPulled: MostPulledList;
}


export function calculatePullStats(
    allPulls: Pull[][],
    all5Stars: Pull[],
    all4Stars: Pull[],
    allHeroBanners: heroBanner[]
): PullStats {
    let fiftyFiftyWins = 0;
    let fiftyFiftyAttempts = 0;
    let waitingForGuaranteed = false;

    const counts5Limited: Record<string, { count: number; lastPull: Pull }> = {};
    const counts5Standard: Record<string, { count: number; lastPull: Pull }> = {};
    const counts4: Record<string, { count: number; lastPull: Pull }> = {};

    const allPullsMapped: Pull[] = allPulls.map((row, index) => ({
        rarity: Number(row[0]),       // '4' -> 4
        time: row[2],
        id: row[3],
        gachaId: row[4],
        name: row[5],
        name_en: row[6] as unknown as string,
        name_ko: row[7] as unknown as string,
        index: index                   // assign sequential index
    }));


    // Split 5★ into limited vs standard
    for (const pull of all5Stars) {
        const isLimited = allHeroBanners.some(
            (b) => b.hero_id == pull.id || b.weapon_id == pull.id
        );

        const target = isLimited ? counts5Limited : counts5Standard;

        if (!target[pull.id]) {
            target[pull.id] = { count: 0, lastPull: pull };
        }
        target[pull.id].count++;
        target[pull.id].lastPull = pull;
    }

    // Count most pulled for 4★
    for (const pull of all4Stars) {
        if (!counts4[pull.id]) {
            counts4[pull.id] = { count: 0, lastPull: pull };
        }
        counts4[pull.id].count++;
        counts4[pull.id].lastPull = pull;
    }

    function getAllPulledCombined(pulls: Pull[]): (Pull & { count: number })[] {
        const counts: Record<string, { count: number; lastPull: Pull }> = {};

        for (const pull of pulls) {
            if( pull.rarity < 4 ) {
                continue;
            }
            const key = pull.id; // or some unique identifier
            if (!counts[key]) {
                counts[key] = { count: 0, lastPull: pull };
            }
            counts[key].count++;
            counts[key].lastPull = pull;
        }

        return Object.values(counts)
            .map(entry => ({
                ...entry.lastPull,
                count: entry.count,
                assChara: entry.lastPull.assChara ?? "Unknown",
            }))
            .sort((a, b) => {
                if (b.count !== a.count) return b.count - a.count;
                return b.index - a.index;
            });
    }




    function findMostPulled(
        counts: Record<string, { count: number; lastPull: Pull }>
    ): MostPulled | undefined {
        const data = Object.values(counts).reduce(
            (max, cur) => {
                if (cur.count > max.count) return cur;
                if (cur.count === max.count) {
                    return cur.lastPull.index > max.lastPull.index ? cur : max;
                }
                return max;
            },
            { count: 0, lastPull: undefined as unknown as Pull }
        );

        return data.count > 0
            ? {
                name: data.lastPull.name,
                name_en: data.lastPull.name_en,
                name_ko: data.lastPull.name_ko,
                id: data.lastPull.id,
                gachaId: data.lastPull.gachaId,
                count: data.count,
                iconUrl: data.lastPull.iconUrl,
                fullIconUrl: data.lastPull.fullIconUrl,
                time: data.lastPull.time,
                assChara: data.lastPull.assChara,
                rarity: data.lastPull.rarity,
            }
            : undefined;
    }

    const mostPulled5StarLimited = findMostPulled(counts5Limited);
    const mostPulled5StarStandard = findMostPulled(counts5Standard);
    const mostPulled4Star = findMostPulled(counts4);
    const allMostPulled = getAllPulledCombined(allPullsMapped)


    // 50/50 calculation
    for (const pull of all5Stars) {
        const isBannerLimited = allHeroBanners.some(
            (b) => b.hero === pull.name_en || b.weapon === pull.name_en
        );

        if (waitingForGuaranteed) {
            waitingForGuaranteed = false; // skip guaranteed
        } else {
            fiftyFiftyAttempts++;
            if (isBannerLimited) {
                fiftyFiftyWins++;
            } else {
                waitingForGuaranteed = true;
            }
        }
    }

    const fiftyFiftyRate =
        fiftyFiftyAttempts > 0
            ? (fiftyFiftyWins / fiftyFiftyAttempts) * 100
            : 0;

    return {
        fiftyFiftyWins,
        fiftyFiftyAttempts,
        fiftyFiftyRate,
        mostPulled5StarLimited,
        mostPulled5StarStandard,
        mostPulled4Star,
        allMostPulled
    };
}
