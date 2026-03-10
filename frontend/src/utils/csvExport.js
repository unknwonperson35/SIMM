/**
 * CSV Export Utility
 * Generates and downloads a CSV analytics report for the user.
 */
export const downloadAnalyticsCSV = (biasHistory, userId) => {
    if (!biasHistory || biasHistory.length === 0) {
        throw new Error("No analytics data available to export.");
    }

    const headers = [
        "Experiment #",
        "Date",
        "Framing Score",
        "Authority Score",
        "Emotional Score",
        "Confirmation Score",
        "Manipulation Index",
    ];

    const rows = biasHistory.map((entry, idx) => {
        const date = entry.calculated_at?.toDate
            ? entry.calculated_at.toDate().toLocaleDateString("en-US")
            : "N/A";
        return [
            idx + 1,
            date,
            entry.framing_score ?? "N/A",
            entry.authority_score ?? "N/A",
            entry.emotional_score ?? "N/A",
            entry.confirmation_score ?? "N/A",
            entry.manipulation_index ?? "N/A",
        ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `analytics_report_${userId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
