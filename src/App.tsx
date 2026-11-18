import { Route, Routes } from "react-router-dom";
import Home from "@/pages/home";
import Pricing from "@/pages/pricing";
import Stores from "@/pages/stores";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import { NotFound } from "@/pages/not-found";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/stores" element={<Stores />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
