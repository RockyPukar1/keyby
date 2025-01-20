import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <div className="min-w-96 p-4 bg-gray-100 min-h-screen text-gray-800">
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);
