import { Loader2 } from "lucide-react";

interface ReviewLoadingProps {
  progress: number;
}

export default function ReviewLoading({ progress }: ReviewLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-800 rounded-md text-white w-full h-full">
      <h3 className="text-xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
        Calculating Review <Loader2 className="animate-spin" />
      </h3>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <div
          className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="w-full text-right text-sm">{progress}%</span>
      </div>
      <p className="text-sm opacity-80">Analyzing moves and finding improvements</p>
    </div>
  );
}
