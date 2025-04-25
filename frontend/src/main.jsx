import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/components/ui/provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/*" element={<NotFoundPage route="/" />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
