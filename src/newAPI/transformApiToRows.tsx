type SheetRow = {
    timestamp: number;
    name: string;
    rarity: number;
    gachaType: number;
    id: number;
    gachaId: number;
};

export function transformBannerData(bannerData: any): SheetRow[] {
    const rows: SheetRow[] = [];

    if (!bannerData?.records) return rows;

    // Loop over records from oldest to newest
    for (let i = bannerData.records.length - 1; i >= 0; i--) {
        const rec = bannerData.records[i];

        // Pulls are already sorted newest → oldest, so keep the order
        for (const pull of rec.record) {
            rows.push({
                name: pull.name,
                rarity: pull.grade,
                gachaType: pull.gachaType,
                timestamp: pull.timestamp,
                id: pull.id,
                gachaId: pull.gachaId
            });
        }
    }

    return rows;
}
