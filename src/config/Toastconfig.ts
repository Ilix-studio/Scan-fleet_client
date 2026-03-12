import type { ToasterProps } from "react-hot-toast";

export const toastConfig: ToasterProps = {
  position: "top-right",
  reverseOrder: false,
  gutter: 8,
  containerStyle: { top: 20, left: 20, bottom: 20, right: 20 },
  toastOptions: {
    duration: 3000,
    style: {
      background: "#fff",
      color: "#363636",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow:
        "0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)",
      fontSize: "14px",
      maxWidth: "420px",
      padding: "12px 16px",
      fontFamily: "system-ui,-apple-system,sans-serif",
    },
    success: {
      duration: 4000,
      iconTheme: { primary: "#10b981", secondary: "#fff" },
      style: {
        border: "1px solid #10b981",
        background: "#f0fdf4",
        color: "#065f46",
      },
    },
    error: {
      duration: 5000,
      iconTheme: { primary: "#ef4444", secondary: "#fff" },
      style: {
        border: "1px solid #ef4444",
        background: "#fef2f2",
        color: "#991b1b",
      },
    },
    loading: {
      duration: Infinity,
      style: {
        border: "1px solid #3b82f6",
        background: "#eff6ff",
        color: "#1e40af",
      },
    },
  },
};
