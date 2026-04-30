import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentApi from "../../api/studentApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function CourseMaterialsPage() {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    studentApi
      .fetchMaterials(courseCode)
      .then((res) => setMaterials(res.data?.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, [courseCode]);

  /* Backend response fields per material:
     courseCode, teacherEmail, title, description, fileUrl, materialType, uploadedAt */
  const handleDownload = async (fileUrl, title) => {
    if (!fileUrl) {
      setError("No file available for download.");
      return;
    }
    try {
      const res = await studentApi.downloadMaterial(fileUrl);
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", title || "material");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "materialType", label: "Type" },
    { key: "teacherEmail", label: "Uploaded By" },
    {
      key: "uploadedAt",
      label: "Date",
      render: (r) => formatDateTime(r.uploadedAt),
    },
    {
      key: "download",
      label: "Action",
      render: (r) =>
        r.fileUrl ? (
          <button
            className="submit-btn"
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
            onClick={() => handleDownload(r.fileUrl, r.title)}
          >
            Download
          </button>
        ) : (
          <span style={{ color: "#999" }}>No file</span>
        ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title={`Materials — ${courseCode}`}
        subtitle="Course study materials"
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <button
        className="submit-btn"
        onClick={() => navigate("/student/courses")}
        style={{ marginBottom: "1rem" }}
      >
        ← Back to Courses
      </button>
      <GenericTable
        columns={columns}
        data={materials}
        emptyMessage="No materials available for this course."
      />
    </div>
  );
}
