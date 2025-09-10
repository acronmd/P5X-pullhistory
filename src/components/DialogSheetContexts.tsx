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
import {useEffect, useState} from "react";
import ImageOCRUploader from "@/components/ImageOCRUploader.tsx";
import {appendCharactersToSheetWithOCR} from "@/utils/google.ts";
import type { pullData } from "@/components/ImageOCRUploader";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {AlertDialogFooter, AlertDialogHeader} from "@/components/ui/alert-dialog.tsx";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import pullhistoryBanner from "@/assets/texts/history.png";
import screenshotIcon from "@/assets/camera-icon.png";
import manualIcon from "@/assets/record-icon.png";

type Props = {
    bgImage: string;
    currentBanner: string;
    currentBannerSublabel: string;
    currentSheetName: string;
    date: Date | undefined;
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
                                               currentBanner,
                                               currentBannerSublabel,
                                               currentSheetName,
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
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (ocrResult.length > 0 && ocrResult.length < 10) {
            setAlertDialogError("Less than 10 pulls detected in screenshot, dismiss if intentional. \n" +
                "Potential names parsed by Tesseract are found in browser console");
            setAlertDialogBoolean(true);
        }
    }, [ocrResult]);

    const [alertDialogBoolean, setAlertDialogBoolean] = useState(false);
    const [alertDialogError, setAlertDialogError] = useState<string>("");

    const handleTextExtracted = (data: pullData[]) => {
        //console.log('OCR Text:', data);
        setOcrResult(data);
        setOCRDialogOpen(true);

        // Do your parsing and send to Sheets here
        // e.g. sendToGoogleSheets(parsePullData(text));
    };

    const [uploadMode, setUploadMode] = useState<"none" | "ocr" | "manual">("none");

    if (uploadMode === "none") {
        return (
            <DialogContent
                className={`
                sm:max-w-7xl 
                bg-cover 
                pb-10 border-4 shadow-none overflow-visible
                pt-8
                w-[80vw] sm:w-[70vw] lg:w-[40vw]
                `}
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold text-white">
                        Choose Upload Method
                    </DialogTitle>
                </DialogHeader>

                <div className="flex gap-6 w-full justify-center">
                    <Button
                        className="w-[45%] h-40 sm:h-48 lg:h-56 shadow-lg border bg-neutral-900 hover:bg-neutral-800 flex flex-col items-center p-4"
                        onClick={() => setUploadMode("ocr")}
                    >
                        {/* Image: 60% of the button height */}
                        <img
                            src={screenshotIcon}
                            alt="Upload Screenshot"
                            className="h-[60%] w-auto object-contain"
                        />

                        {/* Separator */}
                        <div className="w-full h-[2px] bg-white my-2" />

                        {/* Text: remaining space */}
                        <span className="text-base sm:text-lg font-semibold text-center text-white">
                            Upload Screenshot
                        </span>
                    </Button>
                    <Button
                        disabled={true}
                        className="w-[45%] h-40 sm:h-48 lg:h-56 shadow-lg border bg-neutral-900 hover:bg-neutral-800 flex flex-col items-center p-4"
                        onClick={() => setUploadMode("manual")}
                    >
                        {/* Image: 60% of the button height */}
                        <img
                            src={manualIcon}
                            alt="Manual Entry"
                            className="h-[60%] w-auto object-contain"
                        />

                        {/* Separator */}
                        <div className="w-full h-[2px] bg-white my-2" />

                        {/* Text: remaining space */}
                        <span className="text-base sm:text-lg font-semibold text-center text-white">
                            Manual Entry
                        </span>
                    </Button>
                </div>
            </DialogContent>

        );
    }

    return (
        <DialogContent
            className={`
                sm:max-w-7xl 
                bg-cover 
                pb-10 border-4 shadow-none overflow-visible
                pt-38 lg:pt-25
                ${uploadMode === "manual" ? "w-[80vw] sm:w-[80vw] lg:w-[80vw]" : "w-[80vw] sm:w-[70vw] lg:w-[40vw]"}
                `}
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Add a Back button */}
            <div className="mb-4 absolute top-22 lg:top-8 left-6">
                <Button
                    variant="outline"
                    onClick={() => setUploadMode("none")}
                >
                    ← Back
                </Button>
            </div>
            <img
                src={pullhistoryBanner}
                alt="History"
                className="absolute top-[-40px] left-1/2 -translate-x-33 -translate-y-10 w-[260px]"
                draggable={false}
            />

            {uploadMode === "ocr" && (
                <div>
                    <Dialog open={OCRDialogOpen} onOpenChange={setOCRDialogOpen}>
                        <DialogTrigger asChild>
                            <ImageOCRUploader
                                onTextExtracted={handleTextExtracted}
                                setAlertDialogBoolean={setAlertDialogBoolean}
                                setAlertDialogError={setAlertDialogError}
                                currentBannerSublabel={currentBannerSublabel}
                            />
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Extracted Pull Info - {currentBannerSublabel} ({ocrResult.length} Pulls)
                                </DialogTitle>
                            </DialogHeader>

                            <pre className="dark:bg-neutral-900 bg-neutral-100 p-4 max-h-[60vh] overflow-auto rounded whitespace-pre-wrap">
                                  {ocrResult.length > 0
                                      ? ocrResult.map((entry) => `${entry.name} | ${entry.timestampFull}`).join('\n')
                                      : 'No text extracted yet.'}
                            </pre>

                            <div className="w-full flex items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            className="w-32 font-normal"
                                            disabled={!ocrResult.length}
                                            onClick={async () => {
                                                try {
                                                    await appendCharactersToSheetWithOCR(
                                                        currentBanner,
                                                        currentSheetName, // tab name
                                                        ocrResult.reverse(),
                                                        currentBannerSublabel
                                                    );
                                                    datasets.forEach((ds: {
                                                        sheetName: string;
                                                    }, i: number) => {
                                                        if (ds.sheetName) fetchData(ds.sheetName, i);
                                                    });
                                                    selectedCharacters.fill({ src: new URL(`../assets/chicons/basic.png`, import.meta.url).href, modalsrc: new URL(`../assets/chicons/modal/basic.png`, import.meta.url).href, collectionsrc: new URL(`../assets/chicons/collection/basic.png`, import.meta.url).href, rarity: "none", codename: "N/A", name:"Clear", affinity: "Support" });
                                                    if( !isChecked ) {
                                                        setDialogOpen(false);
                                                    }
                                                } catch {
                                                    setAlertDialogError("Failed to send data to Google Sheets, please refresh the page.");
                                                    setAlertDialogBoolean(true)
                                                }
                                            }}
                                        >
                                            Submit to Sheet
                                        </Button>
                                    </DialogClose>
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="persistent"
                                            checked={isChecked}
                                            onCheckedChange={(checked) => setIsChecked(!!checked)}
                                        />
                                        <Label htmlFor="persistent">Keep pull window open</Label>
                                    </div>
                                </div>

                                <DialogClose asChild>
                                    <Button variant="outline" className="font-normal">
                                        Close
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            {uploadMode === "manual" && (
                <div>
                    <div>
                        {/* Pillar Layout */}
                        <div className="flex justify-center gap-4 py-12 px-4">
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
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
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
                                                // @ts-expect-error
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
                                    if (date == null) {
                                        setAlertDialogError("Please select a date before submitting manual data.");
                                        setAlertDialogBoolean(true)
                                    }
                                    else {
                                        try {
                                            await appendCharactersToSheet(
                                                currentBanner,
                                                currentSheetName, // tab name
                                                selectedCharacters,
                                                currentBannerSublabel,
                                                date,
                                                time
                                            );
                                            datasets.forEach((ds: {
                                                sheetName: string;
                                            }, i: number) => {
                                                if (ds.sheetName) fetchData(ds.sheetName, i);
                                            });
                                            selectedCharacters.fill({ src: new URL(`../assets/chicons/basic.png`, import.meta.url).href, modalsrc: new URL(`../assets/chicons/modal/basic.png`, import.meta.url).href, collectionsrc: new URL(`../assets/chicons/collection/basic.png`, import.meta.url).href, rarity: "none", codename: "N/A", name:"Clear", affinity: "Support" });
                                            setDialogOpen(false);
                                        } catch {
                                            setAlertDialogError("Failed to send data to Google Sheets, please refresh the page.");
                                            setAlertDialogBoolean(true)
                                        }
                                    }
                                }}
                            >
                                Submit to Sheet
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            <div className="dialogs">
                <CharacterPicker
                    isOpen={pickerOpenForIndex !== null}
                    onClose={() => setPickerOpenForIndex(null)}
                    onSelect={handleCharacterSelect}
                />
                <AlertDialog open={alertDialogBoolean} onOpenChange={setAlertDialogBoolean}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Error</AlertDialogTitle>
                            <AlertDialogDescription>{alertDialogError}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Dismiss</AlertDialogCancel>
                            {/* <AlertDialogAction onClick={() => setAlertDialogBoolean(false)}>Okay</AlertDialogAction> */}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DialogContent>
    );
}
