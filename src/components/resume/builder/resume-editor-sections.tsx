"use client";

import type { ReactNode } from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Textarea } from "@/components/shared/ui/textarea";
import { cn } from "@/lib/utils/cn";
import type {
  ResumeCertificationEntry,
  ResumeData,
  ResumeEducationEntry,
  ResumeExperienceEntry,
  ResumeLink,
  ResumeProjectEntry,
  ResumeSkillGroup,
} from "@/lib/resume/types";

/**
 * Structured field-editor building blocks for the Resume Builder — used by
 * resume-editor-panel.tsx, the one canonical editor. Phase 5d turned this from
 * "every section's every field visible at once" (a long HTML form) into a
 * document-editor-style accordion: click a section to expand it, edit, click
 * again (or another section) to collapse it back to a compact summary line.
 * See docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5d.
 */

export function newExperienceEntry(): ResumeExperienceEntry {
  return { id: crypto.randomUUID(), company: "", role: "", bullets: [] };
}
export function newEducationEntry(): ResumeEducationEntry {
  return { id: crypto.randomUUID(), institution: "", degree: "" };
}
export function newSkillGroup(): ResumeSkillGroup {
  return { id: crypto.randomUUID(), items: [] };
}
export function newProjectEntry(): ResumeProjectEntry {
  return { id: crypto.randomUUID(), name: "", bullets: [] };
}
export function newCertificationEntry(): ResumeCertificationEntry {
  return { id: crypto.randomUUID(), name: "" };
}

