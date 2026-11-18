import { Route, Routes } from "react-router-dom";
import Home from "@/pages/home";
import Pricing from "@/pages/pricing";
import Stores from "@/pages/stores";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import { NotFound } from "@/pages/not-found";
import NicheBriefPage from "@/pages/niche-brief";
import LookPage from "@/pages/look";
import CataloguePage from "@/pages/catalogue";
import GatePage from "@/pages/gate";
import BuildPage from "@/pages/build";
import StorefrontPreview from "@/pages/storefront-preview";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/stores" element={<Stores />} />
      <Route path="/stores/resin-miniatures/niche" element={<NicheBriefPage />} />
      <Route path="/stores/:id/look" element={<LookPage />} />
      <Route path="/stores/:id/catalogue" element={<CataloguePage />} />
      <Route path="/stores/:id/gate" element={<GatePage />} />
      <Route path="/stores/:id/build" element={<BuildPage />} />
      <Route path="/stores/:id/preview" element={<StorefrontPreview />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
