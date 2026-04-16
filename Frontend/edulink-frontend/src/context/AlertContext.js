import React, { createContext, useState, useMemo } from "react";

export const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null); // { type: 'success'|'error'|'info', message }

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const clearAlert = () => setAlert(null);

  const value = useMemo(() => ({ alert, showAlert, clearAlert }), [alert]);

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}
