import React, { useState, useEffect } from "react";
import axios from "axios";
import StatusCard from "../../components/compliance/StatusCard"
import GraphCards from "../../components/compliance/GraphCards"
import Heading from "../../components/compliance/Heading"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiUsers, FiCheck, FiAlertCircle, FiClock } from 'react-icons/fi';

const BASE = process.env.REACT_APP_GATEWAY_URL ;

const COLORS = {
  live: '#10b981',
  accept: '#3b82f6',
  reject: '#ef4444',
  pending: '#f59e0b',
  primary: '#2091b9',
  secondary: '#208ab4',
  accent: '#5b98ad'
};

export default function RegulatorDashBoard() {
    //-----------initialize the variable to store data--------------
    const key = localStorage.getItem("edu_access_token");
    const [loading, setLoading] = useState(true);
    const [rulesStatus,setRulesStatus]=useState();
    
    const [rulesData, setRulesData] = useState({
        approved: 0,
        rejected: 0,
        pending: 0,
        live: 0,
        total: 0
    });
    const [rulesChartData, setRulesChartData] = useState([]);

    //-----------this function belong to collect data of rules from backend----------------
    async function collectRulesData(){
        try{
            const res=await axios.get(BASE+"/compliance-service/regulator/getRules",
                                            {
                                                headers: {
                                                Authorization: `Bearer ${key}`
                                                }
                                            }
                                    );
            const data=res.data;
            if (Array.isArray(data)) {
                // Calculate statistics from the rules data
                const live = data.filter(rule => rule.active === true).length;
                const approved = data.filter(rule => (rule.status === 'approved' && rule.status == false) && rule.active !== true).length;
                const rejected = data.filter(rule => rule.status === 'rejected').length;
                const pending = data.filter(rule => rule.status === 'pending' ).length;
                const total = data.length;
                
                setRulesData({ approved, rejected, pending, live, total });
                
                const chartData = [
                    { name: 'Live', value: live, fill: COLORS.live },
                    { name: 'Approved', value: approved, fill: COLORS.accept },
                    { name: 'Rejected', value: rejected, fill: COLORS.reject },
                    { name: 'Pending', value: pending, fill: COLORS.pending }
                ];

                const status = [
                    { name: 'Total Rules', value: total,sign:FiTrendingUp,signColor:"text-amber-600",signBgColor:"bg-amber-100"},
                    { name: 'Approved Rules', value: approved,sign:FiCheck,signColor:"text-amber-600",signBgColor:"bg-amber-100"},
                    { name: 'Live Rules', value: live,sign:FiUsers,signColor:"text-amber-600",signBgColor:"bg-amber-100"},
                    { name: 'Pending Rules', value: pending,sign:FiClock,signColor:"text-amber-600",signBgColor:"bg-amber-100"},
                    { name: 'Rejected', value: rejected,sign:FiAlertCircle,signColor:"text-amber-600",signBgColor:"bg-amber-100"},
                ];

                setRulesStatus(status);
                setRulesChartData(chartData);
            } else {
                setRulesData({ approved: 0, rejected: 0, pending: 0, live: 0, total: 0 });
                setRulesChartData([]);
            }
        }catch(e){
            console.log("Error fetching rules:", e);
            setRulesData({ approved: 0, rejected: 0, pending: 0, live: 0, total: 0 });
            setRulesChartData([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        collectRulesData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Loading Spinner */}
            {loading && (
                <div className="flex flex-col items-center justify-center min-h-screen gap-5">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading Regulator Dashboard...</p>
                </div>
            )}

            {!loading && (
                <div className="max-w-7xl mx-auto">
                    
                    <Heading title="Rules Review Dashboard" subtitle="Review and flag compliance rules" />
                   

                    {/* Stats Cards Section */}
                                      
                    <StatusCard props={rulesStatus} />
                   

                    {/* Charts Section */}

                    <GraphCards circleChart={rulesChartData} barChart={rulesChartData} titleCircle="Rules Distribution" subtitleCircle="Breakdown by rule status" titleBar="Rules Distribution" subtitleBar="Breakdown by rule status" COLORS={COLORS} />
                    

                    {/* Rules Summary Table */}

                    <div className="mb-8 sm:mb-12">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Rules Summary</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">Status</th>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">Count</th>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: COLORS.live }}>Live</span></td>
                                            <td className="px-4 py-3 text-gray-900 font-medium">{rulesData.live}</td>
                                            <td className="px-4 py-3 text-gray-600">{rulesData.total > 0 ? ((rulesData.live / rulesData.total) * 100).toFixed(1) : 0}%</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: COLORS.accept }}>Approved</span></td>
                                            <td className="px-4 py-3 text-gray-900 font-medium">{rulesData.approved}</td>
                                            <td className="px-4 py-3 text-gray-600">{rulesData.total > 0 ? ((rulesData.approved / rulesData.total) * 100).toFixed(1) : 0}%</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: COLORS.reject }}>Rejected</span></td>
                                            <td className="px-4 py-3 text-gray-900 font-medium">{rulesData.rejected}</td>
                                            <td className="px-4 py-3 text-gray-600">{rulesData.total > 0 ? ((rulesData.rejected / rulesData.total) * 100).toFixed(1) : 0}%</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: COLORS.pending }}>Pending</span></td>
                                            <td className="px-4 py-3 text-gray-900 font-medium">{rulesData.pending}</td>
                                            <td className="px-4 py-3 text-gray-600">{rulesData.total > 0 ? ((rulesData.pending / rulesData.total) * 100).toFixed(1) : 0}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add custom animations */}
            <style>{`
                @keyframes fadeDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeDown {
                    animation: fadeDown 0.6s ease-out;
                }

                .animate-fadeUp {
                    animation: fadeUp 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}
