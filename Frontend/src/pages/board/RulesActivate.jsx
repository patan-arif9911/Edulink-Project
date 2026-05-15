import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { FaFlag } from "react-icons/fa";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import httpClient from "../../api/httpClient";
const BASE = process.env.REACT_APP_GATEWAY_URL ;
const BOARD_RULES_ENDPOINT = "/compliance-service/board/allRules";
const BOARD_RULES_DELETE = "/compliance-service/board/rule-delete";
const BOARD_RULES_REVIEW = "/compliance-service/board/rule-review";
const BOARD_GET_REVIEW_MESSAGE = "/compliance-service/board/getRegulatorReviewById/";

const filterRules = (rules, filter) => {
	switch (filter) {
		case "live":
			return rules.filter((rule) => rule.status === "approved" && rule.active === true);
		case "review":
			return rules.filter((rule) => rule.status === "approved" && rule.review === true);
		case "approved":
			return rules.filter((rule) => rule.status === "approved" && rule.active === false);
        case "pending":
			return rules.filter((rule) => rule.status === "pending" );
		case "rejected":
			return rules.filter((rule) => rule.status === "rejected");
		default:
			return rules;
	}
};

const formatDate = (value) => {
	if (!value) return "—";
	const date = new Date(value);
	return isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function RulesActivate() {
	const key=localStorage.getItem("edu_access_token");
	const reviewContainer=useRef();
	const [rules, setRules] = useState([]);
	const [filter, setFilter] = useState("approved");
	const [loading, setLoading] = useState(false);
	const [activatingRuleId, setActivatingRuleId] = useState(null);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const [reviewFlag,setReviewFlag]=useState();
	const [reviewMessage,setReviewMessage]=useState();
	const [reviewRule,setReviewRule]=useState();
	const [configRuleType,setConfigRuleType]=useState();
	const [config,setConfig]=useState();
	const [configLoad,setConfigLoad]=useState(false);

	const [render,setRender]=useState(false);

	const fetchRules = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await httpClient.get(BOARD_RULES_ENDPOINT);
			setRules(response.data || []);
		} catch (err) {
			setError("Unable to load board rules. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		reviewContainer.current.style.display = "none";
		fetchRules();
	}, [render]);

	const handleActivate = async (ruleId) => {
		setActivatingRuleId(ruleId);
		setMessage(null);
		setError(null);
		try {
			await httpClient.put(`/compliance-service/board/ruleActivate/${ruleId}/${true}`,{
				headers:{
					Authorization:`Bearer ${key}`,
					"Content-Type": "application/json"
				}
			});
			setMessage("Rule has been activated successfully.");
			fetchRules();
		} catch (err) {
			setError("Failed to activate the rule. Please try again.");
			console.error(err);
		} finally {
			setActivatingRuleId(null);
		}
	};

	const filteredRules = useMemo(() => filterRules(rules, filter), [rules, filter]);

	async function reConfig(props){
		const reviewnewRule=props;
		try{
			const res=await axios.get(BASE+BOARD_GET_REVIEW_MESSAGE+props.id,{
				headers:{
					Authorization:`Bearer ${key}`
				}
			})

		const flagColor=res.data.flag;
		if(flagColor==='green'){
			setReviewFlag("green")
			
		}else if(flagColor==='amber'){
			setReviewFlag("#FFBF00")
			
		}else{
			setReviewFlag("green")
			
		}
		
		
		setReviewMessage(res.data.message);

	
		
		setConfig(reviewnewRule.ruleConfig);
		setConfigRuleType(reviewnewRule.ruleType);
		setReviewRule(reviewnewRule);
		reviewContainer.current.style.display="block";
		}catch(e){
			console.log(e);
		}

	}
	async function reConfigHandle(){

		try{
			setConfigLoad(pre=>(true));
			const tem={...reviewRule,ruleType:configRuleType,ruleConfig:config};
			const res=await axios.post(BASE+BOARD_RULES_REVIEW,tem,{
				headers: {
					Authorization: `Bearer ${key}`,
					"Content-Type": "application/json"
				}
				
			})
			console.log("res = ",res);
			fetchRules();
			setConfigLoad(pre=>(false));
			setRender(!render);		
		}catch(e){
			console.log(e);
			
		}
		setConfigLoad(pre=>(false));
		setRender(!render);	

	}

	async function deleteHandle(props) {
		try {
			await axios.delete(BASE + BOARD_RULES_DELETE + "/" + props.id, {
				headers: {
					Authorization: `Bearer ${key}`,
					"Content-Type": "application/json"
				}
			});
			fetchRules();
		} catch (e) {
			// Error deleting rule
		}
	}

	const columns = [
		{ key: "ruleType", label: "Rule Type" },
		{ key: "boardOfficerId", label: "Board Officer" },
		{ key: "complianceOfferId", label: "Compliance Email" },
		{ key: "ruleConfig", label: "Config" },
		{
			key: "status",
			label: "Status",
			render: (row) => row.status ?? "—",
		},
		{
			key: "active",
			label: "Active",
			render: (row) => (row.active ? "Yes" : "No"),
		},
		{
			key: "ruleCreate",
			label: "Created On",
			render: (row) => formatDate(row.ruleCreate),
		},
		{
			key: "ruleActive",
			label: "Activated At",
			render: (row) => formatDate(row.ruleActive),
		},
		{
			key: "action",
			label: "Action",
			render: (row) => {
				if (row.status === "approved" && row.active === false && row.review != true) {
					return (
						<button
							onClick={() => handleActivate(row.id)}
							disabled={activatingRuleId === row.id}
							className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
						>
							{activatingRuleId === row.id ? "Activating…" : "Go Active"}
						</button>
					);
				}else if (row.active === true && filter=="live"){
					return (
							<>
								<button
									onClick={() => {deleteHandle(row)}}
									disabled={activatingRuleId === row.id}
									className="inline-flex items-center rounded-lg bg-[#F44336] px-3 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
								>
									{activatingRuleId === row.id ? "Deleting..." : "Delete"}
								</button>
							</>
						);
				}
				else if (row.review === true && filter=="review"){
					return (
							<>
								<button
									onClick={() => reConfig(row)}
									disabled={activatingRuleId === row.id}
									className="inline-flex items-center rounded-lg bg-[#FF9800] m-[2px] px-3 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
								>
									{activatingRuleId === row.id ? "reConfig..." : "reConfig"}
								</button>

								<button
									onClick={() => deleteHandle(row)}
									disabled={activatingRuleId === row.id}
									className="inline-flex items-center rounded-lg bg-[#F44336] px-3 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
								>
									{activatingRuleId === row.id ? "Deleting..." : "Delete"}
								</button>
							</>
						);
					}else{
						return (
							<>
								<button
									onClick={() => deleteHandle(row)}
									disabled={activatingRuleId === row.id}
									className="inline-flex items-center rounded-lg bg-[#F44336] px-3 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
								>
									{activatingRuleId === row.id ? "Deleting..." : "Delete"}
								</button>
							</>
						);
					}
				
			},
		},

	];

	return (
		<div className="page-content">
			<div ref={reviewContainer} className="absolute h-[80vh] w-[75vw] bg-[#000000db] rounded-[10px] overflow-scroll overflow-hidden">
				<h1 className="text-center text-white text-[50px]">Rules Review</h1>

				<div className="overflow-hidden ">
							<h2 className="text-center text-[#f6d391]">Review : {reviewMessage}</h2>
							
							<div className="w-[100%] flex justify-center items-center">
								<FaFlag style={{color:reviewFlag}} className="text-[50px]" />
							</div>
				</div>
				<div className="flex h-[70%] w-[100%]  justify-center items-center">
					<div>
						
						<div>
							<h3 className="text-white">Type :</h3>					
							<input type="text" value={configRuleType} onChange={(e)=>(setConfigRuleType(e.target.value))} className="rounded-[10px] mt-[10px] pl-[4px] text-black" />
						</div>

						<div className="mt-[10px]">
							<h3 className="text-white">Config :</h3>	
							<textarea value={config} onChange={(e)=>(setConfig(e.target.value))} className="rounded-[10px] mt-[10px] p-[4px] w-[400px] h-[100px] text-black" />
						</div>

						<div className="flex">
							<div onClick={reConfigHandle} className="m-[20px] w-[60%] h-[30px] rounded-[10px] bg-[#2397c0] flex justify-center items-center cursor-pointer">
								{configLoad?"Reconfig....":"Reconfig"}	
							</div>
							<div onClick={()=>(reviewContainer.current.style.display="none")} className="m-[20px] w-[60%] h-[30px] rounded-[10px] bg-[#f6c67e] flex justify-center items-center cursor-pointer">
								Cancel
							</div>
						</div>
					</div>
			
				</div>
				
			</div>
			<SectionHeader title="Board Rule Activation" subtitle="Review board rules and activate approved items." />

			<div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="space-x-2">
						{[
                            { key: "approved", label: "Approved" },
                            { key: "pending", label: "Pending" },
							{ key: "live", label: "Live" },	
							{ key: "review", label: "Review" },	
							{ key: "rejected", label: "Rejected" },
							{ key: "all", label: "All" },
						].map((item) => (
							<button
								key={item.key}
								type="button"
								onClick={() => setFilter(item.key)}
								className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
									filter === item.key
										? "bg-slate-900 text-white"
										: "bg-slate-100 text-slate-700 hover:bg-slate-200"
								}`}
							>
								{item.label}
							</button>
						))}
					</div>
					<div className="text-sm text-slate-500">
						Showing {filteredRules.length} of {rules.length} rules
					</div>
				</div>

				{message && (
					<div className="mt-4 rounded-2xl bg-green-50 p-3 text-sm text-green-800">
						{message}
					</div>
				)}
				{error && (
					<div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-800">
						{error}
					</div>
				)}

				<div className="mt-4">
					{loading ? (
						<p className="text-sm text-slate-600">Loading rules…</p>
					) : (
						<div className="overflow-x-auto">
							<GenericTable
								columns={columns}
								data={filteredRules}
								emptyMessage="No matching board rules found."
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
