import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { formatPullTime } from "@/utils/sharedFunctions.tsx"

import defaultModal from "@/assets/chicons/modal/basic.png"

import { getLocalizedNameFallback} from "@/utils/sharedFunctions.tsx";
import {useLanguage} from "@/utils/language.tsx";

import { IDMap } from "@/components/CharacterPicker.tsx";

interface MostPulledCardProps {
    title: string;
    mostPulled?: {
        name: string;
        name_en: string;
        name_ko: string;
        count?: number;
        iconUrl?: string;
        fullIconUrl: string;
        time: string;
        assChara?: number;
        id: number;
        gachaId: number;
    };
    width: number;
    banner?: string;
}

export function MostPulledCard({ title, mostPulled, width, banner }: MostPulledCardProps) {
    const { language } = useLanguage();

    const isEmpty = !mostPulled;

    const display = isEmpty
        ? {
            name: "No pulls yet",
            name_en: "No pulls yet",
            name_ko: "No pulls yet",
            count: 0,
            iconUrl: defaultModal,
            fullIconUrl: defaultModal,
            time: "",
            assChara: undefined,
            id: 9999999,
            gachaId: 999999,
        }
        : mostPulled;

    if (banner && banner === "Standard Banner") {
        if (title.includes("Limited")) {
            return
        } else {
            return (
                <Card style={{width: `165px`, height: "165px"}}>
                    <CardHeader className="flex justify-center items-center -mt-2 -mb-5.5">
                        <CardTitle className="text-sm text-center">Most Pulled 5★</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div style={{position: "relative", width: "120px", height: "120px",}}>
                                    <img
                                        src={display.iconUrl}
                                        alt={display.name}
                                        className="w-full h-full object-contain"
                                    />
                                    {!isEmpty && (
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
                                    <span
                                        style={{
                                            fontSize: "0.7rem",
                                            fontWeight: "bold",
                                            color: "white",
                                        }}
                                    >
                                        pulls{" "}
                                    </span>
                                            <span
                                                style={{
                                                    fontSize: "1.05rem",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                }}
                                            >
                                        {display.count}
                                    </span>
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-center">
                                {isEmpty ? (
                                    <p className="font-bold">No pulls yet</p>
                                ) : (
                                    <>
                                        <div className="flex flex-row gap-3 items-center justify-center">
                                            <p className="font-bold">{getLocalizedNameFallback(display.id, language, display.name)}</p>
                                            {display.assChara && (
                                                <p>
                                                    {getLocalizedNameFallback(display.assChara, language, IDMap[display.assChara].name_en).split(" ")[0]} only
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-neutral-500">Pulls: {display.count}</p>
                                        <p className="text-sm text-neutral-500">
                                            Last pulled {formatPullTime(display.time)}
                                        </p>
                                    </>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </CardContent>
                </Card>
            )
}
    }

    return (
        <Card style={{ width: `${width}px`, height: "165px" }}>
            <CardHeader className="flex justify-center items-center -mt-2 -mb-5.5">
                <CardTitle className="text-sm text-center">{
                    title
                }</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div style={{ position: "relative", width: "120px", height: "120px", }} >
                            <img
                                src={display.iconUrl}
                                alt={display.name}
                                className="w-full h-full object-contain"
                            />
                            {!isEmpty && (
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
                                    <span
                                      style={{
                                          fontSize: "0.7rem",
                                          fontWeight: "bold",
                                          color: "white",
                                      }}
                                    >
                                        pulls{" "}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "1.05rem",
                                            fontWeight: "bold",
                                            color: "white",
                                        }}
                                    >
                                        {display.count}
                                    </span>
                                </div>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-center">
                        {isEmpty ? (
                            <p className="font-bold">No pulls yet</p>
                        ) : (
                            <>
                                <div className="flex flex-row gap-3 items-center justify-center">
                                    <p className="font-bold">{getLocalizedNameFallback(display.id, language, display.name)}</p>
                                    {display.assChara && (
                                        <p>
                                            {getLocalizedNameFallback(display.assChara, language, IDMap[display.assChara].name_en).split(" ")[0]} only
                                        </p>
                                    )}
                                </div>
                                <p className="text-neutral-500">Pulls: {display.count}</p>
                                <p className="text-sm text-neutral-500">
                                    Last pulled {formatPullTime(display.time)}
                                </p>
                            </>
                        )}
                    </TooltipContent>
                </Tooltip>
            </CardContent>
        </Card>
    );
}
