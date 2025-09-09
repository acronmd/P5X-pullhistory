import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import jewelImage from "@/assets/jewels.png";

import { ArrowLeft } from "lucide-react"; // optional icon from lucide

import RarityPieChart from "@/components/PieChart.tsx"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import PullTableCard from "@/components/ViewTable.tsx"
import PullCountViewTable from "@/components/PullCountViewTable.tsx"

import { formatPullTime } from "@/utils/sharedFunctions.tsx"
import LuckiestPullsCarousel from "@/components/LuckyPullsCarousel.tsx";

import { calculatePullStats } from "@/utils/calculatePullStats";
import { allHeroBanners } from "@/utils/allHeroBanners.ts";

import { SquareCard } from "@/components/SquareCard.tsx"
import { MostPulledCard } from "@/components/MostPulledCard";
import { PityPlanCard } from "@/components/PityPlanCard.tsx";

import { getLocalizedNameFallback } from "@/utils/sharedFunctions.tsx";

import { useLanguage } from "@/utils/language.tsx";

import '@/colors.css';
import {IDMap} from "@/components/CharacterPicker.tsx";

export default function LimitedPage() {
    const { language } = useLanguage();

    const [viewMode, setViewMode] = useState<"scroll" | "grid">("scroll")
    const [show5Stars, setShow5Stars] = useState(true);
    const [show4Stars, setShow4Stars] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // The data you passed via router state
    const bannerData = location.state?.bannerData;
    const bannerCurrent = location.state?.datasetInfo;

    if (!bannerData) {
        return <div>No data found. Please navigate here from the Viewer page.</div>;
    }

    // Now you can destructure or use bannerData anywhere in your component
    const {
        total,
        sinceLast5,
        sinceLast4,
        avgPity5,
        avgPity4,
        rarityCounts,
        rarityPercents,
        all5Stars,
        all4Stars,
        allPulls,
    } = bannerData;

    const { fiftyFiftyWins, fiftyFiftyAttempts, fiftyFiftyRate, mostPulled5StarLimited, mostPulled5StarStandard, mostPulled4Star, allMostPulled } =
        calculatePullStats(allPulls, all5Stars, all4Stars, allHeroBanners);


    const combinedStars = [
        ...(show5Stars ? all5Stars : []),
        ...(show4Stars ? all4Stars : []),
    ].sort((a, b) => b.index - a.index);

    const top5LowestPityCharacters = [...all5Stars]
        .sort((a, b) => {
            // Sort by pity ascending first
            if (a.pity !== b.pity) return a.pity - b.pity;
            // If same pity, pick the more recent one (higher index)
            return b.index - a.index;
        })
        .slice(0, 5); // Take the first 5


    function getPityColor(pity: number, rarity: number) {
        const maxPity = rarity === 5 ? 80 : 10;
        const ratio = Math.min(pity / maxPity, 1);

        let r, g, b;

        if (ratio <= 0.5) {
            // Green → Yellow
            const t = ratio / 0.5;
            r = Math.floor(0 + (255 - 0) * t); // 0 → 255
            g = 255;
            b = 0;
        } else {
            // Yellow → Red
            const t = (ratio - 0.5) / 0.5;
            r = 255;
            g = Math.floor(255 - (255 - 77) * t); // 255 → 77
            b = Math.floor(0 + (77 - 0) * t); // 0 → 77 (slightly warmer red)
        }

        return `rgb(${r}, ${g}, ${b})`;
    }

    return (
        <div>
            <Card className="sticky top-0 z-50 w-full bg-coloredbg shadow-md">
                <CardContent className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" /> {/* icon color */}
                    </button>
                    <h1 className="text-lg font-bold text-white">{bannerCurrent.label}</h1> {/* text color */}
                </CardContent>
            </Card>
            <div className={"flex flex-col gap-4"}>
                <div className="mt-4 flex flex-wrap lg:flex-nowrap gap-5">
                    <Card className="px-4">
                        <div className={"flex flex-col gap-3"}>
                            <div className={`rounded-xl bg-rarity-3 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
                                <div className="flex items-center justify-center h-full">
                                    {/* Label section */}
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div>
                                            <p className="text-lg font-bold text-foreground">{"Meta Jewels"}</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                            <img
                                                src={jewelImage}
                                                alt="Meta Jewels"
                                                className="w-6 h-6 object-contain"
                                            />
                                            <p className="font-bold text-foreground text-2xl truncate">
                                                {typeof (total * 150) === 'number' && (total * 1500000) >= 0
                                                    ? (total * 150).toLocaleString()
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`rounded-xl bg-rarity-4 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
                                <div className="flex items-center justify-center h-full">
                                    {/* Label section */}
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div>
                                            <p className="text-lg font-bold text-foreground">{"4-Star Pity"}</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-foreground">
                                                {typeof (sinceLast4 ?? -1) === 'number' && (sinceLast4 ?? -1) >= 0 ? (sinceLast4 ?? -1).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            Guaranteed at: {bannerCurrent.pity4}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`rounded-xl bg-rarity-5 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
                                <div className="flex items-center justify-center h-full">
                                    {/* Label section */}
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div>
                                            <p className="text-lg font-bold text-foreground">{"5-Star Pity"}</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-foreground">
                                                {typeof (sinceLast5 ?? -1) === 'number' && (sinceLast5 ?? -1) >= 0 ? (sinceLast5 ?? -1).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            Guaranteed at: {bannerCurrent.pity5}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="px-4">
                        <div className={"flex flex-col gap-3"}>
                            <div className={`rounded-xl bg-rarity-3 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
                                <div className="flex items-center justify-center h-full">
                                    {/* Label section */}
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div>
                                            <p className="text-lg font-bold text-foreground">{"Lifetime Pulls"}</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-foreground truncate">
                                                {typeof (total ?? 0) === 'number' && (total ?? 0) >= 0 ? (total ?? 0).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`rounded-xl bg-rarity-4 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
                                <div className="flex items-center justify-center h-full">
                                    {/* Label section */}
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div>
                                            <p className="text-lg font-bold text-foreground">{"4-Star Pulls"}</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-foreground">
                                                {typeof (rarityCounts["4"] ?? 0) === 'number' && (rarityCounts["4"] ?? 0) >= 0 ? (rarityCounts["4"] ?? 0).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            Average Pity: {avgPity4.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`rounded-xl bg-rarity-5 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
                                <div className="flex items-center justify-center h-full">
                                    {/* Label section */}
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div>
                                            <p className="text-lg font-bold text-foreground">{"5-Star Pulls"}</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-foreground">
                                                {typeof (rarityCounts["5"] ?? 0) === 'number' && (rarityCounts["5"] ?? 0) >= 0 ? (rarityCounts["5"] ?? 0).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            Average Pity: {avgPity5.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    {/* Rarity Pie CHart */}
                    <RarityPieChart rarityCounts={rarityCounts} />

                    {/* Luckiest Pulls Card */}
                    <LuckiestPullsCarousel pulls={top5LowestPityCharacters}/>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap gap-5">
                    <SquareCard
                        title="50/50 Wins"
                        mainValue={`${fiftyFiftyRate.toFixed(2)}%`}
                        subValue={`${fiftyFiftyWins} / ${fiftyFiftyAttempts}`}
                        banner={bannerCurrent.label}
                    />
                    <PityPlanCard
                        title={"Jewels until 5★ Pity"}
                        mainValue={(bannerCurrent.pity5 - sinceLast5) * 150}
                    />
                    <MostPulledCard
                        title={"Most Pulled 5★ Limited"}
                        mostPulled={mostPulled5StarLimited}
                        width={210}
                        banner={bannerCurrent.label}
                    />
                    <MostPulledCard
                        title={"Most Pulled 5★ Standard"}
                        mostPulled={mostPulled5StarStandard}
                        width={225}
                        banner={bannerCurrent.label}
                    />
                    <MostPulledCard
                        title={"Most Pulled 4★"}
                        mostPulled={mostPulled4Star}
                        width={165}
                    />

                </div>

                {/* Show recent 5 and 4 stars */}
                <div>
                    <Card className="p-4">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Recently Pulled</CardTitle>
                            <div className="flex gap-2">
                                <button
                                    className="px-2 py-1 border rounded"
                                    onClick={() => setShow5Stars((prev) => !prev)}
                                >
                                    {show5Stars ? "Hide 5★" : "Show 5★"}
                                </button>
                                <button
                                    className="px-2 py-1 border rounded"
                                    onClick={() => setShow4Stars((prev) => !prev)}
                                >
                                    {show4Stars ? "Hide 4★" : "Show 4★"}
                                </button>
                                <button
                                    className="px-2 py-1 border rounded"
                                    onClick={() =>
                                        setViewMode(viewMode === "scroll" ? "grid" : "scroll")
                                    }
                                >
                                    {viewMode === "scroll" ? "Grid View" : "Scroll View"}
                                </button>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div
                                className={
                                    viewMode === "scroll"
                                        ? "flex gap-2 overflow-x-auto pb-4"
                                        : "grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-6"
                                }
                            >
                                {combinedStars.map(
                                    ({ name, pity, iconUrl, time, rarity, assChara, id }, i) => (
                                        <Tooltip key={i}>
                                            <TooltipTrigger asChild>
                                                <div className="relative w-[120px] h-[120px] flex-shrink-0">
                                                    <div style={{ position: "relative", width: "120px", height: "120px", }} >
                                                        <img
                                                            src={iconUrl}
                                                            alt={name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                        <div
                                                            style={{
                                                                position: "absolute",
                                                                bottom: "5px",
                                                                right: "4px",
                                                                color: "white",
                                                                padding: "2px 22px",
                                                                textShadow: "0 0 4px rgba(255,255,255,0.4)",
                                                                fontWeight: "bold", fontSize: "0.75rem",
                                                            }} >
                                                        <span style={{
                                                            fontSize: "0.65rem",
                                                            fontWeight: "bold",
                                                            color: getPityColor(pity, rarity)}}
                                                        >
                                                            pity {" "}
                                                        </span>
                                                            <span style={{
                                                                fontSize: "1rem",
                                                                fontWeight: "bold",
                                                                color: getPityColor(pity, rarity) }}
                                                            >
                                                            {pity}
                                                        </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                <div className="text-center">
                                                    <div className="flex flex-row gap-3 items-center justify-center">
                                                        <p className="font-bold">{getLocalizedNameFallback(id, language, name)}</p>
                                                        {assChara && (
                                                            <p>
                                                                {getLocalizedNameFallback(assChara, language, IDMap[assChara].name_en).split(" ")[0]} only
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-neutral-500">
                                                        Pity: {pity}
                                                    </p>
                                                    <p className="text-sm text-neutral-500">
                                                        {formatPullTime(time)}
                                                    </p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <PullTableCard pulls={allPulls} label={bannerCurrent.label} />
                <PullCountViewTable pulls={allMostPulled} label={bannerCurrent.label} />
            </div>

            {/* You can add tables, charts, etc. using allPulls and the rest of data */}
        </div>
    );
}