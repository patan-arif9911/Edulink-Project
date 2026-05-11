import React from 'react';
// import BgRandomIcons from "./BgRandomIcons"

const cardConfigs = [
    {
        // Total 
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        textColor: 'text-indigo-900',
        chartColor: 'stroke-indigo-500',
    },
    {
        // Approved 
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
        textColor: 'text-emerald-900',
        chartColor: 'stroke-emerald-500',
    },
    {
        // Live
        iconBg: 'bg-cyan-50',
        iconColor: 'text-cyan-500',
        textColor: 'text-cyan-900',
        chartColor: 'stroke-cyan-500',
    },
    {
        // Pending
        iconBg: 'bg-red-50', // Based on the design, pending was sometimes red/amber
        iconColor: 'text-red-500',
        textColor: 'text-red-900',
        chartColor: 'stroke-red-500',
    },
    {
        // Rejected
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        textColor: 'text-amber-900',
        chartColor: 'stroke-amber-500',
    },
];

export default function StatusCard({ props: datas }) {
    return (
        <>
            {/* Changed from lg:grid-cols-6 to lg:grid-cols-5 since you have 5 main metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {Array.isArray(datas) && datas.length > 0
                    ? datas.map((data, index) => {
                          const Icon = data.sign;
                          const config = cardConfigs[index % cardConfigs.length];
                          
                          // Simplify the label based on the design
                          const displayName = data.name === 'Total' ? 'Total Rules' : `${data.name} Rules`;

                          return (
                              <div
                                  key={index}
                                  className="bg-white rounded-2xl p-5 shadow-[0px_4px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 animate-fadeUp flex flex-col justify-between"
                                  style={{ animationDelay: `${index * 0.07}s` }}
                              >
                                  {/* Top Row: Icon and Title */}
                                  <div className="flex items-center gap-3 mb-5">
                                      <div className={`p-1.5 rounded-lg ${config.iconBg}`}>
                                          {Icon && <Icon size={16} className={config.iconColor} />}
                                      </div>
                                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 truncate">
                                          {displayName}
                                      </span>
                                  </div>

                                  {/* Bottom Row: Value and Decorative Sparkline */}
                                  <div className="flex items-end justify-between gap-4 mt-auto">
                                      <h3 className={`text-4xl font-extrabold tracking-tight ${config.textColor}`}>
                                          {data.value}
                                      </h3>
                                      
                                      {/* Decorative dummy chart to match the design aesthetics */}
                                      <div className="w-16 h-8 opacity-80 pointer-events-none">
                                          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                                              <path 
                                                d={`M0 ${30 - (index * 5)} Q 20 40, 40 20 T 80 10 L 100 ${0 + (index * 8)}`}
                                                fill="transparent" 
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                className={config.chartColor}
                                              />
                                          </svg>
                                      </div>
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                .animate-fadeUp {
                    animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
            `}</style>
        </>
    );
}