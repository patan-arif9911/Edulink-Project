import React, { useState, useEffect } from "react";
import {  toast } from "react-toastify";
import complianceApi from "../../api/complianceApi";
import { FiCheck, FiX } from 'react-icons/fi';
import axios from "axios";
const BASE = process.env.REACT_APP_GATEWAY_URL ;

export default function AuditRules({ complianceId }) {

    const key=localStorage.getItem("edu_access_token");
    const [rules, setRules] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const response = await axios.get(BASE+"/compliance-service/compliance/allRules",
                                            {
                                                headers: {
                                                Authorization: `Bearer ${key}`
                                                }
                                            }
                                    );
            const allRules = response.data;
            console.log(allRules);
            // Filter rules that are not live (active === false)
            const pendingRules = allRules.filter(rule => !rule.active);
            setRules(pendingRules);
        } catch (err) {
            setError("Failed to load rules");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (ruleId, status) => {
        try {

            console.log("id =",ruleId);
            console.log("status =",status);
            console.log("key =",key);
            const response = await axios.put(BASE+`/compliance-service/compliance/rule-validate/${ruleId}/${status}`,null,
                                            {
                                                headers: {
                                                Authorization: `Bearer ${key}`
                                                }
                                            }
                                    );
            fetchRules();
            toast.success(`Rule ${status} successfully`);
            console.log("i am");
        } catch (err) {
            toast.error("Failed to validate rule");
            
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* <div className="absolute bg-black h-[100px] w-[150px]"></div> */}
            {/* <ToastContainer autoClose={3000} newestOnTop /> */}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Audit Rules</h1>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 sm:px-8 sm:py-6 border-b border-gray-200 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Filter rules by current status</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                               
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rule Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rule Config
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rules
                                    .filter((rule) => statusFilter === 'all' || rule.status === statusFilter)
                                    .map((rule) => (
                                    <tr key={rule.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {rule.ruleType}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {rule.ruleConfig}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                rule.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                rule.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {rule.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <select
                                                value={rule.status}
                                                onChange={(e) => handleStatusChange(rule.id, e.target.value)}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approve</option>
                                                <option value="rejected">Reject</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {rules.filter((rule) => statusFilter === 'all' || rule.status === statusFilter).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No pending rules to audit
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}