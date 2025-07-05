import { Report } from "@/types/api";

interface ReportAccuraciesProps {
  report: Report;
}

export default function ReportAccuracies({ report }: ReportAccuraciesProps) {
  return (
    <div className="report_data w-full p-2 text-center">
      Accuracies
      <div className="grid grid-cols-2 my-1">
        <div className="text-white font-semibold">White: {report.accuracies.white.toFixed(2)}</div>
        <div className="text-black font-semibold">Black: {report.accuracies.black.toFixed(2)}</div>
      </div>
    </div>
  );
}
