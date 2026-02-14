import React from "react";
import { AIProvider } from "../context/AIContext.jsx";
import { ToastProvider } from "../context/ToastContext.jsx";
import { Toaster } from "react-hot-toast";

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AIProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(20,20,30,.85)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.12)",
              backdropFilter: "blur(14px)",
              borderRadius: "14px",
            },
          }}
        />
      </AIProvider>
    </ToastProvider>
  );
}
