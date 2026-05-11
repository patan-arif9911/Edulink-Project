import React from 'react';

const cardConfigs = [
    { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', textColor: 'text-indigo-900', chartColor: 'stroke-indigo-500' },
    { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', textColor: 'text-emerald-900', chartColor: 'stroke-emerald-500' },
    { iconBg: 'bg-cyan-50', iconColor: 'text-cyan-500', textColor: 'text-cyan-900', chartColor: 'stroke-cyan-500' },
    { iconBg: 'bg-amber-50', iconColor: 'text-amber-500', textColor: 'text-amber-900', chartColor: 'stroke-amber-500' }, // Pending -> Amber
    { iconBg: 'bg-rose-50', iconColor: 'text-rose-500', textColor: 'text-rose-900', chartColor: 'stroke-rose-500' }, // Rejected -> Rose
];

export default function StatusCard({ props: datas }) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
                {Array.isArray(datas) && datas.map((data, index) => {
                    const Icon = data.sign;
                    const config = cardConfigs[index % cardConfigs.length];
                    const displayName = data.name.toUpperCase();

                    return (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 animate-fadeUp overflow-hidden"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Accent Top Bar */}
                            <div className={`absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity ${config.iconBg.replace('50', '500')}`} />

                            <div className="flex flex-col h-full space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2.5 rounded-xl ${config.iconBg} transition-colors`}>
                                        {Icon && <Icon size={18} className={config.iconColor} />}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                        {displayName}
                                    </span>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <h3 className={`text-3xl font-bold leading-none tracking-tight ${config.textColor}`}>
                                            {data.value}
                                        </h3>
                                        <p className="text-[11px] text-gray-400 mt-2 font-medium">Total Volume</p>
                                    </div>

                                    {/* Stylized Trend Sparkline */}
                                    <div className="w-16 h-10">
                                        <svg viewBox="0 0 100 40" className="w-full h-full">
                                            <path 
                                                d={`M0 ${35 - (index * 4)} C 20 ${40 - (index * 2)}, 50 10, 100 ${15 + (index * 3)}`}
                                                fill="none" 
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                                className={`${config.chartColor} opacity-40 group-hover:opacity-100 transition-opacity`}
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeUp {
                    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) fill-mode: forwards;
                    opacity: 0;
                }
            `}</style>
        </>
    );
}