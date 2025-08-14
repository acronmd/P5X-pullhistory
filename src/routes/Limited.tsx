import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import jewelImage from "@/assets/jewels.png";

import { ArrowLeft } from "lucide-react"; // optional icon from lucide

import RarityPieChart from "@/components/PieChart.tsx"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import PullTableCard from "@/components/ViewTable.tsx"

import { formatPullTime } from "@/utils/sharedFunctions.tsx"
import LuckiestPullsCarousel from "@/components/LuckyPullsCarousel.tsx";

function LimitedPage() {
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

    const [show5Stars, setShow5Stars] = useState(true);
    const [show4Stars, setShow4Stars] = useState(false);

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

    const navigate = useNavigate();

    return (
        <div>
            <Card className="sticky top-0 z-50 w-full bg-foreground shadow-md">
                <CardContent className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-background" /> {/* icon color */}
                    </button>
                    <h1 className="text-lg font-bold text-background">{bannerCurrent.label}</h1> {/* text color */}
                </CardContent>
            </Card>
            <div className={"flex flex-col gap-4"}>
                <div className="mt-4 flex flex-nowrap gap-5">
                    <Card className="px-4">
                        <div className={"flex flex-col gap-3"}>
                            <div className={`rounded-xl bg-gray-100 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
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
                            <div className={`rounded-xl bg-yellow-100 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
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
                            <div className={`rounded-xl bg-purple-100 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
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
                            <div className={`rounded-xl bg-gray-100 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
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
                            <div className={`rounded-xl bg-yellow-100 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
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
                            <div className={`rounded-xl bg-purple-100 p-4 shadow-sm sm:flex-1 sm:min-w-[180px] sm:max-w-[200px] flex flex-col w-full min-h-[30px]`}>
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
                    {/*
                <div>
                    <table className="min-w-full text-sm border border-border text-left">
                        <thead className="bg-muted">
                        <tr>
                            <th className="px-4 py-2 border-b">Rarity</th>
                            <th className="px-4 py-2 border-b">Count</th>
                            <th className="px-4 py-2 border-b">Percent</th>
                            <th className="px-4 py-2 border-b">Pity Avg</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(rarityCounts).map(([rarity, count]) => (
                            <tr key={rarity}>
                                <td className="px-4 py-2 border-b">{rarity}★</td>
                                <td className="px-4 py-2 border-b">{count}</td>
                                <td className="px-4 py-2 border-b">
                                    {rarityPercents[rarity].toFixed(2)}%
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {rarity === '5'
                                        ? avgPity5.toFixed(2)
                                        : rarity === '4'
                                            ? avgPity4.toFixed(2)
                                            : '—'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                */}
                    {/* Rarity Pie CHart */}
                    <RarityPieChart rarityCounts={rarityCounts} />

                    {/* Luckiest Pulls Card */}
                    <LuckiestPullsCarousel pulls={top5LowestPityCharacters}/>
                </div>

                {/* Example: Show recent 5 and 4 stars */}
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
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="flex gap-2 overflow-x-auto pb-4"
                        >
                            {combinedStars.map(({ name, pity, iconUrl, time, rarity }, i) => (
                                <Tooltip key={i}>
                                    <TooltipTrigger asChild>
                                        <div className="relative w-[120px] h-[120px] flex-shrink-0">
                                            <div
                                                style={{
                                                    position: "relative",
                                                    width: "120px",
                                                    height: "120px",
                                                }}
                                            >
                                                <img
                                                    src={iconUrl}
                                                    alt={name}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain",
                                                        display: "block",
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        bottom: "5px",
                                                        right: "4px",
                                                        color: "white",
                                                        padding: "2px 22px",
                                                        textShadow: "0 0 4px rgba(255,255,255,0.4)",
                                                        fontWeight: "bold",
                                                        fontSize: "0.75rem",
                                                    }}
                                                >
                                                    <span style={{ fontSize: "0.65rem", fontWeight: "bold", color: getPityColor(pity, rarity)}}>pity </span>
                                                    <span style={{ fontSize: "1rem", fontWeight: "bold", color: getPityColor(pity, rarity) }}>{pity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <div className="text-center">
                                            <p className="font-bold">{name}</p>
                                            <p className="text-sm text-muted-foreground">Pity: {pity}</p>
                                            <p className="text-sm text-muted-foreground">{formatPullTime(time)}</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <PullTableCard pulls={allPulls} label={bannerCurrent.label} />
            </div>

            {/* You can add tables, charts, etc. using allPulls and the rest of data */}
        </div>
    );
}

export default LimitedPage;