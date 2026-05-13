import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const FEATURES = [
  { icon: "how_to_reg",    title: "Smart Attendance",  desc: "One-tap roll call with bulk marking, keyboard shortcuts, and instant absentee alerts." },
  { icon: "assignment",    title: "Assignments",        desc: "Distribute, collect, and evaluate assignments online with submission tracking and rubric-based feedback." },
  { icon: "quiz",          title: "Exams & Grading",    desc: "Schedule exams, capture marks, and auto-compute course-wise performance for every student." },
  { icon: "cloud_upload",  title: "Course Materials",   desc: "Upload lecture notes, slides, and resources — students access them anywhere, anytime." },
  { icon: "insights",      title: "Live Analytics",     desc: "Class-level attendance trends, low-performer alerts, and exportable CSV / PDF reports." },
  { icon: "campaign",      title: "School Notifications", desc: "Send announcements to parents, students, or staff in seconds. Inbox built-in for every user." },
];

const ROLES = [
  { icon: "shield",         color: "#0ea5e9", title: "School Admin",        desc: "Onboard teachers and students, configure classes & courses, monitor school-wide attendance." },
  { icon: "co_present",     color: "#16a34a", title: "Teachers",            desc: "Mark attendance, upload material, grade exams, and track every student's progress." },
  { icon: "school",         color: "#f59e0b", title: "Students",            desc: "View enrolled courses, download materials, submit assignments, and see grades & attendance in one place." },
  { icon: "verified_user",  color: "#7c3aed", title: "Board & Regulators",  desc: "Create policies, review compliance, and audit schools with role-based dashboards." },
];

const STATS = [
  { val: "7",    label: "Distinct user roles" },
  { val: "40+",  label: "Workflow screens" },
  { val: "100%", label: "Web — no install" },
  { val: "24/7", label: "Cloud accessible" },
];

const STEPS = [
  { n: "1", title: "Sign in",          desc: "Each role gets a tailored dashboard the moment they log in.",            icon: "login" },
  { n: "2", title: "Run your day",     desc: "Mark attendance, grade work, upload material, or track your class.",     icon: "auto_awesome" },
  { n: "3", title: "Stay in the loop", desc: "Inbox notifications and live analytics keep everyone aligned.",          icon: "notifications_active" },
];

