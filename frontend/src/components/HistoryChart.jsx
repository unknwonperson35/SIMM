import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart,
} from "recharts";

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
            }}>
                <p style={{ marginBottom: 4, color: "#7a95b5", fontSize: 10, letterSpacing: 1 }}>
                    SESSION {label}
                </p>
                <p style={{ fontWeight: 700, fontSize: 18, color: "#0aff9d" }}>
                    MI: {payload[0]?.value}
                </p>
            </div>
        );
    }
    return null;
};

export default function HistoryChart({ history }) {
    const data = history.map((entry, idx) => ({
        session: idx + 1,
        mi: entry.manipulation_index ?? 0,
    }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -18 }}>
                <defs>
                    <linearGradient id="miGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0aff9d" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0aff9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="session"
                    tick={{ fontSize: 10, letterSpacing: 1 }}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: "SESSION", position: "insideBottom", offset: -4, fontSize: 9, fill: "#3a5070", letterSpacing: 2 }}
                />
                <YAxis
                    domain={[0, 100]}
                    tickCount={6}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(10,255,157,0.2)", strokeWidth: 1.5 }} />
                <Area
                    type="monotone"
                    dataKey="mi"
                    stroke="#0aff9d"
                    strokeWidth={2}
                    fill="url(#miGradient)"
                    dot={{ fill: "#0aff9d", r: 4, strokeWidth: 0 }}
                    activeDot={{ fill: "#0aff9d", r: 6, strokeWidth: 0, boxShadow: "0 0 12px #0aff9d" }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
