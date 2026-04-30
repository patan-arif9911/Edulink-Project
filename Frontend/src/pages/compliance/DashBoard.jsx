import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import axios from "axios";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { FiTrendingUp, FiUsers, FiCheck, FiAlertCircle, FiClock } from 'react-icons/fi';

const BASE = process.env.REACT_APP_GATEWAY_URL;

const COLORS = {
  live: '#10b981',
  accept: '#3b82f6',
  reject: '#ef4444',
  pending: '#f59e0b',
  primary: '#2091b9',
  secondary: '#208ab4',
  accent: '#5b98ad'
};

export default function DashBoard(){
    const key=localStorage.getItem("edu_access_token");
    const [loading, setLoading] = useState(true);
    const [rulesData, setRulesData] = useState({
        live: 0,
        accept: 0,
        reject: 0,
        pending: 0,
        total: 0
    });
    const [rulesChartData, setRulesChartData] = useState([]);
    const [userData, setUserData] = useState({});
    const [userChartData, setUserChartData] = useState([]);

    
    async function collectRulesData(){
        try{
            console.log("Case = ",BASE);
            const res=await axios.get(BASE+"/compliance-service/compliance/reports",
                                            {
                                                headers: {
                                                Authorization: `Bearer ${key}`
                                                }
                                            }
                                    );
            const data=res.data;
            const live=data.liveRules || 0;
            const reject=data.rejectedRules || 0;
            const accept=data.acceptedRules || 0;
            const pending=data.pendingRules || 0;
            const total = live + reject + accept + pending;
            console.log("data",data);
            console.log("pending=",pending);
            
            
            setRulesData({ live, reject, accept, pending, total });
            
            const chartData = [
                { name: 'Live', value: live, fill: COLORS.live },
                { name: 'Accept', value: accept, fill: COLORS.accept },
                { name: 'Reject', value: reject, fill: COLORS.reject },
                { name: 'Pending', value: pending, fill: COLORS.pending }
            ];

            console.log("charData=",chartData);
            setRulesChartData(chartData);
    
        }catch(e){
            console.log(e);
        }
    }

    async function collectUsersData(){
        try{
            const res=await axios.get(BASE+"/compliance-service/board/usersStatus",            
                                                                        {
                                                                            headers: {
                                                                            Authorization: `Bearer ${key}`
                                                                            }
                                                                        }
                                        )
            setUserData(res.data);

            const chartData = Object.entries(res.data).map(([key, value], index) => ({
                name: key,
                value: value,
                fill: Object.values(COLORS)[index % Object.values(COLORS).length]
            }));
            setUserChartData(chartData);

        }catch(e){
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        collectUsersData();
        collectRulesData();
    },[])


    return(
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Loading Spinner */}
            {loading && (
                <div className="flex flex-col items-center justify-center min-h-screen gap-5">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading Dashboard...</p>
                </div>
            )}

            {!loading && (
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 sm:mb-12 text-center animate-fadeDown">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            Compliance Dashboard
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg">Real-time monitoring and analytics</p>
                    </div>

                    {/* Stats Cards Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                        {/* Total Rules Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.1s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                                    <FiTrendingUp size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Rules</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{rulesData.total}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Live Rules Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.2s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-green-100 text-green-600">
                                    <FiCheck size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Live</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-green-600">{rulesData.live}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Accepted Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.3s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-blue-100 text-blue-600">
                                    <FiCheck size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Accepted</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-600">{rulesData.accept}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Rejected Card */}
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

                        {/* Pending Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.5s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-amber-100 text-amber-600">
                                    <FiClock size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Pending</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-amber-600">{rulesData.pending}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Total Users Card */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 animate-fadeUp" style={{animationDelay: '0.6s'}}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-purple-100 text-purple-600">
                                    <FiUsers size={24} className="sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-purple-600">
                                        {userChartData.reduce((sum, item) => sum + item.value, 0)}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                        {/* Rules Distribution Chart */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Rules Distribution</h2>
                            <div className="w-full h-72 sm:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={rulesChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${(name)}: ${value}`}
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

                        {/* Users Distribution Chart */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Users by Type</h2>
                            <div className="w-full h-72 sm:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={userChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" tickFormatter={(value) => value.substring(0,2)} tick={{ fontSize: 12 }} />
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

                    {/* Detailed Stats Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Rules Breakdown Table */}
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
                                            <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: COLORS.accept }}>Accepted</span></td>
                                            <td className="px-4 py-3 text-gray-900 font-medium">{rulesData.accept}</td>
                                            <td className="px-4 py-3 text-gray-600">{rulesData.total > 0 ? ((rulesData.accept / rulesData.total) * 100).toFixed(1) : 0}%</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: COLORS.reject }}>Rejected</span></td>
                                            <td className="px-4 py-3 text-gray-900 font-medium">{rulesData.reject}</td>
                                            <td className="px-4 py-3 text-gray-600">{rulesData.total > 0 ? ((rulesData.reject / rulesData.total) * 100).toFixed(1) : 0}%</td>
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

                        {/* Users Breakdown Table */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Users Summary</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">User Type</th>
                                            <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userChartData.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3"><span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: item.fill }}>{item.name}</span></td>
                                                <td className="px-4 py-3 text-gray-900 font-medium">{item.value}</td>
                                            </tr>
                                        ))}
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
    )
}