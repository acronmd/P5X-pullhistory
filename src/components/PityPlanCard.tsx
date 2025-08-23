import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jewelImage from "@/assets/jewels.png";

interface PityPlanCardProps {
    title: string;
    mainValue: string | number;
    subValue?: string;
}

export function PityPlanCard({ title, mainValue, subValue }: PityPlanCardProps) {
    return (
        <Card className="p-0 h-[165px] w-[205px]">
            {/* Header */}
            <CardHeader className="px-4 pt-4 pb-4">
                <CardTitle className="text-sm text-center whitespace-nowrap">
                    {title}
                </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex flex-col items-center justify-center p-0 -mt-2">
                <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex flex-row items-center gap-2 whitespace-nowrap">
                        <img
                            src={jewelImage}
                            alt="Meta Jewels"
                            className="w-6 h-6 object-contain"
                        />
                        <p className="text-2xl font-bold">
                            {typeof mainValue === "number"
                                ? mainValue.toLocaleString()
                                : mainValue}
                        </p>
                    </div>
                    {subValue && (
                        <p className="text-xs text-muted-foreground text-center whitespace-nowrap">
                            {subValue}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
