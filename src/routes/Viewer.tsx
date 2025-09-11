import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs.tsx"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog.tsx"

import {
    Input
} from "@/components/ui/input.tsx";

import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel.tsx"

import { useAuth } from '@/context/AuthContext';

import {type CharacterData } from '@/components/CharacterPicker.tsx';

import { fetchDataForSheet} from "@/utils/fetchDataLogic.ts";

import bgImage from "@/assets/bg.png";

import '@/colors.css';

/// <reference types="gapi" />
/// <reference types="gapi.auth2" />

declare global {
    interface Window {
        google: typeof google;
    }

    namespace google.picker {
        enum ViewId {
            SPREADSHEETS = "SPREADSHEETS"
        }

        class View {
            constructor(viewId: ViewId);
        }

        enum Action {
            PICKED = "picked"
        }

        interface Response {
            action: Action;
            docs: { id: string; name: string }[];
        }

        class PickerBuilder {
            addView(view: View): this;
            setOAuthToken(token: string): this;
            setDeveloperKey(key: string): this;
            setCallback(cb: (data: Response) => void): this;
            build(): Picker;
        }

        interface Picker {
            setVisible(visible: boolean): void;
        }
    }
}

import React, {useEffect, useState } from 'react';

import StatCard from '@/components/StatCard.tsx';
import {Button} from "@/components/ui/button.tsx";
import {gapi} from "gapi-script";
import {createPicker, initGoogleClient, loadPicker, signIn} from "@/utils/google.ts";
import { appendCharactersToSheet} from "@/utils/google.ts";
import DialogSheetContent from "../components/DialogSheetContexts.tsx";
import {Link, useNavigate} from "react-router-dom";

import LanguageSelector from "@/components/LanguageSelector.tsx"
import DarkModeToggle from "@/components/DarkModeToggle.tsx"

import jewelImage from "@/assets/jewels.png";
import limitedTicketImage from "@/assets/low_limited-ticket.png";
import weaponTicketImage from "@/assets/low_weapons-ticket.png";
import standardTicketImage from "@/assets/low_standard-ticket.png";

import addUI from "@/assets/add-icon.png";
import editUI from "@/assets/edit-icon.png";
import externalUI from "@/assets/open-external.png";

import { fetchApiData } from "@/newAPI/fetchApiData.tsx";
import { transformBannerData } from "@/newAPI/transformApiToRows.tsx";
import { transformApiToRowsByBanner } from "@/newAPI/transformApiToRowsByBanner.tsx";

import { appendCharactersToSheetWithAPI } from "@/utils/google.ts"
import { getLocalizedNameFallback} from "@/utils/sharedFunctions.tsx";
import {useLanguage} from "@/utils/language.tsx";
import { Loader2 } from "lucide-react";

import { allHeroBanners } from "@/utils/allHeroBanners.ts";

const now = Date.now(); // milliseconds

const activeBanners = allHeroBanners.filter(banner => {
    const start = banner.start < 1e12 ? banner.start * 1000 : banner.start; // Convert to ms if in seconds
    const end = banner.end < 1e12 ? banner.end * 1000 : banner.end;
    return now >= start && now <= end;
});

type Item = {
    src: string;
    alt: string;
    row: number;
    value: number;
}

const itemInventory: Item[] = [
    {
       src: jewelImage,
       alt: "Gems",
       row: 1,
       value: 0,
    },
    {
        src: jewelImage,
        alt: "Jewels",
        row: 2,
        value: 0,
    },
    {
        src: limitedTicketImage,
        alt: "Limited Ticket",
        row: 3,
        value: 0,
    },
    {
        src: weaponTicketImage,
        alt: "Weapon Ticket",
        row: 4,
        value: 0,
    },
    {
        src: standardTicketImage,
        alt: "Standard Ticket",
        row: 5,
        value: 0,
    }
]


type SheetRow = string[];

