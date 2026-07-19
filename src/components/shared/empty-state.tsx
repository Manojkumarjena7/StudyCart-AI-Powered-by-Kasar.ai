import { LucideIcon, Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-subtle bg-bg-secondary/40 px-6 py-14 text-center">
      <Icon className="h-8 w-8 text-text-secondary" />
      <p className="font-medium text-text-primary">{title}</p>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
    </div>
  );
}
