"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { downloadResultReport } from "@/features/reports/reportGenerator";
import type { StudentResult } from "@/types/domain";

export function DownloadResultButton({ result }: { result: StudentResult }) {
  const [isGenerating, setIsGenerating] = useState(false);

  function handleDownload() {
    setIsGenerating(true);
    try {
      downloadResultReport(result);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Button variant="secondary" onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Download Result PDF
    </Button>
  );
}
