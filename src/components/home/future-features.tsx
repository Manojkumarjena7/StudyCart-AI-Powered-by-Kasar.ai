import {
  BookOpen,
  FileText,
  ClipboardList,
  Briefcase,
  GraduationCap,
  Printer,
} from "lucide-react";

const features = [
  {
    title: "Books",
    description: "Curated books for competitive exams.",
    icon: BookOpen,
  },
  {
    title: "PDF Notes",
    description: "Premium notes and study material.",
    icon: FileText,
  },
  {
    title: "Mock Tests",
    description: "Practice exams with AI analysis.",
    icon: ClipboardList,
  },
  {
    title: "Jobs",
    description: "Government & private job updates.",
    icon: Briefcase,
  },
  {
    title: "Courses",
    description: "Learn from industry experts.",
    icon: GraduationCap,
  },
  {
    title: "Print Hub",
    description: "Print books and study materials.",
    icon: Printer,
  },
];

export function FutureFeatures() {
  return (
  <section className="mx-auto mt-20 max-w-7xl px-6">
    <div className="text-center">
      <h2 className="text-4xl font-bold">
        🚀 The Future of StudyCart
      </h2>

      <p className="mt-4 text-lg text-muted-foreground">
        We're building India's AI-powered student ecosystem.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
            const Icon = feature.icon;

            return (
            <div
                key={feature.title}
                className="rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
                <div className="mb-4 inline-flex rounded-xl bg-brand-cyan-light/10 p-3">
                <Icon className="h-6 w-6 text-brand-cyan-light" />
                </div>

                <h3 className="text-xl font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
                </p>

                <span className="mt-4 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                Coming Soon
                </span>
            </div>
            );
        })}
        </div>

    {/* Roadmap */}
    <div className="mt-20 rounded-2xl border bg-card p-8">
      <h2 className="text-center text-3xl font-bold">
        🛣️ StudyCart Roadmap
      </h2>

      <div className="mx-auto mt-8 max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <span>🤖 AI Result Analyzer</span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            Live
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>📚 Books</span>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            Coming Soon
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>📄 PDF Notes</span>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            Coming Soon
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>📝 Mock Tests</span>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            Coming Soon
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>💼 Jobs</span>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            Coming Soon
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>🎥 Courses</span>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            Coming Soon
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>🖨️ Print Hub</span>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  </section>
);
}