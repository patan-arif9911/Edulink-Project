import axios from "axios";

const GATEWAY_BASE = process.env.REACT_APP_GATEWAY_URL || "http://localhost:9090";

const httpClient = axios.create({
  baseURL: GATEWAY_BASE,
  timeout: process.env.REACT_APP_API_TIMEOUT || 20000,
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

/* ── Handle 401 → attempt token refresh, then retry ── */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh"
    ) {
      const refreshToken = localStorage.getItem("edu_refresh_token");

      if (!refreshToken) {
        localStorage.removeItem("edu_access_token");
        localStorage.removeItem("edu_refresh_token");
        localStorage.removeItem("edu_user");
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await httpClient.post("/auth/refresh", { refreshToken });
        const body = res.data?.data || res.data;
        const newAccess = body.accessToken || body.token;
        const newRefresh = body.refreshToken;

        if (newAccess) {
          localStorage.setItem("edu_access_token", newAccess);
          if (newRefresh) localStorage.setItem("edu_refresh_token", newRefresh);
          httpClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
          processQueue(null, newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return httpClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("edu_access_token");
        localStorage.removeItem("edu_refresh_token");
        localStorage.removeItem("edu_user");
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default httpClient;
