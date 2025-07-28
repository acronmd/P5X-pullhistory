import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import { Separator } from "@/components/ui/separator"

import {type CharacterData } from '@/components/CharacterPicker';

import bgImage from "@/assets/bg.png";

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

import React, { useState } from 'react';

import StatCard from '@/components/StatCard';
import {Button} from "@/components/ui/button.tsx";
import {gapi} from "gapi-script";
import {createPicker, initGoogleClient, loadPicker, signIn} from "@/utils/google.ts";
import { appendCharactersToSheet} from "@/utils/google.ts";
import DialogSheetContent from "./DialogSheetContexts";

type SheetRow = string[];

const SheetStats: React.FC = () => {
    const defaultDatasets = [
        { id: "", label: "Limited Banner", sublabel: "Most Wanted Ph. Idol", pity4: 10, pity5: 80, source: "./src/assets/low_limited-ticket.png", altText: "Limited Banner Icon" },
        { id: "", label: "Weapon Banner", sublabel: "Arms Deal", pity4: 10, pity5: 70, source: "./src/assets/low_weapons-ticket.png", altText: "Weapon Banner Icon" },
        { id: "", label: "Standard Banner", sublabel: "Phantom Idol", pity4: 10, pity5: 80, source: "./src/assets/low_standard-ticket.png", altText: "Standard Banner Icon" },
    ];

    const banners = [
        { value: "The Phantom Thieves of Hearts", label: "The Phantom Thieves of Hearts (Beginner Banner)", sublabel: "Phantom Idol" },
        { value: "Phantom Idol Draft X", label: "Phantom Idol Draft X (Standard Banner)", sublabel: "Phantom Idol" },

        { value: "Silent Pistol", label: "Silent Pistol", sublabel: "Arms Deal" },

        { value: "The Phantom Magician", label: "The Phantom Magician (Joker)", sublabel: "Most Wanted Ph. Idol" },
        { value: "Angel's Diagnosis", label: "Angel's Diagnosis (Marian)", sublabel: "Most Wanted Ph. Idol" },
        { value: "Virtual Netizen", label: "Virtual Netizen (Bui)", sublabel: "Most Wanted Ph. Idol" },
        { value: "Art of the Fox", label: "Art of the Fox (Fox)", sublabel: "Most Wanted Ph. Idol" },
    ];

    const range = 'Sheet1';

    ///React useState variables
    const [datasets, setDatasets] = useState(() => {
        const cached = localStorage.getItem("userDatasets");
        const parsed = cached ? JSON.parse(cached) : defaultDatasets;

        // Fill missing fields from defaultDatasets
        return parsed.map((ds: any, i: number) => ({
            id: ds.id ?? "",
            label: ds.label ?? defaultDatasets[i]?.label ?? "",
            sublabel: ds.sublabel ?? defaultDatasets[i]?.sublabel ?? "",
            pity4: ds.pity4 ?? defaultDatasets[i]?.pity4 ?? 0,
            pity5: ds.pity5 ?? defaultDatasets[i]?.pity5 ?? 0,
            source: ds.source ?? defaultDatasets[i]?.source ?? "",
            altText: ds.altText ?? defaultDatasets[i]?.altText ?? "",
        }));
    });

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    type Stats = {
        total: number;
        sinceLast5: number;
        sinceLast4: number;
        avgPity5: number;
        avgPity4: number;
        rarityCounts: Record<string, number>;    // e.g. { '5': 3, '4': 15, '3': 60, '2': 20 }
        rarityPercents: Record<string, number>;  // e.g. { '5': 4.1, '4': 20.5, ... }
        recent5Stars: { name: string; pity: number }[];
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
        }))
    );
    const [allPulls, setAllPulls] = useState<SheetRow[][]>(datasets.map(() => []));

    ///Fetch data variables
    async function fetchData(id: string, index: number) {
        await gapi.client.load('sheets', 'v4');
        const res = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: id,
            range: range,
        });
        const data: SheetRow[] = res.result.values || [];

        ///const json = await res.json();

        const total = data.length;

        const counts: Record<string, number> = {};
        const pityGaps5: number[] = [];
        const pityGaps4: number[] = [];

        let last5Index: number | null = null;
        let last4Index: number | null = null;

        let sinceLast5 = -1;
        let sinceLast4 = -1;

        // Loop for stats
        for (let i = 0; i < data.length; i++) {
            const val = data[i][0]?.trim();

            // Count any seen rarity (2, 3, 4, 5)
            if (val) {
                counts[val] = (counts[val] || 0) + 1;
            }

            // 5-star logic
            if (val === '5') {
                if (last5Index === null) {
                    pityGaps5.push(i + 1); // first 5★
                } else {
                    pityGaps5.push(i - last5Index);
                }
                last5Index = i;
            }

            // 4-star logic
            if (val === '4') {
                if (last4Index === null) {
                    pityGaps4.push(i + 1); // first 4★
                } else {
                    pityGaps4.push(i - last4Index);
                }
                last4Index = i;
            }
        }

        // Calculate pity since last 5★ / 4★
        for (let i = data.length - 1; i >= 0; i--) {
            const val = data[i][0]?.trim();

            if (sinceLast5 === -1 && val === '5') {
                sinceLast5 = data.length - i - 1;
            }

            if (sinceLast4 === -1 && val === '4') {
                sinceLast4 = data.length - i - 1;
            }

            if (sinceLast5 !== -1 && sinceLast4 !== -1) break;
        }

        // Average function
        const avg = (arr: number[]) =>
            arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

        // Percent calculation
        const percents: Record<string, number> = {};
        for (const rarity in counts) {
            percents[rarity] = (counts[rarity] / total) * 100;
        }

        let recent5Stars: { name: string; pity: number }[] = [];
        let pityCounter = 0;

        for (let i = 0; i < data.length; i++) {
            const val = data[i][0]?.trim();

            pityCounter++; // Increment on every roll

            if (val === '5') {
                const name = data[i][1]; // Assuming name is in second column
                recent5Stars.push({
                    name,
                    pity: pityCounter, // This is the pity count at which 5★ was pulled
                });

                pityCounter = 0; // Reset for next cycle
            }
        }
        // Keep only the last 3 pulled 5★s
        recent5Stars = recent5Stars.slice(-3).reverse();

        // Save to state
        setAllStats(prev => {
            const copy = [...prev];
            copy[index] = {
                total,
                sinceLast5,
                sinceLast4,
                avgPity5: avg(pityGaps5),
                avgPity4: avg(pityGaps4),
                rarityCounts: counts,
                rarityPercents: percents,
                recent5Stars: recent5Stars,
            };
            return copy;
        });
        setAllPulls(prev => {
            const copy = [...prev];
            copy[index] = data;
            return copy;
        });

    }

    //Pull banner info variable
    const [position, setPosition] = React.useState("N/A")

    //Pull date info variable(s)
    const [openDatePicker, setOpenDatePicker] = React.useState(false)
    const [date, setDate] = React.useState<Date | null>(null)
    const [time, setTime] = React.useState("10:30:00")

    const [currentBanner, setCurrentBanner] = useState<string>("");
    const [currentBannerSublabel, setCurrentBannerSublabel] = useState<string>("");

    const [selectedCharacters, setSelectedCharacters] = useState<CharacterData[]>(
        Array(10).fill({ src: "./src/assets/chicons/basic.png", modalsrc: "./src/assets/persicons/basic.png", rarity: "none", name:"Clear", affinity: "Support" })
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


    const handleSignIn = async () => {
        //console.log("handleSignIn: started");

        try {
            setIsLoading(true);
            //console.log("handleSignIn: calling initGoogleClient");
            await initGoogleClient(import.meta.env.VITE_GOOGLE_CLIENT_ID);
            //console.log("handleSignIn: calling signIn");
            await signIn();
            //console.log("handleSignIn: signIn done");
            setIsSignedIn(true);

            datasets.forEach((ds: { id: string; }, i: number) => {
                if (ds.id) fetchData(ds.id, i);
            });
        } catch (err) {
            console.error("OAuth sign-in failed:", err);
        } finally {
            //console.log("handleSignIn: finished");
            setIsLoading(false);
        }
    };


    function starsForRarity(text: string) {
        // Check if the text is just a number (like '2', '3', '4', '5')
        const n = parseInt(text, 10);
        if (!isNaN(n) && n > 0 && n <= 5) {
            return '★'.repeat(n);
        }
        // If not a number or outside expected range, just return original text
        return text;
    }

    function rowClassForRarity(rarity: string) {
        switch (rarity) {
            case '5':
                return 'bg-purple-200 hover:bg-purple-200';  // gold background, same on hover
            case '4':
                return 'bg-yellow-100 hover:bg-yellow-200';  // purple background, same on hover
            default:
                return 'bg-gray-200 hover:bg-gray-200';      // grey background, same on hover
        }
    }

    function rarityBorderColor(rarity: string) {
        switch (rarity) {
            case '5':
                return 'border-purple-400'; // gold border color
            case '4':
                return 'border-yellow-400'; // purple border color
            default:
                return 'border-gray-400';   // gray border color
        }
    }

    function getPityColorClass(pity: number) {
        if (pity <= 10) return 'text-green-700 border-green-500 bg-green-100';
        if (pity <= 30) return 'text-lime-700 border-lime-500 bg-lime-100';
        if (pity <= 50) return 'text-yellow-700 border-yellow-500 bg-yellow-100';
        if (pity <= 65) return 'text-orange-700 border-orange-500 bg-orange-100';
        return 'text-red-700 border-red-500 bg-red-100';
    }

    const handlePickSheet = async (index: number) => {
        await loadPicker();
        createPicker((id) => {
            setDatasets((prev: any) => {
                const copy = [...prev];
                copy[index] = { ...copy[index], id };
                localStorage.setItem("userDatasets", JSON.stringify(copy));
                return copy;
            });

            fetchData(id, index);
        });
    };

    return (
        <div >
            {!isSignedIn ? (
                <div className="max-w-2xl mx-auto space-y-6">
                    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                        A P5X Wish Tracker
                    </h1>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        A website that uses Google Drive/Sheets API to store pull data and displays pull statistics, pity tracking,
                        among other info. This app cannot automatically grab pull history but it provides an easy interface to catalogue
                        your data!
                    </p>
                    <blockquote className="mt-6 border-l-2 pl-6 italic">
                        &quot;Quite possibly the [...] best [...] software I've [...] ever [...] used.&quot;
                    </blockquote>
                    <Separator/>
                    <Button onClick={handleSignIn} disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In with Google"}
                    </Button>
                </div>
            ) : (
                <div className="flex flex-wrap gap-6 justify-center px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
                    {datasets.map((ds: {
                        id: string;
                        source: string | undefined;
                        sublabel: string;
                        label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
                        pity4: string;
                        pity5: string;
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
                                                    setPosition("N/A")
                                                    selectedCharacters.fill({ src: "./src/assets/chicons/basic.png", modalsrc: "./src/assets/persicons/basic.png", rarity: "none", name:"Clear", codename: "N/A", affinity: "Support" });
                                                }
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="p-1"
                                                        title="Add Row"
                                                        onClick={() => {
                                                            setCurrentBanner(ds.id)
                                                            setCurrentBannerSublabel(ds.sublabel);
                                                        }}
                                                    >
                                                        <img
                                                            src="./src/assets/add-icon.png"
                                                            alt="Add Row to Spreadsheet"
                                                            className="w-5 h-5 object-contain"
                                                        />
                                                    </Button>
                                                </DialogTrigger>

                                                {/* This is the dialog content that adds new data / pull history to the spreadsheet */}
                                                <div>
                                                    <DialogSheetContent
                                                        bgImage={bgImage}
                                                        banners={banners}
                                                        currentBanner={currentBanner}
                                                        currentBannerSublabel={currentBannerSublabel}
                                                        position={position}
                                                        setPosition={setPosition}
                                                        date={date}
                                                        setDate={setDate}
                                                        time={time}
                                                        setTime={setTime}
                                                        setOpenDatePicker={setOpenDatePicker}
                                                        appendCharactersToSheet={appendCharactersToSheet}
                                                        selectedCharacters={selectedCharacters}
                                                        setDialogOpen={setDialogOpen}
                                                        datasets={datasets}
                                                        fetchData={fetchData}
                                                        openCharacterPicker={openCharacterPicker}
                                                        pickerOpenForIndex={pickerOpenForIndex}
                                                        setPickerOpenForIndex={setPickerOpenForIndex}
                                                        handleCharacterSelect={handleCharacterSelect}
                                                    />
                                                </div>
                                            </Dialog>

                                            {/* Set Spreadsheet Button */}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handlePickSheet(i)}
                                                className="p-1"
                                                title="Set Spreadsheet via Google Drive"
                                            >
                                                <img
                                                    src="./src/assets/edit-icon.png"
                                                    alt="Set Spreadsheet"
                                                    className="w-6 h-6 object-contain translate-y-[2px]"
                                                />
                                            </Button>
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
                                                        src="./src/assets/jewels.png"
                                                        alt="Meta Jewels"
                                                        className="w-4 h-4 object-contain"
                                                    />
                                                    <span>{(allStats[i].total * 150).toLocaleString()}</span>
                                                </>
                                                }
                                                value={allStats[i]?.total ?? 0}
                                                bg="bg-gray-100"
                                                className="w-full min-h-[30px]"  // example width and min height
                                            />
                                            <StatCard
                                                label={`4-Star Pity`}
                                                sublabel={`Guaranteed at ` + ds.pity4}
                                                value={allStats[i]?.sinceLast4 ?? -1}
                                                bg="bg-yellow-100"
                                                className="w-full min-h-[30px]"
                                            />
                                            <StatCard
                                                label={`5-Star Pity`}
                                                sublabel={`Guaranteed at ` + ds.pity5}
                                                value={allStats[i]?.sinceLast5 ?? -1}
                                                bg="bg-purple-100"
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
                                                            {pull.name} at {pull.pity} pity
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
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">Pull History</Button>
                                        </DialogTrigger>

                                        <DialogContent className="w-full sm:max-w-[75vw] max-h-[80vh] p-0 m-0 bg-white flex flex-col">
                                            {/* Sticky Dialog Header */}
                                            <DialogHeader className="bg-white border-b px-6 py-4">
                                                <DialogTitle className="text-center">Pull History - {ds.label}</DialogTitle>
                                            </DialogHeader>

                                            {/* Scrollable table area */}
                                            <div className="overflow-y-auto overflow-x-auto flex-grow">
                                                <Table className="min-w-full border-collapse">
                                                    <TableHeader>
                                                        <TableRow className="sticky top-0 z-20 bg-white border-b border-border">
                                                            <TableHead className="text-center px-4 py-2">Pull Number</TableHead>
                                                            <TableHead className="text-center px-4 py-2">Reward Type</TableHead>
                                                            <TableHead className="text-center px-4 py-2">Reward Name</TableHead>
                                                            <TableHead className="text-center px-4 py-2">Contract Type</TableHead>
                                                            <TableHead className="text-center px-4 py-2">Contract Time</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {allPulls[i]?.map((row, index) => (
                                                            <TableRow
                                                                key={index}
                                                                className={`cursor-default ${rowClassForRarity(row[0]?.trim() || '')}`}
                                                                style={{
                                                                    boxShadow: `0 0 0 2px ${rarityBorderColor(row[0]?.trim() || '')}`
                                                                }}
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell className="text-center px-4 py-2">{index + 1}</TableCell>
                                                                <TableCell className="text-center px-4 py-2">{starsForRarity(row[0])}</TableCell>
                                                                <TableCell className="text-center px-4 py-2">{row[1]}</TableCell>
                                                                <TableCell className="text-center px-4 py-2">{row[2]}</TableCell>
                                                                <TableCell className="text-center px-4 py-2">{row[3]}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>

                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">Pity Planner</Button>
                                        </DialogTrigger>
                                    </Dialog>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

};

export default SheetStats;
