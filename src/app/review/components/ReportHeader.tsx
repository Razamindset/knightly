import Image from "next/image";
import { ClassificationConfig, classificationIcons } from "@/app/review/board-icons";
import { EvaluatedPosition } from "@/types/api";

interface ReportHeaderProps {
  currentMove: EvaluatedPosition | undefined;
  getSANClass: (classification: string | undefined) => string;
}

export default function ReportHeader({ currentMove, getSANClass }: ReportHeaderProps) {
  return (
    <div className="px-4 py-2 bg-gray-900 text-center text-lg font-semibold flex items-center justify-center gap-2">
      <span className={getSANClass(currentMove?.classification)}>
        {currentMove?.move.san || "Start Position"}
      </span>
      <span className="text-gray-400 text-sm ml-2">
        ({currentMove?.classification || currentMove?.opening || "Error classifying"})
      </span>
      {classificationIcons[currentMove?.classification as keyof ClassificationConfig]?.emoji && (
        <Image
          src={
            classificationIcons[currentMove?.classification as keyof ClassificationConfig]?.emoji ||
            "/placeholder.svg"
          }
          alt={currentMove?.classification || "Move"}
          className="h-6 w-6"
          loading="eager"
          width={50}
          height={50}
        />
      )}
      <br />
    </div>
  );
}
