import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft, FiClock, FiCheckCircle } from 'react-icons/fi';

const BASE = process.env.REACT_APP_GATEWAY_URL ;

export default function CreateRules() {
	const navigate = useNavigate();
	const [ruleType, setRuleType] = useState("");
	const [ruleConfig, setRuleConfig] = useState("");
	const [status, setStatus] = useState("pending");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setMessage("");
		setLoading(true);

		const payload = {
			ruleType: ruleType.trim(),
			ruleConfig: ruleConfig.trim(),
			status: status || "pending",
			ruleCreate: new Date().toISOString()
		};

		try {
			const key = localStorage.getItem("edu_access_token");
			await axios.post(
				BASE + "/compliance-service/board/rule-create",
				payload,
				{
					headers: {
						Authorization: `Bearer ${key}`,
						"Content-Type": "application/json"
					}
				}
			);
			setMessage("Rule created successfully.");
			setRuleType("");
			setRuleConfig("");
			setStatus("pending");
			setTimeout(() => navigate("/board/dashboard"), 1200);
		} catch (submitError) {
			console.error(submitError);
			setError("Failed to create rule. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="max-w-4xl mx-auto">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Create Board Rule</h1>
						<p className="text-gray-600 mt-2">Create a rule that the education board can use for compliance review.</p>
					</div>
					<button
						type="button"
						onClick={() => navigate("/board/dashboard")}
						className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
					>
						<FiArrowLeft size={18} />
						Back to Dashboard
					</button>
				</div>

				<form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-slate-700">Rule Type</label>
							<input
								value={ruleType}
								onChange={(e) => setRuleType(e.target.value)}
								placeholder="Uniform, Holiday, Attendance..."
								className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							/>
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-slate-700">Rule Config</label>
							<input
								value={ruleConfig}
								onChange={(e) => setRuleConfig(e.target.value)}
								placeholder="min:4,max:6"
								className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							/>
						</div>
			
					</div>

					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-slate-700">Status</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							>
								<option value="pending">Pending</option>
							</select>
						</div>

					
					</div>

					<div className="space-y-4 mb-6">
						<label className="block text-sm font-medium text-slate-700">Optional Note</label>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Optional details for this rule"
							rows={4}
							className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						/>
					</div>

					{error && <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
					{message && !error && <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{message}</div>}

					<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
						<button
							type="button"
							onClick={() => navigate("/board/dashboard")}
							className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
						>
							<FiArrowLeft /> Cancel
						</button>
						<button
							type="submit"
							disabled={loading || !ruleType.trim() || !ruleConfig.trim()}
							className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
						>
							{loading ? "Saving..." : "Create Rule"}
							<FiSave />
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
