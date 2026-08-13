import { CheckCircle2, XCircle, MinusCircle, Sparkles } from "lucide-react";

/**
 * A small, honest recreation of StudyCart's real result dashboard,
 * built from the same visual language as the actual components
 * (see src/components/results/summary-cards.tsx) — not a static image
 * or an AI-generated mockup. Used only for products that are genuinely
 * live in this codebase; every other product falls back to a plain
 * icon panel instead of pretending to have a screenshot.
 */
export function StudyCartLivePreview() {
  const stats = [
    { icon: Sparkles, label: "Score", value: "72.5", color: "#22d3ee" },
    { icon: CheckCircle2, label: "Correct", value: "58", color: "#22c55e" },
    { icon: XCircle, label: "Wrong", value: "22", color: "#ef4444" },
    { icon: MinusCircle, label: "Skipped", value: "20", color: "#94a3b8" },
  ];

  return (
    <div className="eco-card flex h-full flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: "var(--eco-text-primary)" }}>
          StudyCart Dashboard
        </span>
        <span className="rounded-full bg-brand-cyan/15 px-2 py-0.5 text-[10px] font-medium text-brand-cyan-light">
          Sample
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-1 rounded-lg border p-2.5"
            style={{ borderColor: "var(--eco-border)" }}
          >
            <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
            <span className="text-sm font-semibold" style={{ color: s.color }}>
              {s.value}
            </span>
            <span className="eco-text-secondary text-[10px]">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-lg border p-3" style={{ borderColor: "var(--eco-border)" }}>
        <p className="eco-text-secondary mb-2 text-[10px] font-medium uppercase tracking-wide">
          Subject-Wise Accuracy
        </p>
        <div className="flex h-16 items-end gap-2">
          {[62, 84, 47, 90, 71].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md"
              style={{ height: `${h}%`, background: "linear-gradient(180deg, #22d3ee, #2563eb)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Generic fallback panel for products without real screenshots/preview yet. */
export function GenericPreviewPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="eco-card flex h-full min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border text-center"
      style={{ borderColor: "var(--eco-border)" }}
    >
      <span className="eco-text-secondary text-xs">Preview coming soon</span>
      <span className="text-sm font-medium" style={{ color: "var(--eco-text-primary)" }}>
        {label}
      </span>
    </div>
  );
}
