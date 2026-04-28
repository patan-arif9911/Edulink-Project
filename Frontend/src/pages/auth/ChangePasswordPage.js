import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import identityApi from "../../api/identityApi";
import { getDashboardPath } from "../../config/roles";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "./AuthPages.css";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { currentUser, setMustChangePassword } = useContext(AuthContext);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPwd !== confirmPwd) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPwd.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(newPwd) || !/[a-z]/.test(newPwd) || !/[0-9]/.test(newPwd)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    setLoading(true);
    try {
      await identityApi.changePassword({
        currentPassword: currentPwd,
        newPassword: newPwd,
        confirmPassword: confirmPwd,
      });

      setSuccess("Password updated! Redirecting to your dashboard…");
      setMustChangePassword(false);

      setTimeout(() => {
        navigate(getDashboardPath(currentUser?.role), { replace: true });
      }, 1500);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="material-icons-round auth-logo">lock_reset</span>
        <h1>Change Password</h1>
        <p>Set a new password to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} />

        <div className="form-group">
          <label>Current / Temporary Password</label>
          <input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="Minimum 8 characters"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? "Updating…" : "Set New Password"}
        </button>
      </form>
    </div>
  );
}
