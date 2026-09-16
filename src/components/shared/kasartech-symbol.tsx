import Image from "next/image";

/**
 * Renders the real KasarTech.ai brand symbol where an EcosystemProduct/company
 * `icon` slot expects a component accepting `className` (matching the shape of a
 * lucide-react icon component) — see src/config/ecosystem/products.ts.
 *
 * Uses the white symbol variant: the only current call site (CompanyCard) renders
 * this inside a solid KasarTech-green gradient tile (the same tile the previous
 * `Code2` Lucide icon rendered white-on-color into via `text-white`) — the default
 * green-gradient symbol is invisible against that same-color background.
 */
export function KasarTechSymbol({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo/kasartech-symbol-white.svg"
      alt="KasarTech.ai"
      width={24}
      height={22}
      className={className}
    />
  );
}
