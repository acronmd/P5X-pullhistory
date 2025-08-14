import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

const COLORS = ["#6C7A96", "#E0AF46", "#A36BCF"];


export default function RarityPieChart({ rarityCounts }) {
    // Convert your rarityCounts object into an array for Recharts
    const data = Object.entries(rarityCounts).map(([rarity, count]) => ({
        name: `${rarity}★`,
        value: count
    }));

    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>Pull Rarity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <PieChart width={400} height={300}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
                        dataKey="value"
                        labelLine={false}
                    >
                        {Object.entries(rarityCounts).map(([_, _c], i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </CardContent>
        </Card>

    );
}
