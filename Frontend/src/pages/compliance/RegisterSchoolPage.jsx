import React, { useState } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import axios from "axios";
const BASE = process.env.REACT_APP_GATEWAY_URL ;

export default function RegisterSchoolPage() {
  const key=localStorage.getItem("edu_access_token");
  const [form, setForm] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    principalName: "",
    establishedDate: "",
    studentNumber: "",
    teacherNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // const res = await identityApi.createSchool(form);

      const res = await axios.post(`${BASE}/compliance-service/compliance/create-school`,form,{
                          headers:{
                            Authorization: `Bearer ${key}`
                          }
                        });
      const data = res.data?.data || res.data;
      setSuccess(data?.message || `School "${form.name}" registered successfully!`);
      setForm({
        name: "",
        address: "",
        phone: "",
        email: "",
        principalName: "",
        establishedDate: "",
        studentNumber: "",
        teacherNumber: ""
      });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="Register School" subtitle="" />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <AlertBanner type="error" message={error} onClose={() => setError("")} />
          <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                  School ID *
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  School Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  pattern="[0-9]{10}"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="principalName" className="block text-sm font-medium text-gray-700 mb-2">
                  Principal Name
                </label>
                <input
                  type="text"
                  id="principalName"
                  name="principalName"
                  value={form.principalName}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Established Date
                </label>
                <input
                  type="date"
                  id="establishedDate"
                  name="establishedDate"
                  value={form.establishedDate}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Students
                </label>
                <input
                  type="number"
                  id="studentNumber"
                  name="studentNumber"
                  value={form.studentNumber}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="teacherNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Teachers
                </label>
                <input
                  type="number"
                  id="teacherNumber"
                  name="teacherNumber"
                  value={form.teacherNumber}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering…" : "Register School"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
