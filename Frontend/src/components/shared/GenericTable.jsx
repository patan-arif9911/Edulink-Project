import React, { useState, useMemo } from "react";
import "./GenericTable.css";

export default function GenericTable({
  columns,
  data,
  emptyMessage = "No data found.",
  pageSize = 10,
  showPagination = true
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    if (!showPagination || !data || data.length === 0) {
      return data;
    }
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize, showPagination]);

  const totalPages = useMemo(() => {
    if (!showPagination || !data) return 1;
    return Math.ceil(data.length / pageSize);
  }, [data, pageSize, showPagination]);

  // Reset to page 1 when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (!data || data.length === 0) {
    return <p className="table-empty">{emptyMessage}</p>;
  }

  return (
    <div>
      <div className="table-wrapper">
        <table className="generic-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {showPagination && totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className="pagination-info">
            Page <span className="page-number">{currentPage}</span> of{" "}
            <span className="page-number">{totalPages}</span>
            <span className="record-count">
              ({(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, data.length)} of {data.length})
            </span>
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
