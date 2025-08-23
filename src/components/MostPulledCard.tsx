import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { formatPullTime } from "@/utils/sharedFunctions.tsx"
import React from "react";

interface MostPulledCardProps {
    title: string;
    mostPulled?: {
        name: string;
        count: number;
        iconUrl: string;
        fullIconUrl: string;
        time: string;
        assChara?: string;
    };
}

export function MostPulledCard({ title, mostPulled }: MostPulledCardProps) {
    if (!mostPulled) return <div>No pulls yet</div>;

    return (
        <Card className="w-[165px] h-[165px]">
            <CardHeader className="flex justify-between items-center -mt-2 -mb-5.5">
                <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div style={{ position: "relative", width: "120px", height: "120px", }} >
                            <img
                                src={mostPulled.iconUrl}
                                alt={mostPulled.name}
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
                                    fontSize: "0.7rem",
                                    fontWeight: "bold",
                                    color: "white", }}
                                >
                                    pulls {" "}
                                </span>
                                <span style={{
                                    fontSize: "1.05rem",
                                    fontWeight: "bold",
                                    color: "white" }}
                                >
                                    {mostPulled.count}
                                </span>
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-center">
                        <div className="flex flex-row gap-3 items-center justify-center">
                            <p className="font-bold">{mostPulled.name}</p>
                            {mostPulled.assChara && (
                                <p className="text-muted-foreground">
                                    {mostPulled.assChara.split(" ")[0]} only
                                </p>
                            )}
                        </div>
                        <p>Pulls: {mostPulled.count}</p>
                        <p className="text-sm text-muted-foreground">Last pulled {formatPullTime(mostPulled.time)}</p>
                    </TooltipContent>
                </Tooltip>
            </CardContent>
        </Card>
    );
}
