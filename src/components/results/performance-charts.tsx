"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/card";
import type { ScoreSummary, SubjectPerformance } from "@/types/domain";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  LabelList,
} from "recharts";
import type { Props as RechartsLabelProps } from "recharts/types/component/Label";

const COLORS = {
  correct: "#22c55e",
  wrong: "#ef4444",
  skipped: "#94a3b8",
  cyan: "#22d3ee",
  blue: "#2563eb",
};

const SUBJECT_PALETTE = ["#2563eb", "#06b6d4", "#22d3ee", "#818cf8", "#38bdf8", "#0ea5e9", "#6366f1"];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string; payload?: { percent?: number } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card px-3.5 py-2.5 text-xs shadow-xl">
      {label && <p className="mb-1.5 font-semibold text-text-primary">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-1.5" style={{ color: entry.color }}>
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: entry.color }} />
          {entry.name}: <span className="font-semibold">{entry.value}</span>
          {entry.payload?.percent !== undefined && (
            <span className="text-text-secondary">({entry.payload.percent}%)</span>
          )}
        </p>
      ))}
    </div>
  );
}

function PercentLabel(props: RechartsLabelProps) {
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const width = Number(props.width ?? 0);
  const { value } = props;
  if (value === undefined || value === null) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      textAnchor="middle"
      className="fill-text-primary text-[11px] font-semibold"
    >
      {value}
    </text>
  );
}

export function PerformanceCharts({
  summary,
  subjects,
}: {
  summary: ScoreSummary;
  subjects: SubjectPerformance[];
}) {
  const totalAnswered = summary.correct + summary.wrong + summary.skipped || 1;
  const breakdownData = [
    {
      name: "Correct",
      value: summary.correct,
      color: COLORS.correct,
      percent: Math.round((summary.correct / totalAnswered) * 100),
    },
    {
      name: "Wrong",
      value: summary.wrong,
      color: COLORS.wrong,
      percent: Math.round((summary.wrong / totalAnswered) * 100),
    },
    {
      name: "Skipped",
      value: summary.skipped,
      color: COLORS.skipped,
      percent: Math.round((summary.skipped / totalAnswered) * 100),
    },
  ];

  const subjectScoreData = subjects.map((s, i) => ({
    name: s.subject,
    score: s.score,
    color: SUBJECT_PALETTE[i % SUBJECT_PALETTE.length],
  }));
  const subjectAccuracyData = subjects.map((s, i) => ({
    name: s.subject,
    accuracy: s.accuracy,
    color: SUBJECT_PALETTE[i % SUBJECT_PALETTE.length],
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Correct vs Wrong vs Skipped</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={3}
                  cornerRadius={6}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                  label={({ percent }) =>
                    percent && percent > 0 ? `${Math.round(percent * 100)}%` : ""
                  }
                  labelLine={false}
                >
                  {breakdownData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={32}
                  formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject-Wise Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectScoreData} margin={{ top: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
                <Legend
                  formatter={() => <span className="text-xs text-text-secondary">Score</span>}
                />
                <Bar
                  dataKey="score"
                  name="Score"
                  radius={[8, 8, 8, 8]}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                >
                  {subjectScoreData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                  <LabelList dataKey="score" content={PercentLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Subject-Wise Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAccuracyData} margin={{ top: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} unit="%" domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
                <Legend
                  formatter={() => <span className="text-xs text-text-secondary">Accuracy %</span>}
                />
                <Bar
                  dataKey="accuracy"
                  name="Accuracy %"
                  radius={[8, 8, 8, 8]}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                >
                  {subjectAccuracyData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="accuracy"
                    content={(props: RechartsLabelProps) => {
                      const x = Number(props.x ?? 0);
                      const y = Number(props.y ?? 0);
                      const width = Number(props.width ?? 0);
                      const { value } = props;
                      if (value === undefined || value === null) return null;
                      return (
                        <text
                          x={x + width / 2}
                          y={y - 8}
                          textAnchor="middle"
                          className="fill-text-primary text-[11px] font-semibold"
                        >
                          {value}%
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
