import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import GraphCards from "../../components/compliance/GraphCards"
import StatusCard from "../../components/compliance/StatusCard"
import LevelCards from "../../components/compliance/LevelCards"
import Heading from "../../components/compliance/Heading"
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
    //-----------initialize the variable to store data--------------
    const key=localStorage.getItem("edu_access_token");
    const [loading, setLoading] = useState(true);
    const [totalRules, setTotalRules] = useState();
    const [rulesChartData, setRulesChartData] = useState([]);
    const [userData, setUserData] = useState({});
    const [totalUser, setTotalUser] = useState();
    const [userChartData, setUserChartData] = useState([]);
    const [statusDatas,setStatusDatas]=useState();


    //-----------this function belong to collect data of rules from backend----------------
    async function collectRulesData(){
        try{

            const res=await axios.get(BASE+"/compliance-service/board/reports",
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
            setTotalRules(total);

            {
                
                    const statusData = [
                        { name: 'Total', value: total,sign:FiTrendingUp ,signColor:"text-white",signBgColor:"bg-gradient-to-br"},
                        { name: 'Live', value: live,sign:FiCheck ,signColor:"text-green-600",signBgColor:"bg-green-100"},
                        { name: 'Accept', value: accept,sign:FiCheck ,signColor:"text-blue-600",signBgColor:"bg-blue-100" },
                        { name: 'Reject', value: reject,sign:FiAlertCircle,signColor:"text-red-600",signBgColor:"bg-red-100"},
                        { name: 'Pending', value: pending,sign:FiClock,signColor:"text-amber-600",signBgColor:"bg-amber-100"},
                        { name: 'Total User', value: totalUser,sign:FiUsers,signColor:"text-amber-600",signBgColor:"bg-amber-100"}
                    ];
                    setStatusDatas(statusData);
            }

            
            const chartData = [
                { name: 'Live',    value: live,    fill: COLORS.live    },
                { name: 'Accept',  value: accept,  fill: COLORS.accept  },
                { name: 'Reject',  value: reject,  fill: COLORS.reject  },
                { name: 'Pending', value: pending, fill: COLORS.pending },
            ];

           
            setRulesChartData(chartData);
    
        }catch(e){
            console.log(e);
        }
    }

    //-----------this function belong to collect data of users from backend----------------
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
            {
                let totalUser=0;
                for(let u=0;u<chartData.length;u++){
                        totalUser+=chartData[u].value;
                }
                console.log("totallog = ",totalUser);
                setTotalUser(totalUser);
            }
                
            setUserChartData(chartData);

        }catch(e){
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

     useEffect(()=>{
            collectUsersData();
        },[])
        useEffect(()=>{
            if(totalUser){
                collectRulesData();
            }
        },[totalUser])


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
                    <Heading title="Board Officer Dashboard" subtitle="Real-time monitoring and analytics" />
                    

                    {/* Status Cards Section */}
                    <StatusCard props={statusDatas} />


                     {/* Rules and Users Cards Section */}
                    <GraphCards circleChart={rulesChartData} barChart={userChartData} titleCircle="Rules Distribution" subtitleCircle="Breakdown by rule status" titleBar="Users by Type" subtitleBar="Distribution across user roles" COLORS={COLORS} />


                    {/* Detailed Stats Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

                        {/* Users Breakdown Table */}
                        <LevelCards title="Rules Summary" summary="Status breakdown with share" datas={rulesChartData} totalScore={totalRules} />
                       

                        {/* Users Breakdown Table */}
                         <LevelCards title="Users Summary" summary="Registered users per role" datas={userChartData} totalScore={totalUser} />                 
                    </div>
                </div>
            )}

        </div>
    )
}