function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trimEnd()}…` : trimmed;
}

export function UncertainBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <Badge variant="warning" className="px-2 py-0.5 text-[10px]">
      Please check
    </Badge>
  );
}

interface SectionShellProps {
  title: string;
  uncertain: boolean;
  description?: string;
  /** Only rendered while expanded (e.g. "+ Add") — a genuinely separate button,
   * never nested inside the toggle control itself. */
  action?: ReactNode;
  /** The full field editor, shown only while expanded. */
  children: ReactNode;
  /** A one-glance compact preview, shown only while collapsed. */
  summary: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SectionShell({ title, uncertain, description, action, children, summary, isExpanded, onToggle }: SectionShellProps) {
  return (
    <div className="border-b border-border-subtle/70 last:border-b-0">
      <div className="flex items-center justify-between gap-3 py-3.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          className="focus-ring flex flex-1 items-center gap-2 rounded-md py-0.5 text-left"
        >
          <ChevronRight className={cn("h-4 w-4 shrink-0 text-text-secondary transition-transform", isExpanded && "rotate-90")} />
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          <UncertainBadge show={uncertain} />
        </button>
        {isExpanded && action}
      </div>

      {!isExpanded && <div className="-mt-1 pb-3.5 pl-6 text-xs text-text-secondary">{summary}</div>}

      {isExpanded && (
        <div className="pb-4 pl-6">
          {description && <p className="mb-3 text-xs text-text-secondary">{description}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

export function FieldLabel({ children, uncertain }: { children: ReactNode; uncertain?: boolean }) {
  return (
    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
      {children}
      {uncertain && <span className="text-warning">•</span>}
    </label>
  );
}

export function inputClassName(uncertain?: boolean) {
  return cn(uncertain && "border-warning/50 focus-visible:border-warning");
}

export function EmptyState({ label }: { label: string }) {
  return <p className="text-xs text-text-secondary">{label}</p>;
}

export function RemoveEntryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove entry"
      className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:text-error"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

interface SectionAccordionProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function PersonalInfoSection({
  personalInfo,
  isUncertain,
  onUpdate,
  onUpdateLinks,
  isExpanded,
  onToggle,
}: {
  personalInfo: ResumeData["personalInfo"];
  isUncertain: (key: string) => boolean;
  onUpdate: (patch: Partial<ResumeData["personalInfo"]>) => void;
  onUpdateLinks: (links: ResumeLink[]) => void;
} & SectionAccordionProps) {
  function updateLink(index: number, patch: Partial<ResumeLink>) {
    onUpdateLinks(personalInfo.links.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }
  function removeLink(index: number) {
    onUpdateLinks(personalInfo.links.filter((_, i) => i !== index));
  }
  function addLink() {
    onUpdateLinks([...personalInfo.links, { label: "Website", url: "" }]);
  }

  const summaryText = [personalInfo.fullName, personalInfo.email, personalInfo.phone].filter(Boolean).join(" · ");

  return (
    <SectionShell
      title="Personal Info"
      uncertain={false}
      isExpanded={isExpanded}
      onToggle={onToggle}
      summary={summaryText || "Not added yet."}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <FieldLabel uncertain={isUncertain("personalInfo.fullName")}>Full name</FieldLabel>
          <Input
            className={inputClassName(isUncertain("personalInfo.fullName"))}
            value={personalInfo.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <FieldLabel uncertain={isUncertain("personalInfo.email")}>Email</FieldLabel>
          <Input
            className={inputClassName(isUncertain("personalInfo.email"))}
            value={personalInfo.email ?? ""}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <FieldLabel uncertain={isUncertain("personalInfo.phone")}>Phone</FieldLabel>
          <Input
            className={inputClassName(isUncertain("personalInfo.phone"))}
            value={personalInfo.phone ?? ""}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder="+91 90000 00000"
          />
        </div>
        <div>
          <FieldLabel uncertain={isUncertain("personalInfo.location")}>Location</FieldLabel>
          <Input
            className={inputClassName(isUncertain("personalInfo.location"))}
            value={personalInfo.location ?? ""}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="Bengaluru, India"
          />
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel>Links</FieldLabel>
        <div className="space-y-2">
          {personalInfo.links.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                className="w-28 shrink-0"
                value={link.label}
                onChange={(e) => updateLink(index, { label: e.target.value })}
                placeholder="LinkedIn"
              />
              <Input
                value={link.url}
                onChange={(e) => updateLink(index, { url: e.target.value })}
                placeholder="https://linkedin.com/in/…"
              />
              <button
                type="button"
                onClick={() => removeLink(index)}
                aria-label="Remove link"
                className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addLink}>
          <Plus className="h-3.5 w-3.5" />
          Add link
        </Button>
      </div>
    </SectionShell>
  );
}

export function SummarySection({
  summary,
  uncertain,
  onChange,
  isExpanded,
  onToggle,
}: {
  summary: string;
  uncertain: boolean;
  onChange: (value: string) => void;
} & SectionAccordionProps) {
  return (
    <SectionShell
      title="Summary"
      uncertain={uncertain}
      isExpanded={isExpanded}
      onToggle={onToggle}
      summary={summary.trim() ? truncate(summary, 110) : "No summary yet."}
    >
      <Textarea
        rows={4}
        placeholder="A short professional summary…"
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
    </SectionShell>
  );
}

export function AchievementsSection({
  achievements,
  uncertain,
  onChange,
  isExpanded,
  onToggle,
}: {
  achievements: string[];
  uncertain: boolean;
  onChange: (value: string[]) => void;
} & SectionAccordionProps) {
  const cleaned = achievements.map((a) => a.trim()).filter(Boolean);
  return (
    <SectionShell
      title="Achievements"
      uncertain={uncertain}
      description="One per line."
      isExpanded={isExpanded}
      onToggle={onToggle}
      summary={cleaned.length ? `${cleaned.length} achievement${cleaned.length === 1 ? "" : "s"} added.` : "No achievements yet."}
    >
      <Textarea
        rows={3}
        placeholder="e.g. Won 1st place at CodeFest 2023"
        value={achievements.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        autoFocus
      />
    </SectionShell>
  );
}

function EntrySummaryList({ lines, emptyLabel }: { lines: string[]; emptyLabel: string }) {
  if (lines.length === 0) return <>{emptyLabel}</>;
  const shown = lines.slice(0, 3);
  const remaining = lines.length - shown.length;
  return (
    <div className="space-y-0.5">
      {shown.map((line, i) => (
        <div key={i} className="truncate">
          {line}
        </div>
      ))}
      {remaining > 0 && <div>+{remaining} more</div>}
    </div>
  );
}

export function ExperienceSection({
  entries,
  uncertain,
  onChange,
  isExpanded,
  onToggle,
}: {
  entries: ResumeExperienceEntry[];
  uncertain: boolean;
  onChange: (next: ResumeExperienceEntry[]) => void;
} & SectionAccordionProps) {
  function update(id: string, patch: Partial<ResumeExperienceEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function remove(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }
  function add() {
    onChange([...entries, newExperienceEntry()]);
  }

  const summaryLines = entries.map((e) => {
    const title = [e.role, e.company].filter(Boolean).join(", ") || "Untitled role";
    const dates = e.current ? `${e.startDate ?? ""} – Present` : [e.startDate, e.endDate].filter(Boolean).join(" – ");
    return dates ? `${title} (${dates})` : title;
  });

  return (
    <SectionShell
      title="Experience"
      uncertain={uncertain}
      isExpanded={isExpanded}
      onToggle={onToggle}
      summary={<EntrySummaryList lines={summaryLines} emptyLabel="No work experience yet." />}
      action={
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      }
    >
      {entries.length === 0 && <EmptyState label="No work experience yet." />}
      <div className="space-y-5">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-border-subtle p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="grid flex-1 grid-cols-1 gap-3">
                <Input
                  value={entry.role}
                  onChange={(e) => update(entry.id, { role: e.target.value })}
                  placeholder="Role / Job title"
                />
                <Input
                  value={entry.company}
                  onChange={(e) => update(entry.id, { company: e.target.value })}
                  placeholder="Company"
                />
                <Input
                  value={entry.startDate ?? ""}
                  onChange={(e) => update(entry.id, { startDate: e.target.value })}
                  placeholder="Start date (e.g. Jan 2022)"
                />
                <Input
                  value={entry.endDate ?? ""}
                  onChange={(e) => update(entry.id, { endDate: e.target.value })}
                  placeholder="End date (e.g. Present)"
                  disabled={entry.current}
                />
                <Input
                  value={entry.location ?? ""}
                  onChange={(e) => update(entry.id, { location: e.target.value })}
                  placeholder="Location (optional)"
                />
              </div>
              <RemoveEntryButton onClick={() => remove(entry.id)} />
            </div>
            <label className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
              <input
                type="checkbox"
                checked={Boolean(entry.current)}
                onChange={(e) => update(entry.id, { current: e.target.checked, endDate: e.target.checked ? undefined : entry.endDate })}
              />
              I currently work here
            </label>
            <div className="mt-3">
              <FieldLabel>Bullet points (one per line)</FieldLabel>
              <Textarea
                rows={3}
                value={entry.bullets.join("\n")}
                onChange={(e) => update(entry.id, { bullets: e.target.value.split("\n") })}
                placeholder="Led a team of 4 engineers to ship…"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function EducationSection({
  entries,
  uncertain,
  onChange,
  isExpanded,
  onToggle,
}: {
  entries: ResumeEducationEntry[];
  uncertain: boolean;
  onChange: (next: ResumeEducationEntry[]) => void;
} & SectionAccordionProps) {
  function update(id: string, patch: Partial<ResumeEducationEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function remove(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }
  function add() {
    onChange([...entries, newEducationEntry()]);
  }

  const summaryLines = entries.map((e) => [e.institution, e.degree].filter(Boolean).join(", ") || "Untitled entry");

  return (
    <SectionShell
      title="Education"
      uncertain={uncertain}
      isExpanded={isExpanded}
      onToggle={onToggle}
      summary={<EntrySummaryList lines={summaryLines} emptyLabel="No education entries yet." />}
      action={
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      }
    >
      {entries.length === 0 && <EmptyState label="No education entries yet." />}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-border-subtle p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="grid flex-1 grid-cols-1 gap-3">
                <Input
                  value={entry.institution}
                  onChange={(e) => update(entry.id, { institution: e.target.value })}
                  placeholder="Institution"
                />
                <Input
                  value={entry.degree}
                  onChange={(e) => update(entry.id, { degree: e.target.value })}
                  placeholder="Degree (e.g. B.Tech)"
                />
                <Input
                  value={entry.field ?? ""}
                  onChange={(e) => update(entry.id, { field: e.target.value })}
                  placeholder="Field of study (optional)"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={entry.startDate ?? ""}
                    onChange={(e) => update(entry.id, { startDate: e.target.value })}
                    placeholder="Start year"
                  />
                  <Input
                    value={entry.endDate ?? ""}
                    onChange={(e) => update(entry.id, { endDate: e.target.value })}
                    placeholder="End year"
                  />
                </div>
              </div>
              <RemoveEntryButton onClick={() => remove(entry.id)} />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function SkillsSection({
  groups,
  uncertain,
  onChange,
  isExpanded,
  onToggle,
}: {
  groups: ResumeSkillGroup[];
  uncertain: boolean;
  onChange: (next: ResumeSkillGroup[]) => void;
} & SectionAccordionProps) {
  function update(id: string, patch: Partial<ResumeSkillGroup> | { itemsText: string }) {
    onChange(
      groups.map((g) => {
        if (g.id !== id) return g;
        if ("itemsText" in patch) {
          return { ...g, items: patch.itemsText.split(",").map((s) => s.trim()).filter(Boolean) };
        }
        return { ...g, ...patch };
      })
    );
  }
  function remove(id: string) {
    onChange(groups.filter((g) => g.id !== id));
  }
  function add() {
    onChange([...groups, newSkillGroup()]);
  }

  const allItems = groups.flatMap((g) => g.items);

  return (
    <SectionShell
      title="Skills"
      uncertain={uncertain}
      description="Comma-separated list per group."
      isExpanded={isExpanded}
      onToggle={onToggle}
      summary={allItems.length ? truncate(allItems.join(", "), 100) : "No skills yet."}
      action={
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3.5 w-3.5" />
          Add group
        </Button>
      }
    >
      {groups.length === 0 && <EmptyState label="No skills yet." />}
      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <Input
              className="w-full"
              value={group.category ?? ""}
              onChange={(e) => update(group.id, { category: e.target.value })}
              placeholder="Category (optional)"
            />
            <div className="flex flex-1 gap-2">
              <Input
                value={group.items.join(", ")}
                onChange={(e) => update(group.id, { itemsText: e.target.value })}
                placeholder="React, TypeScript, Node.js"
              />
              <RemoveEntryButton onClick={() => remove(group.id)} />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function ProjectsSection({
  entries,
  uncertain,
  onChange,
  isExpanded,
  onToggle,
}: {
  entries: ResumeProjectEntry[];
  uncertain: boolean;
  onChange: (next: ResumeProjectEntry[]) => void;
} & SectionAccordionProps) {
  function update(id: string, patch: Partial<ResumeProjectEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function remove(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }
  function add() {
    onChange([...entries, newProjectEntry()]);
  }

  const summaryLines = entries.map((e) => e.name || "Untitled project");

  return (
    <SectionShell
      title="Projects"
      uncertain={uncertain}
      isExpanded={isExpanded}
      onToggle={onToggle}
      summary={<EntrySummaryList lines={summaryLines} emptyLabel="No projects yet." />}
      action={
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      }
    >
      {entries.length === 0 && <EmptyState label="No projects yet." />}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-border-subtle p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-3">
                <Input
                  value={entry.name}
                  onChange={(e) => update(entry.id, { name: e.target.value })}
                  placeholder="Project name"
                />
                <Input
                  value={entry.link ?? ""}
                  onChange={(e) => update(entry.id, { link: e.target.value })}
                  placeholder="Link (optional)"
                />
                <Textarea
                  rows={2}
                  value={entry.bullets.join("\n")}
                  onChange={(e) => update(entry.id, { bullets: e.target.value.split("\n") })}
                  placeholder="What did you build? One line per point."
                />
              </div>
              <RemoveEntryButton onClick={() => remove(entry.id)} />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function CertificationsSection({
  entries,
  uncertain,
  onChange,
  isExpanded,
  onToggle,
}: {
  entries: ResumeCertificationEntry[];
  uncertain: boolean;
  onChange: (next: ResumeCertificationEntry[]) => void;
} & SectionAccordionProps) {
  function update(id: string, patch: Partial<ResumeCertificationEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function remove(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }
  function add() {
    onChange([...entries, newCertificationEntry()]);
  }

  const summaryLines = entries.map((e) => [e.name, e.issuer].filter(Boolean).join(" — ") || "Untitled certification");

  return (
    <SectionShell
      title="Certifications"
      uncertain={uncertain}
      isExpanded={isExpanded}
      onToggle={onToggle}
      summary={<EntrySummaryList lines={summaryLines} emptyLabel="No certifications yet." />}
      action={
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      }
    >
      {entries.length === 0 && <EmptyState label="No certifications yet." />}
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2">
            <Input
              value={entry.name}
              onChange={(e) => update(entry.id, { name: e.target.value })}
              placeholder="Certification name"
            />
            <Input
              className="w-full"
              value={entry.issuer ?? ""}
              onChange={(e) => update(entry.id, { issuer: e.target.value })}
              placeholder="Issuer"
            />
            <div className="flex gap-2">
              <Input
                className="w-full"
                value={entry.date ?? ""}
                onChange={(e) => update(entry.id, { date: e.target.value })}
                placeholder="Date"
              />
              <RemoveEntryButton onClick={() => remove(entry.id)} />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
