import { useEffect } from "react";

//datas={name,value,fill(color)}
export default function LevelCards({title,summary,datas,totalScore}){
    
    return(
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
                            <div className="p-6 sm:p-8">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{title}</h2>
                                <p className="text-gray-400 text-sm mb-6">{summary}</p>
                                <div className="space-y-3">
                                    {
                                            datas.map((data,index) => {
                                                    const pct = totalScore > 0 ? ((data.value / totalScore) * 100).toFixed(1) : 0;
                                                    return (
                                                        <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#5f585c30] transition-colors">
                                                            <span
                                                                className="min-w-[80px] text-center px-3 py-1 rounded-full text-white text-xs font-semibold"
                                                                style={{ backgroundColor: data.fill }}
                                                            >
                                                                {data.name}
                                                            </span>
                                                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                                <div
                                                                    className="h-2 rounded-full transition-all duration-700"
                                                                    style={{ width: `${pct}%`, backgroundColor: data.fill }}
                                                                />
                                                            </div>
                                                            <span className="text-gray-700 font-semibold text-sm w-8 text-right">{data.value}</span>
                                                            <span className="text-gray-400 text-xs w-10 text-right">{pct}%</span>
                                                        </div>
                                                    );
                                                })
                                    }
                                </div>
                            </div>
                        </div>
        
        
        </>
    )
}