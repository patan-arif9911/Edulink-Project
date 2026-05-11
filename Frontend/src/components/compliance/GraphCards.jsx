import React from 'react';
import { 
    AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, 
    CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

/* ── Light Theme Tooltip ── */
const LightTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-50">
                <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">
                    {label || payload[0].name}
                </p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-gray-900 text-lg font-bold">{payload[0].value}</p>
                </div>
            </div>
        );
    }
    return null;
};

export default function GraphCards({ circleChart, barChart, titleCircle, subtitleCircle, titleBar, subtitleBar }) {
    // Shared styling for the White Theme cards
    const cardStyle = "bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-300 p-6 sm:p-8 flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]";
    const titleStyle = "text-lg sm:text-xl font-bold text-gray-800 tracking-tight mb-1 flex items-center gap-2";
    const subtitleStyle = "text-gray-400 text-sm font-medium";
    const indicatorStyle = "inline-block w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            
            {/* ── 1. Rules Distribution (Donut - Light Theme) ── */}
            <div className={cardStyle}>
                <div className="mb-6">
                    <h2 className={titleStyle}>
                        <span className={indicatorStyle} />
                        {titleCircle}
                    </h2>
                    <p className={subtitleStyle}>{subtitleCircle}</p>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={circleChart}
                                    cx="50%" cy="50%"
                                    innerRadius={75} outerRadius={105}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="#fff" // White gap between segments
                                    strokeWidth={3}
                                    labelLine={false}
                                    label={({ value }) => value > 0 ? `${value}` : ''}
                                >
                                    {circleChart?.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.fill || '#f59e0b'} 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<LightTooltip />} />
                                <Legend 
                                    iconType="circle" iconSize={8} 
                                    wrapperStyle={{ paddingTop: 20, fontSize: '12px', color: '#94a3b8', fontWeight: 600 }} 
                                    align="center"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── 2. Rule Trends (Trend Graph - Light Theme) ── */}
            <div className={cardStyle}>
                <div className="mb-6">
                    <h2 className={titleStyle}>
                        <span className={indicatorStyle} />
                        {titleBar}
                    </h2>
                    <p className={subtitleStyle}>{subtitleBar}</p>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={barChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                        {/* Softer gradient for white background */}
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    tickFormatter={(value) => value?.slice(0, 2)}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                />
                                <Tooltip content={<LightTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f59e0b"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#trendGradient)"
                                    dot={{ fill: '#fff', stroke: '#f59e0b', strokeWidth: 2, r: 5 }}
                                    activeDot={{ r: 7, strokeWidth: 0, fill: '#fbbf24' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
        </div>
    );
}