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
    mostPulled5Star?: MostPulled;
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

    const counts5: Record<string, { count: number; lastPull: Pull }> = {};
    const counts4: Record<string, { count: number; lastPull: Pull }> = {};

    // Count most pulled for 5★
    for (const pull of all5Stars) {
        if (!counts5[pull.name]) {
            counts5[pull.name] = { count: 0, lastPull: pull };
        }
        counts5[pull.name].count++;
        counts5[pull.name].lastPull = pull;
    }

    // Count most pulled for 4★
    for (const pull of all4Stars) {
        if (!counts4[pull.name]) {
            counts4[pull.name] = { count: 0, lastPull: pull };
        }
        counts4[pull.name].count++;
        counts4[pull.name].lastPull = pull;
    }

    // Determine most pulled 5★
    const mostPulled5StarData = Object.values(counts5).reduce(
        (max, cur) => {
            if (cur.count > max.count) return cur; // higher count wins
            if (cur.count === max.count) {
                // tie → prefer newest pull
                return cur.lastPull.index > max.lastPull.index ? cur : max;
            }
            return max;
        },
        { count: 0, lastPull: all5Stars[0] } // initial value
    );

    const mostPulled5Star: MostPulled | undefined =
        mostPulled5StarData.count > 0
            ? {
                name: mostPulled5StarData.lastPull.name,
                count: mostPulled5StarData.count,
                iconUrl: mostPulled5StarData.lastPull.iconUrl,
                fullIconUrl: mostPulled5StarData.lastPull.fullIconUrl,
                time: mostPulled5StarData.lastPull.time,
            }
            : undefined;


    // Determine most pulled 4★
    const mostPulled4StarData = Object.values(counts4).reduce(
        (max, cur) => {
            if (cur.count > max.count) return cur;
            if (cur.count === max.count) {
                return cur.lastPull.index > max.lastPull.index ? cur : max;
            }
            return max;
        },
        { count: 0, lastPull: all4Stars[0] }
    );

    const mostPulled4Star: MostPulled | undefined =
        mostPulled4StarData.count > 0
            ? {
                name: mostPulled4StarData.lastPull.name,
                count: mostPulled4StarData.count,
                iconUrl: mostPulled4StarData.lastPull.iconUrl,
                fullIconUrl: mostPulled4StarData.lastPull.fullIconUrl,
                time: mostPulled4StarData.lastPull.time,
            }
            : undefined;


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
        mostPulled5Star,
        mostPulled4Star,
    };
}
