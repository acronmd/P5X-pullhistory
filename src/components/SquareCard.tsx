import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SquareCardProps {
  title: string;
  mainValue: string | number;
  subValue?: string;
  banner: string;
}

export function SquareCard({ title, mainValue, subValue, banner }: SquareCardProps) {
    return (
      <Card className="p-4 flex flex-col justify-center w-[165px] h-[165px]">
        <CardHeader className="mb-2 -mt-6">
          <CardTitle className="text-sm text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-1">
            {banner == "Standard Banner" ? (
                <div>
                    <p className="text-2xl font-bold">N/A</p>
                    {subValue && <p className="text-xs text-muted-foreground">No 50/50</p>}
                </div>
            ) : (
                <div>
                    <p className="text-2xl font-bold">{mainValue}</p>
                    {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
                </div>
            )}
        </CardContent>
      </Card>
    );
}