function Counter({ to, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const isNumeric = /^\d+$/.test(to);
    if (!isNumeric) return;
    const target = parseInt(to, 10);
    let raf;
    const start = performance.now();
    const dur = 1200;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{/^\d+$/.test(to) ? n : to}{suffix}</>;
}

export default function LandingPage() {
  return (
    <div className="lp">
      {/* ── Top nav ────────────────────────────────────── */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-brand">
            <span className="lp-brand-mark">
              <span className="material-icons">school</span>
            </span>
            <span className="lp-brand-text">EduLink</span>
          </Link>
          <nav className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#roles">Who it's for</a>
            <a href="#how">How it works</a>
          </nav>
          <Link to="/login" className="lp-nav-cta">
            Sign in
            <span className="material-icons">arrow_forward</span>
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-bg" aria-hidden="true">
          <div className="lp-blob lp-blob--1" />
          <div className="lp-blob lp-blob--2" />
          <div className="lp-blob lp-blob--3" />
          <div className="lp-grid-overlay" />
        </div>

        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <span className="lp-tag">
              <span className="material-icons">auto_stories</span>
              The school operations platform
            </span>
            <h1 className="lp-title">
              Run your school like a <span className="lp-title-grad">modern classroom</span>.
            </h1>
            <p className="lp-sub">
              EduLink brings attendance, assignments, exams, materials, and notifications into one
              clean workspace — built for school admins, teachers, students, and the boards that
              keep them accountable.
            </p>
            <div className="lp-hero-cta">
              <Link to="/login" className="lp-btn lp-btn--primary">
                <span className="material-icons">login</span>
                Get started
              </Link>
              <a href="#features" className="lp-btn lp-btn--ghost">
                Explore features
                <span className="material-icons">south</span>
              </a>
            </div>
            <ul className="lp-hero-checks">
              <li><span className="material-icons">check_circle</span> Role-based dashboards</li>
              <li><span className="material-icons">check_circle</span> No setup, runs in the browser</li>
              <li><span className="material-icons">check_circle</span> CSV & PDF exports built-in</li>
            </ul>
          </div>

          {/* ── Decorative classroom card ─────────────── */}
          <div className="lp-hero-art" aria-hidden="true">
            <div className="lp-card-stack">
              <div className="lp-mockcard lp-mockcard--top">
                <div className="lp-mock-head">
                  <span className="lp-mock-dot lp-mock-dot--r" />
                  <span className="lp-mock-dot lp-mock-dot--y" />
                  <span className="lp-mock-dot lp-mock-dot--g" />
                  <span className="lp-mock-title">Class 10C · Attendance</span>
                </div>
                <div className="lp-mock-body">
                  {[
                    { n: "Aarav Sharma",  s: "present" },
                    { n: "Diya Patel",    s: "present" },
                    { n: "Rohan Verma",   s: "absent"  },
                    { n: "Saanvi Iyer",   s: "present" },
                    { n: "Kabir Khanna",  s: "od"      },
                  ].map((r) => (
                    <div key={r.n} className={`lp-mock-row lp-mock-row--${r.s}`}>
                      <span className="lp-mock-avatar">{r.n.split(" ").map((p) => p[0]).join("")}</span>
                      <span className="lp-mock-name">{r.n}</span>
                      <span className={`lp-mock-pill lp-mock-pill--${r.s}`}>
                        {r.s === "present" ? "Present" : r.s === "absent" ? "Absent" : "OD"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="lp-mock-foot">
                  <span className="material-icons">trending_up</span>
                  88.9% attendance this week
                </div>
              </div>

              <div className="lp-mockcard lp-mockcard--bottom">
                <div className="lp-mock-mini">
                  <span className="material-icons" style={{ color: "#6366f1" }}>insights</span>
                  <div>
                    <p>Class average</p>
                    <strong>82.4%</strong>
                  </div>
                </div>
                <div className="lp-mock-mini">
                  <span className="material-icons" style={{ color: "#16a34a" }}>emoji_events</span>
                  <div>
                    <p>Top students</p>
                    <strong>12</strong>
                  </div>
                </div>
              </div>

              {/* Third mock card — today's schedule */}
              <div className="lp-mockcard lp-mockcard--schedule">
                <div className="lp-mock-sched-head">
                  <span className="material-icons">today</span>
                  <span>Today's Schedule</span>
                </div>
                <ul className="lp-mock-sched-list">
                  <li>
                    <span className="lp-mock-sched-time">09:00</span>
                    <span className="lp-mock-sched-course" style={{ background: "#eef2ff", color: "#6366f1" }}>Math · 10C</span>
                  </li>
                  <li>
                    <span className="lp-mock-sched-time">11:30</span>
                    <span className="lp-mock-sched-course" style={{ background: "#dcfce7", color: "#16a34a" }}>Physics · 10A</span>
                  </li>
                  <li>
                    <span className="lp-mock-sched-time">14:00</span>
                    <span className="lp-mock-sched-course" style={{ background: "#fef3c7", color: "#d97706" }}>English · 9B</span>
                  </li>
                </ul>
              </div>

              <div className="lp-float lp-float--books"><span className="material-icons">menu_book</span></div>
              <div className="lp-float lp-float--medal"><span className="material-icons">military_tech</span></div>
              <div className="lp-float lp-float--pen"><span className="material-icons">edit_note</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────── */}
      <section className="lp-stats">
        {STATS.map((s) => (
          <div key={s.label} className="lp-stat">
            <p className="lp-stat-val">
              <Counter to={s.val.replace(/[^\d]/g, "") || s.val} suffix={s.val.replace(/\d/g, "")} />
            </p>
            <p className="lp-stat-label">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section id="features" className="lp-section">
        <div className="lp-section-head">
          <span className="lp-section-eyebrow">Features</span>
          <h2>Everything a school day needs, in one place.</h2>
          <p>Replace spreadsheets, WhatsApp groups, and scattered tools with a single source of truth.</p>
        </div>
        <div className="lp-feature-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="lp-feature">
              <div className="lp-feature-icon">
                <span className="material-icons">{f.icon}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Roles ──────────────────────────────────────── */}
      <section id="roles" className="lp-section lp-section--alt">
        <div className="lp-section-head">
          <span className="lp-section-eyebrow">Built for every role</span>
          <h2>One platform, four tailored experiences.</h2>
          <p>Each user sees only what matters to them — clean, focused, and fast.</p>
        </div>
        <div className="lp-role-grid">
          {ROLES.map((r) => (
            <article key={r.title} className="lp-role" style={{ "--role": r.color }}>
              <div className="lp-role-icon"><span className="material-icons">{r.icon}</span></div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────── */}
      <section id="how" className="lp-section">
        <div className="lp-section-head">
          <span className="lp-section-eyebrow">How it works</span>
          <h2>Up and running in three steps.</h2>
        </div>
        <div className="lp-steps">
          {STEPS.map((s, i) => (
            <div key={s.n} className="lp-step">
              <div className="lp-step-num">{s.n}</div>
              <div className="lp-step-icon"><span className="material-icons">{s.icon}</span></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < STEPS.length - 1 && <div className="lp-step-arrow"><span className="material-icons">east</span></div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────── */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <span className="material-icons lp-cta-icon">rocket_launch</span>
          <h2>Ready to bring your school online?</h2>
          <p>Sign in to your role-based dashboard and get going in under a minute.</p>
          <Link to="/login" className="lp-btn lp-btn--primary lp-btn--lg">
            <span className="material-icons">login</span>
            Sign in to EduLink
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-brand">
            <span className="lp-brand-mark"><span className="material-icons">school</span></span>
            <span className="lp-brand-text">EduLink</span>
          </div>
          <p className="lp-footer-copy">
            © {new Date().getFullYear()} EduLink · School operations platform
          </p>
          <div className="lp-footer-links">
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
