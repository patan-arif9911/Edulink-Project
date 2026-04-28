import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getDashboardPath } from "../../config/roles";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "./AuthPages.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, authenticated, currentUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated && currentUser) {
      const dest = location.state?.returnTo || getDashboardPath(currentUser.role);
      navigate(dest, { replace: true });
    }
  }, [authenticated, currentUser, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn({ email: email.trim(), password });
      if (result.forceChange) {
        navigate("/change-password", { replace: true });
      } else {
        navigate(result.destination, { replace: true });
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="material-icons-round auth-logo">school</span>
        <h1>EduLink</h1>
        <p>School Education & Digital Learning Platform</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign In</h2>
        <p className="auth-hint">
          Use your assigned credentials. All roles sign in from this page.
        </p>

        <AlertBanner type="error" message={error} onClose={() => setError("")} />

        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            autoComplete="email"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
            required
          />
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <details className="auth-roles-info">
          <summary>Who can sign in?</summary>
          <ul>
            <li><strong>Operator</strong> — System-level user management</li>
            <li><strong>Compliance Officer</strong> — School audits & admin creation</li>
            <li><strong>Board Officer</strong> — Academic oversight & reports</li>
            <li><strong>Regulator</strong> — Accreditation & compliance</li>
            <li><strong>School Admin</strong> — Teachers, students, courses, classes</li>
            <li><strong>Teacher</strong> — Classes, materials, exams, grades, attendance</li>
            <li><strong>Student</strong> — Courses, assignments, grades, attendance</li>
          </ul>
        </details>
      </form>
    </div>
  );
}
