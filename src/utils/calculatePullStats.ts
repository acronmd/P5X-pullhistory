interface Pull {
    name: string;
    rarity: 4 | 5;
    index: number;
    time: string;
    pity: number;
    iconUrl: string;
    fullIconUrl: string;
    assChara?: string;
}

interface HeroBanner {
    hero?: string;
    weapon?: string;
}

interface MostPulled {
    name: string;
    count: number;
    iconUrl: string;
    fullIconUrl: string;
    time: string;
    assChara?: string;
}

interface PullStats {
    fiftyFiftyWins: number;
    fiftyFiftyAttempts: number;
    fiftyFiftyRate: number;
    mostPulled5StarLimited?: MostPulled;
    mostPulled5StarStandard?: MostPulled;
    mostPulled4Star?: MostPulled;
}

export function calculatePullStats(
    all5Stars: Pull[],
    all4Stars: Pull[],
    allHeroBanners: HeroBanner[]
): PullStats {
    let fiftyFiftyWins = 0;
    let fiftyFiftyAttempts = 0;
    let waitingForGuaranteed = false;

    const counts5Limited: Record<string, { count: number; lastPull: Pull }> = {};
    const counts5Standard: Record<string, { count: number; lastPull: Pull }> = {};
    const counts4: Record<string, { count: number; lastPull: Pull }> = {};

    // Split 5★ into limited vs standard
    for (const pull of all5Stars) {
        const isLimited = allHeroBanners.some(
            (b) => b.hero === pull.name || b.weapon === pull.name
        );

        const target = isLimited ? counts5Limited : counts5Standard;

        if (!target[pull.name]) {
            target[pull.name] = { count: 0, lastPull: pull };
        }
        target[pull.name].count++;
        target[pull.name].lastPull = pull;
    }

    // Count most pulled for 4★
    for (const pull of all4Stars) {
        if (!counts4[pull.name]) {
            counts4[pull.name] = { count: 0, lastPull: pull };
        }
        counts4[pull.name].count++;
        counts4[pull.name].lastPull = pull;
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
                count: data.count,
                iconUrl: data.lastPull.iconUrl,
                fullIconUrl: data.lastPull.fullIconUrl,
                time: data.lastPull.time,
                assChara: data.lastPull.assChara,
            }
            : undefined;
    }

    const mostPulled5StarLimited = findMostPulled(counts5Limited);
    const mostPulled5StarStandard = findMostPulled(counts5Standard);
    const mostPulled4Star = findMostPulled(counts4);


    // 50/50 calculation
    for (const pull of all5Stars) {
        const isBannerLimited = allHeroBanners.some(
            (b) => b.hero === pull.name || b.weapon === pull.name
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
    };
}
