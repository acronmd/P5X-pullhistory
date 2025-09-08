import dummyApiResponse from "@/data/get_records.json";

export async function fetchApiData(apiUrl: string, translate: boolean) {

    const fullUrl = "https://iant.kr:5000/gacha/get_records";

    try {
        const res = await fetch(fullUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: apiUrl,
                translate: translate, // boolean is fine here
            }),
        });

        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Failed to fetch API data:", err);
        // optionally fallback to dummy JSON for testing
        // return dummyApiResponse;
    }
}
