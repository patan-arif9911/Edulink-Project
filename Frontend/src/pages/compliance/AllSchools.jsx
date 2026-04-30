import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE = process.env.REACT_APP_GATEWAY_URL ;

export default function AllSchools() {
	const [schools, setSchools] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchSchools();
	}, []);

	const fetchSchools = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await axios.get(`${BASE}/compliance/identity/schools`);
			const payload = response.data;
			const schoolList = Array.isArray(payload)
				? payload
				: Array.isArray(payload?.data)
				? payload.data
				: [];
			setSchools(schoolList);
		} catch (err) {
			console.error("Failed to load school list", err);
			setError("Unable to load school data. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto">
				<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-sm text-blue-600 uppercase tracking-wide font-semibold">School Directory</p>
						<h1 className="text-3xl font-bold text-gray-900">All Registered Schools</h1>
						<p className="mt-2 text-gray-600 max-w-2xl">
							A summary of schools registered in the system with contact details, principal information, and student / teacher counts.
						</p>
					</div>
					<div>
						<button
							onClick={fetchSchools}
							className="inline-flex items-center px-5 py-2 border border-blue-600 bg-white text-blue-700 rounded-lg shadow-sm hover:bg-blue-50 transition"
							disabled={loading}
						>
							Refresh List
						</button>
					</div>
				</div>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
					</div>
				) : error ? (
					<div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-700">
						{error}
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
						{schools.map((school) => (
							<div key={school.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
								<div className="mb-5 flex items-start justify-between gap-3">
									<div>
										<p className="text-sm font-semibold text-gray-500">{school.id}</p>
										<h2 className="mt-2 text-xl font-bold text-gray-900">{school.name}</h2>
									</div>
									<span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
										{school.establishedDate ? new Date(school.establishedDate).getFullYear() : "N/A"}
									</span>
								</div>
								<div className="space-y-4">
									<div className="rounded-2xl bg-slate-50 p-4">
										<p className="text-sm text-gray-500">Address</p>
										<p className="mt-1 text-sm text-gray-800">{school.address || "Not available"}</p>
									</div>
									<div className="grid gap-3 sm:grid-cols-2">
										<div className="rounded-2xl bg-slate-50 p-4">
											<p className="text-sm text-gray-500">Principal</p>
											<p className="mt-1 text-sm text-gray-800">{school.principalName || "Not assigned"}</p>
										</div>
										<div className="rounded-2xl bg-slate-50 p-4">
											<p className="text-sm text-gray-500">Contact</p>
											<p className="mt-1 text-sm text-gray-800">{school.phone || "-"}</p>
											<p className="mt-1 text-sm text-blue-600">{school.email || "-"}</p>
										</div>
									</div>
									<div className="grid gap-3 sm:grid-cols-2">
										<div className="rounded-2xl bg-blue-50 p-4">
											<p className="text-sm font-medium text-blue-700">Students</p>
											<p className="mt-2 text-2xl font-semibold text-blue-900">{school.studentNumber ?? 0}</p>
										</div>
										<div className="rounded-2xl bg-green-50 p-4">
											<p className="text-sm font-medium text-emerald-700">Teachers</p>
											<p className="mt-2 text-2xl font-semibold text-emerald-900">{school.teacherNumber ?? 0}</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
