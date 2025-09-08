import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react"

import '@/colors.css';
import { getLocalizedNameFallback} from "@/utils/sharedFunctions.tsx";
import {useLanguage} from "@/utils/language.tsx";

interface MostPulled {
    name: string;
    name_en: string;
    name_ko: string;
    count: number;
    iconUrl: string;
    fullIconUrl: string;
    time: string;
    assChara?: string;
    rarity?: 4 | 5;
    id: number;
}

type MostPulledList = MostPulled[];

interface PullTableCardProps {
    pulls: MostPulledList; // the sheet data
    label: string;
}

function starsForRarity(n: number | undefined) {
    if (n == undefined){
        return '★★★';
    }
    else {
        return '★'.repeat(n);
    }
}

function rowClassForRarity(rarity: number | undefined) {
    switch (rarity) {
        case 5:
            return 'bg-rarity-5 hover:bg-rarity-5bg';
        case 4:
            return 'bg-rarity-4 hover:bg-rarity-4bg';
        default:
            return 'bg-rarity-3 hover:bg-rarity-3bg';
    }
}

export default function PullTableCard({ pulls, label }: PullTableCardProps) {
    const { language } = useLanguage();

    const [isReversed, setIsReversed] = useState(false);

    const displayedPulls = isReversed ? [...pulls].reverse() : pulls;

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>{label} - Most Pulled</CardTitle>
                <div className="flex flex-row gap-5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsReversed(prev => !prev)}
                    >
                        Switch to {isReversed ? "Most Pulled" : "Least Pulled"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsExpanded(prev => !prev)}
                    >
                        {isExpanded ? "Collapse" : "Expand"}
                        <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                            }`}
                        />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                {isExpanded && (
                    <Table className="min-w-full border-collapse">
                        <TableHeader>
                            <TableRow className="bg-rarity-3 sticky top-0 z-10">
                                <TableHead className="text-center px-4 py-2">Pull Count</TableHead>
                                <TableHead className="text-center px-4 py-2">Reward Type</TableHead>
                                <TableHead className="text-center px-4 py-2">Reward Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedPulls.map((row, index) => (
                                <TableRow
                                    key={index}
                                    className={`${rowClassForRarity(row.rarity)}`}
                                >
                                    <TableCell className="text-center px-4 py-2">{row.count}</TableCell>
                                    <TableCell className="text-center px-4 py-2">{starsForRarity(row.rarity)}</TableCell>
                                    <TableCell className="text-center px-4 py-2">{getLocalizedNameFallback(row.id, language, row.name)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

