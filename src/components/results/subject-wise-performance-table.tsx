import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/card";
import type { SubjectPerformance } from "@/types/domain";

export function SubjectWisePerformanceTable({ subjects }: { subjects: SubjectPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject-Wise Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop: full table. Mobile: horizontally scrollable within the card. */}
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="pb-3 pr-4 font-medium">Subject</th>
                <th className="pb-3 pr-4 font-medium">Total</th>
                <th className="pb-3 pr-4 font-medium">Correct</th>
                <th className="pb-3 pr-4 font-medium">Wrong</th>
                <th className="pb-3 pr-4 font-medium">Skipped</th>
                <th className="pb-3 pr-4 font-medium">Accuracy</th>
                <th className="pb-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.subject} className="border-b border-border-subtle/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-text-primary">{s.subject}</td>
                  <td className="py-3 pr-4 text-text-secondary">{s.total}</td>
                  <td className="py-3 pr-4 text-success">{s.correct}</td>
                  <td className="py-3 pr-4 text-error">{s.wrong}</td>
                  <td className="py-3 pr-4 text-text-secondary">{s.skipped}</td>
                  <td className="py-3 pr-4 text-brand-cyan-light">{s.accuracy}%</td>
                  <td className="py-3 font-medium text-text-primary">{s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
