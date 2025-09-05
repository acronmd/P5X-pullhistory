export function formatPullTime(raw: string) {
    // Normalize: pad hours/minutes/seconds if needed
    let [datePart, timePart] = raw.split(" ");
    let [h, m, s] = timePart.split(":");

    // Pad each part to 2 digits
    h = h.padStart(2, "0");
    m = m.padStart(2, "0");
    s = s.padStart(2, "0");

    const isoString = `${datePart}T${h}:${m}:${s}+09:00`;
    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString("en-US", {
        month: "long",   // "August"
        day: "numeric",  // 4
        year: "numeric", // 2025
        hour: "numeric", // 6
        minute: "2-digit", // 29
        second: "2-digit", // optional
        hour12: true,    // AM/PM
        timeZoneName: "short" // show "UTC"
    });
}