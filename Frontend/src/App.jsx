import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import MasterRoutes from "./routes/MasterRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <ToastContainer autoClose={3000} newestOnTop />
          <MasterRoutes />
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
