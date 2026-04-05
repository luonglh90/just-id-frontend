import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ViewPage } from "./pages/ViewPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:id" element={<ViewPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
