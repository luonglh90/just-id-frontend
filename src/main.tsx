import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 12,
          fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
          colorLink: '#2563eb',
        }
      }}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
