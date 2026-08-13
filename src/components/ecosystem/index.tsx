import "./ecosystem.css";
import { EcosystemThemeProvider } from "./EcosystemThemeProvider";
import { Hero } from "./Hero";
import { ProductGrid } from "./ProductGrid";
import { Roadmap } from "./Roadmap";
import { CTA } from "./CTA";
import { EcosystemFooter } from "./EcosystemFooter";

/**
 * The complete, portable KasarTech Ecosystem section.
 *
 * This is the only component a host app needs to import. Everything
 * else (theme, product data, cards, media) is self-contained inside
 * this folder. To reuse this in another KasarTech app: copy this
 * entire `components/ecosystem/` folder plus `config/ecosystem/`, then
 * edit `config/ecosystem/products.ts` for that app's own products.
 */
export function KasarTechEcosystem() {
  return (
    <EcosystemThemeProvider>
      <Hero />
      <ProductGrid />
      <Roadmap />
      <CTA />
      <EcosystemFooter />
    </EcosystemThemeProvider>
  );
}
