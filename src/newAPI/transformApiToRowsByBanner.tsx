import {transformBannerData} from "@/newAPI/transformApiToRows.tsx";

type SheetRow = {
    timestamp: number;
    name: string;
    rarity: number;
    gachaType: number;
    id: number;
    gachaId: number;
};

export function transformApiToRowsByBanner(apiData: any): Record<string, SheetRow[]> {
    const rowsByBanner: Record<string, SheetRow[]> = {};

    for (const bannerName in apiData.data) {
        const bannerData = apiData.data[bannerName];
        rowsByBanner[bannerName] = transformBannerData(bannerData);
    }

    return rowsByBanner;
}
