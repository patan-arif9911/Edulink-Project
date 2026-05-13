import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import identityApi from "../api/identityApi";
import {
  storeTokens,
  storeUser,
  retrieveAccessToken,
  retrieveUser,
  purgeAll,
  extractUserClaims,
  hasTokenExpired,
} from "../services/tokenService";
import { getDashboardPath } from "../config/roles";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  /* Hydrate session from localStorage on mount */
  const hydrate = useCallback(() => {
    const token = retrieveAccessToken();
    if (token && !hasTokenExpired(token)) {
      const claims = extractUserClaims(token);
      const stored = retrieveUser();
      if (claims) {
        setCurrentUser(stored || claims);
        setAuthenticated(true);
      }
    } else {
      purgeAll();
    }
    setInitializing(false);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const signIn = async ({ email, password }) => {
    const res = await identityApi.login({ email, password });
    const body = res.data;

    /* The backend returns the token inside body or body.data */
    const token = body.accessToken || body.token || body.data?.accessToken || body.data?.token;
    const refreshToken = body.refreshToken || body.data?.refreshToken;

    if (!token) {
      throw new Error("No access token received from server.");
    }

    storeTokens(token, refreshToken);

    const claims = extractUserClaims(token);

    /* Build a merged user object from claims + any extra fields the server returns */
    const serverUser = body.user || body.data?.user || body.data || {};
    const user = {
      ...claims,
      fullName: serverUser.fullName || serverUser.name || claims.fullName,
      schoolId: serverUser.schoolId,
    };

    storeUser(user);
    setCurrentUser(user);
    setAuthenticated(true);

    // Always allow login, do not force password change
    setMustChangePassword(false);
    const destination = getDashboardPath(user.role);
    return { user, forceChange: false, destination };
  };

  const signOut = () => {
    purgeAll();
    setCurrentUser(null);
    setAuthenticated(false);
    setMustChangePassword(false);
  };

  const checkRole = (role) => currentUser?.role === role;
  const checkAnyRole = (roles) => roles.includes(currentUser?.role);

  const value = useMemo(
    () => ({
      currentUser,
      initializing,
      authenticated,
      mustChangePassword,
      setMustChangePassword,
      setCurrentUser,
      signIn,
      signOut,
      checkRole,
      checkAnyRole,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, initializing, authenticated, mustChangePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
