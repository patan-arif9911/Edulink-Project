import React, { useState, useEffect } from "react";
import notificationApi from "../../api/notificationApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function InboxPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    notificationApi
      .fetchInbox()
      .then((res) => {
        setNotifications(res.data?.data || res.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch notifications:", err);
        setError(parseApiError(err));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Notifications" subtitle="View your notifications" />
      <AlertBanner
        type="error"
        message={error}
        onClose={() => setError("")}
      />
      {notifications.length === 0 ? (
        <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>No notifications.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                background: n.read ? "#fff" : "#e8f0fe",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ color: "#1a1a2e" }}>{n.title || n.subject || "Notification"}</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#555", fontSize: "0.9rem" }}>
                  {n.message || n.body}
                </p>
                <span style={{ fontSize: "0.75rem", color: "#999" }}>
                  {formatDateTime(n.createdAt || n.sentAt)}
                </span>
              </div>
              {!n.read && (
                <button
                  className="submit-btn"
                  style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem" }}
                  onClick={() => handleMarkRead(n.id)}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
