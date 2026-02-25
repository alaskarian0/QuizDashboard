
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { QueryProvider } from "./lib/QueryProvider";

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <App />
  </QueryProvider>
);
