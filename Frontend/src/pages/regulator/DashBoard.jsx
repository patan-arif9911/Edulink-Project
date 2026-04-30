import React, { useState, useEffect } from "react";
import axios from "axios";
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
    const key = localStorage.getItem("edu_access_token");
    const [loading, setLoading] = useState(true);
    
    const [rulesData, setRulesData] = useState({
        approved: 0,
        rejected: 0,
        pending: 0,
        live: 0,
        total: 0
    });
    const [rulesChartData, setRulesChartData] = useState([]);

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
                    {/* Header */}
                    <div className="mb-8 sm:mb-12 text-center animate-fadeDown">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Rules Review Dashboard
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg">Review and flag compliance rules</p>
                    </div>

                    {/* Stats Cards Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                        {/* Total Rules Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.1s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 text-white">
                                    <FiTrendingUp size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Rules</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{rulesData.total}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Approved Rules Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.2s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-green-100 text-green-600">
                                    <FiCheck size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Approved Rules</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-green-600">{rulesData.approved}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Live Rules Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.3s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-blue-100 text-blue-600">
                                    <FiUsers size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Live Rules</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-600">{rulesData.live}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Pending Rules Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.4s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-amber-100 text-amber-600">
                                    <FiClock size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Pending Rules</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-amber-600">{rulesData.pending}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Rejected Rules Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.4s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-red-100 text-red-600">
                                    <FiAlertCircle size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Rejected</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-red-600">{rulesData.reject}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                        {/* Rules Status Chart */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Rules Status Distribution</h2>
                            <div className="w-full h-72 sm:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={rulesChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {rulesChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => value} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Rules Status Bar Chart */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Rules Status Overview</h2>
                            <div className="w-full h-72 sm:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={rulesChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="name" 
                                            angle={-45} 
                                            textAnchor="end" 
                                            height={80} 
                                            interval={0}
                                            fontSize={12}
                                        />
                                        <YAxis />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="value" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

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
