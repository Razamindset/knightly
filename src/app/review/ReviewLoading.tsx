"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { UserData } from "@/types/api";
import UserItem from "@/components/user-item";

interface ReviewLoadingProps {
  progress: number;
  whiteUser: UserData;
  blackUser: UserData;
}

export default function ReviewLoading({
  progress,
  whiteUser,
  blackUser,
}: ReviewLoadingProps) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap md:flex-nowrap w-full gap-4">
      <div className="md:w-1/2 w-full h-full flex flex-col items-center">
        {/* Top user (Black) */}
        <div className="w-full">
          <UserItem
            username={blackUser.username}
            rating={blackUser.rating}
            flag={blackUser.flag}
            avatar={blackUser.avatar}
          />
        </div>

        <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
          <Image
            src="/board.png"
            alt="Chess board"
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom user (White) */}
        <div className="w-full">
          <UserItem
            username={whiteUser.username}
            rating={whiteUser.rating}
            flag={whiteUser.flag}
            avatar={whiteUser.avatar}
          />
        </div>
      </div>

      <div className="md:w-1/2 w-full h-screen flex items-center">
        <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-md text-white w-full h-full">
          <Loader2 className="h-12 w-12 animate-spin mb-4" />
          <h3 className="text-xl font-bold mb-2">Calculating Review{dots}</h3>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm opacity-80">
            Analyzing moves and finding improvements
          </p>
        </div>
      </div>
    </div>
  );
}
