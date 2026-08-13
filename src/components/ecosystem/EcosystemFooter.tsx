import { ShieldCheck, Sparkles, RefreshCcw, Layers } from "lucide-react";

const values = [
  { icon: Layers, title: "One Ecosystem", description: "Every product designed to work together" },
  { icon: ShieldCheck, title: "Secure & Reliable", description: "Built with enterprise-grade security" },
  { icon: Sparkles, title: "AI-Powered", description: "Intelligent features across every product" },
  { icon: RefreshCcw, title: "Always Improving", description: "Continuous updates and new features" },
];

export function EcosystemFooter() {
  return (
    <footer className="border-t px-4 py-10 sm:px-6 lg:px-8" style={{ borderColor: "var(--eco-border)" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-4">
        {values.map((v) => (
          <div key={v.title} className="flex flex-col items-center gap-1.5 text-center">
            <v.icon className="h-4.5 w-4.5 text-brand-cyan-light" />
            <p className="text-xs font-medium" style={{ color: "var(--eco-text-primary)" }}>
              {v.title}
            </p>
            <p className="eco-text-secondary text-[11px]">{v.description}</p>
          </div>
        ))}
      </div>
    </footer>
  );
}
