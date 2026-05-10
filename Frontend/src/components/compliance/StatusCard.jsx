import BgRandomIcons from "./BgRandomIcons"

const cardConfigs = [
    {
        topBar: 'bg-gradient-to-r from-blue-600 to-indigo-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        valueColor: 'text-blue-700',
        badge: 'bg-blue-50 text-blue-600 border border-blue-200'
    },
    {
        topBar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        valueColor: 'text-emerald-700',
        badge: 'bg-emerald-50 text-emerald-600 border border-emerald-200'
    },
    {
        topBar: 'bg-gradient-to-r from-sky-500 to-cyan-500',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        valueColor: 'text-sky-700',
        badge: 'bg-sky-50 text-sky-600 border border-sky-200'
    },
    {
        topBar: 'bg-gradient-to-r from-red-500 to-rose-500',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        valueColor: 'text-red-700',
        badge: 'bg-red-50 text-red-600 border border-red-200'
    },
    {
        topBar: 'bg-gradient-to-r from-amber-500 to-orange-500',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        valueColor: 'text-amber-700',
        badge: 'bg-amber-50 text-amber-600 border border-amber-200'
    },
    {
        topBar: 'bg-gradient-to-r from-purple-500 to-violet-600',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        valueColor: 'text-purple-700',
        badge: 'bg-purple-50 text-purple-600 border border-purple-200'
    },
];

const cardLabel = (name) => {
    if (name === 'Total') return 'Total Rules';
    if (name === 'Total User') return 'Registered Users';
    return `${name} Rules`;
};


// { name: 'Total User', value: totalUser,sign:FiUsers,signColor:"text-amber-600",signBgColor:"bg-amber-100"}
export default function StatusCard({ props: datas }) {
    return (
        <>
            <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-10">
            <BgRandomIcons />
                {Array.isArray(datas) && datas.length > 0
                    ? datas.map((data, index) => {
                        const Icon = data.sign;
                        const config = cardConfigs[index % cardConfigs.length];
                        return (
                            <div
                                key={index}
                                className=" bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 overflow-hidden animate-fadeUp"
                                style={{ animationDelay: `${index * 0.07}s` }}
                            >
                                <div className={`h-1 w-full ${config.topBar}`} />
                                <div className="p-3 sm:p-4">
                                    <div className="flex items-center justify-between mb-3 ">
                                        <div className={`p-2 mr-4 rounded-lg ${config.iconBg}`}>
                                            <Icon size={14} className={config.iconColor} />
                                        </div>
                                        <span className={`text-[10px] font-semibold uppercase tracking-wide text-center p-2 rounded-full `}>
                                            {data.name}
                                        </span>
                                    </div>
                                    <h3 className={`text-2xl font-bold leading-none mb-1 ${config.valueColor}`}>
                                        {data.value}
                                    </h3>
                                    <p className="text-gray-400 text-[11px] font-medium leading-tight">
                                        {cardLabel(data.name)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                    : null}
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                .animate-fadeUp {
                    animation: fadeUp 0.45s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </>
    );
}
