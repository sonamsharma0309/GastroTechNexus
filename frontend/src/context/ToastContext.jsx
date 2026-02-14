import React, { createContext, useContext } from "react";
import toast from "react-hot-toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const api = {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    warn: (msg) => toast(msg, { icon: "⚠️" }),
    info: (msg) => toast(msg, { icon: "✨" }),
  };

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
