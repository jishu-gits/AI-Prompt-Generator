import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// This ensures your Firebase configuration is loaded, but doesn't need to be used here.
import "./firebase";

createRoot(document.getElementById("root")!).render(
  <App />
);