import React, { useState, useEffect } from "react";
import axios from "axios";
import Heading from "../../components/compliance/Heading"
import { FiFlag, FiMessageSquare, FiCheck, FiAlertTriangle, FiX  } from 'react-icons/fi';
import { toast } from "react-toastify";
import { FaStamp } from "react-icons/fa";
import BgRandomIcons from "../../components/compliance/BgRandomIcons"
const BASE = process.env.REACT_APP_GATEWAY_URL;

const COLORS = {
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  primary: '#2091b9',
  secondary: '#208ab4',
  accent: '#5b98ad'
};

export default function RulesReview() {
    const key = localStorage.getItem("edu_access_token");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeRules, setActiveRules] = useState([]);
    const [flagReviews, setFlagReviews] = useState({});
    const [messageReviews, setMessageReviews] = useState({});

    async function fetchActiveRules() {
        try {
            const res = await axios.get(
                BASE + "/compliance-service/regulator/getActiveRules",
                {
                    headers: {
                        Authorization: `Bearer ${key}`
                    }
                }
            );
            if (Array.isArray(res.data)) {
                setActiveRules(res.data);
               
                const initialFlags = {};
                const initialMessages = {};
                res.data.forEach(rule => {
                    initialFlags[rule.id] = '';
                    initialMessages[rule.id] = '';
                });
                setFlagReviews(initialFlags);
                setMessageReviews(initialMessages);
            } else {
                setActiveRules([]);
            }
        } catch (e) {
            console.log("Error fetching active rules:", e);
            setActiveRules([]);
        } finally {
            setLoading(false);
        }
    }

    async function submitRuleReview(ruleId, flag, message) {
        if (!flag || !message.trim()) {
            toast.info('Please select a flag and enter a review message.');
            return;
        }

        setSubmitting(true);
        try {
            const reviewData = {
                ruleId: ruleId,
                flag: flag,
                message: message
            };

            console.log("review value",reviewData);

            await axios.post(
                BASE + "/compliance-service/regulator/markRules",
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${key}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Clear the review inputs after successful submission
            setFlagReviews(prev => ({ ...prev, [ruleId]: '' }));
            setMessageReviews(prev => ({ ...prev, [ruleId]: '' }));

            // Refresh the rules list
            await fetchActiveRules();

            toast.success('Rule review submitted successfully!');
        } catch (e) {
            console.log("Error submitting rule review:", e);
            toast.error('Failed to submit rule review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        fetchActiveRules();
    }, []);

    const getFlagIcon = (flag) => {
        switch (flag) {
            case 'green':
                return <FiCheck className="w-5 h-5 text-green-600" />;
            case 'amber':
                return <FiAlertTriangle className="w-5 h-5 text-amber-600" />;
            case 'red':
                return <FiX className="w-5 h-5 text-red-600" />;
            default:
                return null;
        }
    };

    const getFlagColor = (flag) => {
        switch (flag) {
            case 'green':
                return 'border-green-200 bg-green-50';
            case 'amber':
                return 'border-amber-200 bg-amber-50';
            case 'red':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    return (
        <div className=" min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
           
            {loading && (
                <div className="flex flex-col items-center justify-center min-h-screen gap-5">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading Rules for Review...</p>
                </div>
            )}

            {!loading && (
                <div className="relative max-w-7xl mx-auto">
                   
                   <Heading title="Rules Review Dashboard" subtitle="Review and flag compliance rules" />
                  
                    
                  <div className="relative w-[100%]">
                     <BgRandomIcons min={20} max={50} minTextSize={150} maxTextSize={300} />

                    <div className="relative w-[70vw]  bg-[#ffffffab] rounded-xl shadow-md border border-gray-100  hover:shadow-lg transition-shadow overflow-hidden">
                        
    
                        <div className="relative z-[1] mt-[50px] ml-[50px] flex items-center gap-2 mb-6">
                            <FiFlag className="text-purple-600 text-xl sm:text-2xl" />
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Active Rules Review</h2>
                        </div>

                        {activeRules.length === 0 ? (
                            <div className="text-center py-12">
                                <FiMessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Rules</h3>
                                <p className="text-gray-500">There are currently no active rules requiring review.</p>
                            </div>
                        ) : (
                            <div className="w-[100%] pl-[3%] flex flex-wrap overflow-hidden">
                                {activeRules.map((rule, index) => (
                                    <div
                                        key={rule.id || index}
                                        className={`relative w-[47%] mr-[3%] mb-[3%] rounded-lg border-2 p-6 transition-all duration-300 hover:shadow-lg ${getFlagColor(flagReviews[rule.id])} overflow-hidden`}
                                    >
                                        {
                                            rule.review?(<FaStamp className="absolute right-[5%] text-[300%]"/>):null
                                        }
                                       
                                        <div className="mb-4 relative overflow-hidden">
                                            <div className="flex items-center justify-between mb-2 overflow-hidden">
                                                <h3 className="font-semibold text-gray-900 text-lg">{rule.ruleType || 'Rule'}</h3>
                                                {flagReviews[rule.id] && getFlagIcon(flagReviews[rule.id])}
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1 overflow-hidden">
                                                <p><span className="font-medium">ID:</span> {rule.id}</p>
                                                <p><span className="font-medium">Board Officer:</span> {rule.boardOfficerId}</p>
                                                <p><span className="font-medium">Compliance Officer:</span> {rule.complianceOfferId}</p>
                                                <p><span className="font-medium">Config:</span> {rule.ruleConfig}</p>
                                                <p><span className="font-medium">Status:</span>
                                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                        rule.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        rule.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {rule.status}
                                                    </span>
                                                </p>
                                                <p><span className="font-medium">Active:</span>
                                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                        rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {rule.active ? 'Yes' : 'No'}
                                                    </span>
                                                </p>
                                                <p><span className="font-medium">Created:</span> {new Date(rule.ruleCreate).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                       
                                        <div className="space-y-4 overflow-hidden">
                                           
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Review Flag *
                                                </label>
                                                <div className="grid grid-cols-3 gap-2 overflow-hidden">
                                                    <button
                                                        onClick={() => setFlagReviews(prev => ({ ...prev, [rule.id]: 'green' }))}
                                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all overflow-hidden ${
                                                            flagReviews[rule.id] === 'green'
                                                                ? 'bg-green-600 text-white shadow-md'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                    >
                                                        <FiCheck className="w-4 h-4" />
                                                        Green
                                                    </button>
                                                    <button
                                                        onClick={() => setFlagReviews(prev => ({ ...prev, [rule.id]: 'amber' }))}
                                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all overflow-hidden ${
                                                            flagReviews[rule.id] === 'amber'
                                                                ? 'bg-amber-600 text-white shadow-md'
                                                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                        }`}
                                                    >
                                                        <FiAlertTriangle className="w-4 h-4" />
                                                        Amber
                                                    </button>
                                                    <button
                                                        onClick={() => setFlagReviews(prev => ({ ...prev, [rule.id]: 'red' }))}
                                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition- overflow-hidden ${
                                                            flagReviews[rule.id] === 'red'
                                                                ? 'bg-red-600 text-white shadow-md'
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                        Red
                                                    </button>
                                                </div>
                                            </div>

                                           
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Review Message *
                                                </label>
                                                <textarea
                                                    value={messageReviews[rule.id] || ''}
                                                    onChange={(e) => setMessageReviews(prev => ({ ...prev, [rule.id]: e.target.value }))}
                                                    placeholder="Enter your detailed review comments..."
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                                                />
                                            </div>

                                          
                                            <button
                                                onClick={() => submitRuleReview(rule.id, flagReviews[rule.id], messageReviews[rule.id])}
                                                disabled={!flagReviews[rule.id] || !messageReviews[rule.id]?.trim() || submitting}
                                                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium overflow-hidden"
                                            >
                                                {submitting ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Submitting...
                                                    </div>
                                                ) : (
                                                    'Submit Review'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    </div> 
                </div>
            )}

          
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

                .animate-fadeDown {
                    animation: fadeDown 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}
