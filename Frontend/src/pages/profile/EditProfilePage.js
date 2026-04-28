import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { storeUser } from "../../services/tokenService";
import identityApi from "../../api/identityApi";
import "./EditProfilePage.css";

export default function EditProfilePage() {
  const { currentUser: user, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await identityApi.getProfile();
        const profile = res.data?.data || res.data;
        setFullName(profile.fullName || "");
      } catch {
        setFullName(user?.fullName || "");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ type: "error", text: "Full name is required." });
      return;
    }
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await identityApi.updateProfile({ fullName: fullName.trim() });
      const updated = res.data?.data || res.data;
      // Update context + localStorage so navbar greeting reflects the change
      const newUser = { ...user, fullName: updated.fullName };
      setCurrentUser(newUser);
      storeUser(newUser);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update profile.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-profile-loading">Loading profile…</div>;
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2 className="edit-profile-title">
          <span className="material-icons-round">person</span>
          Edit Profile
        </h2>

        {message.text && (
          <div className={`edit-profile-msg edit-profile-msg--${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="edit-profile-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={user?.email || ""} disabled />
            <small>Email cannot be changed.</small>
          </div>

          <div className="edit-profile-field">
            <label htmlFor="role">Role</label>
            <input id="role" type="text" value={user?.role || ""} disabled />
          </div>

          <div className="edit-profile-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="edit-profile-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
