import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import "./index.css";

// Suppress extraneous browser extension runtime errors inside sandboxed iframe
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    const filename = event.filename || "";
    const msg = event.message || "";
    if (
      filename.includes("chrome-extension://") ||
      filename.includes("moz-extension://") ||
      msg.includes("chrome: call method") ||
      msg.includes("ResizeObserver loop")
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return true;
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const msg = typeof reason === "string" ? reason : reason?.message || "";
    const stack = reason?.stack || "";
    if (
      msg.includes("chrome: call method") ||
      msg.includes("chrome-extension://") ||
      stack.includes("chrome-extension://") ||
      msg.includes("ResizeObserver loop")
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
