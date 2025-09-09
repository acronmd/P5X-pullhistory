import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import {formatPullTime, getLocalizedNameFallback} from "@/utils/sharedFunctions.tsx"

import React from "react";

import {useLanguage} from "@/utils/language.tsx";
import {IDMap} from "@/components/CharacterPicker.tsx";

interface Pull {
    name: string;
    name_en: string;
    name_ko: string;
    pity: number;
    index: number;
    fullIconUrl: string;
    assChara: number;
    time: string;
    id: number;
}

interface Props {
    pulls: Pull[];
}

export default function LuckiestPullsCarousel({ pulls }: Props) {
    const { language } = useLanguage();

    return (
        <Card className="px-4 flex-grow">
            <CardHeader>
                <CardTitle>Luckiest Pulls</CardTitle>
            </CardHeader>
            <CardContent>
                <Carousel>
                    <CarouselContent>
                        {pulls.map((pull: Pull, index) => (
                            <CarouselItem key={index} className="relative w-full h-full">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <img
                                            src={pull.fullIconUrl}
                                            alt={getLocalizedNameFallback(pull.id, language, pull.name)}
                                            className="w-full h-full object-contain"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <div className="text-center">
                                            <div className="flex flex-row gap-3 items-center justify-center">
                                                <p className="font-bold">{getLocalizedNameFallback(pull.id, language, pull.name)}</p>
                                                {pull.assChara && (
                                                    <p>
                                                        {getLocalizedNameFallback(pull.assChara, language, IDMap[pull.assChara].name_en).split(" ")[0]} only
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-sm text-neutral-500">Pity: {pull.pity}</p>
                                            <p className="text-sm text-neutral-500">{formatPullTime(pull.time)}</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                                <div
                                    className="absolute top-1 left-1/2 -translate-x-[28%] -translate-y-1.25 text-white px-2 rounded-md text-center font-bold"
                                >
                                    {pull.pity}
                                </div>


                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </CardContent>
        </Card>
    );
}
