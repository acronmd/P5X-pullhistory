// DialogSheetContent.tsx
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import CharacterPicker from "./CharacterPicker";
import {useState} from "react";
import ImageOCRUploader from "@/components/ImageOCRUploader.tsx";
import {appendCharactersToSheetWithOCR} from "@/utils/google.ts";
import type { pullData } from "@/components/ImageOCRUploader";

type Props = {
    bgImage: string;
    banners: any[];
    currentBanner: string;
    currentBannerSublabel: string;
    currentSheetName: string;
    position: string;
    setPosition: (val: string) => void;
    date: Date | null;
    setDate: (d: Date | null) => void;
    time: string;
    setTime: (val: string) => void;
    setOpenDatePicker: (val: boolean) => void;
    appendCharactersToSheet: (...args: any[]) => Promise<void>;
    selectedCharacters: any[];
    setDialogOpen: (val: boolean) => void;
    datasets: any[];
    fetchData: (...args: any[]) => void;
    openCharacterPicker: (index: number) => void;
    pickerOpenForIndex: number | null;
    setPickerOpenForIndex: (val: number | null) => void;
    handleCharacterSelect: (val: any) => void;
};

export default function DialogSheetContent({
                                               bgImage,
                                               banners,
                                               currentBanner,
                                               currentBannerSublabel,
                                               currentSheetName,
                                               position,
                                               setPosition,
                                               date,
                                               setDate,
                                               time,
                                               setTime,
                                               setOpenDatePicker,
                                               appendCharactersToSheet,
                                               selectedCharacters,
                                               setDialogOpen,
                                               datasets,
                                               fetchData,
                                               openCharacterPicker,
                                               pickerOpenForIndex,
                                               setPickerOpenForIndex,
                                               handleCharacterSelect,
                                           }: Props) {

    const [ocrResult, setOcrResult] = useState<pullData[]>([]);
    const [OCRDialogOpen, setOCRDialogOpen] = useState(false);

    const handleTextExtracted = (data: pullData[]) => {
        //console.log('OCR Text:', data);
        setOcrResult(data);
        setOCRDialogOpen(true);

        // Do your parsing and send to Sheets here
        // e.g. sendToGoogleSheets(parsePullData(text));
    };

    return (
        <DialogContent
            className="w-full sm:max-w-7xl bg-cover pt-25 pb-10 border-4 shadow-none overflow-visible"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <img
                src="./src/assets/texts/history.png"
                alt="History"
                className="absolute top-[-40px] left-1/2 -translate-x-33 -translate-y-10 w-[260px]"
                draggable={false}
            />
            <div>
                <div className={"flex items-center gap-4 mb-6"}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="min-w-[100px]">Current Banner: {position}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Banner Selection</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                {banners
                                    .filter(b => {
                                        if (currentBannerSublabel === "Most Wanted Ph. Idol") return b.sublabel === "Most Wanted Ph. Idol";
                                        if (currentBannerSublabel === "Arms Deal") return b.sublabel === "Arms Deal";
                                        if (currentBannerSublabel === "Phantom Idol") return b.sublabel === "Phantom Idol";
                                        return false; // fallback for unknown category
                                    })
                                    .map(banner => (
                                        <DropdownMenuRadioItem key={banner.value} value={banner.value}>
                                            {banner.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={OCRDialogOpen} onOpenChange={setOCRDialogOpen}>
                        <DialogTrigger asChild>
                            <ImageOCRUploader onTextExtracted={handleTextExtracted} />
                        </DialogTrigger>

                        <DialogContent className="w-full max-w-2xl sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>
                                    Extracted Pull Info - {position} ({ocrResult.length} Pulls)
                                </DialogTitle>
                            </DialogHeader>

                            <pre className="bg-gray-100 p-4 max-h-[60vh] overflow-auto rounded whitespace-pre-wrap">
                                  {ocrResult.length > 0
                                      ? ocrResult.map((entry) => `${entry.name} | ${entry.timestampFull}`).join('\n')
                                      : 'No text extracted yet.'}
                            </pre>

                            <DialogClose asChild>
                                <div className={"w-full flex gap-4"}>
                                    <Button
                                        variant="outline"
                                        className="w-32 font-normal"
                                        disabled={!ocrResult.length || position=="N/A"}
                                        onClick={async () => {
                                            if(position === "N/A"){
                                                console.error("Please select a banner")
                                            }
                                            else {
                                                try {
                                                    await appendCharactersToSheetWithOCR(
                                                        currentBanner,
                                                        currentSheetName, // tab name
                                                        ocrResult.reverse(),
                                                        position,
                                                        currentBannerSublabel
                                                    );
                                                    datasets.forEach((ds: {
                                                        sheetName: string;
                                                    }, i: number) => {
                                                        if (ds.sheetName) fetchData(ds.sheetName, i);
                                                    });
                                                    selectedCharacters.fill({
                                                        src: "./src/assets/chicons/basic.png",
                                                        modalsrc: "./src/assets/persicons/basic.png",
                                                        rarity: "none",
                                                        name: "Clear",
                                                        codename: "N/A",
                                                        affinity: "Support",
                                                    });
                                                    setPosition("N/A");
                                                    setDialogOpen(false);
                                                } catch (err) {
                                                    console.error("Failed to send data", err);
                                                }
                                            }
                                        }}
                                    >
                                        Submit to Sheet
                                    </Button>
                                    <Button variant="outline" className="font-normal">
                                        Close
                                    </Button>
                                </div>
                            </DialogClose>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Pillar Layout */}
                <div className="flex justify-center gap-4 py-6 px-4">
                    {selectedCharacters.map((_char, i) => {
                        const offsetMapY = ["translate-y-0", "translate-y-5", "translate-y-0", "-translate-y-5"];
                        const offsetMapX = ["translate-x-0", "-translate-x-1", "translate-x-0", "translate-x-1"];
                        const offsetClassY = offsetMapY[i % offsetMapY.length];
                        const offsetClassX = offsetMapX[i % offsetMapX.length];

                        const rarityGlow = {
                            none: "shadow-md shadow-gray-100",
                            common: "shadow-sm shadow-gray-600",
                            rare: "shadow-lg shadow-yellow-400",
                            superrare: "shadow-xl shadow-purple-500",
                        };
                        // @ts-ignore
                        const glowClass = rarityGlow[selectedCharacters[i].rarity];

                        return (
                            <div
                                className={`relative w-24 h-100 skew-x-[-14deg] ${offsetClassY} ${offsetClassX} ${glowClass}
                                                                                        flex items-center justify-center cursor-pointer
                                                                                        transition`}
                                onClick={() => openCharacterPicker(i)}
                            >
                                <div
                                    className="absolute top-0 -left-12.5 w-[203%] h-100 overflow-visible pointer-events-none skew-x-[14deg]"
                                >
                                    <img
                                        src={selectedCharacters[i].src}
                                        alt="Selected Character"
                                        className="w-full h-full object-contain"
                                        draggable={false}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={"flex justify-between items-center w-full"}>
                <div className="flex gap-4">
                    <div className="flex flex-col gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-32 justify-between font-normal"
                                >
                                    {date ? date.toLocaleDateString() : "Select date"}
                                    <ChevronDownIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setDate(date)
                                        setOpenDatePicker(false)
                                    }}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Input
                            type="time"
                            step="1"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        className="w-32 font-normal"
                        onClick={async () => {
                            if(position === "N/A"){
                                console.error("Please select a banner")
                            }
                            else {
                                try {
                                    await appendCharactersToSheet(
                                        currentBanner,
                                        currentSheetName, // tab name
                                        selectedCharacters,
                                        currentBannerSublabel,
                                        position,
                                        date,
                                        time
                                    );
                                    datasets.forEach((ds: {
                                        sheetName: string;
                                    }, i: number) => {
                                        if (ds.sheetName) fetchData(ds.sheetName, i);
                                    });
                                    selectedCharacters.fill({
                                        src: "./src/assets/chicons/basic.png",
                                        modalsrc: "./src/assets/persicons/basic.png",
                                        rarity: "none",
                                        name: "Clear",
                                        codename: "N/A",
                                        affinity: "Support",
                                    });
                                    setPosition("N/A");
                                    setDialogOpen(false);
                                } catch (err) {
                                    console.error("Failed to send data", err);
                                }
                            }
                        }}
                    >
                        Submit to Sheet
                    </Button>
                </div>
            </div>
            <CharacterPicker
                isOpen={pickerOpenForIndex !== null}
                onClose={() => setPickerOpenForIndex(null)}
                onSelect={handleCharacterSelect}
            />
        </DialogContent>
    );
}
