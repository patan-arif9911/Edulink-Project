const ACCESS_KEY = "edu_access_token";
const REFRESH_KEY = "edu_refresh_token";
const USER_KEY = "edu_user";

function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const segment = token.split(".")[1];
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(normalized);
    const encoded = Array.from(raw)
      .map((ch) => "%" + ch.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
    return JSON.parse(decodeURIComponent(encoded));
  } catch {
    return null;
  }
}

function hasTokenExpired(token) {
  const claims = decodeJwtPayload(token);
  if (!claims || !claims.exp) return true;
  return claims.exp * 1000 < Date.now();
}

function storeTokens(accessToken, refreshToken) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

function storeUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function retrieveAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

function retrieveRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

function retrieveUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function purgeAll() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

function extractUserClaims(token) {
  const claims = decodeJwtPayload(token);
  if (!claims) return null;
  return {
    email: claims.email || claims.sub,
    role: claims.role,
    userId: claims.userId,
    studentId: claims.studentId || claims.userId || null,
    fullName: claims.fullName || claims.name || claims.sub,
    schoolId: claims.schoolId || null,
  };
}

export {
  decodeJwtPayload,
  hasTokenExpired,
  storeTokens,
  storeUser,
  retrieveAccessToken,
  retrieveRefreshToken,
  retrieveUser,
  purgeAll,
  extractUserClaims,
};
