import axios from "axios";

const GATEWAY_BASE = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8060";

const httpClient = axios.create({
  baseURL: GATEWAY_BASE,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

/* ── Attach JWT before every request ── */
httpClient.interceptors.request.use(
  (cfg) => {
    const jwt = localStorage.getItem("edu_access_token");
    if (jwt) {
      cfg.headers.Authorization = `Bearer ${jwt}`;
    }
    return cfg;
  },
  (err) => Promise.reject(err)
);

/* ── Handle 401 → redirect to login ── */
httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("edu_access_token");
      localStorage.removeItem("edu_refresh_token");
      localStorage.removeItem("edu_user");
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(err);
  }
);

export default httpClient;
