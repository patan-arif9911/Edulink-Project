import React, { useEffect, useMemo, useState } from "react";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import httpClient from "../../api/httpClient";

const BOARD_RULES_ENDPOINT = "/compliance-service/board/allRules";


const filterRules = (rules, filter) => {
	switch (filter) {
		case "live":
			return rules.filter((rule) => rule.status === "approved" && rule.active === true);
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
	const [rules, setRules] = useState([]);
	const [filter, setFilter] = useState("live");
	const [loading, setLoading] = useState(false);
	const [activatingRuleId, setActivatingRuleId] = useState(null);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

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
		fetchRules();
	}, []);

	const handleActivate = async (ruleId) => {
		setActivatingRuleId(ruleId);
		setMessage(null);
		setError(null);
		try {
			await httpClient.put(`/compliance-service/board/ruleActivate/${ruleId}/${true}`);
			setMessage("Rule has been activated successfully.");
			await fetchRules();
		} catch (err) {
			setError("Failed to activate the rule. Please try again.");
			console.error(err);
		} finally {
			setActivatingRuleId(null);
		}
	};

	const filteredRules = useMemo(() => filterRules(rules, filter), [rules, filter]);

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
				if (row.status === "approved" && row.active === false) {
					return (
						<button
							onClick={() => handleActivate(row.id)}
							disabled={activatingRuleId === row.id}
							className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
						>
							{activatingRuleId === row.id ? "Activating…" : "Go Active"}
						</button>
					);
				}
				return "—";
			},
		},
	];

	return (
		<div className="page-content">
			<SectionHeader title="Board Rule Activation" subtitle="Review board rules and activate approved items." />

			<div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="space-x-2">
						{[
                            { key: "approved", label: "Approved" },
                            { key: "pending", label: "Pending" },
							{ key: "live", label: "Live" },	
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
