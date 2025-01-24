import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import ContentPage from "@/content/content";

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);

createRoot(root).render(
  <StrictMode>
    <Toaster />
    <ContentPage />
  </StrictMode>
);
