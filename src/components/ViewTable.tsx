import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react"

import { formatUnixToLocal } from "@/utils/sharedFunctions.tsx";
import { formatPullTime } from "@/utils/sharedFunctions.tsx";
import { getContractLabel } from "@/utils/sharedFunctions.tsx";

import { getCellValueByLanguage } from "@/utils/sharedFunctions.tsx";

import '@/colors.css';
import {useLanguage} from "@/utils/language.tsx";

interface PullTableCardProps {
    pulls: any[][]; // the sheet data
    label: string;
}

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
            return 'bg-rarity-5 hover:bg-rarity-5bg';
        case '4':
            return 'bg-rarity-4 hover:bg-rarity-4bg';
        default:
            return 'bg-rarity-3 hover:bg-rarity-3bg';
    }
}

export default function PullTableCard({ pulls, label }: PullTableCardProps) {
    const { language } = useLanguage();

    const [isReversed, setIsReversed] = useState(true);

    const displayedPulls = isReversed ? [...pulls].reverse() : pulls;

    const [isExpanded, setIsExpanded] = useState(false);


    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>{label} - Pull History</CardTitle>
                <div className="flex flex-row gap-5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsReversed(prev => !prev)}
                    >
                        Switch to {isReversed ? "Oldest First" : "Newest First"}
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
                                <TableHead className="text-center px-4 py-2">Pull #</TableHead>
                                <TableHead className="text-center px-4 py-2">Reward Type</TableHead>
                                <TableHead className="text-center px-4 py-2">Reward Name</TableHead>
                                <TableHead className="text-center px-4 py-2">Contract Type</TableHead>
                                <TableHead className="text-center px-4 py-2">Contract Time</TableHead>
                                <TableHead className="text-center px-4 py-2">Contract ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedPulls.map((row, index) => (
                                <TableRow
                                    key={index}
                                    className={`${rowClassForRarity(row[0]?.trim())}`}
                                >
                                    <TableCell className="text-center px-4 py-2">{isReversed ? pulls.length - index : index + 1}</TableCell>
                                    <TableCell className="text-center px-4 py-2">{starsForRarity(row[0])}</TableCell>
                                    <TableCell className="text-center px-4 py-2">{getCellValueByLanguage(row, language)}</TableCell>
                                    <TableCell className="text-center px-4 py-2">{getContractLabel(row[1])}</TableCell>
                                    <TableCell className="text-center px-4 py-2">{formatUnixToLocal(row[2])}</TableCell>
                                    <TableCell className="text-center px-4 py-2">{row[3]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

