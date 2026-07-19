import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/card";
import type { ScoreSummary } from "@/types/domain";

export function OverallPerformanceTable({ summary }: { summary: ScoreSummary }) {
  const rows = [
    { label: "Correct", questions: summary.correct, marks: summary.positiveMarks },
    { label: "Wrong", questions: summary.wrong, marks: -summary.negativeMarks },
    { label: "Skipped", questions: summary.skipped, marks: 0 },
    { label: "Attempted", questions: summary.attempted, marks: summary.finalScore },
    { label: "Total", questions: summary.totalQuestions, marks: summary.finalScore },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="pb-3 pr-4 font-medium">Result</th>
                <th className="pb-3 pr-4 font-medium">Questions</th>
                <th className="pb-3 font-medium">Marks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border-subtle/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-text-primary">{row.label}</td>
                  <td className="py-3 pr-4 text-text-secondary">{row.questions}</td>
                  <td className="py-3 text-text-secondary">{row.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
