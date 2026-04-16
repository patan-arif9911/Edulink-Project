import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import MasterRoutes from "./routes/MasterRoutes";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <MasterRoutes />
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
