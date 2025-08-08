// src/routes/LimitedBanner.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SheetRow = string[][];

export default function LimitedBanner() {
    const { isSignedIn, isInitialized } = useAuth();
    const navigate = useNavigate();

    const [rows, setRows] = useState<SheetRow>([]);

    const spreadsheetId = localStorage.getItem("sharedSpreadsheetId") ?? "";
    const sheetName = localStorage.getItem("limitedSheet") ?? ""; // Adjust if needed

    useEffect(() => {
        if (isInitialized && !isSignedIn) {
            navigate("/home");
        }
    }, [isInitialized, isSignedIn]);

    useEffect(() => {
        async function fetchData() {
            if (!spreadsheetId) return;
            await gapi.client.load("sheets", "v4");

            const res = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: sheetName,
            });

            const data = res.result.values || [];
            setRows(data);
        }

        fetchData();
    }, [spreadsheetId]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Limited Banner Pulls</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Rarity</TableHead>
                        <TableHead>Name</TableHead>
                        {/* Add more headers if needed */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row[0]}</TableCell>
                            <TableCell>{row[1]}</TableCell>
                            {/* Add more cells if needed */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
