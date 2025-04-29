import { FaChessKnight } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <FaChessKnight size={40} className="text-green-500 animate-pulse" />
    </div>
  );
}
