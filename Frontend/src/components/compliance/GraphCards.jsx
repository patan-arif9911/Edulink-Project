import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PIE_FALLBACK = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b'];

/* ── Donut tooltip ── */
const DonutTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-700 mb-0.5">{payload[0].name}</p>
            <p className="font-bold text-lg" style={{ color: payload[0].payload.fill || '#2091b9' }}>
                {payload[0].value}
            </p>
        </div>
    );
};

/* ── Spike tooltip (dark theme) ── */
const SpikeTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const color = payload[0]?.payload?.fill || '#60a5fa';
    return (
        <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-xl px-4 py-3 text-sm">
            <p className="font-semibold text-slate-300 mb-0.5">{payload[0].payload.name}</p>
            <p className="font-bold text-lg" style={{ color }}>{payload[0].value}</p>
        </div>
    );
};

/* ── Custom teardrop / spike shape ── */
const SpikeBar = (props) => {
    const { x, y, width, height, fill, index } = props;
    if (!height || height <= 0) return null;

    const cx     = x + width / 2;
    const bottom = y + height;
    const top    = y;
    const gId    = `sg-${index}-${Math.round(x)}`;

    const d = [
        `M ${cx} ${top}`,
        `C ${cx - 3} ${top + height * 0.52} ${x} ${bottom - height * 0.13} ${x} ${bottom}`,
        `L ${x + width} ${bottom}`,
        `C ${x + width} ${bottom - height * 0.13} ${cx + 3} ${top + height * 0.52} ${cx} ${top}`,
        'Z',
    ].join(' ');

    return (
        <g>
            <defs>
                <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={fill} stopOpacity={1}   />
                    <stop offset="100%" stopColor={fill} stopOpacity={0.45} />
                </linearGradient>
            </defs>
            <path d={d} fill={`url(#${gId})`} />
        </g>
    );
};

/* ── Colored value label above each spike ── */
const renderSpikeLabel = (chartData) => (props) => {
    const { x, y, width, value, index } = props;
    if (!value) return null;
    const color = chartData[index]?.fill || '#60a5fa';
    return (
        <text
            key={`lbl-${index}`}
            x={x + width / 2}
            y={y - 8}
            textAnchor="middle"
            fill={color}
            fontSize={11}
            fontWeight={700}
        >
            {value}
        </text>
    );
};



// circleChart(name: 'Title', value: numericalValue, fill: color)
// barChart(name: 'Title', value: numericalValue, fill: color)


export default function GraphCards({ circleChart, barChart, COLORS }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 px-2 sm:px-0">
            {/* ── Rules Distribution — Donut ── */}
            <div className="group bg-gradient-to-br from-neutral-800 via-neutral-900 to-slate-900 rounded-3xl shadow-lg border border-neutral-800 overflow-hidden hover:scale-[1.025] hover:shadow-2xl hover:border-slate-700 transition-all duration-300">
                <div className="h-1.5 bg-gradient-to-r from-neutral-700 to-slate-800" />
                <div className="p-6 sm:p-8 flex flex-col h-full">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight mb-1 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                        Rules Distribution
                    </h2>
                    <p className="text-slate-300 text-sm mb-6">Breakdown by rule status</p>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-full h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={circleChart}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {circleChart.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.fill || PIE_FALLBACK[index % PIE_FALLBACK.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<DonutTooltip />} />
                                    <Legend iconType="circle" iconSize={12} wrapperStyle={{ paddingTop: 12 }} align="center"/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Users by Type — Spike chart (matching card) ── */}
            <div className="group bg-gradient-to-br from-neutral-800 via-neutral-900 to-slate-900 rounded-3xl shadow-lg border border-neutral-800 overflow-hidden hover:scale-[1.025] hover:shadow-2xl hover:border-slate-700 transition-all duration-300">
                <div className="h-1.5 bg-gradient-to-r from-neutral-700 to-slate-800" />
                <div className="p-6 sm:p-8 flex flex-col h-full">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight mb-1 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                        Users by Type
                    </h2>
                    <p className="text-slate-300 text-sm mb-6">Distribution across user roles</p>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-full h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={barChart}
                                    barSize={38}
                                    barCategoryGap="28%"
                                    margin={{ top: 24, right: 8, left: -10, bottom: 0 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="4 4"
                                        stroke="#334155"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 15, fill: '#cbd5e1' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => value.slice(0, 2)}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#cbd5e1' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        content={<SpikeTooltip />}
                                        cursor={{ fill: 'rgba(30,41,59,0.08)', radius: 6 }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        shape={<SpikeBar />}
                                        label={renderSpikeLabel(barChart)}
                                    >
                                        {barChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill || COLORS.primary} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