const SheetStats: React.FC = () => {
    const { language } = useLanguage();

    const { isSignedIn, isInitialized, signIn, signOut } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (isInitialized && !isSignedIn) {
            navigate('/home')
        }
    }, [isInitialized, isSignedIn, navigate])

    const defaultDatasets = [
        { id: "", sheetName: "Limited Banner", label: "Limited Banner", sublabel: "Most Wanted Ph. Idol", pity4: 10, pity5: 80, source: limitedTicketImage, altText: "Limited Banner Icon" },
        { id: "", sheetName: "Weapon Banner", label: "Weapon Banner", sublabel: "Arms Deals", pity4: 10, pity5: 70, source: weaponTicketImage, altText: "Weapon Banner Icon" },
        { id: "", sheetName: "Standard Banner", label: "Standard Banner", sublabel: "Phantom Idol", pity4: 10, pity5: 80, source: standardTicketImage, altText: "Standard Banner Icon" },
        { id: "", sheetName: "Newcomer Banner", label: "Newcomer Banner", sublabel: "Newcomer Contracts", pity4: 10, pity5: 50, source: standardTicketImage, altText: "Standard Banner Icon" },
    ];

    const loadDatasets = () => {
        const cached = localStorage.getItem("userDatasets");
        const parsed = cached ? JSON.parse(cached) : defaultDatasets;

        // Merge cached with default to ensure new banners exist
        return defaultDatasets.map((ds, i) => ({
            ...ds,
            ...parsed[i], // override defaults with cached values if present
        }));
    };


    const [datasets, setDatasets] = useState(loadDatasets);

    const [ iantDialogOpen, iantSetDialogOpen ] = useState<boolean>(false);
    const [iantLoading, iantSetLoading] = useState(false);
    const [iantUrl, iantSetUrl] = useState();

    const [sharedSpreadsheetId, setSharedSpreadsheetId] = useState(() => {
        return localStorage.getItem("sharedSpreadsheetId") ?? "";
    });

    const [invSheet, setInvSheet] = useState(() => {
        return localStorage.getItem("invSheet") ?? "";
    });

    useEffect(() => {
        if (!sharedSpreadsheetId) return; // Ignore initial or empty state

        datasets.forEach((ds: { sheetName: string; }, i: number) => {
            if (ds.sheetName) loadAndSetData(ds.sheetName, i);
        });
    }, [sharedSpreadsheetId, datasets]);

    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (!dialogOpen) {
            setDatasets(loadDatasets());
        }
    }, [dialogOpen]);

    type Stats = {
        total: number;
        sinceLast5: number;
        sinceLast4: number;
        avgPity5: number;
        avgPity4: number;
        rarityCounts: Record<string, number>;    // e.g. { '5': 3, '4': 15, '3': 60, '2': 20 }
        rarityPercents: Record<string, number>;  // e.g. { '5': 4.1, '4': 20.5, ... }
        recent5Stars: {
            name: string; pity: number, id: number }[];
        all5Stars: any;
        all4Stars: any;
    };

    const [allStats, setAllStats] = useState<Stats[]>(
        datasets.map(() => ({
            total: 0,
            sinceLast5: -1,
            sinceLast4: -1,
            avgPity5: -1,
            avgPity4: -1,
            rarityCounts: {},
            rarityPercents: {},
            recent5Stars: [],
            all5Stars: [],
            all4Stars: [],
        }))
    );

    ///Fetch data variables
    async function loadAndSetData(sheetName: string, index: number) {
        const stats = await fetchDataForSheet(sheetName);

        setAllStats(prev => {
            const copy = [...prev];
            copy[index] = {
                total: stats.total,
                sinceLast5: stats.sinceLast5,
                sinceLast4: stats.sinceLast4,
                avgPity5: stats.avgPity5,
                avgPity4: stats.avgPity4,
                rarityCounts: stats.rarityCounts,
                rarityPercents: stats.rarityPercents,
                recent5Stars: stats.all5Stars.slice(-3).reverse(), // if you want recent 5 stars
                all5Stars: stats.all5Stars,
                all4Stars: stats.all4Stars,
            };
            return copy;
        });
    }

    //Pull date info variable(s)
    const [openDatePicker, setOpenDatePicker] = React.useState(false)
    const [date, setDate] = React.useState<Date | null>(null)
    const [time, setTime] = React.useState("10:30:00")

    const [currentBanner, setCurrentBanner] = useState<string>("");
    const [currentBannerSublabel, setCurrentBannerSublabel] = useState<string>("");
    const [currentSheetName, setCurrentSheetName] = useState<string>("");

    const [selectedCharacters, setSelectedCharacters] = useState<CharacterData[]>(
        Array(10).fill({ src: new URL(`../assets/chicons/basic.png`, import.meta.url).href, modalsrc: new URL(`../assets/chicons/modal/basic.png`, import.meta.url).href, collectionsrc: new URL(`../assets/chicons/collection/basic.png`, import.meta.url).href, rarity: "none", name:"Clear", affinity: "Support" })
    );

    // State for modal control
    const [pickerOpenForIndex, setPickerOpenForIndex] = useState<number | null>(null);

    const handleCharacterSelect = (character: CharacterData) => {
        if (pickerOpenForIndex !== null) {
            const newCharacters = [...selectedCharacters];
            newCharacters[pickerOpenForIndex] = character
            setSelectedCharacters(newCharacters);
            setPickerOpenForIndex(null);
        }
    };

    // Open modal and specify which character is being edited
    function openCharacterPicker(index: number) {
        setPickerOpenForIndex(index);
    }

    function getPityColorClass(pity: number) {
        if (pity <= 10) return 'text-green-700 border-green-500 bg-green-100';
        if (pity <= 30) return 'text-lime-700 border-lime-500 bg-lime-100';
        if (pity <= 50) return 'text-yellow-700 border-yellow-500 bg-yellow-100';
        if (pity <= 65) return 'text-orange-700 border-orange-500 bg-orange-100';
        return 'text-red-700 border-red-500 bg-red-100';
    }

    const handlePickSheet = async () => {
        await loadPicker();

        createPicker(async (spreadsheetId) => {
            try {
                // 1. Get metadata for the selected spreadsheet to read sheet names
                const sheetMetadata = await gapi.client.sheets.spreadsheets.get({
                    spreadsheetId,
                });

                let sheets = sheetMetadata.result.sheets || [];
                let sheetNames = sheets.map(sheet => sheet.properties?.title).filter(Boolean) as string[];

                // 2. Ensure sheet number exists
                const neededSheetCount = datasets.length + 1;
                const currentCount = sheetNames.length;

                if (currentCount < neededSheetCount) {
                    const sheetsToAdd = neededSheetCount - currentCount;
                    const addRequests = Array.from({ length: sheetsToAdd }, () => ({
                        addSheet: {}, // default blank sheet
                    }));

                    await gapi.client.sheets.spreadsheets.batchUpdate({
                        spreadsheetId,
                        requests: addRequests,
                    });

                    // Re-fetch metadata to get updated sheet names
                    const updatedMetadata = await gapi.client.sheets.spreadsheets.get({
                        spreadsheetId,
                    });

                    sheets = updatedMetadata.result.sheets || [];
                    sheetNames = sheets.map(sheet => sheet.properties?.title).filter(Boolean) as string[];
                }

                // 3. Update datasets with sheet names
                const updatedDatasets = datasets.map((ds: any, index: number) => ({
                    ...ds,
                    sheetName: sheetNames[index + 1],  // You could match names more intelligently if needed
                }));


                // 4. Save spreadsheet ID and datasets
                localStorage.setItem("sharedSpreadsheetId", spreadsheetId);
                localStorage.setItem("userDatasets", JSON.stringify(updatedDatasets));
                localStorage.setItem("invSheet", sheetNames[0])
                localStorage.setItem("limitedSheet", sheetNames[1])
                localStorage.setItem("weaponSheet", sheetNames[2])
                localStorage.setItem("standardSheet", sheetNames[3])
                localStorage.setItem("newcomerSheet", sheetNames[4])


                setDatasets(updatedDatasets);
                setSharedSpreadsheetId(spreadsheetId); // You should add this to your state
                setInvSheet(sheetNames[0])

            } catch (error) {
                console.error("Error loading spreadsheet metadata:", error);
            }
        });
    };

    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )

    const [loadingSheet, setLoadingSheet] = useState<string | null>(null);

    async function handleClick(
        sheetName: string,
        dataset?: typeof defaultDatasets[number]
    ) {
        setLoadingSheet(sheetName);

        const data = await fetchDataForSheet(sheetName);

        setLoadingSheet(null);

        navigate("/banner", {
            state: {
                bannerData: data, // the fetched pull data
                datasetInfo: dataset, // metadata from defaultDatasets
            },
        });
    }

    async function syncFromApi(apiUrl: string | undefined, translate: boolean) {
        if(apiUrl === undefined){
            return
        }

        const apiData = await fetchApiData(apiUrl, translate);
        const rowsByBanner = transformApiToRowsByBanner(apiData);

        // Access each banner separately:
        const weaponRows = rowsByBanner["Weapon"];
        const fortuneRows = rowsByBanner["Fortune"];
        const goldRows = rowsByBanner["Gold"];
        const newcomerRows = rowsByBanner["Newcomer"];

        const cached = localStorage.getItem("userDatasets");
        const parsed = cached ? JSON.parse(cached) : defaultDatasets;

        appendCharactersToSheetWithAPI(sharedSpreadsheetId, parsed[0].sheetName, fortuneRows);
        appendCharactersToSheetWithAPI(sharedSpreadsheetId, parsed[1].sheetName, weaponRows);
        appendCharactersToSheetWithAPI(sharedSpreadsheetId, parsed[2].sheetName, goldRows);
        appendCharactersToSheetWithAPI(sharedSpreadsheetId, parsed[3].sheetName, newcomerRows);

    }

    function returnLanguageBool( lang : number | undefined ){
        switch (lang) {
            case(1):
                return true;
            case (2):
                return false;
            default:
                return true;
        }
    }

    const handleSync = async () => {
        iantSetLoading(true);
        try {
            await syncFromApi(iantUrl, returnLanguageBool(language));
        } finally {
            iantSetLoading(false);
        }
    };

    return (
        <div className={"flex flex-col min-h-screen"}>
            <div className={"flex flex-col gap-6 flex-1"}>
                <div className={"flex flex-col items-center w-full"}>
                    <div className="flex flex-row gap-20 items-center justify-center px-4 sm:px-10">
                        <div className="flex-shrink-0 max-w-[550px] w-full">
                            <Carousel
                                plugins={[plugin.current]}
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}
                            >
                                <CarouselContent>
                                    {activeBanners.map((banner, idx) => (
                                        <CarouselItem key={idx}>
                                            <div className="aspect-[6/1.2] w-full relative"> {/* Make container relative */}
                                                <Card className="h-full w-full p-0 overflow-hidden">
                                                    <CardContent className="p-0 h-full w-full relative">
                                                        <img
                                                            src={banner.image}
                                                            alt={`Hero ${idx + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        {/* Overlay box */}
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-2 py-1 flex justify-between">
                                                            <span className="font-semibold">{banner.label}</span>
                                                            <span>
                                                                Active until{" "}
                                                                {new Date(banner.end < 1e12 ? banner.end * 1000 : banner.end).toLocaleString("en-US", {
                                                                    month: "short",   // "Aug"
                                                                    day: "numeric",   // "6"
                                                                    year: "numeric",  // "2025"
                                                                    hour: "numeric",  // "9"
                                                                    minute: "2-digit",// "00"
                                                                    hour12: true      // "PM"
                                                                })}
                                                            </span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}

                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                        <div className={"flex gap-10"}>
                            {itemInventory.map((item) => (
                                <div className={"relative"}>
                                    {/* Capsule Box */}
                                    <div className="bg-coloredbg text-white rounded-full px-10 py-1.5 shadow-md text-center text-whitefont-semibold relative z-10 min-w-[7rem]">
                                        {Number(item.value).toLocaleString()}
                                    </div>

                                    {/* Left Icon */}
                                    <div className="absolute left-[-1rem] top-1/2 -translate-y-6 z-20">
                                        <img
                                            src={item.src}
                                            alt={item.alt}
                                            className="w-12 h-12 object-contain"
                                        />
                                    </div>

                                    {/* Right Button */}
                                    <Button
                                        className="absolute right-[-1rem] top-5 -translate-y-5 -translate-x-3 bg-coloredbg hover:bg-gray-700 text-white rounded-full w-9 h-9 flex items-center justify-center z-20 shadow"
                                    >
                                        +
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-wrap gap-6 justify-center px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
                        {datasets.map((ds: {
                            id: string;
                            sheetName: string;
                            source: string;
                            sublabel: string;
                            label: string;
                            pity4: number;
                            pity5: number;
                            altText: string;},
                            i: number) => (
                            <Card key={i} className="w-full sm:flex-1 sm:min-w-[350px] sm:max-w-[500px] flex flex-col">
                                <CardHeader>
                                    <CardTitle>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={ds.source}
                                                    alt={ds.altText}
                                                    className="w-8 h-8 object-contain"
                                                />
                                                <span className={"text-xl"}>{ds.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* Add Pull History Button */}
                                                <Dialog open={dialogOpen} onOpenChange={(open) => {
                                                    setDialogOpen(open);
                                                    if (!open) {
                                                        selectedCharacters.fill({ src: new URL(`../assets/chicons/basic.png`, import.meta.url).href, modalsrc: new URL(`../assets/chicons/modal/basic.png`, import.meta.url).href, collectionsrc: new URL(`../assets/chicons/collection/basic.png`, import.meta.url).href, rarity: "none", codename: "N/A", name_en:"Clear", affinity: "Support", id: 9999 });
                                                    }
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="p-1"
                                                            title="Add Row"
                                                            onClick={() => {
                                                                setCurrentBanner(ds.sheetName);
                                                                setCurrentBannerSublabel(ds.sublabel);
                                                                setCurrentSheetName(ds.sheetName);
                                                            }}
                                                        >
                                                            <img
                                                                src={addUI}
                                                                alt="Add Row to Spreadsheet"
                                                                className="w-5 h-5 object-contain dark:invert"
                                                            />
                                                        </Button>
                                                    </DialogTrigger>

                                                    {/* This is the dialog content that adds new data / pull history to the spreadsheet */}
                                                    <div>
                                                        <DialogSheetContent
                                                            bgImage={bgImage}
                                                            currentBanner={sharedSpreadsheetId}
                                                            currentBannerSublabel={currentBannerSublabel}
                                                            currentSheetName={currentSheetName}
                                                            date={date}
                                                            setDate={setDate}
                                                            time={time}
                                                            setTime={setTime}
                                                            setOpenDatePicker={setOpenDatePicker}
                                                            appendCharactersToSheet={appendCharactersToSheet}
                                                            selectedCharacters={selectedCharacters}
                                                            setDialogOpen={setDialogOpen}
                                                            datasets={datasets}
                                                            fetchData={fetchDataForSheet}
                                                            openCharacterPicker={openCharacterPicker}
                                                            pickerOpenForIndex={pickerOpenForIndex}
                                                            setPickerOpenForIndex={setPickerOpenForIndex}
                                                            handleCharacterSelect={handleCharacterSelect}
                                                        />
                                                    </div>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 flex-grow overflow-auto">
                                    <Tabs defaultValue="totals">
                                        <TabsList className="w-full grid grid-cols-2">
                                            <TabsTrigger value="totals">Totals</TabsTrigger>
                                            <TabsTrigger value="statistics">Statistics</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="totals">
                                            <div className="flex flex-col justify-center gap-2 mt-4">
                                                <StatCard
                                                    label={`Lifetime Pulls`}
                                                    sublabel={
                                                    <>
                                                        <img
                                                            src={jewelImage}
                                                            alt="Meta Jewels"
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                        <span>{(allStats[i].total * 150).toLocaleString()}</span>
                                                    </>
                                                    }
                                                    value={allStats[i]?.total ?? 0}
                                                    bg="bg-rarity-3"
                                                    className="w-full min-h-[30px]"  // example width and min height
                                                />
                                                <StatCard
                                                    label={`4-Star Pity`}
                                                    sublabel={`Guaranteed at ` + ds.pity4}
                                                    value={allStats[i]?.sinceLast4 ?? -1}
                                                    bg="bg-rarity-4"
                                                    className="w-full min-h-[30px]"
                                                />
                                                <StatCard
                                                    label={`5-Star Pity`}
                                                    sublabel={`Guaranteed at ` + ds.pity5}
                                                    value={allStats[i]?.sinceLast5 ?? -1}
                                                    bg="bg-rarity-5"
                                                    className="w-full"
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="statistics">
                                            <div className="mt-4 overflow-x-auto">
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
                                                    {Object.entries(allStats[i].rarityCounts).map(([rarity, count]) => (
                                                        <tr key={rarity}>
                                                            <td className="px-4 py-2 border-b">{rarity}★</td>
                                                            <td className="px-4 py-2 border-b">{count}</td>
                                                            <td className="px-4 py-2 border-b">
                                                                {allStats[i].rarityPercents[rarity].toFixed(2)}%
                                                            </td>
                                                            <td className="px-4 py-2 border-b">
                                                                {rarity === '5'
                                                                    ? allStats[i].avgPity5.toFixed(2)
                                                                    : rarity === '4'
                                                                        ? allStats[i].avgPity4.toFixed(2)
                                                                        : '—'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                {allStats[i]?.recent5Stars.length > 0 && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {allStats[i].recent5Stars.map((pull, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={`px-4 py-1 rounded-full border inline-block text-sm font-medium ${getPityColorClass(pull.pity)}`}
                                                            >
                                                                {getLocalizedNameFallback(pull.id, language, pull.name)} at {pull.pity} pity
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center text-md text-muted-foreground flex-shrink-0 h-14">
                                    {/* Left side: Pull History */}
                                    <div>
                                        <Button
                                            disabled={loadingSheet === ds.sheetName}
                                            onClick={() => handleClick(ds.sheetName, ds)}
                                            title="Add Row"
                                            className="text-white bg-coloredbg"
                                        >
                                            {loadingSheet === ds.sheetName ? "Loading..." : "Expanded View"}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="flex flex-row gap-5 justify-center py-8">
                    {/* Set Spreadsheet Button */}
                    <Button
                        size="icon"
                        onClick={() => handlePickSheet()}
                        className="w-auto px-4 bg-coloredbg text-white"
                        title="Set Spreadsheet via Google Drive"
                    >
                        <img
                            src={editUI}
                            alt="Set Spreadsheet"
                            className="w-6 h-6 object-contain translate-y-[2px] invert"
                        />
                        Set Spreadsheet from Google Drive
                    </Button>
                    <Button
                        size="icon"
                        className="w-auto px-4 bg-coloredbg text-white"
                        title="Open Sheet"
                        onClick={() =>
                            window.open(`https://docs.google.com/spreadsheets/d/${sharedSpreadsheetId}`, "_blank")
                        }
                    >
                        <img
                            src={externalUI}
                            alt="Set Spreadsheet"
                            className="w-4 h-4ƒexter object-contain invert"
                        />
                        Open Spreadsheet
                    </Button>
                    <Dialog
                        open={iantDialogOpen}
                        onOpenChange={(open) => {
                            if (!open) {
                                // Dialog just closed
                                setDatasets(loadDatasets());
                            }
                            iantSetDialogOpen(open);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => returnLanguageBool(language)}
                                className="text-white bg-coloredbg">
                                Sync from API Link
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Enter API URL</DialogTitle>
                            </DialogHeader>
                            <Input
                                type="text"
                                placeholder="Paste API URL..."
                                value={iantUrl}
                                onChange={(e) => iantSetUrl(e.target.value)}
                            />
                            <DialogFooter>
                                <Button
                                    onClick={handleSync}
                                    disabled={!iantUrl || iantLoading}
                                    className="bg-coloredbg text-white"
                                >
                                    {iantLoading ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                            Syncing...
                                        </>
                                    ) : (
                                        "Sync"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-coloredbg text-white"
                            >How to get URL</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>How to Get Your URL</DialogTitle>
                                <DialogDescription>
                                    Follow these steps to find your API URL from P5X:
                                </DialogDescription>
                            </DialogHeader>
                            <ol className="list-decimal list-inside space-y-2">
                                <li>
                                    Download {" "}
                                    <a
                                        href='https://iant.kr/gacha/P5X_Gacha_Tools.zip'
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800"
                                    >
                                        iant's P5X Gacha Tools
                                    </a>.
                                </li>
                                <li>
                                    Unzip the file and launch the file. (the program requires Administrator because it modifies hosts file to block gacha history url)
                                </li>
                                <li>
                                    Launch the game and navigate to gacha screen and try to load history.
                                </li>
                                <li>
                                    The game will fail to show history in-game.
                                </li>
                                <li>
                                    Press the try get url button in the tool.
                                </li>
                                <li>
                                    Paste it into the input box in the site under 'Sync from API Link' and press Sync.
                                </li>
                            </ol>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="fixed bottom-4 right-4 flex space-x-2 z-50">
                <LanguageSelector />
                <DarkModeToggle />
            </div>
            <div>
                <footer className="p-4 text-center text-sm text-gray-500 border-t">
                    <div className={"flex flex--row gap-10 justify-center"}>
                        <Link
                            to="/privacy"
                            className="hover:underline hover:text-gray-700"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            className="hover:underline hover:text-gray-700"
                        >
                            Terms of Service
                        </Link>
                        <a
                            href="/"
                            className="hover:underline hover:text-gray-700"
                        >
                            Homepage
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );

};

export default SheetStats;
