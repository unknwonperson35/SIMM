import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Cell, ResponsiveContainer,
} from "recharts";

const BIAS_COLORS = ["#0aff9d", "#ff5a1f", "#c26bff", "#10d0ff"];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "#0c1422",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "10px 14px",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 12,
                color: payload[0]?.fill || "#0aff9d"
            }}>
                <p style={{ marginBottom: 4, color: "#7a95b5", fontSize: 10, letterSpacing: 1 }}>
                    {label.toUpperCase()}
                </p>
                <p style={{ fontWeight: 700, fontSize: 18 }}>{payload[0]?.value}</p>
            </div>
        );
    }
    return null;
};

export default function BiasChart({ scores }) {
    const data = [
        { name: "Framing", value: scores.framing_score ?? 0 },
        { name: "Authority", value: scores.authority_score ?? 0 },
        { name: "Emotional", value: scores.emotional_score ?? 0 },
        { name: "Confirmation", value: scores.confirmation_score ?? 0 },
    ];

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} barSize={38} margin={{ top: 4, right: 4, bottom: 4, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, letterSpacing: 1 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tickCount={6} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={BIAS_COLORS[idx % BIAS_COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
